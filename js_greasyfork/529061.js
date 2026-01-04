// ==UserScript==
// @name         修改学籍照片为自己上传的图片
// @namespace    http://jw.imut.edu.cn
// @version      1.4
// @description  访问学籍系统时，将目标图片替换为用户上传的Base64格式图片
// @match        http://jw.imut.edu.cn/academic/index_frame.jsp*
// @match        http://jw.imut.edu.cn/academic/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529061/%E4%BF%AE%E6%94%B9%E5%AD%A6%E7%B1%8D%E7%85%A7%E7%89%87%E4%B8%BA%E8%87%AA%E5%B7%B1%E4%B8%8A%E4%BC%A0%E7%9A%84%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/529061/%E4%BF%AE%E6%94%B9%E5%AD%A6%E7%B1%8D%E7%85%A7%E7%89%87%E4%B8%BA%E8%87%AA%E5%B7%B1%E4%B8%8A%E4%BC%A0%E7%9A%84%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从油猴存储中获取保存的 Base64 图片
    let base64Image = GM_getValue('base64Image', '');

    // 定义替换图片的函数
    function replaceImageSrc(doc) {
        let img = doc.getElementById('photo'); // 假设目标图片的 id 为 "photo"
        if (img && base64Image) {
            img.src = base64Image;
            console.log('图片已替换为保存的 Base64 格式');
        }
    }

    // 在当前页面替换图片
    replaceImageSrc(document);

    // 处理页面中的 iframe
    let iframes = document.getElementsByTagName('iframe');
    for (let i = 0; i < iframes.length; i++) {
        try {
            let iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
            replaceImageSrc(iframeDoc);
        } catch (e) {
            console.error('无法访问 iframe 内容：', e);
        }
    }

    // 只在主页面注册上传图片的菜单命令
    if (window.top === window) {
        GM_registerMenuCommand('上传图片并保存为Base64', function() {
            // 创建隐藏的 input 元素用于选择文件
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*'; // 限制只选择图片文件
            input.style.display = 'none';
            document.body.appendChild(input);

            // 监听文件选择事件
            input.addEventListener('change', function() {
                let file = input.files[0];
                if (file) {
                    let reader = new FileReader();
                    reader.onload = function(e) {
                        let base64 = e.target.result; // 获取 Base64 编码
                        GM_setValue('base64Image', base64); // 保存到油猴存储
                        base64Image = base64; // 更新当前变量
                        alert('图片已成功转换为 Base64 并保存！请刷新页面以应用更改。');
                        // 立即替换当前页面和 iframe 中的图片
                        replaceImageSrc(document);
                        let frames = document.getElementsByTagName('iframe');
                        for (let i = 0; i < frames.length; i++) {
                            try {
                                let iframeDoc = frames[i].contentDocument || frames[i].contentWindow.document;
                                replaceImageSrc(iframeDoc);
                            } catch (e) {
                                console.error('无法访问 iframe 内容：', e);
                            }
                        }
                    };
                    reader.readAsDataURL(file); // 读取文件为 Base64
                }
            });

            // 触发文件选择对话框
            input.click();
            document.body.removeChild(input); // 清理 input 元素
        });
    }
})();