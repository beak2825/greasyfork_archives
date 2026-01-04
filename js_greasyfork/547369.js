// ==UserScript==
// @name         TorrentBD Shoutbox @Mention Autocomplete and mouse click mention
// @namespace    http://tampermonkey.net/
// @version      1.8.3.1
// @description  Client-side @mention autocomplete + click-to-mention for TorrentBD shoutbox.
// @author       JeTexY
// @namespace    JeTexY
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @run-at       document-end
// @icon         https://static.torrentbd.net/bf68ee5a32904d2ca12f3050f9efbf91.png
// @grant        none
// @license      MIT
// @changelog    v1.8.2 - Enter names with spaces now works correctly
// @changelog    v1.8.1 - Fixed text selection issue on message body when clicking to mention
// @changelog    v1.8.1 - Added dynamic dropdown positioning (above/below input based on space)
// @changelog    v1.8.0 - Simplified and optimizated to improve performance
// @changelog    v1.7.0 - Mouse listener optimizations and fixes + only inside shoutbox container
// @changelog    v1.6.0 - Fixed mouse hover on links and buttons + added ignore for torrent/forum posts
// @changelog    v1.5.0 - Fixed mention insertion bug when no space after mention
// @changelog    v1.4.0 - Improved mention insertion logic to replace last mention if caret is not at end
// @changelog    v1.3.1 - Fixed dropdown width + Tab cycling bug
// @changelog    v1.3.0 - Fixed mouse hover not highlighting properly
// @changelog    v1.2.1 - Added partial substring search
// @changelog    v1.2.0 - Added click-to-mention (left click to insert at cursor, Ctrl+click to append at end)
// @changelog    v1.1.0 - Added hover border on usernames and ignore torrent and forum posts.
// @changelog    v1.0.0 - Initial release
// @downloadURL https://update.greasyfork.org/scripts/547369/TorrentBD%20Shoutbox%20%40Mention%20Autocomplete%20and%20mouse%20click%20mention.user.js
// @updateURL https://update.greasyfork.org/scripts/547369/TorrentBD%20Shoutbox%20%40Mention%20Autocomplete%20and%20mouse%20click%20mention.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // -------------------------
  // Utilities
  // -------------------------
  function waitFor(selector, { root = document, timeout = 15000 } = {}) {
    return new Promise((resolve) => {
      const el = root.querySelector(selector);
      if (el) return resolve(el);
      const obs = new MutationObserver(() => {
        const found = root.querySelector(selector);
        if (found) {
          obs.disconnect();
          resolve(found);
        }
      });
      obs.observe(root, { childList: true, subtree: true });
      if (timeout) {
        setTimeout(() => {
          obs.disconnect();
          resolve(null);
        }, timeout);
      }
    });
  }

  function uniqKeepOrder(arr) {
    const s = new Set();
    const out = [];
    for (const x of arr) if (!s.has(x)) { s.add(x); out.push(x); }
    return out;
  }

  function replaceLastMentionOrInsert(inputEl, username) {
    const text = inputEl.value;
    const caret = inputEl.selectionStart;
    const before = text.slice(0, caret);
    const after = text.slice(caret);

    const atMatch = before.match(/@([^\s@]*)$/);
    if (atMatch) {
      const start = before.lastIndexOf('@' + atMatch[1]);
      const newBefore = before.slice(0, start) + '@' + username + ' ';
      inputEl.value = newBefore + after;
      const newCaret = newBefore.length;
      inputEl.setSelectionRange(newCaret, newCaret);
      return;
    }

    const all = Array.from(text.matchAll(/@([^\s@]+)/g));
    if (all.length > 0) {
      const last = all[all.length - 1];
      const s = last.index;
      const e = s + last[0].length;
      const newText = text.slice(0, s) + '@' + username + ' ' + text.slice(e);
      inputEl.value = newText;
      const newCaret = s + ('@' + username + ' ').length;
      inputEl.setSelectionRange(newCaret, newCaret);
      return;
    }

    const newBefore = before + '@' + username + ' ';
    inputEl.value = newBefore + after;
    const newCaret = newBefore.length;
    inputEl.setSelectionRange(newCaret, newCaret);
  }

  function appendMentionToEnd(inputEl, username) {
    let v = inputEl.value;
    if (v.length > 0 && !/\s$/.test(v)) v += ' ';
    v += '@' + username + ' ';
    inputEl.value = v;
    inputEl.setSelectionRange(v.length, v.length);
  }

  function measureTextWidth(text, font) {
    const ctx = measureTextWidth._ctx || (measureTextWidth._ctx = document.createElement('canvas').getContext('2d'));
    ctx.font = font;
    return ctx.measureText(text).width;
  }

  // -------------------------
  // Styles
  // -------------------------
  const injectedCss = `
#tbd-mention-dropdown {
  position: absolute; background: #1e1e1e; color: #e6e6e6; border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.04); box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  font-size: 13px; max-height: 260px; overflow-y: auto; z-index: 2147483000;
  display: none; padding: 6px 0; white-space: nowrap;
}
#tbd-mention-dropdown .tbd-mention-item { padding: 6px 12px; cursor: pointer; user-select: none; border-radius: 6px; }
#tbd-mention-dropdown .tbd-mention-item.tbd-active { background: linear-gradient(90deg, rgba(255,110,196,0.14), rgba(120,115,245,0.12)); color: #fff; }
#tbd-mention-dropdown::-webkit-scrollbar { width: 8px; }
#tbd-mention-dropdown::-webkit-scrollbar-track { background: transparent; }
#tbd-mention-dropdown::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 8px; }
@media (prefers-color-scheme: light) {
  #tbd-mention-dropdown { background: #fff; color: #111; border: 1px solid rgba(0,0,0,0.08); }
  #tbd-mention-dropdown .tbd-mention-item.tbd-active { background: linear-gradient(90deg, rgba(255,110,196,0.14), rgba(120,115,245,0.06)); color: #111; }
  #tbd-mention-dropdown::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); }
}
.tbd-user-border { position: relative !important; display: inline-block !important; border-radius: 6px !important; padding: 0 2px !important; }
.tbd-user-border::before {
  content: ""; position: absolute; inset: -3px; border-radius: 8px; padding: 3px;
  background: linear-gradient(135deg, #ff6b6b, #f8e71c, #7ed321, #50e3c2, #4a90e2, #bd10e0);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none; opacity: 0.98;
}`;
  const styleTag = document.createElement('style');
  styleTag.textContent = injectedCss;
  document.head.appendChild(styleTag);

  // -------------------------
  // Main logic
  // -------------------------
  (async function main() {
    const input = await waitFor('#shout_text', { timeout: 15000 });
    const shoutsContainer = await waitFor('#shouts-container', { timeout: 15000 });
    const shoutboxContainer = await waitFor('#shoutbox-container', { timeout: 15000 });
    const shoutSendContainer = await waitFor('#shout-send-container', { timeout: 15000 });

    if (!input || !shoutsContainer || !shoutboxContainer || !shoutSendContainer) return;

    const dropdown = document.createElement('div');
    dropdown.id = 'tbd-mention-dropdown';
    document.body.appendChild(dropdown);

    let dropdownOpen = false;
    let suggestions = [];
    let activeIndex = -1;

    function getUsernamesFromDOM() {
      const els = Array.from(shoutsContainer.querySelectorAll('.tbdrank'));
      const names = els.map(el => (el.textContent || '').trim().replace(/\s+/g, ' ')).filter(Boolean);
      return uniqKeepOrder(names);
    }

    function buildDropdown(list, openFresh = false) {
      suggestions = list.slice();
      dropdown.innerHTML = '';

      for (let i = 0; i < list.length; i++) {
        const item = document.createElement('div');
        item.className = 'tbd-mention-item';
        item.textContent = list[i];
        item.addEventListener('mousedown', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          selectSuggestion(i);
        });
        item.addEventListener('touchstart', (ev) => {
          ev.preventDefault();
          selectSuggestion(i);
        }, { passive: false });
        dropdown.appendChild(item);
      }

      if (list.length === 0) {
        closeDropdown();
        return;
      }

      const font = getComputedStyle(dropdown).font || '13px Arial';
      const longest = list.reduce((m, s) => Math.max(m, measureTextWidth(s, font)), 0);
      const padding = 36;
      const w = Math.round(Math.min(Math.max(longest + padding, 120), 420));
      dropdown.style.width = `${w}px`;

      repositionIfOpen();

      if (!dropdownOpen || openFresh) activeIndex = 0;
      else {
        if (activeIndex >= list.length) activeIndex = list.length - 1;
        if (activeIndex < 0) activeIndex = 0;
      }

      updateActiveItem();
      dropdown.style.display = 'block';
      dropdownOpen = true;
    }

    function updateActiveItem() {
      const items = Array.from(dropdown.querySelectorAll('.tbd-mention-item'));
      items.forEach((el, idx) => el.classList.toggle('tbd-active', idx === activeIndex));
      const sel = items[activeIndex];
      if (sel) sel.scrollIntoView({ block: 'nearest' });
    }

    function closeDropdown() {
      if (!dropdownOpen) return;
      dropdown.style.display = 'none';
      dropdownOpen = false;
      suggestions = [];
      activeIndex = -1;
    }

    function selectSuggestion(index) {
      if (!suggestions || index < 0 || index >= suggestions.length) return;
      const name = suggestions[index];
      replaceLastMentionOrInsert(input, name);
      closeDropdown();
      input.focus();
    }

    function repositionIfOpen() {
      if (!dropdownOpen) return;

      const inputRect = input.getBoundingClientRect();
      const sendContainerRect = shoutSendContainer.getBoundingClientRect();
      const dropdownHeight = dropdown.offsetHeight;
      const spaceBelow = window.innerHeight - inputRect.bottom;
      const spaceAbove = sendContainerRect.top;

      dropdown.style.left = (inputRect.left + window.scrollX) + 'px';

      // If not enough space below but enough space above, position it on top
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        dropdown.style.top = (sendContainerRect.top + window.scrollY - dropdownHeight - 4) + 'px';
      } else {
        // Otherwise, default to below the input
        dropdown.style.top = (inputRect.bottom + window.scrollY + 4) + 'px';
      }
    }

    // --- Event Listeners ---

    let lastQuery = null;
    input.addEventListener('input', () => {
      const caret = input.selectionStart;
      const before = input.value.slice(0, caret);
      const m = before.match(/@([^\s@]*)$/);
      if (!m) {
        closeDropdown();
        lastQuery = null;
        return;
      }
      const q = m[1].toLowerCase();
      const all = getUsernamesFromDOM();
      const filtered = all.filter(name => name.toLowerCase().includes(q));
      const openFresh = (lastQuery === null || lastQuery !== q || !dropdownOpen);
      buildDropdown(filtered, openFresh);
      lastQuery = q;
    });

    input.addEventListener('keydown', (ev) => {
      if (!dropdownOpen) {
        if (ev.key === '@') {
          setTimeout(() => input.dispatchEvent(new Event('input', { bubbles: true })), 0);
        }
        return;
      }
      const items = dropdown.querySelectorAll('.tbd-mention-item');
      if (items.length === 0) return;

      const keyMap = { ArrowDown: 1, ArrowUp: -1 };
      if (keyMap[ev.key] !== undefined) {
        ev.preventDefault();
        activeIndex = (activeIndex + keyMap[ev.key] + items.length) % items.length;
        updateActiveItem();
      } else if (ev.key === 'Tab') {
        ev.preventDefault();
        activeIndex = (activeIndex + (ev.shiftKey ? -1 : 1) + items.length) % items.length;
        updateActiveItem();
      } else if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        selectSuggestion(activeIndex);
      } else if (ev.key === 'Escape') {
        ev.preventDefault();
        closeDropdown();
      }
    });

    document.addEventListener('click', (ev) => {
      if (dropdownOpen && !dropdown.contains(ev.target) && ev.target !== input) {
        closeDropdown();
      }
    });

    // Event Delegation for hover border, now scoped to #shouts-container
    shoutsContainer.addEventListener('mouseover', (ev) => {
      const msg = ev.target.closest('.shout-item');
      if (!msg) return;
      const userSpan = msg.querySelector('.shout-user');
      // Only add border if user has special rank span
      if (userSpan && userSpan.querySelector('span.dl-sc-trg.fx')) {
        userSpan.classList.add('tbd-user-border');
      }
    });
    shoutsContainer.addEventListener('mouseout', (ev) => {
      const msg = ev.target.closest('.shout-item');
      if (!msg) return;
      const userSpan = msg.querySelector('.shout-user');
      if (userSpan) userSpan.classList.remove('tbd-user-border');
    });

    // Event Delegation for click-to-mention, now scoped to #shouts-container
    let clickTimer = null;
    shoutsContainer.addEventListener('click', (ev) => {
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
        return; // This was a double-click, so do nothing.
      }

      clickTimer = setTimeout(() => {
        // If the user was dragging to select text, do nothing.
        if (window.getSelection().toString().length > 0) {
          clickTimer = null;
          return;
        }

        if (ev.button !== 0) { // Left click only
          clickTimer = null;
          return;
        }

        const target = ev.target;
        const msg = target.closest('.shout-item');
        if (!msg) {
          clickTimer = null;
          return;
        }

        // Ignore clicks on links, delete buttons, etc.
        if (target.closest('a, .shout-delete, .material-icons')) {
          clickTimer = null;
          return;
        }

        const tbdrank = msg.querySelector('.tbdrank');
        if (!tbdrank) {
          clickTimer = null;
          return;
        }

        const username = (tbdrank.textContent || '').trim().replace(/\s+/g, ' ');
        if (!username) {
          clickTimer = null;
          return;
        }

        ev.stopPropagation();

        if (ev.ctrlKey || ev.metaKey) {
          appendMentionToEnd(input, username);
        } else {
          replaceLastMentionOrInsert(input, username);
        }
        input.focus();
        closeDropdown();
        clickTimer = null;
      }, 200); // 200ms delay to wait for a potential double-click
    }, true);

    // Observe shout container for new/removed messages to refresh dropdown if open
    const mo = new MutationObserver(() => {
      if (dropdownOpen) {
        const caret = input.selectionStart;
        const before = input.value.slice(0, caret);
        const m = before.match(/@([^\s@]*)$/);
        const q = m ? m[1].toLowerCase() : null;
        if (q !== null) {
          const all = getUsernamesFromDOM();
          const filtered = all.filter(name => name.toLowerCase().includes(q));
          buildDropdown(filtered, false); // Rebuild without resetting index
        } else {
          closeDropdown();
        }
      }
    });
    mo.observe(shoutsContainer, { childList: true });

    window.addEventListener('resize', repositionIfOpen);
    window.addEventListener('scroll', repositionIfOpen, true);

  })();
})();
