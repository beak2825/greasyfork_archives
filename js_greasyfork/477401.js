// ==UserScript==
// @name         Copy Release description
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Copy Release description from qobuz
// @author       benz1
// @match         https://www.qobuz.com/*/album/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qobuz.com
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/477401/Copy%20Release%20description.user.js
// @updateURL https://update.greasyfork.org/scripts/477401/Copy%20Release%20description.meta.js
// ==/UserScript==

let setButton = document.createElement("button");
setButton.id = "getInfo";
setButton.textContent = "Copy";
setButton.type = "button";
setButton.addEventListener("click", function () {
    let albuminfos = document.querySelector(".album-quality__infos");

    let bitinfo = /.+Bit/i.exec(albuminfos.children[0].textContent)[0].trim();
    let khzinfo = /(\d+(\.\d+)?\s*kHz)/i.exec(albuminfos.children[0].textContent)[0].trim();
    let url = "Download form : [url=" + window.location.href + "]Qobuz[/url]";
    let text = "[b]" + bitinfo + "[/b]" + " / " + "[b]" + khzinfo + "[/b]" + "\n" + url;
    GM_setClipboard(text);
});

let dlButton = document.createElement("button");
dlButton.id = "dlurl";
dlButton.textContent = "DL";
dlButton.type = "button";
dlButton.addEventListener("click", function () {
    GM_setClipboard('redone ' + window.location.href);
});


let NaButton = document.createElement("button");
NaButton.id = "getNameAndArtist";
NaButton.textContent = "Copy Name";
NaButton.type = "button";
NaButton.addEventListener("click", function () {
    let name = document.querySelector(".album-meta__title").textContent;
    let artist = document.querySelector(".album-meta__artist").textContent;
    GM_setClipboard(artist + ' - ' + name);
});

document.querySelector(".album-quality__infos").after(dlButton);
document.querySelector(".album-quality__infos").after(setButton);
document.querySelector(".album-meta__artist").after(NaButton);