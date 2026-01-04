// ==UserScript==
// @name         Dark mode
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  b站，知乎，v2ex 暗黑模式主题
// @author       zhowiny
// @match        https://*.bilibili.com/*
// @match        https://*.zhihu.com/*
// @match        https://*.v2ex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480008/Dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/480008/Dark%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style')
    style.innerText = 'html,img,video,button,svg:not(button svg),canvas {filter: invert(.9);}'

    document.head.appendChild(style)
})();