// ==UserScript==
// @name         Dizipal video oncesi reklam gecici
// @version      2024-02-03
// @namespace    https://dizipal845.com/
// @description  Dizipal video oncesi reklamlari gecmek icin bir user script
// @author       You
// @include        https://dizipal*.com/*
// @icon         https://dizipal845.com/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523147/Dizipal%20video%20oncesi%20reklam%20gecici.user.js
// @updateURL https://update.greasyfork.org/scripts/523147/Dizipal%20video%20oncesi%20reklam%20gecici.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function dizipalClean() {
        removeElementsByClass("bb");

        let skipButton = document.getElementById("skipButton");
        if (skipButton) {
            if (skipButton.style.display == "none") {
                    window.setTimeout(dizipalClean, 1000);
            } else {
                skipButton.removeAttribute("disabled");
                skipButton.click();
                window.setTimeout(dizipalClean, 250);
            }
        }

    }
    function removeElementsByClass(className){
        const elements = document.getElementsByClassName(className);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", dizipalClean);
    } else {
        dizipalClean();
    }
})();