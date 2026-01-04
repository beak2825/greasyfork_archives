// ==UserScript==
// @name         nettai ripper
// @namespace    http://tampermonkey.net/
// @version      2024-02-04
// @description  ripper for comicnettai
// @author       XXXXXXXXXIII
// @match        https://www.comicnettai.com/publus/viewer.html*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500568/nettai%20ripper.user.js
// @updateURL https://update.greasyfork.org/scripts/500568/nettai%20ripper.meta.js
// ==/UserScript==


const width = 1125; // USER: image size
const height = 1600;

(function() {
    'use strict';
    console.log("Hello There");
    console.log("Ripper will start rippin' in 2 seconds");
    setTimeout(main, 2000);
})();

function main() {
    'use strict';
    var saved = false;
    var page = -1;

    setInterval(() => {
        try {
            if (page != getPageNum()) saved = false;
            if (saved) return;
            page = getPageNum();
            if (page < 1) throw new Error("Not Ready");
            console.log("Viewing viewport " + (2 - ((page + 1) % 2) - 1))
            let canvas = setCanvas(2 - ((page + 1) % 2) - 1);
            saveCanvas(canvas, page);
            console.log("Page " + page + " saved");
            saved = true;
        } catch (e) {
            console.log(e.message);
        }
    }, 1000);
}

function saveCanvas(canvas, page) {
    //let image = canvas.toDataURL("image/jpeg", 1.0); // Very Slow, highly not recommended.
    canvas.toBlob((blob) => {
        var image = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = image;
        document.body.appendChild(a);
        a.download = page + ".jpg";
        a.click(); // USER: Disable ask where to store file location setting for usability
        document.body.removeChild(a);
    }, "image/jpeg", 1.0);
}

function setCanvas(i) {
    let canvas = $("div[id=viewport" + i + "] canvas").get()[0];
    let ratio = canvas.height / canvas.width;
    canvas.style.width = width + "px";
    canvas.style.height = (width * ratio) + "px";
    return canvas;
}

function getPageNum() {
    var pageNum = document.getElementById('pageSliderCounter').innerHTML;
    pageNum = pageNum.replace(/\/.*/g,'');
    return Number(pageNum);
}

