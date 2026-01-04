// ==UserScript==
// @name         Vault ROM Restore
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Restores the download and play online button to Vimm's Vault games.
// @author       InariOkami
// @icon         https://vimm.net/images/vimmbutton-100.png
// @match        https://vimm.net/vault/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/511715/Vault%20ROM%20Restore.user.js
// @updateURL https://update.greasyfork.org/scripts/511715/Vault%20ROM%20Restore.meta.js
// ==/UserScript==

const linesToDetect = [
    "Download, box art, and screen shots unavailable at the request of Nintendo of America",
    "Download unavailable at the request of Nintendo of America",
    "Download unavailable at the request of the Entertainment Software Association",
    "Download, box art, and screen shots unavailable at the request of the Entertainment Software Association",
    "Download unavailable at the request of Sega Corporation",
    "Download, box art, and screen shots unavailable at the request of Sega Corporation",
    "Download unavailable at the request of LEGO Juris A/S",
    "Download, box art, and screen shots unavailable at the request of LEGO Juris A/S"
];

let lineDetected = linesToDetect.find(line => document.body.innerHTML.includes(line));

if (lineDetected) {
    let system = window.location.pathname.split('/')[2];

    let media = typeof allMedia !== "undefined" && allMedia.length > 0 ? allMedia[allMedia.length - 1] : null;

    if (media) {
        let buttonHTML = `<table style="width:100%">
            <tbody>
                <tr id="download-row">
                    <td style="width:33%"></td>
                    <td style="width:34%">
                        <form action="https://download${system === "Wii" ? 2 : 3}.vimm.net/download/" method="POST" id="download_form">
                            <input type="hidden" name="mediaId" value="${media.ID}">
                            <button type="submit" style="width:100%">Download</button>
                        </form>
                    </td>
                    <td style="width:33%; text-align:center" id="download_size">${media.ZippedText}</td>
                </tr>
            </tbody>
        </table>`;

        if (system !== "Wii") {
            buttonHTML += `<button type="button" title="Play Online" onclick="location.href='/vault/?p=play&mediaId=${media.ID}'" style="width:33%">Play Online</button>`;
        }

        document.body.innerHTML = document.body.innerHTML.replace(lineDetected, buttonHTML);
    } else {
        console.error("Media data is undefined or empty.");
    }
}