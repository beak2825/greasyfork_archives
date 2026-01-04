// ==UserScript==
// @name        NewtokiRipper
// @namespace   adrian
// @author      adrian
// @match       https://newtoki468.com/webtoon/*
// @include     /^https:\/\/newtoki[0-9]+\.com\/webtoon/.*$/
// @version     1.4
// @description Download Images From Newtoki
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @require     https://unpkg.com/@zip.js/zip.js@2.7.60/dist/zip-full.min.js
// @grant       GM_registerMenuCommand
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/534773/NewtokiRipper.user.js
// @updateURL https://update.greasyfork.org/scripts/534773/NewtokiRipper.meta.js
// ==/UserScript==

const fetchImage = async (url, name) => {
	const blob = await fetch(url, {
		headers: {
			accept:
				"image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
			"accept-language": "en-US,en;q=0.9",
			"sec-ch-ua": '"Chromium";v="135", "Not-A.Brand";v="8"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": '"macOS"',
			"sec-fetch-dest": "image",
			"sec-fetch-mode": "no-cors",
			"sec-fetch-site": "cross-site",
			"sec-fetch-storage-access": "active",
		},
		referrer: "https://newtoki468.com/",
		referrerPolicy: "strict-origin-when-cross-origin",
		body: null,
		method: "GET",
		mode: "cors",
		credentials: "omit",
	}).then((response) => response.blob());
	return blob;
};

const downloadImages = async () => {
	const images = [...document.getElementsByTagName("img")].flatMap((img) => {
		const attributes = [...img.attributes].filter((attr) =>
			/^data-[a-zA-Z0-9]{1,20}/.test(attr.name),
		);
		const actualSrc = attributes[0]?.value;
		if (actualSrc?.startsWith("https://img1.newtoki")) return [actualSrc];
		return [];
	});
	if (images.length === 0) return;
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
	progressBar.textContent = `${images.length} images found.`;
	console.log(images);
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), {
		bufferedWrite: true,
	});
	console.log("starting zip generation");
    let progress = 1;
    await Promise.all(images.map(async (imageURL, i) => {
    	const imageData = await fetchImage(imageURL, i);
    	zipWriter.add(`${i+1}.jpg`, new zip.BlobReader(imageData), {});
    	console.log(`fetched image ${i+1}/${images.length}`);
    	progressBar.textContent = `fetched image ${progress}/${images.length}`;
    progress++;
    }));
	console.log("image fetching done. generating zip");
	progressBar.textContent = "image fetching done. generating zip";
	const blobURL = URL.createObjectURL(await zipWriter.close());
	const link = document.createElement("a");
	link.href = blobURL;
	link.download = `${document.title}.zip`;
	link.click();
	progressBar.textContent = "done.";
	setTimeout(() => progressBar.remove(), 1000);
};

VM.shortcut.register("cm-s", downloadImages);
VM.shortcut.enable();

GM_registerMenuCommand("Download Images (Ctrl/Cmd + S)", downloadImages);

const images = [...document.getElementsByTagName("img")].flatMap((img) => {
	const attributes = [...img.attributes].filter((attr) =>
		/^data-[a-zA-Z0-9]{1,20}/.test(attr.name),
	);
	const actualSrc = attributes[0]?.value;
	if (actualSrc?.startsWith("https://img1.newtoki")) return [actualSrc];
	return [];
});
if (images.length > 0) {
	const dlButton = document.createElement("button");
	dlButton.id = "dl-button";
	dlButton.textContent = "Download";
	dlButton.style.padding = "5px 12px";
	dlButton.style.backgroundColor = "#ef0029";
	dlButton.style.borderRadius = "8px";
	dlButton.style.border = "3px solid #000";
	dlButton.style.boxShadow = "0 4px 0 #000";
	dlButton.style.position = "fixed";
	dlButton.style.right = "130px";
	dlButton.style.bottom = "10px";
	dlButton.style.zIndex = "9999";
	dlButton.style.fontSize = "15px";
	dlButton.style.fontWeight = "800";
	dlButton.style.color = "white";
	dlButton.addEventListener("click", downloadImages);
	document.body.appendChild(dlButton);
}
