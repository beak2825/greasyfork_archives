// ==UserScript==
// @name            URL Hotkey
// @name:en         URL Hotkey
// @version         2.4.1
// @description     Добавляет горячие клавиши для открытия определённых сайтов
// @description:en  Adds hotkeys to open certain sites
// @license         MIT
// @match           http://*/*
// @match           https://*/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_registerMenuCommand
// @namespace       https://greasyfork.org/users/1059660
// @downloadURL https://update.greasyfork.org/scripts/463931/URL%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/463931/URL%20Hotkey.meta.js
// ==/UserScript==

        let hotkeys = GM_getValue('hotkeys', {});

function sortHotkeys(obj) {
        const sortedKeys = Object.keys(obj).sort((a, b) => {
        const siteA = obj[a].replace(/^(https?:\/\/)?(www\.)?/i, '');
        const siteB = obj[b].replace(/^(https?:\/\/)?(www\.)?/i, '');
        return siteA.localeCompare(siteB);
  });
        const sortedObj = {};
        sortedKeys.forEach((key) => {
        sortedObj[key] = obj[key];
  });
        return sortedObj;
  }

        hotkeys = sortHotkeys(hotkeys);

        document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.altKey && hotkeys[event.key.toLowerCase()]) {
        event.preventDefault();
        window.open(`http://${hotkeys[event.key.toLowerCase()]}`);
  }
  });

function updateHotkeys() {
        const hotkeysMenu = GM_registerMenuCommand('Hotkeys', null, null, null);
        const deleteHotkey = (key) => {
        delete hotkeys[key];
        GM_setValue('hotkeys', hotkeys);
        hotkeysMenu.click();
    };
    Object.entries(hotkeys).forEach(([key, url]) => {
        GM_registerMenuCommand(`[${key.toUpperCase()}] ${url.replace(/^https?:\/\//i, '')}`, () => {
            window.open(`http://${url}`);
        }, null, null, `Ctrl+Alt+${key.toUpperCase()}`);
        GM_registerMenuCommand(`Remove [${key.toUpperCase()}]`, () => {
            deleteHotkey(key);
        }, null, null, `Ctrl+Alt+Shift+${key.toUpperCase()}`);
    });
    GM_registerMenuCommand('Add Hotkey', () => {
        const key = prompt('Enter hotkey letter:');
        if (!key || key.length !== 1) {
            return;
        }
        const url = prompt('Enter website URL:');
        if (!url) {
            return;
        }
        hotkeys[key.toLowerCase()] = url;
        hotkeys = sortHotkeys(hotkeys);
        GM_setValue('hotkeys', hotkeys);
        hotkeysMenu.click();
  });
  }

function addHotkey() {
       const key = prompt('Enter a letter for the hotkey:');
       if (!key || key.length !== 1) {
       return;
  }
       const url = prompt('Enter the URL of the site:');
       if (!url) {
       return;
  }
       hotkeys[key.toLowerCase()] = url.replace(/^https?:\/\//i, '');
       hotkeys = sortHotkeys(hotkeys);
       GM_setValue('hotkeys', hotkeys);
  }

       let currentDialog = null;

function deleteHotkey() {
       let hotkeysList = '';
       for (let key in hotkeys) {
       const url = hotkeys[key].replace(/^(https?:\/\/)?(www\.)?/i, '');
       const urlWithoutProtocol = url.substring(0, 30) + (url.length > 30 ? '...' : '');
       hotkeysList += `<li><button class="delete-button" data-key="${key}">✕</button> ${key}: ${urlWithoutProtocol}</li>`;
  }

       if (Object.keys(hotkeys).length === 0) {
       hotkeysList = '<li>List is empty</li>';
  }
        document.querySelectorAll('dialog').forEach(dialog => dialog.close());
        const dialog = document.createElement('dialog');
        dialog.innerHTML = `
        <style>
        .delete-button {
        border: none;
        background-color: transparent;
        font-size: 1em;
        color: #777;
        cursor: pointer;
        opacity: 0.5;
        text-align: left;
  }
        .delete-button:hover {
        opacity: 1;
  }
        </style>
        <h1>Delete Hotkeys</h1>
        <p>Select the hotkey that needs to be removed.:</p>
        <ul>${hotkeysList}</ul>
        <hr>
        <button id="cancel-button">Close</button>
  `;
        document.body.appendChild(dialog);
        dialog.showModal();

        dialog.querySelector('#cancel-button').addEventListener('click', () => {
        dialog.close();
  });

       dialog.querySelectorAll('.delete-button').forEach((button) => {
       button.addEventListener('click', () => {
       const keyToDelete = button.dataset.key;
       delete hotkeys[keyToDelete];
       GM_setValue('hotkeys', hotkeys);
       deleteHotkey(keyToDelete);
  });
  });

       dialog.addEventListener('beforeclose', (event) => {
       event.preventDefault();
       updateHotkeys();
  });
  }

function showHotkeys() {
       let hotkeysStr = '';
       hotkeys = sortHotkeys(hotkeys);
       for (const key in hotkeys) {
       const url = hotkeys[key].replace(/^(https?:\/\/)?(www\.)?/i, '');
       const shortUrl = url.substring(0, 30) + (url.length > 30 ? '...' : '');
       hotkeysStr += `[${key.toUpperCase()}] ${shortUrl}\n`;
  }
       alert(`List of hotkeys:\n\n${hotkeysStr}`);
  }

function addCurrentSite() {
       const url = window.location.href;
       const domain = url.replace(/^(https?:\/\/)?(www\.)?/i, '');
       const key = prompt('Enter hotkey letter:');
       if (!key || key.length !== 1) {
       return;
  }
       hotkeys[key.toLowerCase()] = domain;
       hotkeys = sortHotkeys(hotkeys);
       GM_setValue('hotkeys', hotkeys);
  }

GM_registerMenuCommand('Add current website', addCurrentSite);
GM_registerMenuCommand('Add Hotkey', addHotkey);
GM_registerMenuCommand('Delete Hotkey', deleteHotkey);
GM_registerMenuCommand('Show list of hotkeys', showHotkeys);
