// ==UserScript==
// @name         HKG tool Lite
// @namespace    hkgagartoollite
// @description  HKG Agar tool Lite
// @author       Num JAI
// @match        http://agar.io/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @version 0.0.1.20151218200310
// @downloadURL https://update.greasyfork.org/scripts/17262/HKG%20tool%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/17262/HKG%20tool%20Lite.meta.js
// ==/UserScript==

var VERSION = "3.0.0";
var $;
var URL_JQUERY = "http://code.jquery.com/jquery-1.11.3.min.js";
var URL_BOOTSTRAP = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js";
//var URL_SOCKET_IO = "https://cdn.socket.io/socket.io-1.3.5.js";
var URL_FACEBOOK = "http://connect.facebook.net/en_US/sdk.js";
var URL_MAIN_OUT = "https://googledrive.com/host/0Bx5EmU2kLXq9alVNVTQxX0FFd1k/hkgagartoolpublic.js";
var URL_CSS_FILE = "https://googledrive.com/host/0Bx5EmU2kLXq9alVNVTQxX0FFd1k/hkgagartoolpublic.css"

    if (location.host == "agar.io" && location.pathname == "/") {
		location.href = "http://agar.io/aa" + location.hash;
		return;
	}

	// Load script
	loadScript(URL_JQUERY, function () {
		$ = unsafeWindow.jQuery;
		$("head").append('<link href="https://fonts.googleapis.com/css?family=Ubuntu:700" rel="stylesheet" type="text/css">');
		$("head").append('<link rel="stylesheet" href="http://agar.io/css/glyphicons-social.css">');
		$("head").append('<link rel="stylesheet" href="http://agar.io/css/animate.css">');
		$("head").append('<link rel="stylesheet" href="http://agar.io/css/bootstrap.min.css">');
		$("head").append('<link rel="stylesheet" href="' + URL_CSS_FILE + '">');

		loadScript(URL_BOOTSTRAP, function () {
			//loadScript(URL_SOCKET_IO, function () {
			loadScript(URL_MAIN_OUT, function () {
				loadScript(URL_FACEBOOK, function () {});
			});
			//});
		});
	});

function loadScript(url, callback) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
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

window.addEventListener("message", receiveMessage, false);
