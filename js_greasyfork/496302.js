// ==UserScript==
// @name         PI.ai Voice
// @namespace    https://github.com/HellFiveOsborn
// @version      2024-05-29
// @description  Adds voice option in PI.ai responses
// @author       HellFive Osborn
// @match        https://pi.ai/threads
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pi.ai
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @compatible          opera
// @compatible          brave
// @compatible          vivaldi
// @compatible          waterfox
// @compatible          librewolf
// @compatible          ghost
// @compatible          qq
// @compatible          whale
// @compatible          kiwi
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496302/PIai%20Voice.user.js
// @updateURL https://update.greasyfork.org/scripts/496302/PIai%20Voice.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .animate-spin {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);

    const originalFetch = window.fetch;
    let audio = null;
    let preferredVoice;

    // set the default value for preferredVoice in localStorage
    if (!localStorage.getItem('preferredVoice')) {
        localStorage.setItem('preferredVoice', 'voice1');
    }

    window.fetch = function(...args) {
        const url = args[0];
        const options = args[1] || {};

        // retrieve the preferredVoice value from localStorage
        preferredVoice = localStorage.getItem('preferredVoice');

        if (typeof url === 'string' && url.startsWith("/api/chat/start") || url.startsWith("/api/user/settings") && (!options.method || options.method.toUpperCase() === 'POST')) {
            return originalFetch.apply(this, arguments).then(response => {
                const clonedResponse = response.clone();
                clonedResponse.text().then(text => {
                    // parse the response text as JSON and update the preferredVoice value if necessary
                    const data = JSON.parse(!url.startsWith("/api/user/settings") ? text : options.body);
                    if (data.preferredVoice && data.preferredVoice !== preferredVoice) {
                        preferredVoice = data.preferredVoice;
                        localStorage.setItem('preferredVoice', preferredVoice);
                    }
                });
                return response;
            });
        }

        if (typeof url === 'string' && url.startsWith("/api/chat/history?conversation=") && (!options.method || options.method.toUpperCase() === 'GET')) {
            return originalFetch.apply(this, arguments).then(response => {
                const clonedResponse = response.clone();
                clonedResponse.text().then(text => {
                    let { messages } = JSON.parse(text);
                    let AIMessages = messages.filter(item => item.direction === "outbound");
                    window.AIMessages = AIMessages.reverse();
                    processNewElements();
                });
                return response;
            });
        }
        return originalFetch.apply(this, arguments);
    };

    function createButton(sid) {
        let button = `<button id="voiceButton" class="w-8 h-8 p-2 flex z-10 items-center text-neutral-800 inset-0 bg-neutral-200 mt-4" style="border-radius:9999px;" type="button" data-sid="${sid}"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5 text-primary-700 lg:h-6 lg:w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" data-darkreader-inline-fill="" data-darkreader-inline-stroke="" style="--darkreader-inline-fill: currentColor; --darkreader-inline-stroke: currentColor;"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z"></path><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z"></path></svg></button>`;
        let btn = document.createElement('div');
        btn.innerHTML = button;
        let buttonElement = btn.firstElementChild;
        buttonElement.addEventListener('click', () => handleButtonClick(buttonElement, sid));
        return buttonElement;
    }

    function handleButtonClick(button, sid) {
        if (audio && !audio.paused) {
            audio.pause();
            audio = null;
            button.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5 text-primary-700 lg:h-6 lg:w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" data-darkreader-inline-fill="" data-darkreader-inline-stroke="" style="--darkreader-inline-fill: currentColor; --darkreader-inline-stroke: currentColor;"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z"></path><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z"></path></svg>`;
            return;
        }

        button.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" aria-hidden="true" class="h-5 w-5 animate-spin lg:h-6 lg:w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" data-darkreader-inline-fill="" data-darkreader-inline-stroke="" style="--darkreader-inline-fill: currentColor; --darkreader-inline-stroke: currentColor;"><path d="M512 64C265.6 64 64 265.6 64 512s201.6 448 448 448 448-201.6 448-448S758.4 64 512 64zm0 820.8C308.8 884.8 139.2 715.2 139.2 512S308.8 139.2 512 139.2 884.8 308.8 884.8 512 715.2 884.8 512 884.8z" /><path d="M512 139.2V64c-247.2 0-448 200.8-448 448s200.8 448 448 448v-75.2c-204 0-372.8-168.8-372.8-372.8S308 139.2 512 139.2z" /></svg>`;

        fetch(`https://pi.ai/api/chat/voice?mode=eager&voice=${preferredVoice}&messageSid=${sid}`, {
            method: 'GET'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            audio = new Audio(url);
            audio.play();

            button.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5 lg:h-6 lg:w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" data-darkreader-inline-fill="" data-darkreader-inline-stroke="" style="--darkreader-inline-fill: currentColor; --darkreader-inline-stroke: currentColor;"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z"></path></svg>`;
            audio.onended = () => {
                button.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5 text-primary-700 lg:h-6 lg:w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" data-darkreader-inline-fill="" data-darkreader-inline-stroke="" style="--darkreader-inline-fill: currentColor; --darkreader-inline-stroke: currentColor;"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z"></path><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z"></path></svg>`;
            };
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    function processNewElements() {
        if (!window.AIMessages) return;
        let AIContainers = window.document.querySelectorAll('.break-anywhere:not([class*=" "])');
        AIContainers.forEach((element, index) => {
            if (!element.querySelector('#voiceButton') && window.AIMessages[index]) {
                let sid = window.AIMessages[index].sid;
                let button = createButton(sid);
                let contentMenu = document.createElement('div');
                contentMenu.classList.add('flex', 'items-center', 'gap-2'); // add Tailwind CSS classes

                // move data-projection element to the new div
                let dataProjection = element.querySelector("div[data-projection-id]");
                if (dataProjection) {
                    contentMenu.appendChild(dataProjection);
                }

                // append button and contentMenu to the element
                contentMenu.appendChild(button);
                element.appendChild(contentMenu);
            }
        });
    }

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                processNewElements();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function checkForUpdate() {
        var scriptUrl = 'https://update.greasyfork.org/scripts/496302/PIai%20Voice.user.js';

        GM_xmlhttpRequest({
            method: 'GET',
            url: scriptUrl,
            headers: {
                'Accept': 'text/plain'
            },
            onload: function(response) {
                var lastModified = new Date(response.responseHeaders.get('Last-Modified')).getTime();

                var lastChecked = localStorage.getItem('PIaiVoiceLastChecked');

                if (!lastChecked || lastModified > lastChecked) {
                    localStorage.setItem('PIaiVoiceLastChecked', lastModified);
                    GM_notification({
                        text: 'An update to the PI.ai Voice script is available on GreasyFork. Visit <https://greasyfork.org/scripts/496302-PIai-Voice> for more information.',
                        title: 'PI.ai Voice: Update available 🚀',
                        timeout: 10000
                    });
                }
            },
            onerror: function() {
                console.error('Failed to check for updates to the PI.ai Voice script.');
            }
        });
    }

    // Calls checkForUpdate() function every 24 hours
    setInterval(checkForUpdate, 24 * 60 * 60 * 1000);

    console.log("Fetch request interceptor and MutationObserver have been set up.");
})();