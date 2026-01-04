// ==UserScript==
// @name         Qobuz Credentials Logger with Timed Display Box
// @namespace    https://rentry.co/qobuzcredentialslogger
// @version      0.0.1+
// @description  Log Qobuz user credentials to a display box at the bottom center of the page, shown for 5 seconds
// @author       FrankYaLatr - Updated by BoomBookTR
// @match        https://play.qobuz.com/*
// @match        https://www.qobuz.com/*
// @icon         https://www.qobuz.com/favicon.ico
// @license      GPL-2.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515929/Qobuz%20Credentials%20Logger%20with%20Timed%20Display%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/515929/Qobuz%20Credentials%20Logger%20with%20Timed%20Display%20Box.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const outputStyle = `
      font-size: x-large;
      font-weight: bold;
    `;

    const logCredentials = true;

    createDisplayBox();

    if (window.location.origin.startsWith('https://play.')) {
        restoreConsole();

        const user = getUserCredentials();

        if (window.self !== window.top) {
            window.parent.postMessage({ user }, '*');

            return;
        }

        if (user) {
            window.user = user;

            displayUserCredentials(); // Show in display box
            logUserCredentials(); // Log in console
        }

        observePage();

        return;
    }

    window.addEventListener('message', (e) => {
        window.user = e.data.user;

        displayUserCredentials(); // Show in display box
        logUserCredentials(); // Log in console
    });

    embedPlaySite();

    function getUserCredentials() {
        const localStorageUserData = window.localStorage.getItem('localuser');

        if (!localStorageUserData) return;

        const user = JSON.parse(localStorageUserData);

        return { country: user.country_code, id: user.id, token: user.token };
    }

    function observePage() {
        let oldPath = window.location.pathname;

        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (oldPath === window.location.pathname) { return; }

                const user = getUserCredentials();

                window.user = user;

                if (oldPath.includes('/login')) {
                    displayUserCredentials();
                    logUserCredentials();
                }

                oldPath = window.location.pathname;
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function logUserCredentials() {
        if (!(logCredentials && window.user)) { return; }

        console.log('%cCredentials:', outputStyle);
        console.table(window.user);
    }

    function restoreConsole() {
        const i = document.createElement('iframe');
        i.style.display = 'none';
        document.body.appendChild(i);
        window.console = i.contentWindow.console;
    }

    function embedPlaySite() {
        const fr = document.createElement('iframe');
        fr.src = 'https://play.qobuz.com';
        fr.style.display = 'none';
        document.body.appendChild(fr);
    }

    function createDisplayBox() {
        const box = document.createElement('div');
        box.id = 'credentialsBox';
        box.style.position = 'fixed';
        box.style.bottom = '20px';
        box.style.left = '50%';
        box.style.transform = 'translateX(-50%)';
        box.style.backgroundColor = '#333';
        box.style.color = '#fff';
        box.style.padding = '15px';
        box.style.borderRadius = '8px';
        box.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        box.style.fontSize = 'medium';
        box.style.zIndex = '9999';
        box.style.display = 'none'; // Initially hidden
        document.body.appendChild(box);
    }

    function displayUserCredentials() {
        const box = document.getElementById('credentialsBox');

        if (!box || !window.user) return;

        // Display the box and set its content
        box.style.display = 'block';
        box.innerHTML = `
            <strong>Qobuz User Credentials:</strong><br>
            Country: ${window.user.country}<br>
            ID: ${window.user.id}<br>
            Token: ${window.user.token}
        `;

        // Hide the box after 5 seconds
        setTimeout(() => {
            box.style.display = 'none';
        }, 5000); // 5000 milliseconds = 5 seconds
    }
})();
