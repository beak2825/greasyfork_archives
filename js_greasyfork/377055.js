// ==UserScript==
// @name                Force HTTPS to HTTP (flyertea)
// @namespace           hntee
// @version             1.0.0
// @run-at              document-start
// @description         Force HTTPS links to use HTTP. You need to write your own @match or @include rules!
// @match https://www.flyertea.com/*
// @downloadURL https://update.greasyfork.org/scripts/377055/Force%20HTTPS%20to%20HTTP%20%28flyertea%29.user.js
// @updateURL https://update.greasyfork.org/scripts/377055/Force%20HTTPS%20to%20HTTP%20%28flyertea%29.meta.js
// ==/UserScript==

document.location.replace(document.location.href.replace(/https\:/, 'http:'));