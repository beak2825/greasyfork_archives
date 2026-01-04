// ==UserScript==
// @name         MISIS Downloader
// @namespace    https://neplox.security/
// @version      0.1
// @description  downloads books from MISIS elibrary
// @author       @pomo_mondreganto
// @license      MIT
// @run-at       document-end
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.2/jszip.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @include      https://lib.msk.misis.ru/*
// @connect      lib.msk.misis.ru
// @downloadURL https://update.greasyfork.org/scripts/514539/MISIS%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/514539/MISIS%20Downloader.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ExtractPageCount() {
    let match = document.body.innerHTML.match(/pages_count=(\d+)/);
    if (match.length >= 2) {
        return parseInt(match[1]);
    }
    return 0;
}

function StartDownloading(resolution) {
    let barNode = document.createElement('div');
    barNode.innerHTML = '<div id="myBar"></div>';
    barNode.setAttribute('id', 'myProgress');
    document.getElementById("myContainer").appendChild(barNode);

    let pageCount = ExtractPageCount();
    console.log("page count:", pageCount);

    let zip = new JSZip();
    let count = 0;
    let zipFilename = "result.zip";
    let urls = Array();

    let params = new window.URLSearchParams(window.location.search);
    let documentId = parseInt(params.get('id'));

    for (var page = 0; page < pageCount; page++) {
        urls.push([page.toString(), `https://lib.msk.misis.ru/elib/libs/view.php?id=${documentId}&page=${page}&type=${resolution}/fast`])
    }

    urls.forEach(function(url){
        // loading a file and add it in a zip file
        JSZipUtils.getBinaryContent(url[1], function (err, data) {
            if (err) {
                throw err; // or handle the error
            }

            let filename = url[0] + ".jpg";
            GM_log("Downloaded " + filename);
            zip.file(filename, data, {binary:true});
            count++;
            var elem = document.getElementById("myBar");
            elem.style.width = (count / pageCount * 100).toString() + '%'
            if (count == urls.length) {
                zip.generateAsync({type: "blob"}).then(function(content) {
                    saveAs(content, zipFilename);
                    document.getElementById("myProgress").remove();
                });
            }
        });
    });
}

function DownloadSmall (zEvent) {
    StartDownloading("small");
}

function DownloadLarge (zEvent) {
    StartDownloading("large");
}

GM_addStyle(`
    #myContainer {
        position:               sticky;
        top:                    0;
        width:                  fit-content;
        font-size:              20px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        margin-left:            auto;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }

    #myProgress {
        width: 100%;
        background-color: grey;
    }

    #myBar {
        width: 1%;
        height: 30px;
        background-color: green;
    }
`);

(async function() {
    'use strict';

    while (!ExtractPageCount()) {
        await sleep(1000);
    }

    let zNode = document.createElement ('div');
    zNode.innerHTML = `
<button id="dlSmall" type="button">Download low resolution</button>
<button id="dlLarge" type="button">Download high resolution</button>
`;
    zNode.setAttribute('id', 'myContainer');

    document.body.prepend(zNode);
    document.getElementById("dlSmall").addEventListener(
        "click", DownloadSmall, false
    );
    document.getElementById("dlLarge").addEventListener(
        "click", DownloadLarge, false
    );
})();