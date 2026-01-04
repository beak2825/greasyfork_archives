// ==UserScript==
// @name         抠掉超展开
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Instantly hide the rakuen link on bangumi.tv and bgm.tv.
// @match        https://bangumi.tv/*
// @match        https://bgm.tv/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483181/%E6%8A%A0%E6%8E%89%E8%B6%85%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/483181/%E6%8A%A0%E6%8E%89%E8%B6%85%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Redirect if the URL ends with /rakuen
    if (window.location.pathname === "/rakuen") {
        window.location.replace(window.location.origin);
    }

    // CSS to hide the link
    var css = 'a.top_lite[href="/rakuen"] { display: none !important; }';

    // Create a style element
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

    // Inject style element as early as possible
    document.head.appendChild(style);
})();
