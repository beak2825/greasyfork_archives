// ==UserScript==
// @name         Changba Song Downloader
// @namespace    moe.willian.changba-downloader
// @version      0.1
// @description  Download Song From Changba
// @author       Willian, Ruby
// @match        http://changba.com/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31086/Changba%20Song%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/31086/Changba%20Song%20Downloader.meta.js
// ==/UserScript==

let url = $("#audio").attr("src");
console.log(url);
let eButtons = $(".work-info");
let eDownload = $(`  <span class="export" id="download_song">
                        <i></i>
                        <em><a>下載</a></em>
                    </span>`);
eButtons.append(eDownload);

eDownload.find("a").attr({
    href: url,
    download: "download"
});