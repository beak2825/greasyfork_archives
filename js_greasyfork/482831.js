// ==UserScript==
// @name         ED Volks combined Hans Solbach
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        https://www.volksbank-daaden.de/*
// @match        https://www.drivehq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482831/ED%20Volks%20combined%20Hans%20Solbach.user.js
// @updateURL https://update.greasyfork.org/scripts/482831/ED%20Volks%20combined%20Hans%20Solbach.meta.js
// ==/UserScript==





    // Function to remove elements with role="listbox"
    function removeElementsWithListboxRole() {
        const elementsToRemove = document.querySelectorAll('[role="listbox"]');
        elementsToRemove.forEach(element => {
            element.remove();
            console.log('Removed element with role="listbox":', element);
        });
    }

    