// ==UserScript==
// @name         Disable Google Search Image Previews On Hover
// @name:zh      禁止谷歌搜索结果鼠标悬停自动加载图片预览
// @description  Disable text and search image previews on hover
// @description:zh  禁止谷歌搜索结果鼠标悬停自动加载图片预览
// @namespace    https://github.com/fengcen
// @version      1.2
// @author       fengcen
// @include      /^https?://www.google\.[a-z]+/search\?/
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418819/Disable%20Google%20Search%20Image%20Previews%20On%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/418819/Disable%20Google%20Search%20Image%20Previews%20On%20Hover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.g a[data-ved][ping]').on('mouseover', event => {
        event.stopPropagation();
    });

    $('.g svg').each(function() { $(this).parent().on('mouseover', event => event.stopPropagation()) });
})();