// ==UserScript==
// @name         13dl
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      /^http:\/\/13dl.net\/.*$/
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/422462/13dl.user.js
// @updateURL https://update.greasyfork.org/scripts/422462/13dl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".entry-thumbnail").hide();
    $(".mh-header").hide();
    $(".entry-title").hide();
    $(".entry-meta").hide();
    $("#custom_html-4").hide();
    $("#mh_custom_posts-3").hide();
    $("#mh_custom_posts-12").hide();
    $("#wp_rp_first").hide();
    $(".mycss-td").filter(function( index ) {
        return !$(this).text().toLowerCase().includes('takefile');
    }).hide();
})();