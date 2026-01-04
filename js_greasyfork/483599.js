// ==UserScript==
// @name         ITEYE blog viewer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show the hidden part on ITEYE blog pages
// @author       Rive Chen, GPT-4
// @match        https://www.iteye.com/blog/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483599/ITEYE%20blog%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/483599/ITEYE%20blog%20viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change style
    function changeStyle() {
        var blogContent = document.getElementById('blog_content');
        if (blogContent) {
            // Modify the style here
            blogContent.style.height = 'auto';
            blogContent.style.overflow = 'visible';
        }
    }

    // Function to remove the specified div
    function removeDiv() {
        var divToRemove = document.querySelector('.hide-article-box');
        if (divToRemove) {
            divToRemove.parentNode.removeChild(divToRemove);
        }
    }

    // Wait for the DOM to be fully loaded
    window.addEventListener('load', function() {
        changeStyle();
        removeDiv();
    });
})();
