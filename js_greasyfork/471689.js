// ==UserScript==
// @name     TwitterLogoChanger
// @version  1
// @grant    none
// @include  https://twitter.com/*
// @description Twitter logo update
// @namespace https://greasyfork.org/users/1135520
// @downloadURL https://update.greasyfork.org/scripts/471689/TwitterLogoChanger.user.js
// @updateURL https://update.greasyfork.org/scripts/471689/TwitterLogoChanger.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    // Get the Twitter logo element by aria-label attribute
    let logoElement = document.querySelector('a[aria-label="Twitter"]');

    // Check if the logoElement is found
    if(logoElement){
        // Find the specific span that wraps the SVG
        let spanElement = logoElement.querySelector('span');

        if(spanElement){
            // Add the text "уй" to the span
            spanElement.textContent = ' уй';
        }
    }
}, false);