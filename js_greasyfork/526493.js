// ==UserScript==
// @name        Pestpac - Duplicate Ticket Table
// @version     1.03
// @description Duplicates table for the tickets and places it at the top of the page so the information is easier to get to when loading the account
// @match       https://app.pestpac.com/*
// @author      Jamie Cruz
// @grant       none
// @license MIT
// @namespace https://greasyfork.org/users/1433767
// @downloadURL https://update.greasyfork.org/scripts/526493/Pestpac%20-%20Duplicate%20Ticket%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/526493/Pestpac%20-%20Duplicate%20Ticket%20Table.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the div element you want to duplicate
    var divElement = document.getElementById("OrderInfo");

    // Create a copy of the div element
    var newDivElement = divElement.cloneNode(true);

    // Add padding to the new div element
    newDivElement.style.paddingLeft = "20px";
    newDivElement.style.paddingRight = "20px";

    // Get the div element above which you want to place the new div
    var targetDivElement = document.getElementById("page-header");

    // Insert the new div element above the target div element
    targetDivElement.parentNode.insertBefore(newDivElement, targetDivElement);
})();
