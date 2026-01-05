// ==UserScript==
// @name        tapuz stop link ads
// @namespace   tapuzLink
// @description stops tapuz from replacing links in ads
// @include     http://www.tapuz.co.il/forums2008/*
// @version     1
// @grant       none
// @license     public domain http://unlicense.org/
// @downloadURL https://update.greasyfork.org/scripts/13015/tapuz%20stop%20link%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/13015/tapuz%20stop%20link%20ads.meta.js
// ==/UserScript==
$(document).ready(function() {
    setTimeout(function () {
       $('body').off('mousedown', 'a[href^=http], a[data-href^=http]');
    }, 2000);
});