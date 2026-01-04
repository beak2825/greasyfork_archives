
// ==UserScript==
// @name          Twitch Pokecatch Bot
// @description   Auto catch pokemmons
// @namespace     https://github.com/victornpb
// @version       1.0
// @match         *://*.twitch.tv/*
// @run-at        document-idle
// @author        victornpb
// @homepageURL   https://github.com/victornpb/
// @supportURL    https://github.com/victornpb/
// @contributionURL https://www.buymeacoffee.com/vitim
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/433608/Twitch%20Pokecatch%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/433608/Twitch%20Pokecatch%20Bot.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function () {

    const LOGPREFIX = '[POKECATCH]';

    function createElm(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.removeChild(div.children[0]);
    }

    document.head.appendChild(createElm`
    <style>
    .pokeBtn {
        display: inline-flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        user-select: none;
        height: var(--button-size-default);
        width: var(--button-size-default);
        border-radius: var(--border-radius-medium);
        background-color: var(--color-background-button-text-default);
        color: var(--color-fill-button-icon);
    }
    </style>`);


    // activation button
    const activateBtn = createElm(`
        <span class="pokeBtn" title="Pokecatching...">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 980 978.9" style="fill: currentcolor;">
                <path d="M509 979h-38l-5-1A485 485 0 0 1 2 531c-1-7 0-14-2-21v-43a59 59 0 0 0 1-5 461 461 0 0 1 18-107Q66 194 201 95c67-50 143-80 226-91a480 480 0 0 1 103-2c38 3 75 10 111 22q208 70 299 271c22 48 34 100 38 153 1 7 0 14 2 20v42l-1 7a464 464 0 0 1-18 106q-43 150-164 248-117 94-267 106c-7 1-14 0-21 2ZM178 521H82c-8 0-8 0-7 7a456 456 0 0 0 8 49q33 148 153 242a406 406 0 0 0 365 72 413 413 0 0 0 304-364c0-4 1-6-5-6H704c-3 0-4 1-5 4l-2 14a212 212 0 0 1-416-14c-1-3-2-4-6-4h-97Zm165-32a147 147 0 0 0 294 0 147 147 0 0 0-294 0Z"/>
            </svg>
        </span>
    `);
    // activateBtn.onclick = toggle;

    let enabled;
    let watchdogTimer;

    setInterval(activatorWatchdog, 5000);
    function activatorWatchdog() {
        const modBtn = document.querySelector('[data-a-target="chat-settings"]');
        if (modBtn) {
            const twitchBar = modBtn.parentElement.parentElement.parentElement.parentElement.parentElement;
            if (twitchBar && !twitchBar.contains(activateBtn)) {
                console.log(LOGPREFIX, 'Adding button...');
                twitchBar.insertBefore(activateBtn, twitchBar.firstChild);
                if (!enabled) {
                    console.log(LOGPREFIX, 'Started chatWatchdog...');
                    watchdogTimer = setInterval(chatWatchdog, 500);
                    enabled = true;
                }
            }
        }
        else {
            if (enabled) {
                console.log(LOGPREFIX, 'Stopped chatWatchdog!');
                clearInterval(watchdogTimer);
                watchdogTimer = enabled = false;
            }
        }
    }


    function parseChat() {
        return Array.from(document.querySelectorAll('[data-test-selector="chat-line-message"]')).map(chat => {
            return {
                username: chat.querySelector('[data-test-selector="message-username"]')?.innerText || '',
                message: chat.querySelector('[data-test-selector="chat-line-message-body"]')?.innerText || '',
                // timestamp: chat.querySelector('[data-test-selector="chat-timestamp"]').innerText,
            };
        });
    }

    const delay = t => new Promise(r => setTimeout(r, t));

    let ignoredMessage = new Set();

    async function chatWatchdog() {
        const messages = parseChat().filter(m => !ignoredMessage.has(m.message));
        for (const m of messages) {
            if (m.username === 'PokemonCommunityGame' && m.message.match(/A wild (\w+) appears/)) {
                ignoredMessage.add(m.message);

                console.log(LOGPREFIX, 'Catching pokemon...', m);
                sendMessage('!pokecatch greatball');
            }
        }
    }

    function sendMessage(msg) {
        console.log(LOGPREFIX, 'Sending...', msg);
        const textarea = document.querySelector("[data-a-target='chat-input']");
        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeTextAreaValueSetter.call(textarea, msg);
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
        document.querySelector("[data-a-target='chat-send-button']").click();
    }

})();
