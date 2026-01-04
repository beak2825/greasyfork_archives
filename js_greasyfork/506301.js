// ==UserScript==
// @name         bdsmlr Gooner Labs
// @namespace    http://tampermonkey.net/
// @version      2024-08-31
// @description  idk
// @author       GoonerLaboratories
// @match        https://bdsmlr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/506301/bdsmlr%20Gooner%20Labs.user.js
// @updateURL https://update.greasyfork.org/scripts/506301/bdsmlr%20Gooner%20Labs.meta.js
// ==/UserScript==


const VERSION = 'alpha1';

const STYLES = `
html.modal-open {
  font-size: 100%;
}
html.modal-open body {
  overflow: hidden !important;
}

.gc-modal {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 1001;
  width: 100%;
  height: 100%;
  overflow: auto;
  opacity: 1;
  visibility: visible;
}

.gc-modal.hidden {
  opacity: 0;
  visibility: hidden;
  }
`;

let isModalOpen = false;

(function() {
    'use strict';
    GM_addStyle(STYLES);
    main();
})();

async function main() {
    await loadStyles('https://cdn.jsdelivr.net/gh/GoonerLaboratories/gooner-labs@main/styles.css');
    await loadScript('https://cdn.jsdelivr.net/gh/GoonerLaboratories/gooner-labs@main/polyfills.js');
    await loadScript('https://cdn.jsdelivr.net/gh/GoonerLaboratories/gooner-labs@main/main.js');
    addGoonerLabsNavItem();
}

function loadScript(url) {
    return new Promise(resolve => {

        const script = document.createElement('script');
        script.type = 'module';
        script.src = url;
        script.onload = () => resolve();
        document.body.appendChild(script);
    });
}

function loadStyles(url) {
    return new Promise(resolve => {
        const styles = document.createElement('link');
        styles.href = url;
        styles.rel = 'stylesheet';
        styles.onload = () => resolve();
        document.head.appendChild(styles);
    });
}

function addGoonerLabsNavItem() {
    const navigationLiElements = document.querySelectorAll('section.menu ul li');
    const messagesItem = navigationLiElements[1];
    const li = document.createElement('li');
    const div = document.createElement('div');
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-flask');
    icon.style.fontSize = '1.5em';
    icon.style.marginTop = '7px';
    icon.style.marginLeft = '13px';
    icon.style.color = '#fff';
    icon.style.cursor = 'pointer';
    div.appendChild(icon);
    li.appendChild(div);
    const navigation = messagesItem.parentNode;
    navigation.insertBefore(li, messagesItem);
    icon.addEventListener('click', () => openGoonerLabsModal());
}

function createGoonerLabsModal() {
    const modal = document.createElement('div');
    modal.classList.add('gc-modal');
    const goonerLabs = document.createElement('gooner-labs');
    goonerLabs.closeCallback = () => closeGoonerLabsModal();
    goonerLabs.version = VERSION;
    modal.appendChild(goonerLabs);
    return modal;
}

function closeGoonerLabsModal() {
    document.documentElement.classList.remove('modal-open');
    document.querySelector('.gc-modal').classList.add('hidden');
}

function openGoonerLabsModal() {
    if (!isModalOpen) {

       const modal = createGoonerLabsModal();
       document.documentElement.classList.add('modal-open');
       document.body.appendChild(modal);
       isModalOpen = true;
    } else {
        document.querySelector('.gc-modal').classList.remove('hidden');

       document.documentElement.classList.add('modal-open');
    }
}
