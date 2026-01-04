// ==UserScript==
// @name         BiliRipper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Canvas Ripper for BiliBili Manga
// @author       XXXXXXXXXIII
// @match        https://manga.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441368/BiliRipper.user.js
// @updateURL https://update.greasyfork.org/scripts/441368/BiliRipper.meta.js
// ==/UserScript==

const width = 1125;
const height = 1600;

(function() {
    'use strict';
    var toHell = HTMLCanvasElement.prototype.toBlob; // Store a copy(reference?) of the function before Bilibili sets toBlob & toDataURL to void
    var saved = false;
    var page = -1;

    setInterval(() => {
        try {
            HTMLCanvasElement.prototype.toBlob = toHell;
            if (page != getPageNum()) saved = false;
            if (saved) return;
            page = getPageNum();
            if (page < 1) throw new Error("Not Ready");
            let canvas = setCanvas();
            saveCanvas(canvas, page);
            console.log("Page " + page + " saved");
            saved = true;
        } catch (e) {
            console.log(e.message);
        }
    }, 1000);
})();

function saveCanvas(canvas, page) {
    //let image = canvas.toDataURL("image/jpeg", 1.0); // Very Slow, highly not recommended.
    canvas.toBlob((blob) => {
        var image = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = image;
        document.body.appendChild(a);
        a.download = page + ".png";
        a.click(); // USER: Disable ask where to store file location setting for usability
        document.body.removeChild(a);
    }, "image/png", 1.0);
}

function setCanvas() {
    let canvas = document.getElementsByTagName('CANVAS')[0];
    canvas.style.width = 'auto';
    canvas.style.height = 'auto';
    return canvas;
}

function getPageNum() {
    var pageNum = document.getElementsByClassName('progress-indicator')[0].innerHTML;
    return Number(pageNum.replace(/ \/.*/i, ""));
}