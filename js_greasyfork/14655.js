// ==UserScript==
// @name        Scribd Print and Download
// @description	Changes "Upload" link to open a printable viewer (print to PDF)
// @author      Inserio
// @include     http://*.scribd.com/doc/*
// @include     http://*.scribd.com/document/*
// @include     https://*.scribd.com/doc/*
// @include     https://*.scribd.com/document/*
// @version     1.7
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @namespace https://greasyfork.org/users/11878
// @downloadURL https://update.greasyfork.org/scripts/14655/Scribd%20Print%20and%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/14655/Scribd%20Print%20and%20Download.meta.js
// ==/UserScript==

var new_link;

$('script').html(function (i, text) {
	var idRegex = /"id":(\d{6,})/i;
	var keyRegex = /"access_key":"(key[-\w\d]*)"/i;
	var id = idRegex.exec(text);
	var key = keyRegex.exec(text);
	if (id !== null && key !== null && id !== undefined && key !== undefined)
		new_link = "http://d1.scribdassets.com/ScribdViewer.swf?document_id=" + id[1] + "&access_key=" + key[1];
	// if (new_link !== undefined)
		// return text.replace(/https?:\/\/www\.scribd\.com\/upload-document/gi, new_link);
		// Matches the "Upload" link on the page.
		// Click it to open the new page in a viewer that will allow printing to PDF
});

$('div').html(function (i, text) {
	if (new_link !== undefined)
		return text.replace(/https?:\/\/www\.scribd\.com\/upload-document/gi, new_link);
});