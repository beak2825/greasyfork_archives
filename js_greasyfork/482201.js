// ==UserScript==
// @name         ChatGPT - Fiverr Helper Script
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  A script works as a helper of Fiverr
// @author       Noushad Bhuiyan
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @icon         https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/media/icons/openai-favicon48.png
// @icon64       https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/media/icons/openai-favicon64.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482201/ChatGPT%20-%20Fiverr%20Helper%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/482201/ChatGPT%20-%20Fiverr%20Helper%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var pasted = false;
    var currentTitle = '';
    var accessToken = window.__NEXT_DATA__.props.pageProps.session.accessToken
    // Selector
    var selector = {
        textarea: 'textarea',
    };

    // Get the createChatQuery from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const createChatQuery = urlParams.get('createChat');

    function readClipboardFromDevTools() {
        return new Promise((resolve, reject) => {
            const _asyncCopyFn = (async () => {
                try {
                    const value = await navigator.clipboard.readText();
                    console.log(`${value} is read!`);
                    resolve(value);
                } catch (e) {
                    reject(e);
                }
                window.removeEventListener("focus", _asyncCopyFn);
            });

            window.addEventListener("focus", _asyncCopyFn);
            console.log("Hit <Tab> to give focus back to document (or we will face a DOMException);");
        });
    }

    // Function to search for the chat room with the matching createChatQuery
    function checkIfQueryFound() {
        console.log('aise ni be')
        if (createChatQuery && !pasted) {
            console.log('aise')
            readClipboardFromDevTools().then(function(r){
                setText(r);
                console.log('aise na')
                pasted = true;
                console.log('Text pasted from clipboard:', r);
            }).catch((err) => {
                console.error('Unable to paste text from clipboard', err);
            });
        }
    }

    function setText(value) {
        const input = document.querySelector(selector.textarea);
        const inputEvent = new Event('input', { bubbles: true });
        window.setTimeout(() => {
            input.value = value;
            input.dispatchEvent(inputEvent);
        }, 3000);
    }
    // Function to fetch current conversation title
    function fetchConversationTitle(urlSlug) {
        return fetch(`https://chatgpt.com/backend-api/conversation/${urlSlug}`, {
            method: 'GET',
            headers: {
                accept: '*/*',
                'accept-language': 'en-US,en;q=0.9',
                authorization: `Bearer ${accessToken}`,
                'oai-device-id': 'cafd95a3-e77b-484f-b2cf-0fae8362242a',
                'oai-language': 'en-US',
                'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Brave";v="126"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'sec-gpc': '1'
            },
            referrer: `https://chatgpt.com/c/${createChatQuery}`,
            referrerPolicy: 'strict-origin-when-cross-origin',
            mode: 'cors',
            credentials: 'include'
        })
            .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
            .then(data => {
            return data.title;
        })
            .catch(error => {
            console.error('Error fetching conversation title:', error);
            return null;
        });
    }

    // Function to update conversation title via PATCH request
    function updateConversationTitle(urlSlug, newTitle) {
        fetch(`https://chatgpt.com/backend-api/conversation/${urlSlug}`, {
            method: 'PATCH',
            headers: {
                accept: '*/*',
                'accept-language': 'en-US,en;q=0.9',
                authorization: `Bearer ${accessToken}`,
                'content-type': 'application/json',
                'oai-device-id': 'cafd95a3-e77b-484f-b2cf-0fae8362242a',
                'oai-language': 'en-US',
                priority: 'u=1, i',
                'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Brave";v="126"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'sec-gpc': '1'
            },
            referrer: `https://chatgpt.com/c/${createChatQuery}`,
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: JSON.stringify({ title: `${createChatQuery} - ${newTitle}` }),
            mode: 'cors',
            credentials: 'include'
        })
            .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
            .then(data => {
            console.log('Title updated successfully:', data);
        })
            .catch(error => {
            console.error('Error updating title:', error);
        });
    }

    // Function to log URL changes and update conversation title
    function logUrlChange() {
        setTimeout(async () => {
            // Splitting the URL by '/' and getting the last segment
            const segments = location.href.split('/');
            const lastSegment = segments[segments.length - 1];
            const newTitle = await fetchConversationTitle(lastSegment);
            if (newTitle && newTitle !== currentTitle && createChatQuery != null) {
                updateConversationTitle(lastSegment, newTitle);
                currentTitle = newTitle;
                console.log('URL changed:', window.location.href);
                location.reload();
            }

        }, 1000); // Small timeout to ensure the URL has changed
    }

    // Listen for the popstate event, which is triggered on back/forward navigation
    window.addEventListener('popstate', logUrlChange);

    // Call checkIfQueryFound after DOMContentLoaded event
    console.log(createChatQuery)
    checkIfQueryFound();

    // Override the pushState and replaceState methods to detect URL changes made through the history API
    (function (history) {
        var pushState = history.pushState;
        var replaceState = history.replaceState;

        history.pushState = function () {
            const result = pushState.apply(history, arguments);
            logUrlChange();
            return result;
        };

        history.replaceState = function () {
            const result = replaceState.apply(history, arguments);
            logUrlChange();
            return result;
        };
    })(window.history);



})();
