// ==UserScript==
// @name         Bilibili Light Off
// @namespace    http://bilibili.com/
// @version      0.1
// @description  This script will change all elements' background to black when you click the Light Off button, including player controller.
// @author       Guangyu Zhang
// @include      http://www.bilibili.com/video/av*/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/25613/Bilibili%20Light%20Off.user.js
// @updateURL https://update.greasyfork.org/scripts/25613/Bilibili%20Light%20Off.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(".blo-black { background: black !important}");

    var itemList = ['bilibili-player-video-control',
                    'bilibili-player-video-sendbar',
                    'bilibili-player-video-inputbar'];

    function toggleLight() {
        for (var i of itemList) {
            var ele = document.getElementsByClassName(i);
            if (ele.length === 0) {
                continue;
            }
            ele = ele[0];
            if (ele.className.indexOf(' blo-black') > -1)
                ele.className = ele.className.replace(' blo-black', '');
            else
                ele.className += ' blo-black';
        }
    }

    var lightOffButton = document.getElementsByName("light_onoff");
    function getLightOffButton() {
        if (lightOffButton.length === 0) {
            setTimeout(getLightOffButton, 1000);
            return;
        }
        lightOffButton = lightOffButton[0];
        lightOffButton.addEventListener("click", toggleLight);
    }
    setTimeout(getLightOffButton, 1000);
})();