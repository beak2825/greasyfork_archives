// ==UserScript==
// @name         Quick Pack Downloader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to quickly download a pack when in song search.
// @author       eM-Krow w/ assistance from NNNN
// @match        *://etternaonline.com/song/search/?query=*
// @icon         https://www.google.com/s2/favicons?domain=etternaonline.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/431886/Quick%20Pack%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/431886/Quick%20Pack%20Downloader.meta.js
// ==/UserScript==

$("document").ready(() => {
	const cachePackDB = () => {
		return new Promise((resolve, reject) => {
			console.log("Caching packlist...")
			let n = new XMLHttpRequest();
			n.open("GET", "https://etternaonline.com/pack/packlist");
			n.addEventListener("readystatechange", t => {
				let res = t.target;
				if (res.readyState === XMLHttpRequest.DONE && res.status === 200) {
					let packList = JSON.parse(res.responseText);
					for (let i = 0; i < packList.data.length; i++) {
						window.localStorage.setItem(packList.data[i].packname.split('"')[1], packList.data[i].download.split('"')[1]);
					}
					resolve();
				}
			});
			n.send();
		});
	};
	const checkStorage = async (packURL) => {
		let item = window.localStorage.getItem(packURL);
		if (item === null) {
			await cachePackDB();
			return window.localStorage.getItem(packURL);
		} else {
			return item;
		}
	};
	const main = async () => {
		let tableLinks = $("td").find("a");
		for (let i = 0; i < tableLinks.length; i++) {
			if (tableLinks[i].href.toLowerCase().startsWith("https://etternaonline.com/pack/")) {
				$(tableLinks[i]).before('<a download class="packDownloadAnchor" href="' + (await checkStorage(tableLinks[i].href)) + '"><span class="glyphicon glyphicon-cloud-download"></span></a> ');
			}
		}
	}
	main();
    const downloadPacks = () => {
        let uniquePacks = [];
        document.querySelectorAll(".packDownloadAnchor").forEach((pack) => {
            let exists = false;
            for (let i = 0; i < uniquePacks.length; i++) {
                if (uniquePacks[i].href == pack.href) exists = true;
            }
            if (!exists) uniquePacks.push(pack);
        });
        for (let i = 0; i < uniquePacks.length; i++) {
            uniquePacks[i].target = "_blank";
            uniquePacks[i].click();
            uniquePacks[i].target = "";
        }
    };

    window.downloadPacks = downloadPacks;

    $("h3:contains('Search Results')").after('<style type="text/css"> .packDownloadAnchor:hover { cursor:pointer; } </style> <div><a class="packDownloadAnchor" onmouseup="downloadPacks();"><span class="glyphicon glyphicon-cloud-download"></span> Download All Unique Packs</a></div> <br> <br> ');
});