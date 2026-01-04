// ==UserScript==
// @license MIT
// @name         妖火图片模糊
// @icon         https://yaohuo.me/css/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  默认模糊指定域名的图片和视频，单击后显示清晰内容
// @author       路桥
// @match        *://yaohuo.me/*
// @match        *://www.yaohuo.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521278/%E5%A6%96%E7%81%AB%E5%9B%BE%E7%89%87%E6%A8%A1%E7%B3%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/521278/%E5%A6%96%E7%81%AB%E5%9B%BE%E7%89%87%E6%A8%A1%E7%B3%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 模糊程度设置，单位是像素
    const blurLevel = 100; // 模糊强度

    // 描边样式设置
    const borderColor = 'red'; // 描边颜色
    const borderWidth = '5px'; // 描边宽度

    // 分辨率阈值
    const minWidth = 200;  // 最小宽度
    const minHeight = 200; // 最小高度

    // 选择所有图片和视频
    const mediaElements = document.querySelectorAll('img, video');

    mediaElements.forEach(media => {
        // 等待媒体加载完成
        if (media.tagName === 'IMG') {
            if (!media.complete) {
                media.addEventListener('load', () => checkAndApplyBlur(media));
                return;
            }
        } else if (media.tagName === 'VIDEO') {
            if (media.readyState < 3) { // 3 = HAVE_FUTURE_DATA
                media.addEventListener('loadeddata', () => checkAndApplyBlur(media));
                return;
            }
        }

        // 如果已经加载完成，直接检查并应用模糊
        checkAndApplyBlur(media);
    });

    function checkAndApplyBlur(media) {
        const naturalWidth = media.videoWidth || media.naturalWidth;
        const naturalHeight = media.videoHeight || media.naturalHeight;

        // 跳过分辨率小于阈值的媒体
        if (naturalWidth < minWidth || naturalHeight < minHeight) {
            return;
        }

        applyBlur(media);
    }

    function applyBlur(media) {
        // 创建一个容器包裹媒体元素，限制模糊范围并添加描边
        const wrapper = document.createElement('div');
        wrapper.style.display = 'inline-block';
        wrapper.style.position = 'relative';
        wrapper.style.overflow = 'hidden'; // 限制模糊范围
        wrapper.style.width = `${media.offsetWidth}px`; // 使用 offsetWidth 确保正确宽度
        wrapper.style.height = `${media.offsetHeight}px`; // 使用 offsetHeight 确保正确高度
        wrapper.style.border = `${borderWidth} solid ${borderColor}`; // 添加描边
        wrapper.style.boxSizing = 'border-box'; // 确保描边不影响布局

        // 插入容器，将媒体元素移入容器中
        media.parentNode.insertBefore(wrapper, media);
        wrapper.appendChild(media);

        // 设置媒体的模糊效果和样式
        media.style.filter = `blur(${blurLevel}px)`; // 应用模糊
        media.style.transition = 'filter 0.3s ease';
        media.style.cursor = 'pointer';
        media.style.position = 'absolute'; // 绝对定位确保填充容器
        media.style.top = '0';
        media.style.left = '0';
        media.style.width = '100%'; // 确保媒体填充容器
        media.style.height = '100%'; // 确保媒体填充容器

        // 添加点击事件，切换模糊状态
        media.addEventListener('click', () => {
            if (media.style.filter === `blur(${blurLevel}px)`) {
                media.style.filter = 'none'; // 显示清晰媒体
            } else {
                media.style.filter = `blur(${blurLevel}px)`; // 恢复模糊
            }
        });
    }
})();
