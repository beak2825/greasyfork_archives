// ==UserScript==
// @name         Linnworks Barcodes
// @description  Linnworks.net Barcode generator
// @version      0.35
// @author       Blazej Wesierski
// @match        http*://www.linnworks.net/*
// @icon         http://www.linnworks.net/Content/Images/favicon.ico
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @namespace https://greasyfork.org/users/124626
// @downloadURL https://update.greasyfork.org/scripts/29801/Linnworks%20Barcodes.user.js
// @updateURL https://update.greasyfork.org/scripts/29801/Linnworks%20Barcodes.meta.js
// ==/UserScript==

(function() {

document.head.innerHTML = document.head.innerHTML + '<style>.alert {display: none !important;}  .alert-error{display: none !important;}</style>';

var t = '';
function gText(e) {
	t = (document.all) ? document.selection.createRange().text : document.getSelection();

	var checkSum = 0;
	do {
			var eanx = Math.floor(Math.random() * 999999999999) + 100000000000;
			var ean = "5" + eanx + "";
			var checkSum = ean.split('').reduce(function(p,v,i) {
				return i % 2 == 0 ? p + 1 * v : p + 3 * v;
				}, 0);
			if (checkSum % 10 == 0 && ean.length == 13) {
				console.log('Ok: ' + ean + ' ' + ean.length + ' ' + checkSum % 10);
				document.getElementsByTagName('INPUT')[1].value = ean;
				document.getElementsByTagName('INPUT')[1].style.backgroundColor = 'green';
			}
		}
	while (checkSum % 10 !== 0);
}

document.ondblclick = gText;
if (!document.all) document.captureEvents(Event.DBLCLICK);

})();