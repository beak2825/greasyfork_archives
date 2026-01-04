// ==UserScript==
// @name         Screenshot & Copy Question on Mobius(UNSW)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Capture & copy question container screenshot
// @license      MIT
// @match        https://unsw.mobius.cloud/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/536832/Screenshot%20%20Copy%20Question%20on%20Mobius%28UNSW%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536832/Screenshot%20%20Copy%20Question%20on%20Mobius%28UNSW%29.meta.js
// ==/UserScript==

(() => {
  // --- styles ---
  GM_addStyle(`
    li.copy-ques a.btn { margin-left:5px; }
    li.copy-ques.disabled a.btn { cursor:not-allowed; opacity:.65; pointer-events:none; }
    li.copy-ques a.btn.success { background:#28a745!important; color:#fff!important; border-color:#28a745!important; }
    li.copy-ques a.btn.error   { background:#dc3545!important; color:#fff!important; border-color:#dc3545!important; }
  `);

  // --- config & state ---
  const QSEL = 'div[name="questioncontainer"]';
  const ULSEL = '#assignmentButtons ul';
  const TXT = {
    idle:    'Copy Question Screenshot',
    capture: 'Capturing...',
    copy:    'Copying...',
    ok:      'Copied!',
    err:     'Error!'
  };
  let btn;

  // --- UI updater ---
  const update = (txt, disabled=false, cls='') => {
    btn.textContent = txt;
    btn.parentElement.classList.toggle('disabled', disabled);
    btn.className = `btn btn-default${cls?` ${cls}`:''}`;
  };

  // --- main action ---
  const action = async ev => {
    ev.preventDefault();
    if (btn.parentElement.classList.contains('disabled')) return;

    const target = document.querySelector(QSEL);
    if (!target) {
      update(TXT.err, false, 'error');
      return setTimeout(() => update(TXT.idle), 2000);
    }

    try {
      update(TXT.capture, true);
      await new Promise(r => setTimeout(r, 50)); // let UI repaint
      const canvas = await html2canvas(target, {
        useCORS: true,
        scale: devicePixelRatio || 1,
        scrollX: -scrollX,
        scrollY: -scrollY
      });

      update(TXT.copy, true);
      const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
      if (!blob) throw 'blob failed';

      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      update(TXT.ok, false, 'success');
    } catch (_) {
      update(TXT.err, false, 'error');
    } finally {
      setTimeout(() => update(TXT.idle), 2000);
    }
  };

  // --- inject button when toolbar appears ---
  const inject = () => {
    const ul = document.querySelector(ULSEL);
    if (!ul) return;
    clearInterval(timer);

    const li = document.createElement('li');
    li.className = 'copy-ques';
    btn = Object.assign(document.createElement('a'), {
      href: '#',
      textContent: TXT.idle
    });
    btn.className = 'btn btn-default';
    btn.addEventListener('click', action);

    li.appendChild(btn);
    ul.insertAdjacentElement('afterbegin', li);
  };

  const timer = setInterval(inject, 200);
})();