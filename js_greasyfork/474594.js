
// ==UserScript==
// @name         Expand All Lists of GeForce NOW Status
// @namespace    http://your.namespace.com
// @version      1.0
// @license MIT 
// @description  Expand all lists on a webpage
// @author       OpenAI(i cant do shit T_T)
// @match        https://status.geforcenow.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474594/Expand%20All%20Lists%20of%20GeForce%20NOW%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/474594/Expand%20All%20Lists%20of%20GeForce%20NOW%20Status.meta.js
// ==/UserScript==

(function () {
    // Function to simulate a click on all list openers
    function openAllLists() {
        var listOpeners = document.querySelectorAll('[data-js-hook="component-group-opener"]');
        if (listOpeners) {
            listOpeners.forEach(function (opener) {
                opener.click();
            });
        }
    }

    // Call the function to open all lists
    openAllLists();
})();
