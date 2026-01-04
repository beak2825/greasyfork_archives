// ==UserScript==
// @name         Youtube Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  můžeš stahovat youtube videa
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38544/Youtube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/38544/Youtube%20Downloader.meta.js
// ==/UserScript==


getSpan = function (text, className) {
    var _tn = document.createTextNode(text);
    var span = document.createElement("span");
    span.className = className;
    span.appendChild(_tn);
    return span;
};

videoURL = function () {
    let url = window.location.href;
    url = url.split("=");
    return url[1];
};

function createButton() {
    var obj = document.querySelector('#top-row>#subscribe-button');
    if (obj !== null) {
        var btnRow = document.getElementById('bestvd2');
        if (btnRow === null) {
            var bestvd2 = document.createElement("div");
            bestvd2.id = "bestvd2";
            bestvd2.className = "style-scope";

            var bvd2_btn = document.createElement("div");
            bvd2_btn.className = "style-scope bvd2_btn";

            bvd2_btn.style = "background-color: green; border: solid 2px green; border-radius: 2px; color: white; padding: 0px 15px; font-size: 14px; cursor:pointer; height:33px;margin-right: 7px;margin-top: 7px;line-height: 33px;font-weight: 500; display:inline-block;";

            bvd2_btn.appendChild(getSpan("Download", ""));
            bvd2_btn.onclick = function () {
                window.open("https://y2mate.com/youtube/" + videoURL(), '_blank');
            };
            obj.parentNode.insertBefore(bestvd2, obj);
            bestvd2.appendChild(bvd2_btn);
        }
    }
}

document.body.onload = function () {
    createButton();
    console.log("Loaded");
};