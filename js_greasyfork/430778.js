// ==UserScript==
// @name         Pixiv new page opener
// @name:zh-CN   Pixiv new page opener
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  A tool to open some of pixiv pages in a new tab
// @description:zh-CN  一个用于将某些pixiv页面在新标签页打开的工具
// @author       Paper-Folding
// @match        https://www.pixiv.net/**
// @icon         https://www.google.com/s2/favicons?domain=pixiv.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/430778/Pixiv%20new%20page%20opener.user.js
// @updateURL https://update.greasyfork.org/scripts/430778/Pixiv%20new%20page%20opener.meta.js
// ==/UserScript==

(function () {
    "use strict";

    setInterval(() => {
        if (
            document.URL.search(
                /discovery|bookmark_new_illust|tags|following|users/
            ) !== -1 ||
            location.pathname === "/"
        ) {
            for (const a of document.querySelectorAll("li a")) {
                if (a.target === "_blank") {
                    continue;
                }

                if (!a.href.startsWith("https://www.pixiv.net/artworks/")) {
                    continue;
                }
                a.target = "_blank";
                a.rel = "noopener noreferrer";
            }
        }
    }, 1000);
})();
