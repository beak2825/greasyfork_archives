// ==UserScript==
// @name        Make images full view and move text to bottom in olamovies.autos
// @namespace   Violentmonkey Scripts
// @match       https://olamovies.autos/*
// @grant       none
// @version     1.0
// @author      -
// @description 2/14/2024, 10:50:32 AM
// @downloadURL https://update.greasyfork.org/scripts/487278/Make%20images%20full%20view%20and%20move%20text%20to%20bottom%20in%20olamoviesautos.user.js
// @updateURL https://update.greasyfork.org/scripts/487278/Make%20images%20full%20view%20and%20move%20text%20to%20bottom%20in%20olamoviesautos.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Get all article elements
    var articles = document.querySelectorAll('article');

    // Iterate over each article element
    articles.forEach(function(article) {
        // Get all elements with class "entry-overlay" within the current article
        var overlayElements = article.querySelectorAll('.entry-overlay.box-inner-p');

        // Iterate over each overlay element within the current article
        overlayElements.forEach(function(overlayElement) {
            // Move the overlay element after the article
            article.insertAdjacentElement('afterend', overlayElement);
            // Remove classes from the overlay element
            overlayElement.classList.remove('entry-overlay', 'box-inner-p');
        });

      // for remove shading of the images  
        // Get all elements with class "entry-image" within the current article
        var imageElements = article.querySelectorAll('.entry-image');

        // Iterate over each image element within the current article
        imageElements.forEach(function(image) {
            // Remove the "entry-image" class from each image element
            image.classList.remove('entry-image');
        });
    });
})();
