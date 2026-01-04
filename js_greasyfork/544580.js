// ==UserScript==
// @name        entity input
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0.1
// @author      sectorae, a.k.a. elecke
// @description Allows usage of HTML entities in regular input. Used via C+M+e.
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/544580/entity%20input.user.js
// @updateURL https://update.greasyfork.org/scripts/544580/entity%20input.meta.js
// ==/UserScript==

(() => {
  const asReadOnlySet = (arr) => new Set(arr);
  var KeyName;
  ((KeyName2) => {
    KeyName2['Enter'] = 'Enter';
    KeyName2['Escape'] = 'Escape';
  })(KeyName ||= {});
  const CONFIG = {
    activation : {ctrlKey : true, altKey : true, shiftKey : false, metaKey : false, key : 'e'},
    commitKeys : asReadOnlySet([ 'Enter' /* Enter */ ]),
    cancelKeys : asReadOnlySet([ 'Escape' /* Escape */ ]),
    ui : {
      enabled : true,
      okColor : '#72dec2',
      badColor : '#49988f',
      bg : '#000',
      fg : '#fff',
      font : '12px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu',
      monoFont : '12px ui-monospace, Monaspace Krypton, SFMono-Regular, SF Mono, Menlo, Consolas, monospace',
      z : 2147483647
    }
  };
  const VALID_ENTITY_RE = /^(&(?:#[0-9]+|#x[0-9A-Fa-f]+|[A-Za-z][A-Za-z0-9]*);)$/;
  const normalizeEntity = (raw) => {
    const trimmed = raw.trim();
    const prefix = trimmed.startsWith('&') ? '' : '&';
    const suffix = trimmed.endsWith(';') ? '' : ';';
    return `${prefix}${trimmed}${suffix}`;
  };
  const decodeEntity = (entity) => {
    if (!VALID_ENTITY_RE.test(entity))
      return null;
    const doc = new DOMParser().parseFromString(entity, 'text/html');
    const decoded = doc.documentElement.textContent;
    return decoded === entity ? null : decoded;
  };
  const assertHtmlInput = (el) =>
    el != null && (el.tagName === 'TEXTAREA' ||
                   el.tagName === 'INPUT' &&
                     new Set([ '', 'text', 'search', 'url', 'tel', 'email', 'password', 'number' ]).has(el.type));
  const isPrintableKey = (key) => key.length === 1 || key === ' ';
  const ui = (() => {
    let root = null;
    let entitySpan = null;
    let previewSpan = null;
    const ensure = () => {
      if (root || !CONFIG.ui.enabled)
        return root;
      const host = document.createElement('div');
      const shadow = host.attachShadow({mode : 'closed'});
      root = document.createElement('div');
      entitySpan = document.createElement('span');
      previewSpan = document.createElement('span');
      root.textContent = 'Entity: ';
      root.append(entitySpan, previewSpan);
      Object.assign(root.style, {
        position : 'fixed',
        right : '12px',
        bottom : '12px',
        background : CONFIG.ui.bg,
        color : CONFIG.ui.fg,
        padding : '4px 8px',
        font : CONFIG.ui.font,
        zIndex : String(CONFIG.ui.z),
        pointerEvents : 'none',
        whiteSpace : 'pre',
        display : 'none'
      });
      entitySpan.style.font = CONFIG.ui.monoFont;
      shadow.appendChild(root);
      document.documentElement.appendChild(host);
      return root;
    };
    const show = (entityText, ok, decodedPreview) => {
      const d = ensure();
      if (!d)
        return;
      entitySpan.textContent = entityText;
      previewSpan.textContent = decodedPreview ? ` → ${decodedPreview}` : '';
      d.style.border = `1px solid ${ok ? CONFIG.ui.okColor : CONFIG.ui.badColor}`;
      d.style.display = 'block';
    };
    return {
      show,
      hide : () => root && (root.style.display = 'none'),
      destroy : () => root?.parentNode?.removeChild(root)
    };
  })();
  let armed = false;
  let buffer = '';
  let target = null;
  const isActivation = (e) => e.key.toLowerCase() === CONFIG.activation.key &&
                              e.ctrlKey === CONFIG.activation.ctrlKey && e.altKey === CONFIG.activation.altKey &&
                              e.shiftKey === CONFIG.activation.shiftKey && e.metaKey === CONFIG.activation.metaKey;
  const getActiveEditable = () => {
    const el = document.activeElement;
    return el instanceof HTMLElement && (el.isContentEditable || assertHtmlInput(el)) ? el : null;
  };
  const insertAtSelection = (el, text) => {
    if (el.isContentEditable) {
      const sel = window.getSelection();
      if (!sel?.rangeCount)
        return;
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
    if (assertHtmlInput(el)) {
      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? el.value.length;
      el.setRangeText(text, start, end, 'end');
      el.dispatchEvent(new InputEvent('input', {bubbles : true}));
    }
  };
  const reset = () => {
    armed = false;
    buffer = '';
    target = null;
    ui.hide();
  };
  const updateUI = () => {
    requestAnimationFrame(() => {
      if (!armed)
        return;
      if (!buffer)
        return ui.show('', false, '');
      const candidate = normalizeEntity(buffer);
      const decoded = decodeEntity(candidate);
      ui.show(buffer, !!decoded, decoded ?? '');
    });
  };
  const commitIfValid = () => {
    if (!armed || !buffer)
      return reset();
    const candidate = normalizeEntity(buffer);
    const decoded = decodeEntity(candidate);
    if (decoded) {
      target ? insertAtSelection(target, decoded) : navigator.clipboard.writeText(decoded).catch(console.error);
    }
    reset();
  };
  document.addEventListener('keydown', (evt) => {
    if (!armed && isActivation(evt)) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
      armed = true;
      buffer = '';
      target = getActiveEditable();
      ui.show('', false, '');
      return;
    }
    if (!armed)
      return;
    evt.stopImmediatePropagation();
    if (CONFIG.cancelKeys.has(evt.key)) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
      return reset();
    }
    if (CONFIG.commitKeys.has(evt.key)) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
      return commitIfValid();
    }
    if (evt.key === 'Backspace') {
      evt.preventDefault();
      buffer = buffer.slice(0, -1);
      return updateUI();
    }
    if (evt.ctrlKey || evt.metaKey || evt.altKey || evt.key === 'Tab') {
      evt.preventDefault();
      return;
    }
    if (isPrintableKey(evt.key)) {
      evt.preventDefault();
      buffer += evt.key;
      updateUI();
    } else {
      evt.preventDefault();
    }
  }, true);
  document.addEventListener('focusin', () => armed && (target = getActiveEditable()), true);
  window.addEventListener('pagehide', () => {
    reset();
    ui.destroy();
  });
})();