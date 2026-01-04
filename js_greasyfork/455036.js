// ==UserScript==
// @name         t.corp redirector
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  This script simply redirects tt.amazon.com to t.corp.amazon.com
// @author       Kanan Ibrahimov (ibrkanan@amazon.com)
// @include      http*://tt*/0*
// @include      http*://tt*/E*
// @include      http*://tt*/*
// @icon
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455036/tcorp%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/455036/tcorp%20redirector.meta.js
// ==/UserScript==
'use strict';

window.addEventListener('load', () => {

var a = window.location.pathname;

if (window.location.href = "http://tt.amazon.com/*") {

window.location.replace("https://t.corp.amazon.com"+a);

}

    })();