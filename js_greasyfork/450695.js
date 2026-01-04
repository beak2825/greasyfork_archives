// ==UserScript==
// @name         liveremove
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除b站多余播放器
// @author       geensu
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license      AGPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450695/liveremove.user.js
// @updateURL https://update.greasyfork.org/scripts/450695/liveremove.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var value=true;
     var btnarea=document.querySelector('.right-ctnr');
     var btn=document.createElement('button');
     btn.id='liveremove';
     btn.textContent=value ? "去除播放器":"恢复播放器";
     btnarea.insertBefore(btn,btnarea.children[0]);
     btn.addEventListener(click,()=>{
        if(value){
            document.getElementById('live-player').remove();

        }
        else{
            location.reload();
        }
        
        value=!value;
     })
})();