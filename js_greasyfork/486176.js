// ==UserScript==
// @name         Instagram sponsored posts remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove sponsored posts on Instagram
// @author       oacevedo
// @match        https://www.instagram.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486176/Instagram%20sponsored%20posts%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/486176/Instagram%20sponsored%20posts%20remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to check for the specified structure
    function findSponsoredArticle() {
        const articles = document.querySelectorAll('article');
        for (const article of articles) {
            const spanElement = article.querySelector('span.x1fhwpqd.x132q4wb.x5n08af');
            if (spanElement && spanElement.textContent.trim() === 'Sponsored') {
                return article;
            }
        }
        return null;
    }

    // Function to check for sponsored content on scroll
    function checkForSponsoredOnScroll() {
        var articleToRemove = findSponsoredArticle();
        try {
            if (articleToRemove != null) {
                console.log('Sponsored content found!');
                // You can add additional actions here
                articleToRemove.firstChild.remove();
            }
        }
        catch { }

    }

    // Attach the scroll event listener
    window.addEventListener('scroll', checkForSponsoredOnScroll);

})();