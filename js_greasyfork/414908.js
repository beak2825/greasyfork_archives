// ==UserScript==
// @name         Group Map Preview
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixes U-M previews in groups
// @author       Electro
// @match        https://tagpro.koalabeast.com/groups/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414908/Group%20Map%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/414908/Group%20Map%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Set this to "true" if its still not working for you.
    const USE_PROXY = false;

    setInterval(() => {
        if(document.querySelector("[name='map']").innerText.includes("MapId:")){
            let mapID = document.querySelector("[name='map']").innerText.replace("MapId:", "").trim();
            let link = `http://unfortunate-maps.jukejuice.com/static/thumbs/${mapID}.png`;
            if(USE_PROXY) link = `https://parretlabs.xyz:8006/proxy?link=${link}&isBlob=1&type=image/png`;

            document.querySelector(".responsive.map-preview").setAttribute("src", link);
        }
    }, 1000);
    // Your code here...
})();