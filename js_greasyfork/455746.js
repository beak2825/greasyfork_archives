// ==UserScript==
// @name            灰色化全部网页
// @name:en         Graylify
// @version         1.0
// @description     纪念|默哀|灰色化所有网页
// @description:en  make every website gray
// @match           *
// @include         *
// @author          3anya T0n1c
// @grant           none
// @license         MIT
// @namespace       https://github.com/Eanya-Tonic/Graylify
// @downloadURL https://update.greasyfork.org/scripts/455746/%E7%81%B0%E8%89%B2%E5%8C%96%E5%85%A8%E9%83%A8%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/455746/%E7%81%B0%E8%89%B2%E5%8C%96%E5%85%A8%E9%83%A8%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var body = document.getElementsByTagName("body");
    body[0].style.cssText = "filter: grayscale(0) blur(0px) contrast(1) saturate(0.1) !important";
})();