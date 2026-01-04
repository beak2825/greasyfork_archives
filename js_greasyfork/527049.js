// ==UserScript==
// @name         Hentairead.com - Download manga as zip
// @version      1.1
// @description  Adds a Download button to the top-right of the manga reader that downloads the entire manga as a zip
// @namespace    wierd4life
// @author       wierd4life
// @license      public
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @match        *://hentairead.com/hentai/*
// @downloadURL https://update.greasyfork.org/scripts/527049/Hentaireadcom%20-%20Download%20manga%20as%20zip.user.js
// @updateURL https://update.greasyfork.org/scripts/527049/Hentaireadcom%20-%20Download%20manga%20as%20zip.meta.js
// ==/UserScript==
(async ()=>{
	const { readingNav } = unsafeWindow ?? window;
	
	// Assets
	// Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools
	const downloadIconSvg = `
	<svg class="inline-block mb-1" width="15px" height="15px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M550.4 682.816L778.688 448l53.312 54.848L512 832 192 502.848 245.312 448 473.6 682.816V64h76.8v618.816zM192 883.2h640V960H192v-76.8z" fill="currentColor" /></svg>
	`;
	
	// Setup UI
	const BTN_PROGRESS_ID = "w4l-dl-progress";
	const topNavButtons = document.querySelector("#readingNavTop h1+div");
	const downloadButton = document.createElement("button");
	downloadButton.className = "rounded-lg bg-gray-800 bg-opacity-60 btn h-[40px] hover:bg-gray-800";
	downloadButton.innerHTML = `${downloadIconSvg}<span class="hidden md:inline">DOWNLOAD<span id="${BTN_PROGRESS_ID}"></span></span>`;
	topNavButtons.prepend(downloadButton);
	downloadButton.addEventListener('click', function(){ startMangaDownload(); })
	
	// Download Logic
	async function startMangaDownload() {
		downloadButton.disabled = true;
		const zip = new JSZip();
		for (let i = 0; i < readingNav.totalPages; i++) {
			const urlData = readingNav.getImg(i+1);
			const url = readingNav.getImgUrl(urlData);
			const blobUrl = await fetchImageBlobUrl(url);
			const blob = await fetch(blobUrl).then(resp=>resp.blob())
			zip.file(`${i.toString().padStart(3, '0')}.webp`, blob, {base64: true});
			document.getElementById(BTN_PROGRESS_ID).innerHTML = `<span class="ml-1 sm">${i+1}/${readingNav.totalPages}</span>`;
			await sleep(0.2); // Delay to avoid hitting the server to fast
		}

		zip.generateAsync({type:"blob"}).then(function(content) {
			saveAs(content, `${readingNav.manga.title}.zip`);
			downloadButton.disabled = false;
			document.getElementById(BTN_PROGRESS_ID).innerHTML = "";
		}).catch((e)=>{
			alert(JSON.stringify(e));
			downloadButton.disabled = false;
			document.getElementById(BTN_PROGRESS_ID).innerHTML = "";
		});
	}
	
	// Helpers
	async function fetchImageBlobUrl(url) { return axios.get(url, { responseType: "blob", headers: { Accept: "image/webp,image/*" } }).then(resp => URL.createObjectURL(resp.data)) }
	
	async function sleep(seconds) { return new Promise((res)=>setTimeout(res,seconds*1000)) }
})()