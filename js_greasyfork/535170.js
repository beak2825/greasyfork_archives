// ==UserScript==
// @name         NZBGrabit Retry IMG Fetch
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @run-at       document-end
// @version      1.6
// @description  Retry Fetch buttons with response validation and console logging
// @author       JRem
// @match        https://www.nzbgrabit.org/managenzb.php?do=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535170/NZBGrabit%20Retry%20IMG%20Fetch.user.js
// @updateURL https://update.greasyfork.org/scripts/535170/NZBGrabit%20Retry%20IMG%20Fetch.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Inject animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes wave {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(5deg); }
            75% { transform: rotate(-5deg); }
        }
        .fetching-anim {
            display: inline-block;
            animation: wave 1s infinite ease-in-out;
            #color: yellow;
        }
        .status-message {
            margin-left: 10px;
            font-style: italic;
        }
        .status-success {
            color: green;
        }
        .status-failed {
            color: red;
        }
    `;
    document.head.appendChild(style);

    async function fetchWithRetry(url, updateStatus, attempts = 3, delay = 1000) {
        for (let i = 1; i <= attempts; i++) {
            updateStatus(`Fetching... (${i}/${attempts})`, true);
            try {
                const response = await fetch(url);
                const text = await response.text();
                if (!response.ok || !text.trim()) throw new Error('Empty or bad response');
                return text;
            } catch (err) {
                if (i < attempts) {
                    await new Promise(res => setTimeout(res, delay));
                }
            }
        }
        return 'failed';
    }

    function findClosestInputs(previewInput) {
        let current = previewInput;
        while (current && current.tagName !== 'TR' && current.tagName !== 'DIV') {
            current = current.parentElement;
        }

        if (!current) return {};

        const nzbinfolinkInput = current.querySelector('input[name="nzbinfolink"]');
        const gamesImageInput = current.querySelector('input[name$="_nzbimage"]');

        return { nzbinfolinkInput, gamesImageInput };
    }

    function addRetryButtons() {
        const previewInputs = document.querySelectorAll('input[name="previewimage"]');

        previewInputs.forEach(previewInput => {
            const retryButton = document.createElement('button');
            retryButton.textContent = 'Retry Fetch';
            retryButton.type = 'button';
            retryButton.style.marginLeft = '10px';

            const statusSpan = document.createElement('span');
            statusSpan.className = 'status-message';

            const setStatus = (msg, isFetching = false, isSuccess = false, isFailed = false) => {
                statusSpan.textContent = msg;
                statusSpan.className = 'status-message'; // reset
                if (isFetching) statusSpan.classList.add('fetching-anim');
                if (isSuccess) statusSpan.classList.add('status-success');
                if (isFailed) statusSpan.classList.add('status-failed');
            };

            retryButton.addEventListener('click', async (e) => {
                e.preventDefault();

                const { nzbinfolinkInput, gamesImageInput } = findClosestInputs(previewInput);

                if (!nzbinfolinkInput || !gamesImageInput || !nzbinfolinkInput.value) {
                    setStatus('Missing input', false, false, true);
                    setTimeout(() => setStatus(''), 3000);
                    return;
                }

                const url = `https://www.nzbgrabit.org/getinfo.php?purl=${encodeURIComponent(nzbinfolinkInput.value)}&preq=img`;

                const result = await fetchWithRetry(url, (msg, fetching) => setStatus(msg, fetching));

                console.log(`Fetched for "${nzbinfolinkInput.value}":`, JSON.stringify(result));

                if (result === 'failed') {
                    gamesImageInput.value = 'failed';
                    setStatus('Failed', false, false, true);
                } else {
                    gamesImageInput.value = result;
                    setStatus('Done', false, true, false);
                }

                setTimeout(() => setStatus(''), 3000);
            });

            previewInput.insertAdjacentElement('afterend', retryButton);
            retryButton.insertAdjacentElement('afterend', statusSpan);
        });
    }

    window.addEventListener('load', addRetryButtons);
})();