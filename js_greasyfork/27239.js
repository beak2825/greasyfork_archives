// ==UserScript==
// @name         bilibili 直播 HTML5 播放器
// @namespace    https://www.kindjeff.com/
// @version      2017.2.24
// @description  B 站的直播的 HTML5 播放器
// @author       kindJeff
// @match        http://live.bilibili.com/*
// @match        https://live.bilibili.com/*
// @require      https://cdn.bootcss.com/hls.js/0.6.21/hls.min.js
// @require      https://cdn.rawgit.com/weizhenye/Danmaku/b2ae44f7dcd28b27c31e5db5b512b9474d0396c7/dist/danmaku.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/27239/bilibili%20%E7%9B%B4%E6%92%AD%20HTML5%20%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/27239/bilibili%20%E7%9B%B4%E6%92%AD%20HTML5%20%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

var room_id;

setTimeout(function(){
    //var xhr = new XMLHttpRequest();
    //xhr.onreadystatechange=function(){
    //    if (xhr.readyState==4 && xhr.status==200){
    //        eval(xhr.responseText);
            var link = $('#player_object').children('[name="flashvars"]').val();
            room_id = link.match(/cid=.*?&/)[0].slice(4,-1);
            get_url_and_replace_player(room_id);
            init_danmaku();
            set_danmu_control();
            click_list();
    //    }
    //};
    //xhr.open('GET', 'https://raw.githubusercontent.com/weizhenye/Danmaku/master/dist/danmaku.min.js');
    //xhr.send();
}, 2000);


function get_url_and_replace_player(room_id){
    var api_url = 'https://api.live.bilibili.com/api/playurl?platform=h5&cid=' + room_id;
    $.ajax({
        url: api_url,
        type: "GET",
        dataType: 'json',
        success: function(data){
            replace_player(data.data);

            if(window.df_danmu_ws!==undefined){
                window.i_close_it_myself = true;
                window.df_danmu_ws.close();
                window.df_danmu_ws = undefined;
            }
            var df_domain = 'broadcastlv.chat.bilibili.com';
            var df_portobj = {'ws':7170, 'wss':7172};
            window.df_danmu_ws = new DanmuSocket(parseInt(room_id), df_domain, df_portobj);
            window.df_danmu_ws.setListener(danmuListener);
        }
    });
}

function replace_player(m3u8_url){
    var w = $('#js-player-decorator').width();
    var h = $('#js-player-decorator').height();

    remove_player();

    var player = document.createElement('video');
    player.id = 'h5_player';
    player.style.width = '100%';
    player.style.height = '100%';
    player.style.position = 'absolute';
    player.setAttribute('controls', 'controls');
    document.getElementById('js-player-decorator').appendChild(player);

    if(Hls.isSupported()) {
        var video = document.getElementById('h5_player');
        var hls = new Hls();
        hls.loadSource(m3u8_url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,function() {
          video.play();
        });
    }
}

function remove_player(){
    var flash_player = document.getElementById('player_object');
    if(flash_player!==null)
        flash_player.remove();

    var html5_player = document.getElementById('h5_player');
    if(html5_player!==null)
        html5_player.remove();
}

function click_list(){
    if(window.location.pathname==='/'){
        $($('[role="list"]')[0]).children().on('click', function(){
            var room_id = $(this).attr('data-cid');
            get_url_and_replace_player(room_id);
        });
    }
}


/* danmaku */
const rawHeaderLen = 16;
const packetOffset = 0;
const headerOffset = 4;
const verOffset = 6;
const opOffset = 8;
const seqOffset = 12;
var pako = window.pako;
var textDecoder = getDecoder(true);
var textEncoder = getEncoder();
var heartbeatInterval;

function getDecoder (isUseful) {
    if(window['TextDecoder'] && isUseful) {
        return new window['TextDecoder']();
    } else {
        return {
            decode: (buf) => {
                return decodeURIComponent(window.escape(String.fromCharCode.apply(null, new Uint8Array(buf))));
            }
        }
    }
}

function getEncoder () {
    if(window['TextEncoder']) {
        return new window['TextEncoder']();
    } else {
        return {
            encode: (str) => {
                let buf = new ArrayBuffer(str.length);
                let bufView = new Uint8Array(buf);
                for (let i = 0, strlen = str.length; i < strlen; i++) {
                    bufView[i] = str.charCodeAt(i);
                }
                return bufView;
            }
        }
    }
}

function mergeArrayBuffer(ab1, ab2) {
    var u81 = new Uint8Array(ab1),
        u82 = new Uint8Array(ab2),
        res = new Uint8Array(ab1.byteLength + ab2.byteLength);
    res.set(u81, 0);
    res.set(u82, ab1.byteLength);
    return res.buffer;
}

class DanmuSocket {

    constructor (roomid,domain,portobj) {
        const ws = window.location.protocol.indexOf('https') > -1 ? 'wss' : 'ws';
        const port = portobj[ws];
        this.connection = new WebSocket(ws + "://"+ domain +":"+ port +"/sub");
        this.connection.binaryType = 'arraybuffer';
        this.connection.onopen = this.firstConnection.bind(this);
        this.connection.onmessage = onMessage.bind(this);
        this.connection.onclose = onClose.bind(this);
        this.connection.onerror = onError.bind(this);
        this.roomid = roomid
    }

    firstConnection () {
        console.log("Danmu WebSocket Server Connected.");
        console.log("Handshaking...");
        var token = JSON.stringify({
            'uid': 0,
            'roomid': this.roomid
        });
        var headerBuf = new ArrayBuffer(rawHeaderLen);
        var headerView = new DataView(headerBuf, 0);
        var bodyBuf = textEncoder.encode(token);
        headerView.setInt32(packetOffset, rawHeaderLen + bodyBuf.byteLength);
        headerView.setInt16(headerOffset, rawHeaderLen);
        headerView.setInt16(verOffset, 1);
        headerView.setInt32(opOffset, 7);
        headerView.setInt32(seqOffset, 1);
        this.connection.send(mergeArrayBuffer(headerBuf, bodyBuf));
    }

    heartBeat () {
        var headerBuf = new ArrayBuffer(rawHeaderLen);
        var headerView = new DataView(headerBuf, 0);
        headerView.setInt32(packetOffset, rawHeaderLen);
        headerView.setInt16(headerOffset, rawHeaderLen);
        headerView.setInt16(verOffset, 1);
        headerView.setInt32(opOffset, 2);
        headerView.setInt32(seqOffset, 1);
        this.connection.send(headerBuf);
    }

    closeHeartBeat () {
        clearInterval(this.heartBeating);
    }

    send (data) {
        this.connection.send(data);
    }

    close () {
        this.connection.close();
    }

    setListener (listener) {
        this._listener = listener;
    }

}

function onMessage (evt) {
    var data = evt.data;
    var dataView = new DataView(data, 0);
    var packetLen = dataView.getInt32(packetOffset);
    var headerLen = dataView.getInt16(headerOffset);
    var ver = dataView.getInt16(verOffset);
    var op = dataView.getInt32(opOffset);
    var seq = dataView.getInt32(seqOffset);

    switch(op) {
        case 8:
            this.heartBeat();
            heartbeatInterval = setInterval(this.heartBeat.bind(this), 30 * 1000);
        break;
        case 3:
            // console.log("online: " + dataView.getInt32(16));
            if (this._listener) this._listener('online', dataView.getInt32(16));
        break;
        case 5:
            var packetView = dataView;
            var msg = data;
            var msgBody;
            for (var offset=0; offset<msg.byteLength; offset+=packetLen) {
                packetLen = packetView.getInt32(offset);
                headerLen = packetView.getInt16(offset+headerOffset);
                msgBody = textDecoder.decode(msg.slice(offset+headerLen, offset+packetLen));
                if (!msgBody) {
                    textDecoder = getDecoder(false);
                    msgBody = textDecoder.decode(msg.slice(offset+headerLen, offset+packetLen));
                }
                if (this._listener) this._listener('msg', msgBody);
            }
        break;
    }
}

function onClose () {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    if(! i_close_it_myself){
        var delay = Math.floor(Math.random() * (6 - 3) + 3);
        setTimeout(this.firstConnection.bind(this), delay * 1000);
        console.log(delay);
    }
    i_close_it_myself = false;
}

function onError () {
    console.log("Client Error.");
}


/*******************/
function change_online(online) {
    $('span.v-bottom').text(online + ' 人');
}

function emit_danmu(data) {
    if(data.cmd==='DANMU_MSG'){
        var msg = data.info[1];
        window.df_danmaku.emit({
            text: msg,
            canvasStyle: {
                font: data.info[0][2]+'px sans-serif',
                textAlign: 'start',
                textBaseline: 'bottom',
                direction: 'inherit',
                fillStyle: '#fff',
                strokeStyle: '#000',
                lineWidth: 1.2,
                shadowBlur: 0,
                shadowColor: '#000',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                filter: 'none',
                globalAlpha: 1.0
            }
        })
    }else if(data.cmd==='WELCOME'){

    }else if(data.cmd==='SEND_GIFT'){

    }
}

function append_danmu(data) {
    if(data.cmd==='DANMU_MSG'){
        var u_name = data.info[2][1];
        var uid = data.info[2][0];
        var lv = data.info[4][0];
        var rank = data.info[4][3]; if(typeof(rank)=='string'&&rank.indexOf('>')!==-1) {rank.replace('>', '&gt;')}
        var msg = data.info[1];
        // console.log(u_name,uid,lv,rank,msg);
        var comment_div = '<div class="msg-item-ctnr"><div class="chat-msg " data-uname="'+u_name+'" data-uid="'+uid+'"><div class="user-level-icon lv-'+lv+'"> UL '+lv+' <div class="user-level-info"><p>用户等级：'+lv+'</p><p><a href="http://live.bilibili.com/rank" target="_blank">排名：'+rank+'</a></p></div></div><span class="user-name color">'+u_name+' : </span><span class="msg-content">'+msg+'</span></div></div>';
        $(comment_div).appendTo('#chat-msg-list');
        if($('#chat-msg-list').children().length>100)
            $('#chat-msg-list').children(':first').remove();
        $("#chat-msg-list").scrollTop($("#chat-msg-list")[0].scrollHeight);
    }
}

function danmuListener(content_type, content){
    if(content_type==='online'){
        if(window.dom_changed===undefined){
            $('#h5_player').prev().appendTo('#js-player-decorator');
            window.dom_changed = true;
        }
        change_online(content);
    }else if(content_type==='msg'){
        var content_obj = JSON.parse(content);
        emit_danmu(content_obj);
        append_danmu(content_obj);
    }
}

function init_danmaku() {
    window.df_danmaku = new Danmaku();
    df_danmaku.init({
        container: $('#js-player-decorator')[0],
        video: $("#h5_player")[0],
        engine:'canvas'
    });
    $('canvas')[0].style.position = 'absolute';

    // send danmu
    function send_danmu(){
        var msg = $("#df-danmu-textbox").val();
        var xhr = new XMLHttpRequest();
        // xhr.setRequestHeader('X-Cookie', document.cookie);
        xhr.open('POST', 'http://live.bilibili.com/msg/send');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send($.param({
            color: 16777215,
            fontsize: 25,
            mode: 1,
            msg: msg,
            rnd: Math.floor(Date.now() / 1000),
            roomid: room_id
        }));
    }
    $("#danmu-textbox").off('keypress');
    $("#danmu-textbox").off('keyup');
    $("#danmu-textbox").off('keydown');
    $("#danmu-send-btn").off('click');

    $("#danmu-textbox")[0].id = 'df-danmu-textbox';
    $("#danmu-send-btn")[0].id = 'df-danmu-send-btn';
    $("#df-danmu-textbox").on('keyup', function (e) {
        if(e.keyCode == 13){
            send_danmu();
            $("#df-danmu-textbox").val('');
            e.preventDefault();
            return false;
        }
        return true;
    });
    $("#df-danmu-send-btn").on('click', function (e) {
        e.preventDefault();
        send_danmu();
        $("#df-danmu-textbox").val('');
    });
}

function set_danmu_control(){
    if(location.pathname==='/'){
        return;
    }

    var control_btn = $("<button>关闭弹幕</button>");
    control_btn.css('border-radius', '5px');
    control_btn.css('font-size', '12px');
    control_btn.height('21px');
    $('.room-info.tag-ctnr.v-top').children().remove();
    control_btn.appendTo('.room-info.tag-ctnr.v-top');
    control_btn.on('click', function () {
        if(control_btn.text()=='打开弹幕'){
            control_btn.text('关闭弹幕');
            $('canvas')[0].style.display = 'block';
        }else{
            $('canvas')[0].style.display = 'none';
            control_btn.text('打开弹幕');
        }
    });
}