// ==UserScript==
// @name         UTAS auto extend session
// @namespace    https://fuwa.dev
// @version      0.1
// @description  prevent session timeout in UTAS
// @author       fuwa
// @match        https://utas.adm.u-tokyo.ac.jp/campusweb/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=u-tokyo.ac.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511361/UTAS%20auto%20extend%20session.user.js
// @updateURL https://update.greasyfork.org/scripts/511361/UTAS%20auto%20extend%20session.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (!document.getElementById('portaltimer')) return;
  if (typeof extendSession !== 'function') return;
  if (typeof session_time_out !== 'string') return;

  const timeout = parseFloat(session_time_out) * 60 * 1000;

  const chk = document.createElement('input');
  chk.type = 'checkbox';
  chk.checked = true;
  chk.onclick = (e) => { e.stopPropagation(); };
  // chk.onchange = update;

  const targ = document.querySelector('#portaltimer li.txt');
  targ.insertBefore(chk, targ.firstChild);

  const update = () => {
    if (!chk.checked) return;

    const t = timeout - (new Date().getTime() - session_last_acc_time.getTime());
    console.log(t / 1000);
    if (t < 10 * 60 * 1000) { // 10 min
      extendSession();
    }
  };
  setInterval(update, 10000);
  console.log(chk);
})();
