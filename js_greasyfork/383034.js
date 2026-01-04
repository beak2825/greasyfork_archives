// ==UserScript==
// @name          MangaDexFit
// @namespace     MangaDexFit
// @version       1.1
// @description   Fit images to max width
// @author        Australis
// @match         https://mangadex.org/chapter/*
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/383034/MangaDexFit.user.js
// @updateURL https://update.greasyfork.org/scripts/383034/MangaDexFit.meta.js
// ==/UserScript==

let i = setInterval(dojob, 100);

function dojob()
{
	let img = document.querySelector("img.img");
	if(img && img.naturalWidth) // loaded
	{
		let sheet = document.createElement('style');
		sheet.innerHTML = ".md--page img { height: auto; width: 100vw !important; margin: auto; object-fit: contain !important;}";
		document.body.appendChild(sheet); // fix images not being 100% wide
        clearInterval(i);
	}
}