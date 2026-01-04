// ==UserScript==
// @name        PNZ-Downloader
// @namespace   Violentmonkey Scripts
// @match       *://*.tortugasocial.com/avataria-vk/app/index.html*
// @grant       unsafeWindow
// @run-at      document-end
// @version     12.5.0
// @author      flippx501
// @description test
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/413479/PNZ-Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/413479/PNZ-Downloader.meta.js
// ==/UserScript==

unsafeWindow.init = this.initApp();
window.addEventListener("load", function() {
	unsafeWindow.init = this.initApp();
}, false);

function initApp() {
	var params = window.location.href.substring(window.location.href.indexOf('?') + 1).split('&');
	var vars = {};
	vars['config'] = '//cdn-sp.tortugasocial.com/avataria-vk/app/appconfig.xml';
	vars['versions'] = '//cdn-sp.tortugasocial.com/avataria-ru/versions.json';
	vars['appSwf'] = '//cdn-sp.tortugasocial.com/avataria-ru/app/pnz-city.swf';

	for (var i = 0; i < params.length; i++) {
		vars[params[i].split('=')[0]] = params[i].split('=')[1];
	}

	var flashVars = [];
	
	for (var variable in vars) {
		flashVars.push(variable + '=' + vars[variable]);
	}

	var params = {
		flashvars: flashVars.join("&"),
		allowfullscreen: "true",
		allowscriptaccess: "always",
		allowFullScreenInteractive: "true",
		allownetworking: "all",
		wmode: "transparent"
	};

	var minFlashVersion = "10";
	if (swfobject.hasFlashPlayerVersion(minFlashVersion)) {
		swfobject.embedSWF("//cdn-sp.tortugasocial.com/avataria-ru/app/pnz-city-container.swf", "flashContent", "760", "650", minFlashVersion, null, null, params, {name: "flashContent"});
	} else {
		window.location.assign("//www.adobe.com/go/getflashplayer");
		document.getElementById('getFlashContainer').style.background = "url(//cdn-sp.tortugasocial.com/avataria-vk/img/flash/pnz_chrome_page_preloader.png) no-repeat";
		document.getElementById('getFlashContainer').style.visibility = "visible";
	}
}


