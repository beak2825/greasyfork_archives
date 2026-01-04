// ==UserScript==
// @name         Remove Student Loan in Banqer High
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove student loan from Banqer High
// @author       Your Name
// @match        *://banqer.high/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517820/Remove%20Student%20Loan%20in%20Banqer%20High.user.js
// @updateURL https://update.greasyfork.org/scripts/517820/Remove%20Student%20Loan%20in%20Banqer%20High.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove student loan
    function removeStudentLoan() {
        const loanElement = document.querySelector('.student-loan'); // Adjust selector as needed
        if (loanElement) {
            loanElement.remove();
            console.log('Student loan removed successfully.');
        } else {
            console.log('No student loan found.');
        }
    }

    // Run the function
    removeStudentLoan();
})();
