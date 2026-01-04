// ==UserScript==
//
// @name Redgif downloader
//
// @description Gather all information about video / gif and create a download button in the sidebar of videos / gif
//
// @match https://*.redgifs.com/*
//
// @namespace RedGifsDownloader
// @author Surya
// @license MIT
// @version 1.0.2
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/480066/Redgif%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/480066/Redgif%20downloader.meta.js
// ==/UserScript==
function getVideoDownloadMod() {
    let parentNodes = document.getElementsByClassName("GifPreview_isVideo");
    console.log(`parent nodes = ${parentNodes.length}`);
    for (let i = 0; i < parentNodes.length; i++) {
      if (parentNodes[i].getElementsByClassName("download-mod").length != 0) {
        return;
      }
      let downloadLink = parentNodes[i].getElementsByClassName("GifPreview-BackdropWrap")[0].children[0].src;
      downloadLink = downloadLink.replace("-mobile", "").replaceAll(".jpg", ".mp4");
      let sideBar = parentNodes[i].getElementsByClassName("SideBar")[0];
      var downloadListItem = document.createElement("li");
      downloadListItem.className = "SideBar-Item"
      downloadListItem.innerHTML = `<div class="download-mod"><img src="https://www.svgrepo.com/download/489722/download.svg" style="width: 32px; color: white;filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(86deg) brightness(116%) contrast(83%); cursor:pointer;" onclick="window.open('${downloadLink}')"></div>`;
      sideBar.appendChild(downloadListItem);
    }
}


const download_mod_video = (path, filename) => {
    // Create a new link
    const anchor = document.createElement('a');
    anchor.href = path;
    anchor.download = filename;

    // Append to the DOM
    document.body.appendChild(anchor);

    // Trigger `click` event
    anchor.click();

    // Remove element from DOM
    document.body.removeChild(anchor);
};


setInterval(() => {
    getVideoDownloadMod();
}, 1000);
