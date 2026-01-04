// ==UserScript==
// @name         Imgur Easy Download Button
// @namespace    http://imgur.com/
// @version      0.2
// @description  try to take over the world!
// @author       TCGM
// @match        https://imgur.com/a/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409820/Imgur%20Easy%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/409820/Imgur%20Easy%20Download%20Button.meta.js
// ==/UserScript==

var imgurDownloadTrigger;
var downloadURL;
var downloadButton;
var downloadBefore;

(function() {
    'use strict';

    console.log("Imgur Easy Download Button");

    var wrapper = document.createElement("div");
    document.documentElement.appendChild(wrapper);
    wrapper.style = "float:right;position:fixed;right:10em;bottom:50px;width:6vw;height:7vw;background:#2c2f34;color:#dbdbdb;border-radius:3px 0px 0px 3px;";

    imgurDownloadTrigger = document.querySelector(".post-action-options-items > li:nth-child(1) > a");

    downloadURL = window.location.href + "/zip";

    downloadButton = document.createElement("a");
    downloadButton.class = "icon-download";
    wrapper.appendChild(downloadButton);
    //downloadButton.href = window.location + "#";
    downloadButton.onclick = Download;
    downloadButton.innerHTML = "💾";
    downloadButton.style = "width:100%;height:100%;display:block;text-align:center;vertical-align:middle;font-size:5em;";
})();

function Download() {
    //imgurDownloadTrigger.click();

    var downloadIFrame = document.createElement("iframe");
    downloadIFrame.src = downloadURL;
    downloadIFrame.display = "none";
    document.documentElement.appendChild(downloadIFrame);
    downloadButton.innerHTML = "✔️";
    downloadButton.onclick = null;
}