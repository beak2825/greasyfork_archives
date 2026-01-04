// ==UserScript==
// @name        RED: invisible character reveal
// @namespace   Violentmonkey Scripts
// @match       https://redacted.sh/torrents.php*
// @grant       none
// @version     0.1.4
// @author      -
// @description reveal invisible/control characters in file lists
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/523150/RED%3A%20invisible%20character%20reveal.user.js
// @updateURL https://update.greasyfork.org/scripts/523150/RED%3A%20invisible%20character%20reveal.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // list from https://invisible-characters.com/  4 character codes only at present
  const check_codes = ['0009', '0020', '00a0', '00ad', '034f', '061c', '115f', '1160', '17b4', '17b5', '180b', '180c', '180d', '180e', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '200a', '200b', '200c', '200d', '200e', '200f', '202a', '202b', '202c', '202d', '202e', '202f', '205f', '2060', '2061', '2062', '2063', '2064', '2065', '2066', '2067', '2068', '2069', '206a', '206b', '206c', '206d', '206e', '206f', '2800', '3000', '3164', 'fe00', 'fe01', 'fe02', 'fe03', 'fe04', 'fe05', 'fe06', 'fe07', 'fe08', 'fe09', 'fe0a', 'fe0b', 'fe0c', 'fe0d', 'fe0e', 'fe0f', 'feff', 'ffa0', 'fffc'];

  function check(str) {
    //str = '	     ­ ‎ ‍ ​' + str;   // uncomment to test
    return str.replace(/[^ -~]/g, function(i){
        let code = ("000" + i.charCodeAt(0).toString(16)).slice(-4);
        if ( check_codes.includes(code) ) {
          return '<span class="invisible-characters-found" style="color: #ff4500">U+'+ code.toUpperCase() + '</span>';
        }
        return i;
      });
  }

  // run checks
  const selector = `.filelist_path,
                    .filelist_table tr:not(.colhead_dark) td:first-child
                    `;
  document.querySelectorAll(selector).forEach(el => {
    let str = el.textContent;
    let chk = check(str);
    if (str != chk) {
      console.log('invisible characters found', el);
      el.innerHTML += `<br> ${chk}`;
    }
  });


  // add a flag to the torrent row
  document.querySelectorAll('[id^="files_"]').forEach(el => {
    if (el.querySelector('.invisible-characters-found')) {
      var target = el.id.replace('files_', 'torrent');
      document.querySelector(`#${target} td:nth-child(2)`).innerHTML += '❗';
    }
  });



})();