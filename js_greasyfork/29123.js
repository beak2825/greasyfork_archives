// ==UserScript==
// @name         Add ID to Linnworks Orders
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds the order id to Linnworks orders
// @author       Ryan Poole
// @match        https://www.linnworks.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29123/Add%20ID%20to%20Linnworks%20Orders.user.js
// @updateURL https://update.greasyfork.org/scripts/29123/Add%20ID%20to%20Linnworks%20Orders.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.target.classList.contains('orderRow') && !mutation.target.checked) {
                mutation.target.appendChild(document.createTextNode(mutation.target.id));
                mutation.target.checked = true;
            }
        });
    });
    const options = { attributes: false, childList: true, characterData: false, subtree: true };
    observer.observe(document.getElementById('appContainer'), options);
})();