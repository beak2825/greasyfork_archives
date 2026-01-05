// ==UserScript==
// @name       Aptoide APK Downloader
// @version    2.0
// @namespace    Learning2Program
// @author       Learning2Program
// @homepage https://greasyfork.org/scripts/3454-aptoide-apk-downloader
// @description  Changes the install button on Aptoid to download the apk.
// @include      *aptoide.com*
// @require http://code.jquery.com/jquery-latest.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/3454/Aptoide%20APK%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/3454/Aptoide%20APK%20Downloader.meta.js
// ==/UserScript==
var url = window.location.href;

first = url.indexOf('/') + 2;
last = url.indexOf('.');
store = url.substring(first, last);

first = url.indexOf('/market/') + 8;
urll = url.slice(first);
last = urll.slice(0, urll.indexOf('/'));
appName = last;

string = document.getElementsByClassName('app_meta')[0].textContent.trim();
version = string.slice(string.indexOf(':') + 2, string.indexOf("|") - 1);
var destination = 'http://www.aptoide.com/webservices/getApkInfo/' + store + '/' + appName + '/' + version + '/xml';
console.log(destination);


var downloadIt = function() {
	window.location.href = apk;
};

GM_xmlhttpRequest({
	method: "GET",
	url: destination,
	onload: function(response) {
		var responseXMLs = new DOMParser().parseFromString(response.responseText, "text/xml");
		apk = responseXMLs.getElementsByTagName('path')[0].innerHTML;
		document.getElementsByClassName('btn app_install right trusted')[0].addEventListener('click', downloadIt);
	}
});