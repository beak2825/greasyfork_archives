// ==UserScript==
// @name         禁止瑟瑟
// @namespace    http://tampermonkey.net/
// @version      2024-05-19
// @description  stop h!!!
// @author       You
// @match        https://e-hentai.org/*
// @match        https://www.south-plus.net/*
// @match        https://x.com/*
// @match        https://www.xvideos.com/*
// @match        https://jable.tv/*
// @match        https://91porn.com/*
// @match        https://sexinsex.net/*
// @match        https://hanime1.me/*
// @match        https://*.pornhub.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/497142/%E7%A6%81%E6%AD%A2%E7%91%9F%E7%91%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/497142/%E7%A6%81%E6%AD%A2%E7%91%9F%E7%91%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let stopNum = 0;
    stopNum = GM_getValue('stopNum_data', stopNum) + 1;
    GM_setValue("stopNum_data", stopNum);
    document.write(`<div style="color: red; font-size: 64px;text-align: center;">别做一个废物了,好好想想这样对身体好吗？</br>今天该做的事做完了吗？</br>我已经劝了你${stopNum}次，我还能劝您多少次？</div>`);
    window.stop();
})();