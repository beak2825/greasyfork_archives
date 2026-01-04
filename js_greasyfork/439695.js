// ==UserScript==
// @name         long touch to fullscreen
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  triple touch to fullscreen for for mobile
// @author       amormaid
// @run-at       document-end
// @match        http(s)?://*/*
// @include      http://*
// @include      https://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439695/long%20touch%20to%20fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/439695/long%20touch%20to%20fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // document.documentElement.requestFullscreen()
    let time_list = []
    function fullscreen() {
        console.log('touch end')
        time_list = [...time_list.slice(-2) , +new Date()]
        const [a, b, c] = time_list
        if (a && c && c - a < 1500) {
            // 处理点击事件
            document.documentElement.requestFullscreen()
        }
    }

    document.body.addEventListener('touchend', fullscreen )

})();