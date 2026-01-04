// ==UserScript==
// @name        OpEx Countdown Skip
// @name:pt-BR  OpEx Pula Tempo de Espera
// @autor       SecretX
// @namespace   namespace_secretx
// @description A small script to skip the silly countdown of One Piece Ex website
// @description:pt-br Um pequeno script para pular o contador irritante do site OpEx
// @version     2022.11.16
// @match       *://onepiecex.*/download/?*
// @match       *://onepieceex.*/download/?*
// @match       *://onepiecex.*/dw/*/*/*/*
// @match       *://onepieceex.*/dw/*/*/*/*
// @run-at      document-start
// @grant       GM.xmlHttpRequest
// @icon        https://onepieceex.net/favicon/favicon-32x32.png
// @license     GNU LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/412997/OpEx%20Countdown%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/412997/OpEx%20Countdown%20Skip.meta.js
// ==/UserScript==

const opexTorrentRegex = /^\w+:\/\/onepiecee?x\.\w+\/download\/\?\d+$/i;
const opexServerRegex = /^\w+:\/\/onepiecee?x\.\w+\/dw\/(?:\d+\/?)+$/i;

Object.defineProperty(Array.prototype, "firstNotNull", {
    value: function firstNotNull() {
        for (const element of this) if (element != null) return element;
        throw new Error("Array contains no non null element.");
    },
    writable: true,
    configurable: true
});

function isDownloadFromOpexServer() {
    const url = window.location.href;
    return opexServerRegex.test(url);
}

function isDownloadFromTorrentServer() {
    const url = window.location.href;
    return opexTorrentRegex.test(url);
}

// Torrent protector bypass methods

const countElem = () => document.getElementById("contador");

const awaitElem = () => document.getElementById("aguarde");

const countdownScript = () => document.querySelector("body > script:nth-child(4)").innerText;

function firstScriptLineThatMatches(regex) {
    return countdownScript().split("\n")
        .map(line => line.trim().match(regex))
        .firstNotNull();
}

function bypassTorrentProtector() {
    const magnetLinkRegex = /^.+?href="(magnet[^"]+)".*$/i;

    try {
        const magnetLink = firstScriptLineThatMatches(magnetLinkRegex)[1];
        console.info(`Automatically redirecting you to the extracted magnet link from this page: ${magnetLink}`);
        haltAllPageIntervals();
        try {
            countElem().remove();
            awaitElem().innerText = "Protetor desativado =)";
        } catch (e) {}
        window.location.replace(magnetLink);
    } catch (e) {
        console.error(`Oops, this script was not able to automatically grab the magnet link from this page because of an error. Using fallback that set the countdown to 1. ${e}`);
        countElem().innerHTML = 1;
    }
}

// Opex protector bypass methods

function doRequest(httpMethod, url) {
    const hostRegex = /\w+:\/\/((?:\w+\.?)+)/;

    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: httpMethod.toUpperCase(),
            url: url,
            onload: resolve,
            onerror: reject,
            responseType: "text",
            timeout: 6000,
            headers: {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.5",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "DNT": "1",
                "Host": url.match(hostRegex)[1],
                "Origin": window.location.origin,
                "Referer": window.location.origin,
                "Pragma": "no-cache",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
            }
        });
    });
}

function haltAllPageIntervals() {
    // Get a reference to the last interval + 1
    const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);

    // Clear any timeout/interval up to that id
    for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
    }
}

function bypassOpexServerProtector() {
    const scriptRegex = /https?:\/\/(?:\w+\.?)+\/\?code=[^'"]+/i;

    const requestUrl = Array.from(document.querySelector("head").children)
        .filter(node => node.nodeName === "SCRIPT")
        .map(node => node.innerText)
        .filter(script => script != null && script.length > 0)
        .map(script => script.match(scriptRegex))
        .firstNotNull()[0];

    if (requestUrl == null || typeof requestUrl !== "string") {
        console.error("Oops, this script was not able to automatically grab the request URL from the header.");
        return;
    }

    doRequest("GET", requestUrl)
        .then(response => {
            try {
                const downloadLink = JSON.parse(response.responseText).link;

                haltAllPageIntervals();
                const loadingDiv = document.getElementById("andamento");
                loadingDiv.setAttribute("style", "width: 100%; background: rgba(65, 26, 26, 0.9) none repeat scroll 0% 0%; display: block !important;");

                const messageButton = document.getElementById("mensagem");
                messageButton.innerText = "Protetor desativado =)"

                const downloadButton = document.getElementById("link");
                downloadButton.href = downloadLink;
                downloadButton.innerText = "Baixar";
                downloadButton.setAttribute("style", "display: inline !important;");
            } catch (e) {
                console.error(`Could not bypass page. Requested URL ${requestUrl}. Status code: ${response.status}. Server response: ${response.responseText}`, e);
            }
        })
        .catch(e => console.error(`Could not bypass page. Requested URL ${requestUrl}`, e));
}

window.addEventListener("DOMContentLoaded", function() {
    'use strict';

    if (isDownloadFromTorrentServer()) {
        bypassTorrentProtector();
    } else if (isDownloadFromOpexServer()) {
        bypassOpexServerProtector();
    }
}, false);