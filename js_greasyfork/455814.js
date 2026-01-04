// ==UserScript==
// @name         fuck grayscale
// @namespace    color
// @version      1.0
// @description  移除网页公祭日效果
// @author       ckpro
// @license      GPL-3.0-or-later
// @match        *://*/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/455814/fuck%20grayscale.user.js
// @updateURL https://update.greasyfork.org/scripts/455814/fuck%20grayscale.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByTagName("body")[0].style.cssText="-webkit-filter:grayscale(0%) !important; -moz-filter:grayscale(0%) !important;  -ms-filter:grayscale(0%) !important;"+
        " -o-filter:grayscale(0%) !important;  filter:grayscale(0%) !important;  filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=0) !important; -webkit-filter:grayscale(0) !important;";
    document.getElementsByTagName("head")[0].style.cssText="-webkit-filter:grayscale(0%) !important; -moz-filter:grayscale(0%) !important;  -ms-filter:grayscale(0%) !important;"+
        " -o-filter:grayscale(0%) !important;  filter:grayscale(0%) !important;  filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=0) !important; -webkit-filter:grayscale(0) !important;";
    document.getElementsByTagName("html")[0].style.cssText="-webkit-filter:grayscale(0%) !important; -moz-filter:grayscale(0%) !important;  -ms-filter:grayscale(0%) !important;"+
        " -o-filter:grayscale(0%) !important;  filter:grayscale(0%) !important;  filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=0) !important; -webkit-filter:grayscale(0) !important;";
})();

