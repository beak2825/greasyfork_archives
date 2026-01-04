// ==UserScript==
// @name         Fix Garbled Titles in Lanraragi Upload
// @name:zh-CN 修复LANraragi上传页文件名乱码
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Fixes garbled titles on the Lanraragi upload page and appends the original source link. Utilizes the page's built-in jQuery to avoid conflicts. Please modify the @match section below to match your Lanraragi BaseURL.
// @description:zh-CN 修复Lanraragi上传页面中的乱码标题，并追加原始链接。使用页面内置的jQuery以避免冲突。请先修改下面的@match段以匹配您的Lanraragi基础URL。
// @author       Jade
// @match        https://lanraragi.example.com/upload
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531194/Fix%20Garbled%20Titles%20in%20Lanraragi%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/531194/Fix%20Garbled%20Titles%20in%20Lanraragi%20Upload.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待页面 jQuery 加载完毕
    function waitForjQuery(callback) {
        const check = () => {
            if (typeof window.jQuery !== 'undefined') {
                callback(window.jQuery);
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    }

    waitForjQuery(function ($) {
        // 解码乱码
        function decodeGarbled(str) {
            try {
                return decodeURIComponent(escape(str));
            } catch {
                return str;
            }
        }

        function isPureURL(str) {
            return /^https?:\/\/\S+$/i.test(str.trim());
        }

        function fixTitleAndAppendURL($link) {
            if (!$link.length || $link[0].dataset.fixed) return;
            const href = $link.attr("href");
            if (!href || href === "#") return;

            const originalText = $link.text();
            const fixedText = decodeGarbled(originalText);

            if (originalText === fixedText || isPureURL(fixedText)) return;

            $link.text(fixedText);

            const url = $link.attr("title");
            if (url) {
                $link.after(`<br><a href="${url}" target="_blank" style="color:blue;">[Source Link]</a>`);
            }

            $link[0].dataset.fixed = "true";
        }

        function processAllLinks(root = document) {
            $(root)
                .find('a[id$="-name"]')
                .each(function () {
                    fixTitleAndAppendURL($(this));
                });
        }

        function observeAndFix() {
            const target = document.getElementById("files");
            if (!target) return;

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            processAllLinks(node);
                        }
                    });

                    if (mutation.type === "characterData" || mutation.type === "childList") {
                        const parent = mutation.target.closest?.("a[id$='-name']");
                        if (parent) fixTitleAndAppendURL($(parent));
                    }
                });
            });

            observer.observe(target, {
                childList: true,
                subtree: true,
                characterData: true,
            });

            processAllLinks(target);
        }

        $(document).ready(observeAndFix);
    });
})();
