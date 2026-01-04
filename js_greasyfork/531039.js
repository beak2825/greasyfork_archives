// ==UserScript==
// @name         Zillow Sq Ft and Built in Copy (stable)
// @namespace    http://tampermonkey.net/*
// @version      1.2
// @description  Stable copy of Sq Ft and Built in on Zillow despite dynamic DOM updates
// @author       Jamie C.
// @match        https://www.zillow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zillow.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531039/Zillow%20Sq%20Ft%20and%20Built%20in%20Copy%20%28stable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531039/Zillow%20Sq%20Ft%20and%20Built%20in%20Copy%20%28stable%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Robust clipboard writer
  async function writeClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        // fall through to legacy
      }
    }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Create a small transient tooltip near element
  function showTooltip(el, msg, ms = 1200) {
    try {
      const tip = document.createElement('div');
      tip.textContent = msg;
      Object.assign(tip.style, {
        position: 'absolute',
        background: '#222',
        color: '#fff',
        padding: '6px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 999999,
        pointerEvents: 'none',
        opacity: '0.95'
      });
      document.body.appendChild(tip);
      const rect = el.getBoundingClientRect();
      tip.style.left = `${Math.max(8, rect.left + window.scrollX)}px`;
      tip.style.top = `${Math.max(8, rect.top + window.scrollY - rect.height - 10)}px`;
      setTimeout(() => tip.remove(), ms);
    } catch (e) {
      console.log('Copied:', msg);
    }
  }

  // Build the text we want to copy from a found element
  function buildCopyText(baseSpan, glanceContainer) {
    const base = baseSpan.innerText.trim();
    let additional = '';
    if (glanceContainer) {
      const divs = Array.from(glanceContainer.querySelectorAll('div'));
      const built = divs.find(d => d.innerText && d.innerText.includes('Built in'));
      if (built) additional = `\n${built.innerText.trim()}`;
    }
    return `${base} sq ft${additional}`;
  }

  // Non-destructive idempotent enhancer: attach a data attribute and pointer styling
  function enhanceSpan(span) {
    if (!span || !(span instanceof HTMLElement)) return;
    if (span.dataset.zillowSqCopy === '1') return; // already enhanced
    span.dataset.zillowSqCopy = '1';
    span.style.cursor = 'pointer';
    span.title = 'Click to copy sq ft and built info';
  }

  // Event delegation handler
  document.addEventListener('click', async function(ev) {
    // find nearest span that is a sq-ft candidate and was enhanced
    let node = ev.target;
    while (node && node !== document) {
      if (node.dataset && node.dataset.zillowSqCopy === '1') break;
      node = node.parentElement;
    }
    if (!node || node === document) return;

    // Recompute additional info at click-time (handles dynamic changes)
    const factContainers = document.querySelectorAll('div[data-testid="bed-bath-sqft-fact-container"]');
    // prefer the 3rd container if present, otherwise try to find the one that contains the clicked node
    let targetContainer = null;
    if (factContainers.length >= 3) {
      targetContainer = factContainers[2];
    } else {
      // find nearest ancestor container with the data-testid
      targetContainer = node.closest('div[data-testid="bed-bath-sqft-fact-container"]');
    }

    const glanceContainer = document.querySelector('div[aria-label="At a glance facts"]');
    const text = buildCopyText(node, glanceContainer);

    const ok = await writeClipboard(text);
    if (ok) {
      showTooltip(node, 'Copied');
    } else {
      alert('Copy failed. See console for value.');
      console.log('Copied text:', text);
    }
  }, true); // capture to run early

  // Observer to watch for the target span to appear or be replaced
  const observer = new MutationObserver((mutations) => {
    // cheap coarse check first: do we have any containers?
    const factContainers = document.querySelectorAll('div[data-testid="bed-bath-sqft-fact-container"]');
    if (factContainers.length === 0) return;

    // If the 3rd container exists, use its first span. Otherwise, attempt to find any reasonable span inside containers.
    let candidateSpan = null;
    if (factContainers.length >= 3) {
      candidateSpan = factContainers[2].querySelector('span');
    } else {
      for (const c of factContainers) {
        const s = c.querySelector('span');
        if (s) { candidateSpan = s; break; }
      }
    }
    if (candidateSpan) {
      enhanceSpan(candidateSpan);
    }
  });

  // Observe the whole document body for subtree changes (Zillow does dynamic replacements)
  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
  });

  // Run an initial pass in case elements already present
  window.requestAnimationFrame(() => {
    const factContainers = document.querySelectorAll('div[data-testid="bed-bath-sqft-fact-container"]');
    if (factContainers.length >= 3) {
      const firstSpan = factContainers[2].querySelector('span');
      if (firstSpan) enhanceSpan(firstSpan);
    } else {
      // fallback: enhance first available span in any container
      for (const c of factContainers) {
        const s = c.querySelector('span');
        if (s) { enhanceSpan(s); break; }
      }
    }
  });

})();