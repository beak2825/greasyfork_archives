// ==UserScript==
// @name     Xiaowaz Left/Right Arrow Key Navigation
// @author  sm00nie and Ahemos for Xiaowaz
// @version  1.04
// @description left and right arrow key navigation to the previous or next manga in the series
// @grant    none
// @include /^https?:\/\/(?:www\.)?(xiaowaz\.fr)(?:.*)$/
// @namespace https://greasyfork.org/users/165048 https://greasyfork.org/fr/users/502058-0-zone
// @downloadURL https://update.greasyfork.org/scripts/400400/Xiaowaz%20LeftRight%20Arrow%20Key%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/400400/Xiaowaz%20LeftRight%20Arrow%20Key%20Navigation.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let next, previous;

    document.addEventListener("keyup", function(event) {
        // xiaowaz
        var container = document.querySelector("#content");
        if (event.keyCode == 37 && previous !== null) {
        container.querySelectorAll('div.wp-post-navigation-pre > a')[0].click();
            } else if(event.keyCode == 39 && next !== null) {
        container.querySelectorAll('div.wp-post-navigation-next > a')[0].click();
                }
    })
})();