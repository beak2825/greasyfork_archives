// ==UserScript==
// @name         HakusenshaRipper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Canvas Ripper for Hakusensha
// @author       XXXXXXXXXIII
// @match        https://bsreader.hakusensha-e.net/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444573/HakusenshaRipper.user.js
// @updateURL https://update.greasyfork.org/scripts/444573/HakusenshaRipper.meta.js
// ==/UserScript==

const width = 1125;
const height = 1600;

(function() {
    'use strict';
    var saved = false;
    var page = -1;

    setInterval(() => {
        try {
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
    var pageNum = document.getElementById('paging_slider_nombre_current').innerHTML;
    return Number(pageNum);
}