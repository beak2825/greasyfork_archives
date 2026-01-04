"use strict";
// ==UserScript==
// @name         De Gruyter Downloader
// @namespace    https://pcdi.github.io
// @version      1.1.0
// @description  Batch download single chapter PDFs for De Gruyter books
// @author       Philipp Immel
// @license      GPL-3.0-or-later
// @match        https://www.degruyter.com/*/html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=degruyter.com
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/518248/De%20Gruyter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/518248/De%20Gruyter%20Downloader.meta.js
// ==/UserScript==
function downloadPdfs() {
    let pdfLinks = document.getElementsByClassName("downloadPdf");
    for (const link of pdfLinks) {
        GM_download({
            url: link.href,
            name: document.querySelector("[name=citation_title][content]")?.content +
                "/" +
                link.dataset.doi?.replaceAll("/", "_") +
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
    document.getElementsByTagName("h1")[0]?.append(btn);
})();
