// ==UserScript==
// @name         Remove Navbar Elements
// @namespace    your-namespace
// @version      1.0
// @description  Removes specified elements from the navbar
// @match       https://cydmyz.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464237/Remove%20Navbar%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/464237/Remove%20Navbar%20Elements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const actionsDiv = document.querySelector('.actions');
    
    // remove search-open span
    actionsDiv.removeChild(document.querySelector('.search-open'));
    
    // remove toggle-notify span
    actionsDiv.removeChild(document.querySelector('.toggle-notify'));
    
    // remove toggle-dark span
    actionsDiv.removeChild(document.querySelector('.toggle-dark'));
    
    // remove login-btn a tag
    actionsDiv.removeChild(document.querySelector('.login-btn'));

    // remove burger div
    actionsDiv.removeChild(document.querySelector('.burger'));
})();
