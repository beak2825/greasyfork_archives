// ==UserScript==
// @name         FA gear
// @namespace    https://greasyfork.org/en/scripts/525591-fa-gear
// @version      0.11
// @description  FA enhancement
// @author       Boni
// @match        https://www.furaffinity.net/*
// @grant        none
// @license      GPL-3.0-or-later
// @icon         https://www.google.com/s2/favicons?sz=64&domain=furaffinity.net
// @downloadURL https://update.greasyfork.org/scripts/525591/FA%20gear.user.js
// @updateURL https://update.greasyfork.org/scripts/525591/FA%20gear.meta.js
// ==/UserScript==


(function() {
    'use strict';

    window.addEventListener("load", function() {
        document.querySelectorAll(".notifications-by-date").forEach(section => {
            let images = section.querySelectorAll("figure");
            let blockedImages = section.querySelectorAll("img.blocked-content");

            if (images.length === blockedImages.length) {
                // Remove the entire section if all images are blocked
                section.remove();
            } else if (blockedImages.length === 1) {
                // Remove the single blocked image if only one is blocked
                blockedImages[0].closest("figure").remove();
            }
        });

        document.querySelectorAll(".section-body").forEach(section => {
            section.querySelectorAll("figure").forEach(figure => {
                if (figure.querySelector("img.blocked-content")) {
                    figure.remove();
                }
            });
        });
    });
})();