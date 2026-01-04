// ==UserScript==
// @name         LinkedIn Bulk Connection Remover
// @namespace    https://matthias-isler.com/
// @version      1.1
// @license      MIT
// @description  Remove LinkedIn connections in bulk by full name input
// @author       Matthias Isler
// @match        https://www.linkedin.com/mynetwork/invite-connect/connections/
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544391/LinkedIn%20Bulk%20Connection%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/544391/LinkedIn%20Bulk%20Connection%20Remover.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Inject floating button
  const button = document.createElement('button');
  button.textContent = '🗑️ Remove Connections';
  Object.assign(button.style, {
    position: 'fixed',
    top: '100px',
    right: '20px',
    padding: '10px 16px',
    backgroundColor: '#cb112d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    zIndex: 9999,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  });
  document.body.appendChild(button);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function normalizeName(name) {
    return name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\p{P}\p{S}\u200B-\u200F\u202A-\u202E\u2060-\u206F\u00A0]/gu, '')
      .replace(/\s+/g, '')
      .trim();
  }

  async function typeLikeHuman(inputEl, text) {
    inputEl.focus();
    inputEl.value = '';
    inputEl.dispatchEvent(new InputEvent('input', { bubbles: true }));
    for (const char of text) {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(inputEl, inputEl.value + char);
      inputEl.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
      inputEl.dispatchEvent(new InputEvent('input', { bubbles: true }));
      inputEl.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
      await sleep(100);
    }
  }

  async function removeConnection(fullNameRaw) {
    console.log(`🔍 Searching for: ${fullNameRaw}`);

    const input = document.querySelector('input[placeholder="Search by name"]');
    if (!input) return console.error('❌ Search input not found');

    await typeLikeHuman(input, fullNameRaw);
    await sleep(2500);

    const cards = [
      ...document.querySelectorAll('div[data-view-name="connections-list"] a[data-view-name="connections-profile"]')
    ].map(a => a.closest('div')).filter(Boolean);

    const card = cards.find(el => {
      const nameText = el.querySelector('a[data-view-name="connections-profile"] p > a')?.innerText?.trim() || '';
      return normalizeName(nameText) === normalizeName(fullNameRaw);
    });

    if (!card) {
      console.warn(`❌ No match found for "${fullNameRaw}"`);
      return;
    }

    const menuBtn = card.querySelector('button[aria-label="Show more actions"]');
    if (!menuBtn) {
      console.warn(`⚠️ Menu button not found for "${fullNameRaw}"`);
      return;
    }

    menuBtn.click();
    await sleep(1000);

    const removeBtn = [...document.querySelectorAll('div[role="button"]')]
      .find(el => el.textContent.trim().toLowerCase().includes('remove connection'));

    if (!removeBtn) {
      console.warn(`⚠️ Remove option not found for "${fullNameRaw}"`);
      return;
    }

    removeBtn.click();
    await sleep(1000);

    const confirmBtn = document.querySelector('button[data-view-name="connections-remove"]');
    if (confirmBtn) {
      confirmBtn.click();
      console.log(`✅ Removed: ${fullNameRaw}`);
    } else {
      console.warn(`⚠️ Confirm button missing for "${fullNameRaw}"`);
    }

    await sleep(2000);
  }

  button.onclick = async () => {
    const raw = prompt("Paste full list (tab-separated, one per line):\nFirstname[TAB]Lastname");
    if (!raw) return;

    const names = raw
      .split('\n')
      .map(line => line.trim().replace(/\s+/g, ' '))
      .filter(Boolean)
      .map(line => line.split('\t').join(' ').trim());

    for (const name of names) {
      await removeConnection(name);
    }
  };
})();
