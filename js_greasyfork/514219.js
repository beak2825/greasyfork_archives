// ==UserScript==
// @name         That's my purse, I don't know you!
// @namespace    whiskzey.torn
// @version      0.3
// @description  Turn player names on Torn attack loader page into clickable links to their attack loader.
// @author       Whiskey_Jack [1994581]
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/514219/That%27s%20my%20purse%2C%20I%20don%27t%20know%20you%21.user.js
// @updateURL https://update.greasyfork.org/scripts/514219/That%27s%20my%20purse%2C%20I%20don%27t%20know%20you%21.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* CONFIG - adjust if Torn changes class names */
  const participantsSelector = 'ul.participants___cw7GQ';           // container
  const playerNameSelector = '.playername___oeaye';                // span with username
  const existingLinkSelector = '.attack-action-item[href*="profiles.php?NID="]'; // existing profile links to convert
  const createLinkInsertSelector = '.desc___gARG9';                // where to insert created loader anchor
  const localStorageKey = 'torn_nid_to_xid_cache_v1';

  /* runtime state */
  const inFlight = new Map(); // nid -> Promise
  const cache = new Map(Object.entries(JSON.parse(localStorage.getItem(localStorageKey) || '{}')));

  /* helpers */
  function saveCache() {
    try { localStorage.setItem(localStorageKey, JSON.stringify(Object.fromEntries(cache.entries()))); } catch (e) {}
  }

  function makeLoaderHref(xid) {
    return `https://www.torn.com/loader.php?sid=attack&user2ID=${encodeURIComponent(xid)}`;
  }

  function getNidFromHref(href) {
    try {
      const u = new URL(href);
      return u.searchParams.get('NID');
    } catch (e) { return null; }
  }

  async function nidToXidFetch(nid) {
    if (!nid) return null;
    if (cache.has(nid)) return cache.get(nid);
    if (inFlight.has(nid)) return inFlight.get(nid);

    const p = (async () => {
      try {
        const url = `https://www.torn.com/profiles.php?NID=${encodeURIComponent(nid)}`;
        const resp = await fetch(url, { method: 'GET', redirect: 'follow', credentials: 'same-origin' });
        const final = resp.url || '';
        if (!final) {
          cache.set(nid, null);
          saveCache();
          return null;
        }
        // first try URL param
        const parsed = new URL(final);
        const xid = parsed.searchParams.get('XID') || parsed.searchParams.get('user2ID') || null;
        if (xid) {
          cache.set(nid, xid);
          saveCache();
          return xid;
        }
        // fallback: parse HTML for data-user
        const txt = await resp.text();
        const m = txt.match(/data-user=["']?(\d{3,})["']?/i);
        if (m) {
          cache.set(nid, m[1]);
          saveCache();
          return m[1];
        }
        cache.set(nid, null);
        saveCache();
        return null;
      } catch (err) {
        console.error('nidToXidFetch error for', nid, err);
        cache.set(nid, null);
        saveCache();
        return null;
      } finally {
        inFlight.delete(nid);
      }
    })();

    inFlight.set(nid, p);
    return p;
  }

  function attachSameTabClick(a) {
    // avoid attaching multiple times
    if (a.__loaderClickAttached) return;
    a.__loaderClickAttached = true;
    // remove target so same-tab behavior
    a.removeAttribute('target');
    a.addEventListener('click', (e) => {
      // allow ctrl/meta/middle click
      if (e.metaKey || e.ctrlKey || e.button === 1) return;
      e.preventDefault();
      // navigate to loader URL in same tab
      window.location.href = a.href;
    });
  }

  async function convertExistingAnchor(a) {
    if (!a || a.dataset._convertedToLoader === '1') return;
    // try to get NID from href first
    const nid = getNidFromHref(a.href) || a.dataset.nid || null;
    let xid = null;
    // try find username nearby if nid null
    if (!nid) {
      const li = a.closest('li');
      const nameSpan = li?.querySelector(playerNameSelector);
      if (nameSpan) nid = nameSpan.textContent.trim();
    }
    if (!nid) return;
    // use cache/fetch
    xid = await nidToXidFetch(nid);
    if (!xid) return;
    a.href = makeLoaderHref(xid);
    a.dataset._convertedToLoader = '1';
    a.title = 'Open attack loader';
    attachSameTabClick(a);
  }

  async function createLoaderAnchorForRow(li) {
    if (!li) return;
    // find .desc container to insert into
    const desc = li.querySelector(createLinkInsertSelector);
    if (!desc) return;
    // if a loader or profile link already exists, convert it instead
    const existing = desc.querySelector('.attack-action-item');
    if (existing) {
      await convertExistingAnchor(existing);
      return;
    }
    // find username
    const nameSpan = li.querySelector(playerNameSelector);
    if (!nameSpan) return;
    const nid = nameSpan.textContent.trim();
    if (!nid) return;
    // check cache or fetch xid
    const xid = await nidToXidFetch(nid);
    if (!xid) return;
    // build anchor
    const a = document.createElement('a');
    a.className = 'attack-action-item';
    a.href = makeLoaderHref(xid);
    a.title = 'Open attack loader';
    a.setAttribute('i-data', `i_from_script_${Date.now()}`);
    a.innerHTML = '<i class="crypto-crosshair-icon"></i><span>attack</span>';
    // insert at top of desc (so it shows similarly to original)
    desc.insertBefore(a, desc.firstChild);
    attachSameTabClick(a);
    a.dataset._convertedToLoader = '1';
  }

  // process rows currently in DOM
  function processCurrentParticipants() {
    const ul = document.querySelector(participantsSelector);
    if (!ul) return;
    const rows = Array.from(ul.querySelectorAll('li.row___bURfC'));
    for (const li of rows) {
      // either convert existing link or create one if missing
      const desc = li.querySelector(createLinkInsertSelector);
      const existing = desc?.querySelector('.attack-action-item[href*="profiles.php?NID="]') || desc?.querySelector('.attack-action-item[href*="loader.php?sid=attack"]');
      if (existing) {
        convertExistingAnchor(existing);
      } else {
        createLoaderAnchorForRow(li);
      }
    }
  }

  // observer to catch new joins / updates
  function startObserver() {
    const root = document.querySelector(participantsSelector) || document.body;
    const mo = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === 'childList' && m.addedNodes.length) {
          for (const n of m.addedNodes) {
            if (!(n instanceof Element)) continue;
            // if a new row was added, process it
            if (n.matches && n.matches('li.row___bURfC')) {
              // small defer to allow Torn to finish populating row
              setTimeout(() => createLoaderAnchorForRow(n), 50);
              continue;
            }
            // if subtree added (e.g., nested elements), try to find rows inside
            const li = n.querySelector?.('li.row___bURfC');
            if (li) {
              setTimeout(() => createLoaderAnchorForRow(li), 50);
            }
            // if an existing anchor was added/updated convert it
            const anchors = Array.from(n.querySelectorAll?.('.attack-action-item') || []);
            for (const a of anchors) convertExistingAnchor(a);
          }
        }
        // attribute changes on anchors (href changed) — convert if needed
        if (m.type === 'attributes' && m.target instanceof Element) {
          if (m.target.matches && m.target.matches('.attack-action-item')) {
            convertExistingAnchor(m.target);
          }
        }
      }
    });
    mo.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
    return mo;
  }

  // kick off
  processCurrentParticipants();
  const observer = startObserver();

  // expose small debug utilities
  window.__torn_nid_xid_cache = cache;
  window.__torn_force_convert = processCurrentParticipants;

  console.log('Torn participant -> attack loader script active');
})();
