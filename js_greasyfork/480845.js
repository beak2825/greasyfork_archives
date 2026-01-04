// ==UserScript==
// @name         Moodle securepdf downloader
// @namespace    https://greasyfork.org/pl/users/389583-adrian080
// @version      0.0.2
// @description  Downloads all pages of locked pdf (securepdf) as images at once.
// @author       Adrian080
// @match        https://*/mod/securepdf/*
// @icon         https://moodle.org/pluginfile.php/50/local_plugins/plugin_logo/2582/icon_48.png
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/480845/Moodle%20securepdf%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/480845/Moodle%20securepdf%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Get the document id
    const id = new URLSearchParams(document.location.search).get("id");
    //Get page count
    const pages = parseInt(document.querySelector('div.mod_securepdf_pages').innerText.split('/')[1]);
    //File naming convention
    let fileName = '';

    //Add styles
    const style = document.createElement('style');
    style.innerHTML = '#securepdf-download-button{background-color:#1177d1;color:white;display:inline-block;border-radius:.5rem;font-size:1.2rem;padding:.4rem;margin:.2rem;cursor:pointer;transition:all 250ms}#securepdf-download-button:hover{transform:scale(1.1,1.1);background-color:#135c9c}@keyframes popup-box{from{opacity:0;top:-20rem}to{opacity:1;top:0}}@keyframes popup-box-bg{from{background:rgba(0,0,0,0)}to{background:rgba(0,0,0,.5)}}#securepdf-popup{line-height:normal !important;animation-name:popup-box-bg;animation-duration:.8s;color:#fff;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.5);width:100%;height:100%;position:fixed;text-align:center;top:0;left:0;z-index:69691}#securepdf-popup>div{animation-name:popup-box;animation-duration:.8s;background-color:#323232;box-shadow:0 0 1.5rem .3rem #969696;height:auto;max-width:50%;vertical-align:middle;position:relative;border-radius:1rem;padding:1.5rem}#securepdf-popup #popup-title{color:#0090ff;font-size:1.3rem;font-weight:bolder}#securepdf-popup #securepdf-page-count{font-size:1.1rem;color:#00a0ff}#securepdf-popup .buttons-container{width:60%;margin:0 auto}#securepdf-popup button{display:block;width:100%;margin:.4rem;padding:.4rem;color:#fff;font-weight:bolder;background-color:#0069ff;border:0;border-radius:.4rem;transition:all 250ms}#securepdf-popup button:hover{background-color:#05f;transform:scale(1.1,1.1)}#popup-close-button{background-color:#1e1e1e;border-radius:100%;display:inline-block;font-family:arial;font-weight:bolder;position:absolute;top:-1rem;right:-1rem;font-size:2rem;padding:0 .6rem;cursor:pointer}#popup-close-button:hover{background-color:#000e36}#securepdf-popup input{border-radius:.3rem;padding:.1rem;width:16ch}';
    document.getElementsByTagName('head')[0].appendChild(style);

    //Create download button
    const downloadButton = document.createElement("span");
    downloadButton.setAttribute("id", "securepdf-download-button");
    downloadButton.innerHTML = "Download PDF";
    document.querySelectorAll('div[role=main]')[0].prepend(downloadButton);

    //Create pop-up
    const popUp = document.createElement("div");
    popUp.setAttribute("id", "securepdf-popup");
    popUp.innerHTML = '<div> <div id=popup-close-button>×</div> <div id=popup-title>Download Secure PDF pages as images</div> <br> Check your browser settings for downloading! <br> Turn off asking for each file and choose prefered folder. <br><br> Detected number of pages: <span id=securepdf-page-count></span> <br><br> <label for="file-naming-convention">Naming convention: </label><input type="text" id="file-naming-convention"> (+ page number) <br><br> <div class=buttons-container> <button id=securepdf-download-all>Download all</button> </div> </div>';
    document.getElementsByTagName("body")[0].prepend(popUp);

    const popupBox = document.getElementById("securepdf-popup");
    const popupContent = document.querySelector("#securepdf-popup div");
    const popupClose = document.getElementById("popup-close-button");
    const pageCount = document.getElementById("securepdf-page-count");
    const title = document.getElementById("popup-title");
    const downloadAllButton = document.getElementById("securepdf-download-all");
    const fileNameInput = document.getElementById("file-naming-convention");

    downloadButton.addEventListener("click", ()=>{
        popupBox.style.display = "flex";
        pageCount.innerHTML = pages;
    });
    popupBox.addEventListener("click", ()=>{
        if(!popupContent.matches(":hover") || popupClose.matches(":hover")){
            popupBox.style.display = "none";
        }
    });
    downloadAllButton.addEventListener("click", ()=>{
        fileName = fileNameInput.value;
        downloadSecurePdfPage(0);
        popupBox.style.display = "none";
    });
    const downloadSecurePdfPage = (currentPage) => {
        if (currentPage < pages) {
            fetch(`https://eportal.pwr.edu.pl/mod/securepdf/view.php?id=${id}&page=${currentPage}`)
                .then((res) => (res.text()))
                .then((res) => {
                    downloadFile(getImageSource(res), fileName + (currentPage + 1));
                    setTimeout(() => downloadSecurePdfPage(currentPage + 1), 1000);
            });
        }
    }
    const getImageSource = (innerHTML) => {
        const docfrag = document.createDocumentFragment();
        const html = document.createElement('html');
        html.innerHTML = innerHTML;
        for (let i = 0; 0 < html.childNodes.length;) {
            docfrag.appendChild(html.childNodes[i]);
        }
        return docfrag.querySelector('div[role=main] img').src;
    }
    const downloadFile = (content, name) => {
        const downloadLink = document.createElement("a");
        downloadLink.href = content;
        downloadLink.download = name;
        downloadLink.click();
    }
})();