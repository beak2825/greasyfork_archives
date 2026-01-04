// ==UserScript==
// @name         美图抠图助手
// @namespace    http://tampermonkey.net/
// @version      1.40
// @released     2024-03-01_14:48:51_914
// @description  下载抠图的图像
// @author       果心豆腐酱
// @match        https://cutout.x-design.com/*
// @downloadURL https://update.greasyfork.org/scripts/489274/%E7%BE%8E%E5%9B%BE%E6%8A%A0%E5%9B%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/489274/%E7%BE%8E%E5%9B%BE%E6%8A%A0%E5%9B%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

监测页面元素2();
function 监测页面元素2() {
    const TMD = (function () {
        let lang, host, history, show_sensitive, is_tweetdeck;
        return {
            init: async function () {
                let observer = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(node => this.detect(node))));
                observer.observe(document.body, { childList: true, subtree: true });
            },
            detect: function (node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    处理函数(node);
                }
            },
        }
    })();
    TMD.init();
}
function 处理函数(node) {
    var 下载按钮box = node.querySelector('[class="SingleResultPreview_btnWrapper__IjHtL"]');
    
    if (下载按钮box) {
        var xz = `<span class="candy-DownloadBold" style="display: inline-block; font-size: 18px;"></span><span class="SingleResultPreview_uploadText__IHdnz">下载图片（免登录）</span>`;
        
        // 创建下载按钮元素
        var 下载按钮 = document.createElement('div');
        下载按钮.className = `SingleResultPreview_downloadBtn__CIOu2 SingleResultPreview_Btn__8c0_n`;
        
        // 将 xz 的内容添加到下载按钮中
        下载按钮.innerHTML = xz;
        
        // 将下载按钮添加到下载按钮盒子中
        下载按钮box.appendChild(下载按钮);
        下载按钮.addEventListener('click', function (event) {
            event.stopPropagation(); // 阻止事件冒泡
            event.preventDefault(); // 阻止默认行为
            // 获取 canvas 元素
            var canvas = document.querySelector('.SingleResultPreview_canvas__kHXix');

            // 将画布内容转换为数据 URL
            var imageDataURL = canvas.toDataURL();

            // 创建一个链接元素
            var downloadLink = document.createElement('a');

            // 设置链接的属性，包括下载文件的名称和数据 URL
            downloadLink.href = imageDataURL;
            downloadLink.download = 'canvas_image.png'; // 下载文件的名称

            // 将链接添加到页面中
            document.body.appendChild(downloadLink);

            // 模拟点击链接进行下载
            downloadLink.click();
        })
    }
}