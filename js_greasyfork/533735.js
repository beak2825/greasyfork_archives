// ==UserScript==
// @name         Florr.io Rebinds
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Customizable key rebinding interface for Florr.io
// @author       VortexPrime
// @match        https://florr.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=florr.io
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533735/Florrio%20Rebinds.user.js
// @updateURL https://update.greasyfork.org/scripts/533735/Florrio%20Rebinds.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    const keybinds = {
      '0': null,
      '1': null,
      '2': null,
      '3': null,
      '4': null,
      '5': null,
      '6': null,
      '7': null,
      '8': null,
      '9': null,
      'R': null,
      'L': null,
      'K': null,
      'M': null
    };

    const bindableKeys = new Set(Object.keys(keybinds));
    const reverseKeybinds = {};
    const keyState = {};

    function updateReverseMapping() {
      Object.keys(reverseKeybinds).forEach(key => delete reverseKeybinds[key]);

      Object.keys(keybinds).forEach(target => {
        const bind = keybinds[target];
        if (bind) {
          reverseKeybinds[bind.toUpperCase()] = target;
        }
      });
    }

    updateReverseMapping();

    const keyDisplayMap = {
      'ESCAPE': 'ESC',
      'BACKSPACE': 'BSP',
      'DELETE': 'DEL',
      'INSERT': 'INS',
      'PAGEUP': 'PUP',
      'PAGEDOWN': 'PDN',
      'ARROWUP': 'UP',
      'ARROWDOWN': 'DWN',
      'ARROWLEFT': 'LFT',
      'ARROWRIGHT': 'RGT',
      'SPACE': 'SPC',
      'CONTROL': 'CTL',
      'SHIFT': 'SHF',
      'ENTER': 'ENT',
      'TAB': 'TAB'
    };

    const keyCodeMap = {
      '0': 'Digit0',
      '1': 'Digit1',
      '2': 'Digit2',
      '3': 'Digit3',
      '4': 'Digit4',
      '5': 'Digit5',
      '6': 'Digit6',
      '7': 'Digit7',
      '8': 'Digit8',
      '9': 'Digit9',
      'A': 'KeyA',
      'B': 'KeyB',
      'C': 'KeyC',
      'D': 'KeyD',
      'E': 'KeyE',
      'F': 'KeyF',
      'G': 'KeyG',
      'H': 'KeyH',
      'I': 'KeyI',
      'J': 'KeyJ',
      'K': 'KeyK',
      'L': 'KeyL',
      'M': 'KeyM',
      'N': 'KeyN',
      'O': 'KeyO',
      'P': 'KeyP',
      'Q': 'KeyQ',
      'R': 'KeyR',
      'S': 'KeyS',
      'T': 'KeyT',
      'U': 'KeyU',
      'V': 'KeyV',
      'W': 'KeyW',
      'X': 'KeyX',
      'Y': 'KeyY',
      'Z': 'KeyZ',
      'SPACE': 'Space',
      'SHIFT': 'ShiftLeft',
      'CONTROL': 'ControlLeft',
      'TAB': 'Tab'
    };

    const groupDescriptions = {
      loadout: 'Loadout Slots',
      utility: {
        'R': 'Swap all loadouts',
        'L': 'Load saved builds',
        'K': 'Load saved builds',
        'M': 'Toggle expanded minimap'
      }
    };

    const style = document.createElement('style');
    style.textContent = `
      .florrBinds-modal {
        position: absolute;
        top: 50px;
        left: 50px;
        width: 280px;
        background-color: #374151;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        border: 1px solid #4B5563;
        font-family: Arial, sans-serif;
        color: #E5E7EB;
        z-index: 10000;
        overflow: hidden;
        user-select: none;
      }

      .florrBinds-modal.hidden {
        display: none;
      }

      .florrBinds-header {
        background-color: #1F2937;
        padding: 10px 16px;
        border-bottom: 1px solid #4B5563;
        cursor: move;
        display: flex;
        justify-content: space-between;
      }

      .florrBinds-header-left, .florrBinds-header-right {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .florrBinds-header-right {
        align-items: flex-end;
        text-align: right;
      }

      .florrBinds-title {
        color: #FBBF24;
        font-weight: bold;
        font-size: 18px;
        margin: 0;
        padding: 0;
        line-height: 1.2;
      }

      .florrBinds-subtitle {
        color: #9CA3AF;
        font-size: 12px;
        margin: 0;
      }

      .florrBinds-author {
        color: #9CA3AF;
        font-size: 11px;
        margin-top: 2px;
      }

      .florrBinds-author a {
        color: #93C5FD;
        text-decoration: none;
      }

      .florrBinds-author a:hover {
        text-decoration: underline;
      }

      .florrBinds-drag-hint {
        color: #6B7280;
        font-size: 11px;
        margin-bottom: 2px;
      }

      .florrBinds-content {
        padding: 8px;
        overflow: hidden;
      }

      .florrBinds-modal.collapsed .florrBinds-content,
      .florrBinds-modal.collapsed .florrBinds-footer {
        display: none;
      }

      .florrBinds-group {
        margin-bottom: 8px;
      }

      .florrBinds-group-title {
        color: #9CA3AF;
        font-size: 14px;
        margin-bottom: 4px;
        padding-bottom: 4px;
        border-bottom: 1px solid #4B5563;
      }

      .florrBinds-loadout-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
      }

      .florrBinds-key-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 6px;
      }

      .florrBinds-key-label {
        color: #D1D5DB;
        font-size: 14px;
        margin-bottom: 4px;
      }

      .florrBinds-key-value {
        background-color: #1F2937;
        color: #FFF;
        padding: 4px 12px;
        border-radius: 4px;
        border: 1px solid #4B5563;
        font-family: monospace;
        font-size: 14px;
        cursor: pointer;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
        transition: transform 0.2s ease;
      }

      .florrBinds-key-value:hover {
        transform: translateY(-2px);
      }

      .florrBinds-key-value.unbound {
        background-color: #111827;
        color: #9CA3AF;
        border-color: #4B5563;
      }

      .florrBinds-utility {
        display: none;
      }

      .florrBinds-utility.show {
        display: block;
      }

      .florrBinds-utility-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }

      .florrBinds-utility-info {
        display: flex;
        align-items: center;
        min-width: 0;
        flex: 1;
      }

      .florrBinds-utility-key {
        color: #D1D5DB;
        font-size: 14px;
        margin-right: 8px;
        flex-shrink: 0;
      }

      .florrBinds-utility-desc {
        color: #9CA3AF;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .florrBinds-key-value-container {
        flex-shrink: 0;
        width: 60px;
        text-align: right;
      }

      .florrBinds-utility .florrBinds-key-value {
        width: 100%;
        box-sizing: border-box;
        text-align: center;
      }

      .florrBinds-toggle {
        width: 100%;
        text-align: center;
        color: #60A5FA;
        background: none;
        border: none;
        padding: 4px;
        margin-bottom: 6px;
        font-size: 14px;
        cursor: pointer;
      }

      .florrBinds-toggle:hover {
        color: #93C5FD;
      }

      .florrBinds-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        border-top: 1px solid #4B5563;
      }

      .florrBinds-reset {
        background-color: #2563EB;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 12px;
        cursor: pointer;
      }

      .florrBinds-reset:hover {
        background-color: #3B82F6;
      }

      .florrBinds-hint {
        color: #9CA3AF;
        font-size: 12px;
      }

      .florrBinds-resize {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 12px;
        height: 12px;
        cursor: ew-resize;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .florrBinds-resize-icon {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 0 8px 8px;
        border-color: transparent transparent rgba(200, 200, 200, 0.4) transparent;
      }

      .florrBinds-status {
        position: absolute;
        bottom: 8px;
        left: 8px;
        padding: 4px 8px;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .florrBinds-status.show {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.className = 'florrBinds-modal';

    const header = document.createElement('div');
    header.className = 'florrBinds-header';

    const headerLeft = document.createElement('div');
    headerLeft.className = 'florrBinds-header-left';

    const title = document.createElement('h3');
    title.className = 'florrBinds-title';
    title.textContent = 'Florr.io Binds';

    const subtitle = document.createElement('p');
    subtitle.className = 'florrBinds-subtitle';
    subtitle.textContent = 'Rebind specific keys!';

    headerLeft.appendChild(title);
    headerLeft.appendChild(subtitle);

    const headerRight = document.createElement('div');
    headerRight.className = 'florrBinds-header-right';

    const dragHint = document.createElement('div');
    dragHint.className = 'florrBinds-drag-hint';
    dragHint.textContent = '(Drag to move)';

    const author = document.createElement('div');
    author.className = 'florrBinds-author';
    author.innerHTML = 'by <a href="https://ashish.top" target="_blank">VortexPrime</a>';

    headerRight.appendChild(dragHint);
    headerRight.appendChild(author);

    header.appendChild(headerLeft);
    header.appendChild(headerRight);
    modal.appendChild(header);

    const content = document.createElement('div');
    content.className = 'florrBinds-content';

    const loadoutGroup = document.createElement('div');
    loadoutGroup.className = 'florrBinds-group';

    const loadoutTitle = document.createElement('h4');
    loadoutTitle.className = 'florrBinds-group-title';
    loadoutTitle.textContent = groupDescriptions.loadout;
    loadoutGroup.appendChild(loadoutTitle);

    const loadoutGrid = document.createElement('div');
    loadoutGrid.className = 'florrBinds-loadout-grid';

    for (let i = 0; i <= 9; i++) {
      const key = i.toString();
      const keyItem = document.createElement('div');
      keyItem.className = 'florrBinds-key-item';

      const keyLabel = document.createElement('span');
      keyLabel.className = 'florrBinds-key-label';
      keyLabel.textContent = key;

      const keyValue = document.createElement('div');
      keyValue.className = `florrBinds-key-value ${keybinds[key] ? '' : 'unbound'}`;
      keyValue.textContent = keybinds[key] ? formatKeyDisplay(keybinds[key]) : '-';
      keyValue.dataset.key = key;

      keyItem.appendChild(keyLabel);
      keyItem.appendChild(keyValue);
      loadoutGrid.appendChild(keyItem);
    }

    loadoutGroup.appendChild(loadoutGrid);
    content.appendChild(loadoutGroup);

    const utilityGroup = document.createElement('div');
    utilityGroup.className = 'florrBinds-group florrBinds-utility';

    const utilityTitle = document.createElement('h4');
    utilityTitle.className = 'florrBinds-group-title';
    utilityTitle.textContent = 'Utility Keys';
    utilityGroup.appendChild(utilityTitle);

    const utilityKeys = ['R', 'L', 'K', 'M'];
    for (const key of utilityKeys) {
      const utilityItem = document.createElement('div');
      utilityItem.className = 'florrBinds-utility-item';

      const utilityInfo = document.createElement('div');
      utilityInfo.className = 'florrBinds-utility-info';

      const utilityKey = document.createElement('span');
      utilityKey.className = 'florrBinds-utility-key';
      utilityKey.textContent = key;

      const utilityDesc = document.createElement('span');
      utilityDesc.className = 'florrBinds-utility-desc';
      utilityDesc.textContent = groupDescriptions.utility[key];

      utilityInfo.appendChild(utilityKey);
      utilityInfo.appendChild(utilityDesc);

      const keyValueContainer = document.createElement('div');
      keyValueContainer.className = 'florrBinds-key-value-container';

      const keyValue = document.createElement('div');
      keyValue.className = `florrBinds-key-value ${keybinds[key] ? '' : 'unbound'}`;
      keyValue.textContent = keybinds[key] ? formatKeyDisplay(keybinds[key]) : '-';
      keyValue.dataset.key = key;

      keyValueContainer.appendChild(keyValue);

      utilityItem.appendChild(utilityInfo);
      utilityItem.appendChild(keyValueContainer);
      utilityGroup.appendChild(utilityItem);
    }

    content.appendChild(utilityGroup);

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'florrBinds-toggle';
    toggleBtn.textContent = 'Show More »';
    content.appendChild(toggleBtn);

    const footer = document.createElement('div');
    footer.className = 'florrBinds-footer';

    const resetBtn = document.createElement('button');
    resetBtn.className = 'florrBinds-reset';
    resetBtn.textContent = 'Reset All';

    const hint = document.createElement('div');
    hint.className = 'florrBinds-hint';
    hint.textContent = 'Toggle using Right Shift';

    footer.appendChild(resetBtn);
    footer.appendChild(hint);

    modal.appendChild(content);
    modal.appendChild(footer);

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'florrBinds-resize';

    const resizeIcon = document.createElement('div');
    resizeIcon.className = 'florrBinds-resize-icon';

    resizeHandle.appendChild(resizeIcon);
    modal.appendChild(resizeHandle);

    const statusNotification = document.createElement('div');
    statusNotification.className = 'florrBinds-status';
    document.body.appendChild(statusNotification);

    document.body.appendChild(modal);

    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    let isResizing = false;
    let originalWidth = 280;
    let originalMouseX = 0;

    let isRebinding = false;
    let rebindElement = null;

    function formatKeyDisplay(key) {
      if (!key) return '-';
      const upperKey = key.toUpperCase();
      return keyDisplayMap[upperKey] || (upperKey.length > 3 ? upperKey.substring(0, 3) : upperKey);
    }

    function showStatus(message, duration = 2000) {
      statusNotification.textContent = message;
      statusNotification.classList.add('show');
      setTimeout(() => {
        statusNotification.classList.remove('show');
      }, duration);
    }

    function simulateKeyEvent(type, key, code) {
      const event = new KeyboardEvent(type, {
        key: key,
        code: code,
        keyCode: key.charCodeAt(0),
        which: key.charCodeAt(0),
        bubbles: true,
        cancelable: true
      });

      document.dispatchEvent(event);
    }

    function getCodeForKey(key) {
      if (key >= '0' && key <= '9') {
        return `Digit${key}`;
      }
      return keyCodeMap[key.toUpperCase()] || `Key${key.toUpperCase()}`;
    }

    toggleBtn.addEventListener('click', () => {
      const utilitySection = document.querySelector('.florrBinds-utility');
      utilitySection.classList.toggle('show');
      toggleBtn.textContent = utilitySection.classList.contains('show') ? '« Show Less' : 'Show More »';
    });

    header.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      modal.classList.toggle('collapsed');
      return false;
    });

    header.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        isDragging = true;
        dragOffsetX = e.clientX - modal.offsetLeft;
        dragOffsetY = e.clientY - modal.offsetTop;
        e.preventDefault();
      }
    });

    resizeHandle.addEventListener('mousedown', (e) => {
      isResizing = true;
      originalWidth = modal.offsetWidth;
      originalMouseX = e.clientX;
      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        modal.style.left = (e.clientX - dragOffsetX) + 'px';
        modal.style.top = (e.clientY - dragOffsetY) + 'px';
      } else if (isResizing) {
        const width = originalWidth + (e.clientX - originalMouseX);

        if (width >= 240) {
          modal.style.width = width + 'px';
        }
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      isResizing = false;
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Shift' && e.location === 2) {
        modal.classList.toggle('hidden');
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (isRebinding) return;

      const pressedKey = e.key.toUpperCase();

      if (reverseKeybinds[pressedKey]) {
        const targetKey = reverseKeybinds[pressedKey];

        if (!keyState[pressedKey]) {
          keyState[pressedKey] = true;

          const targetCode = getCodeForKey(targetKey);
          simulateKeyEvent('keydown', targetKey, targetCode);
        }
      }
    }, true);

    document.addEventListener('keyup', (e) => {
      if (isRebinding) return;

      const releasedKey = e.key.toUpperCase();

      if (reverseKeybinds[releasedKey]) {
        const targetKey = reverseKeybinds[releasedKey];

        if (keyState[releasedKey]) {
          keyState[releasedKey] = false;

          const targetCode = getCodeForKey(targetKey);
          simulateKeyEvent('keyup', targetKey, targetCode);
        }
      }
    }, true);

    const keyElements = document.querySelectorAll('.florrBinds-key-value');
    keyElements.forEach(element => {
      element.addEventListener('click', () => {
        if (isRebinding) {
          rebindElement.style.boxShadow = '';
          isRebinding = false;
        }

        keyElements.forEach(el => el.style.boxShadow = '');
        element.style.boxShadow = '0 0 0 2px #60A5FA';

        isRebinding = true;
        rebindElement = element;

        showStatus(`Press any key to bind to ${element.dataset.key}. ESC/BACKSPACE to unbind.`);

        const captureKey = (e) => {
          e.preventDefault();
          e.stopPropagation();

          const key = e.key.toUpperCase();
          const targetKey = element.dataset.key;

          let conflictKey = null;
          for (const k in keybinds) {
            if (keybinds[k] && keybinds[k].toUpperCase() === key) {
              conflictKey = k;
              break;
            }
          }

          if (conflictKey && conflictKey !== targetKey) {
            showStatus(`Warning: "${key}" was already bound to ${conflictKey}. Binding swapped.`, 3000);

            const conflictElement = document.querySelector(`.florrBinds-key-value[data-key="${conflictKey}"]`);
            if (conflictElement) {
              conflictElement.textContent = '-';
              conflictElement.classList.add('unbound');
              keybinds[conflictKey] = null;
            }
          }

          if (key === 'ESCAPE' || key === 'BACKSPACE') {
            element.textContent = '-';
            element.classList.add('unbound');
            keybinds[targetKey] = null;
            showStatus(`Removed binding for ${targetKey}`);
          } else {
            element.textContent = formatKeyDisplay(key);
            element.classList.remove('unbound');
            keybinds[targetKey] = key;
            showStatus(`Bound ${targetKey} to ${key}`);
          }

          updateReverseMapping();

          element.style.boxShadow = '';
          isRebinding = false;
          rebindElement = null;

          document.removeEventListener('keydown', captureKey);
        };

        document.addEventListener('keydown', captureKey);
      });
    });

    resetBtn.addEventListener('click', () => {
      for (const key in keybinds) {
        keybinds[key] = null;

        const element = document.querySelector(`.florrBinds-key-value[data-key="${key}"]`);
        if (element) {
          element.textContent = '-';
          element.classList.add('unbound');
        }
      }

      keybinds['0'] = 'V';
      keybinds['1'] = 'B';
      keybinds['2'] = 'F';
      keybinds['3'] = 'G';
      keybinds['4'] = 'E';
      keybinds['9'] = 'P';
      keybinds['K'] = 'X';

      for (const key in keybinds) {
        if (keybinds[key]) {
          const element = document.querySelector(`.florrBinds-key-value[data-key="${key}"]`);
          if (element) {
            element.textContent = formatKeyDisplay(keybinds[key]);
            element.classList.remove('unbound');
          }
        }
      }

      updateReverseMapping();

      Object.keys(keyState).forEach(key => delete keyState[key]);

      showStatus('All keybinds reset to default');
    });

    updateReverseMapping();

    modal.classList.add('hidden');
    showStatus('Keybinds loaded! Press Right Shift to toggle the modal.', 3000);
  });
})();