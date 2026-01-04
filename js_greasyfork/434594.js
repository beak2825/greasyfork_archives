// ==UserScript==
// @name         GamerFun No Download Delay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  none
// @author       ShaqimaK
// @match        https://forum.gamerfun.club/attachments/*
// @icon         https://www.google.com/s2/favicons?domain=gamerfun.club
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434594/GamerFun%20No%20Download%20Delay.user.js
// @updateURL https://update.greasyfork.org/scripts/434594/GamerFun%20No%20Download%20Delay.meta.js
// ==/UserScript==

(function() {
    document.querySelector("#timer").remove();
    let DownloadButton = document.querySelector("#buttons > li.xb_dp_download_link > input");
    DownloadButton.disabled = "";
    DownloadButton.className = "  download_button ";
    DownloadButton.value = "Download File";
    let SQM = document.createElement("Text");
    SQM.textContent = "No Download Delay Made By ShaqimaK.";
    document.querySelector("#footer > div > div.p-footer-copyright > div").appendChild(SQM)
})();