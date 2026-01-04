// ==UserScript==
// @name        bilibili notify+
// @namespace   heroesm
// @match     http://live.bilibili.com/feed/getList/1
// @match     https://live.bilibili.com/feed/getList/1
// @match     *api.live.bilibili.com/ajax/feed/list*
// @match     https://t.bilibili.com/*
// @match        https://live.bilibili.com/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_removeValueChangeListener
// @grant        GM_addValueChangeListener
// @version     1.2
//
// @description 自动监听bilibili直播推送信息，当所关注者（包括悄悄关注）开启直播时自动打开直播网页的javascript脚本。30s获取一次关注列表的开播情况。自动开启一次后若主播不更改直播间标题、超过一定时间(可通过TimeOutMin设置)、重新设定白名单则不会再次打开。使用方法：在白名单模式（本修改仅限白名单模式）下输入想要自动开启的关注的主播的名字确认。
// @downloadURL https://update.greasyfork.org/scripts/449379/bilibili%20notify%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/449379/bilibili%20notify%2B.meta.js
// ==/UserScript==

function main(){
    "use strict";

    //var sAltAPI = '//api.live.bilibili.com/ajax/feed/list?pagesize=30&page=1';
    var sAltAPI = '//api.bilibili.com/x/polymer/web-dynamic/v1/portal';
    var running = true;
    var rProFilter, rConFilter,tarr;
    var rFilter = /./;
    var sMode = 'pro';
    var aTimer = [];
    var aAltRoomid = null;
    var sTitle = '';
    var isBuilt = false;
    var fArr = [];
    var TimeOutMin = 30;
    var reflashTime = 60*1000;

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
        }, reflashTime);
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
    function resetLocalStorage(){
        localStorage.removeItem('sfArr');
        fArr=[];
        for (var i=0;i<tarr.length;i++){
            fArr[i]={name:tarr[i],title:""};
        };
        localStorage.sfArr=JSON.stringify(fArr);
    }
    function listChanged(){
        if(fArr.length!=tarr.length){
            return 1;
        };
        for (var i = 0;i<tarr.length;i++){
            if(fArr[i].name!=tarr[i]){
                return 1;
            };
        }
        return 0;
    }
    function update(){
        try{
            //            var sCon = document.$('#con').value.trim();
            //            localStorage.bilinotify_con = sCon;
            //            rConFilter = new RegExp(sCon);
            var sPro = document.$('#pro').value.trim();
            localStorage.bilinotify_pro = sPro;

            tarr = JSON.parse('["' + sPro.replace(/\|/g, '","') + '"]');
            if (localStorage.sfArr){
                fArr=JSON.parse(localStorage.sfArr);
                if(listChanged()){
                    resetLocalStorage();
                }
            }
            else{
                resetLocalStorage();
            }
            rProFilter = new RegExp(sPro);
        } catch(e){console.log(e);}
        localStorage.bilinotify_mod = sMode = 'pro';
        //        localStorage.bilinotify_mod = sMode = document.$('input[name=mode]:checked').value;
        if (sMode == 'pro'){
            rFilter = rProFilter;
        }
        else{
            //            rFilter = rConFilter;
        }
    }
    function checkopen(item){
        var con = Boolean(sMode == 'con');
        var sName = item.nickname || item.uname;

        function opWin(url,roomid){
            if(typeof GM_getValue("room"+roomid) === 'undefined'||(new Date()).getTime()-GM_getValue("room"+roomid)>10*60*1000){
                window.open(url + '###')
            }
        }
        if(con ^ rFilter.test(sName)){
            for (var i=0;i<tarr.length;i++){
                if(sName==fArr[i].name){
                    var timeout = !localStorage.getItem("room"+item.room_id)||(new Date().getTime()-localStorage.getItem("room"+item.room_id))>(1000*60*TimeOutMin);
                    if(fArr[i].title==""||fArr[i].title!=item.title||timeout){
                        fArr[i].title=item.title;
                        localStorage.setItem("room"+item.room_id,(new Date()).getTime());
                        localStorage.sfArr=JSON.stringify(fArr);
                        opWin(item.jump_url,item.room_id);
                    }
                }
            }

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
        document.querySelector('#app').insertAdjacentHTML(
            'beforebegin',
            //        document.body.insertAdjacentHTML(
            //            'beforeend',
            [
                //                '<div class="con">',
                //                '    <input type="radio" name="mode" value="con">',
                //                '    <span>使用该正则表达式按昵称进行排除：</span>',
                //                '<input id="con" type="text" placeholder="不想看的A的昵称|B的昵称|C的昵称">',
                //                '</div>',
                '<div id="temp"style="position: relative; z-index: 1;">',
                '<style>display:block</style>',
                '<div class="pro">',
                '    <input type="radio" name="mode" value="pro" checked>',
                '    <span>使用该正则表达式按昵称进行匹配：</span>',
                '    <input id="pro" type="text" placeholder="想看的A的昵称|B的昵称|C的昵称">',
                '</div>',
                '<div>',
                '    <button id="confirm">确认</button>',
                '    <button id="pause">暂停</button>',
                '    <button id="start">继续</button>',
                '    <button id="hidden">隐藏</button>',
                '</div>',
                '</div>'
            ].join('\n')
        );
        //        if (localStorage.bilinotify_con){
        //            document.$('#con').value = localStorage.bilinotify_con;
        //        }
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
        document.$('#hidden').onclick = function (){document.$('#temp').style.display="none";};
    }
    function process(sRes){
        try{
            prepare();
        }catch(e){}
        var Obj = JSON.parse(sRes);
        build();
        var Data = Obj.data;
        //window.temp.innerHTML = sRes;
        if(Obj.code == 401){
            window.temp.innerHTML += '<br /><br />未登录';
            document.title = '未登录';
        }
        else if(Data.live_users.count>0) {
            document.title = "(！)有" + Data.live_users.count + "个直播";
            for(var x=0, item, sHTML; x<Data.live_users.count; x++){
                item = Data.live_users.items[x];
                //if (aAltRoomid != null && aAltRoomid.indexOf(item.roomid) == -1){
                //    window.temp.innerHTML += 'erroneous response from server';
                //    document.title = '信息错误';
                //    throw 'erroneous response from server';
                //}
                sHTML = ([
                    '<br />',
                    '<br />',
                    '<div style="clear:both;">',
                    '    <a style="float:left;" href="${item.jump_url}"><img style="width:100px; height: 100px;" src="${item.face}"></img></a>',
                    '    <div style="float:left;">',
                    '        <span>${item.nickname||item.uname}</span>',
                    '        <br>',
                    '        <a href="${item.jump_url}">${item.roomname||item.title}</a>',
                    '    </div>',
                    '</div>'
                ].join('\n').replace(/\$\{([^\}]+)\}/g, function(sMatch, sP1){
                    return eval(sP1);
                }));
                //window.temp.innerHTML += sHTML
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
            sRes = sRes || document.body.childNodes[0].textContent
            process(sRes);
        });
    }
    run();
}

function setcookie(){
    const regex = /[blanc|com]\/(\d+)/;
    let roomid = window.location.href.match(regex)[1];

//     (function e(){
//     GM_setValue("room"+roomid,(new Date()).getTime());
//         console.log(GM_getValue("room"+roomid));
//         setTimeout(()=>{e()},5*60*1000);
//     })()

    setInterval(() => {
        setTimeout(()=>{
        GM_setValue("room"+roomid,(new Date()).getTime());},0)
    }, 5*60*1000);

    window.onbeforeunload = GM_deleteValue("room"+roomid);
    window.addEventListener('unload', function (event) {
        GM_deleteValue("room"+roomid);
    });
}
if (window.location.href.indexOf("live.bili") !== -1) {
    setcookie();}
else{
    try{
        main();
    }catch(e){
        console.log(e.toString());
        setTimeout(function(){
            window.location.reload();
        }, 30000);
    }
}
