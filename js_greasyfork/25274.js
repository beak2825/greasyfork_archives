// ==UserScript==
// @name         TVTropes readability
// @namespace    https://zblesk.net/blog
// @version      0.91
// @description  Some tweaks for better readability. Increases the font size and colors every even link differently, so you can better navigate the blue soup of many consecutive links. (Try it here: http://tvtropes.org/pmwiki/pmwiki.php/Main/AllBlueEntry ) 
// @author       zblesk
// @include      http://tvtropes.org/*
// @include      https://tvtropes.org/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/25274/TVTropes%20readability.user.js
// @updateURL https://update.greasyfork.org/scripts/25274/TVTropes%20readability.meta.js
// ==/UserScript==


(function() {
    'use strict';
    $(".page-content a:even").css("color", "#ff7200");
    $('.page-content').css('font-size', '150%');
})();