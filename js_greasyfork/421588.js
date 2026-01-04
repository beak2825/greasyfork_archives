// ==UserScript==
// @name         Google redirection
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Redirect from other Google sites to the US site.
// @author       loikein
// @include      *://*.google.de/*
// @include      *://*.google.co.jp/*
// @include      *://*.google.com.hk/*
// @include      *://*.google.co.uk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421588/Google%20redirection.user.js
// @updateURL https://update.greasyfork.org/scripts/421588/Google%20redirection.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var link = String(window.location.href).replace(/google[\.a-z]*/, "google.com");
    window.open(link, "_self");
})();