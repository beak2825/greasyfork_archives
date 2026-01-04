// ==UserScript==
// @name         Chatlings Auto-Powerup
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Tired of missing powerups when you're active, but look away for a few seconds? Chatling Auto-Powerup is for you!
// @author       Grayson Powers
// @match        https://www.twitch.tv/j0ko
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449678/Chatlings%20Auto-Powerup.user.js
// @updateURL https://update.greasyfork.org/scripts/449678/Chatlings%20Auto-Powerup.meta.js
// ==/UserScript==

(() => {
    const overlord = 'j0ko_bot';
    const messageTriggers = [
        { text: 'Type !boost within 15 seconds to get a temporary powerup!', response: '!boost' },
        { text: 'FEEDING FRENZY starting in 30 seconds! Type !frenzy to join!', response: '!frenzy' },
        { text: 'Boss spawning in 10 seconds! Type !riot for a temporary damage buff!', response: '!riot' }
    ];

    window.addEventListener('load', async () => {
        const chat = document.querySelector('.chat-scrollable-area__message-container');

        await startObservable(chat, (mutation) => {
            let message = getMessageFromElement(mutation.addedNodes[0]);

            messageTriggers.forEach(trigger => {
                if (message.user === overlord && message.text.indexOf(trigger.text) != -1) {
                    try {
                        setInputValue(trigger.response, true);
                    } catch (error) {
                        console.log(`Failed to ${trigger.response}`, error);
                    }
                }
            });
        });
    }, false);

    function startObservable(targetNode, action) {
        var observerConfig = {
            childList: true
        };

        return new Promise((resolve) => {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    action(mutation);
                });

                resolve(mutations);
            });
            observer.observe(targetNode, observerConfig);
        });
    };

    function getMessageFromElement(element) {
        if (!element) return {}

        const usernameEle = element.querySelector('.chat-author__display-name');
        const textEle = element.querySelector('.text-fragment');

        if (!usernameEle || !textEle) return { user: 'unknown', text: '[ERROR: Failed to get elements]'}

        let message = {
            user: usernameEle.textContent,
            text: textEle.textContent
        };

        // console.log(message);

        return message;
    }

    function setInputValue(text) {
        const inputElement = document.querySelector('.chat-input__textarea');
        const reactEventHandlerName = Object.getOwnPropertyNames(inputElement)[1];
        const reactInputContext = inputElement[reactEventHandlerName].children[0];

        reactInputContext.props.setInputValue(text, true)
    }
})();
