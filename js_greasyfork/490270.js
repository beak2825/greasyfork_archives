// ==UserScript==
// @name         TinamadBOT by Taru👑
// @namespace    https://your.namespace.com
// @version      6.9
// @description  Adds a floating button to send automated messages on Telegram Web
// @author       Taru
// @match        https://web.telegram.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490270/TinamadBOT%20by%20Taru%F0%9F%91%91.user.js
// @updateURL https://update.greasyfork.org/scripts/490270/TinamadBOT%20by%20Taru%F0%9F%91%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a floating button
    function addFloatingButton() {
        var button = document.createElement('button');
        button.innerHTML = 'Inject Messages===-->';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.addEventListener('click', function() {
            executeAutoSendMessageScript();
        });
        document.body.appendChild(button);
    }

    // Execute the auto-send message script
    function executeAutoSendMessageScript() {
        console.log("TinamadBOT by Taru");

        function sendMessage(message) {
            var inputBox = document.querySelector('.input-message-input');
            inputBox.textContent = message;

            console.log("Taru injected the message===-->");

            var sendButton = document.querySelector('.btn-send');
            sendButton.click();
        }

var customMessages = [
    //feel free to add more messages here.
    `Hey, have you checked out DOGEMOB's progress lately? It's gaining some serious traction.`,
    `DOGEMOB's concept is quite intriguing - I've been looking into its technical aspects.`,
    `Just caught wind of some interesting developments in DOGEMOB - will be diving deeper.`,
    `Thinking of increasing my involvement in the DOGEMOB community and exploring its tech.`,
    `Considering various trading strategies for DOGEMOB - it's a fascinating market.`,
    `Wondering about DOGEMOB's long-term potential and its impact on the future of finance.`,
    `Analyzing the economic factors that influence DOGEMOB's price stability and volatility.`,
    `Exploring the implications of market manipulation on DOGEMOB's price discovery.`,
    `DOGEMOB's utility in decentralized autonomous organizations (DAOs) is a game-changer.`,
    `Examining DOGEMOB’s market dynamics and the role of community sentiment in its success.`,
    `Meme culture has significantly contributed to DOGEMOB's global adoption - fascinating!`,
    `The impact of social media platforms on DOGEMOB's growth is noteworthy.`,
    `Considering the implications of cross-border transactions for DOGEMOB's global adoption.`,
    `The importance of decentralized exchanges (DEXs) in trading with DOGEMOB cannot be overstated.`,
    `Feasibility of integrating smart contracts into DOGEMOB's ecosystem is worth exploring.`,
    `Macroeconomic events can significantly affect DOGEMOB's price volatility - analyzing trends.`,
    `Regulatory crackdowns can impact DOGEMOB market sentiment - monitoring closely.`,
    `Interoperability between DOGEMOB and other blockchain networks is a challenge worth tackling.`
];

        function sendMessagesWithDelay(index, delay) {
            setTimeout(function() {
                sendMessage(customMessages[index]);
            }, delay);
        }

        function sendMessagesPeriodically() {
            sendMessage(customMessages[0]);
            for (var i = 1; i < customMessages.length; i++) {
                var delay = i * 5 * 60 * 1000;
                sendMessagesWithDelay(i, delay);
            }
        }

        sendMessagesPeriodically();
    }

    // Call the function to add the floating button
    addFloatingButton();
})();
