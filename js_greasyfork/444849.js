// ==UserScript==
// @name         download image
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  download image.
// @author       You
// @match        https://www.starsing.cn/product/detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=starsing.cn
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/444849/download%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/444849/download%20image.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ele = $('<a href="javascript:void(0)">click</a>');
    let i = 1;
    ele.click(function(){
        document.querySelectorAll('.product-detail-content_eGy_d p img').forEach(e=>adjust(e.src,i++));
    });
    $('.product-share-btn_3t5Ne').after(ele);

    // Your code here...
})();

function adjust(src,index) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    let img = new Image;
    img.onload = _ => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,0,0);
        download(canvas,index);
    }
    img.src = src;
    img.setAttribute("crossOrigin", "Anonymous");
}


function download(canvas,index) {
    let dom = document.createElement("a");
    dom.href = canvas.toDataURL("image/jpeg");
    let id = location.pathname.split('/')[3];
    dom.download = id + "-" + index + ".jpg";
    dom.click();
}