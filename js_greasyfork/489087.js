// ==UserScript==
// @name         Safe Chat
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  Шифрование сообщений и комментариев
// @author       v666ad
// @match        *://shikimori.one/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shikimori.one
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/489087/Safe%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/489087/Safe%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isCryptMenuShow = false;
    const keyLength = 32;

    function stripHtmlTags(html) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    }

    function decryptEntities(entities, key) {
        entities.forEach(entity => {
            const entityBody = entity.querySelector('.body');
            if (entityBody.innerHTML.endsWith('=') && entityBody.innerHTML.startsWith('U2F')) {
                try {
                    const decrypted = CryptoJS.AES.decrypt(entityBody.innerHTML, key);
                    entityBody.innerHTML = stripHtmlTags(decrypted.toString(CryptoJS.enc.Utf8));
                    entity.classList.add('_decrypt-successful');
                    entity.querySelector('span.time').innerHTML += ' ✅';
                } catch (err) {
                    console.error(entity, err);
                    entity.classList.add('_decrypt-failed');
                    entity.querySelector('span.time').innerHTML += ' ❌';
                }
            } else {
                entity.classList.add('_not-encrypted');
            }
        });
    }

    function decrypt() {
        const secretKey = localStorage.getItem('secret-key')?.padStart(keyLength, '0').slice(0, keyLength) || '';

        const comments = document.querySelectorAll('.b-comment:not(._decrypt-failed, ._decrypt-successful, ._not-encrypted)');
        decryptEntities(comments, secretKey);

        const messages = document.querySelectorAll('.b-message:not(._decrypt-failed, ._decrypt-successful, ._not-encrypted)');
        decryptEntities(messages, secretKey);
    }

    function encryptText() {
        const secretKey = document.querySelector('.secret-key-input-container input').value.padStart(keyLength, '0').slice(0, keyLength);
        const textarea = document.querySelector('.editor textarea');
        const inputText = textarea.value;

        const encrypted = CryptoJS.AES.encrypt(inputText, secretKey).toString();
        textarea.value = `${encrypted}=`;
    }

    function toggleMenu() {
        document.querySelectorAll('.crypt-menu').forEach(menu => {
            menu.style.display = isCryptMenuShow ? 'none' : 'block';
        });
        isCryptMenuShow = !isCryptMenuShow;
    }

    function addButtons() {
        document.querySelectorAll('.b-shiki_editor').forEach(editor => {
            const buttons = editor.querySelector('footer');
            if (buttons.querySelector('.show-crypt-menu-button')) return;

            const showCryptMenuButton = document.createElement('div');
            showCryptMenuButton.classList.add('b-button', 'show-crypt-menu-button');
            showCryptMenuButton.title = 'Меню шифрования';
            showCryptMenuButton.innerText = 'SC';
            showCryptMenuButton.onclick = toggleMenu;
            buttons.querySelector('.hide').insertAdjacentElement('afterend', showCryptMenuButton)
//            buttons.appendChild(showCryptMenuButton);

            const cryptMenu = document.createElement('div');
            cryptMenu.className = 'crypt-menu';
            cryptMenu.style.display = 'none';

            const secretKeyInputContainer = document.createElement('div');
            secretKeyInputContainer.className = 'secret-key-input-container';

            const secretKey = localStorage.getItem('secret-key') || '';
            const secretKeyInput = document.createElement('input');
            secretKeyInput.type = 'text';
            secretKeyInput.placeholder = 'Секретный ключ';
            secretKeyInput.value = secretKey;
            secretKeyInput.oninput = (e) => localStorage.setItem('secret-key', e.target.value);
            secretKeyInputContainer.appendChild(secretKeyInput);

            cryptMenu.appendChild(secretKeyInputContainer);

            const doButtons = document.createElement('div');
            doButtons.className = 'do-buttons-container';

            const cryptButton = document.createElement('span');
            cryptButton.className = 'crypt-button b-button';
            cryptButton.textContent = 'Зашифровать';
            cryptButton.onclick = encryptText;
            doButtons.appendChild(cryptButton);

            cryptMenu.appendChild(doButtons);
            editor.appendChild(cryptMenu);
        });
    }

    function init() {
        const style = document.createElement('style');
        style.textContent = `
            .editor-controls .show-crypt-menu-button:before { content: '🔐'; }
            .editor-controls .show-crypt-menu-button { margin-left: 15px; cursor: pointer; }
            .crypt-menu {
                position: absolute;
                background: #fff;
                width: 100%;
                height: 70px;
                padding: 5px;
                border-radius: 3px;
                box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, .1);
            }
            .crypt-menu input {
                width: 100%;
                border-radius: 3px;
            }
            .crypt-menu .do-buttons-container {
                margin-top: 10px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);

        setInterval(addButtons, 1000);
        setInterval(decrypt, 1000);
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})();
