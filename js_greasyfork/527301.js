// ==UserScript==
// @name         processon流程图免费下载
// @namespace    http://tampermonkey.net/
// @version      2025-02-18
// @description  声明仅用于学习
// @author       You
// @match        https://www.processon.com/v/67b422e1babf5a32685b614d
// @icon         https://www.google.com/s2/favicons?sz=64&domain=processon.com
// @license             End-User License Agreement
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527301/processon%E6%B5%81%E7%A8%8B%E5%9B%BE%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/527301/processon%E6%B5%81%E7%A8%8B%E5%9B%BE%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
// ***************************************************************声明仅用于学习***************************************************************
(function() {
    'use strict';
    // 设置图片清晰度
    var scaleFactor = 3;
    var box = document.createElement('div')
    box.id = 'down-box'
    box.innerHTML = `<div style="position: fixed;z-index:999999;top: 50%;right: 0;background-color: pink;padding: 10px;">
        <h2 style="align='center'">processon流程图免费下载</h2>
        <p>步骤1: 文件=>导出为=>高清PNG</p>
        <p>步骤2: 点击插件下载png</p>
        <div><button class="down-png-btn">下载高清png</button></div>
    </div>`
    box.querySelector('#down-box .down-png-btn').addEventListener('click',downImgFn)
    function downImgFn(){
        var boxEl = document.querySelector('.water_perview .water_image_ontainer');
        var svgElement = boxEl.querySelector('svg');
        if (!boxEl || !svgElement || svgElement.tagName !== "svg") {
            alert("请执行步骤1");
            return;
        }
        svgElement.style.transform = boxEl.style.transform = 'scale(1)'
        svgElement.style.top =boxEl.style.top = 0
        svgElement.style.left = boxEl.style.left = 0
        var svgXML = new XMLSerializer().serializeToString(svgElement);

        var img = new Image();
        var svgBlob = new Blob([svgXML], { type: "image/svg+xml" });
        var url = URL.createObjectURL(svgBlob);
        img.onload = function() {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            var width = svgElement.width.baseVal.value || svgElement.getBoundingClientRect().width;
            var height = svgElement.height.baseVal.value || svgElement.getBoundingClientRect().height;

            canvas.width = width * Math.max(1,scaleFactor);
            canvas.height = height * Math.max(1,scaleFactor);
            context.drawImage(img, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
            var link = document.createElement('a');
            link.href = canvas.toDataURL("image/png");
            link.download = "high_res_image.png";
            link.click();
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }
    document.body.append(box)

})();