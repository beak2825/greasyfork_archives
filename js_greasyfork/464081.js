// ==UserScript==
// @name            URL Hotkey (RU)
// @name:en         URL Hotkey (RU)
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
// @downloadURL https://update.greasyfork.org/scripts/464081/URL%20Hotkey%20%28RU%29.user.js
// @updateURL https://update.greasyfork.org/scripts/464081/URL%20Hotkey%20%28RU%29.meta.js
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
       const key = prompt('Введите букву для горячей клавиши:');
       if (!key || key.length !== 1) {
       return;
  }
       const url = prompt('Введите URL сайта:');
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
       hotkeysList = '<li>Список пуст</li>';
  }
// Close all previously opened dialogs
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
        <h1>Удаление горячих клавиш</h1>
        <p>Выберите горячую клавишу, которую нужно удалить.:</p>
        <ul>${hotkeysList}</ul>
        <hr>
        <button id="cancel-button">Закрыть</button>
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
       alert(`Горячие клавиши:\n\n${hotkeysStr}`);
  }

function addCurrentSite() {
       const url = window.location.href;
       const domain = url.replace(/^(https?:\/\/)?(www\.)?/i, '');
       const key = prompt('Выберите горячие клавиши:');
       if (!key || key.length !== 1) {
       return;
  }
       hotkeys[key.toLowerCase()] = domain;
       hotkeys = sortHotkeys(hotkeys);
       GM_setValue('hotkeys', hotkeys);
  }

GM_registerMenuCommand('Добавить текущий сайт', addCurrentSite);
GM_registerMenuCommand('Добавить', addHotkey);
GM_registerMenuCommand('Удалить', deleteHotkey);
GM_registerMenuCommand('Список', showHotkeys);
