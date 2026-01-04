// ==UserScript==
// @name         Chatwork Live Window Switcher
// @namespace    https://www.chatwork.com/
// @version      0.1
// @description  Interva switch window for Chatwork Live
// @author       Yuji Sudo
// @match        https://www.chatwork.com/live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397226/Chatwork%20Live%20Window%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/397226/Chatwork%20Live%20Window%20Switcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentIndex = 0;

    setInterval(function () {
        const area = document.querySelectorAll(".memberListMember__videoContainer");
        const size = area.length;
        if (size === 0) {
            return;
        }

        const targetIndex = currentIndex >= (size - 1) ? 0 : currentIndex + 1;

        if (!area[targetIndex]) {
            return;
        }
        area[targetIndex].click();
        currentIndex = targetIndex;
    }, 15000);
})();