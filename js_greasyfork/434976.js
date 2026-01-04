// ==UserScript==
// @name         img_adjust
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  picture adjust to 1200 * 1200
// @author       yao
// @match        
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @include      https://www.blu-ray.com/movies/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/434976/img_adjust.user.js
// @updateURL https://update.greasyfork.org/scripts/434976/img_adjust.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("aaa");
    $('#frontimage_overlay').hover(function(e){
        return handle(e,$(this));
    },function(){
        setTimeout(function(){ removeImage(); },2000);
    });

    function handle(e,element){
        showImage(e);
        return false;
    }

    //获取图片
    function showImage(e){
        $('#tempId').remove();
        var tempBtn = $('<button id = "tempId">1200*1200</button>');
        tempBtn.css({
            width:50,
            height:50,
            position:'absolute',
            top:e.pageY,
            left:e.pageX+30
        });
        $(tempBtn).click(doHandle);
        $('body').eq(0).append(tempBtn);
    }
    // Your code here...
})();


function removeImage(){
    console.log('开始移除图片');
    $('#tempId').remove();
}

function doHandle() {
    console.log("do");
    $('#triggers img').trigger('click');
    let src = $('#frontimage').attr('src');
    adjust(src);
}

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


