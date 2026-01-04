// ==UserScript==
// @name        File Downloader for SD
// @namespace   Violentmonkey Scripts
// @match       https://www.studydrive.net/*/doc/*
// @grant       none
// @version     1.2
// @author      Soenke Janssen
// @license     MIT
// @description Download Studydrive files.
// @downloadURL https://update.greasyfork.org/scripts/480565/File%20Downloader%20for%20SD.user.js
// @updateURL https://update.greasyfork.org/scripts/480565/File%20Downloader%20for%20SD.meta.js
// ==/UserScript==

let fileURL;

function openLink() {
    if (fileURL) {
        window.open(fileURL);
    }
}

function replaceButton() {
    let downloadButton = document.querySelector('[data-specific-auth-trigger="download"]');
    let buttonCopy;

    if (downloadButton) {
        buttonCopy = downloadButton.cloneNode(true);
        buttonCopy.addEventListener('click', openLink);
        buttonCopy.title = 'Download';
        downloadButton.parentNode.replaceChild(buttonCopy, downloadButton);
    }

    observer.disconnect();
}

const onMutation = (mutationList, observer) => {
    let downloadButton = document.querySelector('[data-specific-auth-trigger="download"]');

    if (downloadButton) {
        replaceButton();
    }
};

document.addEventListener("pagesloaded", function () {
    PDFViewerApplication.pdfDocument.getData().then(data => {
        var file = new Blob([data], { type: 'application/pdf' });
        fileURL = URL.createObjectURL(file);
    });

});

const observer = new MutationObserver(onMutation);

observer.observe(document, { childList: true, subtree: true });