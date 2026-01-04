// ==UserScript==
// @name        Toogle beta version
// @namespace   Violentmonkey Scripts
// @match       https://*.foodsharing.*/*
// @run-at      document-idle
// @version     1.2
// @author      Martin G. (166111)
// @license     MIT
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @description Extension for foodsharing.de - toogles to beta version and back
// @downloadURL https://update.greasyfork.org/scripts/533559/Toogle%20beta%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/533559/Toogle%20beta%20version.meta.js
// ==/UserScript==

let btn = document.createElement("BUTTON");
let div = document.querySelector(".metanav-container");
div.appendChild(btn);

btn.innerHTML = "beta";
if(isBeta()){
    btn.innerHTML = "prod";
}

btn.onclick = () => {
    const aktuelleURL = window.location.href;
    const betaMuster = /(\bhttps?:\/\/)(www\.)?/; // Suchmuster für http(s):// und optional www.
    const betaVorhanden = aktuelleURL.includes("beta.");
    let neueURL;

    if (isBeta()) {
        btn.innerHTML = "beta";
        neueURL = aktuelleURL.replace("beta.", ""); // switch to prod
    } else {
        btn.innerHTML = "prod";
        neueURL = aktuelleURL.replace(betaMuster, "$1beta."); // switch to beta
    }

    window.location.href = neueURL;
};

function isBeta() {
    const aktuelleURL = window.location.href;
    return aktuelleURL.includes("beta.");
}