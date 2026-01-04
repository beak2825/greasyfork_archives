// ==UserScript==
// @name         Copy Url
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      GPL-3.0-only
// @description  Copy current page url as text & link
// @author       Kingron
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/524695/Copy%20Url.user.js
// @updateURL https://update.greasyfork.org/scripts/524695/Copy%20Url.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var linkMenu;
    var linkMove;

    function copy(title, url, event) {
        const href = `<a href="${url}" title="${decodeURIComponent(url)}">${title.trim()}</a>`;

        try {
            const clipboardItem = new ClipboardItem({
                'text/plain': new Blob([url], { type: 'text/plain' }),
                'text/html': new Blob([href], { type: 'text/html' })
            });
            navigator.clipboard.write([clipboardItem]);
            console.log('复制成功：', title, href);
        } catch (err) {
            console.error("复制失败: ", err);
            const cd = event?.clipboardData || window.clipboardData;
            if (cd) {
                console.log('使用老方法复制: ', title, href);
                cd.setData('text/plain', url);
                cd.setData('text/html', href);
            }
        }
    }

    document.addEventListener('mousemove', function(event) {
        linkMove = event.target.closest('a');
    });

    document.addEventListener('copy', async function (event) {
        const selection = document.getSelection();
        if (selection && selection.toString().trim()) {
            return; // If selection then return
        }
        if (linkMove) {
            copy(linkMove.textContent, linkMove.href, event);
        } else {
            copy(document.title, window.location.href, event);
        }

        event.preventDefault();
    });

    GM_registerMenuCommand('复制超链接', function(e) {
        if (linkMenu) copy(linkMenu.textContent || linkMenu.innerText || linkMenu.href, linkMenu.href || window.getSelection().toString());
    });
    GM_registerMenuCommand('复制链接文字', function(e) {
        if (linkMenu) navigator.clipboard.writeText(linkMenu.textContent || linkMenu.innerText || window.getSelection().toString() || linkMenu.href);
    });
    GM_registerMenuCommand('复制解码后的链接地址', function(e) {
        if (linkMenu) navigator.clipboard.writeText(decodeURIComponent(linkMenu.href));
    });

    document.addEventListener('contextmenu', function(event) {
        linkMenu = event.target.closest('a');
    });
})();