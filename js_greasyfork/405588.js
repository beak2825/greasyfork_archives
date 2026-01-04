// ==UserScript==
// @name         Navigator for Reaper Scans/Leviatan Scans/Zero Scans/No Names Scans/KKJ Scans/Edelgarde Scans
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A navigator to read the various mangas on multiple scan groups. Left arrow for previous chapter, right arrow for next chaper, up and down to scroll. Num 0 is back to the overview screen of the manga
// @author       rheaalleen
// @match        https://reaperscans.com/comics/*
// @match        https://leviatanscans.com/comics/*
// @match        https://zeroscans.com/comics/*
// @match        https://the-nonames.com/comics/*
// @match        https://kkjscans.co/comics/*
// @match        https://edelgardescans.com/comics/*
// @grant        none
// @namespace    https://greasyfork.org/en/users/599343
// @downloadURL https://update.greasyfork.org/scripts/405588/Navigator%20for%20Reaper%20ScansLeviatan%20ScansZero%20ScansNo%20Names%20ScansKKJ%20ScansEdelgarde%20Scans.user.js
// @updateURL https://update.greasyfork.org/scripts/405588/Navigator%20for%20Reaper%20ScansLeviatan%20ScansZero%20ScansNo%20Names%20ScansKKJ%20ScansEdelgarde%20Scans.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeydown = checkKey;

    function checkKey(e) {

        e = e || window.event;

        if (e.keyCode == '39') {
            var x = document.getElementsByClassName('btn btn-sm btn-outline-secondary text-uppercase border-0');
            window.location = x[2].getAttribute("href");
        }
        else if (e.keyCode == '37') {
            var y = document.getElementsByClassName('btn btn-sm btn-outline-secondary text-uppercase border-0');
            window.location = y[3].getAttribute("href");
        }
        else if (e.keyCode == '96') {
            var z = document.getElementsByClassName('btn btn-sm btn-outline-secondary text-uppercase border-0');
            window.location = z[0].getAttribute("href");
        }
}
})();