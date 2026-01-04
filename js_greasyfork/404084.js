// ==UserScript==
// @name         刺猬猫VIP章节图片去水印
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  去除刺猬猫VIP章节图片上烦人的水印
// @author       菜姬
// @match        *://www.ciweimao.com/chapter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404084/%E5%88%BA%E7%8C%AC%E7%8C%ABVIP%E7%AB%A0%E8%8A%82%E5%9B%BE%E7%89%87%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/404084/%E5%88%BA%E7%8C%AC%E7%8C%ABVIP%E7%AB%A0%E8%8A%82%E5%9B%BE%E7%89%87%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    // Your code here...
        let threshold = 192;
    function image2line(img) {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        filter(canvas, ctx, threshold);
        return canvas.toDataURL();
    }
    async function imageUrl2line(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve(image2line(img));
            };
            img.src = url;
        });
    }
    function filter(canvas, c, threshold) {
        let imgData = c.getImageData(0, 0, canvas.width, canvas.height);
        let backgroudR = imgData.data[0];
        let backgroudG = imgData.data[1];
        let backgroudB = imgData.data[2];
        for (let i = 0; i < imgData.data.length; i += 4) {
            let R = imgData.data[i]; //R(0-255)
            let G = imgData.data[i + 1]; //G(0-255)
            let B = imgData.data[i + 2]; //B(0-255)
            // let Alpha = imgData.data[i + 3]; //Alpha(0-255)
            if (R > threshold && G > threshold && B > threshold) {
                imgData.data[i] = backgroudR;
                imgData.data[i + 1] = backgroudG;
                imgData.data[i + 2] = backgroudB;
                imgData.data[i + 3] = 255;
            }
        }
        c.putImageData(imgData, 0, 0);
    }
    let imageDom = document.getElementById("J_BookImage");
    if (imageDom)
    {
        const url = imageDom.style["background-image"].match(/(?:url\(")?(.+)(?:"\))?/)[1];
        const line = await imageUrl2line(url);
        imageDom.style["background-image"] = `url(${line})`;
    }
})();