// ==UserScript==
// @name         对分易下载
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  破解对分易下载，将禁止下载替换为下载链接
// @author       Zky
// @match        https://www.duifene.com/_FileManage/PC/StFileManage.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480204/%E5%AF%B9%E5%88%86%E6%98%93%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/480204/%E5%AF%B9%E5%88%86%E6%98%93%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        document.querySelectorAll('div.action > div > span').forEach(function(downloadSpan, index) {
            var fileLinkElement = downloadSpan.closest('div[data-id]').querySelector('a[onclick^="FileViewAction"]');
            if (fileLinkElement) {
                var fileLink = fileLinkElement.getAttribute('onclick');
                var filePath = /FileViewAction\(\d+,'([^']+)'/i.exec(fileLink)[1];
                var downloadLink = 'https://fs.duifene.com' + filePath;
                downloadSpan.innerHTML = '<a href="' + downloadLink + '" style="text-decoration: underline; color: blue; cursor: pointer;">下载</a>';
            }
        });
    }, 3000);
})();
