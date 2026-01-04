// ==UserScript==
// @name         XTV.CZ anti-adblock
// @namespace    https://greasyfork.org/cs/users/198317-trumpeta
// @version      1.03
// @description  Potlačení otravného okna kvůli AdBlocku
// @author       Trumpeta
// @run-at       document-body
// @iconURL      https://xtv.cz/img/xtv-logo-512.png
// @match        https://xtv.cz/*
// @match        http://xtv.cz/*
// @downloadURL https://update.greasyfork.org/scripts/389228/XTVCZ%20anti-adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/389228/XTVCZ%20anti-adblock.meta.js
// ==/UserScript==

let layer = document.querySelector('template#pgblck-tmpl');
if (layer != null) layer.remove();

const scriptPath = '/js/public.min.js',
			rx = /\b(?:\w\.ads\.init)\(\),/g;

document.onbeforescriptexecute = function(evt) {
	if (!evt.target.src.toLowerCase().includes(scriptPath)) return;
	evt.preventDefault();
	evt.stopPropagation();
	let xhr = new XMLHttpRequest;
	xhr.open('GET', evt.target.src, false);
	xhr.send();
	if (xhr.status < 200 || xhr.status >= 400) {
		console.error('Error loading script:', evt.target.src, xhr)
		return;
	}
	let newScript = document.createElement('script');
	newScript.type = "text/javascript";
	newScript.textContent = xhr.responseText.replace(rx, '');
	document.head.append(newScript);
};

// for (var script of document.getElementsByTagName('SCRIPT')) {
// 	if (!script.src || !script.src.toLowerCase().includes(scriptPath)) continue;
// 	script.remove();
// 	let xhr = new XMLHttpRequest;
// 	xhr.open('GET', script.src, false);
// 	xhr.send();
// 	if (xhr.status < 200 || xhr.status >= 400) {
// 		console.error('Error loading script:', script.src, xhr)
// 		return;
// 	}
// 	script.removeAttribute('src');
// 	script.type = 'text/javascript';
// 	script.textContent = xhr.responseText.replace(rx, '');
// 	document.head.append(script);
// }
