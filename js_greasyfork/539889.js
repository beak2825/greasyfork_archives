// ==UserScript==
// @name         A2ZAPK Enhanced Quick Downloader
// @namespace    https://github.com/Eliminater74/userscripts
// @version      2.0
// @description  Bypass ads, auto-download, and fight adblock/overlay on a2zapk.com / a2zapk.io with smart toggleable UI
// @author       Eliminater74
// @license      MIT
// @match        https://a2zapk.com/1*
// @match        https://a2zapk.com/dload/*
// @match        https://a2zapk.io/1*
// @match        https://a2zapk.io/dload/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539889/A2ZAPK%20Enhanced%20Quick%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/539889/A2ZAPK%20Enhanced%20Quick%20Downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SETTINGS_KEY = 'a2zapk_settings';

  const defaultSettings = {
    autoRedirect: true,
    autoDownload: true,
    removeOverlay: true,
    fakeAds: true
  };

  const settings = Object.assign({}, defaultSettings, JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'));

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  // Fake ad element
  function insertFakeAd() {
    if (!settings.fakeAds) return;
    const adDiv = document.createElement('div');
    adDiv.className = 'adsbygoogle';
    adDiv.style.cssText = 'width:1px;height:1px;position:absolute;left:-9999px;';
    document.body.appendChild(adDiv);
  }

  // Remove adblock overlay/banner
  function removeAdblockOverlay() {
    if (!settings.removeOverlay) return;
    const banners = [...document.querySelectorAll('div')]
      .filter(div => div.innerText?.includes('Adblock Detected') || div.innerText?.includes('Whitelist'));

    banners.forEach(el => el.remove());
    document.body.style.overflow = 'auto';
  }

  // Auto-click #apkdl
  function clickApkDl() {
    const btn = document.querySelector('#apkdl');
    if (btn) btn.click();
  }

  // Monitor and auto-click #dll when ready
  function monitorDownloadReady() {
    const interval = setInterval(() => {
      const link = document.querySelector('#dll');
      if (link && link.innerText !== 'Loading..') {
        if (settings.autoDownload) window.location.href = link.href;
        clearInterval(interval);
      }
    }, 300);
  }

  // Redirect 1xxxx page to dload page
  function autoRedirect() {
    const href = window.location.href;
    if (!settings.autoRedirect) return;
    if (href.includes('/1') && !href.includes('/dload/')) {
      const slug = href.split('-')[0].split('/1')[1];
      if (slug) {
        window.location.href = `https://a2zapk.io/dload/1${slug}/`;
      }
    }
  }

  // Create floating UI
  function createFloatingMenu() {
    const style = document.createElement('style');
    style.textContent = `
      #a2zMenu {
        position: fixed;
        top: 50px;
        right: 20px;
        background: #222;
        color: #fff;
        padding: 10px;
        border-radius: 8px;
        z-index: 99999;
        font-family: sans-serif;
        font-size: 13px;
        box-shadow: 0 0 5px rgba(0,0,0,0.5);
        display: none;
      }
      #a2zGear {
        position: fixed;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        background: #444;
        color: #fff;
        text-align: center;
        line-height: 30px;
        border-radius: 50%;
        font-size: 16px;
        cursor: move;
        z-index: 99999;
        user-select: none;
      }
      #a2zMenu input[type="checkbox"] {
        transform: scale(1.2);
        margin-right: 5px;
      }
    `;
    document.head.appendChild(style);

    const gear = document.createElement('div');
    gear.id = 'a2zGear';
    gear.textContent = '⚙️';
    document.body.appendChild(gear);

    const menu = document.createElement('div');
    menu.id = 'a2zMenu';
    menu.innerHTML = `
      <label><input type="checkbox" id="redirectToggle"> Auto-Redirect</label><br>
      <label><input type="checkbox" id="downloadToggle"> Auto-Download</label><br>
      <label><input type="checkbox" id="overlayToggle"> Remove Overlays</label><br>
      <label><input type="checkbox" id="adsToggle"> Fake Ad Elements</label><br>
    `;
    document.body.appendChild(menu);

    gear.addEventListener('click', () => {
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    // Make gear draggable
    gear.onmousedown = function (e) {
      const offsetX = e.clientX - gear.getBoundingClientRect().left;
      const offsetY = e.clientY - gear.getBoundingClientRect().top;

      function moveAt(pageX, pageY) {
        gear.style.left = `${pageX - offsetX}px`;
        gear.style.top = `${pageY - offsetY}px`;
      }

      function onMouseMove(e) {
        moveAt(e.pageX, e.pageY);
      }

      document.addEventListener('mousemove', onMouseMove);

      gear.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        gear.onmouseup = null;
      };
    };

    // Sync checkboxes
    const syncCheckbox = (id, key) => {
      const box = document.getElementById(id);
      box.checked = settings[key];
      box.addEventListener('change', () => {
        settings[key] = box.checked;
        saveSettings();
      });
    };

    syncCheckbox('redirectToggle', 'autoRedirect');
    syncCheckbox('downloadToggle', 'autoDownload');
    syncCheckbox('overlayToggle', 'removeOverlay');
    syncCheckbox('adsToggle', 'fakeAds');
  }

  // Run logic
  function main() {
    createFloatingMenu();
    insertFakeAd();
    removeAdblockOverlay();
    autoRedirect();

    if (window.location.href.includes('/dload/')) {
      if (window.location.href.endsWith('/file/')) {
        monitorDownloadReady();
      } else {
        clickApkDl();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
