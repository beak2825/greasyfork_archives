// ==UserScript==
// @name         WhatsApp Web Paste
// @namespace    https://github.com/vekvoid/UserScripts
// @homepageURL  https://github.com/vekvoid/UserScripts/
// @supportURL   https://github.com/vekvoid/UserScripts/issues
// @description  Temporal workaround for WhatsApp Web paste Ctrl+V behaviour.
// @match        https://web.whatsapp.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=web.whatsapp.com
// @version      1.1.0
// @downloadURL https://update.greasyfork.org/scripts/473458/WhatsApp%20Web%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/473458/WhatsApp%20Web%20Paste.meta.js
// ==/UserScript==

const APP_QUERY = '#app';
const CHAT_TEXTBOX_QUERY = 'footer div[role="textbox"]';
const ICON_PLACEMENT_CONTAINER = '._1VZX7';
const PASTE_BUTTON_ID = 'vk-paste-workaround';
const PASTE_BUTTON_CLASS = 'vk-btn-paste';

const paste = async () => {
  const text = await navigator.clipboard.readText();

  const pasteEvent = new ClipboardEvent('paste', {
    dataType: 'text/plain',
    data: text,
  });

  const textBox = document.querySelector(CHAT_TEXTBOX_QUERY);
  textBox.dispatchEvent(pasteEvent);
};

const css = `
  .vk-btn-paste {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 52px;
    color: rgb(190, 190, 190);
    border-radius: 50%;
    cursor: pointer;
    transition: opacity 0.3s ease !important;
  }

  .vk-btn-paste:hover {
    opacity: 0.7;
  }
`;

const injectCSS = () => {
  const style = document.createElement('style');
  document.head.appendChild(style);
  style.appendChild(document.createTextNode(css));
};

const createPasteButton = () => {
  const pasteBtn = document.createElement('button');
  pasteBtn.id = PASTE_BUTTON_ID;
  pasteBtn.classList.add(PASTE_BUTTON_CLASS);
  pasteBtn.title = 'Paste';

  pasteBtn.addEventListener('click', () => {
    paste();
  });

  pasteBtn.innerHTML = `
    <img width="35" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABIElEQVR4nO2YTU4CQRSEZy8JHoQtxmOJLtiy9BYsBk4gmky6q/o6XEIxL0rSmWCeMPNmVV/yVv1Xla5VNY0QQoipKaU8AliRXI8xAFZ25xTC70l+kDwFzXtKaR5mIFj8yQbAIUS8fXH10CeAFsBrNdsrRG57Z1sAX+f1nPPD6AZIvlQC2gsGZySP/zBw7Lrurn8ewK7a8zy6AQCbysDm0p5SyoLkHkD6Y3a259b7BxH9AGTAQT/gAEXIQRFygCLkoAg5QBFyUIQcoAg5KEIOUIQcFCEHKEIOipADFKGBxdZQUBVbVvaGVotWA/4+OEo7zZ8yLLZaNKw9nqDcfWuisOrb2uNI8SmyXj9jX2w57TXMN0/O+SmltAwXLoQQounxDbR3DLKcTasXAAAAAElFTkSuQmCC">
  `;

  return pasteBtn;
};

(function () {
  injectCSS();

  const targetChangesDiv = document.querySelector(APP_QUERY);

  const observer = new MutationObserver(function (mutationsList, _observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const alreadyExists = document.getElementById(PASTE_BUTTON_ID);
        if (alreadyExists) {
          return;
        }

        const textBoxContainer = document
          .querySelector(CHAT_TEXTBOX_QUERY)
          .closest(ICON_PLACEMENT_CONTAINER);
        if (!textBoxContainer) {
          return;
        }

        const pasteBtn = createPasteButton();
        textBoxContainer.appendChild(pasteBtn);
      }
    }
  });

  observer.observe(targetChangesDiv, { childList: true, subtree: true });
})();
