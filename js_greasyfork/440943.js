// ==UserScript==
// @name         CmoaRipper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  GrimRipper Cmoa
// @author       XXXXXXXXXIII
// @match        https://www.cmoa.jp/bib/speedreader/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cmoa.jp
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440943/CmoaRipper.user.js
// @updateURL https://update.greasyfork.org/scripts/440943/CmoaRipper.meta.js
// ==/UserScript==

const width = 1125; // USER: image size
const height = 1600;

(function() {
    'use strict';
    var saved = false;
    var page = -1;

    setInterval(() => {
        try {
            if (page < 1) page = getPageNum();
            if (page != getPageNum()) saved = false;
            if (saved) return;
            page = getPageNum();
            setContainer(page);
            let imgs = getImgs(page);
            saveImage(imgs, page);
            saved = true;
        } catch (e) {
            console.log(e.message);
        }
    }, 1000);
})();

function saveImage(imgs, page) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imgs[0], 0, 0, canvas.width, canvas.height * 0.33625);
    ctx.drawImage(imgs[1], 0, canvas.height * 0.3325, canvas.width, canvas.height * 0.33625);
    ctx.drawImage(imgs[2], 0, canvas.height * 0.665, canvas.width, canvas.height * 0.33625);
    canvas.toBlob((blob) => {
        var image = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = image;
        document.body.appendChild(a);
        a.download = page + ".png";
        a.click(); // USER: Disable ask where to store file location setting for usability
        document.body.removeChild(a);
    }, 'image/png', 1);
}

function setContainer(page) {
    var container = document.getElementById('content-p' + page);
    container.style.width = width + 'px';
    container.style.height = height + 'px';
}

function getImgs(page) {
    return document.getElementById('content-p' + page).getElementsByTagName('IMG');
}

function getPageNum() {
    var pageNum = document.getElementById('menu_slidercaption').innerHTML;
    return Number(pageNum.replace(/\/.*/i, ""));
}

