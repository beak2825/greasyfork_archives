// ==UserScript==
// @name         Webinar Like Requests
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds like to current meeting
// @author       Hacheriki
// @match        https://events.webinar.ru/*
// @icon         https://www.google.com/s2/favicons?domain=hibbard.eu
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/432163/Webinar%20Like%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/432163/Webinar%20Like%20Requests.meta.js
// ==/UserScript==

(function() {
    let likeBooster = {
        _likeId: null,
        _likeLocation: "https://events.webinar.ru/api/light/reactions/eventsessions/" + window.location.href.split("/")[6] + "/likes",
        likeInterval: 1000,
        start() {
            this._likeId = setInterval(async () => {
                const settings = {
                    method: 'POST',
                    headers: {
                        "Authorization": "Bearer " + window.localStorage["auth-token"]
                    }
                };
                try {
                    const fetchResponse = await fetch(this._likeLocation, settings);
                } catch (e) {
                    this.stop();
                }
            }, this.likeInterval)
        },
        stop() {
            clearInterval(this._likeId);
        },
    }

function addMenuElement(func,vPath) {
    let newButton = document.createElement("button");
    newButton.classList.add("btn");
    newButton.classList.add("btn_toolbar");
    newButton.setAttribute("type","button");
    newButton.addEventListener("click",func);
    document.body.appendChild(newButton);
    let newProperty = document.createElement("span");
    newProperty.classList.add("btn__content");
    newButton.appendChild(newProperty);

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon icon_pictureInPicture btn__icon");
    svg.setAttribute("viewBox", "0 0 20 20");

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "currentColor");
    path.setAttribute("d", vPath);

    svg.appendChild(path);
    newProperty.appendChild(svg)
}

addMenuElement(() => likeBooster.start(),"M9.917,0.875c-5.086,0-9.208,4.123-9.208,9.208c0,5.086,4.123,9.208,9.208,9.208s9.208-4.122,9.208-9.208\n" +
    "\t\t\t\t\t\t\t\tC19.125,4.998,15.003,0.875,9.917,0.875z M9.917,18.141c-4.451,0-8.058-3.607-8.058-8.058s3.607-8.057,8.058-8.057\n" +
    "\t\t\t\t\t\t\t\tc4.449,0,8.057,3.607,8.057,8.057S14.366,18.141,9.917,18.141z M13.851,6.794l-5.373,5.372L5.984,9.672\n" +
    "\t\t\t\t\t\t\t\tc-0.219-0.219-0.575-0.219-0.795,0c-0.219,0.22-0.219,0.575,0,0.794l2.823,2.823c0.02,0.028,0.031,0.059,0.055,0.083\n" +
    "\t\t\t\t\t\t\t\tc0.113,0.113,0.263,0.166,0.411,0.162c0.148,0.004,0.298-0.049,0.411-0.162c0.024-0.024,0.036-0.055,0.055-0.083l5.701-5.7\n" +
    "\t\t\t\t\t\t\t\tc0.219-0.219,0.219-0.575,0-0.794C14.425,6.575,14.069,6.575,13.851,6.794z")
addMenuElement(() => likeBooster.stop(),"M13.864,6.136c-0.22-0.219-0.576-0.219-0.795,0L10,9.206l-3.07-3.07c-0.219-0.219-0.575-0.219-0.795,0\n" +
    "\t\t\t\t\t\t\t\tc-0.219,0.22-0.219,0.576,0,0.795L9.205,10l-3.07,3.07c-0.219,0.219-0.219,0.574,0,0.794c0.22,0.22,0.576,0.22,0.795,0L10,10.795\n" +
    "\t\t\t\t\t\t\t\tl3.069,3.069c0.219,0.22,0.575,0.22,0.795,0c0.219-0.22,0.219-0.575,0-0.794L10.794,10l3.07-3.07\n" +
    "\t\t\t\t\t\t\t\tC14.083,6.711,14.083,6.355,13.864,6.136z M10,0.792c-5.086,0-9.208,4.123-9.208,9.208c0,5.085,4.123,9.208,9.208,9.208\n" +
    "\t\t\t\t\t\t\t\ts9.208-4.122,9.208-9.208C19.208,4.915,15.086,0.792,10,0.792z M10,18.058c-4.451,0-8.057-3.607-8.057-8.057\n" +
    "\t\t\t\t\t\t\t\tc0-4.451,3.606-8.057,8.057-8.057c4.449,0,8.058,3.606,8.058,8.057C18.058,14.45,14.449,18.058,10,18.058z")
addMenuElement(() => {
    if (likeBooster.likeInterval > 100) {
        likeBooster.likeInterval -= 100;
    } else if (likeBooster.likeInterval > 10) {
        likeBooster.likeInterval -= 10;
    } else if (likeBooster.likeInterval > 0) {
        likeBooster.likeInterval -= 1;
    }
    console.log(likeBooster.likeInterval);
},"M13.774,9.355h-7.36c-0.305,0-0.552,0.247-0.552,0.551s0.247,0.551,0.552,0.551h7.36\n" +
    "\t\t\t\t\t\t\t\tc0.304,0,0.551-0.247,0.551-0.551S14.078,9.355,13.774,9.355z M10.094,0.875c-4.988,0-9.031,4.043-9.031,9.031\n" +
    "\t\t\t\t\t\t\t\ts4.043,9.031,9.031,9.031s9.031-4.043,9.031-9.031S15.082,0.875,10.094,0.875z M10.094,17.809c-4.365,0-7.902-3.538-7.902-7.902\n" +
    "\t\t\t\t\t\t\t\tc0-4.365,3.538-7.902,7.902-7.902c4.364,0,7.902,3.538,7.902,7.902C17.996,14.271,14.458,17.809,10.094,17.809z");
addMenuElement(() => {
    if (likeBooster.likeInterval >= 100) {
        likeBooster.likeInterval += 100;
    } else if (likeBooster.likeInterval >= 10) {
        likeBooster.likeInterval += 10;
    } else if (likeBooster.likeInterval >= 0) {
        likeBooster.likeInterval += 1;
    }
    console.log(likeBooster.likeInterval);
},"M13.68,9.448h-3.128V6.319c0-0.304-0.248-0.551-0.552-0.551S9.448,6.015,9.448,6.319v3.129H6.319\n" +
    "\t\t\t\t\t\t\t\tc-0.304,0-0.551,0.247-0.551,0.551s0.247,0.551,0.551,0.551h3.129v3.129c0,0.305,0.248,0.551,0.552,0.551s0.552-0.246,0.552-0.551\n" +
    "\t\t\t\t\t\t\t\tv-3.129h3.128c0.305,0,0.552-0.247,0.552-0.551S13.984,9.448,13.68,9.448z M10,0.968c-4.987,0-9.031,4.043-9.031,9.031\n" +
    "\t\t\t\t\t\t\t\tc0,4.989,4.044,9.032,9.031,9.032c4.988,0,9.031-4.043,9.031-9.032C19.031,5.012,14.988,0.968,10,0.968z M10,17.902\n" +
    "\t\t\t\t\t\t\t\tc-4.364,0-7.902-3.539-7.902-7.903c0-4.365,3.538-7.902,7.902-7.902S17.902,5.635,17.902,10C17.902,14.363,14.364,17.902,10,17.902\n" +
    "\t\t\t\t\t\t\t\tz");
})();