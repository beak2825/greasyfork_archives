// ==UserScript==
// @name         vertical ltr for poems 诗文竖排阅读
// @namespace    http://tampermonkey.net/
// @version      2024-12-21
// @description  诗文竖排阅读
// @author       SodaCris
// @match        https://www.gushiwen.cn/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gushiwen.cn
// @grant        GM_addStyle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/521394/vertical%20ltr%20for%20poems%20%E8%AF%97%E6%96%87%E7%AB%96%E6%8E%92%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/521394/vertical%20ltr%20for%20poems%20%E8%AF%97%E6%96%87%E7%AB%96%E6%8E%92%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    div.left {
    div.cont{
    display: flex;

    writing-mode: vertical-rl;

    }
    .sons {
    display: flex;
    justify-content: flex-start;
    flex-direction: row-reverse;
}
}
.maintopbc .maintop .cont {
width: 100% !important;
}
.main3 {
width: 100% !important;
}
.main3 .left {
margin-left: 5%;
.sons {
height: 300px;
}
}

.left {
margin-left: 5% !important;
}

.right {
width: 100%;
}
    `);

    document.querySelector('.right>.son2').style.cssFloat = "none";
    document.querySelector('.right').style.cssFloat = "none";
})();