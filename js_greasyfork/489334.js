// ==UserScript==
// @name         Torn Newspaper Adblock
// @namespace    http://tampermonkey.net/
// @version      1.5
// @license      MIT
// @description  Block all those pesky ads on the torn newspaper, of course the clasified ads tab is still there for browsing convenience
// @author       Fists
// @match        https://www.torn.com/newspaper.php*
// @match        https://www.torn.com/newspaper_class.php*
// @match        https://www.torn.com/joblist.php*
// @match        https://www.torn.com/bounties.php*
// @match        https://www.torn.com/comics.php*
// @match        https://www.torn.com/freebies.php*
// @match        https://www.torn.com/archives.php*
// @match        https://www.torn.com/personals.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/489334/Torn%20Newspaper%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/489334/Torn%20Newspaper%20Adblock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide or remove an element
    function hideOrRemoveElement(selector) {
        var elementsToBlock = document.querySelectorAll(selector);
        elementsToBlock.forEach(function(element) {
            // You can choose to hide or remove the element
            // element.style.display = 'none'; // To hide the element
            element.remove(); // To completely remove the element
        });
    }

    // Function to block other specific elements
    function blockOtherElements() {
        // Add styles or logic to hide other specific elements
        GM_addStyle('.messagesWrap___Llw3B, .page-bottom-content, div[class^="messages___"] { display: none !important; }');
    }

    // Run the blocking function at the beginning
    blockOtherElements();

    // Create a MutationObserver to watch for changes in the DOM
    var observer = new MutationObserver(function(mutationsList) {
        mutationsList.forEach(function(mutation) {
            // Add additional logic here if needed for dynamic blocking
            // You can check for specific elements and call hideOrRemoveElement accordingly
        });
    });

    // Start observing the DOM for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
