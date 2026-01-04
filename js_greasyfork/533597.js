// ==UserScript==
// @name         ChatGPT Quick‑Delete (No Popup)
// @namespace    https://chatgpt.com/
// @version      2.0
// @description  Hover to reveal a grey trash‑can badge; click it to auto‑delete the conversation instantly (no confirmation popup).
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @author       Blackupfreddy
// @license CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/533597/ChatGPT%20Quick%E2%80%91Delete%20%28No%20Popup%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533597/ChatGPT%20Quick%E2%80%91Delete%20%28No%20Popup%29.meta.js
// ==/UserScript==

(() => {
  /* ─── 1.  Acquire & cache bearer token ─────────────────────── */
  async function getToken() {
    if (window.__QD_TOKEN) return window.__QD_TOKEN;   // cached

    try {
      const r = await fetch('/api/auth/session', { credentials:'include' });
      const data = await r.json();
      if (data?.accessToken) {
        window.__QD_TOKEN = data.accessToken;
        return data.accessToken;
      }
    } catch {/* fall through */}
    console.warn('[QuickDelete] Unable to fetch accessToken');
    return null;
  }

  /* ─── 2.  Direct “hide” API call ───────────────────────────── */
  async function apiHide(id) {
    const token = await getToken();
    if (!token) throw new Error('no bearer token');

    const res = await fetch(`/backend-api/conversation/${id}`, {
      method :'PATCH',
      credentials:'include',
      headers :{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      },
      body: JSON.stringify({ is_visible:false })
    });
    if (!res.ok) throw new Error(res.status);
  }

  /* ─── 3.  Inject badge into each sidebar row ───────────────── */
  const ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6
             m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>`;

  function addBadge(row) {
    if (row.querySelector('.quick-delete')) return;

    const id = row.getAttribute('href')?.match(/\/c\/([a-f0-9-]{36})/i)?.[1];
    if (!id) return;

    row.style.position = 'relative';
    const pad0 = parseFloat(getComputedStyle(row).paddingLeft) || 0;

    const badge = document.createElement('span');
    badge.className = 'quick-delete';
    badge.innerHTML = ICON;

    Object.assign(badge.style, {
      position:'absolute', left:'4px', top:'50%',
      transform:'translateY(-50%)',
      cursor:'pointer', zIndex:9,
      padding:'2px', borderRadius:'4px',
      background:'linear-gradient(135deg,var(--sidebar-surface-secondary,#4b5563),var(--sidebar-surface-tertiary,#6b7280))',
      color:'var(--token-text-primary)',
      opacity:0, transition:'opacity 120ms'
    });

    badge.addEventListener('click', async e => {
      e.preventDefault(); e.stopImmediatePropagation();
      badge.style.pointerEvents='none';

      try {
        await apiHide(id);                         // talk to server
        row.style.transition='opacity .25s';
        row.style.opacity='0';
        setTimeout(()=>row.remove(),260);          // remove from DOM
      } catch(err) {
        console.error('[QuickDelete] delete failed', err);
        badge.style.pointerEvents='auto';
      }
    }, true);

    row.addEventListener('mouseenter', () => {
      badge.style.opacity='.85';
      row.style.transition='padding-left 120ms';
      row.style.paddingLeft=`${pad0 + 24}px`;
    });
    row.addEventListener('mouseleave', () => {
      badge.style.opacity='0';
      row.style.paddingLeft=`${pad0}px`;
    });

    row.prepend(badge);
  }

  /* ─── 4.  Observe sidebar for new rows ─────────────────────── */
  const ROW = '#history a[draggable="true"][href^="/c/"]';
  const observer = new MutationObserver(muts =>
    muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType!==1) return;
      if (n.matches(ROW)) addBadge(n);
      n.querySelectorAll?.(ROW).forEach(addBadge);
    })));

  const init = setInterval(() => {
    const h = document.getElementById('history');
    if (h) {
      clearInterval(init);
      observer.observe(h,{childList:true,subtree:true});
      document.querySelectorAll(ROW).forEach(addBadge);
      console.log('[QuickDelete] ready');
    }
  },150);
})();
