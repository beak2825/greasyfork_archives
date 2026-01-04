// ==UserScript==
// @name         SparkChain Access Token Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show accessToken from localStorage and allow copying
// @author       Forest Army
// @license      MIT
// @match        https://sparkchain.ai/*
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538899/SparkChain%20Access%20Token%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/538899/SparkChain%20Access%20Token%20Extractor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Get the token from localStorage
    const token = localStorage.getItem('accessToken');

    // Create container div
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.background = '#f4f4f4';
    container.style.padding = '10px';
    container.style.border = '2px solid #222';
    container.style.borderRadius = '10px';
    container.style.zIndex = '9999';
    container.style.fontFamily = 'monospace';
    container.style.maxWidth = '90%';
    container.style.wordWrap = 'break-word';

    // Token Text
    const tokenText = document.createElement('div');
    tokenText.textContent = token ? `accessToken: ${token}` : 'accessToken not found.';
    tokenText.style.marginBottom = '8px';
    container.appendChild(tokenText);

    // Copy Button
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 Copy';
    copyBtn.style.padding = '5px 10px';
    copyBtn.style.border = 'none';
    copyBtn.style.borderRadius = '5px';
    copyBtn.style.backgroundColor = '#4CAF50';
    copyBtn.style.color = 'white';
    copyBtn.style.cursor = 'pointer';

    copyBtn.onclick = function () {
        if (token) {
            GM_setClipboard(token);
            copyBtn.textContent = '✅ Copied!';
            setTimeout(() => (copyBtn.textContent = '📋 Copy'), 1500);
        } else {
            alert("No token found.");
        }
    };

    container.appendChild(copyBtn);
    document.body.appendChild(container);
})();