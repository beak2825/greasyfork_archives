// ==UserScript==
// @name         Google Scholar BibTeX Auto Copy and Navigate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically copy the BibTeX citation from Google Scholar to clipboard and navigate back or close the page
// @author       rsic
// @match        https://scholar.googleusercontent.com/scholar.bib*
// @grant        GM_setClipboard
// @grant        GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519918/Google%20Scholar%20BibTeX%20Auto%20Copy%20and%20Navigate.user.js
// @updateURL https://update.greasyfork.org/scripts/519918/Google%20Scholar%20BibTeX%20Auto%20Copy%20and%20Navigate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取页面内容
    const bibtexContent = document.body.innerText;

    // 将内容复制到剪切板
    GM_setClipboard(bibtexContent);

    // 显示通知
    GM_notification({
        text: 'BibTeX citation copied to clipboard!',
        title: 'Success',
        timeout: 2000
    });

    // 判断是否可以返回上一页
    if (window.history.length > 1) {
        // 如果历史记录有上一页，返回上一页
        window.history.back();
    } else {
        // 如果没有上一页，关闭当前页面
        window.close();
    }
})();
