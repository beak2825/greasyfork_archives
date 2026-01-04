// ==UserScript==
// @name         Quick Dictionary Lookup
// @namespace    https://example.com/
// @version      1.5
// @description  Highlight a word/phrase and click the popup to see its definition, with fallback and retry.
// @author       ChatGPT
// @match        *://*/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544541/Quick%20Dictionary%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/544541/Quick%20Dictionary%20Lookup.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let badge = null;
  let tooltip = null;
  let lastSelection = '';

  // Styles
  GM_addStyle(`
    .dict-badge {
      position: absolute;
      background: #1f5aff;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      z-index: 999999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      user-select: none;
    }
    .dict-tooltip {
      position: absolute;
      background: white;
      color: #222;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      max-width: 320px;
      font-size: 13px;
      z-index: 999999;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      line-height: 1.3;
      font-family: system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
    }
    .dict-term {
      font-weight: bold;
      margin-bottom: 6px;
      display: block;
    }
    .dict-error {
      color: #b33;
      font-style: italic;
    }
    .dict-close {
      position: absolute;
      top: 4px;
      right: 6px;
      cursor: pointer;
      font-weight: bold;
    }
    .dict-link {
      margin-top: 6px;
      display: inline-block;
      font-size: 12px;
    }
  `);

  // Utility: clean up term
  function normalizeTerm(raw) {
    if (!raw) return '';
    let t = raw.trim().replace(/\s+/g, ' ');
    // strip surrounding punctuation except internal (like "word," -> "word")
    t = t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
    return t.toLowerCase();
  }

  // Remove existing badge
  function removeBadge() {
    if (badge) {
      badge.remove();
      badge = null;
    }
  }

  // Remove tooltip
  function removeTooltip() {
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
  }

  // Fetch definition from dictionaryapi.dev with structured result
  async function fetchDefinition(term) {
    try {
      const resp = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`, {
        cache: 'no-store',
      });
      const text = await resp.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn('Dictionary API: failed to parse JSON for term:', term, 'raw response:', text);
        throw new Error('Invalid JSON from dictionary API');
      }
      console.debug('Dictionary API response for', term, data);
      if (!resp.ok || !Array.isArray(data) || !data[0].meanings) {
        return { found: false, raw: data };
      }
      return { found: true, data };
    } catch (err) {
      console.warn('Dictionary API fetch error for term:', term, err);
      return { found: false, error: err };
    }
  }

  // Create badge near selection
  function createBadge(x, y, rawText) {
    removeBadge();
    removeTooltip();
    badge = document.createElement('div');
    badge.className = 'dict-badge';
    badge.textContent = '📘 Dictionary';
    document.body.appendChild(badge);
    // adjust if offscreen
    const offsetX = 4;
    const offsetY = 4;
    badge.style.left = `${Math.min(x + offsetX, window.scrollX + window.innerWidth - 120)}px`;
    badge.style.top = `${Math.max(y + offsetY, window.scrollY + 4)}px`;

    badge.addEventListener('click', () => {
      showDefinition(rawText, parseInt(badge.style.left, 10), parseInt(badge.style.top, 10) + badge.offsetHeight + 4);
    });
  }

  // Show tooltip with definition, fallback, and retry
  function showDefinition(rawTerm, x, y) {
    const term = normalizeTerm(rawTerm) || rawTerm;
    removeTooltip();
    tooltip = document.createElement('div');
    tooltip.className = 'dict-tooltip';
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;

    // Close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'dict-close';
    closeBtn.textContent = '×';
    closeBtn.title = 'Close';
    closeBtn.onclick = () => removeTooltip();
    tooltip.appendChild(closeBtn);

    // Title
    const title = document.createElement('div');
    title.className = 'dict-term';
    title.textContent = term;
    tooltip.appendChild(title);

    // Content placeholder
    const content = document.createElement('div');
    content.textContent = 'Loading...';
    tooltip.appendChild(content);

    document.body.appendChild(tooltip);

    // Fetch definition
    fetchDefinition(term).then((result) => {
      content.innerHTML = '';
      if (result.found) {
        const meanings = result.data[0].meanings.slice(0, 2);
        meanings.forEach((meaning) => {
          const part = document.createElement('div');
          part.style.marginBottom = '6px';
          const partTitle = document.createElement('div');
          partTitle.textContent = meaning.partOfSpeech;
          partTitle.style.fontStyle = 'italic';
          part.appendChild(partTitle);
          meaning.definitions.slice(0, 2).forEach((def) => {
            const d = document.createElement('div');
            d.textContent = `• ${def.definition}`;
            part.appendChild(d);
          });
          content.appendChild(part);
        });
      } else {
        let msg = 'Definition not found.';
        if (result.raw && result.raw.title) {
          msg += ` (${result.raw.title})`;
        } else if (result.error) {
          msg += ' (API error)';
        }
        const errorDiv = document.createElement('div');
        errorDiv.className = 'dict-error';
        errorDiv.innerHTML = `${msg} <a href="https://www.google.com/search?q=define+${encodeURIComponent(term)}" target="_blank" rel="noreferrer">Search web</a>`;
        content.appendChild(errorDiv);
      }

      // Retry link
      const retry = document.createElement('div');
      retry.className = 'dict-link';
      retry.innerHTML = `<a href="#" title="Try fetching again">Retry</a>`;
      retry.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        content.textContent = 'Retrying...';
        showDefinition(rawTerm, x, y); // re-open (simpler than partial update)
      });
      content.appendChild(retry);

      // Full search link
      const more = document.createElement('div');
      more.className = 'dict-link';
      more.innerHTML = `<a href="https://www.google.com/search?q=define+${encodeURIComponent(term)}" target="_blank" rel="noreferrer">Full search</a>`;
      content.appendChild(more);
    });
  }

  // Event: selection finished
  document.addEventListener('mouseup', (e) => {
    setTimeout(() => {
      const selObj = window.getSelection();
      const selection = selObj.toString().trim();
      if (selection && selection !== lastSelection) {
        lastSelection = selection;
        let x = e.pageX;
        let y = e.pageY;
        try {
          const range = selObj.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          x = rect.right + window.scrollX;
          y = rect.top + window.scrollY;
        } catch (err) {
          // ignore, fallback to mouse coords
        }
        createBadge(x, y, selection);
      } else if (!selection) {
        removeBadge();
        removeTooltip();
      }
    }, 10);
  });

  // Close tooltip when clicking outside
  document.addEventListener('mousedown', (e) => {
    if (tooltip && !tooltip.contains(e.target) && badge && !badge.contains(e.target)) {
      removeTooltip();
    }
  });

  // Escape closes everything
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      removeBadge();
      removeTooltip();
    }
  });
})();// ==UserScript==
// @name         Quick Dictionary Lookup (Debug & Robust)
// @namespace    https://example.com/
// @version      0.4
// @description  Highlight a word/phrase and click the popup to see its definition, with detailed error reporting, retry, and fallback.
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  let badge = null;
  let tooltip = null;
  let lastSelection = '';

  GM_addStyle(`
    .dict-badge {
      position: absolute;
      background: #1f5aff;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      z-index: 999999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      user-select: none;
    }
    .dict-tooltip {
      position: absolute;
      background: white;
      color: #222;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      max-width: 360px;
      font-size: 13px;
      z-index: 999999;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      line-height: 1.3;
      font-family: system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
    }
    .dict-term {
      font-weight: bold;
      margin-bottom: 6px;
      display: block;
    }
    .dict-error {
      color: #b33;
      font-style: italic;
    }
    .dict-close {
      position: absolute;
      top: 4px;
      right: 6px;
      cursor: pointer;
      font-weight: bold;
    }
    .dict-link {
      margin-top: 6px;
      display: inline-block;
      font-size: 12px;
    }
    .dict-meta {
      margin-top: 4px;
      font-size: 11px;
      color: #555;
    }
  `);

  function normalizeTerm(raw) {
    if (!raw) return '';
    let t = raw.trim().replace(/\s+/g, ' ');
    t = t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
    return t.toLowerCase();
  }

  function removeBadge() {
    if (badge) {
      badge.remove();
      badge = null;
    }
  }

  function removeTooltip() {
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
  }

  async function fetchDefinition(term) {
    try {
      const resp = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`, {
        cache: 'no-store',
      });
      const text = await resp.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn('Dictionary API: JSON parse failure for term:', term, 'raw:', text);
        return { found: false, error: new Error('Invalid JSON'), rawText: text, status: resp.status };
      }
      console.debug('Dictionary API response for', term, data);
      if (!resp.ok || !Array.isArray(data) || !data[0].meanings) {
        return { found: false, raw: data, status: resp.status };
      }
      return { found: true, data, status: resp.status };
    } catch (err) {
      console.warn('Dictionary API fetch error for term:', term, err);
      return { found: false, error: err };
    }
  }

  function createBadge(x, y, rawText) {
    removeBadge();
    removeTooltip();
    badge = document.createElement('div');
    badge.className = 'dict-badge';
    badge.textContent = '📘 Dictionary';
    document.body.appendChild(badge);
    const offsetX = 4;
    const offsetY = 4;
    badge.style.left = `${Math.min(x + offsetX, window.scrollX + window.innerWidth - 140)}px`;
    badge.style.top = `${Math.max(y + offsetY, window.scrollY + 4)}px`;

    badge.addEventListener('click', () => {
      showDefinition(rawText, parseInt(badge.style.left, 10), parseInt(badge.style.top, 10) + badge.offsetHeight + 4);
    });
  }

  function showDefinition(rawTerm, x, y) {
    const term = normalizeTerm(rawTerm) || rawTerm;
    removeTooltip();
    tooltip = document.createElement('div');
    tooltip.className = 'dict-tooltip';
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;

    const closeBtn = document.createElement('span');
    closeBtn.className = 'dict-close';
    closeBtn.textContent = '×';
    closeBtn.title = 'Close';
    closeBtn.onclick = () => removeTooltip();
    tooltip.appendChild(closeBtn);

    const title = document.createElement('div');
    title.className = 'dict-term';
    title.textContent = term;
    tooltip.appendChild(title);

    const content = document.createElement('div');
    content.textContent = 'Loading...';
    tooltip.appendChild(content);

    document.body.appendChild(tooltip);

    fetchDefinition(term).then((result) => {
      content.innerHTML = '';

      if (result.found) {
        const meanings = result.data[0].meanings.slice(0, 2);
        meanings.forEach((meaning) => {
          const part = document.createElement('div');
          part.style.marginBottom = '6px';
          const partTitle = document.createElement('div');
          partTitle.textContent = meaning.partOfSpeech;
          partTitle.style.fontStyle = 'italic';
          part.appendChild(partTitle);
          meaning.definitions.slice(0, 2).forEach((def) => {
            const d = document.createElement('div');
            d.textContent = `• ${def.definition}`;
            part.appendChild(d);
          });
          content.appendChild(part);
        });
      } else {
        let msg = 'Definition not found.';
        if (result.status) msg += ` (HTTP ${result.status})`;
        if (result.raw && result.raw.title) {
          msg += ` — ${result.raw.title}`;
        } else if (result.error) {
          msg += ` — ${result.error.message || 'Network/other error'}`;
        }
        const errorDiv = document.createElement('div');
        errorDiv.className = 'dict-error';
        errorDiv.innerHTML = `${msg} <br><a href="https://www.google.com/search?q=define+${encodeURIComponent(term)}" target="_blank" rel="noreferrer">Search web</a>`;
        content.appendChild(errorDiv);
      }

      const meta = document.createElement('div');
      meta.className = 'dict-meta';
      const parts = [];
      if (result.status !== undefined) parts.push(`Status: ${result.status}`);
      if (result.error) parts.push(`Error: ${result.error.message}`);
      if (parts.length) meta.textContent = parts.join(' | ');
      if (parts.length) content.appendChild(meta);

      const retry = document.createElement('div');
      retry.className = 'dict-link';
      retry.innerHTML = `<a href="#" title="Retry lookup">Retry</a>`;
      retry.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        content.textContent = 'Retrying...';
        showDefinition(rawTerm, x, y);
      });
      content.appendChild(retry);

      const more = document.createElement('div');
      more.className = 'dict-link';
      more.innerHTML = `<a href="https://www.google.com/search?q=define+${encodeURIComponent(term)}" target="_blank" rel="noreferrer">Full search</a>`;
      content.appendChild(more);
    });
  }

  document.addEventListener('mouseup', (e) => {
    setTimeout(() => {
      const selObj = window.getSelection();
      const selection = selObj.toString().trim();
      if (selection && selection !== lastSelection) {
        lastSelection = selection;
        let x = e.pageX;
        let y = e.pageY;
        try {
          const range = selObj.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          x = rect.right + window.scrollX;
          y = rect.top + window.scrollY;
        } catch (_) {}
        createBadge(x, y, selection);
      } else if (!selection) {
        removeBadge();
        removeTooltip();
      }
    }, 10);
  });

  document.addEventListener('mousedown', (e) => {
    if (tooltip && !tooltip.contains(e.target) && badge && !badge.contains(e.target)) {
      removeTooltip();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      removeBadge();
      removeTooltip();
    }
  });
})();