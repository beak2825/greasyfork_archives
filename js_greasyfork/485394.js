// ==UserScript==
// @name         CamWhores.TV Screenshot Bypass
// @namespace    https://sleazyfork.org/en/users/1251472-vulturi
// @version      1.0.0
// @description  Bypasses screenshots of locked videos.
// @author       vulturi
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://www.camwhores.tv/videos/*
// @match        https://www.camwhores.online/videos/*
// @match        https://www.camwhores.porn/videos/*
// @match        https://www.camwhores.one/videos/*
// @match        https://www.camwhores.media/videos/*
// @match        https://www.camwhores.love/videos/*
// @match        https://www.camwhores.lol/videos/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/485394/CamWhoresTV%20Screenshot%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/485394/CamWhoresTV%20Screenshot%20Bypass.meta.js
// ==/UserScript==

document.querySelectorAll('.block-screenshots .item.private').forEach(function(el) {
	let newEl = document.createElement('a');
	newEl.innerHTML = el.innerHTML;
	el.parentNode.replaceChild(newEl, el);

	let img = newEl.querySelector('img');
	if(!img) {
		return;
	}

	img.src = img.getAttribute('data-original');
	let srcThumb = img.getAttribute('data-original');
	let srcBig = srcThumb.replace('/videos_screenshots/', '/videos_sources/').replace('/180x135/', '/screenshots/');

	newEl.href = srcBig;
	newEl.classList.add('item');
	newEl.setAttribute('rel', 'screenshots');
	newEl.setAttribute('data-fancybox-type', 'image');
});

GM_addStyle('a[href="http://flowplayer.org"]{opacity:0!important;pointer-events:none!important;}');