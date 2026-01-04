// ==UserScript==
// @name         Color my Oomf
// @namespace    f_d_tools
// @version      1.1
// @description  Colors @usernames you follow with stable huesr + profile-only add/remove UI.
// @author       you
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547347/Color%20my%20Oomf.user.js
// @updateURL https://update.greasyfork.org/scripts/547347/Color%20my%20Oomf.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- Config ----
  const STORAGE_KEY = 'fd_following_handles_v1';
  const HUE_BASE = 0;
  const HUE_SPREAD = 360;
  const SAT = 75; // %
  const LIT = 48; // %

  // ---- State ----
  let following = new Set(loadFollowing());
  const processedAttr = 'data-fd-colored';

  // ---- Utils ----
  function loadFollowing() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  function saveFollowing() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(following)));
    } catch {}
  }

  // FNV-1a 32-bit (fast & simple)
  function hash32(str) {
    let h = 0x811c9dc5 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h >>> 0;
  }
  function colorForHandle(handle) {
    const h = (hash32(handle.toLowerCase()) % HUE_SPREAD + HUE_BASE) % 360;
    return `hsl(${h} ${SAT}% ${LIT}%)`;
  }

  function isAtHandle(text) {
    const t = text?.trim();
    return !!t && t[0] === '@' && t.length > 1;
  }
  function extractHandleFromText(text) {
    return text.trim().replace(/^@/, '').split(/\s/)[0];
  }

  function markIfFollowed(span) {
    if (!span || span.getAttribute(processedAttr)) return;
    const txt = span.textContent;
    if (!isAtHandle(txt)) return;

    const handle = extractHandleFromText(txt);
    if (!handle || !following.has(handle.toLowerCase())) return;

    colorSpan(span, handle);
  }

  function colorSpan(span, handle) {
    span.style.color = colorForHandle(handle);
    span.style.textDecorationColor = 'currentColor';
    span.style.textDecorationThickness = 'from-font';
    span.style.textDecorationLine = 'none';
    span.setAttribute(processedAttr, '1');
  }

  function uncolorAllInstances(handle) {
    // Remove color from any spans with this @handle
    const at = '@' + handle;
    document.querySelectorAll('span').forEach(s => {
      const t = s.textContent?.trim();
      if (t === at) {
        s.style.color = '';
        s.style.textDecorationColor = '';
        s.style.textDecorationThickness = '';
        s.style.textDecorationLine = '';
        s.removeAttribute(processedAttr);
      }
    });
  }

  // ---- Safe scanner on Following page ----
  // Heuristic: only add handles from user cards that indicate a "Following" state,
  // which excludes "Follow" suggestions.
  function scanFollowingPageSafely() {
    let added = 0;

    // Candidates: user rows/cards
    const cards = document.querySelectorAll('[data-testid="UserCell"], [data-testid="cellInnerDiv"], article, div[role="listitem"]');

    cards.forEach(card => {
      // Find a "Following" button/label inside this card
      const hasFollowingState =
        !!card.querySelector('div[role="button"][data-testid*="unfollow"], div[aria-label*="Following"], div[dir="auto"]:has(span:contains("Following"))') ||
        textContains(card, /\bFollowing\b/);

      if (!hasFollowingState) return;

      // Extract @handle in this card
      const spans = card.querySelectorAll('span');
      for (const s of spans) {
        const txt = s.textContent;
        if (!isAtHandle(txt)) continue;
        const h = extractHandleFromText(txt).toLowerCase();
        // Sanity: link form /<handle> exists nearby (profile link)
        const profileLink = card.querySelector(`a[href^="/${cssEscape(h)}"]`);
        if (!profileLink) continue;

        if (!following.has(h)) {
          following.add(h);
          added++;
        }
        break; // one handle per card is enough
      }
    });

    if (added > 0) saveFollowing();
    return added;
  }

  // Fallback "visible scan" with extra guards; kept for the toolbar button
  function scanHandlesInFollowingPage() {
    // Prefer safe method
    return scanFollowingPageSafely();
  }

  // ---- Profile-only Add/Remove UI ----
  function onProfilePage() {
    // Heuristic: /handle or /handle/ with no further path segment
    // (exclude /home, /explore, etc.)
    const m = location.pathname.match(/^\/([A-Za-z0-9_]{1,15})(?:\/)?$/);
    return !!m && !['home', 'explore', 'notifications', 'messages', 'settings', 'compose', 'i'].includes(m[1]);
  }
  function currentProfileHandle() {
    // Try to read from header @handle
    const header = document.querySelector('[data-testid="UserName"]');
    if (header) {
      const at = header.querySelector('span');
      if (at && isAtHandle(at.textContent)) {
        return extractHandleFromText(at.textContent).toLowerCase();
      }
    }
    // Fallback to path
    const m = location.pathname.match(/^\/([A-Za-z0-9_]{1,15})(?:\/)?$/);
    return m ? m[1].toLowerCase() : null;
  }

  let profileBarEl = null;
  function injectProfileBar() {
    removeProfileBar(); // avoid duplicates
    if (!onProfilePage()) return;

    const handle = currentProfileHandle();
    if (!handle) return;

    const bar = document.createElement('div');
    bar.id = 'fd-profile-pill';
    bar.style.position = 'fixed';
    bar.style.zIndex = 999999;
    bar.style.bottom = '16px';
    bar.style.right = '16px';
    bar.style.padding = '8px 10px';
    bar.style.background = 'rgba(30,30,30,0.92)';
    bar.style.color = '#fff';
    bar.style.borderRadius = '9999px';
    bar.style.boxShadow = '0 6px 20px rgba(0,0,0,0.35)';
    bar.style.font = '12px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
    bar.style.display = 'flex';
    bar.style.gap = '8px';
    bar.style.alignItems = 'center';

    const label = document.createElement('span');
    label.textContent = '@' + handle;
    label.style.opacity = '0.85';

    function btn(text, onclick) {
      const b = document.createElement('button');
      b.textContent = text;
      b.style.cursor = 'pointer';
      b.style.border = '1px solid rgba(255,255,255,0.25)';
      b.style.background = 'transparent';
      b.style.color = '#fff';
      b.style.padding = '4px 8px';
      b.style.borderRadius = '9999px';
      b.style.fontSize = '12px';
      b.addEventListener('click', onclick);
      b.addEventListener('mouseenter', () => (b.style.background = 'rgba(255,255,255,0.08)'));
      b.addEventListener('mouseleave', () => (b.style.background = 'transparent'));
      return b;
    }

    const inCache = following.has(handle);

    const addBtn = btn('Add', () => {
      if (!following.has(handle)) {
        following.add(handle);
        saveFollowing();
        // Recolor existing occurrences immediately
        document.querySelectorAll('span').forEach(s => {
          if (s.textContent?.trim() === '@' + handle) colorSpan(s, handle);
        });
        injectProfileBar(); // refresh buttons
      }
    });

    const removeBtn = btn('Remove', () => {
      if (following.delete(handle)) {
        saveFollowing();
        uncolorAllInstances(handle);
        injectProfileBar(); // refresh buttons
      }
    });

    bar.append(label, inCache ? removeBtn : addBtn);
    document.body.appendChild(bar);
    profileBarEl = bar;
  }
  function removeProfileBar() {
    if (profileBarEl && profileBarEl.parentNode) {
      profileBarEl.parentNode.removeChild(profileBarEl);
    }
    profileBarEl = null;
  }

  // ---- Following-page toolbar (unchanged UX) ----
  function onFollowingPage() {
    return /\/following\/?$/.test(location.pathname);
  }

  let followToolbarEl = null;
  function injectFollowingToolbar() {
    if (followToolbarEl || !onFollowingPage()) return;

    const bar = document.createElement('div');
    bar.id = 'fd-follow-toolbar';
    bar.style.position = 'fixed';
    bar.style.zIndex = 999999;
    bar.style.bottom = '16px';
    bar.style.right = '16px';
    bar.style.padding = '10px 12px';
    bar.style.background = 'rgba(30,30,30,0.9)';
    bar.style.color = '#fff';
    bar.style.borderRadius = '12px';
    bar.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
    bar.style.font = '13px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
    bar.style.display = 'flex';
    bar.style.gap = '8px';
    bar.style.alignItems = 'center';

    function btn(label, onclick, title='') {
      const b = document.createElement('button');
      b.textContent = label;
      b.style.cursor = 'pointer';
      b.style.border = '1px solid rgba(255,255,255,0.2)';
      b.style.background = 'transparent';
      b.style.color = '#fff';
      b.style.padding = '6px 8px';
      b.style.borderRadius = '8px';
      b.style.fontSize = '12px';
      if (title) b.title = title;
      b.addEventListener('click', onclick);
      b.addEventListener('mouseenter', () => (b.style.background = 'rgba(255,255,255,0.08)'));
      b.addEventListener('mouseleave', () => (b.style.background = 'transparent'));
      return b;
    }

    const status = document.createElement('span');
    status.textContent = `Cached: ${following.size}`;
    status.style.opacity = '0.8';

    const scanBtn = btn('Scan visible (safe)', () => {
      const added = scanHandlesInFollowingPage();
      status.textContent = `Cached: ${following.size} (+${added})`;
    }, 'Adds @handles from cards that show a “Following” state, ignoring suggestions.');

    const clearBtn = btn('Clear', () => {
      if (!confirm('Clear all cached handles?')) return;
      following.clear();
      saveFollowing();
      status.textContent = `Cached: ${following.size}`;
    });

    const exportBtn = btn('Export', () => {
      const data = Array.from(following).join('\n');
      navigator.clipboard.writeText(data).then(() => {
        status.textContent = `Copied ${following.size} handles`;
        setTimeout(() => (status.textContent = `Cached: ${following.size}`), 1500);
      });
    });

    bar.append(scanBtn, clearBtn, exportBtn, status);
    document.body.appendChild(bar);
    followToolbarEl = bar;
  }
  function removeFollowingToolbar() {
    if (followToolbarEl && followToolbarEl.parentNode) {
      followToolbarEl.parentNode.removeChild(followToolbarEl);
    }
    followToolbarEl = null;
  }

  // ---- Helpers ----
  function textContains(root, regex) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let n;
    while ((n = walker.nextNode())) {
      if (regex.test(n.nodeValue)) return true;
    }
    return false;
  }
  // Escape for CSS attribute selector usage
  function cssEscape(str) {
    return CSS?.escape ? CSS.escape(str) : str.replace(/[^a-zA-Z0-9_\-]/g, s => '\\' + s);
  }

  // ---- DOM observation ----
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (node.tagName === 'SPAN') {
          markIfFollowed(node);
        }
        const spans = node.querySelectorAll?.('span');
        if (spans?.length) {
          for (const s of spans) markIfFollowed(s);
        }
      }
    }
  });

  function primeExisting() {
    document.querySelectorAll('span').forEach(markIfFollowed);
  }

  function routeChangeHandlers() {
    // Called on SPA route changes
    primeExisting();
    removeFollowingToolbar();
    removeProfileBar();
    if (onFollowingPage()) injectFollowingToolbar();
    if (onProfilePage()) injectProfileBar();
  }

  // ---- Boot ----
  primeExisting();
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

  // SPA navigation watcher
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      routeChangeHandlers();
    }
  }, 800);

  // First-time page kind setup
  if (onFollowingPage()) injectFollowingToolbar();
  if (onProfilePage()) injectProfileBar();

})();
