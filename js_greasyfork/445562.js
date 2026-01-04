// ==UserScript==
// @name         保存中国政府网政策到图片
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  保存中国政府网内容到图片
// @author       You
// @match        http://www.gov.cn/*
// @exclude      http://www.gov.cn/2016public/top.htm
// @exclude      http://www.gov.cn/2016public/bottom.htm
// @exclude      http://www.gov.cn/govweb/xhtml/public/dyiframe.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.gov.cn
// @require      https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445562/%E4%BF%9D%E5%AD%98%E4%B8%AD%E5%9B%BD%E6%94%BF%E5%BA%9C%E7%BD%91%E6%94%BF%E7%AD%96%E5%88%B0%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/445562/%E4%BF%9D%E5%AD%98%E4%B8%AD%E5%9B%BD%E6%94%BF%E5%BA%9C%E7%BD%91%E6%94%BF%E7%AD%96%E5%88%B0%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function download() {
        var ele = document.querySelector('.padd');
        if (!ele) ele = document.querySelector('.wrap');
        var title = document.title.trim()
        domtoimage.toBlob(ele)
            .then(function (blob) {
            // window.saveAs(blob, 'my-node.png');
            var blobUrl = URL.createObjectURL(blob);
            var link = document.createElement("a"); // Or maybe get it from the current document
            link.href = blobUrl;
            link.download = title + ".jpg";
            link.innerHTML = "图片下载";
            link.style = 'width: 32px;display: block;padding: 10px;background: #c1c1c1;color: white;border-radius: 5px;position: fixed;top: 20%;right: 15%;line-height:1.31;'
            var mountEle = document.querySelector('div.w1100');
            if (!mountEle) mountEle = document.querySelector('div.content');
            mountEle.appendChild(link); // Or append it whereever you want
        });
    }

    download();
})();