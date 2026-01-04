// ==UserScript==
// @name         OMC Translator
// @namespace    https://github.com/yuyuuuuuuuuuuuu/omc-translations
// @version      1.1.0
// @description  Load translations for Online Math Contest. / OMCの翻訳を表示します。
// @author       yuyuuuuuuuuuuuu
// @match        https://onlinemathcontest.com/*
// @grant        none
// @homepageURL  https://github.com/yuyuuuuuuuuuuuu/omc-translations
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538434/OMC%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/538434/OMC%20Translator.meta.js
// ==/UserScript==
;(function() {
  'use strict'

  const GITHUB_USER = 'yuyuuuuuuuuuuuu'
  const REPO_NAME   = 'omc-translations'
  const BRANCH      = 'main'

  const LANG_KEY = 'omcLang'
  let LANGUAGES = []
  let MESSAGES = {}

  async function loadLanguageConfig() {
    const urlConfig = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/${BRANCH}/languages/config.json`;
    const urlLabel  = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/${BRANCH}/languages/label.json`;
    try {
      const [confRes, labelRes] = await Promise.all([
        fetch(urlConfig), fetch(urlLabel)
      ]);
      const conf   = await confRes.json();   // { languages: ["en", ...] }
      const labels = await labelRes.json();  // { en: "English 🇺🇸", ja: "日本語 🇯🇵 original", ... }

      // 日本語を最初に、以降翻訳対象を順に
      LANGUAGES = [{ code: 'ja', label: labels['ja'] || '日本語' }];
      for (const code of conf.languages) {
        if (code !== 'ja') {
          LANGUAGES.push({ code, label: labels[code] || code });
        }
      }
    } catch (e) {
      console.error('Language config の読み込みに失敗:', e);
      // フォールバック: 日本語と英語のみ
      LANGUAGES = [
        { code: 'ja', label: '日本語' },
        { code: 'en', label: 'English 🇺🇸' }
      ];
    }
  }

  async function loadMessages() {
    if (getLang() === 'ja') return;
    const urlMsg = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/${BRANCH}` +
                   `/languages/${getLang()}/static/messages.json`;
    try {
      MESSAGES = await fetch(urlMsg).then(r => r.json());
    } catch (e) {
      console.warn('messages.json の読み込みに失敗:', e);
      MESSAGES = {};
    }
  }

  function getLang() {
    const v = localStorage.getItem(LANG_KEY);
    return LANGUAGES.some(l => l.code === v) ? v : 'ja';
  }
  function setLang(code) {
    localStorage.setItem(LANG_KEY, code);
  }

  function addLangDropdown() {
    const ul = document.querySelector('.navbar-nav.mr-auto');
    if (!ul) return;
    const current = getLang();
    const li = document.createElement('li');
    li.className = 'nav-item dropdown';
    li.style.marginLeft = '10px';

    const toggle = document.createElement('a');
    toggle.className = 'nav-link dropdown-toggle';
    toggle.href = '#';
    toggle.id = 'omcLangDropdown';
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('data-toggle', 'dropdown');
    toggle.textContent = `Language: ${LANGUAGES.find(l => l.code === current).label}`;

    const menu = document.createElement('div');
    menu.className = 'dropdown-menu';
    menu.setAttribute('aria-labelledby', 'omcLangDropdown');

    LANGUAGES.forEach(l => {
      const a = document.createElement('a');
      a.className = 'dropdown-item';
      a.href = '#';
      a.textContent = l.label;
      if (l.code === current) a.style.fontWeight = 'bold';
      a.addEventListener('click', e => {
        e.preventDefault();
        setLang(l.code);
        location.reload();
      });
      menu.appendChild(a);
    });

    li.appendChild(toggle);
    li.appendChild(menu);
    ul.appendChild(li);
  }

  async function translateStaticUI() {
    if (getLang() === 'ja') return;
    const base = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/${BRANCH}` +
                 `/languages/${getLang()}/static`;
    let config;
    try {
      config = await fetch(`${base}/config.json`).then(r => r.json());
    } catch (e) {
      console.error('config.json の取得に失敗:', e);
      return;
    }

    const path = location.pathname;
    const entries = config.filter(c =>
      c.paths.some(p => new RegExp(`^${p}$`).test(path))
    );
    if (!entries.length) return;

    const dictNames = [...new Set(entries.flatMap(e => e.dictionaries))];
    const dict = {};
    for (const name of dictNames) {
      try {
        const d = await fetch(`${base}/${name}.json`).then(r => r.json());
        Object.assign(dict, d);
      } catch (e) {
        console.warn(`辞書 ${name}.json の読み込みに失敗:`, e);
      }
    }

    const walker = document.createTreeWalker(
      document.body, NodeFilter.SHOW_TEXT, null, false
    );
    let node;
    while (node = walker.nextNode()) {
      // ——— 動的コンテンツ (#problem_content, #editorial_content) は除外 ———
      if (node.parentElement.closest('#problem_content, #editorial_content')) {
        continue;
      }

      let text = node.nodeValue;
      if (!text.trim()) continue;
      text = text.replace(/[\u00A0\u3000]/g, ' ');
      let replaced = text;
      for (const [ja, en] of Object.entries(dict)) {
        const key = ja.replace(/[\u00A0\u3000]/g, ' ');
        if (key && replaced.includes(key)) {
          replaced = replaced.split(key).join(en);
        }
      }
      if (replaced !== text) {
        node.nodeValue = replaced;
      }
    }
  }

  function parseUserEditorial() {
    const m = location.pathname.match(
      /^\/contests\/([^\/]+)\/editorial\/(\d+)\/(\d+)(?:\/|$)/
    );
    return m ? { contestId: m[1], taskId: m[2], userId: m[3] } : null;
  }

  function rawUrl(type, contestId, id) {
    return `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/${BRANCH}` +
           `/languages/${getLang()}/contests/${contestId}/${type}/${id}.html`;
  }

  function appendMessage(container, text, color) {
    const p = document.createElement('p');
    p.textContent = text;
    p.style.color = color;
    p.style.marginTop = '1em';
    container.appendChild(p);
  }

  function replaceTasks() {
    const m = location.pathname.match(
      /^\/contests\/([^\/]+)\/tasks\/(\d+)(?:\/$|$)/
    );
    if (!m || getLang() === 'ja') return;
    const c = document.getElementById('problem_content');
    fetch(rawUrl('tasks', m[1], m[2]))
      .then(r => { if (!r.ok) throw 0; return r.text(); })
      .then(html => {
        if (!c) return;
        c.innerHTML = html;
        // 注意書きを追加
        if (MESSAGES.tasks) {
          appendMessage(c, MESSAGES.tasks, 'blue');
        }
      })
      .catch(() => {
        if (c && MESSAGES.tasks_not_done) {
          appendMessage(c, MESSAGES.tasks_not_done, 'orange');
        }
      });
  }

  function replaceEditorial() {
    const m = location.pathname.match(
      /^\/contests\/([^\/]+)\/editorial\/(\d+)(?:\/$|$)/
    );
    if (!m || getLang() === 'ja' || parseUserEditorial()) return;
    const c = document.getElementById('editorial_content');
    fetch(rawUrl('editorial', m[1], m[2]))
      .then(r => { if (!r.ok) throw 0; return r.text(); })
      .then(html => {
        if (!c) return;
        c.innerHTML = html;
        // 注意書きを追加
        if (MESSAGES.editorials) {
          appendMessage(c, MESSAGES.editorials, 'blue');
        }
      })
      .catch(() => {
        if (c && MESSAGES.editorial_not_done) {
          appendMessage(c, MESSAGES.editorial_not_done, 'orange');
        }
      });
  }

  function replaceUserEditorial() {
    const info = parseUserEditorial();
    if (!info || getLang() === 'ja') return;
    const c = document.getElementById('editorial_content');
    fetch(rawUrl('user_editorial', info.contestId, info.userId))
      .then(r => { if (!r.ok) throw 0; return r.text(); })
      .then(html => {
        if (!c) return;
        c.innerHTML = html;
        if (MESSAGES.user_editorial) {
          appendMessage(c, MESSAGES.user_editorial, 'blue');
        }
      })
      .catch(() => {
        if (c && MESSAGES.user_editorial_not_done) {
          appendMessage(c, MESSAGES.user_editorial_not_done, 'orange');
        }
      });
  }

  async function main() {
    await loadLanguageConfig();
    addLangDropdown();
    await loadMessages();
    await translateStaticUI();
    replaceTasks();
    replaceUserEditorial();
    replaceEditorial();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }

})();