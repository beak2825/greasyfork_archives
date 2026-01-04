// ==UserScript==
// @name         Mozilla-Image-Viewer
// @description  Modify the default jump view method for Mozilla document images to the current page preview
// @include      http*
// @version      1.0.0
// @author       Eilen https://github.com/EilenC
// @grant        none
// @match        https://developer.mozilla.org/*
// @namespace    https://greasyfork.org/users/319354
// @supportURL   https://github.com/EilenC/Tampermonkey-Scripts/blob/master/MozillaDocumentImageViewer/viewer.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/492951/Mozilla-Image-Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/492951/Mozilla-Image-Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载后执行
    window.addEventListener('load', function() {
        var images = document.querySelectorAll('img');

        // 移除图片外层的链接
        images.forEach(function(img) {
            var link = img.parentNode;
            if (link.tagName.toLowerCase() === 'a') {
                var parent = link.parentNode;
                parent.insertBefore(img, link);
                parent.removeChild(link);
            }
        });

        // 为所有图片添加点击缩放功能
        function zoomImage(img) {
            // 创建覆盖层元素
            var overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // 修改背景颜色为半透明黑色
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.zIndex = '9999';

            // 创建图片元素
            var zoomedImg = document.createElement('img');
            zoomedImg.src = img.src;
            zoomedImg.style.maxWidth = '90%';
            zoomedImg.style.maxHeight = '90%';
            overlay.appendChild(zoomedImg);

            // 添加到文档
            document.body.appendChild(overlay);

            // 点击事件处理
            overlay.onclick = function() {
                document.body.removeChild(overlay);
            };
        }

        images.forEach(function(img) {
            img.onclick = function() {
                zoomImage(this);
            };
        });
    });
})();