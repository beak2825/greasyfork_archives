// ==UserScript==
// @name         Drrrkari Google Translate Bot (English to Japanese, Enter Key Support)
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Translate English messages into Japanese and send them, with Enter key support and draggable button
// @author       AoiRabbit
// @match        *://drrrkari.com/room*
// @grant        none
// @require      https://unpkg.com/axios/dist/axios.min.js
// @icon         https://www.google.com/s2/favicons?domain=drrrkari.com
// @downloadURL https://update.greasyfork.org/scripts/517613/Drrrkari%20Google%20Translate%20Bot%20%28English%20to%20Japanese%2C%20Enter%20Key%20Support%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517613/Drrrkari%20Google%20Translate%20Bot%20%28English%20to%20Japanese%2C%20Enter%20Key%20Support%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Get DOM elements
    const input = document.querySelector("#message .inputarea textarea");
    const submit = document.querySelector("#message .submit input");

    // Create translation button
    const translateButton = document.createElement("button");
    translateButton.innerText = "Translate and Send";
    translateButton.style.padding = "10px";
    translateButton.style.borderRadius = "5px";
    translateButton.style.backgroundColor = "#007bff";
    translateButton.style.color = "white";
    translateButton.style.position = "absolute";
    translateButton.style.cursor = "grab";

    // Set initial position of the button in the center of the screen
    translateButton.style.top = "50%";
    translateButton.style.left = "50%";
    translateButton.style.transform = "translate(-50%, -50%)";

    // Variables for dragging functionality
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // Add mouse down event to start dragging the button
    translateButton.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - translateButton.offsetLeft;
        offsetY = e.clientY - translateButton.offsetTop;
        translateButton.style.cursor = "grabbing";
    });

    // Add mouse move event to move the button while dragging
    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            translateButton.style.left = `${e.clientX - offsetX}px`;
            translateButton.style.top = `${e.clientY - offsetY}px`;
            translateButton.style.transform = ""; // Disable central alignment while dragging
        }
    });

    // Add mouse up event to stop dragging
    document.addEventListener("mouseup", () => {
        isDragging = false;
        translateButton.style.cursor = "grab";
    });

    // Action when the translation button is clicked
    translateButton.onclick = async () => {
        const message = input.value;
        if (message) {
            const translatedMessage = await translateMessage(message);
            sendChatMessage(translatedMessage);
        }
    };

    // Add the translation button to the page
    document.body.appendChild(translateButton);

    // Function to translate messages using Google Translate API (English to Japanese)
    async function translateMessage(text) {
        try {
            const response = await axios.get(`https://api.mymemory.translated.net/get`, {
                params: {
                    q: text,
                    langpair: "en|ja" // Set translation direction to English to Japanese
                }
            });
            const translatedText = response.data.responseData.translatedText;
            console.log(`Original: ${text}, Translated: ${translatedText}`);
            return translatedText;
        } catch (error) {
            console.error("Translation Error:", error);
            return "Translation failed";
        }
    }

    // Function to send the translated message
    function sendChatMessage(text) {
        if (!text || !input || !submit) return;
        input.value = text;
        submit.click();
        console.log("Sent:", text);
    }

    // Listen for Enter key to translate and send the message
    input.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent the default form submission
            const message = input.value;
            if (message) {
                const translatedMessage = await translateMessage(message);
                sendChatMessage(translatedMessage);
            }
        }
    });
})();
