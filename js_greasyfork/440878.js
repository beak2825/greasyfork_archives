// ==UserScript==
// @name         BWRipper
// @namespace    http://tampermonkey.net/
// @version      1.9.3
// @description  BW Canvas Ripper
// @author       XXXXXXXXXIII
// @match        https://viewer.bookwalker.jp/*
// @match        https://viewer-trial.bookwalker.jp/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440878/BWRipper.user.js
// @updateURL https://update.greasyfork.org/scripts/440878/BWRipper.meta.js
// ==/UserScript==

const height = 1600; // USER: Maximize enderer size, this allows downloading with no side margins
const width = 1125;

(function() {
    'use strict';
    console.log("Hello There");

    var id = setInterval(function setRenderer() {
        var renderer = getRenderer();
        if (!renderer) return;
        renderer.style.width = width + 'px';
        renderer.style.height = height + 'px';
        //clearInterval(id); // Keep it running
    }, 10);

    console.log("Ripper will start rippin' in 5 seconds");
    setTimeout(main, 5000);
})();

function main() {
    var saved = false;
    var page = -1;
    setInterval(() => {
        try {
            if (page < 1) page = getPageNum();
            if (page != getPageNum()) saved = false;
            if (page < 1 || saved) return;
            if (isLoading()) return;
            console.log("rippin' page " + getPageNum());
            let canvas = getActiveCanvas();
            saveCanvas(canvas, getPageNum());
            saved = true;
            page = getPageNum();
            NFBR.a6G.Initializer.v9x.menu.a6l.moveToNext(); // USER: Auto page flip
        } catch (e) {
            console.log("Not Ready", e.message);
            saved = false;
        }
    }, 2000); // USER: Auto flip time interval
}

function getRenderer() {
    return document.getElementById('renderer');
}

function saveCanvas(canvas, page) {
    //let image = canvas.toDataURL("image/jpeg", 1.0); // Very Slow, highly not recommended.
    var crop = document.createElement("CANVAS");
    crop.width = canvas.width;
    crop.height = canvas.height - Math.floor(canvas.height / 500); // Crop bottom barcode
    var ctx = crop.getContext("2d");
    ctx.drawImage(canvas, 0, 0);
    crop.toBlob((blob) => {
        var image = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = image;
        document.body.appendChild(a);
        a.download = page + ".jpg";
        a.click(); // USER: Disable ask where to store file location setting for usability
        document.body.removeChild(a);
    }, "image/jpg", 1.0);
}

function isLoading() {
    if (document.getElementById('viewport0').style.visibility == 'visible') {
        return document.getElementById('viewport0').getElementsByClassName("loading")[0].style.visibility == 'visible';
    } else {
        return document.getElementById('viewport1').getElementsByClassName("loading")[0].style.visibility == 'visible';
    }
}

function getActiveCanvas() {
    if (document.getElementById('viewport0').style.visibility == 'visible') {
        return document.getElementById('viewport0').getElementsByTagName("CANVAS")[0];
    } else {
        return document.getElementById('viewport1').getElementsByTagName("CANVAS")[0];
    }
}

function getPageNum() {
    var pageNum = document.getElementById('pageSliderCounter').innerHTML;
    return Number(pageNum.replace(/\/.*/i, ""));
}