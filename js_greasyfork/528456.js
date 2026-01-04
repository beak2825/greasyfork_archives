// ==UserScript==
// @name         UTILS_DOM Library
// @namespace    dannysaurus.epik
// @version      1.2
// @description  dom manipulation library
//
// @license      MIT
// @grant        unsafeWindow
// ==/UserScript==

/* jslint esversion: 11 */
/* global unsafeWindow */
(() => {
    'use strict';
    const selectors = (() => {
        const ids = {
            bcasts: 'media-stream-players',
            ctabs: 'chat-section-tabs',
            chatInputWrapper: 'message',
            broadcastSlots: 'media-stream-players',
            messagesLC: 'messagesLC',
            usersLC: 'usersLC',
            userSection: 'user-section',
            chatSection: 'chat-section',
            sidebarSection: 'sidebar-section',
        };

        const classNames = {
            emojionearea: 'emojionearea',
            emojioneareaInline: 'emojionearea-inline',
            bcstPlayer: 'bcst-player',
            userItem: 'user-item',
            theIcons: 'the-icons',
            faUser: 'fa-user',
            name: 'name',
            userPill: 'user-pill',
        };
        const attributes = {};

        const querySelectors = {
            bcastsContainer: `#${ids.bcasts}`,
            ctabsContainer: `#${ids.ctabs}`,
            chatInputWrapper: `#${ids.chatInputWrapper}`,
            broadcastSlots: `#${ids.broadcastSlots}`,
            messagesLC: `#${ids.messagesLC}`,
            usersLC: `#${ids.usersLC}`,
            userSection: `#${ids.userSection}`,
            chatSection: `#${ids.chatSection}`,
            sidebarSection: `#${ids.sidebarSection}`,

            ctextContainer: `.${classNames.emojionearea}.${classNames.emojioneareaInline}`,
            bcstPlayer: `.${classNames.bcstPlayer}`,
            userItem: `.${classNames.userItem}`,
            userIcon: `.${classNames.theIcons} .${classNames.faUser}`,
            usernameContainer: `.${classNames.userPill} .${classNames.name}`,
        };

        return {
            ids,
            classNames,
            attributes,
            querySelectors,
        };
    })();

    /**
     * Tries to select an element by repeatedly attempting to find it.
     *
     * @param {Object} options - The options for selecting the element.
     * @param {String} [options.selectors] - The function to select the element.
     * @param {number} [options.maxAttempts=6] - The number of attempts to make.
     * @param {number} [options.intervalMs=10000] - The interval between attempts in milliseconds.
     * @returns {Promise<Element|NodeList>} The selected element(s).
     *
     * @throws {Error} If the element(s) could not be found.
     */
    const trySelectElement = async ({ selectors, maxAttempts = 6, intervalMs = 10000, throwError = true, } = {}) => {
        const sleep = () => new Promise(resolve => setTimeout(resolve, intervalMs));

        for (let attemptCount = 0; attemptCount < maxAttempts; attemptCount++) {
            const elements = document.querySelector(selectors);
            if (elements instanceof Element || (elements instanceof NodeList && elements.length)) {
                return elements;
            }
            await sleep();
        }
        throw new Error(`Element(s) not found with selectors: ${selectors}`);
    };

    const getUsername = () => {
        return document.querySelector(selectors.querySelectors.usernameContainer)?.textContent || '';
    };

    /**
     * Checks if the specified keys are pressed.
     *
     * @param {KeyboardEvent} event - The keyboard event.
     * @param {Object} keysToCheck - The keys to check.
     * @returns {boolean} True if all specified keys are pressed, false otherwise.
     */
    const areKeysPressed = (event, keysToCheck) => {
        const keys = Object.keys(keysToCheck || []);
        if (keys.length === 0) {
            return false;
        }
        return Object.keys(keysToCheck).every(key => event[key] === keysToCheck[key]);
    };

    unsafeWindow.dannysaurus_epik ||= {};
    unsafeWindow.dannysaurus_epik.libraries ||= {};
    unsafeWindow.dannysaurus_epik.libraries.UTILS_DOM = {
        selectors: selectors,
        trySelectElement,
        getUsername,
        areKeysPressed,
    };
})();