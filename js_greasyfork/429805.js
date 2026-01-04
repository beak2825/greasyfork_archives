// ==UserScript==
// @name         百度百科 图册图片查看无水印图片
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  去除百度百科图册中的图片水印，查看原图时目标链接也是无水印版本
// @author       Esgloamp
// @match        http*://baike.baidu.com/pic/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/429805/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%20%E5%9B%BE%E5%86%8C%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/429805/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%20%E5%9B%BE%E5%86%8C%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var targetElement = document.getElementById('imgPicture');
    targetElement.onload = function () {
        // imgPicture父节点
        let pictureDiv = document.getElementById('picture');


        // 当前有水印的图片
        let currImg = document.getElementById("imgPicture");

        // 获取无水印图的url
        let noMarkUrl = currImg.getAttribute('src').split('?')[0];

        // 右下角查看原图的目标链接也随着更改
        let srcImg = document.getElementsByClassName('tool-button origin');
        srcImg[0].setAttribute('href', noMarkUrl);

        let noMarkImg = document.createElement('img');
        noMarkImg.setAttribute("id", "NoMarkImg");
        noMarkImg.setAttribute("src", noMarkUrl);
        noMarkImg.setAttribute("onload", "imageResize()")
        noMarkImg.setAttribute("style",
            `visibility: visible; 
             position: absolute;
             display: inline-block;
             width: ${currImg.width}px;
             height: ${currImg.height}px;
             left: ${currImg.offsetLeft}px;
             top: ${currImg.offsetTop}px;
             margin-top: 1px;`);
        noMarkImg.setAttribute("url", noMarkUrl)
        pictureDiv.removeChild(pictureDiv.lastChild);
        pictureDiv.appendChild(noMarkImg);
        currImg.style.display = "none";
        console.debug("fucking imageResize finished");

    };
})();