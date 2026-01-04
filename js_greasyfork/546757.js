// ==UserScript==
// @name         MilkyWay Idle — Persistent/Longer Chat History
// @namespace    mwi_chat_longer_history
// @version      2.1.1
// @description  Capture and persist chat messages with minimal lag.
// @author       Silky-Panda
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546757/MilkyWay%20Idle%20%E2%80%94%20PersistentLonger%20Chat%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/546757/MilkyWay%20Idle%20%E2%80%94%20PersistentLonger%20Chat%20History.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const CHAT_CONTAINER_SELECTOR = '[class^="ChatHistory_chatHistory"]';

  const MAX_VISIBLE_PER_TAB = 200;

  const MAX_SAVED_PER_TAB = 5000;

  const SAVE_DEBOUNCE_MS = 800;

  const NS = 'mwi.chat.persist.v1';

  const USER_CHAR_ALIAS_KEY = `${NS}::userCharacterAlias`;

  const observers = new Map();
  const cache = new Map();
  const initializedContainers = new WeakSet();
  const restoringFor = new WeakSet();

  const log = (...args) => console.log('[MWI-Chat]', ...args);
  const warn = (...args) => console.warn('[MWI-Chat]', ...args);

  function normalizeTabForStorage(tabId) {
    if (tabId === 'tab:#UwU') {
      return 'tab:General';
    }
    return tabId;
  }



  function debounceSave(storageKey) {
    const entry = cache.get(storageKey);
    if (!entry) return;

    entry.dirty = true;
    if (entry.saveTimer) return;

    entry.saveTimer = setTimeout(() => {
      entry.saveTimer = null;
      if (!entry.dirty) return;
      entry.dirty = false;

      if (entry.messages.length > MAX_SAVED_PER_TAB) {
        entry.messages = entry.messages.slice(-MAX_SAVED_PER_TAB);
      }
      try {
        GM_setValue(storageKey, JSON.stringify(entry.messages));
      } catch (e) {
        warn('Failed to save chat log for', storageKey, e);
      }
    }, SAVE_DEBOUNCE_MS);
  }

  function getStorageKey(characterId, tabId) {
    const account = 'acc';
    return `${NS}::${account}::${characterId}::${tabId}`;
  }

  function ensureCache(storageKey) {
    if (cache.has(storageKey)) return cache.get(storageKey);
    let messages = [];
    try {
      const raw = GM_getValue(storageKey, '[]');
      messages = JSON.parse(raw);
      if (!Array.isArray(messages)) messages = [];
    } catch (e) {
      warn('Failed to parse stored messages for', storageKey, e);
      messages = [];
    }
    const entry = { messages, dirty: false, saveTimer: null };
    cache.set(storageKey, entry);
    return entry;
  }

  function textOf(el) {
    return el.outerHTML || el.textContent || '';
  }

  function getUserCharacterAlias() {
    try {
      const alias = GM_getValue(USER_CHAR_ALIAS_KEY, '');
      return (alias && typeof alias === 'string') ? alias.trim() : '';
    } catch {
      return '';
    }
  }

  function setUserCharacterAlias(alias) {
    try {
      GM_setValue(USER_CHAR_ALIAS_KEY, (alias || '').trim());
    } catch (e) {
      warn('Failed to set character alias', e);
    }
  }

  function detectCharacterId() {
    const alias = getUserCharacterAlias();
    if (alias) return `char:${alias}`;

    const candidates = [];
    const queryList = [
      '[class*="Character"][class*="Name"]',
      '[class*="character"][class*="name"]',
      '[data-testid*="character"][data-testid*="name"]',
      '[aria-label*="Character"]',
      '[class*="Profile"] [class*="name"]',
      '[class*="Header"] [class*="name"]',
    ];
    for (const q of queryList) {
      document.querySelectorAll(q).forEach(el => candidates.push(el));
    }
    if (candidates.length === 0) {
      const top = document.querySelector('header, [class*="TopBar"], [class*="Navbar"]');
      if (top) {
        top.querySelectorAll('*').forEach(el => {
          const txt = (el.textContent || '').trim();
          if (txt && txt.length >= 3 && txt.length <= 24) candidates.push(el);
        });
      }
    }
    for (const el of candidates) {
      const name = (el.textContent || '').trim();
      if (name && /^[\w\s\-'.]+$/.test(name) && name.length <= 24) {
        return `char:${name}`;
      }
    }

    return 'char:unknown';
  }

  function detectTabId(chatContainer) {
    const tabPanel = chatContainer.closest('.TabPanel_tabPanel__tXMJF');
    const panelsContainer = tabPanel && tabPanel.parentElement;
    if (tabPanel && panelsContainer) {
      const panels = Array.from(panelsContainer.querySelectorAll(':scope > .TabPanel_tabPanel__tXMJF'));
      const panelIndex = panels.indexOf(tabPanel);

      if (panelIndex >= 0) {
        const tabsRoot = panelsContainer.closest('.TabsComponent_tabsComponent__3PqGp, .Chat_tabsComponentContainer__3ZoKe');
        if (tabsRoot) {
          const tablist = tabsRoot.querySelector('[role="tablist"]');
          if (tablist) {
            const tabs = Array.from(tablist.querySelectorAll('button[role="tab"]'));
            const tab = tabs[panelIndex] || null;
            if (tab) {
              const badge = tab.querySelector('span.MuiBadge-root');
              if (badge && badge.childNodes && badge.childNodes.length) {
                for (let i = 0; i < badge.childNodes.length; i++) {
                  const n = badge.childNodes[i];
                  if (n.nodeType === Node.TEXT_NODE) {
                    const name = (n.textContent || '').trim();
                    if (name) return `tab:${name}`;
                  }
                }
              }
              const raw = (tab.textContent || '').trim();
              const label = raw.split(/\s*(?=\d)/)[0].trim() || raw;
              if (label) return `tab:${label}`;
            }
          }
        }
      }
    }
    try {
      const selected = document.querySelector('[role="tab"][aria-selected="true"]');
      if (selected) {
        const badge = selected.querySelector('span.MuiBadge-root');
        if (badge && badge.childNodes) {
          for (let i = 0; i < badge.childNodes.length; i++) {
            const n = badge.childNodes[i];
            if (n.nodeType === Node.TEXT_NODE) {
              const name = (n.textContent || '').trim();
              if (name) return `tab:${name}`;
            }
          }
        }
        const raw = (selected.textContent || '').trim();
        const label = raw.split(/\s*(?=\d)/).trim() || raw;
        if (label) return `tab:${label}`;
      }
    } catch (e) {
    }

    const all = Array.from(document.querySelectorAll(CHAT_CONTAINER_SELECTOR));
    const idx = Math.max(0, all.indexOf(chatContainer));
    return `tab:index${idx}`;
  }



  function trimVisible(container) {
    while (container.children.length > MAX_VISIBLE_PER_TAB) {
      container.removeChild(container.firstElementChild);
    }
  }

  function handleNewNodes(container, storageKey, nodes) {
    const entry = ensureCache(storageKey);
    const seen = new Set(entry.messages);
    let added = 0;
    for (const node of nodes) {
      if (node.nodeType !== 1) continue;
      const html = textOf(node);
      if (html && !seen.has(html)) {
        entry.messages.push(html);
        seen.add(html);
        added++;
      }
    }
    if (added) {
      debounceSave(storageKey);
      trimVisible(container);
    }
  }


  function attachObserver(chatContainer, characterId, tabId) {
    const effectiveTabId = normalizeTabForStorage(tabId);
    const storageKey = getStorageKey(characterId, effectiveTabId);
    if (observers.has(chatContainer)) return;

    const observer = new MutationObserver(mutations => {
      if (restoringFor.has(chatContainer)) return;
      const added = [];
      for (const m of mutations) {
        m.addedNodes && added.push(...m.addedNodes);
      }
      if (added.length) handleNewNodes(chatContainer, storageKey, added);
    });

    observer.observe(chatContainer, { childList: true });
    observers.set(chatContainer, observer);

    const entry = ensureCache(storageKey);
    if (entry.messages.length) {
      restoringFor.add(chatContainer);
      try {
        const existingSet = new Set();
        chatContainer.querySelectorAll(':scope > *').forEach(node => {
          existingSet.add(node.outerHTML);
        });

        const frag = document.createDocumentFragment();
        const toShow = entry.messages.slice(-MAX_VISIBLE_PER_TAB);
        let restoredCount = 0;

        for (const html of toShow) {
          if (!existingSet.has(html)) {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            while (wrapper.firstChild) frag.appendChild(wrapper.firstChild);
            restoredCount++;
          }
        }

        if (restoredCount > 0) {
          chatContainer.insertBefore(frag, chatContainer.firstChild);
          log(`Restored ${restoredCount} messages without duplicates.`);
        }
      } catch (e) {
        warn('Failed restoring chat DOM for', storageKey, e);
      } finally {
        restoringFor.delete(chatContainer);
      }

      trimVisible(chatContainer);
    }

  }

  function initContainer(chatContainer) {
    if (!chatContainer || initializedContainers.has(chatContainer)) return;
    initializedContainers.add(chatContainer);

    const characterId = detectCharacterId();
    const tabId = detectTabId(chatContainer);
    const effectiveTabId = normalizeTabForStorage(tabId);
    const storageKey = getStorageKey(characterId, effectiveTabId);
    const entry = ensureCache(storageKey);

    log('Init chat container', { characterId, effectiveTabId, storageKey, entry });
    const seen = new Set(entry.messages);
    let added = 0;
    chatContainer.querySelectorAll(':scope > *').forEach(node => {
      const html = textOf(node);
      if (html && !seen.has(html)) {
        entry.messages.push(html);
        seen.add(html);
        added++;
      }
    });

    if (added) {
      log(`Merged ${added} existing DOM messages for ${effectiveTabId}`);
      debounceSave(storageKey);
    }
    attachObserver(chatContainer, characterId, tabId);
  }

  function scanAndInit() {
    document.querySelectorAll(CHAT_CONTAINER_SELECTOR).forEach(initContainer);
  }

  function installRootObserver() {
    const rootObs = new MutationObserver(() => scanAndInit());
    rootObs.observe(document.body, { childList: true, subtree: true });
    scanAndInit();
  }
  function exportAll() {
    const data = {};
    for (const key of GM_listValues()) {
      if (!key.startsWith(NS)) continue;
      try {
        data[key] = JSON.parse(GM_getValue(key, '[]'));
      } catch {
        data[key] = GM_getValue(key, null);
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mwi-chat-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearScope(predicate, label) {
    let count = 0;
    for (const key of GM_listValues()) {
      if (predicate(key)) {
        GM_deleteValue(key);
        count++;
      }
    }
    alert(`Cleared ${count} stored item(s) for ${label}.`);
  }

  function currentKeysFor(characterId) {
    const keys = [];
    for (const key of GM_listValues()) {
      if (key.startsWith(`${NS}::`) && key.includes(`::${characterId}::`)) {
        keys.push(key);
      }
    }
    return keys;
  }

  function registerMenus() {
    GM_registerMenuCommand('Set Character Alias (override auto-detect)', () => {
      const cur = getUserCharacterAlias();
      const next = prompt('Enter a short alias/name for this character (used to namespace chat logs):', cur || '');
      if (next != null) {
        setUserCharacterAlias(next);
        alert('Alias saved. Reload the page so this character ID is used going forward.');
      }
    });

    GM_registerMenuCommand('Export All Chat Logs (JSON)', exportAll);

    GM_registerMenuCommand('Clear ALL Stored Chat Logs', () => {
      if (confirm('Delete ALL stored chat logs for this script?')) {
        clearScope(k => k.startsWith(NS), 'ALL chats');
      }
    });

    GM_registerMenuCommand('Clear CURRENT Character Logs', () => {
      const charId = detectCharacterId();
      if (confirm(`Delete stored chat logs for current character?\n\n${charId}`)) {
        const keys = currentKeysFor(charId);
        keys.forEach(GM_deleteValue);
        alert(`Cleared ${keys.length} tab(s) for ${charId}. Reload recommended.`);
      }
    });
  }
  function start() {
    registerMenus();
    installRootObserver();
    log('Persistent chat ready.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
