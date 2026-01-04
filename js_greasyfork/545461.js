// ==UserScript==
// @name         PhoneTool Copytool
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Simplify copying user information from phone tools
// @author       handsen@amazon.com
// @match        https://phonetool.amazon.com/users/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545461/PhoneTool%20Copytool.user.js
// @updateURL https://update.greasyfork.org/scripts/545461/PhoneTool%20Copytool.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            z-index: 10002;
            font-family: Arial, sans-serif;
            font-size: 16px;
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 2000);
    }
        function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            // Use modern clipboard API
            navigator.clipboard.writeText(text).then(() => {
                console.log('Text copied to clipboard:', text);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                console.log('Text copied to clipboard:', text);
                showNotification('Copied: ' + text);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                showNotification('Failed to copy text');
            }
            document.body.removeChild(textArea);
        }
    }
    function getDetails(){
    const name = document.querySelector('.name').innerText.trim();
    const nameParts = name.split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    const email = document.querySelector('.PersonalInfoEmail').innerText;
    const IDrow = document.querySelector('.EmployeeIDRow')
    const ID = IDrow.querySelector('.TableValue').innerText;
    const DateRow = document.querySelector('.HireDateRow');
    const DateFormat = DateRow.querySelector('.TableValue').innerText;

     const date = new Date(DateFormat);
        const FDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;


        return(`${firstName}\t${lastName}\t${ID}\t${email}\t\t\t${FDate}\tUS\tRME\tReliability Maintenance`);
    }


        document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' || event.keyCode === 32) {
            // Don't trigger if user is typing in an input field
            const activeElement = document.activeElement;
            const isInputField = activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.contentEditable === 'true'
            );

            if (!isInputField) {
                event.preventDefault(); // Prevent default spacebar behavior
                copyToClipboard(getDetails());
                showNotification("Copied to Clipboard!");
            }
        }
    });

    showNotification('⬇ Press Space to Copy Relevent Information')
})();