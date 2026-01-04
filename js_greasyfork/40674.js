// ==UserScript==
// @name         Automatic Server
// @namespace    https://greasyfork.org/users/154522
// @version      1.1
// @description  Automatically change server to preferred server type on Kissanime
// @author       G-Rex
// @match        http://kissanime.ru/Anime/*/Episode*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/40674/Automatic%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/40674/Automatic%20Server.meta.js
// ==/UserScript==

let hijackFailed = false;

(function() {
    'use strict';

	let defaultServer = getDefaultServer();
	let currentServer = getCurrentServer();
	if(currentServer && defaultServer !== currentServer) {
		changeServer(defaultServer);
	}
	hijackServerSelection();
})();

function getDefaultServer() {
	let defaultServer = localStorage.getItem('server');

	if(defaultServer) {
		localStorage.removeItem('server');
		GM_setValue('server', defaultServer);
		return defaultServer;
	}

	defaultServer = GM_getValue('server', null);
	if(defaultServer) {
		return defaultServer;
	}

	defaultServer = 'default';
	GM_setValue('server', defaultServer);

	return defaultServer;
}

function hijackServerSelection() {
	let selection = document.getElementById('selectServer');
	if(!selection) {
		if(!hijackFailed) {
			//change the time if you keep being redirected when changing servers
			setTimeout(() => {hijackServerSelection();}, 2000);
		}

		hijackFailed = true;
		return;
	}
	selection.setAttribute('onChange', 'doChange(this.value);');
	let options = selection.getElementsByTagName('option');
	writeScript();
}

function getCurrentServer() {
	return getServer(window.location.href);
}

function writeScript() {
	let head = document.getElementsByTagName('head');
	head = head[0];
	let inner = head.innerHTML;
	let script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
	script.textContent = 'function doChange(value) {' +
		'	saveServer(value);' +
		'	changePage(value);' +
		'}' +

		'function saveServer(value) {' +
		'	let server = getServer(value);' +
		'	localStorage.setItem(\'server\', server);' +
		'}' +

		'function changePage(value) {' +
		'	window.location.href = value;' +
		'}' +

		'function getServer(url) {' +
		'	let serverIndex = url.search(/(?<=s=).*$/);' +
		'	let server = url.substring(serverIndex);' +
		'	return server;' +
		'}';
	document.body.appendChild(script);
}

function doChange(value) {
	saveServer(value);
	changePage(value);
}

function saveServer(value) {
	let server = getServer(value);
	localStorage.setItem('server', server);
}

function changePage(value) {
	window.location.href = value;
}

function changeServer(server) {
	let currentPage = window.location.href;
	let serverIndex = currentPage.search(/(?<=s=).*$/);
	let newPage = currentPage.substring(0, serverIndex);
	newPage += server;
	unsafeWindow.location = newPage;
}

function getServer(url) {
	let serverIndex = url.search(/(?<=s=).*$/);
	let server = url.substring(serverIndex);

	if(server) {
		return server;
	}

	return null;
}