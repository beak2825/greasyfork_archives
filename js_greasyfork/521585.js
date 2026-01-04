// ==UserScript==
// @name         Clean Copy - Loigiaihay
// @namespace    https://greasyfork.org/users/1300060
// @version      1.0
// @description  Xóa dòng "Xem thêm tại..." khi sao chép từ loigiaihay.com
// @author       kishikuun
// @match        https://loigiaihay.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521585/Clean%20Copy%20-%20Loigiaihay.user.js
// @updateURL https://update.greasyfork.org/scripts/521585/Clean%20Copy%20-%20Loigiaihay.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('copy', (e) => {
        const selection = window.getSelection().toString();
        const cleanedText = selection.replace(/Xem thêm tại: https:\/\/loigiaihay\.com\/.*/g, '');
        e.clipboardData.setData('text/plain', cleanedText);
        e.preventDefault();
    });
})();
