// ==UserScript==
// @name        Voat Autoexpand
// @description Autoexpand Voat
// @namespace   https://voat.co/user/InsistentCooperative
// @match       *://*.voat.co/v/*
// @version     1
// @grant       none
// @license     MIT
// @license     WTFPL
// @license     Public Domain
// @downloadURL https://update.greasyfork.org/scripts/20742/Voat%20Autoexpand.user.js
// @updateURL https://update.greasyfork.org/scripts/20742/Voat%20Autoexpand.meta.js
// ==/UserScript==

const MAXITERS = 100;
const INTERVAL = 300;
let its = 0;
(function expand () {
  let more = document.querySelectorAll('#loadmorebutton,.inline-loadcomments-btn');
  let coll = document.querySelectorAll('.collapsed:not([style*="none"]) > a.expand:first-of-type');
  for (let _ of more) { _.onclick(); } // if js off, onclick is a string, and this will produce an error.
  for (let _ of coll) { _.onclick(); }
  if (more.length && ++its < MAXITERS) setTimeout(expand, INTERVAL);
})();
