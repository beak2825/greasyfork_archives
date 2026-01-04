// ==UserScript==
// @name          MangaDexCentered
// @namespace     MangaDexCentered
// @version       1.0
// @description   Centers images and hides scrollbar and right panel
// @author        Owyn
// @match         https://mangadex.com/chapter/*
// @match         https://mangadex.org/chapter/*
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/371393/MangaDexCentered.user.js
// @updateURL https://update.greasyfork.org/scripts/371393/MangaDexCentered.meta.js
// ==/UserScript==

let i = setInterval(dojob, 100);

function dojob()
{
	let img = document.querySelector("img.noselect");
	if(img && img.naturalWidth) // loaded
	{
		document.querySelector(".reader-controls-wrapper").remove();
		document.querySelector(".reader-main").classList.remove("reader-main");

		document.documentElement.style.overflow = "hidden"; // hide scrollbar
		document.body.style = "margin-right: -50px; padding-right: 50px; overflow-y: scroll; height: " +window.innerHeight+ "px;"; // wheel
		
		let sheet = document.createElement('style');
		sheet.innerHTML = ".reader.fit-horizontal .reader-images img { max-width: "+window.innerWidth+"px; }";
		document.body.appendChild(sheet);  // fix images not being 100% wide
		setInterval(function(){document.body.focus();}, 100); // fix arrows and space buttons not working
    
		clearInterval(i);
	}
}
