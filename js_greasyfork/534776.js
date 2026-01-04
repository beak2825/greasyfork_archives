// ==UserScript==
// @name        ComicWalkerRipper
// @namespace   adrian
// @author      adrian
// @match       https://comic-walker.com/*
// @version     1.1
// @description Download Images From Comic-Walker
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @require     https://unpkg.com/@zip.js/zip.js@2.7.60/dist/zip-full.min.js
// @grant       GM_registerMenuCommand
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/534776/ComicWalkerRipper.user.js
// @updateURL https://update.greasyfork.org/scripts/534776/ComicWalkerRipper.meta.js
// ==/UserScript==

const createKey = (hash) => {
	const parts = hash.slice(0, 16).match(/[\da-f]{2}/gi);
	return new Uint8Array(parts.map((data) => Number.parseInt(data, 16)));
};

function createXorFunc(key) {
	return (image) => {
		const { length: imageLength } = image;
		const { length: keyLength } = key;
		const decrypted = new Uint8Array(imageLength);
		for (let index = 0; index < imageLength; index += 1)
			decrypted[index] = image[index] ^ key[index % keyLength];
		return decrypted;
	};
}

function toPng(webp) {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		const image = new Image();
		image.src = URL.createObjectURL(new Blob([webp]));
		image.crossOrigin = "anonymous";
		image.onload = (e) => {
			canvas.width = image.width;
			canvas.height = image.height;
			URL.revokeObjectURL(e.target.src);
			context.drawImage(e.target, 0, 0, canvas.width, canvas.height);
			canvas.toBlob(
				(data) => {
					resolve(data);
				},
				"image/png",
				100,
			);
		};
		image.onerror = (e) => reject(e);
	});
}

const downloadImages = async (id, title) => {
	if (
		!/https:\/\/comic-walker\.com\/detail\/.*\/episodes\/.*/.test(
			window.location.href,
		)
	)
		return;
	const progressBar = document.createElement("div");
	progressBar.id = "dl-progress";
	progressBar.textContent = "Starting...";
	progressBar.style.padding = "20px";
	progressBar.style.backgroundColor = "black";
	progressBar.style.borderRadius = "10px";
	progressBar.style.border = "1px solid white";
	progressBar.style.boxShadow = "0 25px 50px -12px rgb(0 0 0 / 0.25)";
	progressBar.style.position = "fixed";
	progressBar.style.left = "50%";
	progressBar.style.top = "50%";
	progressBar.style.transform = "translate(-50%,-50%)";
	progressBar.style.zIndex = "9999";
	progressBar.style.fontSize = "20px";
	progressBar.style.color = "white";
	document.body.appendChild(progressBar);
	let episodeId;
	if (id) {
		episodeId = id;
	} else {
		const currentPath = window.location.pathname;
		const pathSplit = currentPath.split("/");
		const episodeCode = pathSplit.pop();
		pathSplit.pop();
		const workCode = pathSplit.pop();
		const episodeData = await fetch(
			`https://comic-walker.com/api/contents/details/episode?episodeCode=${episodeCode}&workCode=${workCode}&episodeType=latest`,
		).then((res) => res.json());
		episodeId = episodeData.episode.id;
	}

	if (!episodeId) {
		progressBar.textContent = "unable to find episodeId.";
		setTimeout(() => progressBar.remove(), 1000);
	}
	console.log(episodeId);

	const apiData = await fetch(
		`https://comic-walker.com/api/contents/viewer?episodeId=${episodeId}&imageSizeType=width:1284`,
	).then((res) => res.json());

	const images = apiData.manuscripts;
	console.log(images);
	progressBar.textContent = `${images.length} images found.`;
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), {
		bufferedWrite: true,
	});
	for (let i = 0; i < images.length; i++) {
		const image = images[i];
		const xorKey = createKey(image.drmHash);
		const xorFunc = createXorFunc(xorKey);
		const response = await fetch(image.drmImageUrl);
		if (!response.ok) {
			progressBar.textContent = `failed to fetch image ${i + 1}/${images.length}`;
			throw new Error("Failed to fetch image");
		}
		const arrayBuffer = await response.arrayBuffer();
		const decryptedData = xorFunc(new Uint8Array(arrayBuffer));
		zipWriter.add(
			`${i + 1}.png`,
			new zip.BlobReader(await toPng(decryptedData)),
			{},
		);
		progressBar.textContent = `fetched and decrypted image ${i + 1}/${images.length}`;
		console.log("done with ", i + 1);
	}
	console.log("image fetching done. generating zip");
	progressBar.textContent = "image fetching done. generating zip";
	const blobURL = URL.createObjectURL(await zipWriter.close());
	const link = document.createElement("a");
	link.href = blobURL;
	link.download = `${title || document.title}.zip`;
	link.click();
	progressBar.textContent = "done.";
	setTimeout(() => progressBar.remove(), 1000);
};

function waitForElement(selector, callback) {
	const observer = new MutationObserver((mutations, observer) => {
		const element = document.querySelector(selector);
		if (element) {
			observer.disconnect();
			callback(element);
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
}

function onChangeElement(selector, callback) {
	const observer = new MutationObserver((mutations, observer) => {
		const element = document.querySelector(selector);
		if (element) {
			callback(element);
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
}

onChangeElement("._mainScreen_kodus_7", (element) => {
	if (element.querySelector("#dl-button")) return;
	const dlButton = document.createElement("button");
	dlButton.id = "dl-button";
	dlButton.textContent = "Download";
	dlButton.style.padding = "5px 12px";
	dlButton.style.backgroundColor = "#ef0029";
	dlButton.style.borderRadius = "8px";
	dlButton.style.border = "3px solid #000";
	dlButton.style.boxShadow = "0 4px 0 #000";
	dlButton.style.position = "absolute";
	dlButton.style.right = "5px";
	dlButton.style.bottom = "50px";
	dlButton.style.zIndex = "9999";
	dlButton.style.fontSize = ".75rem";
	dlButton.style.fontWeight = "800";
	dlButton.style.color = "white";
	dlButton.addEventListener("click", () => downloadImages());
	element.appendChild(dlButton);
});

waitForElement("._mainScreen_kodus_7", (element) => {
	if (element.querySelector("#dl-button")) return;
	const dlButton = document.createElement("button");
	dlButton.id = "dl-button";
	dlButton.textContent = "Download";
	dlButton.style.padding = "5px 12px";
	dlButton.style.backgroundColor = "#ef0029";
	dlButton.style.borderRadius = "8px";
	dlButton.style.border = "3px solid #000";
	dlButton.style.boxShadow = "0 4px 0 #000";
	dlButton.style.position = "absolute";
	dlButton.style.right = "5px";
	dlButton.style.bottom = "50px";
	dlButton.style.zIndex = "9999";
	dlButton.style.fontSize = ".75rem";
	dlButton.style.fontWeight = "800";
	dlButton.style.color = "white";
	dlButton.addEventListener("click", () => downloadImages());
	element.appendChild(dlButton);
});

const addButtons = async (element) => {
	const currentPath = window.location.pathname;
	const pathSplit = currentPath.split("/");
	pathSplit.pop();
	pathSplit.pop();
	const workCode = pathSplit.pop();
	const workData = await fetch(
		`https://comic-walker.com/api/contents/details/work?workCode=${workCode}`,
	).then((res) => res.json());
	const episodes = {};
	// biome-ignore lint/complexity/noForEach: <explanation>
	workData.latestEpisodes.result.forEach((episode) => {
		episodes[`${episode.title}　${episode.subTitle}`] = episode.id;
	});
	// biome-ignore lint/complexity/noForEach: <explanation>
	workData.firstEpisodes.result.forEach((episode) => {
		episodes[`${episode.title}　${episode.subTitle}`] = episode.id;
	});
	const episodeElements = element.querySelectorAll(
		".EpisodeThumbnail_infoWrapper__XWQHA",
	);
	for (const episode of episodeElements) {
		const episodeTitle = episode.querySelector(
			".EpisodeThumbnail_title__G1eWj",
		);
		if (episode.querySelector("#dl-button")) continue;
		if (!episodes[episodeTitle.textContent]) continue;
		const button = document.createElement("button");
		button.textContent = "Download";
		button.id = "dl-button";
		button.style.padding = "5px 12px";
		button.style.height = "fit-content";
		button.style.backgroundColor = "#ef0029";
		button.style.borderRadius = "8px";
		button.style.border = "3px solid #000";
		button.style.boxShadow = "0 4px 0 #000";
		button.style.zIndex = "9999";
		button.style.fontSize = ".75rem";
		button.style.fontWeight = "800";
		button.style.transform = "translateY(-3px)";
		button.style.color = "white";
		button.style.margin = "auto 0";
		button.addEventListener(
			"click",
			(e) => {
				e.preventDefault();
				e.stopPropagation();
				downloadImages(
					episodes[episodeTitle.textContent],
					episodeTitle.textContent.endsWith("　")
						? episodeTitle.textContent.slice(0, -1)
						: episodeTitle.textContent,
				);
			},
			false,
		);
		episode.style.gridTemplateColumns = "1fr min-content";
		episode.appendChild(button);
	}
};

waitForElement(".ContentsDetailPage_episodeList__kOQID", (element) => {
	addButtons(element);
	const observer = new MutationObserver((mutations, observer) => {
		const element = document.querySelector(
			".ContentsDetailPage_episodeList__kOQID",
		);
		if (element) {
			addButtons(element);
		}
	});

	observer.observe(element, {
		childList: true,
		subtree: true,
	});
});

VM.shortcut.register("cm-s", () => downloadImages());
VM.shortcut.enable();

GM_registerMenuCommand("Download Images (Ctrl/Cmd + S)", () =>
	downloadImages(),
);
