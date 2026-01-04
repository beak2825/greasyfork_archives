// ==UserScript==
// @name         Photop+ Loader
// @namespace    http://tampermonkey.net/
// @version      2024-09-29
// @description  Load up Photop+!
// @author       Abooby
// @match        https://app.photop.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510804/Photop%2B%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/510804/Photop%2B%20Loader.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let response = await fetch("https://photopplus.pockethost.io/api/client", {
        method: "GET"
    });

    let data = await response.json()
    var head = document.getElementsByTagName("body")[0];
    var link = document.createElement("script");
    link.innerHTML = atob(data.Bytes);
    link.setAttribute('filename', "photopPlusClient")
    head.appendChild(link);
})();