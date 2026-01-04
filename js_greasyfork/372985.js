// ==UserScript==
// @name         PolitoDownloader
// @namespace    https://github.com/giuseppe-dandrea
// @version      0.15
// @description  Download all your Polito material in one click
// @author       giuseppe-dandrea
// @supportURL   https://github.com/giuseppe-dandrea/PolitoDownloader/issues
// @match        https://didattica.polito.it/pls/portal30/sviluppo.pagina_corso.main*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/372985/PolitoDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/372985/PolitoDownloader.meta.js
// ==/UserScript==

(function() {
	"use strict";

	const URL = "https://didattica.polito.it/pls/portal30/sviluppo.filemgr.handler";

	// List the content of a directory
	// callback(pathList, parentPath, parentZipFolder, downloadAll)
	// pathList contains the objects of the files and dirs
	function listPath(path, code, callback, parentZipFolder, downloadAll) {
		N_FILE++;
		if (path === "/") {
			code = "";
		}
		let params = "?action=list&path=" + encodeURIComponent(path) + "&code=" + code;
		let xhttp = new XMLHttpRequest();

		activeDownloadButton.innerText = "Retrieving files...";

		xhttp.open("POST", URL + params);
		xhttp.send();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				let pathList = JSON.parse(xhttp.responseText);
				pathList = pathList.result.filter(o => !o.name.includes("ZZZZZZZZZZZZZZZZZZZZLezioni on-line"));
				N_FILE--;
				if (pathList.length === 0) {
					return;
				}
				if (callback) callback(pathList, path, parentZipFolder, downloadAll);
			}
		}
	}

	// callback for listPath:
	// for every object in path list:
	//   if the object is a dir: create the dir in the zip and call listFiles in that dir
	//   else download and add the file to the zip
	function listPathHandler(pathList, parentPath, parentFolder, downloadAll) {
		pathList.forEach(o => {
			if (o.type == "dir") {
				// console.log("Created dir " + o.name);
				let newFolder = parentFolder.folder(o.name);
				listPath(parentPath + o.name + "/", o.code, listPathHandler, newFolder, downloadAll);
			} else if (o.type == "file" && (downloadAll || (DOWNLOADED_FILES[o.code] ? o.date > DOWNLOADED_FILES[o.code] : true))) {
				N_FILE++;
				// console.log("Added " + o.name);
				DOWNLOADED_FILES[o.code] = o.date;
				let params = "?action=download&path=" + encodeURIComponent(parentPath + o.name) + "&code=" + o.code;
				let xhttp = new XMLHttpRequest();
				xhttp.open("POST", URL + params);
				xhttp.responseType = "blob";
				xhttp.send();
				xhttp.onreadystatechange = function() {
					if (xhttp.readyState == 4 && xhttp.status == 200) {
						parentFolder.file(o.name, xhttp.response, { binary: true });
						// console.log("1 file added!");
						N_DOWNLOADED++;
						updateProgressBar(( (N_DOWNLOADED + N_PREVIOUS_DOWNLOADED) / TOTAL_FILES ) * 100);
						N_FILE--;
					}
				}
			} else {
				N_PREVIOUS_DOWNLOADED++;
				updateProgressBar(( (N_DOWNLOADED + N_PREVIOUS_DOWNLOADED) / TOTAL_FILES ) * 100);

			}

		});
	}

	function saveFile(blob, name) {
		let a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		let url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = name;
		a.click();
		window.URL.revokeObjectURL(url);
		a.parentNode.removeChild(a);
	}

	function downloadZip(zip, name) {
		// console.log("Inizio a comprimere!");
		zip.generateAsync({ type:"blob" }).then(function(content) {
			saveFile(content, name);
			activeDownloadButton.innerText = activeButtonText;
		});
	}

	function onCompleted(callback) {
		setTimeout(function() {
			// console.log(N_FILE);
			if (N_FILE === 0) {
				activeDownloadButton.innerText = "Downloading...";
				callback();
			} else {
				onCompleted(callback);
			}
		}, 1000);
	}

	function initGlobals(button) {
		zip = new JSZip();
		N_FILE = 0;
		N_DOWNLOADED = 0;
		N_PREVIOUS_DOWNLOADED = 0;
		DOWNLOADED_FILES = GM_getValue("downloadedFiles", {});
		activeDownloadButton = button;
		activeButtonText = button.innerText;
	}

	function onButtonClick(button, downloadAll, failText) {
		initGlobals(button);
		progressBar.parentNode.style.display = "block"
		if (TOTAL_FILES == 0) {
			activeDownloadButton.innerText = "No files!";
			return
		}
		listPath("/", 0, listPathHandler, zip, downloadAll);
		// console.log("File download completed\nStarting onCompleted");
		onCompleted(function() {
			GM_setValue("downloadedFiles", DOWNLOADED_FILES);
			if (N_DOWNLOADED > 0) {
				downloadZip(zip, title);
			} else {
				activeDownloadButton.innerText = failText;
			}
			badge.style.display = "none";
			progressBar.parentNode.style.display = "none"
			updateProgressBar(0);
			GMlastUpdate[code] = lastUpdate;
			GM_setValue("lastUpdate", GMlastUpdate);
		});
	}

	function updateProgressBar(percent) {
		percent = Math.round(percent);
		progressBar.style.width = percent + "%";
		progressBar.setAttribute("aria-valuenow", percent);
	}

	// download all
	let downloadAllButton = document.createElement("button");
	downloadAllButton.innerText = "Download All Files";
	downloadAllButton.setAttribute("id", "downloadAllButton");
	downloadAllButton.setAttribute("class", "btn btn-primary");

	// download new
	let downloadNewButton = document.createElement("button");
	downloadNewButton.innerText = "Download New Files";
	downloadNewButton.setAttribute("id", "downloadNewButton");
	downloadNewButton.setAttribute("class", "btn btn-primary");
	downloadNewButton.style["margin-left"] = "5px";

	// new badge
	let badge = document.createElement("div");
	badge.style.cssText = `
		background: red;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		position: relative;
		z-index: 1000;
		top: -30px;
		left: 142px;
		margin-bottom: -10px;
		display: none;`
	downloadNewButton.append(badge);

	// progress bar
	let progressBarStr = 	'<div class="progress">\
							<div class="progress-bar" id="progressbar" role="progressbar"\
							  aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%">\
							</div>\
						</div>'
	let progressBar = document.createElement("div");
	progressBar.innerHTML = progressBarStr;
	progressBar = progressBar.firstChild.children[0];
	progressBar.parentNode.style.display = "none";
	progressBar.parentNode.style.margin = "10px";

	// page title
	let title = document.querySelector("body > div:nth-child(9) > div > div > h2 > strong").innerText;
	let code = title.match(/\w+/)[0];
	let TOTAL_FILES = 0;

	let lastUpdate = 0;
	let GMlastUpdate = GM_getValue("lastUpdate", {});

	// Code of the root directory, used to obtain TOTAL_FILES and lastUpdate
	let rootCode = document.documentElement.innerHTML.match(/rootCode: "(\d+)/)[1];
	if (rootCode) {
		GM_xmlhttpRequest({
			method: "POST",
			url:    "https://didattica.polito.it/pls/portal30/sviluppo.filemgr.get_process_amount?items=" + rootCode,
			onload: function(resp) {
				let result = JSON.parse(resp.response).result;
				TOTAL_FILES = result.files;
				lastUpdate = Date.parse(result.lastUpload);
				if (!GMlastUpdate[code] || GMlastUpdate[code] < lastUpdate) {
					badge.style.display = "block";
				}
			}
		});
	}

	// center tag
	let centerTag = document.createElement("center");
	centerTag.appendChild(downloadAllButton);
	centerTag.appendChild(downloadNewButton);
	document.querySelector("#portlet_corso_container > div > div > div.row.text-left > div > div:nth-child(2)").prepend(centerTag);
	centerTag.parentNode.insertBefore(progressBar.parentNode, centerTag.nextSibling)

	// global vars
	let zip;
	let N_FILE;
	let N_DOWNLOADED;
	let N_PREVIOUS_DOWNLOADED;
	let DOWNLOADED_FILES;
	let activeDownloadButton;
	let activeButtonText;

	// download all listener
	document.getElementById("downloadAllButton").onclick = function() {
		onButtonClick(downloadAllButton, true, "No files!");
	}

	// download new listener
	document.getElementById("downloadNewButton").onclick = function() {
		onButtonClick(downloadNewButton, false, "No new files!");
	}
})();
