// ==UserScript==
// @name         Thingiverse Fast Downloader
// @namespace    https://vianos-official.com/
// @version      1.0
// @description  Skip all the waiting and download your STL′s instantly!
// @author       HNP_Arda
// @license      MIT
// @match        https://www.thingiverse.com/*
// @icon         https://cdn.thingiverse.com/site/img/favicons/favicon-96x96.png
// @grant        GM_xmlhttpRequest
// @connect      thingiverse.com
// @connect      cdn.thingiverse.com
// @require https://update.greasyfork.org/scripts/473358/1237031/JSZip.js
// @downloadURL https://update.greasyfork.org/scripts/539144/Thingiverse%20Fast%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/539144/Thingiverse%20Fast%20Downloader.meta.js
// ==/UserScript==

/* global JSZip */


var token;
var downloadBtn;
var files;

(function() {
    'use strict';
    var created = false;

    const thingIdMatch = window.location.pathname.match(/thing:(\d+)/);
    if (!thingIdMatch) return;
    const thingId = thingIdMatch[1];
    const apiUrl = `https://www.thingiverse.com/api/things/${thingId}/files`;

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://cdn.thingiverse.com/site/js/app.bundle.js",
        headers: { "Referer": `https://www.thingiverse.com/` },
        onload: function(response) {

            token = response.responseText.split(`"".concat("https://tv-zip.thingiverse.com")`)[1].split(`"".concat("https://cloudprint.makerbot.com")`)[0].split(`concat(`)[3].split(`=`)[1].split(`"`)[1];

            console.log("Auth token: ", token);

            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                headers: {
                    "Referer": `https://www.thingiverse.com/thing:${thingId}`,
                    "Authorization": `Bearer ${token}`,
                },
                onload: function(response) {

                    console.log("Request response: ", response);

                    if (response.status != 200) token = "";
                    else files = JSON.parse(response.responseText);

                    if (downloadBtn) init();

                }
            });


        }
    });

    const createLinks = function (){
        var buttons = Array.from(document.getElementsByClassName("tv-button--primary"));

        if (buttons.length == 0) return;
        else created = true;

        const btn = buttons.find(e => e.tagName=="BUTTON");
        downloadBtn = btn.cloneNode(true);
        downloadBtn.firstElementChild.innerHTML = "Fast Download";
        btn.parentElement.append(downloadBtn);

        if (files) init();
        else downloadBtn.style.display = "none";
    }

    const Observer = new MutationObserver( function( mutationsList ) {
        if (created) return;
        else createLinks();
    });

    Observer.observe( document.body, { childList:true, subtree:true } );

})();

function init() {
    if (token == "" || token == "") return;

    console.log("Thingiverse Files: ", files);

    if (files.length == 0) {
        downloadBtn.addEventListener("click", function () {document.location = files[0].direct_url;});
        downloadBtn.style.display = "inline-flex";
        return;
    }


    const zip = new JSZip();
    let completed = 0;

    files.forEach(file => {
        GM_xmlhttpRequest({
            method: "GET",
            url: file.direct_url,
            responseType: "arraybuffer",
            onload: res => {
                zip.file(file.name, res.response);
                completed++;
                if (completed === files.length) {

                    zip.generateAsync({ type: "base64" }).then(base64 => {
                        const a = document.createElement("a");
                        a.href = `data:application/zip;base64,${base64}`;
                        a.download = `${document.title.split(" by ")[0]}.zip`;
                        a.style.display = "none";
                        document.body.appendChild(a);

                        downloadBtn.style.display = "inline-flex";
                        downloadBtn.onclick = function () {
                            a.click();
                        }
                    });
                }
            },
            onerror: err => {
                console.error("Error while loading:", file.name, err);
            }
        });
    });

}
