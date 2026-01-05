// ==UserScript==
// @name        Remove about tab
// @namespace   Mrcomputer1
// @description Removes the scratch about tab
// @include     http://scratch.mit.edu/*
// @include     https://scratch.mit.edu/*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11545/Remove%20about%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/11545/Remove%20about%20tab.meta.js
// ==/UserScript==
$(".site-nav").find('a[href="/about/"]').parent().remove();
$("#search-input").css("width", "190px");