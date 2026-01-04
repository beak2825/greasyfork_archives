// ==UserScript==
// @name         Universal Ad and Pop-up Blocker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Block ads and pop-ups on all websites
// @author       YourName
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494838/Universal%20Ad%20and%20Pop-up%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/494838/Universal%20Ad%20and%20Pop-up%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove ad elements
    function removeAdElements() {
        // This will target elements with classes commonly associated with ads
        // and hide them. You may need to adjust the class names based on the ads you're encountering.
        var adClasses = ['ad', 'ads', 'ad-container', 'ad-banner', 'popup', 'modal'];
        adClasses.forEach(className => {
            var ads = document.querySelectorAll('.' + className);
            if (ads.length > 0) {
                ads.forEach(ad => ad.style.display = 'none');
            }
        });
    }

    // Function to close pop-ups
    function closePopups() {
        // Look for elements that might represent pop-ups and close them.
        // This might involve finding 'x' buttons to click or hiding elements directly.
        var closeButtons = document.querySelectorAll('.close, .popup-close');
        if (closeButtons.length > 0) {
            closeButtons.forEach(button => button.click());
        }
    }

    // Run the ad removal functions on page load
    document.addEventListener('DOMContentLoaded', function() {
        removeAdElements();
        closePopups();
    });

    // Optional: Run the ad removal functions on AJAX calls as well
    // This is useful for websites that load content dynamically
    var originalFunction = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
        var that = this;
        return function(method, url, async) {
            that.addEventListener('load', function() {
                removeAdElements();
                closePopups();
            });
            return originalFunction.apply(that, arguments);
        };
    }();
})();
