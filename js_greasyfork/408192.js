// ==UserScript==
// @name         Camp Ozark Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Download full resolution images from the Camp Ozark "My Saved Photos" page
// @author       John P. Smith
// @match        https://myozark.campozark.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/408192/Camp%20Ozark%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/408192/Camp%20Ozark%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var downloadButtons = document.getElementsByClassName('btn btn-primary download-photo');
    var downloadButtonCount = downloadButtons.length;
    for(var x=0; x<downloadButtonCount; x++){
        var existingDownloadButton = downloadButtons[x];

        var newDownloadButton = document.createElement("a");
        newDownloadButton.classList.add ("btn-success");
        newDownloadButton.classList.add ("btn");
        newDownloadButton.style.cssText = "margin-right: 5px";
        newDownloadButton.innerHTML = "<i class=\"fa fa-cloud-download\" aria-hidden=\"true\"></i> Free Hi Res Download :-)";
        newDownloadButton.href = getHiResURL(existingDownloadButton.href);

        existingDownloadButton.parentNode.insertBefore(newDownloadButton, existingDownloadButton);
    }

    function getHiResURL (existingURL) {
        var hiResURL = existingURL;
        hiResURL = hiResURL.replace(/\/fit-in\/.+?\//, "/");
        hiResURL = hiResURL.replace("/filters:", "");
        hiResURL = hiResURL.replace(/watermark.+?\)/, "");
        hiResURL = hiResURL.replace(/quality.+?\)/, "");
        return hiResURL;
    }
})();