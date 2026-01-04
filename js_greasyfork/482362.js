// ==UserScript==
// @name         DeviantArt Login Bypass
// @namespace    deviantart-unblur-image
// @version      1.0
// @description  Replaces blurred images on DeviantArt pages with the actual image
// @author       r7o1
// @match        *://www.deviantart.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482362/DeviantArt%20Login%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/482362/DeviantArt%20Login%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentURL = window.location.href;

    function getIMG(element) {
        var oEmbedUrl = `https://backend.deviantart.com/oembed?url=${window.location.href}&format=jsonp&callback=?`;

        jQuery.getJSON(oEmbedUrl, function(data) {
            element.style.filter = "none";
            element.parentElement.style.backgroundSize = "cover";
            element.parentElement.style.backgroundRepeat = "no-repeat";
            element.parentElement.style.backgroundImage = `url(${data.url})`;
            element.parentElement.parentElement.lastChild.remove();
            element.remove();
        });
    }

    function processBlurredImages() {
        document.querySelectorAll("*").forEach(function(element) {
            if (getComputedStyle(element).filter.includes("blur")) {
                if (typeof jQuery == "undefined") {
                    (async function() {
                        await import('https://code.jquery.com/jquery-3.6.3.min.js');
                    })().then(function() {
                        getIMG(element);
                    });
                } else {
                    getIMG(element);
                }
            }
        });
    }

    function handleClick(event) {
        var newURL = window.location.href;
        if (newURL !== currentURL) {
            currentURL = newURL;
            processBlurredImages();
        }
    }

    // Execute when the page loads
    processBlurredImages();

    // Add click event listener to the document
    document.addEventListener('click', handleClick);
})();