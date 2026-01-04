// ==UserScript==
// @name        RED: column shrink
// @namespace   Violentmonkey Scripts
// @match       https://redacted.sh/torrents.php
// @match       https://redacted.sh/requests.php
// @match       https://redacted.sh/top10.php
// @grant       none
// @version     0.1.7
// @author      -
// @description make more space for artist/title on torrents/requests/top10
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/485106/RED%3A%20column%20shrink.user.js
// @updateURL https://update.greasyfork.org/scripts/485106/RED%3A%20column%20shrink.meta.js
// ==/UserScript==

(function() {
  'use strict';
  //return;

  function set(sel, txt) {
    var elm = document.querySelector(sel);
    if (elm) { elm.innerHTML = txt };
  }
  // torrents headings
  set('#torrent_table .colhead > td:nth-child(4)  ', '<span style="filter: grayscale(100%);">📁</span>');
  set('#torrent_table .colhead > td:nth-child(5) a', '<span style="filter: grayscale(100%);">⏰</span>');
  set('#torrent_table .colhead > td:nth-child(6) a', '<span style="filter: grayscale(100%);">💾</span>');

  // requests headings
  var elm = document.querySelector('#request_table td:nth-child(1)')
  if (elm) { elm.style.width = "100%"; }
  set('#request_table .colhead_dark > td:nth-child(3) strong', 'Bou');
  set('#request_table .colhead_dark > td:nth-child(4) strong', 'Fil');
  set('#request_table .colhead_dark > td:nth-child(5) strong', 'by');
  set('#request_table .colhead_dark > td:nth-child(6) strong', 'Req by');
  set('#request_table .colhead_dark > td:nth-child(7) strong', 'Cre');
  set('#request_table .colhead_dark > td:nth-child(8) strong', 'Lst');


  // table cells
  var sel_top = '';
  var top10 = false;
  if (window.location.pathname == '/top10.php') {
    top10 = true;
  }
  function r(elm, r1, r2) {
    elm.textContent = elm.textContent.replace(r1, r2);
  }

  if (top10) { sel_top = '.torrent_table .time , ';}
  document.querySelectorAll(sel_top + '#torrent_table .time ,  #request_table .time').forEach(c => {
      r(c, / hours? ago/, 'h');
      r(c, / mins? ago/, 'm');
      r(c, / days? ago/, 'd');
      r(c, / weeks? ago/, 'w');
      r(c, / months? ago/, 'mo');
      r(c, / years? ago/, 'y');
  });

  if (top10) { sel_top = '.torrent_table .number_column , '; }
  document.querySelectorAll(sel_top + '#torrent_table .number_column , #request_table .number_column').forEach(c => {
    r(c, /\.\d\d\d? /, '');
    r(c, ' (Max)', '');
    r(c, /MB/, 'M');
    r(c, /GB/, 'G');
    r(c, /TB/, 'T');
  });

})();