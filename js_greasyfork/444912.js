// ==UserScript==
// @name         download image ttt
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  download image ttt.
// @author       yao
// @match        https://detail.tmall.com/item.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=starsing.cn
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/444912/download%20image%20ttt.user.js
// @updateURL https://update.greasyfork.org/scripts/444912/download%20image%20ttt.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ele = $('<a href="javascript:void(0)">click</a>');
    ele.click(function(){
       document.querySelectorAll('#J_UlThumb img').forEach(i=>adjust(i.src.replace("_60x60q90.jpg","")));
    });
    setTimeout(function(){
        $('#hd').after(ele);
    },2000)

    // Your code here...
})();

function adjust(src) {
    var canvas = document.createElement('canvas');

    canvas.width = 1200;
    canvas.height = 1200;

    var ctx = canvas.getContext('2d');

    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    let img = new Image;
    img.onload = _ => {
        console.log(img.naturalWidth, img.naturalHeight);
        let max = Math.max(img.naturalHeight, img.naturalWidth);
        let ratio = img.naturalWidth / img.naturalHeight;
        if (max === img.naturalHeight) {
            img.width = 300 * ratio;
            let height = 1200;
            let width = 1200 * ratio;
            ctx.drawImage(img, (1200 - width) / 2, 0, width, height);
            console.log("download");
            download(canvas);
        }
    }
    img.src = src;
    img.setAttribute("crossOrigin", "Anonymous");
}

function download(canvas) {
    let dom = document.createElement("a");
    dom.href = canvas.toDataURL("image/jpeg");
    dom.download = new Date().getTime() + ".jpg";
    dom.click();
}