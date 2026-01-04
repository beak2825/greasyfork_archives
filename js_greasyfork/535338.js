// ==UserScript==
// @name         Ephemeral Encryptor
// @namespace    https://greasyfork.org/en/users/1465519-user89109
// @version      1.0
// @description  Encrypts/decrypts text using session-based password & markers. Provides input area for encryption.
// @author       UwU7.com
// @license      All Rights Reserved
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535338/Ephemeral%20Encryptor.user.js
// @updateURL https://update.greasyfork.org/scripts/535338/Ephemeral%20Encryptor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Constants and Defaults ---
    const DEFAULT_PASSWORD = "OMkxyLK8tjuvdxbQwG7A";
    const DEFAULT_START_MARKER = "[UwU7]";
    const DEFAULT_END_MARKER = "[/UwU7]";
    const SCRIPT_NAME = "Ephemeral Encryptor";

    // --- Session State Variables ---
    let currentPassword = DEFAULT_PASSWORD;
    let currentStartMarker = DEFAULT_START_MARKER;
    let currentEndMarker = DEFAULT_END_MARKER;

    // --- Crypto Helper Functions ---
    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    function base64ToArrayBuffer(base64) {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    async function getKey(password, salt) {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );
        return await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    }

    async function encryptText(plainText, password) {
        try {
            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const key = await getKey(password, salt);
            const enc = new TextEncoder();
            const encodedText = enc.encode(plainText);
            const ciphertext = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                key,
                encodedText
            );
            return JSON.stringify({
                s: arrayBufferToBase64(salt),
                i: arrayBufferToBase64(iv),
                c: arrayBufferToBase64(ciphertext)
            });
        } catch (error) {
            console.error(`${SCRIPT_NAME} Encryption Error:`, error);
            throw error;
        }
    }

    async function decryptText(encryptedJsonString, password) {
        try {
            const encryptedData = JSON.parse(encryptedJsonString);
            if (!encryptedData.s || !encryptedData.i || !encryptedData.c) {
                throw new Error("Invalid encrypted data format.");
            }
            const salt = base64ToArrayBuffer(encryptedData.s);
            const iv = base64ToArrayBuffer(encryptedData.i);
            const ciphertext = base64ToArrayBuffer(encryptedData.c);
            const key = await getKey(password, salt);
            const decryptedBuffer = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                ciphertext
            );
            const dec = new TextDecoder();
            return dec.decode(decryptedBuffer);
        } catch (error) {
            throw error;
        }
    }

    // --- UI Functions ---

    /**
     * Creates and displays a modal for text input and encryption.
     */
    function showEncryptionInputModal() {
        const modalId = 'ephemeral-encryptor-input-modal';
        const existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.id = modalId;
        modalOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.5); display: flex;
            align-items: center; justify-content: center; z-index: 2147483646;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: #fff; padding: 25px; border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2); width: 90%; max-width: 600px;
            display: flex; flex-direction: column; gap: 15px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Encrypt Text';
        title.style.cssText = "margin: 0 0 5px 0; text-align: center; font-size: 1.4em; color: #333;";

        const textarea = document.createElement('textarea');
        textarea.rows = 10;
        textarea.placeholder = "Enter text to encrypt here...";
        textarea.style.cssText = `
            width: calc(100% - 20px); padding: 10px; border-radius: 5px;
            border: 1px solid #ccc; font-size: 1em; resize: vertical;
            min-height: 100px;
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = "display: flex; justify-content: space-between; gap: 10px;";

        const encryptButton = document.createElement('button');
        encryptButton.textContent = 'Encrypt & Copy to Clipboard';
        encryptButton.style.cssText = `
            padding: 10px 15px; background-color: #007bff; color: white;
            border: none; border-radius: 5px; cursor: pointer; font-size: 1em; flex-grow: 1;
            transition: background-color 0.2s;
        `;
        encryptButton.onmouseover = () => encryptButton.style.backgroundColor = '#0056b3';
        encryptButton.onmouseout = () => encryptButton.style.backgroundColor = '#007bff';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            padding: 10px 15px; background-color: #6c757d; color: white;
            border: none; border-radius: 5px; cursor: pointer; font-size: 1em;
            transition: background-color 0.2s;
        `;
        closeButton.onmouseover = () => closeButton.style.backgroundColor = '#545b62';
        closeButton.onmouseout = () => closeButton.style.backgroundColor = '#6c757d';

        encryptButton.addEventListener('click', async () => {
            const plainText = textarea.value;
            if (plainText.trim() === "") {
                alert("Textarea is empty. Nothing to encrypt.");
                return;
            }
            try {
                const encryptedPayload = await encryptText(plainText, currentPassword);
                const fullEncryptedBlock = currentStartMarker + encryptedPayload + currentEndMarker;
                GM_setClipboard(fullEncryptedBlock);
                encryptButton.textContent = 'Copied!';
                textarea.value = ''; // Clear textarea after copying
                setTimeout(() => {
                    encryptButton.textContent = 'Encrypt & Copy to Clipboard';
                }, 2000);
            } catch (error) {
                alert("Encryption failed. See console for details.");
                console.error(`${SCRIPT_NAME} Modal Encryption Error:`, error);
            }
        });

        closeButton.addEventListener('click', () => {
            modalOverlay.remove();
        });

        const escapeKeyListener = (event) => {
            if (event.key === "Escape") {
                modalOverlay.remove();
                document.removeEventListener('keydown', escapeKeyListener);
            }
        };
        document.addEventListener('keydown', escapeKeyListener);
        
        modalContent.addEventListener('click', (event) => event.stopPropagation());
        modalOverlay.addEventListener('click', () => {
            modalOverlay.remove();
            document.removeEventListener('keydown', escapeKeyListener);
        });

        buttonContainer.appendChild(encryptButton);
        buttonContainer.appendChild(closeButton);

        modalContent.appendChild(title);
        modalContent.appendChild(textarea);
        modalContent.appendChild(buttonContainer);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        textarea.focus();
    }

    // --- Core Logic for Finding and Processing Encrypted Blocks ---
    async function processDecryptionInTextNode(node) {
        let nodeChanged = false;
        let content = node.nodeValue;
        let searchStartIndex = 0;

        while (searchStartIndex < content.length) {
            const startIndexFull = content.indexOf(currentStartMarker, searchStartIndex);
            if (startIndexFull === -1) break;

            const endIndexFull = content.indexOf(currentEndMarker, startIndexFull + currentStartMarker.length);
            if (endIndexFull === -1) break;

            const payloadStartIndex = startIndexFull + currentStartMarker.length;
            const potentialPayload = content.substring(payloadStartIndex, endIndexFull);

            if (potentialPayload.trim() === "") {
                searchStartIndex = endIndexFull + currentEndMarker.length;
                continue;
            }

            try {
                const decryptedText = await decryptText(potentialPayload, currentPassword);
                const before = content.substring(0, startIndexFull);
                const after = content.substring(endIndexFull + currentEndMarker.length);
                content = before + decryptedText + after;
                nodeChanged = true;
                searchStartIndex = (before + decryptedText).length;
            } catch (error) {
                searchStartIndex = endIndexFull + currentEndMarker.length;
            }
        }

        if (nodeChanged) {
            node.nodeValue = content;
        }
        return nodeChanged;
    }

    async function scanAndDecrypt(rootElement = document.body) {
        const textNodesToProcess = [];
        const treeWalker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                if (node.parentElement && (node.parentElement.closest('script, style, textarea, input, [contenteditable="true"], #ephemeral-encryptor-input-modal'))) {
                    return NodeFilter.FILTER_REJECT;
                }
                if (!node.nodeValue || node.nodeValue.trim() === '') {
                    return NodeFilter.FILTER_REJECT;
                }
                if (node.nodeValue.includes(currentStartMarker) && node.nodeValue.includes(currentEndMarker)) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        });

        let currentNode;
        while (currentNode = treeWalker.nextNode()) {
            textNodesToProcess.push(currentNode);
        }

        for (const textNode of textNodesToProcess) {
           await processDecryptionInTextNode(textNode);
        }
    }

    // encryptAndReplaceSelection function is removed as per user request.

    // --- MutationObserver for Dynamic Content ---
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(newNode => {
                    if (newNode.nodeType === Node.ELEMENT_NODE) {
                        if (newNode.id !== 'ephemeral-encryptor-input-modal' && !newNode.closest('#ephemeral-encryptor-input-modal')) {
                            scanAndDecrypt(newNode);
                        }
                    }
                });
            } else if (mutation.type === 'characterData') {
                 if (mutation.target && mutation.target.nodeType === Node.TEXT_NODE) {
                    const parent = mutation.target.parentElement;
                    if (parent && parent.id !== 'ephemeral-encryptor-input-modal' && !parent.closest('#ephemeral-encryptor-input-modal')) {
                        if (mutation.target.nodeValue.includes(currentStartMarker) && mutation.target.nodeValue.includes(currentEndMarker)) {
                            processDecryptionInTextNode(mutation.target);
                        }
                    }
                 }
            }
        }
    });

    // --- Violentmonkey Menu Commands ---
    GM_registerMenuCommand('Set Session Password', () => {
        const newPassword = prompt(`${SCRIPT_NAME}: Enter session password:`, "");
        if (newPassword !== null) {
            currentPassword = newPassword || DEFAULT_PASSWORD;
            alert(`${SCRIPT_NAME}: Session password ${currentPassword === DEFAULT_PASSWORD ? 'reverted to default' : 'updated'}.`);
            scanAndDecrypt();
        }
    });

    GM_registerMenuCommand('Set Session Markers', () => {
        const newStartMarker = prompt(`${SCRIPT_NAME}: Enter START marker:`, currentStartMarker);
        if (newStartMarker === null) return;

        const newEndMarker = prompt(`${SCRIPT_NAME}: Enter END marker:`, currentEndMarker);
        if (newEndMarker === null) return;

        currentStartMarker = newStartMarker.trim() || DEFAULT_START_MARKER;
        currentEndMarker = newEndMarker.trim() || DEFAULT_END_MARKER;
        alert(`${SCRIPT_NAME}: Session markers updated.`);
        scanAndDecrypt();
    });

    GM_registerMenuCommand('View Current Settings', () => {
        alert(
            `${SCRIPT_NAME} - Session Settings:\n\n` +
            `Password Type: ${currentPassword === DEFAULT_PASSWORD ? 'Default' : 'Custom'}\n` +
            `Start Marker: ${currentStartMarker}\n` +
            `End Marker: ${currentEndMarker}\n\n` +
            `(Settings are for the current session only.)`
        );
    });

    // GM_registerMenuCommand('Encrypt Selection (on-page)', encryptAndReplaceSelection); // Removed
    GM_registerMenuCommand('Encrypt Text (Input & Copy)', showEncryptionInputModal);

    GM_registerMenuCommand('Manually Re-scan Page', () => {
        scanAndDecrypt();
        alert(`${SCRIPT_NAME}: Page re-scan complete.`);
    });


    // --- Initialization ---
    function initialize() {
        scanAndDecrypt();
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        console.log(`${SCRIPT_NAME} initialized. Using ${currentPassword === DEFAULT_PASSWORD ? 'default' : 'custom session'} password.`);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initialize();
    } else {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    }

})();
