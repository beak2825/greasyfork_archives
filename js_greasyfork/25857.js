// ==UserScript==
// @name         Original Google For Personal Blocklist
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将使用Personal Blocklist (by Google)后的Google的搜索界面改成原来的样子
// @author       ipcjs
// @include      https://www.google.com/search?*
// @include      https://www.google.com/webhp?*
// @include      https://www.google.co.jp/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25857/Original%20Google%20For%20Personal%20Blocklist.user.js
// @updateURL https://update.greasyfork.org/scripts/25857/Original%20Google%20For%20Personal%20Blocklist.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let css = `.blockLink {
        opacity: 0;
        height: 0px;
    }
    .blockLink:hover {
        opacity: 1;
    }
    .srg div.g.pb {
    }`;
    let style = document.createElement('style');
    style.innerHTML = css;
    document.querySelector('head').appendChild(style);
})();