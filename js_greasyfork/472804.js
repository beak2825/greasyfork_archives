// ==UserScript==
// @name         Youtube DL
// @version      0.2
// @description  Replaces the Youtube download buttons with ones that download the video without premium.
// @author       Riley Campbell
// @namespace    https://hacker-point.com
// @match        https://*.youtube.com/*
// @license      https://opensource.org/license/bsd-3-clause/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472804/Youtube%20DL.user.js
// @updateURL https://update.greasyfork.org/scripts/472804/Youtube%20DL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function recreateNode(el) {
        var newEl = el.cloneNode(false);
        while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
        return newEl
    }

    setInterval(()=>{
        var dropDownDownload = document.querySelectorAll('tp-yt-paper-item[class*="ytd-menu-service-item-download-renderer"]')[0]
        var newdropDownDownload = recreateNode(dropDownDownload);
        newdropDownDownload.setAttribute('onclick', "window.open('https://api.hacker-point.com/ytdlp/?url=' + location.href, '_blank')")
        dropDownDownload.parentNode.replaceChild(newdropDownDownload, dropDownDownload)
    }, 200)

    setInterval(()=>{
        var downloadButton = document.querySelectorAll('button[class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading "][aria-label="Download"]')[0]
        var newDownloadButton = recreateNode(downloadButton);
        newDownloadButton.setAttribute('onclick', "window.open('https://api.hacker-point.com/ytdlp/?url=' + location.href, '_blank')")
        downloadButton.parentNode.replaceChild(newDownloadButton, downloadButton)
    }, 200)
})();