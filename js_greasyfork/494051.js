// ==UserScript==
// @name         Paste Essays (Acellus) 
// @namespace    https://greasyfork.org/en/users/1291009
// @version      2.5.1
// @description  Pastes essays for you
// @author       BadOrBest
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acellus.com
// @match        https://admin192c.acellus.com/student/*
// @grant        none
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/494051/Paste%20Essays%20%28Acellus%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494051/Paste%20Essays%20%28Acellus%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let textToType = " ";
    let lastFocusedElement = null;

    const mainGuiOverlay = document.createElement('div');
    mainGuiOverlay.id = 'mainGuiOverlay';
    mainGuiOverlay.innerHTML = `
        <div class="gui-content">
            <h3 class="gui-header">Paste Anything (Acellus)</h3>
            <textarea id="textInput" placeholder="Paste Here...">${textToType}</textarea>
            <div class="gui-buttons">
                <button id="applyText" class="gui-btn">Paste Text</button>
                <button id="closeOverlay" class="close-btn">Exit</button>
            </div>
        </div>
    `;
    document.body.appendChild(mainGuiOverlay);

    GM_addStyle(`
        #mainGuiOverlay {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: none;
            width: 90%;
            max-width: 500px;
            background: white;
            z-index: 9999;
            height: auto;
            border-radius: 16px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: opacity 0.3s ease;
        }
        .gui-content {
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }
        .gui-header {
            font-size: 20px;
            color: #fff;
            background: #0056b3;
            padding: 10px;
            text-align: center;
            border-radius: 12px;
        }
        #textInput {
            width: 100%;
            height: 120px;
            padding: 10px;
            font-size: 14px;
            color: black;
        }
        .gui-buttons {
            display: flex;
            gap: 10px;
        }
        .gui-btn, .close-btn {
            padding: 8px 12px;
            background: #0056b3;
            color: #fff;
            border-radius: 12px;
            cursor: pointer;
        }
    `);

    function openMainGui() {
        mainGuiOverlay.style.display = 'block';
        mainGuiOverlay.style.opacity = '1';
    }

    function closeMainGui() {
        mainGuiOverlay.style.opacity = '0';
        setTimeout(() => { mainGuiOverlay.style.display = 'none'; }, 300);
    }

    function typeTextAsUser(element, text) {
        let index = 0;
        const inputEvent = new Event('input', { bubbles: true });

        const interval = setInterval(() => {
            if (element.isContentEditable) {
                element.textContent += text.charAt(index);
            } else {
                element.value += text.charAt(index);
            }
            element.dispatchEvent(inputEvent);
            index++;

            if (index >= text.length) {
                clearInterval(interval);
            }
        }, 40);
    }

    document.getElementById('applyText').addEventListener('click', function() {
        textToType = document.getElementById('textInput').value;
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            typeTextAsUser(lastFocusedElement, textToType);
        }
        closeMainGui();
    });

    document.getElementById('closeOverlay').addEventListener('click', closeMainGui);

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (mainGuiOverlay.contains(target)) return;
        if (target.isContentEditable || target.nodeName === 'TEXTAREA' || (target.nodeName === 'INPUT' && target.type === 'text')) {
            lastFocusedElement = target;
            openMainGui();
        }
    }, true);

    const textInput = document.getElementById('textInput');

    textInput.addEventListener('focus', () => {
        if (textInput.value === "Type Here...") {
            textInput.value = "";
            textInput.style.color = 'black';
        }
    });

    textInput.addEventListener('blur', () => {
        if (textInput.value === "") {
            textInput.value = "Type Here...";
            textInput.style.color = 'grey';
        }
    });
})();
