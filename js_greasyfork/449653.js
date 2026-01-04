// ==UserScript==
// @name         neoCmoaRipper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  GrimRipper Cmoa upgraded
// @author       XXXXXXXXXIII, weebuwy
// @match        https://www.cmoa.jp/bib/speedreader/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cmoa.jp
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449653/neoCmoaRipper.user.js
// @updateURL https://update.greasyfork.org/scripts/449653/neoCmoaRipper.meta.js
// ==/UserScript==

const width = 1125; // USER: image size
const height = 1600;

let downloaded = [];

(function() {
    'use strict';
    var page = -1;

    setInterval(() => {
        try {
            if (page < 1) page = getPageNum();
          	page = getPageNum();
          
          	for (let i = 1; i <= page; i++) {
            	if (downloaded.includes(i)) continue;
              setContainer(i);
              let imgs = getImgs(i);
              saveImage(imgs, i);
              downloaded.push(i);
            }
        } catch (e) {
            console.log(e.message);
        }
    }, 100);
})();

function saveImage(imgs, page) {
  	console.log(`saved page ${page}`);
  
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = 1125;
    canvas.height = 1600;
    ctx.drawImage(imgs[0], 0, 0);
    ctx.drawImage(imgs[1], 0, canvas.height * 0.3325);
    ctx.drawImage(imgs[2], 0, canvas.height * 0.665 );
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

