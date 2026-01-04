// ==UserScript==
// @name         Bumeran Job Filter
// @namespace    Bumeran-Job-Filter
// @version      1.8
// @description  Esconde "job cards" de la búsqueda basado en palabras clave.
// @author       masterofobzene
// @homepage     https://github.com/masterofobzene/UserScriptRepo
// @match        https://www.bumeran.com.ar/*
// @license      GNU GPLv3
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/533986/Bumeran%20Job%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/533986/Bumeran%20Job%20Filter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const KEYWORDS_KEY = 'bumeran_exclude_keywords';
  let liveDebounce, domDebounce;

  // — storage helpers —
  async function getKeywords() {
    const stored = await GM_getValue(KEYWORDS_KEY, '');
    return stored
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(Boolean);
  }
  async function saveKeywords(keywords) {
    await GM_setValue(KEYWORDS_KEY, keywords.join(','));
    console.log('[BumeranFilter] Saved keywords:', keywords);
  }

  // — filtering —
  function resetJobsDisplay() {
    document.querySelectorAll('a').forEach(a => {
      if (a.querySelector('h2')) a.style.display = '';
    });
  }
  function filterJobs(keywords) {
    resetJobsDisplay();
    if (!keywords.length) return;
    document.querySelectorAll('a')
      .forEach(link => {
        const h2 = link.querySelector('h2');
        if (!h2) return;
        const txt = h2.textContent.trim().toLowerCase();
        if (keywords.some(kw => txt.includes(kw))) {
          link.style.display = 'none';
          console.log(`[BumeranFilter] Hiding: "${txt}"`);
        }
      });
  }

  // — UI panel —
  function addUI() {
    const c = document.createElement('div');
    Object.assign(c.style, {
      position: 'fixed', bottom: '10px', left: '10px', // Move to lower left
      zIndex: 9999, background: '#fff',
      border: '1px solid #ccc', padding: '10px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    });
    c.innerHTML = `
      <label><strong>Excluir keywords:</strong></label><br>
      <input id="keywordInput" type="text"
             style="width:200px"
             placeholder="e.g. java, senior, python" />
      <small style="display:block;margin-top:4px;color:#666">
        Los filtros se aplican dinámicamente
      </small>
    `;
    document.body.appendChild(c);

    const input = c.querySelector('#keywordInput');
    input.addEventListener('input', () => {
      clearTimeout(liveDebounce);
      liveDebounce = setTimeout(async () => {
        const kws = input.value
          .split(',')
          .map(s => s.trim().toLowerCase())
          .filter(Boolean);
        await saveKeywords(kws);
        filterJobs(kws);
      }, 200);
    });
  }

  // — run once jobs have appeared —
  function jobsReady(cb) {
    if (document.querySelector('a h2')) {
      cb(); return;
    }
    const obs = new MutationObserver((m,o) => {
      if (document.querySelector('a h2')) {
        o.disconnect();
        cb();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // — catch URL changes if history API fails —
  function watchUrlChanges(onChange) {
    let last = location.href;
    setInterval(() => {
      if (location.href !== last) {
        last = location.href;
        onChange();
      }
    }, 500);
  }

  // — main init —
  (async function init() {
    console.log('[BumeranFilter] v1.8 starting…');
    addUI();

    // load + auto-apply saved filters
    const saved = await getKeywords();
    const inp = document.getElementById('keywordInput');
    if (saved.length) inp.value = saved.join(', ');
    jobsReady(() => filterJobs(saved));

    // re-apply whenever the URL changes
    watchUrlChanges(async () => {
      const kws = await getKeywords();
      jobsReady(() => filterJobs(kws));
    });

    // also watch DOM mutations (e.g. new jobs loaded dynamically)
    const mo = new MutationObserver(() => {
      clearTimeout(domDebounce);
      domDebounce = setTimeout(async () => {
        const kws = await getKeywords();
        filterJobs(kws);
      }, 300);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // menu command to clear
    GM_registerMenuCommand('Borrar todas las Exclude Keywords', async () => {
      await GM_setValue(KEYWORDS_KEY, '');
      location.reload();
    });
  })();

})();
