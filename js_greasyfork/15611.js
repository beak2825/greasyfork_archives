// ==UserScript==
// @name         Dinak
// @namespace    hkg
// @description  HKG 
// @author       thedinak
// @match        http://agar.io/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @version      0.3
// @downloadURL https://update.greasyfork.org/scripts/15611/Dinak.user.js
// @updateURL https://update.greasyfork.org/scripts/15611/Dinak.meta.js
// ==/UserScript==


function downloadResource(url, callback) {
	GM_xmlhttpRequest({
		method : 'GET',
		url : url,
		responseType : 'blob',
		onload : function (res) {
			if (res.status === 200) {
				callback(url, window.URL.createObjectURL(res.response));
			} else {
				console.log("res.status=" + res.status);
			}
		},
		onerror : function (res) {
			console.log("GM_xmlhttpRequest error! ");
			callback(null);

		}
	});
}

window.addEventListener("message", receiveMessage, true);