// ==UserScript==
// @name         YouTube audio compressor
// @namespace    https://vivelin.net/
// @version      0.4
// @description  Adds an audio compressor option to YouTube videos.
// @author       Vivelin
// @match        https://*.youtube.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517296/YouTube%20audio%20compressor.user.js
// @updateURL https://update.greasyfork.org/scripts/517296/YouTube%20audio%20compressor.meta.js
// ==/UserScript==

let _vivelin__audioContext = null;
let _vivelin__source = null;
let _vivelin_compressor = null;
let _vivelin_compressorMenuItem = null;

function createCompressorMenuItem() {
  const menuItem = document.createElement('div');
  menuItem.className = 'ytp-menuitem';
  menuItem.setAttribute('role', 'menuitemcheckbox');
  menuItem.setAttribute('aria-checked', window._isCompressorActive || false);
  menuItem.tabIndex = 0;

  const icon = document.createElement('div');
  icon.className = 'ytp-menuitem-icon';
  menuItem.appendChild(icon);

  const label = document.createElement('div');
  label.className = 'ytp-menuitem-label';
  label.textContent = 'Compressor';
  menuItem.appendChild(label);

  const content = document.createElement('div');
  content.className = 'ytp-menuitem-content';
  const toggleCheckbox = document.createElement('div');
  toggleCheckbox.className = 'ytp-menuitem-toggle-checkbox';
  content.appendChild(toggleCheckbox);
  menuItem.appendChild(content);
  console.log(menuItem);
  return menuItem;
}

function setupCompressor(player, ytpPanelMenu) {
  if (!_vivelin__audioContext) {
    _vivelin__audioContext = new AudioContext();
  }
  if (!_vivelin__source) {
    _vivelin__source = _vivelin__audioContext.createMediaElementSource(player);
    _vivelin__source.connect(_vivelin__audioContext.destination);
  }
  if (!_vivelin_compressor) {
    _vivelin_compressor = _vivelin__audioContext.createDynamicsCompressor();
    _vivelin_compressor.threshold.setValueAtTime(-50, _vivelin__audioContext.currentTime);
    _vivelin_compressor.knee.setValueAtTime(40, _vivelin__audioContext.currentTime);
    _vivelin_compressor.ratio.setValueAtTime(12, _vivelin__audioContext.currentTime);
    _vivelin_compressor.attack.setValueAtTime(0, _vivelin__audioContext.currentTime);
    _vivelin_compressor.release.setValueAtTime(0.25, _vivelin__audioContext.currentTime);
  }

  if (!_vivelin_compressorMenuItem) {
    _vivelin_compressorMenuItem = createCompressorMenuItem();
    ytpPanelMenu.appendChild(_vivelin_compressorMenuItem);
    _vivelin_compressorMenuItem.onclick = function () {
      const isActive = _vivelin_compressorMenuItem.getAttribute('aria-checked');
      if (isActive === 'false') {
        window._isCompressorActive = true;
        _vivelin_compressorMenuItem.setAttribute('aria-checked', 'true');
        _vivelin__source.disconnect(_vivelin__audioContext.destination);
        _vivelin__source.connect(_vivelin_compressor);
        _vivelin_compressor.connect(_vivelin__audioContext.destination);
      }
      else {
        window._isCompressorActive = false;
        _vivelin_compressorMenuItem.setAttribute('aria-checked', 'false');
        _vivelin__source.disconnect(_vivelin_compressor);
        _vivelin_compressor.disconnect(_vivelin__audioContext.destination);
        _vivelin__source.connect(_vivelin__audioContext.destination);
      }
    };
  }
}

function startSetup() {
  const player = document.querySelector('#ytd-player video');
  const ytpPanelMenu = document.querySelector('#ytd-player .ytp-settings-menu .ytp-panel-menu');
  if (player && ytpPanelMenu) {
    setupCompressor(player, ytpPanelMenu);
    console.info('Compressor option added', window._isCompressorActive);
    return true;
  }

  return false;
}

function trySetup() {
  console.debug('Polling for player...');
  const intervalId = window.setInterval(function () {
    if (startSetup()) {
      window.clearInterval(intervalId);
    }
  }, 100);

  const cancelId = window.setTimeout(function () {
    window.clearInterval(intervalId);
  }, 10000);
}

if (!startSetup()) {
  trySetup();

  window.addEventListener('yt-navigate-finish', function () {
    trySetup();
  });
}