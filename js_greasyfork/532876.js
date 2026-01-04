// ==UserScript==
// @name         Google Scholar BibTeX Auto-Copy Pro
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  拦截BibTeX请求直接复制内容，无需页面跳转
// @match        https://scholar.google.com/scholar*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      scholar.googleusercontent.com
// @description   [自动复制BibTeX并关闭弹窗，无需页面跳转]
// @author        BIT-ljf
// @license       MIT
// @icon          https://scholar.google.com/favicon.ico
// @supportURL    https://github.com/yourname/repo/issues
// @downloadURL https://update.greasyfork.org/scripts/532876/Google%20Scholar%20BibTeX%20Auto-Copy%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/532876/Google%20Scholar%20BibTeX%20Auto-Copy%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 拦截BibTeX链接点击事件
    document.addEventListener('click', function(e) {
        const bibtexLink = e.target.closest('a[href*="/scholar.bib?"]');
        if (bibtexLink) {
            e.preventDefault();
            e.stopPropagation();

            // 通过AJAX获取BibTeX内容
            GM_xmlhttpRequest({
                method: "GET",
                url: bibtexLink.href,
                onload: function(res) {
                    if (res.status === 200) {
                        GM_setClipboard(res.responseText);
                        closeModal(); // 关闭引用弹窗
                    }
                }
            });
        }
    });

    // 关闭弹窗的函数
    function closeModal() {
        const closeBtn = document.querySelector('div#gs_cit div[aria-label="关闭"]');
        if (closeBtn) closeBtn.click();
        else window.history.back(); // 备用返回
    }

    // 处理直接打开BibTeX页面的情况（如手动刷新）
    if (window.location.href.includes('/scholar.bib?')) {
        GM_xmlhttpRequest({
            method: "GET",
            url: window.location.href,
            onload: function(res) {
                if (res.status === 200) {
                    GM_setClipboard(res.responseText);
                    window.close(); // 关闭当前标签页（如果是从新标签页打开）
                }
            }
        });
    }
})();