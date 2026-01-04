// ==UserScript==
// @name         OPS :: Bp/h tooltip
// @description  Add bonus points earned per hour to navbar tooltip
// @version      0.12
// @author       illmatic
// @match        https://orpheus.network/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/699830
// @downloadURL https://update.greasyfork.org/scripts/415171/OPS%20%3A%3A%20Bph%20tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/415171/OPS%20%3A%3A%20Bph%20tooltip.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(() => {
  'use strict';

  const bonus = document.querySelector('#nav_bonus > a.tooltip')
  fetch('/bonus.php?action=bprates')
    .then(resp => resp.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const bph = doc.querySelector('#content > table > tbody > tr > td:nth-child(3)').textContent;
      $(bonus).data("tooltipsterContent", `Bp/h: ${bph}`);
    })
    .catch(err => console.log('Failed to fetch /bonus.php: ', err));
})();
