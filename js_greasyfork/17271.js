// ==UserScript==
// @name        HKG Plus
// @namespace   hkgplus
// @version     1.0.0
// @description HKG Extension
// @author      Num JAI
// @match       http://agar.io/*
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/17271/HKG%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/17271/HKG%20Plus.meta.js
// ==/UserScript==
if (location.host == "agar.io" && location.pathname == "/") {
	location.href = "http://agar.io/hkg" + location.hash;
	return;
}

document.documentElement.innerHTML = null;
loadScript("http://hkgagar.com/js/bundle.js", function () {});

function loadScript(url, callback) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
    script.charset = "UTF-8";
	script.src = url;
	script.onload = callback;
	head.appendChild(script);
}

function receiveMessage(e) {
	if (e.origin != "http://agar.io" || !e.data.action)
		return;

	var Action = unsafeWindow.Action;

	if (e.data.action == Action.COPY) {
		GM_setClipboard(e.data.data);
	}

	if (e.data.action == Action.IMAGE) {
		downloadResource(e.data.data, unsafeWindow.handleResource);
	}
}

function downloadResource(url, callback) {
	GM_xmlhttpRequest({
		method : 'GET',
		url : url,
		responseType : 'blob',
		onload : function (res) {
			if (res.status === 200) {
				callback(url, window.URL.createObjectURL(res.response));
			}
		},
		onerror : function (res) {
			console.log("GM_xmlhttpRequest error! ");
			callback(null);
		}
	});
}

window.addEventListener("message", receiveMessage, false);
