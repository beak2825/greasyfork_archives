// ==UserScript==
// @name         YouTube video metadata downloader
// @version      1.1
// @description  Saves the title, publishing date, creator, and description of a YouTube video to a text file.
// @author       DipshitDickinson
// @match        *://*.youtube.com/*
// @require      https://gitcdn.xyz/cdn/eligrey/FileSaver.js/9a0a1e4ae2732c2d8eedc0214ef1c0fa32d15150/src/FileSaver.js
// @namespace    https://greasyfork.org/users/256625
// @downloadURL https://update.greasyfork.org/scripts/391564/YouTube%20video%20metadata%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/391564/YouTube%20video%20metadata%20downloader.meta.js
// ==/UserScript==

var b = document.createElement("div");

b.id = "savetxtbtn";
b.style = "padding-top: 8px; padding-bottom: 8px";
b.innerHTML = "<paper-button class=\"style-scope ytd-subscribe-button-renderer\">SAVE METADATA AS .TXT</paper-button>";

var si = setInterval(function() {
    if (document.getElementById("count") && !document.getElementById("savetxtbtn")) {
        var toprow = document.querySelector("#top-row.style-scope.ytd-video-secondary-info-renderer");
        toprow.insertBefore(b, toprow.childNodes[1]);
        clearInterval(si);
    }
}, 100);

b.onclick = function() {
    var title = document.querySelector("h1 yt-formatted-string").innerText;
    var pdate = document.querySelector("#date yt-formatted-string").innerText;
    var channel = document.querySelector("#upload-info a").innerText;
    var desc = document.querySelector("#description");
    var url = "https://www.youtube.com/watch?v=" + new URLSearchParams(new URL(window.location.href).search).get('v');

    for (let a of desc.getElementsByTagName("a")) {
        var args = new URLSearchParams(new URL(a.href).search);
        if (args.has("q")) {
            a.href = args.get("q"); }
        if (a.innerHTML.endsWith("...")) {
            a.innerHTML = a.href; } }

    var blob = new Blob([title + "\n" + pdate + "\n" + channel + "\n" + url + "\n\n" + desc.innerText], {type: "text/plain;charset=utf-8"});

    saveAs(blob, title + ".txt")
}