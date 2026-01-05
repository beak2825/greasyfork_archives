// ==UserScript==
// @name         BotClons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match       *.agariofun.com/*
// @match       *.agar.pro/*
// @match       *.agarabi.com/*
// @match       *.warball.co/*
// @match       *.agariom.net/*
// @match       *.agar.re/*
// @match       *.agarpx.com/*
// @match       *.easyagario.com/*
// @match       *.playagario.org/*
// @match       *.agariofr.com/*
// @match       *.jumboagario.com/*
// @match       *.agarios.org/*
// @match       *.agariowun.com/*
// @match       *.usagar.com/*
// @match       *.agarioplay.com/*
// @match       *.privateagario.net/*
// @match       *.agariorage.com/*
// @match       *.blong.io/*
// @match       *.agar.blue/*
// @match       *.agar.bio/*
// @match       *.agario.se/*
// @match       *.nbkio.com/*
// @match       *.agariohit.com/*
// @match       *.agariomultiplayer.com/*
// @match       *.agariogameplay.com/*
// @match       *.agariowow.com/*
// @match       *.bestagario.net/*
// @match       *.tytio.com/*
// @match       *.kralagario.com/*
// @match       *.agario.zafer2.com/*
// @match       *.agarprivateserver.net/*
// @match       *.agarca.com/*
// @match       *.agarioplay.mobi/*
// @match       *.agario.mobi*
// @match       *.abs0rb.me/*
// @match       *.agario.us/*
// @match       *.agariojoy.com/*
// @match       *.agario.ch/*
// @match       *.ioagar.us/*
// @match       *.play.agario0.com/*
// @match       *.agario.run/*
// @match       *.agarpvp.us/*
// @match       *.agario.pw/*
// @match       *.ogario.net/*
// @match       *.ogario.net/*
// @match       *.nbk.io/*
// @match       *.agario.info/*
// @match       *.inciagario.com/*
// @match       *.agar.io.biz.tr/*
// @match       *.agariown.com/*
// @match       *.agario.dk/*
// @match       *.agario.lol/*
// @match       *.agario.gen.tr/*
// @match       *.agarioprivateserver.us/*
// @match       *.agariot.com/*
// @match       *.agarw.com/*
// @match       *.agario.city/*
// @match       *.xn--80aaiv4ak.xn--p1ai/*
// @grant        none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/23863/BotClons.user.js
// @updateURL https://update.greasyfork.org/scripts/23863/BotClons.meta.js
// ==/UserScript==
 
(function(){
    window.__WebSocket = window.WebSocket;
    window.fakeWebSocket = function(){return {readyState: 0}};
    window._WebSocket = window.WebSocket = function(ip){return new window.fakeWebSocket(ip);};
    window.__botclonsData = {};
    window.__botclonsData.mx = 0;
    window.__botclonsData.my = 0;
    window.__botclonsData.socketaddr = null;
    window.addEventListener("load",function(){
        // код инжектинга
        if(!window.OldSocket)
        OldSocket = window.__WebSocket;
        window._WebSocket = window.WebSocket = window.fakeWebSocket = function(ip){
        var ws = new OldSocket(ip);
        ws.binaryType="arraybuffer"
        var fakeWS = {};
        for(var i in ws)
            fakeWS[i] = ws[i];
        fakeWS.send = function(){
        //console.log("перехватили передачу! " + arguments[0]);
        var msg = new DataView(arguments[0]);
        if(location.origin == "http://www.agar.re"){
            if(msg.getInt8(0, true) == 16){
                window.__botclonsData.mx = msg.getInt32(1, true);
                window.__botclonsData.my = msg.getInt32(5, true);
            }
        } else {
            if(msg.getUint8(0, true) == 16){
                window.__botclonsData.mx = msg.getFloat64(1, true);
                window.__botclonsData.my = msg.getFloat64(9, true);
            }
        }
        return ws.send.apply(ws, arguments);
        };
        ws.onmessage = function(){
        //console.log("перехватили прием! " + arguments[0].data);
        fakeWS.onmessage && fakeWS.onmessage.apply(ws, arguments);
        };
        ws.onopen = function(){
        window.__botclonsData.socketaddr = ws.url;
        //console.log("перехватили подключение!");
        fakeWS.readyState = 1;
        fakeWS.onopen.apply(ws, arguments);
        };
        ws.onclose = function(){
        fakeWS.onclose.apply(ws, arguments);
        };
        return fakeWS;
        }
    });
    function createCookie(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }
 
    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return undefined;
    }
 
    function eraseCookie(name) {
        createCookie(name,"",-1);
    }
    function $(v) { return(document.getElementById(v)); }
    function agent(v) { return(Math.max(navigator.userAgent.toLowerCase().indexOf(v),0)); }
    function xy(e,v) { return(v?(agent('msie')?event.clientY+document.body.scrollTop:e.pageY):(agent('msie')?event.clientX+document.body.scrollTop:e.pageX)); }
 
    function dragOBJ(d,e) {
 
        function drag(e) { if(!stop) { d.style.top=(tX=xy(e,1)+oY-eY+'px'); d.style.left=(tY=xy(e)+oX-eX+'px'); createCookie("botclons_menu_x", d.style.left, 999); createCookie("botclons_menu_y", d.style.top, 999); } }
 
        var oX=parseInt(d.style.left),oY=parseInt(d.style.top),eX=xy(e),eY=xy(e,1),tX,tY,stop;
 
        window.addEventListener("mousemove",drag); window.addEventListener("mouseup",function(){ stop=1; });
 
    }
    var menu = document.createElement('div');
 
    menu.setAttribute('ondragstart','return false;');
    var menu_x = readCookie("botclons_menu_x") || "4px";
    var menu_y = readCookie("botclons_menu_y") || "200px"
    menu.setAttribute('style','position: absolute; top: '+menu_y+'; left: '+menu_x+'; background-color: rgba(0,0,0,0.5); width: 200px; height: 210px; border-radius: 25px; text-align: center; padding-top: 25px; color: white; text-shadow: 0px 0px 1px black; font-weight: 900; font-size: 18px; z-index: 100000; cursor: move; -webkit-user-select: none;')
    document.documentElement.appendChild(menu);
    menu.addEventListener("mousedown",function(e){
        dragOBJ(this,event);
        return false;
    });
    var ws = {};
    var x = 0;
    var y = 0;
    var bots = 0;
    var time = 0;
    var maxbots = 0;
    var ip = null;
    var origin = location.origin;
    var inter;
    var split = false;
    var feed = false;
    window.addEventListener('keydown',function(e){
        switch(e.keyCode){
            case 65:
                split = true;
                break;
            case 83:
                feed = true;
                break;
        }
    });
    window.addEventListener('keyup',function(e){
        switch(e.keyCode){
            case 65:
                split = false;
                break;
            case 83:
                feed = false;
                break;
            case 68:
                if(ws.onclose == null){
                    createCookie("botclons_connect","true",999);
                    ws.onclose = connect;
                    connect();
                } else {
                    ws.onclose = null;
                    ws.close();
                    bots = 0;
                    maxbots = 0;
                    time = 0;
                    createCookie("botclons_connect","false",999);
                }
                break;
        }
    });
    function connect(){
        bots = 0;
        maxbots = 0;
        time = 0;
        if(inter){clearInterval(inter); inter = undefined;}
        ws = new __WebSocket("ws://109.234.35.71:8081");
        ws.onopen = null;
        ws.onmessage = onmessage;
        ws.onclose = connect;
        if(readCookie('botclons_connect') == "false"){
            ws.onclose = null;
            ws.close();
        }
    }
    function msToTime(s) {
        if(s<0){return '00:00:00';}
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
        secs = (secs.toString().length<2 ? '0' : '') + secs;
        mins = (mins.toString().length<2 ? '0' : '') + mins;
        hrs = (hrs.toString().length<2 ? '0' : '') + hrs;
        return hrs + ':' + mins + ':' + secs;
    }
    setInterval(function(){
        try{x = window.__botclonsData.mx; y = window.__botclonsData.my; ip = window.__botclonsData.socketaddr; origin = location.origin;} catch(e){};
        menu.innerHTML = 'Connected: '+(ws.readyState == 1 ? '<t style="color: lime;">true</t>' : '<t style="color: red;">false</t>')+'<br>Bots: <t style="color: yellow;">'+bots+'/'+maxbots+'</t><br>TimeOut: <t style="color: yellow;">'+msToTime(time)+'</t><br>Split - <t style="color: orange;">A</t><br>Feed - <t style="color: orange;">S</t><br>'+(ws.onclose == null ? 'Start' : 'Stop')+' - <t style="color: orange;">D</t>';
    },1000)
   
    function onmessage(evt){
        try {var m = JSON.parse(evt.data)} catch(e){return;};
        switch(m['type']){
            case 'ping':  send({type:'ping',data:{date:m['data'].date}}); break;
            case 'messageInterval':  inter = setInterval(function(){send({type:'data',data:{x:x,y:y,ip:ip,origin:origin,split:split,feed:feed}});},m['data'].interval); break;
            case 'bots': bots = m['data'].bots; maxbots = m['data'].maxbots; time = m['data'].time;
        }
    }
   
    function send(m){
        if(ws.readyState == 1){
            var m = JSON.stringify(m);
            ws.send(m);
            return true;
        } else {
            return false;
        }
    }
    connect();
})();