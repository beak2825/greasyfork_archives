// ==UserScript==
// @name        Direct links for flashback.org
// @namespace   flashback
// @match       https://www.flashback.org/*
// @grant       none
// @version     1.0
// @author      divergent001911
// @description 2024-08-03, 00:42:27
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502471/Direct%20links%20for%20flashbackorg.user.js
// @updateURL https://update.greasyfork.org/scripts/502471/Direct%20links%20for%20flashbackorg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var links = document.querySelectorAll('a[href*="/leave.php?u="]');
    links.forEach(function(link) {
        var url = new URL(link.href);
        var directLink = decodeURIComponent(url.searchParams.get('u'));
        link.href = directLink;
    });
})();