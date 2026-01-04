// ==UserScript==
// @name         Archive.org Enhancer
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  UI/UX tweaks for archive.org — dark mode, compact layout, sticky header, better downloads, cleaner search, sidebar toggle, and more.
// @author       Eliminater74
// @license      MIT
// @match        https://archive.org/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/538024/Archiveorg%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/538024/Archiveorg%20Enhancer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const settings = {
    darkMode: localStorage.getItem('archive_darkMode') === 'true',
    compactMode: localStorage.getItem('archive_compactMode') === 'true',
    stickyHeader: localStorage.getItem('archive_stickyHeader') === 'true',
    autoExpandDownloads: localStorage.getItem('archive_autoExpandDownloads') === 'true',
    navShortcuts: localStorage.getItem('archive_navShortcuts') === 'true',
    hideSidebar: localStorage.getItem('archive_hideSidebar') === 'true',
  };

  const saveSetting = (key, value) => {
    settings[key] = value;
    localStorage.setItem(`archive_${key}`, value);
    applySettings();
    updateMenuUI();
  };

  const toggleSetting = (key) => saveSetting(key, !settings[key]);

  const applySettings = () => {
    document.body.classList.toggle('dark-mode-enhancer', settings.darkMode);
    document.body.classList.toggle('compact-layout-enhancer', settings.compactMode);
    document.body.classList.toggle('sticky-header-enhancer', settings.stickyHeader);
    document.body.classList.toggle('hide-sidebar-enhancer', settings.hideSidebar);

    if (settings.autoExpandDownloads) expandDownloadSection();
    injectScrollButtons();
  };

  const expandDownloadSection = () => {
    const showAll = document.querySelector('.format-group-toggle');
    if (showAll && showAll.innerText.includes('Show All')) {
      showAll.click();
    }
  };

  const injectScrollButtons = () => {
    let container = document.getElementById('scrollToButtons');

    if (container) {
      container.style.display = settings.navShortcuts ? 'block' : 'none';
      return;
    }

    if (!settings.navShortcuts) return;

    container = document.createElement('div');
    container.id = 'scrollToButtons';
    container.innerHTML = `
      <button id="scrollToFilesBtn" title="Scroll to Files">📁 Files</button>
      <button id="scrollToReviewsBtn" title="Scroll to Reviews">📝 Reviews</button>
    `;
    document.body.appendChild(container);

    document.getElementById('scrollToFilesBtn').onclick = () => {
      const files = document.querySelector('.download-options, #descript, [id*=file], [id*=download]');
      if (files) files.scrollIntoView({ behavior: 'smooth' });
      else alert('Files section not found on this page.');
    };

    document.getElementById('scrollToReviewsBtn').onclick = () => {
      const reviews = document.querySelector('#reviews, .reviews, [id*=review]');
      if (reviews) reviews.scrollIntoView({ behavior: 'smooth' });
      else alert('Reviews section not found on this page.');
    };
  };

  // --- UI Panel ---
  const gear = document.createElement('div');
  gear.innerHTML = '⚙️';
  gear.title = 'Archive Enhancer Settings';
  gear.id = 'archiveEnhancerGear';
  gear.addEventListener('click', () => {
    const menu = document.getElementById('archiveEnhancerMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });
  document.body.appendChild(gear);

  const menu = document.createElement('div');
  menu.id = 'archiveEnhancerMenu';
  menu.innerHTML = `
    <label><input type="checkbox" id="darkModeToggle"> Dark Mode</label><br>
    <label><input type="checkbox" id="compactModeToggle"> Compact Layout</label><br>
    <label><input type="checkbox" id="stickyHeaderToggle"> Sticky Header</label><br>
    <label><input type="checkbox" id="autoExpandToggle"> Auto Expand Downloads</label><br>
    <label><input type="checkbox" id="navShortcutsToggle"> Scroll Buttons</label><br>
    <label><input type="checkbox" id="hideSidebarToggle"> Hide Sidebar</label>
  `;
  document.body.appendChild(menu);

  const updateMenuUI = () => {
    document.getElementById('darkModeToggle').checked = settings.darkMode;
    document.getElementById('compactModeToggle').checked = settings.compactMode;
    document.getElementById('stickyHeaderToggle').checked = settings.stickyHeader;
    document.getElementById('autoExpandToggle').checked = settings.autoExpandDownloads;
    document.getElementById('navShortcutsToggle').checked = settings.navShortcuts;
    document.getElementById('hideSidebarToggle').checked = settings.hideSidebar;
  };

  // Event Listeners
  document.getElementById('darkModeToggle').addEventListener('change', () => toggleSetting('darkMode'));
  document.getElementById('compactModeToggle').addEventListener('change', () => toggleSetting('compactMode'));
  document.getElementById('stickyHeaderToggle').addEventListener('change', () => toggleSetting('stickyHeader'));
  document.getElementById('autoExpandToggle').addEventListener('change', () => toggleSetting('autoExpandDownloads'));
  document.getElementById('navShortcutsToggle').addEventListener('change', () => toggleSetting('navShortcuts'));
  document.getElementById('hideSidebarToggle').addEventListener('change', () => toggleSetting('hideSidebar'));

  applySettings();
  updateMenuUI();

  // --- Styles ---
  GM_addStyle(`
    #archiveEnhancerGear {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #444;
      color: white;
      font-size: 18px;
      padding: 10px;
      border-radius: 50%;
      cursor: pointer;
      z-index: 10000;
      box-shadow: 0 0 5px black;
    }
    #archiveEnhancerMenu {
      display: none;
      position: fixed;
      bottom: 70px;
      right: 20px;
      background: #222;
      color: white;
      padding: 12px;
      border-radius: 10px;
      z-index: 10000;
      box-shadow: 0 0 10px black;
      font-size: 14px;
    }
    #archiveEnhancerMenu label {
      display: block;
      margin-bottom: 6px;
    }
    #scrollToButtons {
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 9999;
    }
    #scrollToButtons button {
      margin-right: 8px;
      background: #333;
      color: white;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
    }
    .dark-mode-enhancer {
      background: #121212 !important;
      color: #e0e0e0 !important;
    }
    .dark-mode-enhancer a {
      color: #80d8ff !important;
    }
    .compact-layout-enhancer * {
      font-size: 14px !important;
      line-height: 1.4 !important;
    }
    .sticky-header-enhancer header,
    .sticky-header-enhancer .site-header {
      position: sticky !important;
      top: 0 !important;
      z-index: 9999 !important;
      background-color: #222 !important;
    }
    .hide-sidebar-enhancer #nav,
    .hide-sidebar-enhancer .nav-menu {
      display: none !important;
    }
    /* Cleaner search */
    .results .C234,
    .results .C {
      padding: 6px !important;
      line-height: 1.4;
    }
  `);
})();
