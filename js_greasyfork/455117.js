// ==UserScript==
// @name        RED: search/link BC and others
// @namespace   userscript1
// @match       https://redacted.sh/torrents.php?*
// @match       https://redacted.sh/requests.php?*
// @grant       none
// @version     0.1.10
// @author      -
// @description puts bandcamp link (if found in description) or link to search bandcamp to the right of the release title
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/455117/RED%3A%20searchlink%20BC%20and%20others.user.js
// @updateURL https://update.greasyfork.org/scripts/455117/RED%3A%20searchlink%20BC%20and%20others.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const searchYT = 'https://yewtu.be/search?q=';
  const searchBC = 'https://bandcamp.com/search?item_type=a&q=';
  const searchQB = 'https://www.qobuz.com/us-en/search?q=';

  const description = document.querySelector('div.torrent_description , div.box_request_desc');
  if (!description) { return; }
  const bcLink = description.querySelector('a[href*="bandcamp.com"]');
  const qbLink = description.querySelector('a[href*="qobuz.com"]');

  const header = document.querySelector('#content .header h2');
  if (document.location.pathname == '/requests.php' && !header.textContent.includes('> Music >')) {
    return;
  }

  //  messing with this prob want to revert
  //var search = header.textContent.replace(/\[.*\]/g, '')
  var search = document.title.replace(/\[[^[]*?$/, '')
                //.replace(/\[.*\]/g, '')
               // .replace(/^.* > Music > /, '')
                .replace('View request: ', '')
                .replace(/^.*performed by /, '')
                .replace(/(various|unknown) (artists|artist\(s\)) - /i, '')
                //.replace(/ - /g, ' ')
                .replace(/ EP /g, ' ')
                .replace(/ [-/&] /g, ' ');

  var query = encodeURIComponent(search);
  var html = '';
  if (qbLink) {
    html +=  ` <a href="${qbLink.href}"     rel="noopener noreferrer" target="_blank">QB</a> `;
  } else {
    html += ` <a href="${searchQB}${query}" rel="noopener noreferrer" target="_blank">QBs</a> | `;
  }

  html += ` <a href="${searchYT}${query}" rel="noopener noreferrer" target="_blank">YTs</a> | `;

  if (bcLink) {
    html +=  ` <a href="${bcLink.href}"      rel="noopener noreferrer" target="_blank">BC</a> `;
  } else {
    html +=  ` <a href="${searchBC}${query}" rel="noopener noreferrer" target="_blank">BCs</a> `;
  }

  header.insertAdjacentHTML('beforeEnd', `<span style="opacity: 50%;"> ${html} </span>`);

})();