// ==UserScript==
// @name         Torn: Hide Crimes 2.0 Stories
// @namespace    ReconDalek.HideStory
// @version      1.0
// @description  Hides the stories from the crime section when initiating crimes
// @author       ReconDalek [2741093]
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479124/Torn%3A%20Hide%20Crimes%2020%20Stories.user.js
// @updateURL https://update.greasyfork.org/scripts/479124/Torn%3A%20Hide%20Crimes%2020%20Stories.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the specified section
    function hideSection() {
        const style = document.createElement('style');
        style.innerHTML = '.story___GmRvQ { display: none !important; }';
        document.head.appendChild(style);
    }

    // Call the hideSection function when the page finishes loading
    window.addEventListener('load', hideSection);
})();