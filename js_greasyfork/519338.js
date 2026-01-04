// ==UserScript==
// @name         隐藏腾讯/企业微信文档水印，清爽阅读体验
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  自动隐藏腾讯/企业微信文档中的水印，告别烦人水印，专注阅读
// @author       You
// @match        https://doc.weixin.qq.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519338/%E9%9A%90%E8%97%8F%E8%85%BE%E8%AE%AF%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%96%87%E6%A1%A3%E6%B0%B4%E5%8D%B0%EF%BC%8C%E6%B8%85%E7%88%BD%E9%98%85%E8%AF%BB%E4%BD%93%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/519338/%E9%9A%90%E8%97%8F%E8%85%BE%E8%AE%AF%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%96%87%E6%A1%A3%E6%B0%B4%E5%8D%B0%EF%BC%8C%E6%B8%85%E7%88%BD%E9%98%85%E8%AF%BB%E4%BD%93%E9%AA%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        console.log('页面加载完成，开始等待5秒...');
        
        setTimeout(function() {
            console.log('等待5秒后开始查找水印容器...');
            
            const watermarkContainer = document.getElementById('__watermark_container_id');
            if (watermarkContainer) {
                console.log('找到水印容器，正在隐藏...');
                watermarkContainer.style.display = 'none';
                console.log('水印容器已隐藏');
            } else {
                console.log('没有找到水印容器');
            }
        }, 5000);  // 延迟5秒后执行
    });
})();