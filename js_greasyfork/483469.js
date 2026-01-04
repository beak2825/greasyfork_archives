// ==UserScript==
// @name         Custom Syntax Alert
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces the alert message with a custom message
// @author       duckckckckck
// @match        https://www.syntax.eco/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483469/Custom%20Syntax%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/483469/Custom%20Syntax%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceMessage() {
        var element = document.getElementById('websitewidemessage');
        if (element) {
            var newMessage = getRandomMessage();
            element.innerHTML = '<p>' + newMessage + '</p>';
        }
    }

    function getRandomMessage() {
        var messages = [
            "OOPSIE WOOPSIE!! Uwu We made a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!"
            // add more shit if u want lol
        ];

        var randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }

    replaceMessage();

    var observer = new MutationObserver(replaceMessage);
    observer.observe(document.body, { childList: true, subtree: true });
})();
