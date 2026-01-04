// ==UserScript==
// @name         Customizable Textarea Prefix/Suffix for DGG
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a customizable prefix and suffix to text in the DGG chat textarea
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527378/Customizable%20Textarea%20PrefixSuffix%20for%20DGG.user.js
// @updateURL https://update.greasyfork.org/scripts/527378/Customizable%20Textarea%20PrefixSuffix%20for%20DGG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let prefix = "WWWWaiting . o O ( ";
    let suffix = " )";

    const observer = new MutationObserver((mutations) => {
        const textarea = document.getElementById('chat-input-control');
        if (textarea) {
            console.log("Textarea found:", textarea);

            textarea.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    let finalText = textarea.value;

                    if (finalText.trim().startsWith("/command")) {
                        event.preventDefault(); // Prevent the default Enter behavior
                        textarea.value = ''; // Clear the textarea

                        const newPrefix = prompt("Enter new prefix:", prefix);
                        if (newPrefix !== null) {
                            prefix = newPrefix;
                            const newSuffix = prompt("Enter new suffix:", suffix);
                            if (newSuffix !== null) {
                                suffix = newSuffix;
                                alert(`Prefix set to "${prefix}", Suffix set to "${suffix}"`);
                            }
                        }
                    } else {
                        if (finalText.trim() !== "") {
                            if (finalText.startsWith("/")) {
                                // Do nothing, just send the text
                            } else if (finalText.startsWith(">")) {
                                finalText = "> " + prefix + finalText.substring(1) + suffix;
                            } else {
                                finalText = prefix + finalText + suffix;
                            }
                            textarea.value = finalText;
                        }
                    }
                }
            });

            observer.disconnect();
        }
    });

    const chatInputFrame = document.getElementById('chat-input-frame');

    if (chatInputFrame) {
        observer.observe(chatInputFrame, { childList: true, subtree: true });
    } else {
        console.log("chat-input-frame not found. Ensure the ID is correct.");
    }
})();
