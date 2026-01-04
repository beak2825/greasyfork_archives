// ==UserScript==
// @name        Holmes on Ptt
// @namespace   https://github.com/gslin/ptt-holmes
// @match       https://www.ptt.cc/bbs/*
// @grant       none
// @version     0.20250424.0
// @author      Gea-Suan Lin <gslin@gslin.com>
// @description Add info links on Ptt
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/533005/Holmes%20on%20Ptt.user.js
// @updateURL https://update.greasyfork.org/scripts/533005/Holmes%20on%20Ptt.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // User information
  document.querySelectorAll('.push-userid').forEach(el => {
    const userid = el.innerText.trim();

    const el_userid = document.createElement('a');
    el_userid.setAttribute('href', 'https://www.plytic.com/authors/' + userid.toLowerCase());
    el_userid.setAttribute('style', 'color: #ff6;');
    el_userid.innerText = userid;
    el.innerText = '';
    el.appendChild(el_userid);
  });

  // IP address information
  document.querySelectorAll('.push-ipdatetime').forEach(el => {
    const ip = el.innerText.trim().split(' ')[0];
    if (!ip.match(/^[.0-9:]+$/)) {
      return;
    }

    const template = [
      ['IntelX', 'https://intelx.io/?s='],
      ['LeakIX', 'https://leakix.net/search?q=ip:'],
      ['Shodan', 'https://shodan.io/host/'],
    ];

    // Reverse order due to float.
    for (const site of template.reverse()) {
      const el_ip = document.createElement('a');
      el_ip.setAttribute('href', site[1] + ip);
      el_ip.setAttribute('style', 'float: right; font-size: 0.75em; margin-left: 0.333em;');
      el_ip.innerText = site[0];
      el.insertAdjacentElement('beforebegin', el_ip);
    }
  });
})();
