// ==UserScript==
// @name         Rewrite exhentai to e-hentai
// @namespace    http://tampermonkey.net/
// @version      1
// @description  重定向E站里站链接到表站
// @match        *://exhentai.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466748/Rewrite%20exhentai%20to%20e-hentai.user.js
// @updateURL https://update.greasyfork.org/scripts/466748/Rewrite%20exhentai%20to%20e-hentai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var newUrl = window.location.href.replace('exhentai.org', 'e-hentai.org');
    window.location.replace(newUrl);
})();