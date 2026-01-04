// ==UserScript==
// @name         Auto Join Jackbox
// @description  Automatically connects to Jackbox game if twitch streamer sends message with code to chat
// @version      1.0.0
// @namespace    http://tampermonkey.net
// @icon         https://jackbox.fun/favicon.ico
// @author       onejeuu
// @license      MIT
// @match        *://*.twitch.tv/*
// @match        *://*.jackbox.fun/*
// @downloadURL https://update.greasyfork.org/scripts/466597/Auto%20Join%20Jackbox.user.js
// @updateURL https://update.greasyfork.org/scripts/466597/Auto%20Join%20Jackbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // !!! ВАЖНО !!!
    // Вы должны быть УЖЕ залогинены на jackbox.fun через Twitch

    // !!! ВАЖНО !!!
    // Поставить true если установлен 7TV
    // Поставить false если НЕ установлен 7TV
    const SEVENTV = true;

    const JACKBOX = {
        URL: 'jackbox.fun',
        NAME: 'BEBRANUH'
    }

    const LOG = {
        ENBALED: true,
        PREFIX: '%c[AUTOJACKBOX]',
        STYLE: 'color: cyan'
    }

    const SELECTOR = {
        ROOT:       'div[id="root"]',
        CHAT:       SEVENTV ? 'main[class="seventv-chat-list"]' : 'div[class="simplebar-content"]',
        MESSAGES:   SEVENTV ? 'span[class="seventv-user-message"]' : 'div[class="chat-line__message"]',
        USERNAME:   SEVENTV ? 'span[class="seventv-chat-user-username"]' : 'span[class="chat-author__display-name"]',
        TEXT:       SEVENTV ? 'span[class="text-token"]' : 'span[class="text-fragment"]',

        JACKBOX: {
            BUTTON:     'button[id="button-join"]',
            INPUT:      'input[id="username"]'
        }
    }

    const REGEX = /(?:(?<=^)|(?<=\s))[A-Za-z]{4}(?=\s|$)/g;

    const TwitchMessagesObserver = class {
        constructor() {
        	this.channelName = window.location.pathname.split('/')[1];

            this.chat = null;
            this.checkedMessages = new Set();

            this.checkChat();

            this.observer = new MutationObserver(this.handleMutations.bind(this));
            this.observer.observe(document.querySelector(SELECTOR.ROOT), {childList: true, subtree: true, attributes: true});

            if (LOG.ENBALED) {
                console.log(LOG.PREFIX, LOG.STYLE, 'NEW OBSERVER:', 'Twitch');
            }
        }

        checkChat() {
            this.chat = document.querySelector(SELECTOR.CHAT);
            this.checkMessages();
        }

        checkMessages() {
        	if (!this.chat) return;

        	const messages = this.chat.querySelectorAll(SELECTOR.MESSAGES);
            if (!messages) return;

            messages.forEach(message => this.checkMessage(message));
        }

        checkMessage(message) {
            if (!message) return;

            const username = message.querySelector(SELECTOR.USERNAME)?.textContent || null;
            if (!username) return;

            if (username !== this.channelName) return;

            const text = message.querySelector(SELECTOR.TEXT)?.textContent || null;
            if (!text) return;

            if (this.checkedMessages.has(text)) return;

            this.checkedMessages.add(text);

            if (LOG.ENBALED) {
                console.log(LOG.PREFIX, LOG.STYLE, `Message from ${username}: ${text}`);
            }

            this.checkCode(text);
        }

        validCode(text) {
            return text.match(REGEX)?.[0]?.toUpperCase().trim() || false;
        }

        checkCode(text) {
            const code = this.validCode(text);
	        if (!code) return;

            if (LOG.ENBALED) {
                console.log(LOG.PREFIX, LOG.STYLE, `Code: ${code}. (${text})`);
            }

	        window.open(`https://${JACKBOX.URL}/${code}`, '_blank');
	    }

        handleMutations(mutationsList) {
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                	this.checkChat();
                });
            });
        }
    }

    const JackboxButtonObserver = class {
    	constructor() {
            this.input = null;
    		this.button = null;

            this.checkInput();
            this.checkButton();

            this.observer = new MutationObserver(this.handleMutations.bind(this));
            this.observer.observe(document.documentElement, {childList: true, subtree: true, attributes: true});

            if (LOG.ENBALED) {
                console.log(LOG.PREFIX, LOG.STYLE, 'NEW OBSERVER:', 'Jackbox');
            }
        }

        checkInput() {
            this.input = document.querySelector(SELECTOR.JACKBOX.INPUT);
            this.checkName();
        }

        checkName() {
            if (!this.input) return;

            if (!this.input.value) {
                this.changeName();
            }
        }

        changeName() {
            if (!this.input) return;

            this.input.value = JACKBOX.NAME;
        }

        checkButton() {
        	this.button = document.querySelector(SELECTOR.JACKBOX.BUTTON);
            this.checkClick();
        }

        checkClick() {
        	if (!this.button) return;

        	if (this.button.disabled) return;

        	this.button.click();
        }

        handleMutations(mutationsList) {
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                	this.checkButton();
                });
            });
        }
    }

    const start = () => {
        const url = window.location.href;

		if (url.includes('twitch')) {
			new TwitchMessagesObserver();
			return;
		}

		if (url.includes('jackbox')) {
			new JackboxButtonObserver();
			return;
		}
    }

    window.addEventListener('load', start);
})();