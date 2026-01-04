// ==UserScript==
// @name         Missav 多开播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Missav 多开播放.
// @author       You
// @match        https://missav.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.com
// @grant        none
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/469440/Missav%20%E5%A4%9A%E5%BC%80%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/469440/Missav%20%E5%A4%9A%E5%BC%80%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
            document.addEventListener('visibilitychange', () => {
                if (window.player && !document.hidden) {
                    window.player.play()
                }
            })

            document.addEventListener('blur', () => {
                if (window.player) {
                    window.player.play()
                }
            })

            window.addEventListener('blur', () => {
                if (window.player) {
                    window.player.play()
                }
            })
})();