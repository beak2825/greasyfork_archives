// ==UserScript==
// @name         禅道视频播放
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  I am iron man!
// @author       Tony
// @match        *://server:81/*
// @match        *://192.168.1.5:81/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.server
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449337/%E7%A6%85%E9%81%93%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/449337/%E7%A6%85%E9%81%93%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var listGroup = document.querySelectorAll('.list-group');
    if(listGroup.length > 0){
        var list = document.querySelectorAll('.list-group')[0].querySelectorAll('li');
        for(var i=0;i<list.length;i++){
            var src = list[i].querySelector('a').href;
            var divvv = document.createElement('div');
            divvv.style.background = '#000';
            divvv.style.width = 'max-content';
            divvv.innerHTML = `<video width=350 height=250  controls src="${src}"></video>`;
            list[i].querySelector('a').parentNode.appendChild(divvv);
        }
    }
})();