// ==UserScript==
// @name         Overleaf - project versioning full
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Unlock versioning, not just the last 24h!
// @author       Martino Mensio
// @match        https://www.overleaf.com/project/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/397752/Overleaf%20-%20project%20versioning%20full.user.js
// @updateURL https://update.greasyfork.org/scripts/397752/Overleaf%20-%20project%20versioning%20full.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var intervalId = setInterval(function() {
        console.log('unlocking versioning...');
        for (var el in $('.ng-scope')) {
            var scope = angular.element(el).scope();
            if (scope && scope.project) {
                scope.project.features.versioning = true;
                console.log('done unlocking versioning');
                clearInterval(intervalId);
                break;
            }
        }
    }, 1000);
})();