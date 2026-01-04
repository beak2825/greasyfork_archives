// ==UserScript==
// @name                instagram to imgsed
// @description         Redirect instagram to imgsed
// @version             1.0
// @namespace    http://tampermonkey.net/
// @run-at       document-start
// @match      https://www.instagram.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474409/instagram%20to%20imgsed.user.js
// @updateURL https://update.greasyfork.org/scripts/474409/instagram%20to%20imgsed.meta.js
// ==/UserScript==

var url = document.URL;
var regex1 = /^https?:\/\/(\w+)\.instagram\.com\/([^\?#]+)(\?[^#]+)?(#.+)?/;
if (regex1.test(url)) {
    window.location.replace(url.replace(regex1, 'https://www.imgsed.com/$2$4'));
    }