// ==UserScript==
// @name         关闭B站弹幕
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398316/%E5%85%B3%E9%97%ADB%E7%AB%99%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/398316/%E5%85%B3%E9%97%ADB%E7%AB%99%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var name = 'checked-DM';
    function closeDM(){
        var inputBtn = document.querySelector('input[class="bui-switch-input"]');
        if(inputBtn.checked && !inputBtn.name){
            inputBtn.name = 'checked-DM'
            var ev = document.createEvent('MouseEvents');
            ev.initEvent('click', true, true);
            inputBtn.dispatchEvent(ev);
            console.log("closeDM run");
        }
    }
    window.setInterval(closeDM, 1000);
})();