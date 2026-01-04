// ==UserScript==
// @name         InvadedLands Reactions (Fixed JSON)
// @namespace    http://tampermonkey.net/
// @version      7.6
// @description  Blocks reaction packets, shows GUI, resends with chosen emoji, updates client UI
// @author       PillowPB (fixed by EclipseMaster)
// @match        *https://invadedlands.net/*
// @grant        none
// @license      Creative Commons
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/542763/InvadedLands%20Reactions%20%28Fixed%20JSON%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542763/InvadedLands%20Reactions%20%28Fixed%20JSON%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const reactionMap = {
    "1": "👍", "2": "❤️", "3": "😂",
    "4": "😮", "5": "😢", "6": "😡"
  };

  let isHacking = true;
  let hackedPostId = null;
  let lastClickEvent = null;

  // packets are very cool i do not hate them
  const originalFetch = window.fetch;
  window.fetch = function (input, init = {}) {
    const url = (typeof input === 'string') ? input : input.url;

    if (isHacking && url.includes('/react?reaction_id=')) {
      const postIdMatch = url.match(/\/posts\/(\d+)\/react/);
      hackedPostId = postIdMatch ? postIdMatch[1] : null;

      console.log('[invadedlands] Blocked reaction fetch packet for post', hackedPostId);
      const x = lastClickEvent?.clientX || window.innerWidth / 2;
      const y = lastClickEvent?.clientY || window.innerHeight / 2;

      if (hackedPostId) showReactionMenu(hackedPostId, x, y);

      // Prevent original fetch
      return Promise.resolve(new Response(null, { status: 204 }));
    }

    return originalFetch.apply(this, arguments);
  };

  document.addEventListener('click', e => lastClickEvent = e, true);

  function sendCustomReaction(postId, reactionId) {
    isHacking = false;

    const xfToken = document.querySelector('input[name="_xfToken"]')?.value;
    if (!xfToken) return console.warn('Missing _xfToken');

    const jsonBody = {
      _xfToken: xfToken,
      _xfRequestUri: window.location.pathname,
      _xfWithData: 1,
      _xfResponseType: "json"
    };

    fetch(`/posts/${postId}/react?reaction_id=${reactionId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
      },
      body: JSON.stringify(jsonBody)
    })
    .then(res => res.json())
    .then(data => {
      console.log(`[+reaction] Sent ${reactionId} to post ${postId}`, data);
      const postElem = document.querySelector(`[data-content*="post-${postId}"]`);
      if (postElem) {
        const reactionBtn = postElem.querySelector(`a.messageReactionLink[href*="reaction_id=${reactionId}"]`);
        if (reactionBtn) {
          let count = reactionBtn.querySelector('.reactionCount');
          if (count) count.textContent = (parseInt(count.textContent) || 0) + 1;
          else {
            const span = document.createElement('span');
            span.className = 'reactionCount';
            span.textContent = '1';
            reactionBtn.appendChild(span);
          }
          reactionBtn.classList.add('reactionSelected');
          setTimeout(() => reactionBtn.classList.remove('reactionSelected'), 1500);
        }
      }
    })
    .catch(err => console.error('[reaction error]', err))
    .finally(() => setTimeout(() => isHacking = true, 100));
  }

  function showReactionMenu(postId, x, y) {
    document.querySelectorAll('.reaction-menu-container').forEach(el => el.remove());

    const menu = document.createElement('div');
    menu.className = 'reaction-menu-container';
    menu.style.cssText = `
      position: fixed;
      left: ${Math.min(x, window.innerWidth - 220)}px;
      top: ${Math.min(y, window.innerHeight - 120)}px;
      background: #2d2d2d;
      border-radius: 8px;
      padding: 10px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      z-index: 99999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.5);
      border: 1px solid #444;
    `;

    Object.entries(reactionMap).forEach(([id, emoji]) => {
      const btn = document.createElement('div');
      btn.className = 'reaction-emoji-btn';
      btn.textContent = emoji;
      btn.title = `Reaction ID: ${id}`;
      btn.style.cssText = `
        font-size: 24px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        text-align: center;
        transition: 0.2s;
      `;
      btn.onmouseenter = () => { btn.style.background = '#3e3e3e'; btn.style.transform = 'scale(1.2)' };
      btn.onmouseleave = () => { btn.style.background = 'transparent'; btn.style.transform = 'scale(1)' };
      btn.onclick = () => { sendCustomReaction(postId, id); menu.remove(); };
      menu.appendChild(btn);
    });

    document.body.appendChild(menu);
    setTimeout(() => {
      const handler = (e) => {
        if (!menu.contains(e.target)) {
          menu.remove();
          document.removeEventListener('click', handler);
        }
      };
      document.addEventListener('click', handler);
    }, 10);
  }

  console.log('Reaction invadedlands initialized');
})();
