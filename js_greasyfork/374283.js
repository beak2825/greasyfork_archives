// ==UserScript==
// @name Mangadex Navbar
// @description Make the navigation bar scroll up
// @namespace Violentmonkey Scripts
// @match *://mangadex.org/chapter/*
// @grant none
// @icon https://mangadex.org/images/misc/navbar.svg?3
// @require http://code.jquery.com/jquery-latest.js
// @version 0.0.1.20181112073226
// @downloadURL https://update.greasyfork.org/scripts/374283/Mangadex%20Navbar.user.js
// @updateURL https://update.greasyfork.org/scripts/374283/Mangadex%20Navbar.meta.js
// ==/UserScript==
$(document).ready(function() {
  $('.fixed-top').css('position', 'absolute');
});