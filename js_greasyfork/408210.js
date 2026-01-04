// ==UserScript==
// @name         Youtube (AdBlocker)
// @version      v2.6
// @description  Helps you browse youtube like a king with nothing stopping you! (This adblocker disables the like and dislike function completely!)
// @author       Exotic Scripts
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @run-at       document-end
// @iconURL      https://cdn3.iconfinder.com/data/icons/social-media-logos-flat-colorful/2048/5295_-_Youtube_I-512.png
// @match        https://www.youtube.com/*
// @copyright    exotic (2019-2020)
// @grant        none
// @namespace https://greasyfork.org/users/673343
// @downloadURL https://update.greasyfork.org/scripts/408210/Youtube%20%28AdBlocker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408210/Youtube%20%28AdBlocker%29.meta.js
// ==/UserScript==
jQuery('#info-container').remove()
jQuery('#player').remove()
jQuery('#banner').remove()
jQuery('#click-target').remove()
jQuery('#button').remove()
setInterval(function() {
    jQuery('#masthead-ad').remove()
}, 100);
setInterval(function() {
    jQuery('#title').remove()
}, 100);
setInterval(function() {
    jQuery('#description').remove()
}, 100);
setInterval(function() {
    jQuery('#format-container').remove()
}, 100);
jQuery('#text').remove()
jQuery('#paper-button').remove()
jQuery('.ytd-button-renderer').remove()
jQuery('#text').remove()
jQuery('#paper-button').remove()
jQuery('.ytd-button-renderer').remove()
jQuery('#text').remove()
jQuery('#paper-button').remove()
jQuery('.ytd-button-renderer').remove()
jQuery('#text').remove()
jQuery('#paper-button').remove()
jQuery('.ytd-button-renderer').remove()
jQuery('#text').remove()
jQuery('#paper-button').remove()
jQuery('.ytd-button-renderer').remove()
jQuery('#text').remove()
jQuery('#paper-button').remove()
jQuery('.ytd-button-renderer').remove()
setInterval(function() {
    jQuery('#paper-button').remove()
}, 1000);
setInterval(function() {
    jQuery('.ytd-menu-renderer').remove()
}, 1000);
setInterval(function() {
    jQuery('#root-container').remove()
}, 1000);
setTimeout(function() {
    jQuery('#paper-button').remove()
}, 5000);
jQuery('#banner').remove()
setInterval(function() {
    jQuery('#block').remove()
}, 1000);
setInterval(function() {
    jQuery('.ytp-ad-text-overlay').remove()
}, 100);