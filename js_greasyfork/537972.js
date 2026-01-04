// ==UserScript==
// @name         GitHub Enhancer (Ultra Edition)
// @namespace    https://github.com/TamperMonkeyDevelopment/TamperMonkeyScripts
// @version      3.0
// @description  GitHub UI enhancer w/ drag menu, fast downloads, dark mode override, and more. Author: Eliminater74 | MIT License
// @author       Eliminater74
// @license      MIT
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @homepage     https://github.com/TamperMonkeyDevelopment/TamperMonkeyScripts
// @supportURL   https://github.com/TamperMonkeyDevelopment/TamperMonkeyScripts/issues
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537972/GitHub%20Enhancer%20%28Ultra%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537972/GitHub%20Enhancer%20%28Ultra%20Edition%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const defaultSettings = {
    highlightStalePRs: true,
    autoExpandDiffs: true,
    addFileSizeLabels: true,
    autoFocusSearch: true,
    showFastDownload: true,
    showFloatingMenu: true,
    themeMode: 'auto',
    pinnedRepos: []
  };

  const settingsKey = 'githubEnhancerSettings';
  const settings = JSON.parse(localStorage.getItem(settingsKey)) || defaultSettings;
  const saveSettings = () => localStorage.setItem(settingsKey, JSON.stringify(settings));
  const getCurrentRepo = () => location.pathname.split('/').slice(1, 3).join('/');

  const debounce = (fn, delay = 300) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  const highlightStalePRs = () => {
    document.querySelectorAll('relative-time').forEach(el => {
      const daysOld = (Date.now() - new Date(el.dateTime)) / (1000 * 60 * 60 * 24);
      if (daysOld > 7) {
        el.style.color = 'red';
        el.style.fontWeight = 'bold';
      }
    });
  };

  const expandDiffs = () => {
    document.querySelectorAll('button').forEach(btn => {
      const txt = btn.innerText.toLowerCase();
      if (txt.includes('load diff') || txt.includes('show')) btn.click();
    });
  };

  const collapseDiffs = () => {
    document.querySelectorAll('button[aria-label="Collapse file"]').forEach(btn => btn.click());
  };

  const showFileSizes = () => {
    document.querySelectorAll('a.js-navigation-open').forEach(el => {
      const row = el.closest('tr');
      const sizeEl = row?.querySelector('td:last-child');
      if (sizeEl && sizeEl.innerText.match(/[0-9.]+ (KB|MB)/) && !el.querySelector('.gh-size')) {
        const tag = document.createElement('span');
        tag.className = 'gh-size';
        tag.style.marginLeft = '6px';
        tag.style.fontSize = 'smaller';
        tag.style.color = '#888';
        tag.textContent = `(${sizeEl.innerText.trim()})`;
        el.appendChild(tag);
      }
    });
  };

  const autoFocusSearch = () => {
    const input = document.querySelector('input.header-search-input');
    if (input) input.focus();
  };

  const addFastDownloadButtons = () => {
    document.querySelectorAll('a.js-navigation-open').forEach(el => {
      const href = el.getAttribute('href');
      if (href?.includes('/blob/') && !el.parentNode.querySelector('.gh-download-link')) {
        const rawURL = 'https://raw.githubusercontent.com' + href.replace('/blob', '');
        const dl = document.createElement('a');
        dl.href = rawURL;
        dl.textContent = ' ⬇';
        dl.download = '';
        dl.className = 'gh-download-link';
        dl.style.marginLeft = '5px';
        el.parentNode.appendChild(dl);
      }
    });
  };

  const applyDarkMode = () => {
    const theme = settings.themeMode;
    if (theme === 'auto') return;
    document.documentElement.setAttribute('data-color-mode', theme);
    document.documentElement.setAttribute('data-dark-theme', 'dark');
    document.documentElement.setAttribute('data-light-theme', 'light');
  };

  const pinCurrentRepo = () => {
    const repo = getCurrentRepo();
    if (repo && !settings.pinnedRepos.includes(repo)) {
      settings.pinnedRepos.push(repo);
      saveSettings();
      updatePinnedList();
    }
  };

  const updatePinnedList = () => {
    const list = document.getElementById('gh-pinned-list');
    if (!list) return;
    list.innerHTML = '';
    settings.pinnedRepos.forEach(repo => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `https://github.com/${repo}`;
      a.textContent = repo;
      a.target = '_blank';
      const del = document.createElement('button');
      del.textContent = '❌';
      del.style.marginLeft = '6px';
      del.onclick = () => {
        settings.pinnedRepos = settings.pinnedRepos.filter(r => r !== repo);
        saveSettings();
        updatePinnedList();
      };
      li.appendChild(a);
      li.appendChild(del);
      list.appendChild(li);
    });
  };

  const createFloatingMenu = () => {
    const gear = document.createElement('div');
    gear.innerHTML = '⚙️';
    Object.assign(gear.style, {
      position: 'fixed', bottom: '20px', right: '20px',
      fontSize: '22px', zIndex: '9999', cursor: 'pointer', userSelect: 'none'
    });

    const panel = document.createElement('div');
    panel.id = 'gh-enhancer-panel';
    panel.style.cssText = `
      position: fixed; bottom: 60px; right: 20px;
      z-index: 9999; background: #222; color: #fff;
      padding: 12px; border-radius: 10px; font-size: 14px;
      display: none; box-shadow: 0 0 12px rgba(0,0,0,0.6);
      transition: all 0.3s ease;
    `;

    const checkbox = (label, key) => {
      const row = document.createElement('div');
      row.innerHTML = `<label><input type="checkbox" ${settings[key] ? 'checked' : ''}/> ${label}</label>`;
      row.querySelector('input').addEventListener('change', e => {
        settings[key] = e.target.checked;
        saveSettings();
      });
      return row;
    };

    panel.appendChild(checkbox('Highlight stale PRs', 'highlightStalePRs'));
    panel.appendChild(checkbox('Auto-expand diffs', 'autoExpandDiffs'));
    panel.appendChild(checkbox('Show file sizes', 'addFileSizeLabels'));
    panel.appendChild(checkbox('Auto-focus search', 'autoFocusSearch'));
    panel.appendChild(checkbox('Fast downloads', 'showFastDownload'));

    const themeSelect = document.createElement('select');
    ['auto', 'dark', 'light'].forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t.charAt(0).toUpperCase() + t.slice(1);
      themeSelect.appendChild(opt);
    });
    themeSelect.value = settings.themeMode;
    themeSelect.onchange = () => {
      settings.themeMode = themeSelect.value;
      saveSettings();
      applyDarkMode();
    };

    panel.appendChild(document.createElement('hr'));
    panel.appendChild(document.createTextNode('Theme:'));
    panel.appendChild(themeSelect);
    panel.appendChild(document.createElement('hr'));

    const pinBtn = document.createElement('button');
    pinBtn.textContent = '📌 Pin This Repo';
    pinBtn.onclick = pinCurrentRepo;
    panel.appendChild(pinBtn);

    const pinnedList = document.createElement('ul');
    pinnedList.id = 'gh-pinned-list';
    panel.appendChild(pinnedList);

    document.body.appendChild(gear);
    document.body.appendChild(panel);

    gear.onclick = () => panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
    updatePinnedList();
  };

  const runEnhancements = () => {
    applyDarkMode();
    if (settings.highlightStalePRs) highlightStalePRs();
    if (settings.autoExpandDiffs) expandDiffs();
    if (settings.addFileSizeLabels) showFileSizes();
    if (settings.autoFocusSearch) autoFocusSearch();
    if (settings.showFastDownload) addFastDownloadButtons();
  };

  const observer = new MutationObserver(debounce(runEnhancements));
  observer.observe(document.body, { childList: true, subtree: true });

  runEnhancements();
  if (settings.showFloatingMenu) createFloatingMenu();

  document.addEventListener('keydown', e => {
    if (e.altKey && e.key === 'g') document.getElementById('gh-enhancer-panel')?.click();
    if (e.altKey && e.key === 'e') expandDiffs();
    if (e.altKey && e.key === 'c') collapseDiffs();
  });
})();
