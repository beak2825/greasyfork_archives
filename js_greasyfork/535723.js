// ==UserScript==
// @name         JD2 Click'n'Load
// @license      GNU GPLv3
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Aggiunge un pulsante Click'n'Load per JDownloader 2
// @author       Al3
// @match        *://www.hditaliabits.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hditaliabits.online
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/535723/JD2%20Click%27n%27Load.user.js
// @updateURL https://update.greasyfork.org/scripts/535723/JD2%20Click%27n%27Load.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const JD_IP = '127.0.0.1';
    const JD_PORT = '9666';
    const JD_PATH = '/flash/add';
    const BUTTON_TEXT = 'Invia a JDownloader';
    const BUTTON_COLOR = '#4CAF50';
    const BUTTON_HOVER_COLOR = '#45a049';
    const BUTTON_TEXT_COLOR = 'white';
    const BUTTON_PADDING = '8px 16px';
    const BUTTON_BORDER_RADIUS = '4px';
    const BUTTON_MARGIN = '10px 0';
    const SOURCE_SITE = 'hditaliabits.online';

    const style = document.createElement('style');
    style.textContent = `
        .jd-button-container {
            display: flex;
            justify-content: center;
            margin: ${BUTTON_MARGIN};
            position: relative;
        }

        .jd-button {
            background-color: ${BUTTON_COLOR};
            color: ${BUTTON_TEXT_COLOR};
            padding: ${BUTTON_PADDING};
            border: none;
            border-radius: ${BUTTON_BORDER_RADIUS};
            cursor: pointer;
            font-weight: bold;
            display: flex;
            align-items: center;
            transition: background-color 0.3s, transform 0.2s, opacity 0.3s;
            position: relative;
            overflow: hidden;
        }

        .jd-button:hover {
            background-color: ${BUTTON_HOVER_COLOR};
        }

        .jd-button:active {
            transform: scale(0.95);
        }

        .jd-button.sending {
            opacity: 0.7;
            pointer-events: none;
            background-color: #999;
        }

        .jd-button.success::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.3);
            animation: pulse 1s;
        }

        .jd-button .success-text {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${BUTTON_COLOR};
            color: white;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s;
        }

        .jd-button.success .success-text {
            display: flex;
        }

        .jd-logo {
            width: 20px;
            height: 20px;
            margin-right: 8px;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xOSAxOUg1VjVoN1YzSDVjLTEuMTEgMC0yIC45LTIgMnYxNGMwIDEuMS44OSAyIDIgMmgxNGMxLjExIDAgMi0uOSAyLTJ2LTdoLTJ2N3pNMTQgM3YyaDMuNTlsLTkuODMgOS44MyAxLjQxIDEuNDFMMTkgNi40MVYxMGgyVjNoLTd6Ii8+PC9zdmc+');
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
        }

        .jd-password-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s;
        }

        .jd-password-dialog {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            width: 350px;
            max-width: 90%;
        }

        .jd-password-dialog h3 {
            margin-top: 0;
            color: #333;
        }

        .jd-password-dialog p {
            margin-bottom: 15px;
            color: #666;
        }

        .jd-password-input {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .jd-password-buttons {
            display: flex;
            justify-content: flex-end;
        }

        .jd-password-cancel {
            background-color: #f1f1f1;
            color: #333;
            border: none;
            padding: 8px 16px;
            margin-right: 10px;
            border-radius: 4px;
            cursor: pointer;
        }

        .jd-password-submit {
            background-color: ${BUTTON_COLOR};
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }

        .jd-buttons-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: ${BUTTON_MARGIN};
        }

        .jd-buttons-group .jd-button-container {
            margin: 5px 0;
        }

        @keyframes pulse {
            0% {
                opacity: 1;
            }
            100% {
                opacity: 0;
            }
        }

        @keyframes fadeIn {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    function extractLinks(element) {
        const text = element.innerHTML;
        const regex = /(https?:\/\/[^\s<>"]+)/g;
        return text.match(regex) || [];
    }

    function groupLinksByHost(links) {
        const groups = {};

        links.forEach(link => {
            try {
                const url = new URL(link);
                const host = url.hostname;

                if (!groups[host]) {
                    groups[host] = [];
                }

                groups[host].push(link);
            } catch (e) {
                console.error('Errore nel parsing dell\'URL:', e);
            }
        });

        return groups;
    }

    function getReadableHostName(host) {
        const hostParts = host.split('.');
        if (hostParts.length >= 2) {
            return hostParts[hostParts.length - 2];
        }
        return host;
    }

    function getPageTitle() {
        const titleElement = document.querySelector('div.mov-desc h2.left-sub.subtitle');
        if (titleElement) {
            return titleElement.textContent.trim();
        }
        return document.title || 'Pagina senza titolo';
    }

    function createPasswordPopup(links, packageName, button, callback) {
        const modal = document.createElement('div');
        modal.className = 'jd-password-modal';

        const dialog = document.createElement('div');
        dialog.className = 'jd-password-dialog';

        const title = document.createElement('h3');
        title.textContent = 'Password per l\'archivio';
        dialog.appendChild(title);

        const passwordDesc = document.createElement('p');
        passwordDesc.textContent = 'Inserisci la password per decomprimere l\'archivio (lascia vuoto se non necessaria):';
        dialog.appendChild(passwordDesc);

        const passwordInput = document.createElement('input');
        passwordInput.type = 'text';
        passwordInput.className = 'jd-password-input';
        passwordInput.placeholder = 'Password';
        dialog.appendChild(passwordInput);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'jd-password-buttons';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'jd-password-cancel';
        cancelButton.textContent = 'Annulla';
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(modal);
            button.classList.remove('sending');
        });
        buttonsContainer.appendChild(cancelButton);

        const submitButton = document.createElement('button');
        submitButton.className = 'jd-password-submit';
        submitButton.textContent = 'Invia';
        submitButton.addEventListener('click', function() {
            const password = passwordInput.value.trim();
            document.body.removeChild(modal);
            callback(password, packageName);
        });
        buttonsContainer.appendChild(submitButton);

        dialog.appendChild(buttonsContainer);
        modal.appendChild(dialog);

        document.body.appendChild(modal);

        setTimeout(() => {
            passwordInput.focus();
        }, 100);

        passwordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitButton.click();
            }
        });
    }

    function sendToJDownloader(links, packageName, extractPassword, button) {
        let data = `urls=${encodeURIComponent(links.join('\r\n'))}`;

        data += `&source=${encodeURIComponent(SOURCE_SITE)}`;

        data += `&package=${encodeURIComponent(packageName)}`;

        if (extractPassword && extractPassword.length > 0) {
            data += `&passwords=${encodeURIComponent(extractPassword)}`;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: `http://${JD_IP}:${JD_PORT}${JD_PATH}`,
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                console.log("Richiesta inviata con successo a JDownloader");

                button.classList.remove('sending');

                button.classList.add('success');

                setTimeout(() => {
                    button.classList.remove('success');
                }, 2000);
            },
            onerror: function(error) {
                console.error("Errore nell'invio della richiesta a JDownloader", error);

                button.classList.remove('sending');

                button.style.backgroundColor = '#f44336';
                setTimeout(() => {
                    button.style.backgroundColor = BUTTON_COLOR;
                }, 1000);
            }
        });
    }

    function createJDButtons(links, spoilerDiv) {
        const linkGroups = groupLinksByHost(links);
        const hostCount = Object.keys(linkGroups).length;

        const pageTitle = getPageTitle();

        const buttonsGroupContainer = document.createElement('div');
        buttonsGroupContainer.className = 'jd-buttons-group';

        Object.keys(linkGroups).forEach(host => {
            const hostLinks = linkGroups[host];
            const readableHostName = getReadableHostName(host);

            const packageName = `${pageTitle} - ${readableHostName}`;

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'jd-button-container';

            const button = document.createElement('button');
            button.className = 'jd-button';

            const logo = document.createElement('span');
            logo.className = 'jd-logo';
            button.appendChild(logo);

            let buttonTextContent = BUTTON_TEXT;
            if (hostCount > 1) {
                buttonTextContent += ` (${readableHostName})`;
            }
            const buttonText = document.createTextNode(buttonTextContent);
            button.appendChild(buttonText);

            const successText = document.createElement('span');
            successText.className = 'success-text';
            successText.textContent = 'Aggiunto a JDownloader!';
            button.appendChild(successText);

            button.addEventListener('click', function(e) {
                e.preventDefault();

                button.classList.add('sending');

                createPasswordPopup(hostLinks, packageName, button, function(extractPassword, finalPackageName) {
                    sendToJDownloader(hostLinks, finalPackageName, extractPassword, button);
                });
            });

            buttonContainer.appendChild(button);

            buttonsGroupContainer.appendChild(buttonContainer);
        });

        spoilerDiv.parentNode.insertBefore(buttonsGroupContainer, spoilerDiv.nextSibling);
    }

    function processDivsInChunks(divs, chunkSize = 5) {
        let index = 0;

        function processNextChunk() {
            const chunk = Array.from(divs).slice(index, index + chunkSize);
            index += chunkSize;

            if (chunk.length > 0) {
                chunk.forEach(div => {
                    const links = extractLinks(div);
                    if (links.length > 0) {
                        createJDButtons(links, div);
                    }
                });

                setTimeout(processNextChunk, 0);
            }
        }

        processNextChunk();
    }

    function main() {
        const spoilerDivs = document.querySelectorAll('div.text_spoiler');

        if (spoilerDivs.length > 0) {
            processDivsInChunks(spoilerDivs);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        setTimeout(main, 0);
    }

    let isObserving = true;
    const observer = new MutationObserver(function(mutations) {
        if (!isObserving) return;

        isObserving = false;

        setTimeout(() => {
            const newSpoilerDivs = [];

            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.classList && node.classList.contains('text_spoiler')) {
                                newSpoilerDivs.push(node);
                            } else {
                                const foundDivs = node.querySelectorAll('div.text_spoiler');
                                if (foundDivs.length > 0) {
                                    foundDivs.forEach(div => newSpoilerDivs.push(div));
                                }
                            }
                        }
                    });
                }
            });

            if (newSpoilerDivs.length > 0) {
                processDivsInChunks(newSpoilerDivs);
            }

            isObserving = true;
        }, 100);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
