// ==UserScript==
// @name         Non-blocking S1
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  以脱了裤子放屁的温柔方式提醒saraba1st.com/2b用户关闭广告屏蔽插件
// @author       ownstars
// @match        https://*.saraba1st.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/379900/Non-blocking%20S1.user.js
// @updateURL https://update.greasyfork.org/scripts/379900/Non-blocking%20S1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.alert = function(msg) {
        var box = document.createElement('div');

        box.id = "nonblockingpop";
        box.innerHTML=msg;
        box.style.float = 'right';
        box.style.position = 'fixed';
        box.style.background = '#d7dec7 none repeat scroll 0% 0%';
        box.style.opacity = '0.85';
        box.style.padding = '10px';
        box.style.top = '3em';
        box.style.right = '1em';

        document.body.appendChild(box);

        setTimeout(function(){
            var box = document.getElementById('nonblockingpop');
            box.parentElement.removeChild(box);
        }, 2000);

    }
})();