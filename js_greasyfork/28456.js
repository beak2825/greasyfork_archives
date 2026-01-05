// ==UserScript==
// @name         Dribbble Zoomer
// @name:en      Dribbble Zoomer
// @namespace    http://ronaldtroyer.com
// @version      0.1
// @description  Auto Expand Zoomable Content
// @author       Ronald Troyer
// @match        http*://*dribbble.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28456/Dribbble%20Zoomer.user.js
// @updateURL https://update.greasyfork.org/scripts/28456/Dribbble%20Zoomer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.expander = function () {
        $('.shot-overlay .zoomable').each(function() {
            if (! $(this).attr('class').match('full')) {
                $('.zoomable .the-shot img').first().click();
            }
        });
    };
    window.truepush = History.pushState;
    History.pushState = function(a,b,c) {
        setTimeout(window.expander,200);
        window.truepush(a,b,c);
    };
})();