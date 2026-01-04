// ==UserScript==
// @name         下载按钮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  硕鼠按钮
// @author       poi
// @match        http://www.flvcd.com/xdown.php?id=*
// @match        https://www.bilibili.com/bangumi/*
// @match        https://www.bilibili.com/video/*
// @match        http://open.163.com/special/*
// @match        http://open.163.com/movie/*
// @match        https://film.sohu.com/album/*
// @match        https://tv.sohu.com/v/*
// @match        http://www.le.com/ptv/vplay/*
// @match        http://www.acfun.cn/v/ac*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371243/%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/371243/%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    var url=window.location.href;
    var reg=/(http:\/\/www.flvcd.com\/xdown.php\?id=)(\d{1,99})/;
    console.log(reg.test(url)+"/n"+url);
    if(!reg.test(url)){

            function loadCssCode(code){
            var style = document.createElement('style');
            style.type = 'text/css';
            style.rel = 'stylesheet';
            style.appendChild(document.createTextNode(code));
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(style);
        }
        loadCssCode('.ss{background: #E8E9EB;z-index:999;width:100px;height:100px;border:0px;box-shadow:3px 3px 3px #888888; border-radius:50px;position: fixed;top:10px;opacity:0.1;transition-duration:1s;}.ss:hover{transition-duration:0.5s;opacity:1;}.ss:active{background: #6f6f6f;width:95px;height:95px;}');
        var newButton = document.createElement("input");
        newButton.value="下载";
        newButton.className="ss";
        newButton.type='button';
        newButton.onclick=function (){
            window.open('http://www.flvcd.com/parse.php?format=&kw='+window.location.href);
        };
        document.body.append(newButton);
    }else{
        setTimeout('window.close();',5000);
    };
})();