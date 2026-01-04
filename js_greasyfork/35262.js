// ==UserScript==
// @name Hidden PttChrome Scrollbar
// @description Helps you hide pttChrome Scrollbar
// @author tonyhom
// @version 0.1
// @encoding utf-8
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @icon https://raw.github.com/reek/anti-adblock-killer/master/anti-adblock-killer-icon.png
// @include http*://term.ptt.cc*/*
// @run-at document-start
// @connect *
// @namespace https://greasyfork.org/users/159548
// @downloadURL https://update.greasyfork.org/scripts/35262/Hidden%20PttChrome%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/35262/Hidden%20PttChrome%20Scrollbar.meta.js
// ==/UserScript==
(function(widonw){
    'use strict;'
    
    $("div.main").css('overflow-y','hidden');
})();

