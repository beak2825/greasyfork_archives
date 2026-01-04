// ==UserScript==
// @name         EmailHunter - Auto Email Extractor
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Automatically extracts emails from any web page and displays a floating button.
// @author       You
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAACEUExURQAAAEKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9EKF9AAAAP6ed9MAAAAqdFJOUwAA9WAM9o0fxDsC9/jD+V/6jPvCOvz9/l6LHsEFEypKcqTeAQsdOV2KwNYsDn0AAAABYktHRACIBR1IAAAAB3RJTUUH6QYXDS83HWh0XQAAALRJREFUSMftlUcOwkAQBBcwyWQw0eRM//+BHBBCGK93Shyh7q0peyc498dIuRKxQFWq1WFAajRjc6ClB2aztp4YzV4BqWMx6+qNXtCsrwyDgNlQH4ySmAWKzcbKx2s2kQ+P2VQFzCIYkOaLbEAh0oxZablab7a7PTVzh+PpfLnezGbBgmlS3Gd5Bb+sYP4G/JfwO+CXxr2EuxXPA544PNN4a+C9hDcf3q14e+P7gC8QvnG/xh2yxXP3wfwNUwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNS0wNi0yM1QxMzo0Nzo1NSswMDowME8lepQAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjUtMDYtMjNUMTM6NDc6NTUrMDA6MDA+eMIoAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI1LTA2LTIzVDEzOjQ3OjU1KzAwOjAwaW3j9wAAAABJRU5ErkJggg==
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// @license      Copyright (c) 2025 ominipcba.
// @downloadURL https://update.greasyfork.org/scripts/540628/EmailHunter%20-%20Auto%20Email%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/540628/EmailHunter%20-%20Auto%20Email%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!document.body) {
        console.warn("EmailHunter: document.body not found. Script will not run on this page.");
        return;
    }

    let foundEmails = new Set();
    let emailDisplayButton;
    let modal;

    function extractEmailsFromText(text) {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        return text.match(emailRegex) || [];
    }

    function scanPageForEmails() {
        const newEmails = extractEmailsFromText(document.body.innerText);
        let updated = false;
        newEmails.forEach(email => {
            if (!foundEmails.has(email)) {
                foundEmails.add(email);
                updated = true;
            }
        });

        if (updated) {
            updateEmailDisplayButton();
        }
    }

    function createEmailDisplayButton() {
        if (emailDisplayButton) return;

        emailDisplayButton = document.createElement('div');
        emailDisplayButton.id = 'email-extractor-button';
        emailDisplayButton.innerText = 'Emails: 0';
        document.body.appendChild(emailDisplayButton);

        emailDisplayButton.addEventListener('click', showEmailList);

        GM_addStyle(`
            #email-extractor-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #007bff;
                color: white;
                padding: 10px 15px;
                border-radius: 25px;
                cursor: pointer;
                z-index: 9999;
                font-family: sans-serif;
                font-size: 14px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                transition: background-color 0.3s;
            }
            #email-extractor-button:hover {
                background-color: #0056b3;
            }
        `);
    }

    function updateEmailDisplayButton() {
        if (!emailDisplayButton) {
            createEmailDisplayButton();
        }
        emailDisplayButton.innerText = `Emails: ${foundEmails.size}`;
    }

    function showEmailList() {
        if (modal) {
            modal.remove();
        }

        modal = document.createElement('div');
        modal.id = 'email-extractor-modal';

        const emailArray = Array.from(foundEmails);
        const emailsHtml = emailArray.length > 0 ? emailArray.join('<br>') : 'No emails found yet.';

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2><a href="https://www.ominipcba.com" target="_blank" rel="noopener noreferrer">ominipcba.com</a> - Found Emails (${emailArray.length})</h2>
                <div class="email-list">${emailsHtml}</div>
                <button id="copy-emails-button">Copy All</button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-button').addEventListener('click', () => modal.remove());
        modal.querySelector('#copy-emails-button').addEventListener('click', () => {
            GM_setClipboard(emailArray.join(', '));
            alert('Emails copied to clipboard!');
        });

        GM_addStyle(`
            #email-extractor-modal {
                position: fixed;
                z-index: 10000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-content {
                background-color: #fefefe;
                padding: 20px;
                border: 1px solid #888;
                width: 80%;
                max-width: 500px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                font-family: sans-serif;
            }
            .close-button {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
            }
            .email-list {
                margin-top: 15px;
                margin-bottom: 15px;
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid #ddd;
                padding: 10px;
                border-radius: 4px;
                word-break: break-all;
            }
            #copy-emails-button {
                background-color: #28a745;
                color: white;
                padding: 10px 15px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            #copy-emails-button:hover {
                background-color: #218838;
            }
        `);
    }

    // Initial scan
    scanPageForEmails();

    // Observe DOM changes for dynamically loaded content
    const observer = new MutationObserver(scanPageForEmails);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();