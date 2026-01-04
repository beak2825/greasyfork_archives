// ==UserScript==
// @name         UEFA Soupiska
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Tlačítko na soupisku a editorial API
// @author       Michal
// @match        https://www.uefa.com/*/match/*
// @grant        GM_xmlhttpRequest
// @connect      editorial.uefa.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480471/UEFA%20Soupiska.user.js
// @updateURL https://update.greasyfork.org/scripts/480471/UEFA%20Soupiska.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let editorialPageId = null;

    function getMatchIDFromURL() {
        const currentURL = window.location.href;
        const matchIDRegex = /(?:\/match\/|\/matches\/)(\d+)/;
        const match = currentURL.match(matchIDRegex);
        if (match && match.length > 1) {
            return match[1];
        }
        return null;
    }

    function interceptEditorialAPI() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            if (typeof url === 'string' && url.includes('editorial.uefa.com/api/pages/')) {
                const match = url.match(/api\/pages\/([^?]+)/);
                if (match && match[1]) {
                    editorialPageId = match[1];
                    updateEditorialButton();
                }
            }
            return originalFetch.apply(this, args);
        };

        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (typeof url === 'string' && url.includes('editorial.uefa.com/api/pages/')) {
                const match = url.match(/api\/pages\/([^?]+)/);
                if (match && match[1]) {
                    editorialPageId = match[1];
                    updateEditorialButton();
                }
            }
            return originalOpen.apply(this, arguments);
        };
    }

    function findEditorialIdInDOM() {
        const scripts = document.querySelectorAll('script[type="application/json"]');
        for (let script of scripts) {
            try {
                const data = JSON.parse(script.textContent);
                const found = findInObject(data, 'pageId');
                if (found && found.match(/^[a-f0-9]{4}-[a-f0-9]{12}-[a-f0-9]{12}-[0-9]+$/)) {
                    editorialPageId = found;
                    return true;
                }
            } catch (e) {
            }
        }
        return false;
    }

    function findInObject(obj, key) {
        if (obj && typeof obj === 'object') {
            if (key in obj) return obj[key];
            for (let k in obj) {
                const result = findInObject(obj[k], key);
                if (result) return result;
            }
        }
        return null;
    }

    function createLiveURLButton(matchID) {
        const liveURL = `https://match.uefa.com/v5/matches/${matchID}`;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'relative';
        buttonContainer.style.textAlign = 'center';
        buttonContainer.style.marginBottom = '1px';
        buttonContainer.style.top = 'auto';
        buttonContainer.style.bottom = '-30px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.justifyContent = 'center';

        const button = document.createElement('a');
        button.href = liveURL;
        button.textContent = 'Soupiska';
        button.target = '_blank';
        button.style.color = 'black';
        button.style.backgroundColor = 'white';
        button.style.padding = '8px 16px';
        button.style.borderRadius = '4px';
        button.style.fontFamily = 'Europa Nuova Bold, sans-serif';
        button.style.textDecoration = 'none';

        buttonContainer.appendChild(button);
        buttonContainer.id = 'uefa-custom-buttons';

        const tabsMenu = document.querySelector('.tabsmenu');
        if (tabsMenu) {
            tabsMenu.parentNode.insertBefore(buttonContainer, tabsMenu);
        }

        return buttonContainer;
    }

    function addEditorialButton() {
        let buttonContainer = document.getElementById('uefa-custom-buttons');

        if (!buttonContainer) {
            const matchID = getMatchIDFromURL();
            if (matchID) {
                buttonContainer = createLiveURLButton(matchID);
            }
        }

        if (buttonContainer && !document.getElementById('editorial-button')) {
            const editorialButton = document.createElement('a');
            editorialButton.id = 'editorial-button';
            editorialButton.textContent = 'Minutáž Futsal';
            editorialButton.target = '_blank';
            editorialButton.style.color = 'black';
            editorialButton.style.backgroundColor = 'white';
            editorialButton.style.padding = '8px 16px';
            editorialButton.style.borderRadius = '4px';
            editorialButton.style.fontFamily = 'Europa Nuova Bold, sans-serif';
            editorialButton.style.textDecoration = 'none';

            if (editorialPageId) {
                editorialButton.href = `https://editorial.uefa.com/api/pages/${editorialPageId}?aggregator=lightpagejson`;
            } else {
                editorialButton.style.opacity = '0.6';
                editorialButton.style.cursor = 'not-allowed';
            }

            buttonContainer.appendChild(editorialButton);
        }
    }

    function updateEditorialButton() {
        const editorialButton = document.getElementById('editorial-button');
        if (editorialButton && editorialPageId) {
            editorialButton.href = `https://editorial.uefa.com/api/pages/${editorialPageId}?aggregator=lightpagejson`;
            editorialButton.style.opacity = '1';
            editorialButton.style.cursor = 'pointer';
        }
    }

    function init() {
        const matchID = getMatchIDFromURL();
        if (matchID) {
            interceptEditorialAPI();

            setTimeout(() => {
                createLiveURLButton(matchID);
                addEditorialButton();

                if (!editorialPageId) {
                    setTimeout(() => {
                        findEditorialIdInDOM();
                        if (editorialPageId) {
                            updateEditorialButton();
                        }
                    }, 2000);
                }
            }, 1000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();