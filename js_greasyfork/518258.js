"use strict";
// ==UserScript==
// @name         Oxford University Press Downloader
// @namespace    https://pcdi.github.io
// @version      1.0.0
// @description  Batch download single chapter PDFs for OUP books
// @author       Philipp Immel
// @license      GPL-3.0-or-later
// @match        https://academic.oup.com/*/book/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=academic.oup.com
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/518258/Oxford%20University%20Press%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/518258/Oxford%20University%20Press%20Downloader.meta.js
// ==/UserScript==
function downloadPdfs() {
    let pdfLinks = document.getElementsByClassName("tocLink js-nav-tree-link");
    for (const link of pdfLinks) {
        GM_download({
            url: link.href + "/chapter-ag-pdf",
            name: document.querySelector("[name=citation_title][content]")?.content +
                "/" +
                link.dataset.resourceIdAccess?.replaceAll("/", "_") +
                ".pdf",
            saveAs: false,
        });
    }
}
(function () {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Download PDFs";
    btn.id = "downloadPdfs";
    btn.addEventListener("click", downloadPdfs);
    document.getElementById("Toolbar")?.appendChild(btn);
})();
