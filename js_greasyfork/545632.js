// ==UserScript==
// @name         KA Study Overlay (Safe)
// @namespace    study.tools
// @version      1.0
// @description  Draggable timer + notes overlay for pacing practice (no answer access).
// @match        https://*.khanacademy.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545632/KA%20Study%20Overlay%20%28Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545632/KA%20Study%20Overlay%20%28Safe%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- UI shell ---
  const ui = document.createElement('div');
  Object.assign(ui.style, {
    position: 'fixed', left: '12vw', bottom: '2vh', width: '300px', maxWidth: '92vw',
    background: '#123576', color: '#fff', border: '2px solid #07152e', borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,.25)', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial',
    zIndex: 2147483647, userSelect: 'none', touchAction: 'none'
  });

  ui.innerHTML = `
    <div id="ka_head" style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#0f2c66;border-radius:10px 10px 0 0;cursor:grab;">
      <div style="font-weight:700;font-size:14px">Study Panel</div>
      <div style="display:flex;gap:6px">
        <button id="ka_min" title="Collapse" style="width:28px;height:28px;border:0;border-radius:6px;background:#1c428f;color:#fff">–</button>
        <button id="ka_close" title="Close" style="width:28px;height:28px;border:0;border-radius:6px;background:#c0392b;color:#fff">×</button>
      </div>
    </div>
    <div id="ka_body" style="padding:10px;display:flex;flex-direction:column;gap:8px">
      <label style="display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:13px">
        Delay per question (ms)
        <input id="ka_delay" type="number" min="0" step="100" value="1500" style="flex:0 0 110px;padding:6px;border-radius:6px;border:1px solid #2f56a8;background:#0e2454;color:#fff"/>
      </label>
      <div style="display:flex;gap:8px">
        <button id="ka_timer_start" style="flex:1;border:0;border-radius:8px;padding:8px;background:#28a745;color:#fff;font-weight:700">Start Timer</button>
        <button id="ka_timer_stop" style="flex:1;border:0;border-radius:8px;padding:8px;background:#6c757d;color:#fff">Stop</button>
      </div>
      <div id="ka_count" style="text-align:center;font-size:13px;opacity:.9">Ready</div>
      <textarea id="ka_notes" placeholder="Notes / hints you discover…" style="width:100%;min-height:90px;resize:vertical;padding:8px;border-radius:8px;border:1px solid #2f56a8;background:#0e2454;color:#fff"></textarea>
      <div style="display:flex;gap:8px">
        <button id="ka_copy" style="flex:1;border:0;border-radius:8px;padding:8px;background:#1c7ed6;color:#fff">Copy Notes</button>
        <button id="ka_clear" style="flex:1;border:0;border-radius:8px;padding:8px;background:#495057;color:#fff">Clear</button>
      </div>
    </div>
  `;
  document.documentElement.appendChild(ui);

  // --- drag behavior ---
  const head = ui.querySelector('#ka_head');
  let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;
  const onDown = (ev) => {
    dragging = true;
    const e = ev.touches ? ev.touches[0] : ev;
    const rect = ui.getBoundingClientRect();
    startX = e.clientX; startY = e.clientY;
    startLeft = rect.left; startTop = rect.top;
    head.style.cursor = 'grabbing';
    ev.preventDefault();
  };
  const onMove = (ev) => {
    if (!dragging) return;
    const e = ev.touches ? ev.touches[0] : ev;
    let left = startLeft + (e.clientX - startX);
    let top = startTop + (e.clientY - startY);
    left = Math.max(6, Math.min(window.innerWidth - ui.offsetWidth - 6, left));
    top = Math.max(6, Math.min(window.innerHeight - ui.offsetHeight - 6, top));
    ui.style.left = left + 'px';
    ui.style.top = top + 'px';
    ui.style.bottom = 'auto';
  };
  const onUp = () => { dragging = false; head.style.cursor = 'grab'; };
  head.addEventListener('mousedown', onDown);
  head.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('mousemove', onMove, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchend', onUp);

  // --- collapse / close ---
  const body = ui.querySelector('#ka_body');
  ui.querySelector('#ka_min').onclick = () => {
    const hidden = body.style.display === 'none';
    body.style.display = hidden ? 'flex' : 'none';
  };
  ui.querySelector('#ka_close').onclick = () => ui.remove();

  // --- timer & notes (no answer access) ---
  const delayInput = ui.querySelector('#ka_delay');
  const count = ui.querySelector('#ka_count');
  let timer = null, remaining = 0;

  function startTimer() {
    stopTimer();
    const ms = Math.max(0, parseInt(delayInput.value || '0', 10));
    remaining = ms;
    count.textContent = `Next step in ${(remaining/1000).toFixed(1)}s`;
    timer = setInterval(() => {
      remaining -= 100;
      if (remaining <= 0) {
        stopTimer();
        flash('Time! Move to the next step.');
      } else {
        count.textContent = `Next step in ${(remaining/1000).toFixed(1)}s`;
      }
    }, 100);
  }
  function stopTimer() { if (timer) clearInterval(timer); timer = null; count.textContent = 'Paused'; }

  ui.querySelector('#ka_timer_start').onclick = startTimer;
  ui.querySelector('#ka_timer_stop').onclick = stopTimer;

  // notes
  const notes = ui.querySelector('#ka_notes');
  ui.querySelector('#ka_copy').onclick = async () => {
    try { await navigator.clipboard.writeText(notes.value || ''); flash('Notes copied'); }
    catch { flash('Copy failed'); }
  };
  ui.querySelector('#ka_clear').onclick = () => { notes.value = ''; };

  // toast
  const toast = document.createElement('div');
  Object.assign(toast.style, {
    position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: '12vh',
    background: 'rgba(0,0,0,.85)', color: '#fff', padding: '8px 12px', borderRadius: '8px',
    fontSize: '13px', zIndex: 2147483647, display: 'none'
  });
  document.documentElement.appendChild(toast);
  function flash(msg, ms=1200) {
    toast.textContent = msg; toast.style.display = 'block';
    clearTimeout(flash._t); flash._t = setTimeout(()=> toast.style.display='none', ms);
  }
})();