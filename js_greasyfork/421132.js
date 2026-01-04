// ==UserScript==
// @name         Navigator for Reaper Scans/Leviatan Scans/Zero Scans/No Names Scans/KKJ Scans/Edelgarde Scans
// @namespace    secpick.ReaperScans
// @version      0.2
// @description  A navigator to read the various mangas on multiple scan groups. Left arrow for previous chapter, right arrow for next chaper. 0 is back to the overview screen of the manga
// @author       secpick
// @match        https://reaperscans.com/comics/*
// @match        https://leviatanscans.com/comics/*
// @match        https://zeroscans.com/comics/*
// @match        https://the-nonames.com/comics/*
// @match        https://kkjscans.co/comics/*
// @match        https://edelgardescans.com/comics/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421132/Navigator%20for%20Reaper%20ScansLeviatan%20ScansZero%20ScansNo%20Names%20ScansKKJ%20ScansEdelgarde%20Scans.user.js
// @updateURL https://update.greasyfork.org/scripts/421132/Navigator%20for%20Reaper%20ScansLeviatan%20ScansZero%20ScansNo%20Names%20ScansKKJ%20ScansEdelgarde%20Scans.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    document.onkeydown = checkKey;
 
    function get_href(which) {
        var btn_class = which == 'home' ? 'fa-home-alt' : 'fa-arrow-' + which
        var btn = document.getElementsByClassName(btn_class)[0]
        if (btn) {
            return btn.parentElement.href
        }
    }
 
    function checkKey(e) {
 
        e = e || window.event;
 
        if (e.keyCode == '39') {
            // right arrow
            window.location = get_href('right') || get_href('home')
        }
        else if (e.keyCode == '37') {
            // left arrow
            window.location = get_href('left') || get_href('home')
        }
        else if (e.keyCode == '48') {
            // home
            window.location = get_href('home')
        }
    }
})();