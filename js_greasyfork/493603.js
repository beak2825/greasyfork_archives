// ==UserScript==
// @name        championcross.jp chapter downloader
// @namespace   https://championcross.jp/episodes/
// @match       https://championcross.jp/episodes/*
// @version     1.1.3
// @author      ssrankedghoul
// @description Downloads all images of a chapter on championcross.jp
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/493603/championcrossjp%20chapter%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/493603/championcrossjp%20chapter%20downloader.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
(() => {
	/**
	 * Deshuffles an image and returns it's blob
	 * @param {string} url url of the image
	 * @param {number[]} scramble array of places in the image
	 * @returns {Promise<Blob>}
	 */
	async function deshuffle(url, scramble) {
		const canvas = document.createElement("canvas"),
			c2d = canvas.getContext("2d"),
			img = await new Promise((resolve) => {
				const img = new Image();
				img.src = url;
				img.crossOrigin = "anonymous";
				img.onload = () => resolve(img);
			}),
			{ width, height } = img;
		canvas.width = width;
		canvas.height = height;
		c2d.imageSmoothingQuality = "high";
		c2d.imageSmoothingEnabled = true;
		const tileW = Math.floor(width / 4),
			tileH = Math.floor(height / 4);
		for (let x = 0; x < 4; x++) {
			for (let y = 0; y < 4; y++) {
				const tileI = scramble[x * 4 + y];
				c2d.drawImage(
					img,
					tileW * Math.floor(tileI / 4), // sx
					tileH * (tileI % 4), // sy
					tileW, // sWidth
					tileH, // sHeight
					tileW * x, // dx
					tileH * y, // dy
					tileW, // dWidth
					tileH, // dHeight
				);
			}
		}
		return new Promise((resolve) => {
			canvas.toBlob((blob) => resolve(blob));
		});
	}
	async function saveImagesAsZip() {
		alert("downloading...");
		const a = document.createElement("a"),
			jsZip = new JSZip();
		const viewerId = document
			.querySelector("#comici-viewer")
			.getAttribute("comici-viewer-id");
		const _fetch = (pageTo) =>
			fetch(
				`https://championcross.jp/book/contentsInfo?user-id=${
					document.querySelector("#login_user_id").textContent || 0
				}&comici-viewer-id=${viewerId}&page-from=0&page-to=${pageTo || 0}`,
				{ credentials: "include", mode: "cors" },
			);
		const totalPages = (await _fetch().then((res) => res.json())).totalPages;
		const pages = (
			await _fetch(totalPages).then((res) => res.json())
		).result.map((page) => ({
			url: page.imageUrl,
			scramble: JSON.parse(page.scramble),
		}));
		const blobs = await Promise.all(
			pages.map(({ url, scramble }) => deshuffle(url, scramble)),
		);
		for (let i = 0; i < blobs.length; i++) {
			jsZip.file(`${i + 1}.jpg`, blobs[i]);
		}
		jsZip.generateAsync({ type: "blob" }).then((content) => {
			a.href = URL.createObjectURL(content);
			a.download = `championcross-${document.title || viewerId}.zip`;
			a.click();
			URL.revokeObjectURL(a.href);
		});
	}
	window.addEventListener("load", () => {
		if (
			window.location.href.split("?")[0].replace(/\/$/, "").split("/").pop()
				.length !== 13
		)
			return;
		let i = 0;
		const interval = setInterval(() => {
			i++;
			const anchorButton = document.querySelector(".article-section");
			if (i > 10) {
				clearInterval(interval);
				return alert("could not find download button");
			}
			if (document.querySelector("#downloadButton"))
				return clearInterval(interval);
			if (!anchorButton) return;
			clearInterval(interval);
			const downloadButtonContainer = document.createElement("div"),
				downloadButton = document.createElement("div"),
				downloadButtonText = document.createElement("span");
			downloadButtonContainer.className = "download";
			downloadButton.id = "downloadButton";
			downloadButtonText.textContent = "Download ↓";
			downloadButton.onclick = saveImagesAsZip;
			document.head.insertAdjacentHTML(
				"beforeend",
				`<style>
            #downloadButton {
                border: 1px solid #663399;
                line-height: 0 !important;
                height: 30px !important;
                width: 150% !important;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                box-shadow: 0 0 5px #663399;
                box-sizing: border-box;
                border-radius: 5px;
            }
            #downloadButton:hover {
                background-color: #00ced1;
            }
        </style>`,
			);
			downloadButton.appendChild(downloadButtonText);
			downloadButtonContainer.appendChild(downloadButton);
			anchorButton.insertAdjacentElement("afterend", downloadButtonContainer);
		}, 1000);
	});
})();
