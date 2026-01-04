// ==UserScript==
// @name         GetOnline2.0
// @namespace    Getonline2.0
// @version      2.0
// @description  Send cash with a Message of you choosing.
// @author       Kizozen [2626260]
// @match        https://www.torn.com/profiles.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license MERMER
// @downloadURL https://update.greasyfork.org/scripts/473627/GetOnline20.user.js
// @updateURL https://update.greasyfork.org/scripts/473627/GetOnline20.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let button = document.createElement("button");

    setTimeout(() => {
        let div = document.getElementsByClassName("empty-block")[0];

        button.className = "torn-btn";
        button.innerHTML = "MSG: GET ONLINE!";
        button.style = "margin-top: 3px; margin-left: 3px;";
        button.addEventListener("click", prepareAndEdit);
        div.appendChild(button);
    }, 2000);

    function prepareAndEdit() {
        let storedMessage = localStorage.getItem("getOnlineMessage");
        let defaultMessage = "PLEASE GET ONLINE AND CHECK FACTION CHAT!";
        let message = storedMessage || defaultMessage;
        let amount = 1;

        let newMessage = prompt("Enter the message:", message);
        if (newMessage === null) {
            alert("Message sending aborted.");
            return;
        } else if (newMessage.trim() !== "") {
            message = newMessage;
            localStorage.setItem("getOnlineMessage", message);
        }

        let newAmount = parseFloat(prompt("Enter the amount of cash to send:", amount));
        if (isNaN(newAmount) || newAmount <= 0) {
            alert("Invalid amount. Message sending aborted.");
            return;
        } else {
            amount = newAmount;
        }

        let confirmation = confirm("Are you sure you want to send the following message:\n\n" +
                                   "Message: " + message + "\n" +
                                   "Cash Amount: $" + amount + "\n\n" +
                                   "Click OK to confirm or Cancel to abort.");

        if (confirmation) {
            fillAndSend(message, amount);
        } else {
            alert("Message sending aborted.");
        }
    }

    function fillAndSend(message, amount) {
        let id = getID();

        button.disabled = true;
        var request = new XMLHttpRequest();
        request.open('POST', 'https://www.torn.com/sendcash.php?rfcv=undefined');
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        request.setRequestHeader("x-requested-with", "XMLHttpRequest");
        request.send("step=cash1&ID=" + id + "&money=" + amount + "&tag=" + encodeURIComponent(message) + "&theanon=false");
    }

    function getID() {
        return document.getElementsByClassName("profile-image-wrapper")[1].href.split("=")[1];
    }
})();
