// ==UserScript==
// @name        RED: group description to clipboard
// @description click description box header to copy bbcode to clipboard
// @namespace   userscript1
// @match       https://redacted.sh/torrents.php*id=*
// @match       https://orpheus.network/torrents.php*id=*
// @match       https://*.orpheus.network/torrents.php*id=*
// @grant       none
// @version     0.1.4
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/460336/RED%3A%20group%20description%20to%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/460336/RED%3A%20group%20description%20to%20clipboard.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var fetched;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const url = new URL(location);
  const apiURL = 'https://' + url.hostname + '/ajax.php?action=torrentgroup&id=' + id;
  var jsonField = 'bbBody';
  if (url.hostname.toLowerCase().includes('orpheus') ) {
    jsonField = 'wikiBBcode';
  }

  const elm = document.querySelector('div.torrent_description > div.head strong');
  if(!elm) { return; }
  elm.addEventListener('click', process);
  elm.style.cursor = 'pointer';
  elm.textContent += ' [click to copy]';

  function process() {
	if (fetched) {
	  copy(fetched);
	} else {
	  fetch(apiURL)
		.catch(e => {
		  console.log('fetch failed');
		})
		.then( r => r.json() )
		.then( j => {
		  copy(j);
		});
	}
  }

  function copy(j)  {
	fetched = j;
	let data = j.response.group[jsonField];
	navigator.clipboard.writeText(data).then(function() {
	  elm.textContent += ' - copied';
	}, function() {
	  elm.textContent += ' - error';
	});
  }

})();
