// ==UserScript==
// @name         Encode/Decode Base64 or Hex with Copy Option
// @version      1.8
// @description  Encode or decode Base64 or Hex strings and copy to clipboard
// @author       itisme
// @include      https://*
// @include      http://*
// @exclude      *://youtube.com/*
// @exclude      *://github.com/*
// @icon         https://data.voz.vn/styles/next/xenforo/smilies/popopo/sexy_girl.png?v=01
// @license      GPL-3.0
// @run_at       document_idle
// @grant        GM_addStyle
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/505102/EncodeDecode%20Base64%20or%20Hex%20with%20Copy%20Option.user.js
// @updateURL https://update.greasyfork.org/scripts/505102/EncodeDecode%20Base64%20or%20Hex%20with%20Copy%20Option.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_addStyle(`
        :root {
            --overlay-bg: rgba(0, 0, 0, 0.7);
            --overlay-color: #ffffff;
            --font-color: #333333;
            --close-color: #f44336;
            --close-hover-color: #d32f2f;
            --button-bg: #007bff;
            --button-active-bg: #0056b3;
            --copy-bg: #28a745;
            --copy-active-bg: #195427;
            --copy-hover-bg: #218838;
            --clear-bg: #dc3545;
            --clear-active-bg: #c82333;
            --shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
            --transition: 0.3s ease;
        }

        .my-overlay-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--overlay-bg);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 99999;
            max-height: 100vh;
            overflow: auto;
        }

        .my-overlay {
            background: var(--overlay-color);
            padding: 20px;
            border-radius: 10px;
            width: 100%;
            max-width: 600px;
            position: relative;
            box-shadow: var(--shadow);
            transition: var(--transition);
        }

        .my-overlay-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            position: relative;
        }

        .my-overlay-title-text {
            font-size: 26px;
            font-weight: 600;
            color: var(--font-color);
        }

        .my-overlay-titleCloser {
            font-size: 30px;
            cursor: pointer;
            color: var(--close-color);
            transition: var(--transition);
        }

        .my-overlay-titleCloser:hover {
            color: var(--close-hover-color);
        }

        .my-overlay-content {
            display: flex;
            flex-direction: column;
        }

        .my-overlay-content label {
            margin-bottom: 8px;
            font-weight: 600;
            font-size: 16px;
        }

        .my-overlay-content select,
        .my-overlay-content textarea {
            width: 100%;
            margin-bottom: 20px;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
        }

        .my-overlay-content textarea {
            height: 120px;
            font-size: 16px;
            line-height: 1.5;
            resize: vertical;
        }

        .my-button-container {
            display: flex;
            gap: 20px;
        }

        .my-button-container button {
            padding: 12px 20px;
            font-size: 14px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            flex: 1;
            transition: background-color var(--transition), box-shadow var(--transition);
            box-shadow: var(--shadow);
        }

        #actionButton {
            background-color: var(--button-bg);
            color: #ffffff;
        }

        #actionButton:hover,
        #actionButton:active {
            background-color: var(--button-active-bg);
        }

        #copyButton {
            background-color: var(--copy-bg);
            color: #ffffff;
        }

        #copyButton:hover {
            background-color: var(--copy-hover-bg);
        }

        #copyButton:active {
            background-color: var(--copy-active-bg);
        }

        #copyButton.flash {
            animation: flash 1s;
            background-color: var(--copy-bg);
        }

        @keyframes flash {
            0% {
                background-color: var(--copy-bg);
            }
            100% {
                background-color: var(--copy-active-bg);
            }
        }

        .custom-popup-link {
            position: fixed;
            width: 40px;
            height: 40px;
            background-image: url("https://data.voz.vn/styles/next/xenforo/smilies/popopo/sexy_girl.png?v=01");
            background-size: cover;
            background-position: center;
            border: none;
            cursor: pointer;
            z-index: 2147483647;
            user-select: none;
            background-color: transparent;
            transition: background-color var(--transition);
        }
    `);
    const createToggleButton = () => {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'custom-popup-link';
        document.body.appendChild(toggleButton);
        // Load saved position
        const savedPosition = JSON.parse(localStorage.getItem('toggleButtonPosition')) || {
            top: 673,
            left: 1468
        };
        Object.assign(toggleButton.style, {
            top: `${savedPosition.top}px`,
            left: `${savedPosition.left}px`
        });
        makeDraggable(toggleButton);
    };
    const makeDraggable = (element) => {
        if (!element) return console.error('Phần tử không tồn tại.');
        let offsetX, offsetY, startX, startY, isDragging = false;
        element.style.userSelect = 'none';
        const setPosition = (x, y) => {
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
        };
        const moveElement = (e) => {
            if (!isDragging) {
                if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
                    isDragging = true;
                }
                return;
            }
            const rect = element.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            newLeft = Math.max(0, Math.min(newLeft, windowWidth - rect.width));
            newTop = Math.max(0, Math.min(newTop, windowHeight - rect.height));
            setPosition(newLeft, newTop);
        };
        const stopDragging = (e) => {
            if (isDragging) {
                localStorage.setItem('toggleButtonPosition', JSON.stringify({
                    top: element.style.top,
                    left: element.style.left
                }));
            } else if (e.button === 0 && typeof toggleOverlay === 'function') {
                toggleOverlay();
            }
            document.removeEventListener('mousemove', moveElement);
            document.removeEventListener('mouseup', stopDragging);
            document.removeEventListener('mouseleave', stopDragging);
            isDragging = false;
        };
        const startDragging = (e) => {
            if (e.button !== 0) return;
            const rect = element.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            startX = e.clientX;
            startY = e.clientY;
            document.addEventListener('mousemove', moveElement);
            document.addEventListener('mouseup', stopDragging);
            document.addEventListener('mouseleave', stopDragging);
        };
        element.addEventListener('mousedown', startDragging);
        const savedPosition = JSON.parse(localStorage.getItem('toggleButtonPosition'));
        if (savedPosition) {
            setPosition(
                parseFloat(savedPosition.left) || 0,
                parseFloat(savedPosition.top) || 0
            );
        }
    };
    window.addEventListener('load', () => {
        const toggleButton = document.querySelector('.toggleButtonClass');
        if (toggleButton) {
            makeDraggable(toggleButton);
        }
    });
    const toggleOverlay = () => {
        const overlayContainer = document.querySelector('.my-overlay-container');
        if (overlayContainer) {
            overlayContainer.style.display = (overlayContainer.style.display === 'none') ? 'flex' : 'none';
        } else if (typeof createOverlay === 'function') {
            createOverlay();
            const newOverlayContainer = document.querySelector('.my-overlay-container');
            if (newOverlayContainer) {
                newOverlayContainer.style.display = 'flex';
            } else {
                console.error('Không thể tìm thấy phần tử .my-overlay-container sau khi tạo.');
            }
        } else {
            console.error('Hàm createOverlay không tồn tại.');
        }
    };
    const createOverlay = () => {
        const overlayContainer = document.createElement('div');
        overlayContainer.className = 'my-overlay-container';
        overlayContainer.innerHTML = `
            <div class="my-overlay">
                <div class="my-overlay-title">
                    <span class="my-overlay-title-text">Encode/Decode Input</span>
                    <a class="my-overlay-titleCloser" role="button" aria-label="Close">×</a>
                </div>
                <div class="my-overlay-content">
                    <label>Select Operation:</label>
                    <select id="operationType">
                        <option value="decode">Decode</option>
                        <option value="encode">Encode</option>
                    </select>
                    <label>Select Type:</label>
                    <select id="decodeType">
                        <option value="hex">Hex</option>
                        <option value="base64">Base64</option>
                    </select>
                    <textarea id="inputString" placeholder="Enter text..."></textarea>
                    <textarea id="resultOutput" readonly placeholder="Result..."></textarea>
                    <div class="my-button-container">
                        <button id="actionButton">Decode/Encode</button>
                        <button id="copyButton">Copy</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlayContainer);

        const closeButton = document.querySelector('.my-overlay-titleCloser');
        closeButton.addEventListener('click', () => {
            overlayContainer.style.display = 'none';
            document.getElementById('inputString').value = '';
            document.getElementById('resultOutput').value = '';
            document.getElementById('operationType').value = "decode";
            document.getElementById('decodeType').value = "hex";
        });

        const encodeHex = s => Array.from(s, c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ').toUpperCase();
        const decodeHex = h => {
            try {
                const cleanedHex = h.replace(/\s+/g, '');
                if (!/^[a-fA-F0-9]+$/.test(cleanedHex)) throw new Error('Invalid hex string');
                if (cleanedHex.length % 2 !== 0) throw new Error('Invalid hex string length');
                return cleanedHex.match(/../g).map(b => String.fromCharCode(parseInt(b, 16))).join('');
            } catch (err) {
                throw new Error(err.message);
            }
        };
        const encodeBase64 = b => btoa(b);
        const decodeBase64 = b => {
            try {
                if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(b)) {
                    throw new Error('Invalid base64 string');
                }
                return atob(b);
            } catch (err) {
                throw new Error(err.message);
            }
        };

        document.getElementById('actionButton').addEventListener('click', () => {
            const op = document.getElementById('operationType').value;
            const type = document.getElementById('decodeType').value;
            const input = document.getElementById('inputString').value.trim();
            if (!input) return alert('Please enter a string.');
            try {
                let result;
                switch (type) {
                    case 'base64':
                        result = (op === 'decode') ? decodeBase64(input) : encodeBase64(input);
                        break;
                    case 'hex':
                        result = (op === 'decode') ? decodeHex(input) : encodeHex(input);
                        break;
                    default:
                        result = (op === 'decode') ? decodeURIComponent(input) : encodeURIComponent(input);
                }
                document.getElementById('resultOutput').value = result;
            } catch (err) {
                console.error(`Error [${type}]:`, err, 'Input:', input);
                alert(`Error: ${err.message}`);
            }
        });

        document.getElementById('copyButton').addEventListener('click', async () => {
            const resultOutput = document.getElementById('resultOutput');
            const textToCopy = resultOutput.value.trim();
            if (!textToCopy) {
                alert('Nothing to copy!');
                return;
            }
            try {
                await navigator.clipboard.writeText(textToCopy);
                alert('Copied to clipboard!');
                const copyButton = document.getElementById('copyButton');
                copyButton.classList.add('flash');
                setTimeout(() => copyButton.classList.remove('flash'), 1000);
            } catch (err) {
                console.error('Error copying to clipboard:', err);
                alert('Error copying to clipboard.');
            }
        });
    }
    createToggleButton();
})();