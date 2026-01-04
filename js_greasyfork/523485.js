// ==UserScript==
// @name         PTT網頁版imgur自動開圖
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  最簡單直接的script，修復PTT網頁版imgur的陳年bug
// @author       unblue8914
// @match        https://www.ptt.cc/bbs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ptt.cc
// @grant        none
// @license      MIT

// @description:zh-TW   最簡單的script修復PTT imgur自動開圖
// @description:zh-CN   最簡單的script修復PTT imgur自動開圖
// @downloadURL https://update.greasyfork.org/scripts/523485/PTT%E7%B6%B2%E9%A0%81%E7%89%88imgur%E8%87%AA%E5%8B%95%E9%96%8B%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/523485/PTT%E7%B6%B2%E9%A0%81%E7%89%88imgur%E8%87%AA%E5%8B%95%E9%96%8B%E5%9C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const links = document.querySelectorAll("a");

    links.forEach((link) => {
        const href = link.href;

        if (href.includes("i.imgur.com")) {
            const div = document.createElement("div");
            div.className = "richcontent";

            const img = document.createElement("img");
            img.src = href;
            img.alt = "";
            img.loading = "lazy";
            img.referrerPolicy = "no-referrer";

            div.appendChild(img);
            link.insertAdjacentElement("afterend", div);
        }
    });
})();
