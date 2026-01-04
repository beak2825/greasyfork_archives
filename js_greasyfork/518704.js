// ==UserScript==
// @name         Discord/Shapes - Styles
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adjusting a few visual Elements on Discord
// @author       Vishanka
// @match        https://discord.com/channels/*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/518704/DiscordShapes%20-%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/518704/DiscordShapes%20-%20Styles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS rule to modify the channel text area
    const style = document.createElement('style');
    style.innerHTML = `
        .channelTextArea_bdf0de {
            position: relative;
            width: 120%;
            text-indent: 0;
            border-radius: 8px;
        }
        .themedBackground_bdf0de {
            background: #2F2F2F;
        }
        .chatContent_a7d72e {
            position: relative;
            display: flex;
            flex-direction: column;
            min-width: 0;
            min-height: 0;
            flex: 1 1 auto;
            background: #212121 !important;
        }

.theme-dark .container_ee69e0 {
    background: #191919;
}
.theme-dark .themed_fc4f04 {
    background: #212121;
}
.wrapper_fea3ef {

    background-color: #131313;
}
.footer_f8ec41 {

    background: #131313;
}
.theme-dark .container_b2ca13 {
    background: #191919;
}
    `;
    document.head.appendChild(style);

    // Function to hide the targeted elements
    function hideElements() {
        // Select all elements that match the provided pattern
        const elements = document.querySelectorAll("[id^='message-accessories-'] > article > div > div > div.embedProvider_b0068a.embedMargin_b0068a, [id^='message-accessories-'] > article > div > div > div.embedTitle_b0068a.embedMargin_b0068a, .buttons_bdf0de .expression-picker-chat-input-button.buttonContainer_bdf0de, .channelAppLauncher_df39bd .buttonContainer_df39bd.app-launcher-entrypoint");

        // Iterate over each element and hide it
        elements.forEach(element => {
            element.style.display = 'none';
        });
    }

    // Run the function initially to hide elements present at page load
    hideElements();

    // Observe mutations to the DOM and hide elements when new ones are added
    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();
