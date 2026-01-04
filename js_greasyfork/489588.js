// ==UserScript==
// @name         显示 gamebanana 更新具体时间
// @namespace    http://tampermonkey.net/
// @license      CC-BY-SA 3.0
// @version      2024-03-12
// @description  用具体时间替换 gamebanana 网站上的更新时间。
// @author       Confringo
// @match        *://gamebanana.com/mods/*
// @match        *://www.gamebanana.com/mods/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamebanana.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489588/%E6%98%BE%E7%A4%BA%20gamebanana%20%E6%9B%B4%E6%96%B0%E5%85%B7%E4%BD%93%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/489588/%E6%98%BE%E7%A4%BA%20gamebanana%20%E6%9B%B4%E6%96%B0%E5%85%B7%E4%BD%93%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load',function(){
        var times=document.getElementsByTagName('time');
        console.log(times);
        for (let i=0;i<times.length;i++){
            console.log(times[i].getAttribute('datetime'));
            times[i].textContent=times[i].getAttribute('datetime').replace('Z','').replace('.000','').replace('T',' ');
        }
    },false);
})();