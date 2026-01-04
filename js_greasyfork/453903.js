
// ==UserScript==
// @name         Qobuz Play URL
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Creates a button that allows you to instantly copy the Qobuz album play URL
// @author       akira
// @match        https://www.qobuz.com/*/album/*
// @match        https://www.qobuz.com/*/interpreter/*
// @match        https://www.qobuz.com/*/search?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qobuz.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453903/Qobuz%20Play%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/453903/Qobuz%20Play%20URL.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.location.href.includes("album")) {

        let playerButtons = document.querySelector(".player__buttons");
        let copyURLbtn = document.createElement("button");
        copyURLbtn.textContent = "Copy";
        copyURLbtn.classList.add("player__webplayer");

        copyURLbtn.addEventListener("click", function () {
            let albumID = window.location.href.split("/").pop();
            let playURL = "https://play.qobuz.com/album/" + albumID;
            navigator.clipboard.writeText(playURL);
        });

        playerButtons.insertBefore(copyURLbtn, playerButtons.firstChild);

    } else if (window.location.href.includes("interpreter")) {

        let allProductButtons = document.querySelectorAll(".product__buttons");
        allProductButtons.forEach(function (productButton) {
            let albumID = productButton.querySelector("a").dataset.url.split("/").pop();
            let albumButton = document.createElement("a");
            let copyText = document.createElement("div");
            copyText.classList.add("product__button--highlight");
            copyText.textContent = "Copy";
            albumButton.classList.add("product__button");
            albumButton.append(copyText);

            albumButton.addEventListener("click", function () {
                let playURL = "https://play.qobuz.com/album/" + albumID;
                navigator.clipboard.writeText(playURL);
            });

            productButton.insertBefore(albumButton, productButton.firstChild);

        });
    } else {

        let albumButtons = document.querySelectorAll(".price-box > .action");
        albumButtons.forEach(function (albumButton) {
            let copyText = document.createElement("a");
            copyText.classList.add("btn__qobuz");
            copyText.classList.add("btn__qobuz--see-album");
            copyText.textContent = "Copy the Album";

            copyText.addEventListener("click", function () {
                let albumID = document.querySelector(".action > ul > li > a").href.split("/").pop();
                let playURL = "https://play.qobuz.com/album/" + albumID;
                navigator.clipboard.writeText(playURL);
            });

            albumButton.insertBefore(copyText, albumButton.firstChild);

        })
    };

})();