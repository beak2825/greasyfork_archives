// ==UserScript==
// @name         斗鱼 HTML5 播放器
// @namespace    douyu.html5
// @version      0.0.1
// @description  使用斗鱼 HTML5 播放器！
// @author       DIYgod
// @match        https://www.douyu.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/38270/%E6%96%97%E9%B1%BC%20HTML5%20%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/38270/%E6%96%97%E9%B1%BC%20HTML5%20%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const switchCheck = setInterval(function () {
        if (unsafeWindow.__player && unsafeWindow.__player.switchPlayer) {
            unsafeWindow.__player.switchPlayer('h5');
            clearInterval(switchCheck);
        }
    }, 500);
})();