// ==UserScript==
// @name         TesterTV_Translit
// @namespace    https://greasyfork.org/ru/scripts/479202-testertv-translit-beta
// @version      2025.08.31
// @license      GNU GPLv3 or later
// @description  Convert Latin text to Russian (custom mapping) with quick clipboard copy.
// @author       TesterTV
// @match        *://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/479202/TesterTV_Translit.user.js
// @updateURL https://update.greasyfork.org/scripts/479202/TesterTV_Translit.meta.js
// ==/UserScript==

(() => {
  // Do not run in iframes/embeds
  if (window.self !== window.top) return;

  // --------- CSS ---------
  const css = `
    #ttv-translit-wrap {
      position: fixed;
      top: 60px;
      right: 10px;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, Helvetica, sans-serif;
    }
    #ttv-translit-btn {
      background: none;
      border: none;
      font-size: 22px;
      cursor: pointer;
      line-height: 1;
      padding: 4px 6px;
      filter: drop-shadow(0 1px 1px rgba(0,0,0,.3));
    }
    #ttv-translit-panel {
      display: none;
      margin-top: 6px;
      background: #303236;
      border: 1px solid #666;
      border-radius: 6px;
      padding: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,.4);
      width: 400px;
    }
    #ttv-translit-textarea {
      width: 100%;
      height: 320px;
      box-sizing: border-box;
      background: #1f2023;
      color: #fff;
      border: 1px solid #555;
      border-radius: 4px;
      font-size: 16px;
      line-height: 1.4;
      outline: none;
      padding: 8px;
      resize: vertical;
    }
    #ttv-translit-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 6px;
      color: #aaa;
      font-size: 12px;
      user-select: none;
    }
    #ttv-translit-copyhint {
      opacity: .85;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.documentElement.appendChild(style);

  // --------- UI ---------
  const wrap = document.createElement('div');
  wrap.id = 'ttv-translit-wrap';

  const btn = document.createElement('button');
  btn.id = 'ttv-translit-btn';
  btn.title = 'Open translit (click). Paste Latin, get Cyrillic. Click outside to copy.';
  btn.textContent = '🇹';

  const panel = document.createElement('div');
  panel.id = 'ttv-translit-panel';

  const ta = document.createElement('textarea');
  ta.id = 'ttv-translit-textarea';
  ta.placeholder = 'Enter text here...';

  const meta = document.createElement('div');
  meta.id = 'ttv-translit-meta';

  const len = document.createElement('div');
  len.id = 'ttv-translit-length';
  len.textContent = 'length: 0';

  const hint = document.createElement('div');
  hint.id = 'ttv-translit-copyhint';
  hint.textContent = 'Click outside or press Esc to copy & close';

  meta.appendChild(len);
  meta.appendChild(hint);
  panel.appendChild(ta);
  panel.appendChild(meta);
  wrap.appendChild(btn);
  wrap.appendChild(panel);
  document.body.appendChild(wrap);

  // Prevent clicks inside from closing
  wrap.addEventListener('click', (e) => e.stopPropagation());

  // --------- Clipboard ---------
  function copyToClipboard(txt) {
    if (!txt || !txt.trim()) return;
    try { if (typeof GM_setClipboard === 'function') GM_setClipboard(txt); } catch {}
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(txt).catch(() => {});
    }
  }

  // --------- Transliteration ---------
  // Base Latin→Cyrillic mapping (from your arrays, simplified)
  const baseMap = {
    a:'а', b:'б', c:'ц', d:'д', e:'е', f:'ф', g:'г', h:'х', i:'и', j:'й',
    k:'к', l:'л', m:'м', n:'н', o:'о', p:'п', q:'я', r:'р', s:'с', t:'т',
    u:'у', v:'в', w:'щ', x:'х', y:'ы', z:'з'
  };
  const reLatin = /[a-z]/gi;

  const hasUpper = (s) => s !== s.toLowerCase();

  // Case-aware helper
  const ca = (s, lowerChar) => hasUpper(s) ? lowerChar.toUpperCase() : lowerChar;

  // Multi-letter rules (applied after basic mapping)
  const pairMap = { 'зх':'ж', 'цх':'ч', 'сх':'ш', 'шх':'щ' };
  const seqRules = [
    // Order matters: longer tokens first
    { re: /##/g, fn: () => 'Ъ' },
    { re: /#/g,  fn: () => 'ъ' },
    { re: /''/g, fn: () => 'Ь' },
    { re: /'/g,  fn: () => 'ь' },

    { re: /(й|ы)о/gi, fn: (m) => ca(m, 'ё') },
    { re: /ö/gi,      fn: (m) => ca(m, 'ё') },

    { re: /йе/gi,     fn: (m) => ca(m, 'э') },
    { re: /ä/gi,      fn: (m) => ca(m, 'э') },

    { re: /(й|ы)у/gi, fn: (m) => ca(m, 'ю') },
    { re: /ü/gi,      fn: (m) => ca(m, 'ю') },

    { re: /(й|ы)а/gi, fn: (m) => ca(m, 'я') },

    { re: /č/gi,      fn: (m) => ca(m, 'ч') },
    { re: /ž/gi,      fn: (m) => ca(m, 'ж') },
    { re: /š/gi,      fn: (m) => ca(m, 'ш') },

    { re: /твз/gi,    fn: (m) => ca(m, 'ъ') },
    { re: /мйз/gi,    fn: (m) => ca(m, 'ь') }
  ];

  // Build pair rules for zh/ch/sh/shh patterns (зх/цх/сх/шх after basic map)
  for (const [inp, out] of Object.entries(pairMap)) {
    seqRules.push({
      re: new RegExp(inp, 'gi'),
      fn: (m) => ca(m, out)
    });
  }

  // Final custom fix (keep last to avoid undoing earlier rules)
  seqRules.push({
    re: /шод/gi,
    fn: (m) => ca(m, 'сход')
  });

  function translit(text) {
    if (!text) return '';
    // 1) Basic single-letter transliteration
    text = text.replace(reLatin, (ch) => {
      const lower = ch.toLowerCase();
      const mapped = baseMap[lower];
      if (!mapped) return ch;
      return ch === ch.toUpperCase() ? mapped.toUpperCase() : mapped;
    });

    // 2) Multi-letter, diacritics, special tokens
    for (const rule of seqRules) {
      text = text.replace(rule.re, rule.fn);
    }
    return text;
  }

  // --------- Behavior ---------
  function openPanel() {
    panel.style.display = 'block';
    ta.focus();
  }
  function closePanel(copy = true) {
    if (panel.style.display === 'none') return;
    if (copy && ta.value.trim()) copyToClipboard(ta.value);
    ta.value = '';
    len.textContent = 'length: 0';
    panel.style.display = 'none';
  }
  function togglePanel() {
    if (panel.style.display === 'none' || !panel.style.display) openPanel();
    else closePanel(false);
  }

  btn.addEventListener('click', togglePanel);
  // If you prefer the original mouseover open behavior, replace the above with:
  // btn.addEventListener('mouseover', openPanel);

  document.addEventListener('click', () => closePanel(true));
  document.addEventListener('keydown', (e) => {
    if (panel.style.display !== 'none' && e.key === 'Escape') {
      e.preventDefault();
      closePanel(true);
    }
  });

  ta.addEventListener('input', () => {
    const caretEnd = ta.selectionEnd; // optional: we can keep caret, but simple approach recalculates whole text
    const beforeLen = ta.value.length;
    ta.value = translit(ta.value);
    len.textContent = 'length: ' + ta.value.length;
    // Optional caret restore (best effort):
    const afterLen = ta.value.length;
    const delta = afterLen - beforeLen;
    try {
      ta.selectionStart = ta.selectionEnd = Math.max(0, caretEnd + delta);
    } catch {}
  });

  // Do not close when clicking inside the panel
  panel.addEventListener('click', (e) => e.stopPropagation());
})();