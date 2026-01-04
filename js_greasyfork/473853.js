// ==UserScript==
// @name         sp to www
// @namespace    https://github.com/achapi/sp-to-www
// @version      1.1
// @description  sp.nicovideo.jp → www.nicovideo.jp
// @author       achapi
// @match        sp.nicovideo.jp/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473853/sp%20to%20www.user.js
// @updateURL https://update.greasyfork.org/scripts/473853/sp%20to%20www.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var uri = new URL(window.location.href);
    if (uri.hostname == "sp.nicovideo.jp"){
        uri.hostname = "www.nicovideo.jp";
        window.location.href = uri.href;
    }
})();