// ==UserScript==
// @name         Where is magnet!
// @license      GPL version 3
// @encoding     utf-8
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  你看，下多了视力模糊了吧？
// @date         2020/06/22
// @modified     2020/06/22
// @author       TautCony
// @match        https://www.liuli.se/*
// @match        https://www.liuli.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405867/Where%20is%20magnet%21.user.js
// @updateURL https://update.greasyfork.org/scripts/405867/Where%20is%20magnet%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (typeof jQuery === 'undefined') {
        return;
    }
    var container = jQuery('.entry-content');
    if (container.length === 0) {
        return;
    }
    var rawHtml = container.html();
    container.html(rawHtml.replace(/([a-fA-F0-9]{40})/g, function (a, b) {
        var url = `magnet:?xt=urn:btih:${b}`;
        return `<br><a style="color: #ff0070;font-weight: bold;font-size: 120%" href="${url}">${b}</a><br>`;
    }));
})();
