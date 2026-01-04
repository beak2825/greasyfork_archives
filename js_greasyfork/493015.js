// ==UserScript==
// @name         Twitch Loot Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically claim Twitch Drops, activate or deactivate button left on send message to chat.
// @author       Entyen
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1290894
// @downloadURL https://update.greasyfork.org/scripts/493015/Twitch%20Loot%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/493015/Twitch%20Loot%20Script.meta.js
// ==/UserScript==


window.addEventListener('load', function() {

    if (localStorage.btClick === undefined) {
        localStorage.btClick = false;
    }


    function twClick() {
        const twitchBtn = Array.from(document.querySelectorAll('button')).filter(element => element.className.match(/ScCoreButtonSuccess*\S+/))
        if (!JSON.parse(localStorage.btClick)) return
        if (twitchBtn.length == 0) return
        twitchBtn.forEach(element => element.click())
    }

    setInterval(twClick, 5000)


    const SettingButton = document.querySelector('button[data-a-target="chat-settings"]')

    const autoLootDiv = document.createElement('div');
    autoLootDiv.style.setProperty('display', 'inline-flex', 'important');

    const autoLootDivIns = document.createElement('div');
    autoLootDivIns.style.setProperty('position', 'relative', 'important');
    autoLootDivIns.style.top = '4px'

    const autoLootButton = document.createElement('button');
    autoLootButton.style.display = 'inline-flex';
    autoLootButton.style.alignItems = 'center';
    autoLootButton.style.justifyContent = 'center';
    autoLootButton.style.userSelect = 'none';
    autoLootButton.style.borderRadius = 'var(--border-radius-medium)';
    autoLootButton.style.height = 'var(--button-size-default)';
    autoLootButton.style.width = 'var(--button-size-default)';
    autoLootButton.style.color = 'var(--color-fill-button-icon)';
    autoLootButton.onclick = function() {
        const isActive = JSON.parse(localStorage.btClick);
        autoLootButton.style.backgroundColor = isActive ? '#ffffff' : '#ffd700';
        localStorage.btClick = JSON.stringify(!isActive);
    };

    autoLootButton.style.backgroundColor = JSON.parse(localStorage.btClick) ? '#ffd700' : '#ffffff';

    autoLootButton.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" focusable="false" aria-hidden="true" role="presentation"><path fill-rule="evenodd" d="M4 3h12l2 4v10H2V7l2-4zm.236 4H8v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V7h3.764l-1-2H5.236l-1 2zM16 9h-2.17A3.001 3.001 0 0 1 11 11H9a3.001 3.001 0 0 1-2.83-2H4v6h12V9z" clip-rule="evenodd"></path></svg>`;

    const parentElement = SettingButton.parentElement.parentElement.parentElement;
    parentElement.appendChild(autoLootDiv);
    autoLootDiv.appendChild(autoLootDivIns);
    autoLootDivIns.appendChild(autoLootButton);
});