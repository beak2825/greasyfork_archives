// ==UserScript==
// @name         Tiktok DL
// @namespace    http://127.0.0.1/allo
// @version      1.1
// @description  Download all tiktok videos that have their previews loaded
// @author       Benjababe
// @match        https://www.tiktok.com/@*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.2/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js
// @downloadURL https://update.greasyfork.org/scripts/399839/Tiktok%20DL.user.js
// @updateURL https://update.greasyfork.org/scripts/399839/Tiktok%20DL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let zipFile = new JSZip();
    let progress, total = 0;

    window.onload = () => {
        console.log("Tikshit running");
        insertDownloadBtn();
    };
    let insertDownloadBtn = () => {
        let sub = document.getElementsByClassName("share-group")[0];
        let btnDL = document.createElement("button");
        btnDL.textContent = "Download all in view";
        btnDL.id = "btnDownloadAll";
        btnDL.style.backgroundColor = "gray";
        btnDL.style.border = "none";
        btnDL.style.borderRadius = "10px";
        btnDL.style.marginBottom = "10px";
        sub.parentNode.insertBefore(btnDL, sub.nextSibling);
        let spanStatus = document.createElement("span");
        spanStatus.style.paddingLeft = "15px";
        spanStatus.id = "spanStatus";
        sub.parentNode.insertBefore(spanStatus, btnDL.nextSibling);
        let url = location.href;
        btnDL.onclick = () => {
            console.log("Fetching stuff");
            getLoadedFeeds();
        };
    };
    let getLoadedFeeds = () => {
        let wrappers = Array.from($(".video-feed-item-wrapper"));
        let pageURLs = wrappers.map((link) => link.href);
        download(pageURLs);
    };

    let zipThings = (id, res, retry = false) => {
        let video = $(res).find("video")[0];
        let src = video.src;
        let filename = id + ".mp4";
        JSZipUtils.getBinaryContent(src, (err, data) => {
            if (err) {
                console.log("Error with getting source", src, "retrying in 2 seconds...");
                setTimeout(zipThings(id, res, true), 2000);
            }
            else {
                zipFile.file(filename, data, { binary: true });
                console.log(`Completed ${id} ${retry}`);
                progress++;
                $("#spanStatus").text(`Processed (${progress}/${total})`);
                //Runs when final URL is complete
                if (progress == total) {
                    zipFile.generateAsync({ type: "blob" }, (metadata) => {
                        if (metadata.currentFile) {
                            //It's actually zipping but showing downloading looks better
                            $("#spanStatus").text(`Downloading ${metadata.currentFile}... (${Math.floor(metadata.percent)}%)`);
                        } else {
                            $("#spanStatus").text("Finishing up...");
                        }
                    }).then((blob) => {
                        let zipName = $(".share-sub-title")[0].textContent.substr(1) + ".zip";
                        saveAs(blob, zipName);
                    }, (err) => {
                        $("#spanStatus").text(err);
                    });
                }
            }
        });
    };

    //retry just to see what file needed more then 1 try
    let getPage = (url, retry = false) => {
        //very important for async dl to be enabled
        $.get({ url: url, async: true }, (res) => {
            let id = url.split("/").pop();
            zipThings(id, res);
        }).fail(() => {
            console.log(`HTTP GET for ${url} failed... retrying in 2 seconds...`);
            setTimeout(getPage(url, true), 2000);
        });
    }

    let download = (pageURLs) => {
        zipFile = new JSZip();
        progress = 0;
        total = pageURLs.length;
        $("#spanStatus").text(`Processed (${progress}/${total})`);
        let loopDownload = (pageURLs) => {
            if (progress < total && pageURLs.length > 0) {
                let url = pageURLs.shift();
                getPage(url);
                loopDownload(pageURLs);
            }
        }
        loopDownload(pageURLs);
    }
})();