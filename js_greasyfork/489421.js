// ==UserScript==
// @name         Jackal Popup Remover
// @namespace    http://jackal.surge.sh/
// @version      1.0.0
// @description  Self-explanatory name
// @author       Michael Santos
// @match        http://jackal.surge.sh/*
// @icon         jackal.surge.sh/logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489421/Jackal%20Popup%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/489421/Jackal%20Popup%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent future alerts with role "alert" and remove existing alerts
    const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'DIV' && (node.getAttribute('role') === 'alert' || node.classList.contains('Toastify'))) {
                    node.remove();
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Remove existing alerts with role "alert" and divs with class "Toastify"
    document.querySelectorAll('div[role="alert"], div.Toastify').forEach(element => element.remove());
})();