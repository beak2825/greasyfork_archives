// ==UserScript==
// @name         Pluto TV .m3u8 Grabber
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Captures m3u8 URLs via XHR and retrieves the last intercepted URL
// @author       GhostyTongue
// @match        *://*.pluto.tv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506067/Pluto%20TV%20m3u8%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/506067/Pluto%20TV%20m3u8%20Grabber.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastInterceptedUrl = null;
    let logs = [];
    let isInterceptionEnabled = false;
    let enableInterceptionTimeout = null;

    function showAlert(message) {
        const alertBox = document.createElement('div');
        alertBox.style.position = 'fixed';
        alertBox.style.top = '20px';
        alertBox.style.left = '50%';
        alertBox.style.transform = 'translateX(-50%)';
        alertBox.style.backgroundColor = '#333';
        alertBox.style.color = '#fff';
        alertBox.style.padding = '20px';
        alertBox.style.borderRadius = '5px';
        alertBox.style.zIndex = '9999';
        alertBox.style.maxWidth = '80%';
        alertBox.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        alertBox.style.fontSize = '16px';
        alertBox.style.textAlign = 'center';
        alertBox.style.opacity = '0';
        alertBox.style.transition = 'opacity 0.5s';

        const messageElem = document.createElement('p');
        messageElem.innerHTML = message;
        alertBox.appendChild(messageElem);

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#FF4500';
        closeButton.style.color = '#FFFFFF';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            alertBox.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(alertBox);
            }, 500);
        });

        alertBox.appendChild(closeButton);
        document.body.appendChild(alertBox);
        setTimeout(() => {
            alertBox.style.opacity = '1';
        }, 10);
    }

    function logMessage(message) {
        logs.push(message);
        console.log(message);
    }

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        logMessage(`Copied to clipboard: ${text}`);
    }

    function handleUrlChange() {
        logMessage('URL changed - resetting interception state');
        lastInterceptedUrl = null;
        isInterceptionEnabled = false;
        updateButtonColor();

        if (enableInterceptionTimeout) {
            clearTimeout(enableInterceptionTimeout);
            enableInterceptionTimeout = null;
        }

        isInterceptionEnabled = true;
    }

    enableInterceptionTimeout = setTimeout(() => {
        isInterceptionEnabled = true;
        logMessage('Initial interception delay completed');
    }, 2000);

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        const urlLower = url.toLowerCase();

        if (urlLower.includes('master.m3u8') || urlLower.includes('playlist.m3u8')) {
            this.addEventListener('load', () => {
                if (isInterceptionEnabled) {
                    lastInterceptedUrl = url;
                    logMessage(`Intercepted URL via XHR: ${url}`);
                    updateButtonColor();
                }
            });
        }
        originalXHROpen.apply(this, arguments);
    };

    function updateButtonColor() {
        const getButton = document.getElementById('m3u8GrabberButton');
        if (getButton) {
            getButton.style.backgroundColor = lastInterceptedUrl ? '#28a745' : '#ff4444';
        }
    }

    function createGetButton() {
        const getButton = document.createElement("button");
        getButton.id = "m3u8GrabberButton";
        getButton.innerText = "Get Playlist URL";
        getButton.style.position = "fixed";
        getButton.style.top = "10px";
        getButton.style.right = "10px";
        getButton.style.padding = "10px 20px";
        getButton.style.backgroundColor = "#ff4444";
        getButton.style.color = "#FFFFFF";
        getButton.style.border = "none";
        getButton.style.borderRadius = "5px";
        getButton.style.cursor = "pointer";
        getButton.style.zIndex = "9999";
        getButton.style.transition = "background-color 0.5s ease";

        getButton.addEventListener("click", () => {
            if (!lastInterceptedUrl) {
                showAlert("No m3u8 URL detected yet. Please start playing a channel.");
                return;
            }

            copyToClipboard(lastInterceptedUrl);
            showAlert(`URL copied to clipboard!<br><small>${lastInterceptedUrl}</small>`);
        });

        document.body.appendChild(getButton);
    }

    window.addEventListener('load', createGetButton);
})();