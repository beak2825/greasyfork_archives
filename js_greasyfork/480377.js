// ==UserScript==
// @name         Atlassian update message
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Update upper message.
// @license      MIT
// @author       IgnaV
// @match        https://rexmas.atlassian.net/*
// @icon         https://www.atlassian.com/favicon.ico
// @grant        none
// @require      https://update.greasyfork.org/scripts/480373/1283462/visibilityChangeListener.js
// @require      https://update.greasyfork.org/scripts/480392/1283450/updateContent.js
// @downloadURL https://update.greasyfork.org/scripts/480377/Atlassian%20update%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/480377/Atlassian%20update%20message.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const onFocus = () => {
        const selector = '#jira-frontend > div:nth-child(6) > div > div:nth-child(1) > div > div > div';
        const fetchSelector = '#jira-frontend > div > div > div > div > div > div';
        const element = document.querySelector(selector);
        fetch(window.location.href)
            .then(response => response.text())
            .then(html => {
            const parser = new DOMParser();
            const fetchDocument = parser.parseFromString(html, 'text/html');
            const responseElement = fetchDocument.querySelector(fetchSelector);
            if (!element) {
                console.error('Elemento no encontrado');
            } else if (!responseElement) {
                console.error('Elemento respuesta no encontrado');
            } else if (element.textContent !== responseElement.textContent) {
                updateContent(element, responseElement.textContent);
            }
        })
            .catch(error => console.error('Error:', error));
    };
    visibilityChangeListener(onFocus, null, 1000 * 60 * 60);
})();