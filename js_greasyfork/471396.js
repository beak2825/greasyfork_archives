// ==UserScript==
// @name         CopySelect
// @namespace    your-namespace
// @version      1.0
// @description  Allows for interactionless copying of text in the browser to the clipboard, storage of clipboard history, and other features to come when I get time. This product is provided as-is with no warranty and is licensed under Commons Clause License Condition v1.0 and is not authorized for commercial use unless given express permission by author.
// @license      Commons Clause v1.0
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/471396/CopySelect.user.js
// @updateURL https://update.greasyfork.org/scripts/471396/CopySelect.meta.js
// ==/UserScript==

//todo: extract desired text from element automatically upon opening hpn/rxeffect link, create care note automatically based on inputs, add visual customization, better implementation of clipboard history

var copyToggleHotkey = GM_getValue('copyToggleHotkey', 'NumpadSubtract');
var clipboardHistoryHotkey = GM_getValue('clipboardHistoryHotkey', 'NumpadAdd');
var isCopyEnabled = true;
var numpadKeys = [
 'Numpad0',
 'Numpad1',
 'Numpad2',
 'Numpad3',
 'Numpad4',
 'Numpad5',
 'Numpad6',
 'Numpad7',
 'Numpad8',
 'Numpad9',
 'NumpadAdd',
 'NumpadSubtract',
 'NumpadMultiply',
 'NumpadDivide',
 'NumpadDecimal',
 'NumpadEnter'
];

var clipboardHistoryEnabled = GM_getValue('clipboardHistoryEnabled', true);
var clipboardHistoryMaxItems = GM_getValue('clipboardHistoryMaxItems', 5);
var clipboardHistory = GM_getValue('clipboardHistory', []);

GM_registerMenuCommand('Copy Toggle Settings', openSettingsMenu);

document.addEventListener('keydown', function(e) {
 var eventKey = e.code || e.key;
 if (eventKey === copyToggleHotkey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
   e.preventDefault();
   isCopyEnabled = !isCopyEnabled;
   showNotification('Copy Toggle: ' + (isCopyEnabled ? 'ON' : 'OFF'));
 } else if (eventKey === clipboardHistoryHotkey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
   e.preventDefault();
   toggleClipboardHistory();
 }
});

document.addEventListener('mouseup', function(e) {
 if (e.button != 0) return;
 if (isCopyEnabled) {
   var selectedText = getSelection().toString();
   if (selectedText) {
     document.execCommand('copy');
     showNotification('Copied: ' + selectedText);
     if (clipboardHistoryEnabled) {
       addToClipboardHistory(selectedText);
     }
       // Unselect the text
      window.getSelection().removeAllRanges();
   }
 }
}, false);

function showNotification(text) {
 var notification = document.createElement('div');
 notification.textContent = text;
 notification.style.position = 'fixed';
 notification.style.top = '20px';
 notification.style.right = '20px';
 notification.style.padding = '10px';
 notification.style.background = isCopyEnabled ? '#4CAF50' : '#FF0000';
 notification.style.color = '#fff';
 notification.style.border = '1px solid #ccc';
 notification.style.borderRadius = '4px';
 notification.style.zIndex = '9999';

 document.body.appendChild(notification);

 setTimeout(function() {
   notification.remove();
 }, 2000);
}

function openSettingsMenu() {
 var settingsMenu = document.createElement('div');
 settingsMenu.innerHTML = `
<div id="copyToggleSettings" style="position: fixed; top: 20px; right: 20px; padding: 10px; background: #fff; border: 1px solid #ccc; border-radius: 4px;">
<h3>Copy Toggle Settings</h3>
<label for="copyToggleHotkeyInput">Copy Toggle Hotkey:</label>
<select id="copyToggleHotkeyInput"></select>
<br>
<label for="clipboardHistoryHotkeyInput">Clipboard History Hotkey:</label>
<select id="clipboardHistoryHotkeyInput"></select>
<br>
<label for="clipboardHistoryEnabledInput">Enable Clipboard History:</label>
<input type="checkbox" id="clipboardHistoryEnabledInput" />
<br>
<label for="clipboardHistoryMaxItemsInput">Max Clipboard History Items:</label>
<input type="number" id="clipboardHistoryMaxItemsInput" min="1" step="1" />
<br>
<button id="saveSettingsButton">Save</button>
</div>
 `;

 document.body.appendChild(settingsMenu);

 var copyToggleHotkeyInput = document.getElementById('copyToggleHotkeyInput');
 var clipboardHistoryHotkeyInput = document.getElementById('clipboardHistoryHotkeyInput');
 var clipboardHistoryEnabledInput = document.getElementById('clipboardHistoryEnabledInput');
 var clipboardHistoryMaxItemsInput = document.getElementById('clipboardHistoryMaxItemsInput');
 var saveSettingsButton = document.getElementById('saveSettingsButton');

 var keys = numpadKeys.concat([
   'Backquote',
   'Digit1',
   'Digit2',
   'Digit3',
   'Digit4',
   'Digit5',
   'Digit6',
   'Digit7',
   'Digit8',
   'Digit9',
   'Digit0',
   'Minus',
   'Equal',
   'KeyQ',
   'KeyW',
   'KeyE',
   'KeyR',
   'KeyT',
   'KeyY',
   'KeyU',
   'KeyI',
   'KeyO',
   'KeyP',
   'BracketLeft',
   'BracketRight',
   'Backslash',
   'KeyA',
   'KeyS',
   'KeyD',
   'KeyF',
   'KeyG',
   'KeyH',
   'KeyJ',
   'KeyK',
   'KeyL',
   'Semicolon',
   'Quote',
   'KeyZ',
   'KeyX',
   'KeyC',
   'KeyV',
   'KeyB',
   'KeyN',
   'KeyM',
   'Comma',
   'Period',
   'Slash',
   'Space',
   'Escape',
   'Enter',
   'Backspace',
   'Tab',
   'CapsLock',
   'ShiftLeft',
   'ShiftRight',
   'ControlLeft',
   'ControlRight',
   'AltLeft',
   'AltRight',
   'MetaLeft',
   'MetaRight',
   'ContextMenu',
   'ArrowUp',
   'ArrowDown',
   'ArrowLeft',
   'ArrowRight',
   'PageUp',
   'PageDown',
   'Home',
   'End',
   'Insert',
   'Delete',
   'PrintScreen',
   'ScrollLock',
   'Pause',
   'NumLock',
   'NumpadDecimal',
   'NumpadEnter'
 ]);

 keys.forEach(function(key) {
   var option = document.createElement('option');
   option.value = key;
   option.textContent = key;
   copyToggleHotkeyInput.appendChild(option);
   clipboardHistoryHotkeyInput.appendChild(option.cloneNode(true));
 });

 copyToggleHotkeyInput.value = copyToggleHotkey;
 clipboardHistoryHotkeyInput.value = clipboardHistoryHotkey;
 clipboardHistoryEnabledInput.checked = clipboardHistoryEnabled;
 clipboardHistoryMaxItemsInput.value = clipboardHistoryMaxItems;

 saveSettingsButton.addEventListener('click', function() {
   copyToggleHotkey = copyToggleHotkeyInput.value.trim();
   clipboardHistoryHotkey = clipboardHistoryHotkeyInput.value.trim();
   clipboardHistoryEnabled = clipboardHistoryEnabledInput.checked;
   clipboardHistoryMaxItems = parseInt(clipboardHistoryMaxItemsInput.value.trim(), 10);

   GM_setValue('copyToggleHotkey', copyToggleHotkey);
   GM_setValue('clipboardHistoryHotkey', clipboardHistoryHotkey);
   GM_setValue('clipboardHistoryEnabled', clipboardHistoryEnabled);
   GM_setValue('clipboardHistoryMaxItems', clipboardHistoryMaxItems);

   settingsMenu.remove();
   showNotification('Settings saved successfully!');
 });
}

function addToClipboardHistory(text) {
 clipboardHistory.unshift({ text: text, timestamp: new Date().toLocaleTimeString() });
 if (clipboardHistory.length > clipboardHistoryMaxItems) {
   clipboardHistory.pop();
 }
 GM_setValue('clipboardHistory', clipboardHistory);
}

function toggleClipboardHistory() {
 var clipboardHistoryWindow = document.getElementById('clipboardHistoryWindow');
 if (clipboardHistoryWindow) {
   clipboardHistoryWindow.remove();
 } else {
   clipboardHistoryWindow = createClipboardHistoryWindow();
   document.body.appendChild(clipboardHistoryWindow);
 }
}

function createClipboardHistoryWindow() {
 var clipboardHistoryWindow = document.createElement('div');
clipboardHistoryWindow.id = 'clipboardHistoryWindow';
 clipboardHistoryWindow.style.position = 'fixed';
 clipboardHistoryWindow.style.top = '20px';
 clipboardHistoryWindow.style.right = '20px';
 clipboardHistoryWindow.style.padding = '10px';
 clipboardHistoryWindow.style.maxWidth = '1000px';
 clipboardHistoryWindow.style.background = '#fff';
 clipboardHistoryWindow.style.border = '1px solid #ccc';
 clipboardHistoryWindow.style.borderRadius = '4px';
 clipboardHistoryWindow.style.zIndex = '9999';

 var header = document.createElement('h3');
 header.textContent = 'Clipboard History';
 clipboardHistoryWindow.appendChild(header);

 var historyList = document.createElement('ol');
 historyList.style.listStyleType = 'decimal';
 historyList.style.wordWrap = 'break-word';

 for (var i = 0; i < clipboardHistory.length; i++) {
   var item = document.createElement('li');
   item.textContent = clipboardHistory[i].text + ' (' + clipboardHistory[i].timestamp + ')';
   historyList.appendChild(item);
 }

 clipboardHistoryWindow.appendChild(historyList);

 return clipboardHistoryWindow;
}
