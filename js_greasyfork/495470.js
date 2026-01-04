// ==UserScript==
// @name        Remove subscription popup on washingtonpost.com
// @namespace   Violentmonkey Scripts
// @match       https://www.washingtonpost.com/*
// @grant       none
// @version     1.0
// @author      Matthew Hugley
// @description Removes the subscription popup on The Washington Post
// @license BSD 3-Clause
// @downloadURL https://update.greasyfork.org/scripts/495470/Remove%20subscription%20popup%20on%20washingtonpostcom.user.js
// @updateURL https://update.greasyfork.org/scripts/495470/Remove%20subscription%20popup%20on%20washingtonpostcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        var element = document.getElementById("wall-bottom-drawer");
        if (element) {
            element.style.height = "0";
        }

        var elements = document.getElementsByClassName("bg-black");
        if (elements.length > 0) {
            elements[0].classList.remove("bg-black", "fixed");
        }

        document.body.style.overflow = "auto";
    };
})();