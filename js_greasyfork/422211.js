// ==UserScript==
// @name         Always Rickroll
// @namespace    caidenblockalwaysrickroll
// @version      0.1
// @description  Replaces the url of any links to rick astley never gonna give you up
// @author       CaidenBlock
// @include      http://*/*
// @include      https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422211/Always%20Rickroll.user.js
// @updateURL https://update.greasyfork.org/scripts/422211/Always%20Rickroll.meta.js
// ==/UserScript==


//Changelog
// 0.1 - Initial Version

(function () {
    'use strict';
    //this matches any url, can be modified
    var filters = [
        /(?:.*)/i
    ];

    var isMatch = function (str) {
        return filters.filter(function (v) {
            return str.match(v);
        }).length > 0;
    };

    //Scan for links
    var scanRickRoll = function () {
        var a = document.querySelectorAll("a");
        for (var i = 0; i < a.length; i++) {

            if (a[i].href && isMatch(a[i].href)) {
                a[i].href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            }
        }
    };
    var scheduleUpdater = function () {
        if (!scheduleUpdater.timer) {
            scheduleUpdater.timer = window.setTimeout(function () {
                scanRickRoll();
                scheduleUpdater.timer = false;
            }, 500);
        }
    };
    scanRickRoll();
    var mo = new MutationObserver(scheduleUpdater);
    mo.observe(document.body, {
        subtree: true,
        attributes: true,
        childList: true
    });
})();
