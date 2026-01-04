// ==UserScript==
// @name        Batch delete for ChatGPT
// @namespace   Violentmonkey Scripts
// @match       *://chatgpt.com/*
// @grant       none
// @license     MIT
// @version     1.0
// @author      m3
// @description Adds checkboxes to ChatGPT conversations, and a button to batch delete them. Requires manual input of Auth token - take it from any valid request headers.
// @downloadURL https://update.greasyfork.org/scripts/539308/Batch%20delete%20for%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/539308/Batch%20delete%20for%20ChatGPT.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let bearerToken = null;

  function askForToken() {
    bearerToken = prompt('Paste your Bearer token (only used locally for making delete requests)');
  }

  function refreshSidebar() {

    const sidebar = document.querySelector('#history');
    if (sidebar) {
      location.reload();
    }
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function addDeleteButton() {
    const heading = document.querySelector('#history h2');
    if (!heading || document.querySelector('#vm-delete-btn')) return;

    const wrapper = document.createElement('span');
    wrapper.style.display = 'inline-flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '8px';

    const btn = document.createElement('button');
    btn.id = 'vm-delete-btn';
    btn.textContent = 'Delete marked';
    Object.assign(btn.style, {
      backgroundColor: '#e53935',
      color: 'white',
      border: 'none',
      margin: '0 10px',
      padding: '4px 8px',
      borderRadius: '4px',
      cursor: 'pointer'
    });

    const progress = document.createElement('span');
    progress.id = 'vm-progress';
    progress.style.fontSize = '0.9em';
    progress.style.color = '#888';

    wrapper.appendChild(btn);
    wrapper.appendChild(progress);
    heading.appendChild(wrapper);

    btn.addEventListener('click', async () => {
      const checked = document.querySelectorAll('.vm-checkbox:checked');
      const ids = [...checked].map(cb => cb.dataset.chatId);

      if (!ids.length) return;

      const confirmed = confirm(`Really delete ${ids.length} conversation(s)?`);
      if (!confirmed) return;

      if (!bearerToken) askForToken();
      if (!bearerToken) {
        alert('Bearer token is required.');
        return;
      }
      const cleanToken = bearerToken.startsWith('Bearer ') ? bearerToken.slice(7) : bearerToken;

      progress.textContent = `0 / ${ids.length}`;

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        try {
          const res = await fetch(`https://chatgpt.com/backend-api/conversation/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${bearerToken}`
            },
            body: JSON.stringify({ is_visible: false })
          });

          if (res.ok) {
            console.log(`Deleted: ${id}`);
          } else {
            console.warn(`Failed: ${id}`, res.status);
          }
        } catch (err) {
          console.error(`Error: ${id}`, err);
        }

        progress.textContent = `${i + 1} / ${ids.length}`;
        await delay(250);
      }

      progress.textContent = 'Done!';
      await delay(3000);

      refreshSidebar();
    });
  }

  function addCheckboxes() {
    const chatItems = document.querySelectorAll('#history a[href^="/c/"]');

    chatItems.forEach(item => {
      if (item.querySelector('.vm-checkbox')) return;

      const chatId = item.getAttribute('href').split('/c/')[1];

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'vm-checkbox';
      checkbox.style.marginRight = '6px';
      checkbox.dataset.chatId = chatId;
      checkbox.addEventListener('click', e => {
        e.stopPropagation();
      });

      const titleSpan = item.querySelector('span');
      if (titleSpan) {
        titleSpan.parentElement.insertBefore(checkbox, titleSpan);
      }
    });
  }

  const observer = new MutationObserver(() => {
    addDeleteButton();
    addCheckboxes();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  addDeleteButton();
  addCheckboxes();
})();
