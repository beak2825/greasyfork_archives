// ==UserScript==
// @name         RS & LS Arrow Key Next/Prev Chapter
// @namespace    ultrabenosaurus.ReaperScans
// @version      0.3
// @description  Enable next / previous chapter on right / left arrow keys on Reaper Scans and Leviatan Scans.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://reaperscans.com/comics/*/1/*
// @match        https://leviatanscans.com/comics/*/1/*
// @icon         https://www.google.com/s2/favicons?domain=repaerscans.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404808/RS%20%20LS%20Arrow%20Key%20NextPrev%20Chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/404808/RS%20%20LS%20Arrow%20Key%20NextPrev%20Chapter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeyup = function(e){
        e = e || window.event;
        //console.log(e.keyCode);
        if (e.keyCode == '37') {
            // left arrow
            e.preventDefault();
            document.querySelectorAll('div.d-flex.justify-content-between.mt-4 div:first-child a.btn')[0].click();
        }
        else if (e.keyCode == '39') {
            // right arrow
            e.preventDefault();
            document.querySelectorAll('div.d-flex.justify-content-between.mt-4 div:last-child a.btn')[0].click();
        }

    };
})();