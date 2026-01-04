// ==UserScript==
// @name      bilibili vtb直播同传man字幕显示
// @version   202210431
// @description ！！！
// @author    siro
// @match     http://live.bilibili.com/*
// @match     https://live.bilibili.com/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.10/pako.min.js
// @namespace http://www.xiaosiro.cn
// @grant     unsafeWindow
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/400941/bilibili%20vtb%E7%9B%B4%E6%92%AD%E5%90%8C%E4%BC%A0man%E5%AD%97%E5%B9%95%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/400941/bilibili%20vtb%E7%9B%B4%E6%92%AD%E5%90%8C%E4%BC%A0man%E5%AD%97%E5%B9%95%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

//脚本多次加载这可能是因为目标页面正在加载帧或iframe。
//
//将这下行添加到脚本代码部分的顶部：
if (window.top != window.self)  //-- Don't run on frames or iframes
    return;

var room_id=22129083;//默认房间号
var uid=0;
var url;
var mytoken;
var port;
var rawHeaderLen = 16;
var packetOffset = 0;
var headerOffset = 4;
var verOffset = 6;
var opOffset = 8;
var seqOffset = 12;
var socket;
var utf8decoder = new TextDecoder();
var f=0; //不知道为什么会建立两次连接，用这个标记一下。
var zimuBottom=40;//修改此数值改变字幕距底部的高度
var zimuColor="#FFFFFF";//修改此处改变字幕颜色
var zimuFontSize=25;//修改此处改变字体大小
var zimuShadow=1;//启动弹幕阴影
var zimuShadowColor="#66CCFF"// 弹幕阴影颜色
var deltime=3000;//字幕存在时间
var IsSikiName=0;// 1为启动同传man过滤 0为不启动，默认不启动
//如果要启动同传man过滤，启动后需要修改SikiName里括号里的内容
//如SikiName=["斋藤飞鳥Offcial","小明1","小明2"],则只会显示名字为，斋藤飞鳥Offcial，小明1，小明2的同传
//此变量为字符串数字，元素为字符串变量，元素内容由 , 分隔(不是中文下的 ，)
var SikiName=["白峰さやか"];
var isSpecialRoom=false;
var isTop=false;// 默认生成在底部；
if(!document.getElementById("live-player-ctnr")){
    console.log('特殊主题直播间，20s后执行脚本');
    isSpecialRoom=true;
    zimuBottom=zimuBottom+150;
    setTimeout(()=>myCode(), 20000);
}else{
   myCode();
}

function myCode(){
    console.log("开始执行脚本");
    // 创建页面字幕元素
    var danmudiv=$('<div></div>');
    danmudiv.attr('id','danmu');
    var danmudivwidth;
    if($("#live-player-ctnr")){
        danmudivwidth=$("#live-player-ctnr").width();
    }else{
        danmudivwidth="900px";
    }
    console.log(danmudivwidth);
    danmudiv.css({
        "min-width":"100px",
        "width":"100%",
        "magin":"0 auto",
        "position":"absolute",
        "left":"0px",
        "bottom":zimuBottom+"px",
        "z-index":"14",
        "color":zimuColor,
        "font-size": zimuFontSize+"px",
        "text-align":"center",
        "font-weight": "bold",
        "pointer-events":"none",
        "text-shadow":"0 0 0.2em #F87, 0 0 0.2em #F87",
    });

    if(isTop){
        danmudiv.css("bottom","");
        danmudiv.css("top",zimuBottom+"px");
    }

    if(!document.getElementById("live-player-ctnr")){
        console.log('主页面无此元素,尝试注入父div...');//player-ctnr

        //$("iframe:eq(1)").attr('id','danmulive')
        console.log();
        danmudiv.appendTo($("#player-ctnr"));
    }else{
        danmudiv.appendTo($("#live-player-ctnr"));
    }


    // 创建控制面板
    var danmuControldiv=$('<div>字幕设置</div>');
    danmuControldiv.attr('id','danmuControldiv');
    danmuControldiv.css({
        "height": "60px",
        "top": "100px",
        "left": "0",
        "width": "16px",
        "z-index": "999998",
        "display": "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center",
        "position": "fixed",
        "transform": "translateY(-50%)",
        "background":"#FFF",
        "border-radius": "2px",
    });
    danmuControldiv.appendTo($("body"));
    var danmuControlBody=$(`<div id="danmuControlBody" style="flex-direction:column;position: fixed;top: 100px;left: 0;width: 16px;z-index: 999999;display: none;padding: 5px;border-radius: 5px;border: 1px solid #0AADFF;width: 300px;background-color: #FFF;">
        <label>字体大小:</label><input type="number">px<br>
        <label>字幕颜色:</label><input type="color"><br>
        <label>字幕高度:</label><input type="number">px<br>
        <label>字幕阴影:</label><input type="checkbox"><br>
        <label>字幕阴影颜色:</label><input type="color"><br>
        <label>字幕显示在顶部:</label><input type="checkbox"><br>
        <div style="margin:0 auto;width: 120px;margin-top: 5px;">
            <input id="danmuControlOK" type="button" value="确定">&nbsp;&nbsp;&nbsp;&nbsp;<input id="danmuControlOld" type="button" value="默认">
        </div>
        <div id="closeDiv" style="background-color: red;color: seashell;position: absolute;top: 3px;right: 3px;width: 15px;height: 15px;line-height: 15px;text-align: center;cursor: pointer;">x</div>
    </div>`);
    function upDanmudiv(){
        danmudiv.css({
            "bottom":zimuBottom+"px",
            "color":zimuColor,
            "font-size": zimuFontSize+"px",
            "z-index": "999999",
        });
        if(zimuShadow==1){
            danmudiv.css({
                "text-shadow":"0 0 0.2em "+zimuShadowColor+", 0 0 0.2em "+zimuShadowColor,
            });
        }else{
            danmudiv.css({
                "text-shadow":"0 0 0",
            });
        }

        if(isTop){
            danmudiv.css("bottom","");
            danmudiv.css("top",zimuBottom+"px");
        }else{
            danmudiv.css("bottom",zimuBottom+"px");
        }
    }
    function bindDanmuDate(){
        var inputs=$("#danmuControlBody").children("input");
        inputs[0].value=zimuFontSize;
        inputs[1].value=zimuColor;
        if(isSpecialRoom){
            inputs[2].value=zimuBottom-150;
        }else{
            inputs[2].value=zimuBottom;
        }
        inputs[3].checked=(zimuShadow==0?false:true);
        inputs[4].value=zimuShadowColor;
        inputs[5].value= (isTop==0?false:true);
    }
    function saveDanmuDate(){
        var inputs=$("#danmuControlBody").children("input");
        zimuFontSize=inputs[0].value;
        zimuColor=inputs[1].value;
        if(isSpecialRoom){
            zimuBottom=inputs[2].value;
            zimuBottom+=150;
        }else{
            zimuBottom=inputs[2].value;
        }
        zimuShadow=(inputs[3].checked?1:0);
        zimuShadowColor=inputs[4].value;
        isTop=(inputs[5].checked?1:0);
        upDanmudiv();
    }
    danmuControlBody.appendTo($("body"));
    $("#danmuControldiv").on('click', function () {
        $("#danmuControlBody").css("display","flex");
        bindDanmuDate();
    }
    );
    $("#closeDiv").on('click', function () {
        $("#danmuControlBody").css("display","none");
    }
    );
    $("#danmuControlOK").on('click', function () {
        saveDanmuDate();
    }
    );
    $("#danmuControlOld").on('click', function () {
        zimuBottom=40;//修改此数值改变字幕距底部的高度
        zimuColor="#FF0000";//修改此处改变字幕颜色
        zimuFontSize=25;//修改此处改变字体大小
        zimuShadow=1;//启动弹幕阴影
        zimuShadowColor="#000F87"// 弹幕阴影颜色
        upDanmudiv();
    }
    );

    //获取当前房间编号
    var UR = document.location.toString();
    var arrUrl = UR.split("//");
    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start+1);//stop省略，截取从start开始到结尾的所有字符
    if(relUrl.indexOf("?") != -1){
        relUrl = relUrl.split("?")[0];
    }
    room_id=parseInt(relUrl);

    //获取你的uid
    $.ajax({
        url: 'https://api.live.bilibili.com/xlive/web-ucenter/user/get_user_info',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            //console.log(data.data);
            uid=data.data.uid;
            //console.log(uid);
        },
        xhrFields: {
        withCredentials: true // 这里设置了withCredentials
        },
    });
    //获取真实房间号
    $.ajax({
        url: '//api.live.bilibili.com/room/v1/Room/room_init?id=' + room_id,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            room_id=data.data.room_id;

        }
    });
    //获取弹幕连接和token
    $.ajax({
        url: '//api.live.bilibili.com/room/v1/Danmu/getConf?room_id='+room_id+'&platform=pc&player=web',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            url = data.data.host_server_list[1].host;
            port = data.data.host_server_list[1].wss_port;
            mytoken = data.data.token;
            DanmuSocket();
        },
        xhrFields: {withCredentials: true}
    })
    // 蜜汁字符转换
    function txtEncoder(str){
        var buf = new ArrayBuffer(str.length);
        var bufView = new Uint8Array(buf);
        for (var i = 0, strlen = str.length; i < strlen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return bufView;
    }
    // 合并
    function mergeArrayBuffer(ab1, ab2) {
        var u81 = new Uint8Array(ab1),
            u82 = new Uint8Array(ab2),
            res = new Uint8Array(ab1.byteLength + ab2.byteLength);
        res.set(u81, 0);
        res.set(u82, ab1.byteLength);
        return res.buffer;
    }

    //发送心跳包
    function heartBeat() {
        var headerBuf = new ArrayBuffer(rawHeaderLen);
        var headerView = new DataView(headerBuf, 0);
        var ob="[object Object]";
        var bodyBuf = txtEncoder(ob);
        headerView.setInt32(packetOffset, rawHeaderLen + bodyBuf.byteLength);
        headerView.setInt16(headerOffset, rawHeaderLen);
        headerView.setInt16(verOffset, 1);
        headerView.setInt32(opOffset, 2);
        headerView.setInt32(seqOffset, 1);
        //console.log('发送信条');
        socket.send(mergeArrayBuffer(headerBuf, bodyBuf));
    };
    // 导入css

    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode(`#danmu .message {
        transition: height 0.2s ease-in-out, margin 0.2s ease-in-out;
    }

    #danmu .message .text {
        text-align:center;
        font-weight: bold;
        pointer-events:none;
    }

    @keyframes message-move-in {
        0% {
            opacity: 0;
            transform: translateY(100%);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    #danmu .message.move-in {
        animation: message-move-in 0.3s ease-in-out;
    }


    @keyframes message-move-out {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-100%);
        }
    }
    #danmu .message.move-out {
        animation: message-move-out 0.3s ease-in-out;
        animation-fill-mode: forwards;
    }`
    );
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);

    // 消息渲染器
    class Message {
        //构造函数
        constructor() {
            const containerId = 'danmu';
            this.containerEl = document.getElementById(containerId);
        }

        show({text = '' ,duration = 2000}) {
            // 创建一个Element对象
            let messageEl = document.createElement('div');
            // 设置消息class，这里加上move-in可以直接看到弹出效果
            messageEl.className = 'message move-in';
            // 消息内部html字符串
            messageEl.innerHTML = `
                <div class="text">${text}</div>
            `;
            // 追加到message-container末尾
            // this.containerEl属性是我们在构造函数中创建的message-container容器
            this.containerEl.appendChild(messageEl);

            // 用setTimeout来做一个定时器
            setTimeout(() => {
                // 首先把move-in这个弹出动画类给移除掉，要不然会有问题，可以自己测试下
                messageEl.className = messageEl.className.replace('move-in', '');
                // 增加一个move-out类
                messageEl.className += 'move-out';

                // move-out动画结束后把元素的高度和边距都设置为0
                // 由于我们在css中设置了transition属性，所以会有一个过渡动画
                messageEl.addEventListener('animationend', () => {
                    messageEl.setAttribute('style', 'height: 0; margin: 0');
                });

                // 这个地方是监听动画结束事件，在动画结束后把消息从dom树中移除。
                // 如果你是在增加move-out后直接调用messageEl.remove，那么你不会看到任何动画效果
                //messageEl.addEventListener('transitionend', () => {
                //    // Element对象内部有一个remove方法，调用之后可以将该元素从dom树种移除！
                //    messageEl.remove();
                //});
                // 以上方法似乎无效，所以用一个定时器来完成
                setTimeout(() => {
                     messageEl.remove();
                }, duration+10000);
            }, duration);
        }

    }

    const message = new Message();


    //数据包解析 感谢https://github.com/lovelyyoshino/Bilibili-Live-API/blob/master/API.WebSocket.md
    const textEncoder = new TextEncoder('utf-8');
    const textDecoder = new TextDecoder('utf-8');

    const readInt = function(buffer,start,len){
    let result = 0
    for(let i=len - 1;i >= 0;i--){
        result += Math.pow(256,len - i - 1) * buffer[start + i]
    }
    return result
    }

    const writeInt = function(buffer,start,len,value){
    let i=0
    while(i<len){
        buffer[start + i] = value/Math.pow(256,len - i - 1)
        i++
    }
    }

    function encode(str,op){
    let data = textEncoder.encode(str);
    let packetLen = 16 + data.byteLength;
    let header = [0,0,0,0,0,16,0,1,0,0,0,op,0,0,0,1]
    writeInt(header,0,4,packetLen)
    return (new Uint8Array(header.concat(...data))).buffer
    }
    function decode(blob) {
    let buffer = new Uint8Array(blob)
    let result = {}
    result.packetLen = readInt(buffer, 0, 4)
    result.headerLen = readInt(buffer, 4, 2)
    result.ver = readInt(buffer, 6, 2)
    result.op = readInt(buffer, 8, 4)
    result.seq = readInt(buffer, 12, 4)
    if (result.op === 5) {
        result.body = []
        let offset = 0;
        while (offset < buffer.length) {
        let packetLen = readInt(buffer, offset + 0, 4)
        let headerLen = 16// readInt(buffer,offset + 4,4)
        if (result.ver == 2) {
            let data = buffer.slice(offset + headerLen, offset + packetLen);
            let newBuffer =pako.inflate(new Uint8Array(data));
            const obj = decode(newBuffer);
            const body = obj.body;
            result.body = result.body.concat(body);
        } else {
            let data = buffer.slice(offset + headerLen, offset + packetLen);
            let body = textDecoder.decode(data);
            if (body) {
            result.body.push(JSON.parse(body));
            }
        }
        offset += packetLen;
        }
    } else if (result.op === 3) {
        result.body = {
        count: readInt(buffer, 16, 4)
        };
    }
    return result;
    }

    // socket连接
    function DanmuSocket() {
        var ws = 'wss';
        if(f){
            return;
        }
        socket = new WebSocket(ws + '://' + url + ':' + port + '/sub');
        f=1;
        socket.binaryType = 'arraybuffer';

        // Connection opened
        socket.addEventListener('open', function (event) {
            console.log('Danmu WebSocket Server Connected.');
            console.log('Handshaking...');
            var token = JSON.stringify({
                'uid': uid,
                'roomid': room_id,
                'key': mytoken,
                'protover':1,
            });
            var headerBuf = new ArrayBuffer(rawHeaderLen);
            var headerView = new DataView(headerBuf, 0);
            var bodyBuf = txtEncoder(token);
            headerView.setInt32(packetOffset, rawHeaderLen + bodyBuf.byteLength);
            headerView.setInt16(headerOffset, rawHeaderLen);
            headerView.setInt16(verOffset, 1);
            headerView.setInt32(opOffset, 7);
            headerView.setInt32(seqOffset, 1);
            socket.send(mergeArrayBuffer(headerBuf, bodyBuf));
            // heartBeat();
            var Id = setInterval(function () {
                heartBeat();
            }, 30*1000);
        });

        socket.addEventListener('error', function (event) {
            console.log('WebSocket 错误: ', event);
            socket.close();
            f=0;
            console.log('WebSocket 重连 ');
            DanmuSocket();
        });

        socket.addEventListener('close', function (event) {
            console.log('WebSocket 关闭 ');
            f=0;
            sleep(5000);
            console.log('WebSocket 重连 ');
            DanmuSocket();
        });

        // Listen for messages
        socket.addEventListener('message', function (msgEvent) {
            const packet = decode(msgEvent.data);
            switch (packet.op) {
                case 8:
                    //console.log('加入房间');
                    break;
                case 3:
                    //console.log(`人气`);
                    break;
                case 5:
                    packet.body.forEach((body)=>{
                        switch (body.cmd) {
                            case 'DANMU_MSG':
                                var tongchuan= body.info[1];
                                var manName=body.info[2][1];
                                //message.show({
                                //         text: tongchuan,
                                //           duration: deltime,
                                //        });
                                if(tongchuan.indexOf("【") != -1){
                                    tongchuan=tongchuan.replace("【"," ");
                                    tongchuan=tongchuan.replace("】","");
                                    if(!IsSikiName){
                                        //console.log("显示字幕");
                                        message.show({
                                            text: tongchuan,
                                            duration: deltime,
                                        });
                                    }else if((SikiName.indexOf(manName)>-1)){
                                        message.show({
                                            text: tongchuan,
                                            duration:deltime,
                                        });
                                    }

                                }
                                //console.log(`${body.info[2][1]}: ${body.info[1]}`);
                                break;
                            case 'SEND_GIFT':
                                //console.log(`${body.data.uname} ${body.data.action} ${body.data.num} 个 ${body.data.giftName}`);
                                break;
                            case 'WELCOME':
                                //console.log(`欢迎 ${body.data.uname}`);
                                break;
                                // 此处省略很多其他通知类型
                            default:
                                //console.log(body);
                        }
                    })
                    break;
            }
        });
    }

};

// 延迟执行


/* 弹幕json示例
{
    "info": [
        [
            0,
            1,
            25,
            16777215,
            1526267394,
            -1189421307,
            0,
            "46bc1d5e",
            0
        ],
        "空投！",
        [
            10078392,
            "白の驹",
            0,
            0,
            0,
            10000,
            1,
            ""
        ],
        [
            11,
            "狗雨",
            "宫本狗雨",
            102,
            10512625,
            ""
        ],
        [
            23,
            0,
            5805790,
            ">50000"
        ],
        [
            "title-111-1",
            "title-111-1"
        ],
        0,
        0,
        {
            "uname_color": ""
        }
    ],
    "cmd": "DANMU_MSG"
}
*/