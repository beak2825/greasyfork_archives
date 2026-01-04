// ==UserScript==
// @name         IMDb to Cine Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  IMDb zu Cine.to linker
// @author       Seker61
// @match        https://www.imdb.com/title/*
// @icon         https://www.google.com/s2/favicons?domain=imdb.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434004/IMDb%20to%20Cine%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/434004/IMDb%20to%20Cine%20Link.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const url = window.location.pathname;
    const urlParts = url.split("/");
    let divToCine = document.createElement("div");
    const searchTVShow = document.getElementsByClassName("ipc-inline-list__item");

    for (const element of searchTVShow) {
        if (element.innerHTML === "TV Series") {
            return;
        }
    }

    if (urlParts[1] === "title") {
        divToCine.innerHTML ="<a class='ipc-split-button__btn' role='button' href='https://cine.to/" + urlParts[2] + "' target='_blank'>Auf Cine.TO ansehen</a>";
        divToCine.style = "background-color: rgb(255, 255, 0);position: fixed;left: -60px;top: 50%;z-index: 1000;-webkit-transform: rotate(270deg);-moz-transform: rotate(270deg);-o-transform: rotate(270deg);-ms-transform: rotate(270deg);transform: rotate(270deg);";
        document.body.appendChild(divToCine);
    }
})();