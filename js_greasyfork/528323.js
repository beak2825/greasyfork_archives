// ==UserScript==
// @name         frdl Redirector 
// @namespace    https://kdroidwin.hatenablog.com/
// @version      1.2
// @description  Redirects frdl.to, frdl.is, frdl.io, frdl.hk links to fredl.ru
// @match        *://frdl.to/*
// @match        *://frdl.is/*
// @match        *://frdl.io/*
// @match        *://frdl.hk/*
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528323/frdl%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/528323/frdl%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const newUrl = location.href.replace(/frdl\.(to|is|io|hk)/, "fredl.ru");
    location.replace(newUrl);
})();
