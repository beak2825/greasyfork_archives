// ==UserScript==
// @name         Moodle AutoHello
// @namespace    https://t.me/johannmosin
// @version      0.1.0
// @description  Здоровается с преподавателем на лекции, как только это сделал кто-то другой
// @author       Johann Mosin
// @license      MIT
// @match        https://*.edu.vsu.ru/html5client/*
// @downloadURL https://update.greasyfork.org/scripts/518085/Moodle%20AutoHello.user.js
// @updateURL https://update.greasyfork.org/scripts/518085/Moodle%20AutoHello.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let messageSent = false; // Prevent sending multiple messages

    function findReactProps(dom) {
        for (const key in dom) {
            if (key.startsWith('__reactInternalInstance$') || key.startsWith('__reactFiber$')) {
                return dom[key].return ? dom[key].return.stateNode.props : dom[key]._currentElement._owner._instance.props;
            }
        }
        return null;
    }

    function autoGreet() {
        if (messageSent) return; // Stop if message already sent

        // Check for greetings in the page text
        const greetings = ["здравствуйте", "здравстуйте", "Здравствуйте", "Здраствуйте"];
        const pageText = document.body.innerText;

        if (greetings.some(greet => pageText.includes(greet))) {
            console.log("Greeting detected!");

            // Find the input and send button
            const messageInput = document.querySelector('#message-input');
            const sendButton = document.querySelector('button[aria-label="Отправить сообщение"]');

            if (messageInput && sendButton) {
                // Access React props
                const props = findReactProps(messageInput);

                if (props && props.onChange) {
                    // Create a synthetic event to update React state
                    const syntheticEvent = {
                        target: { value: "Здравствуйте" },
                        currentTarget: { value: "Здравствуйте" },
                    };
                    props.onChange(syntheticEvent);

                    // Now click the send button
                    sendButton.click();

                    console.log("Greeting message sent via React props!");
                    messageSent = true; // Mark as sent to prevent multiple sends

                    // Stop the interval to save memory
                    clearInterval(greetingInterval);
                    console.log("Interval cleared to save memory.");
                } else {
                    console.log("React props not found or onChange handler missing.");
                }
            } else {
                console.log("Message input or send button not found!");
            }
        }
    }

    // Run the function periodically to detect greetings
    const greetingInterval = setInterval(autoGreet, 2000);
})();
