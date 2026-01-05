// ==UserScript==
// @name        bilibili notify
// @namespace   heroesm
// @include     http://live.bilibili.com/feed/getList/1
// @include     https://live.bilibili.com/feed/getList/1
// @include     http://api.live.bilibili.com/ajax/feed/list*
// @include     https://api.live.bilibili.com/ajax/feed/list*
// @version     1.0.6
// @grant       none
// 
// @description 自动监听bilibili直播推送信息，当所关注者开启直播时自动打开直播网页的javascript脚本。
// @downloadURL https://update.greasyfork.org/scripts/22383/bilibili%20notify.user.js
// @updateURL https://update.greasyfork.org/scripts/22383/bilibili%20notify.meta.js
// ==/UserScript==
function main(){
    "use strict";
    
    var sAltAPI = '//api.live.bilibili.com/ajax/feed/list?pagesize=30&page=1';
    var running = true;
    var rProFilter, rConFilter;
    var rFilter = /./;
    var sMode = 'pro';
    var aTimer = [];
    var aAltRoomid = null;
    var sTitle = '';
    var isBuilt = false;

    function reload(){
        run()
    }
    function prepare(){
        Document.prototype.$ = Document.prototype.querySelector;
        Element.prototype.$ = Element.prototype.querySelector;
        Document.prototype.$$ = Document.prototype.querySelectorAll;
        Element.prototype.$$ = Element.prototype.querySelectorAll;
    }
    function start(){
        var timer = setTimeout(function(){
            reload()
        }, 30000);
        aTimer.push(timer);
        document.$('#pause').style.display = 'unset';
        document.$('#start').style.display = 'none';
        document.title = sTitle;
        return timer;
    }
    function stop(){
        var nTimer = aTimer.pop();
        while (nTimer){
            clearTimeout(nTimer);
            nTimer = aTimer.pop();
        }
        document.$('#pause').style.display = 'none';
        document.$('#start').style.display = 'unset';
        sTitle = document.title;
        document.title = '已暂停';
    }
    function update(){
        try{
            var sCon = document.$('#con').value.trim();
            localStorage.bilinotify_con = sCon;
            rConFilter = new RegExp(sCon);
            var sPro = document.$('#pro').value.trim();
            localStorage.bilinotify_pro = sPro;
            rProFilter = new RegExp(sPro);
        } catch(e){console.log(e);}
        localStorage.bilinotify_mod = sMode = document.$('input[name=mode]:checked').value;
        if (sMode == 'pro'){
            rFilter = rProFilter;
        }
        else{
            rFilter = rConFilter; 
        }
    }
    function checkopen(item){
        var con = Boolean(sMode == 'con');
        var sName = item.nickname || item.uname
        if(con ^ rFilter.test(sName)){
            window.open(item.link + '###', sName);
        }
    }
    function build(){
        if (isBuilt){
            return
        }
        isBuilt = true;
        var style = document.createElement('style');
        style.id = 'bilinotify_css';
        style.innerHTML = [
            'input[type=text] {width: 50%;}'
        ].join('\n');
        document.head.appendChild(style);
        document.body.insertAdjacentHTML(
            'beforeend',
            [
                '<div class="con">',
                '    <input type="radio" name="mode" value="con">',
                '    <span>使用该正则表达式按昵称进行排除：</span>',
                '<input id="con" type="text" placeholder="不想看的A的昵称|B的昵称|C的昵称">',
                '</div>',
                '<div class="pro">',
                '    <input type="radio" name="mode" value="pro" checked>',
                '    <span>使用该正则表达式按昵称进行匹配：</span>',
                '    <input id="pro" type="text" placeholder="想看的A的昵称|B的昵称|C的昵称">',
                '</div>',
                '<div>',
                '    <button id="confirm">确认</button>',
                '    <button id="pause">暂停</button>',
                '    <button id="start">继续</button>',
                '</div>',
                '<div id="temp"></div>'
            ].join('\n')
        );
        if (localStorage.bilinotify_con){
            document.$('#con').value = localStorage.bilinotify_con;
        }
        if (localStorage.bilinotify_pro){
            document.$('#pro').value = localStorage.bilinotify_pro;
        }
        if (localStorage.bilinotify_mod){
            document.$('input[type=radio][value=' + localStorage.bilinotify_mod + ']').checked = true;
        }
        update();
        document.$('#confirm').onclick = update;
        document.$('#start').onclick = start;
        document.$('#pause').onclick = stop;
    }
    function process(sRes){
        try{
            prepare();
        }catch(e){}
        //var Obj = JSON.parse(document.body.childNodes[0].textContent.slice(1,-2));
        var Obj = JSON.parse(sRes);
        build();
        var Data = Obj.data;
        window.temp.innerHTML = sRes;
        if(Obj.code == 401){
            window.temp.innerHTML += '<br /><br />未登录';
            document.title = '未登录';
        }
        else if(Data.list.length>0) {
            document.title = "(！)有" + Data.list.length + "个直播";
            for(var x=0, item, sHTML; x<Data.list.length; x++){
                item = Data.list[x];
                //if (aAltRoomid != null && aAltRoomid.indexOf(item.roomid) == -1){
                //    window.temp.innerHTML += 'erroneous response from server';
                //    document.title = '信息错误';
                //    throw 'erroneous response from server';
                //}
                sHTML = ([
                    '<br />',
                    '<br />',
                    '<div style="clear:both;">',
                    '    <a style="float:left;" href="${item.link}"><img style="width:100px; height: 100px;" src="${item.face}"></img></a>',
                    '    <div style="float:left;">',
                    '        <span>${item.nickname||item.uname}</span>',
                    '        <br>',
                    '        <a href="${item.link}">${item.roomname||item.title}</a>',
                    '    </div>',
                    '</div>'
                ].join('\n').replace(/\$\{([^\}]+)\}/g, function(sMatch, sP1){
                    return eval(sP1);
                }));
                window.temp.innerHTML += sHTML
                checkopen(item);
            }
        }
        else{
            window.temp.innerHTML += '<br /><br />无直播';
            document.title = "无直播";
        }
        sTitle = document.title;
        start();
        console.log('ended');
    }
    //function handleAltList(sRes){
    //    var div = document.createElement('div');
    //    div.textContent = sRes;
    //    document.body.appendChild(div);
    //    var Obj = JSON.parse(sRes);
    //    if (Obj.code == 0){
    //        var aRooms = Obj.data.list;
    //        aRooms || (aRooms = []);
    //        for (var i=0; i<aRooms.length; i++){
    //            aAltRoomid.push(aRooms[i].roomid.toString());
    //        }
    //    }
    //    else{
    //        aAltRoomid = null;
    //    }
    //}
    function getAltList(callback){
        var xhr = new XMLHttpRequest();
        xhr.timeout = 5000;
        var sRes = '';
        xhr.ontimeout = xhr.onerror = function(e){
            console.log('timeout when getting alternative list');
            setTimeout(function(){
                reload()
            }, 5000);

        };
        xhr.onload = function(e){
            try{
                sRes = xhr.response;
                callback(sRes);
            }catch(e){
                console.log(e.toString());
                setTimeout(function(){
                    reload()
                }, 30000);
            }
        }
        xhr.withCredentials = true;
        xhr.open('get', sAltAPI)
        xhr.send();
    }
    
    function run(){
        getAltList(function(sRes){
            //if (sRes){
            //    handleAltList(sRes);
            //}
            sRes = sRes || document.body.childNodes[0].textContent
            process(sRes);
        });
    }
    run();
}

try{
    main();
}catch(e){
    console.log(e.toString());
    setTimeout(function(){
        window.location.reload();
    }, 30000);
}
