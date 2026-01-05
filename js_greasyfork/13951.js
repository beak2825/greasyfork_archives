// ==UserScript==
// @name        LmaoAyy Drive Enhancer
// @namespace   http://lmaoayy.ml/Drive/
// @description Adds various enhancements to LmaoAyy's FileBoard
// @include     http://lmaoayy.ml/Drive/*
// @version     0.1.2
// @grant       GM_log
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/13951/LmaoAyy%20Drive%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/13951/LmaoAyy%20Drive%20Enhancer.meta.js
// ==/UserScript==


function main() {
	images = document.querySelectorAll('a[href$="jpg"]>img,a[href$="png"]>img,a[href$="gif"]>img');
	for (n = 0; n < images.length; ++n) {
		images[n].src = images[n].parentElement.href;
		images[n].parentElement.addEventListener("click", toggleExpanded);
	}
}

function toggleExpanded(event) {
	this.classList.toggle("expanded");
	event.preventDefault();
}

GM_addStyle([
'a[href*="fileUploads"] > img {',
'  max-width: 100px;',
'  max-height: 100px;',
'}',
'a.expanded > img{',
'  max-width: 100%;',
'  max-height: 100%;',
'  height: auto;'
].join('\n'));

setTimeout(main, 0);
