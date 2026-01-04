// ==UserScript==
// @name         网页图片下载器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  下载网页中的图片
// @author       Your Name
// @match        https://mp.weixin.qq.com/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510205/%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/510205/%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮和样式
    const button = document.createElement('button');
    button.innerText = '下载图片';
    
    // 简单的样式设置
    Object.assign(button.style, {
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: '1000',
        fontSize: '16px'
    });

    // 将按钮添加到页面
    document.body.appendChild(button);

    // 创建基本样式对象
    const baseStyle = {
        position: 'fixed',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        padding: '10px',
        zIndex: '1001',
        display: 'none'
    };

    // 错误提示元素
    const errorDiv = document.createElement('div');
    Object.assign(errorDiv.style, baseStyle, {
        backgroundColor: 'red'
    });
    document.body.appendChild(errorDiv);

    // 信息提示元素
    const infoDiv = document.createElement('div');
    Object.assign(infoDiv.style, baseStyle, {
        backgroundColor: 'blue'
    });
    document.body.appendChild(infoDiv);

    // 显示错误提示
    function showError(message) {
        errorDiv.innerText = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    // 显示信息提示
    function showInfo(message) {
        infoDiv.innerText = message;
        infoDiv.style.display = 'block';
        setTimeout(() => {
            infoDiv.style.display = 'none';
        }, 5000);
    }

    // 按钮点击事件处理函数
    button.addEventListener('click', () => {
        button.disabled = true; // 禁用按钮
        downloadImages().finally(() => {
            button.disabled = false; // 所有操作完成后重新启用按钮
        });
    });

    // 下载图片的函数
    async function downloadImages() {
        try {
            // 获取当前时间，并格式化为 "年月日时分秒" 格式
            const now = new Date();
            const formattedTime = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}` +
                                  `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

            // 获取 id 为 'activity-name' 的节点的内部文字，并去掉前后空白
            const activityNameNode = document.getElementById('activity-name');
            let activityName;
            if (activityNameNode) {
                activityName = activityNameNode.innerText.trim();
            } else {
                activityName = document.title.trim(); // 用页面标题代替
            }

            // 获取 id 为 'page-content' 的元素
            const pageContent = document.getElementById('page-content');
            if (!pageContent) {
                showError('找不到 id 为 page-content 的元素');
                return;
            }

            // 获取所有图片元素
            const images = Array.from(pageContent.querySelectorAll('img'));
            if (images.length === 0) {
                showError('没有找到图片元素');
                return;
            }

            // 用于存放图片下载链接
            const downloadLinks = [];

            images.forEach((img, index) => {
                // 优先使用 data-src 属性
                const src = img.getAttribute('data-src') || img.getAttribute('src');
                if (src) {
                    // 匹配形如 /sz_mmbiz_jpg/ 的部分，并获取其后缀
                    const match = src.match(/\/sz_mmbiz_(\w+)\//);
                    if (match && match[1]) {
                        const extension = match[1];
                        downloadLinks.push({ url: src, extension: extension });
                    } else {
                        showInfo(`无法从地址提取文件后缀: ${src}`);
                    }
                } else {
                    showInfo('图片元素缺少有效的 src 或 data-src 属性');
                }
            });

            // 下载图片函数
            for (let i = 0; i < downloadLinks.length; i++) {
                setTimeout(async () => {
                    try {
                        const response = await fetch(downloadLinks[i].url);
                        // 确保请求成功
                        if (!response.ok) {
                            throw new Error(`网络响应失败: ${response.statusText}`);
                        }
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = `${activityName}_${formattedTime}_${i + 1}.${downloadLinks[i].extension}`; // 使用 `activityName`, `formattedTime`, 和 下载计数器生成的文件名
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        showInfo(`下载图片: ${activityName}_${formattedTime}_${i + 1}.${downloadLinks[i].extension}`);
                    } catch (error) {
                        showError(`下载图片时发生错误: ${error.message}`);
                    }
                }, i * 1000); // 每次延迟 i * 1000 毫秒
            }

            showInfo('图片下载链接已生成并开始下载');
        } catch (error) {
            showError(`执行下载时发生错误: ${error.message}`);
        }
    }
})();