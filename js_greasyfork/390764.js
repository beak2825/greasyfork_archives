// ==UserScript==
// @name         Porkbun Links
// @namespace    http://porkbun.com/
// @version      0.3
// @description  makes unavailable links in porkbun clickable so you can snoop on those bastards who stole your domain options!
// @author       StuffBySpencer
// @match        https://porkbun.com/checkout/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390764/Porkbun%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/390764/Porkbun%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target.classList.contains('unavailableDomain')) {
                let link = mutation.target;
                let url = link.innerText;
                link.innerHTML = `<a href="http://${url}" target="_blank">${url}</a>`;
            }
        }
    };


    // Select the node that will be observed for mutations
    const domains = document.querySelectorAll('.searchResultRow');

    for (let i = 0; i < domains.length; i++) {
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(domains[i], config);
    }
})();