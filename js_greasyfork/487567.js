// ==UserScript==
// @name               VGMURLs
// @namespace          bexon
// @version            1.0.0
// @description        Copy albums urls from KHInsider.
// @compatible         safari
// @compatible         firefox
// @compatible         chrome
// @compatible         edge
// @compatible         opera
// @homepageURL        https://gitlab.com/bexon/userscripts/-/tree/main/VGMURLs
// @supportURL         https://gitlab.com/bexon/userscripts/-/issues/new
// @contributionURL    https://ko-fi.com/bexon
// @author             Bexon Bai
// @match              https://downloads.khinsider.com/game-soundtracks/album/*
// @include            https://downloads.khinsider.com/game-soundtracks/album/*
// @connect            vgmdownloads.com
// @connect            vgmsite.com
// @run-at             document-end
// @inject-into        page
// @grant              GM.xmlHttpRequest
// @grant              GM_xmlhttpRequest
// @noframes
// @require            https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @license            GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/487567/VGMURLs.user.js
// @updateURL https://update.greasyfork.org/scripts/487567/VGMURLs.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const album_mass_download = document.getElementsByClassName("albumMassDownload")[0];
    var get_urls = document.createElement('a');
    get_urls.text = "🔗 Get Songs urls."
    get_urls.style.marginLeft = "2em";
    get_urls.addEventListener("click", (e) => {
        e.preventDefault();
        let format = Array(
            ...document.querySelectorAll("#songlist_header th[align=right]"),
        ).map((x) => x.textContent);
        if (format.length === 1) {
            format = format[0];
        } else {
            const input = prompt(
                "Please enter your desired format (" +
                format.join(", ") +
                "):",
                format[0],
            );
            if (!input) return;
            if (!format.includes(input.toUpperCase())) {
                format = format[0];
                alert("Invalid format supplied. Using " + format + " instead.");
            } else {
                format = input;
            }
        }
        const element = document.getElementsByClassName("albumMassDownload")[0];
        element.style.height = "auto";
        element.style.marginBottom = "20px";
        const input = eval(
            document
            .querySelector("#pageContent script")
            .textContent.slice(5, -3)
            .replace("function", "function x")
            .replace("return p}", "return p}x"),
        );
        const media_path = input.match(/mediaPath='(.+?)'/)[1];
        const tracks = JSON.parse(input.match(/tracks=(\[.+?,\])/)[1].replace(",]", "]"));
        const output = tracks.map(
            (x) =>
            media_path +
            x.file.split(".").slice(0, -1).join(".") +
            "." +
            format.toLowerCase(),
        );
        alert("Content copied to clipboard\n" + JSON.stringify(output));
        navigator.clipboard.writeText(JSON.stringify(output)).then(() => {
            console.log(JSON.stringify(output));
        },() => {
            console.error("Failed to copy");
        });
    });
    album_mass_download.appendChild(get_urls);

})();
