// ==UserScript==
// @name         InfoC HW Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Download files for a task as a zip file
// @author       Gorbit99
// @match        https://infoc.eet.bme.hu/admin
// @match        https://cprog.eet.bme.hu/admin
// @icon         https://www.google.com/s2/favicons?domain=bme.hu
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/432663/InfoC%20HW%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/432663/InfoC%20HW%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", () => {
        let slide = document.querySelector(".slide");

        let config = {
            attributes: false,
            childList: true,
        } ;

        let observer = new MutationObserver(onDOMChange);

        observer.observe(slide, config);
    });
})();

function onDOMChange() {
    if (!window.location.href.includes("csoportmegoldas")) {
        return;
    }

    let table = document.querySelector("#megoldasoktabla");

    let headers = [...table.querySelectorAll("th")];

    for (let i = 1; i < headers.length; i++) {
        headers[i].addEventListener("click", () => {
            let zip = new JSZip();

            Promise.all(
            [...table.rows].map(async (row) => {
                let cell = row.cells[i];
                let button = cell.querySelector("button");

                let neptun = row.cells[0].textContent.split(", ")[1]?.trim();
                if (neptun === undefined) {
                    return;
                }

                if (!button) {
                    return;
                }

                let id = parseInt(button.id.slice(2));
                let url;
                if (window.location.href.includes("infoc")) {
                    url = `https://infoc.eet.bme.hu/admin?_download=hfletolt&megoldas_id=${id}`;
                } else {
                    url = `https://cprog.eet.bme.hu/admin?_download=hfletolt&megoldas_id=${id}`;
                }

                return fetch(url).then(async (data) => {
                    let blob = await data.blob();
                    try {
                        await JSZip.loadAsync(blob);
                        return zip.file(`${neptun}.zip`, blob);
                    } catch(_) {
                        return zip.file(`${neptun}.txt`, blob);
                    }
                });
            })).then(() => {
                zip.generateAsync({type:"blob"})
                    .then(function(content) {
                    saveAs(content, "letoltes.zip");
                });
            });
        });
    }
}