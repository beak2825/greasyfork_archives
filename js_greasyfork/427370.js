// ==UserScript==
// @name        RED - request description to clipboard
// @description click description box header to copy bbcode to clipboard
// @namespace   userscript1
// @match       https://redacted.sh/requests.php*id=*
// @grant       none
// @version     0.2.3
// @downloadURL https://update.greasyfork.org/scripts/427370/RED%20-%20request%20description%20to%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/427370/RED%20-%20request%20description%20to%20clipboard.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var fetched;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const url = 'https://redacted.sh/ajax.php?action=request&id=' + id;
  const elm = document.querySelector('div.box_request_desc > div.head');
  elm.addEventListener('click', process);
  elm.style.cursor = 'pointer';
  elm.firstChild.textContent += ' [click to copy]';

  function process() {
	if (fetched) {
	  copy(fetched);
	} else {
	  fetch(url)
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
	let data = j.response.bbDescription;
	navigator.clipboard.writeText(data).then(function() {
	  elm.firstChild.textContent += ' - copied';
	}, function() {
	  elm.firstChild.textContent += ' - error';
	});
  }

})();
