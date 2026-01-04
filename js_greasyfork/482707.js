// ==UserScript==
// @name            HWM_live_header_clock
// @author          Мифист
// @namespace       Мифист
// @version         1.1.2
// @description     Живые часы в шапке
// @match           https://www.heroeswm.ru/*
// @match           https://*.lordswm.com/*
// @exclude         */war.php*
// @exclude         */cgame.php*
// @run-at          document-end
// @grant           none
// @license         MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/482707/HWM_live_header_clock.user.js
// @updateURL https://update.greasyfork.org/scripts/482707/HWM_live_header_clock.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const $ = document.querySelector.bind(document);
  const format = (num) => num > 9 ? num : `0${num}`;
  const split = (text) => (text.match(/\d+/g) || []).map(x => format(+x));

  const hwmNode = $('.rr + div') || $('a[href$="/player.html"]');

  if (!hwmNode) return;

  const timerNode = document.createTextNode('h:m:s');
  const hwmTime = [];

  if (location.pathname === '/roulette.php') {
    const elem = $('#roul_time') || { textContent: '' };
    hwmTime.push(...split(elem.textContent));
  }

  if (hwmNode.tagName === 'A') {
    const node = hwmNode.previousSibling;
    const data = node.data.trim();
    node.data = data.replace(/[^,]+/, '');
    hwmTime.push(...split(data).slice(0, -1));
    node.before(timerNode);
  } else {
    hwmTime.push(...split(hwmNode.textContent));
    hwmNode.replaceChildren(timerNode);
  }

  const date = new Date();
  const YY = date.getFullYear();
  const MM = format(date.getMonth() + 1);
  const DD = format(date.getDate());
  const [hh, mm, ss = '00'] = hwmTime;
  const dateString = `${YY}-${MM}-${DD}T${hh}:${mm}:${ss}`;
  const staticTime = Date.parse(dateString);
  const startTime = +date;

  (function loop() {
    if (timerNode.isConnected === false) return;

    const date = new Date(Date.now() - startTime + staticTime);
    const h = format(date.getHours());
    const m = format(date.getMinutes());
    const s = format(date.getSeconds());
    timerNode.data = `${h}:${m}:${s}`;
    setTimeout(loop, 1e3);
  })();
})();