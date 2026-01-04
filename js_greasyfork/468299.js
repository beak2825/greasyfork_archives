// ==UserScript==
// @name         LangChain Max Width
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  Set max-width to 100% for langchain.com
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468299/LangChain%20Max%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/468299/LangChain%20Max%20Width.meta.js
// ==/UserScript==

(function() {

    // Get all elements with .bd-content
    var elements = document.querySelectorAll(".bd-article-container, .bd-page-width");

    // Unset max-width property for each element
    elements.forEach(function(el) {
        el.style.maxWidth = 'none';
    });
})();
