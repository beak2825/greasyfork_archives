// ==UserScript==
// @name         Copy JSON from CrowdSource
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Copy Answer JSON information from CrowdSource into clipboard
// @author       You
// @grant        GM_setClipboard
// @match        https://crowdsource.google.com/cc*/Answers/*
// @downloadURL https://update.greasyfork.org/scripts/384663/Copy%20JSON%20from%20CrowdSource.user.js
// @updateURL https://update.greasyfork.org/scripts/384663/Copy%20JSON%20from%20CrowdSource.meta.js
// ==/UserScript==

var b = document.createElement("button");
b.id = "copyJSON";
b.innerText = "Copy JSON";
b.addEventListener('click', copyJSON,false);
document.querySelector("header > div:nth-child(2)").append(b);


function copyJSON() {
    var encrypt = document.querySelector("div[data-encrypt]").getAttribute("data-encrypt");
    var json = atob(encrypt);
    GM_setClipboard(json);
    console.log("JSON copied to clipboard");
}


