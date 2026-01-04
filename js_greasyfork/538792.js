// ==UserScript==
// @name         Whatsapp Bulk Image downloader
// @namespace    http://tampermonkey.net/
// @version      2025-06-08
// @description  Download Whatsapp Web albums in bulk
// @author       You
// @match        https://web.whatsapp.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whatsapp.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538792/Whatsapp%20Bulk%20Image%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/538792/Whatsapp%20Bulk%20Image%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

	let downloading = false;

	function performDownload(downloadButtonLi, nextImage){
		downloadButtonLi.click();

		if(!nextImage){ return; }

		const nextButtonDiv = document.querySelector("div.overlay > div > div > div > div[aria-label=Next]");
		setTimeout(() => {
			nextButtonDiv.click();

			setTimeout(() => {
				const menuButton = document.querySelector("div.overlay > div > div > div > div > button[title=Menu]");
				menuButton.click(); // open menu -> triggers MutationObserver
			}, 500);
		}, 100);
	}

	function onMutation(mutation, observer){
		if(mutation.target.tagName !== "SPAN"){ return; }

		let iDownloadButton = -1;
		for(let [index, span] of mutation.target.querySelectorAll("div > ul > div > div > li > div > span").entries()){
			if(span.innerText === "Download"){ iDownloadButton = index; }
		}
		if(iDownloadButton < 0){ return; }

		const downloadButtonDiv = mutation.target.querySelectorAll("div > ul > div > div")[iDownloadButton];
		const downloadButtonLi = downloadButtonDiv.querySelector("li");

		let progressSpan = document.querySelector("div.overlay > div > div > p > div > span");
		let regexResult = /^([0-9]+)(?:.*?)([0-9]+)$/gm.exec(progressSpan.innerText);
		let nextDownloading = regexResult.length === 3 && regexResult[1] !== regexResult[2];

		if(downloading){
			performDownload(downloadButtonLi, nextDownloading);
		}else{
			let clonedDiv = downloadButtonDiv.cloneNode(true);
			clonedDiv.querySelector("li").style.opacity = "1";
			clonedDiv.querySelector("li > div > span").innerText = "Download from here";

			downloadButtonDiv.after(clonedDiv);

			clonedDiv.querySelector("li").onclick = () => {	performDownload(downloadButtonLi, nextDownloading); }
		}

		downloading = nextDownloading;
	}

	function onMutations(mutations, observer){
		for(let mutation of mutations){ onMutation(mutation, observer); }
	}

	function main(){
		const body = document.querySelector("body");
		const observer = new MutationObserver(onMutations);
		observer.observe(body, { attributes: false, childList: true, subtree: true });
    }

    if (document.readyState === `loading`) {
        document.addEventListener(`DOMContentLoaded`, main);
    } else {
        main();
    }

})();