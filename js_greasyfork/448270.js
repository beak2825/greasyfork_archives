// ==UserScript==
// @name         CWRipper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Canvas Ripper for Comic Walker
// @author       XXXXXXXXXIII
// @match        https://comic-walker.com/viewer/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=comic-walker.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448270/CWRipper.user.js
// @updateURL https://update.greasyfork.org/scripts/448270/CWRipper.meta.js
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
            let canvas = setCanvas(3 - (page % 3) - 1);
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

function setCanvas(i) {
    let canvas = document.getElementsByTagName('CANVAS')[i];
    canvas.style.width = 'auto';
    canvas.style.height = 'auto';
    return canvas;
}

function getPageNum() {
    var pageNum = document.getElementsByClassName('sc-egiyK')[0].innerHTML;
    pageNum = pageNum.replace(/ \/.*/g,'');
    return Number(pageNum);
}
