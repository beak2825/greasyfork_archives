// ==UserScript==
// @name        RED: filesizes
// @description get exact size of files. click [SZ] next to [PL]
// @namespace   userscript1
// @match       https://redacted.sh/torrents.php*id=*
// @match       https://orpheus.network/torrents.php*id=*
// @match       https://*.orpheus.network/torrents.php*id=*
// @grant       none
// @version     0.1.6
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/485528/RED%3A%20filesizes.user.js
// @updateURL https://update.greasyfork.org/scripts/485528/RED%3A%20filesizes.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const url = new URL(location);
  const apiURL = 'https://' + url.hostname + '/ajax.php?action=torrent&id=';
  var jsonField = 'fileList';

  function get_filesizes(evt) {
    evt.preventDefault();
    fetch(apiURL + evt.target.dataset.id)
      .catch(e => {
        console.log('fetch failed');
      })
      .then( r => r.json() )
      .then( j => {
        process_json(j, evt.target);
      });
  }

  function process_json(j, elm) {
    let data = j.response.torrent[jsonField];
    data = data.replaceAll('|||', '<br>')
        .replaceAll('{{{', ' : {{{')
        .replaceAll(/{{{(\d+)}}}/g, parse_number);
    elm.parentNode.parentNode.insertAdjacentHTML('beforeEnd', `<div>${data}</div>`);
  }

  function parse_number(match, p1) {
    return parseInt(p1).toLocaleString(undefined);  // use browser locale
  }

  // add links
  document.querySelectorAll('a[title="Permalink"] , .button_pl').forEach(a => {
    var id = a.href.split('torrentid=')[1];
    a.insertAdjacentHTML('beforeBegin',
          ` <a href="#" class="tooltip button_sz" data-id="${id}" title="Filesizes">SZ</a> | `);
  });
  // add listeners
  document.querySelectorAll('a.button_sz').forEach(a => {
    a.addEventListener('click', get_filesizes);
  });

})();
