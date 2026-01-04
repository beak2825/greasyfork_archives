// ==UserScript==
// @name         UTOL helpers
// @namespace    https://fuwa.dev/
// @version      0.1
// @description  enhance UTOL
// @author       fuwa
// @match        https://itc-lms.ecc.u-tokyo.ac.jp/*
// @match        https://utol.ecc.u-tokyo.ac.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=u-tokyo.ac.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511362/UTOL%20helpers.user.js
// @updateURL https://update.greasyfork.org/scripts/511362/UTOL%20helpers.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.onbeforeunload = undefined;

  if (location.pathname == '/robots.txt') location.pathname = '/';

  // vimium hint
  document.querySelectorAll('div.divTableCellHeader.timetable-course-top-btn').forEach(a=>a.setAttribute('role', 'button'));
  document.querySelectorAll('label.link-txt').forEach(a=>a.setAttribute('role', 'button'));


  const stylenode = document.createElement("style");
  stylenode.innerHTML = `
  .sidemenu_hide .sidemenu_link.sidemenu_link_lms { display: none !important; }
  `;
  document.querySelector("head").appendChild(stylenode);


})();
