// ==UserScript==
// @name         微信公众号文章图片下载工具
// @namespace    zhangchengmcbedrock
// @version      1.2.1
// @description  方便在微信公众号文章中快速下载所有图片
// @author       zhangchengmcbedrock
// @match        https://mp.weixin.qq.com/s*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496009/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/496009/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建并添加按钮
    var button = document.createElement('button');
    button.textContent = '获取图片';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.backgroundColor = '#f44';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // 检查页面是否已滚动到底部
    function isScrolledToBottom() {
        return (window.innerHeight + window.scrollY) >= document.body.scrollHeight;
    }

    // 按钮点击事件
    button.addEventListener('click', function() {
        if (!isScrolledToBottom()) {
            alert('请滑动到底部再使用此功能。');
            return;
        }

        // 查找所有以https://mmbiz.qpic.cn/开头的链接
        var links = Array.from(document.querySelectorAll('img[src^="https://mmbiz.qpic.cn/"]')).map(img => img.src);

        if (links.length > 0) {
            // 提示用户选择操作
            var choice = prompt(`找到${links.length}个图片。请选择操作：\n1. 复制图片链接（推荐）\n2. 保存全部图片链接为txt文件（兼容模式）\n请输入1或2：`);

            if (choice === '1') {
                // 复制全部链接
                navigator.clipboard.writeText(links.join('\n')).then(() => {
                    alert('图片链接已复制到剪贴板');
                }).catch(err => {
                    alert('复制失败，可能出现兼容性问题，可以选择兼容模式：' + err);
                });
            } else if (choice === '2') {
                // 保存全部链接为txt文件
                var fileContent = links.join('\n');
                var blob = new Blob([fileContent], { type: 'text/plain' });
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'image_links.txt';
                a.click();
                URL.revokeObjectURL(url);
            } else {
                alert('无效的选择，');
            }
        } else {
            alert('未找到任何图片！可能是文章没有放图片或工具出现了问题。');
        }
    });
})();
