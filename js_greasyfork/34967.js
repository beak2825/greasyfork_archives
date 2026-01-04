// ==UserScript==
// @name        Remove Forum Banner
// @description Remove Support Forum Banner
// @namespace   www.mirthcorp.com
// @version     1
// @include     http://www.mirthcorp.com/community/forums/*
// @include     https://www.mirthcorp.com/community/forums/*
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/34967/Remove%20Forum%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/34967/Remove%20Forum%20Banner.meta.js
// ==/UserScript==

$.noConflict();
jQuery(document).ready(function() {
  jQuery('#wrapper > a').remove();
});