// ==UserScript==
// @name         Torn Forum Timestamps Highlighter with Local Storage
// @namespace    http://tampermonkey.net/
// @version      2.75
// @description  Matches forum threads with API data, displays their timestamps, and allows for custom highlighting of threads based on the number of days back a user wants highlighted, while using local storage to save API results.
// @author       ShadowBirb
// @license      MIT
// @match        https://www.torn.com/forums.php*
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/520457/Torn%20Forum%20Timestamps%20Highlighter%20with%20Local%20Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/520457/Torn%20Forum%20Timestamps%20Highlighter%20with%20Local%20Storage.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to get API key from local storage
    const getApiKey = () => localStorage.getItem('tornApiKey');

    // Function to set API key to local storage
    const setApiKey = (key) => localStorage.setItem('tornApiKey', key);

    // Function to save thread data to local storage
    const saveThreadToLocalStorage = (threadId, data) => {
        const threads = JSON.parse(localStorage.getItem('threadData')) || {};
        threads[threadId] = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem('threadData', JSON.stringify(threads));
    };

    // Function to get thread data from local storage
    const getThreadFromLocalStorage = (threadId) => {
        const threads = JSON.parse(localStorage.getItem('threadData')) || {};
        return threads[threadId] || null;
    };

    // Function to add buttons to the page
    const addButtons = () => {
        const forumsHeader = document.querySelector('#skip-to-content');
        if (!forumsHeader || document.querySelector('#custom-buttons-container')) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'custom-buttons-container';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '10px';

        const runButton = document.createElement('button');
        runButton.textContent = 'Run Forum Timestamps';
        runButton.style.backgroundColor = '#4CAF50';
        runButton.style.color = 'white';
        runButton.style.border = 'none';
        runButton.style.borderRadius = '5px';
        runButton.style.padding = '5px 15px';
        runButton.style.cursor = 'pointer';

        runButton.addEventListener('click', () => {
            processThreads();
            applyCustomStyles();
        });

        const apiKeyButton = document.createElement('button');
        apiKeyButton.textContent = 'Public API Key';
        apiKeyButton.style.backgroundColor = 'gray';
        apiKeyButton.style.color = 'white';
        apiKeyButton.style.border = 'none';
        apiKeyButton.style.borderRadius = '5px';
        apiKeyButton.style.padding = '5px 15px';
        apiKeyButton.style.cursor = 'pointer';

        apiKeyButton.addEventListener('click', showApiKeyPrompt);

        buttonContainer.appendChild(runButton);
        buttonContainer.appendChild(highlightButton);
        buttonContainer.appendChild(apiKeyButton);
        forumsHeader.after(buttonContainer);
        forumsHeader.remove();
    };

    // Button to highlight threads
    const highlightButton = document.createElement('button');
    highlightButton.textContent = 'Highlight Threads';
    highlightButton.style.backgroundColor = 'rgb(25,115,225)';
    highlightButton.style.color = 'white';
    highlightButton.style.border = 'none';
    highlightButton.style.borderRadius = '5px';
    highlightButton.style.padding = '5px 15px';
    highlightButton.style.cursor = 'pointer';

    highlightButton.addEventListener('click', () => showToast());

    const showToast = () => {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '70px';
        toast.style.right = '20px';
        toast.style.padding = '15px';
        toast.style.backgroundColor = 'rgb(51,51,51)';
        toast.style.color = 'white';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        toast.style.zIndex = '1000';
        toast.textContent = 'Enter how many days ago to highlight threads:';

    const input = document.createElement('input');
        input.type = 'number';
        input.style.marginLeft = '10px';
        input.style.border = '1px solid white';
        input.style.borderRadius = '3px';
        input.style.padding = '5px';
        toast.appendChild(input);

    const button = document.createElement('button');
        button.textContent = 'Highlight';
        button.style.marginLeft = '10px';
        button.style.backgroundColor = '#007BFF';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '5px 10px';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';

    button.addEventListener('click', () => {
        const days = parseInt(input.value, 10);
        if (isNaN(days) || days <= 0) {
            alert('Please enter a valid number of days.');
            return;
        }
        highlightThreads(days);
        document.body.removeChild(toast);
    });

    toast.appendChild(button);
    document.body.appendChild(toast);
};

// Add the highlight button to the button container
document.querySelector('#custom-buttons-container')?.appendChild(highlightButton);

// Highlight threads based on cached data
const highlightThreads = (daysAgo) => {
    const cutoffTime = Date.now() - daysAgo * 24 * 60 * 60 * 1000;

    document.querySelectorAll('.thread-name').forEach((threadElement) => {
        const href = threadElement.getAttribute('href');
        if (!href) return;

        const match = href.match(/t=(\d+)/);
        if (match) {
            const threadId = match[1];
            const threads = JSON.parse(localStorage.getItem('threadData')) || {};
            const cachedThread = threads[threadId];

            if (cachedThread && cachedThread.data.thread.first_post_time * 1000 > cutoffTime) {
                // Highlight thread
                threadElement.style.backgroundColor = 'rgba(185,180,200,.5)'; // Gray background
            }
        }
    });
};


        // Apply width to specific thread name elements
    const applyCustomStyles = () => {
        document.querySelectorAll('.d .forums-committee-wrap .forums-committee .threads-list > li .thread-name-wrap .thread-name').forEach((element) => {
            element.style.width = '480px';

            // Format thread name elements
            document.querySelectorAll('li.thread-name[role="heading"][aria-level="5"]').forEach((element) => {
                element.style.width = '515px';

                // Format thread name elements and apply max-width: max-content
                document.querySelectorAll('.title-flex-parent').forEach((element) => {
                    element.style.maxWidth = 'max-content';

                    // Remove the headers
                    document.querySelectorAll('.thread-pages.t-hide.m-hide, .last-post.t-overflow, .last-post.title-divider.divider-spiky').forEach(element => {
                        element.remove();
                    });
                });
            });
        });
    };

    // Start by adding buttons after 2.5 seconds
    setTimeout(() => addButtons(), 2500);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    };

    const processThreads = () => {
        console.log('Fetching API data for threads...');

        const threadLinks = Array.from(document.querySelectorAll('.thread-name'))
            .map(link => {
                const href = link.getAttribute('href');
                if (!href) return null;
                const match = href.match(/t=(\d+)/);
                return match ? match[1] : null;
            })
            .filter(id => id !== null);

        if (threadLinks.length === 0) {
            console.error('No thread IDs found on the page.');
            return;
        }

    const apiKey = getApiKey();

        threadLinks.forEach(threadId => {
            const cachedThread = getThreadFromLocalStorage(threadId);

            if (cachedThread && Date.now() - cachedThread.timestamp < 7 * 24 * 60 * 60 * 1000) { // Use cache if less than 7 days old
                appendTimestampToThread(threadId, cachedThread.data);
                return;
            }

            const apiUrl = `https://api.torn.com/v2/forum/${threadId}/thread?key=${apiKey}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: function (response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        if (data && data.thread) {
                            saveThreadToLocalStorage(threadId, data);
                            appendTimestampToThread(threadId, data);
                        }
                    }
                }
            });
        });
    };

    const appendTimestampToThread = (threadId, data) => {
        document.querySelectorAll('.thread-name').forEach((threadElement) => {
            const href = threadElement.getAttribute('href');
            if (!href) return;
            const match = href.match(/t=(\d+)/);
            if (match && match[1] === threadId) {
                const timestamp = formatTimestamp(data.thread.first_post_time);
                const timestampElement = document.createElement('span');
                timestampElement.style.color = 'gray';
                timestampElement.style.marginLeft = '10px';
                timestampElement.textContent = `Posted: ${timestamp}`;
                threadElement.appendChild(timestampElement);
            }
        });
    };

    const showApiKeyPrompt = () => {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '70px';
        toast.style.right = '20px';
        toast.style.padding = '15px';
        toast.style.backgroundColor = 'rgb(51,51,51)';
        toast.style.color = 'white';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        toast.style.zIndex = '1000';
        toast.textContent = 'Enter your public API key:';

        const input = document.createElement('input');
        input.type = 'text';
        input.style.marginLeft = '10px';
        input.style.border = '1px solid white';
        input.style.borderRadius = '3px';
        input.style.padding = '5px';
        toast.appendChild(input);

        const button = document.createElement('button');
        button.textContent = 'Save Key';
        button.style.marginLeft = '10px';
        button.style.backgroundColor = 'gray';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '5px 10px';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => {
            const apiKey = input.value.trim();
            if (!apiKey) {
                alert('Please enter a valid API key.');
                return;
            }
            setApiKey(apiKey);
            document.body.removeChild(toast);
        });

        toast.appendChild(button);
        document.body.appendChild(toast);
    };

// Function to detect URL changes and re-add buttons
    let currentUrl = window.location.href;

    const observeUrlChanges = () => {
        setInterval(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                setTimeout(() => {
                    addButtons();
                }, 1000); // 1.5 seconds delay to re-add buttons
            }
        }, 250); // Check URL every 250 milliseconds
    };

    // Start observing URL changes
    observeUrlChanges();

    setTimeout(() => addButtons(), 2500);
})();
