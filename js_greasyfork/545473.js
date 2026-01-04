// ==UserScript==
// @name         GeoHack Wplace Button
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Places a redirect to Wplace on Wikipedia location page
// @author       pancakeportal99
// @match        https://geohack.toolforge.org/geohack.php*
// @icon         https://wplace.live/img/favicon-96x96.png
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/545473/GeoHack%20Wplace%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/545473/GeoHack%20Wplace%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);
    const params = url.searchParams;
    if (params.has('params') == true) {
        var lat = document.getElementsByClassName("latitude")[0].innerText;
        var lng = document.getElementsByClassName("longitude")[0].innerText;
        const url = `https://wplace.live/?lat=${lat}&lng=${lng}`;

        var links = document.getElementsByClassName("plainlinks")[1];

        var div = document.createElement("div");
        div.style["min-width"] = "192px";
        div.style.display = "inline-block";
        links.appendChild(div);

        var p = document.createElement("p");
        div.appendChild(p);

        var a = document.createElement("a");
        a.rel = "nofollow";
        a.class = "external text";
        a.href = url;
        p.appendChild(a);

        var span = document.createElement("span");
        span.style.display = "inline-block";
        span.style["text-align"] = "center";
        span.style.width = "96px";
        span.innerHTML = "<br>Wplace.live";
        a.appendChild(span);

        var img = document.createElement("img");
        img.src = "https://wplace.live/img/favicon-96x96.png";
        img.width = "64";
        img.height = "64";
        img.class = "mw-file-element";
        img["data-file-width"] = "256";
        img["data-file-height"] = "256";
        span.appendChild(img);
    }
})();