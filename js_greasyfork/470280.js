// ==UserScript==
// @name         Monday.com trial remover
// @namespace    https://gritlab-company.monday.com/
// @version      0.1
// @description  monday.com trial bypass
// @author       Sagar Yadav
// @license      MIT
// @match        https://gritlab-company.monday.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monday.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470280/Mondaycom%20trial%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/470280/Mondaycom%20trial%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // delay to wait for modal popup
    setTimeout(function() {

        console.log("now now ...................")
        let hello = document.getElementsByClassName("end-of-trial-modal-portal")

        // Loop through the collection
        while(hello[0]) {
            // Remove each element with that class
            hello[0].parentNode.removeChild(hello[0]);
        }

        // Make all elements fully visible and interactable
        let firstReadOnlyAccount = document.getElementById("application");

        // Check if the element exists
        if (firstReadOnlyAccount) {
            // Remove the class "account-read-only" from the element
            firstReadOnlyAccount.classList.remove("account-read-only");
        }

    }, 2000); // 500 milliseconds delay


})();