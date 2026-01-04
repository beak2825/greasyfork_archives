// ==UserScript==
// @name         Torn Points Market Player Info
// @namespace    underko.torn.scripts.points
// @version      1.2
// @description  Appends player stats to usernames in the points market
// @author       underko[3362751]
// @match        https://www.torn.com/pmarket.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541979/Torn%20Points%20Market%20Player%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/541979/Torn%20Points%20Market%20Player%20Info.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const API_KEY = '<YOUR_PUBLIC_API_KEY>';
  const cache = new Map();

  function extractXID(node) {
    const profileLink = node.querySelector('a.user.name[href*="profiles.php?XID="]');
    if (!profileLink) return null;
    const match = profileLink.href.match(/XID=(\d+)/);
    return match ? match[1] : null;
  }

  async function fetchPlayerInfo(xid) {
    if (cache.has(xid)) return cache.get(xid);

    const url = `https://api.torn.com/user/${xid}?key=${API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.warn(`Torn API error for XID ${xid}:`, data.error.error);
        return null;
      }

      const result = {
        level: data.level,
        age: data.age,
        lastAction: data.last_action?.relative || 'n/a',
        status: data.status?.state || 'n/a',
      };

      cache.set(xid, result);
      return result;
    } catch (e) {
      console.error(`Failed to fetch user ${xid}:`, e);
      return null;
    }
  }

  function appendInfo(node, info) {
    const userElement = node.querySelector('a.user.name');
    if (!userElement || userElement.dataset.extended) return;

    const span = document.createElement('span');
    span.style.fontSize = 'smaller';
    span.style.marginLeft = '5px';
    span.style.color = '#888';

    span.textContent = ` [L${info.level} | A${info.age} | ${info.status}]`;

    userElement.appendChild(span);
    userElement.dataset.extended = 'true';
  }

  async function processNode(node) {
    if (!(node instanceof HTMLElement)) return;
    if (!node.matches('span.expander')) return;

    const xid = extractXID(node);
    if (!xid) return;

    const info = await fetchPlayerInfo(xid);
    if (info) appendInfo(node, info);
  }

  function observeMarket() {
    const container = document.body;

    const observer = new MutationObserver((mutations) => {
      for (const { addedNodes } of mutations) {
        for (const node of addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches('span.expander')) {
            processNode(node);
          }
          node.querySelectorAll?.('span.expander').forEach(processNode);
        }
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    document.querySelectorAll('span.expander').forEach(processNode);
  }

  observeMarket();
})();
