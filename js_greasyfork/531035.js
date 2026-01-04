// ==UserScript==
// @name         [Torn] Quick Slots Animation
// @namespace    https://www.github.com/TravisTheTechie
// @version      1.0
// @description  Reduces the animation speed for slots in Torn.
// @author       Travis Smith
// @match        https://www.torn.com/page.php?sid=slots
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531035/%5BTorn%5D%20Quick%20Slots%20Animation.user.js
// @updateURL https://update.greasyfork.org/scripts/531035/%5BTorn%5D%20Quick%20Slots%20Animation.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
(function() {
    'use strict';

    $.ajaxSetup({
        dataFilter: ajaxFilter
    });

    function ajaxFilter(data) {
        if (!data) return data;

        try {
            var tempData = JSON.parse(data);
            if (tempData?.barrelsAnimationSpeed) {
                tempData.barrelsAnimationSpeed = parseInt(tempData.barrelsAnimationSpeed / 10);
                data = JSON.stringify(tempData);
            }
        } catch {
            console.error('error parsing during AJAX dataFilter');
        }
        return data;
    }
})();