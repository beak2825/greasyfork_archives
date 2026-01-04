// ==UserScript==
// @name         Bilibili selectable danmu comments
// @name:ja      Bilibili選択可能弾幕コメント
// @license      BSD 3-Clause License 

// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Learning Chinese blazing fastly.
// @description:ja  Learning Chinese blazing fastly.
// @author       You
// @match        https://www.bilibili.com/video/*

// @require      https://unpkg.com/url-parse@1.5.1/dist/url-parse.js

// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/448301/Bilibili%20selectable%20danmu%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/448301/Bilibili%20selectable%20danmu%20comments.meta.js
// ==/UserScript==

(async function()
{
    const sleep = m => new Promise(r => setTimeout(r, m));
    await sleep(200);
    while (true) {
        await sleep(200); // mseconds
        document.querySelector('div[class="bilibili-player-video-danmaku"]').style.zIndex = 69;
        document.querySelectorAll('div[class="b-danmaku"]').forEach(a => {
            a.style.userSelect = "text";
            a.style.pointerEvents = "all";
            a.style.cursor = "text";
        })
    }
})();
