// ==UserScript==
// @name         NicePT大图
// @description  NicePT大图模式
// @include      *://www.nicept.net/*
// @version      0.0.1
// @run-at       document-end
// @grant         none
// @icon         https://www.nicept.net/favicon.ico
// @namespace https://greasyfork.org/users/461433
// @downloadURL https://update.greasyfork.org/scripts/525024/NicePT%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/525024/NicePT%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //图片宽度
    let newWidth = 446;

    console.log('=== 开始检查 .embedded 元素 ===');

    // 获取所有 .embedded 元素
    let embeddedElements = document.getElementsByClassName('embedded');

    // 遍历每个 .embedded 元素
    Array.from(embeddedElements).forEach((embedded) => {
        // 获取 .embedded 元素的宽度
        let width = embedded.style.width || window.getComputedStyle(embedded).width;

        // 如果 .embedded 元素的宽度是 46px
        if (width === '46px') {
            console.log('=== 找到宽度为 46px 的 .embedded 元素 ===');

            // 获取第一个子元素（假设它是 img）
            let firstChild = embedded.children[0];

            // 判断子元素是否存在，并且是图片（img）
            if (firstChild && firstChild.tagName.toLowerCase() === 'img') {
                // 获取图片的原始宽高
                let img = firstChild;
                // 修改图片的宽度和高度
                img.style.width = newWidth + 'px';
                //img.style.height = newHeight + 'px';
                //取消max
                img.style.maxWidth = 'none';
                img.style.maxHeight = 'none';

                console.log('=== 修改了第一个元素（图片）宽度为 346px，并保持比例 ===');
            } else {
                console.log('=== 第一个子元素不是图片，跳过修改 ===');
            }
        }
    });
})();