// ==UserScript==
// @name         CRX Downloader
// @name:zh-CN   插件下载器
// @name:zh-TW   擴展下載器
// @description  Allows you to download ".crx" files directly from Chrome Web Store and Microsoft Edge Addons websites.
// @description:zh-CN   允许你直接从谷歌Chrome网络商店和微软Edge插件网站下载".crx"文件。
// @description:zh-TW   允許你直接從谷歌Chrome Web Store和微軟Edge插件網站下載".crx文件"。
// @namespace    https://waahah.xyz/about
// @icon         https://www.chromium.org/favicon.ico
// @version      1.0.4
// @author       waahah
// @match        *://chromewebstore.google.com/*
// @match        *://microsoftedge.microsoft.com/*
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/513511/CRX%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/513511/CRX%20Downloader.meta.js
// ==/UserScript==

function enableInstallBtn() {
	let extensionId;
	let cdnurl;

	let getBtn;

	if (window.location.href.includes("https://chromewebstore.google.com/detail/")) {
		extensionId = window.location.href.split("/").pop();

		if (extensionId.includes = "?")
            extensionId = extensionId.split("?")[0];

		getBtn = document.querySelector(`[data-p*="${extensionId}"] button[jsaction*="click"][jsaction*="clickmod"][jsaction*="pointerdown"][jsaction*="pointerup"][jsaction*="pointerenter"][jsaction*="pointerleave"][jsaction*="pointercancel"][jsaction*="contextmenu"][jsaction*="focus"][jsaction*="blur"][disabled=""]`);
		getBtn.removeAttribute("disabled");

		getBtn.addEventListener("click", () => {
			const version = "130.0";
			cdnurl = `https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&prodversion=${version}&x=id%3D${extensionId}%26installsource%3Dondemand%26uc`;
			window.location.href = cdnurl;
		});
	} else if (window.location.href.includes("https://microsoftedge.microsoft.com/addons/")) {
		if (window.location.href.includes("https://microsoftedge.microsoft.com/addons/detail/")) {
			extensionId = window.location.href.split("/").pop();

			if (extensionId.includes = "?")
				extensionId = extensionId.split("?")[0];

			setTimeout(() => {
				getBtn = document.querySelector(`#getOrRemoveButton-${extensionId}`);

				getBtn.removeAttribute("disabled");
				getBtn.style.setProperty ("cursor", "pointer", "important");
				getBtn.style.opacity = 1;

				cdnurl = `https://edge.microsoft.com/extensionwebstorebase/v1/crx?response=redirect&x=id%3D${extensionId}%26installsource%3Dondemand%26uc`;

				getBtn.addEventListener("click", () => {
					window.location.href = cdnurl;
				});
			}, 1500);
		} else {
			// Yes, this runs every half a second, I am too lazy and the buttons get created on hover which is annoying to keep track of.
			setInterval(function() {
				getBtn = document.querySelectorAll(`button[id*="getOrRemoveButton"]`);
				getBtn.forEach(btn => {
					btn.removeAttribute("disabled");
					btn.style.setProperty ("cursor", "pointer", "important");
					btn.style.opacity = 1;

					extensionId = btn.id.split("-").pop();
					cdnurl = `https://edge.microsoft.com/extensionwebstorebase/v1/crx?response=redirect&x=id%3D${extensionId}%26installsource%3Dondemand%26uc`;

					btn.addEventListener("click", () => {
						window.location.href = cdnurl;
					});
				});
			}, 500);
		}
	}
}
enableInstallBtn();

const titleObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if (mutation.type === 'childList')
			enableInstallBtn();
	});
});
titleObserver.observe(document.querySelector('title'), { childList: true });