// ==UserScript==
// @name         Discord/Shapes - Rules
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Logic for rotating custom texts on Discord
// @author       Vishanka
// @match        https://discord.com/channels/*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/518698/DiscordShapes%20-%20Rules.user.js
// @updateURL https://update.greasyfork.org/scripts/518698/DiscordShapes%20-%20Rules.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Custom texts to cycle through
    const customRules = [
        "<Rule1: Type here instructions you want to have reiterated. The AI will deprioritize your prompt so it needs to be reminded.>",
        "<Rule2: Be mindful of the commas and syntax here, every entry except the last one needs a comma.>",
        "<Rule3: Put the Rules or whatever you reiterate between these brackets or otherwise the hiding script will not hide them.>",
        "<Rule4: You can disable the rules in the main script by unticking the checkbox.>",
        "<Rule5: Be mindful that this last entry doesn't have a comma You can add as many rules as you like.>"
    ];
 
    let currentIndex = 0;

    // Function to determine the current rule index by scanning last two messages
    function determineCurrentIndex() {
        const messageItems = document.querySelectorAll('li[class^="messageListItem_"]');

        if (messageItems.length >= 1) {
            // Check the last message first
            const lastMessage = Array.from(messageItems[messageItems.length - 1].querySelectorAll('span')).map(span => span.innerText).join('') || messageItems[messageItems.length - 1].innerText;

            for (let i = 0; i < customRules.length; i++) {
                if (lastMessage.includes(`<Rule${i + 1}:`)) {
                    currentIndex = (i + 1) % customRules.length;
                    return;
                }
            }
        }

        // If not found in the last message, check the second to last message
        if (messageItems.length >= 2) {
            const secondLastMessage = Array.from(messageItems[messageItems.length - 2].querySelectorAll('span')).map(span => span.innerText).join('') || messageItems[messageItems.length - 2].innerText;

            for (let i = 0; i < customRules.length; i++) {
                if (secondLastMessage.includes(`<Rule${i + 1}:`)) {
                    currentIndex = (i + 1) % customRules.length;
                    return;
                }
            }
        }
    }

    // Expose necessary elements to be used by the second script
    window.customRuleLogic = {
        customRules,
        determineCurrentIndex,
        getCurrentText: function() {
            determineCurrentIndex();
            const customRule = '\n' + customRules[currentIndex];
            currentIndex = (currentIndex + 1) % customRules.length;
            return customRule;
        }
    };
})();
