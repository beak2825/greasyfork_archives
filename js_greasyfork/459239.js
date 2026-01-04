// ==UserScript==
// @name         Avoid get search redirecting
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script avoid some kind of hijacking from search redirecting when navigate in google from the search bar
// @author       Zetawave
// @match        https://www.getsearchredirecting.com/*
// @icon         https://img.icons8.com/external-flaticons-lineal-color-flat-icons/256/external-shuffle-edm-flaticons-lineal-color-flat-icons.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459239/Avoid%20get%20search%20redirecting.user.js
// @updateURL https://update.greasyfork.org/scripts/459239/Avoid%20get%20search%20redirecting.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var oldHref = document.location.href;

    window.onload = function() {
        var bodyList = document.querySelector("body")
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    window.location.href = oldHref;
                }
            });
        });

        var config = {
            childList: true,
            subtree: true
        };

        observer.observe(bodyList, config);
    };
})();