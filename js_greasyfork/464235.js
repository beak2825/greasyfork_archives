// ==UserScript==
// @name         Remove Breadcrumb Element
// @namespace    your-namespace
// @version      1.0
// @description  Removes specified breadcrumb element from the page
// @match       https://cydmyz.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464235/Remove%20Breadcrumb%20Element.user.js
// @updateURL https://update.greasyfork.org/scripts/464235/Remove%20Breadcrumb%20Element.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const breadcrumb = document.querySelector('.article-crumb');
    
    // remove breadcrumb ol element
    breadcrumb.removeChild(document.querySelector('.breadcrumb'));
})();
