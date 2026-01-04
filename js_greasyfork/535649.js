// ==UserScript==
// @name         エッヂ Link Rewriter for kyodemo
// @license       GPL-3.0
// @version      1.2
// @description  Kyodemo.net上でbbs.eddibb.ccのliveedgeリンクのみを書き換える
// @match        *://www.kyodemo.net/*
// @grant        none
// @namespace https://greasyfork.org/users/1344730
// @downloadURL https://update.greasyfork.org/scripts/535649/%E3%82%A8%E3%83%83%E3%83%82%20Link%20Rewriter%20for%20kyodemo.user.js
// @updateURL https://update.greasyfork.org/scripts/535649/%E3%82%A8%E3%83%83%E3%83%82%20Link%20Rewriter%20for%20kyodemo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function rewriteLinks() {
        const links = document.querySelectorAll('a[href^="https://bbs.eddibb.cc/liveedge/"]');
        links.forEach(link => {
            const match = link.href.match(/^https:\/\/bbs\.eddibb\.cc\/liveedge\/(\d+)$/);

            // 条件: hrefも表示テキストも完全一致している場合だけ書き換え
            if (match && link.textContent.trim() === link.href.trim()) {
                const id = match[1];
                const newUrl = `http://bbs.eddibb.cc/test/read.cgi/liveedge/${id}/`;
                link.href = newUrl;
                link.textContent = newUrl;
            }
        });
    }

    // 初回実行
    rewriteLinks();

    // DOM変化にも対応
    const observer = new MutationObserver(rewriteLinks);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
