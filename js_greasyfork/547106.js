// ==UserScript==
// @name         CB — Followers & Fanclub Badges
// @namespace    aravvn.tools
// @version      1.1.2
// @description  Fetches Follower count and Fanclub cost and displays it inside the corresponding Buttons and hides the Follower count from the bio
// @author       aravvn
// @license      CC-BY-NC-SA-4.0
// @match        https://*.chaturbate.com/*
// @match        https://www.chaturbate.com/*
// @exclude      https://*.chaturbate.com/
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      chaturbate.com
// @downloadURL https://update.greasyfork.org/scripts/547106/CB%20%E2%80%94%20Followers%20%20Fanclub%20Badges.user.js
// @updateURL https://update.greasyfork.org/scripts/547106/CB%20%E2%80%94%20Followers%20%20Fanclub%20Badges.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const POLL_MS = 20000;
  const $ = (s, c=document) => c.querySelector(s);
  const formatInt = n => Number(n).toLocaleString();

  GM_addStyle(`
    #roomTabs .tm-badge {
      display: inline-flex;
      align-items: center;
      font-size: 11px;
      line-height: 1;
      padding: 0 6px;
      margin-left: 6px;
      border-radius: 10px;
      background: rgba(0,0,0,0.1);
      user-select: none;
      white-space: nowrap;
    }
  `);

  function upsertBadge(container, className, text) {
    if (!container) return;
    let badge = container.querySelector(`.${className}`);
    if (!badge) {
      badge = document.createElement('span');
      badge.className = `tm-badge ${className}`;
      container.appendChild(badge);
    }
    badge.textContent = text;
  }

  function hideBioFollowersRow() {
    const val = $('[data-testid="bio-tab-followers-value"]');
    const row = val && val.closest('tr');
    if (row) row.style.display = 'none';
  }

  function findUsername() {
    const parts = location.pathname.replace(/^\/+|\/+$/g, '').split('/');
    if (parts[0] && !['b','p','tags','api','auth','proxy'].includes(parts[0])) return parts[0];
    const hdr = document.querySelector('[data-testid="bio-header"]');
    if (hdr) {
      const m = /^(.+?)'s\s+Bio/i.exec(hdr.textContent.trim());
      if (m) return m[1];
    }
    return null;
  }

  const apiUrl = u => `https://chaturbate.com/api/biocontext/${encodeURIComponent(u)}`;

  function gmFetchJSON(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { 'Accept': 'application/json' },
        onload: r => {
          try {
            if (r.status >= 200 && r.status < 300) resolve(JSON.parse(r.responseText));
            else reject(r.status);
          } catch (e) { reject(e); }
        },
        onerror: reject,
        ontimeout: reject,
      });
    });
  }

  async function tick() {
    const user = findUsername();
    if (!user) return;
    try {
      const data = await gmFetchJSON(apiUrl(user));

      if (typeof data.follower_count === 'number') {
        const followBtn   = $('#roomTabs .followButton');
        const unfollowBtn = $('#roomTabs .unfollowButton');
        if (followBtn)   upsertBadge(followBtn,   'tm-follow-badge',  formatInt(data.follower_count));
        if (unfollowBtn) upsertBadge(unfollowBtn, 'tm-follow-badge',  formatInt(data.follower_count));
      }

      if (data.performer_has_fanclub) {
        const fanBtn = $('#roomTabs .fanclubButton');
        if (fanBtn) {
          if (data.fan_club_is_member) {
            upsertBadge(fanBtn, 'tm-fanclub-badge', '✓');
          } else if (data.fan_club_cost > 0) {
            upsertBadge(fanBtn, 'tm-fanclub-badge', `${formatInt(data.fan_club_cost)}💰`);
          }
        }
      }

      hideBioFollowersRow();
      document.querySelectorAll('[data-testid="lock-icon"]').forEach(el => el.remove());
      document.querySelectorAll('a[data-testid="photo-video-item"] > div:not([data-testid])').forEach(el => el.remove());

    } catch { /* ignore */ }
  }

  setInterval(() => {
    if (document.visibilityState === 'visible') tick();
  }, POLL_MS);

  tick();
})();