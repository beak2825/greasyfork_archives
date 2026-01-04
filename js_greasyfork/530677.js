// ==UserScript==
// @name           Wider ANU Timetable
// @description Makes the ANU Timetable wider
// @description:en Makes the ANU Timetable wider, so that you can read all of the entries better.
// @namespace      http://doi.ac
// @match          https://mytimetable.anu.edu.au/even/timetable/*
// @match          https://mytimetable.anu.edu.au/odd/timetable/*
// @version        0.2
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/530677/Wider%20ANU%20Timetable.user.js
// @updateURL https://update.greasyfork.org/scripts/530677/Wider%20ANU%20Timetable.meta.js
// ==/UserScript==


(function() {
    'use strict';

    window.addEventListener('load', function() {
        var header = document.getElementById('outer-header');
        var container = document.querySelector('.aplus-container');
        
        if (header) {
            header.style.setProperty('max-width', 'none', 'important');
        }
        if (container) {
            container.style.setProperty('max-width', 'none', 'important');
        }
        
        // Force reflow by reading a layout property
        if (header || container) {
            var dummy = (header || container).offsetHeight;
            // Optionally, dispatch a resize event to help trigger any additional layout adjustments
            window.dispatchEvent(new Event('resize'));
        }
    });
})();