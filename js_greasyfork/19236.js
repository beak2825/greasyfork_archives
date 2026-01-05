// ==UserScript==
// @name           Chrome Extension Downloader
// @description    create download button for CRX
// @include https://chrome.google.com/webstore/detail/*/*
// @run-at document-end
// @version 0.0.1.20160508073408
// @namespace https://greasyfork.org/users/3920
// @downloadURL https://update.greasyfork.org/scripts/19236/Chrome%20Extension%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/19236/Chrome%20Extension%20Downloader.meta.js
// ==/UserScript==

(function()
{
	start();

	function start()
	{
		var url = document.URL;
		var regex = /chrome.google.com\/webstore\/detail\/(.+?)\/([a-z]+)/g;
		var match = regex.exec(url);

		var crxName = match[1];
		var crxId = match[2];

		url = document.body.innerHTML;
		regex = /<meta itemprop="version" content="(.+?)">/g;
		match = regex.exec(url);

		var crxVer = match[1];

		AddDownloadButton(crxId, crxName, crxVer);
	}

	function AddDownloadButton(id, name, ver)
	{
		var downloadLink = "https://clients2.google.com/service/update2/crx?response=redirect&prodversion=31.0.1650.63&x=id" + encodeURIComponent("=") + id + encodeURIComponent("&") + "uc";
		var buttonGroup = document.getElementsByClassName("h-e-f-Ra-c e-f-oh-Md-zb-k");

		var linkDom = document.createElement("a");
		linkDom.setAttribute("href", downloadLink);
		linkDom.setAttribute("download", name + "_" + ver + ".crx");

		var buttonFrame = document.createElement("div");
		buttonFrame.setAttribute("role", "button");
		buttonFrame.setAttribute("class", "dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-Oc-td-jb-oa g-c");
		buttonFrame.setAttribute("aria-label", "CRX Download");
		buttonFrame.setAttribute("tabindex", "0");
		buttonFrame.setAttribute("style", "-webkit-user-select: none; margin-right:2px;");

		var styleDom = document.createElement("div");
		styleDom.setAttribute("class", "g-c-x");

		var buttonDom = document.createElement("div");
		buttonDom.setAttribute("class", "g-c-R");
		buttonDom.innerHTML = "CRX Download";

		styleDom.appendChild(buttonDom);
		buttonFrame.appendChild(styleDom);
		linkDom.appendChild(buttonFrame);
		buttonGroup[0].innerHTML = linkDom.outerHTML + buttonGroup[0].innerHTML;
	}
})();
