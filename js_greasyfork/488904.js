// ==UserScript==
// @name         Usless mod for blockcoin.social
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes it so everyone has infinite followers/views/likes/comments/price lol
// @author       S4IL
// @match        https://blockcoin.social/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488904/Usless%20mod%20for%20blockcoinsocial.user.js
// @updateURL https://update.greasyfork.org/scripts/488904/Usless%20mod%20for%20blockcoinsocial.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to modify various counts
    function modifyCounts() {
        var elementsToModify = [
            {class: "follower-count-int", text: "99999999999999"},
            {class: "views", text: "99999999999999"},
            {class: "likes", text: "99999999999999"},
            {class: "comment", text: "99999999999999"},
            {class: "blockcoin", text: "99999999999999"}
        ];

        elementsToModify.forEach(function(elementInfo) {
            var elements = document.getElementsByClassName(elementInfo.class);
            for (var i = 0; i < elements.length; i++) {
                elements[i].textContent = elementInfo.text;
            }
        });
    }

    // Execute the function when the page is fully loaded
    window.addEventListener('load', function() {
        modifyCounts();
    });

    // Execute the function when new elements are added to the DOM (to handle dynamic changes)
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                modifyCounts();
            }
        });
    });

    // Configure and observe the DOM
    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();
