// ==UserScript==
// @name         WME UR Notes
// @namespace    https://greasyfork.org/en/users/820296-txagbq
// @version      20250803.4
// @description  Adds simple notes to WME Update Requests (URs)
// @author       TxAgBQ
// @match        https://www.waze.com/*editor*
// @match        https://beta.waze.com/editor/*
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544567/WME%20UR%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/544567/WME%20UR%20Notes.meta.js
// ==/UserScript==

(function() {
  const NOTE_ICON_EMPTY = '📝';
  const NOTE_ICON_FILLED = '🟨';

  function getURId() {
    const span = document.querySelector('#panel-container > div > wz-card > div > span > div > div.sub-title-and-actions > span');
    if (!span) return null;
    const match = span.textContent.trim().match(/\((\d+)\)/);
    return match ? match[1] : null;
  }

  function loadNote(urId) {
    return localStorage.getItem('wmeUrNote_' + urId) || '';
  }

  function saveNote(urId, note) {
    if (note) {
      localStorage.setItem('wmeUrNote_' + urId, note);
    } else {
      localStorage.removeItem('wmeUrNote_' + urId);
    }
  }

  function createNotePopup(initialNote, onSave) {
    const existing = document.getElementById('ur-note-popup');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ur-note-popup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = 0; overlay.style.left = 0; overlay.style.right = 0; overlay.style.bottom = 0;
    overlay.style.backgroundColor = 'rgba(0,0,0,0.15)';
    overlay.style.zIndex = 10000;

    const popup = document.createElement('div');
    popup.id = 'ur-note-popup';
    popup.style.background = '#FFFF99';
    popup.style.padding = '12px';
    popup.style.borderRadius = '8px';
    popup.style.minWidth = '320px';
    popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    popup.style.position = 'fixed';
    popup.style.top = '100px';
    popup.style.right = '500px';
    popup.style.zIndex = 10001;
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';

    const textarea = document.createElement('textarea');
    textarea.style.width = '100%';
    textarea.style.height = '140px';
    textarea.style.resize = 'vertical';
    textarea.value = initialNote;
    textarea.placeholder = 'Enter your note here...';
    textarea.style.fontSize = '14px';

    const btnContainer = document.createElement('div');
    btnContainer.style.marginTop = '8px';
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'flex-end';
    btnContainer.style.gap = '8px';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.style.padding = '6px 12px';
    saveBtn.style.cursor = 'pointer';
    saveBtn.addEventListener('click', () => {
      onSave(textarea.value.trim());
      document.body.removeChild(overlay);
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.padding = '6px 12px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(saveBtn);

    popup.appendChild(textarea);
    popup.appendChild(btnContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    textarea.focus();
  }

  function injectNoteButton() {
    const buttonsContainer = document.querySelector('#panel-container > div > wz-card > div > span > div > div.sub-title-and-actions > div');
    if (!buttonsContainer) return;

    if (buttonsContainer.querySelector('.ur-note-button')) return;

    const urId = getURId();
    if (!urId) {
      console.log('No UR ID found. Cannot inject note button.');
      return;
    }

    const note = loadNote(urId);

    const btn = document.createElement('button');
    btn.className = 'ur-note-button';
    btn.style.border = 'none';
    btn.style.background = 'transparent';
    btn.style.cursor = 'pointer';
    btn.style.margin = '0 0 0 6px';
    btn.style.padding = '2px 6px';
    btn.style.position = 'relative';
    btn.style.top = '-4px';
    btn.style.verticalAlign = 'middle';
    btn.title = note ? note : 'No note saved';
    btn.textContent = note ? NOTE_ICON_FILLED : NOTE_ICON_EMPTY;

    btn.addEventListener('click', () => {
      const freshNote = loadNote(urId);
      createNotePopup(freshNote, (newNote) => {
        saveNote(urId, newNote);
        btn.title = newNote ? newNote : 'No note saved';
        btn.textContent = newNote ? NOTE_ICON_FILLED : NOTE_ICON_EMPTY;
      });
    });

    buttonsContainer.appendChild(btn);
    console.log('UR note button injected for UR ID:', urId);
  }

  const panelContainer = document.getElementById('panel-container');
  if (!panelContainer) {
    console.log('Panel container not found.');
    return;
  }
  const observer = new MutationObserver(() => {
    injectNoteButton();
  });
  observer.observe(panelContainer, { childList: true, subtree: true });

  injectNoteButton();
})();
