// ==UserScript==
// @name         wikipedia域名重定向
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  维基百科M站域名重定向到PC站
// @author       imgreasy
// @match	 *://*.m.wikipedia.org/*
// @grant        none
// @license      MIT
// @run-at	 document-start
// @downloadURL https://update.greasyfork.org/scripts/452157/wikipedia%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/452157/wikipedia%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    window.location.replace(location.href.replace("m.wikipedia.org", "wikipedia.org"));
})();