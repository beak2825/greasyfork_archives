// ==UserScript==
// @name         Cartel Empire - Hide Standard Jobs
// @namespace    echotte.cartelempire.online
// @version      0.1
// @description  Hides Standard Jobs
// @author       echotte
// @include      https://cartelempire.online/Jobs
// @grant        none
// @icon         https://i.imgur.com/PR2kala.png
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528138/Cartel%20Empire%20-%20Hide%20Standard%20Jobs.user.js
// @updateURL https://update.greasyfork.org/scripts/528138/Cartel%20Empire%20-%20Hide%20Standard%20Jobs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the targeted divs
    function hideJobContainers() {
        const jobContainers = document.querySelectorAll('div.jobContainer');
        jobContainers.forEach(container => {
            if (container.querySelector('h2') && container.querySelector('h2').innerText === 'Standard') {
                container.style.display = 'none';
            }
        });
        //alert('function ran')
    }

    //alert('before listeners')
    // Run the function to hide the divs after the page has fully loaded
    window.addEventListener('load', hideJobContainers);
    window.addEventListener('DOMContentLoaded', hideJobContainers);

    hideJobContainers();

    //alert('end of script')

    // Optional: Observe for changes in the document to hide any new divs that match the criteria
    //const observer = new MutationObserver(hideJobContainers);
    //observer.observe(document.body, { childList: true, subtree: true });
})();