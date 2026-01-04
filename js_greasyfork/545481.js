// ==UserScript==
// @name         Messages Count
// @namespace    http://tampermonkey.net/
// @license      GPLv3
// @version      2025-08-12
// @description  Shows how many messages the current conversation has
// @author       none
// @match        https://redacted.sh/inbox.php?action=viewconv&id=*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545481/Messages%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/545481/Messages%20Count.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // ##### Message Count ####

    // Function to add the messages label after the last message
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    // Get the number of messages
    var amountmsgs = document.querySelectorAll('.inbox_message').length;

    // Create the label to be added
    var msgslabel = document.createElement("h3");
    msgslabel.innerHTML = `Messages: ${amountmsgs}`;

    // Find the last message
    var ibmessages = document.querySelectorAll(".inbox_message");
    var lastmsg = ibmessages[ibmessages.length -1];
    // Add the label
    insertAfter(lastmsg, msgslabel);

    // #### Scroll to bottom automatically ####
    document.getElementById("messageform").scrollIntoView();
})();