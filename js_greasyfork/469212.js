// ==UserScript==
// @name         Kolorki itemów na czacie
// @version      1.0.2
// @description  Zmienia kolory przedmiotów na czacie w zależności od ich rzadkości.
// @match        http*://*.margonem.pl/
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1108711
// @downloadURL https://update.greasyfork.org/scripts/469212/Kolorki%20item%C3%B3w%20na%20czacie.user.js
// @updateURL https://update.greasyfork.org/scripts/469212/Kolorki%20item%C3%B3w%20na%20czacie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .linked-chat-item[data-item-type="t-norm"] {
            color: #9da1a7 !important;
        }

        .linked-chat-item[data-item-type="t-uniupg"] {
            color: #fffb00 !important;
        }

        .linked-chat-item[data-item-type="t-her"] {
            color: #38b8eb !important;
        }

        .linked-chat-item[data-item-type="t-upgraded"] {
            color: #ff59af !important;
        }

        .linked-chat-item[data-item-type="t-leg"] {
            color: #ff8400 !important;
        }
    `;
    document.head.appendChild(style);

    const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const chatMessages = mutation.target.querySelectorAll('.new-chat-message');
                for (let chatMessage of chatMessages) {
                    const linkedChatItems = chatMessage.querySelectorAll('.linked-chat-item');
                    for (let linkedChatItem of linkedChatItems) {
                        linkedChatItem.dispatchEvent(new MouseEvent('mouseover'));
                        setTimeout(() => {
                            linkedChatItem.dispatchEvent(new MouseEvent('mouseout'));
                        }, 50);
                    }
                }
            }
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});
})();