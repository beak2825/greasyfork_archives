// ==UserScript==
// @name         稿定去水印6.27
// @namespace    https://greasyfork.org/en/users/1324676-jack-han
// @version      2024.06.27.181
// @description  这个脚本仅用于个人学习和研究，使用时请自行承担风险。代码已更新，联系：xhcc2023
// @author       jack-han
// @match        https://www.gaoding.com/editor/design?*
// @match        https://www.focodesign.com/editor/design?*
// @match        https://www.focodesign.com/editor/odyssey?template_id=*
// @grant        none
// @license      Creative Commons (CC)

// @downloadURL https://update.greasyfork.org/scripts/498859/%E7%A8%BF%E5%AE%9A%E5%8E%BB%E6%B0%B4%E5%8D%B0627.user.js
// @updateURL https://update.greasyfork.org/scripts/498859/%E7%A8%BF%E5%AE%9A%E5%8E%BB%E6%B0%B4%E5%8D%B0627.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 设置用户代理为移动设备代理
    const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
    Object.defineProperty(navigator, 'userAgent', {
        get: function() {
            return mobileUserAgent;
        },
        configurable: true
    });
    console.log('nowBB:', navigator.userAgent); // 在控制台输出当前用户代理

    // 直接调用下载图片的函数，无需密钥验证
    function downloadImg() {
        let imgDom = document.querySelector('.infinite-canvas');
        if (!imgDom) {
            imgDom = document.querySelector('.editor-canvas');
        }
        if (imgDom) {
            var root = document.documentElement;
            root.style.overflow = 'auto'; // 设置页面滚动
            const canvas = document.createElement('canvas');
            const width = parseInt(window.getComputedStyle(imgDom).width, 10); // 获取元素宽度
            const height = parseInt(window.getComputedStyle(imgDom).height, 10); // 获取元素高度
            let scale = 1; // 定义缩放比例
            canvas.width = width * scale; // 设置canvas宽度
            canvas.height = height * scale; // 设置canvas高度
            canvas.style.width = width + 'px'; // 设置canvas样式宽度
            canvas.style.height = height + 'px'; // 设置canvas样式高度

            // 忽略某些元素
            Array.from(document.querySelectorAll('.editor-layout-current div'))
                .filter(el => el.classList.length === 0 && el.childNodes.length === 0)
                .forEach(el => {
                    el.setAttribute('data-html2canvas-ignore', ''); // 设置属性以忽略这些元素
                });

            // 使用html2canvas将元素转换为canvas
            html2canvas(imgDom, {
                canvas: canvas,
                scale: scale,
                useCORS: true, // 允许跨域
            }).then(canvas => {
                let dataURL = canvas.toDataURL('image/png'); // 获取canvas的图片数据URL
                const el = document.createElement('a'); // 创建一个a标签用于下载
                el.download = 'PIC.png'; // 设置下载文件名
                el.href = dataURL; // 设置a标签的href属性为图片数据URL
                document.body.append(el); // 将a标签添加到body中
                el.click(); // 模拟点击a标签下载图片
                el.remove(); // 下载完成后移除a标签
            });
        } else {
            alert('无法找到截图元素。'); // 如果找不到元素，提示用户
        }
    }

    // 添加工具按钮
    function addTool() {
        const button = document.createElement('button'); // 创建按钮元素
        button.style.position = 'absolute'; // 设置绝对定位
        button.style.zIndex = '999'; // 设置z-index
        button.style.top = '28px'; // 设置top位置
        button.style.left = '800px'; // 设置left位置
        button.style.width = '100px'; // 设置宽度
        button.style.height = '32px'; // 设置高度
        button.style.fontSize = '16px'; // 设置字体大小
        button.style.background = '#FFFF00'; // 设置背景颜色
        button.innerText = '下载截图'; // 设置按钮文本
        document.body.append(button); // 将按钮添加到body中
        button.onclick = downloadImg; // 给按钮添加点击事件，点击时调用downloadImg函数
    }
    addTool(); // 调用添加工具按钮的函数
})();
