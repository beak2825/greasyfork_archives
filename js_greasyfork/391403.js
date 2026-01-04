// ==UserScript==
// @name         link fix for "Cockpit for Pixiv 5.0.0-beta.3"
// @namespace    https://greasyfork.org/ja/users/166153-hac
// @version      0.1
// @description  try to take over the world!
// @author       HAC
// @match        https://www.pixiv.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391403/link%20fix%20for%20%22Cockpit%20for%20Pixiv%20500-beta3%22.user.js
// @updateURL https://update.greasyfork.org/scripts/391403/link%20fix%20for%20%22Cockpit%20for%20Pixiv%20500-beta3%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Array.from(document.querySelectorAll('a[href^="member_illust.php?mode=medium&illust_id="]'))
        .forEach(a => a.setAttribute('href', (a.getAttribute('href')).replace(/member_illust\.php\?mode=medium&illust_id=(.+?)/, "/artworks/$1")));
})();