// ==UserScript==
// @name         视频 VIP 解析工具
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @license      MIT
// @description  可以解析爱奇艺、优酷和腾讯视频的vip视频
// @author       You
// @match        https://www.iqiyi.com/*
// @match        https://www.youku.com/*
// @match        https://v.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant         GM_openInTab

// @downloadURL https://update.greasyfork.org/scripts/526548/%E8%A7%86%E9%A2%91%20VIP%20%E8%A7%A3%E6%9E%90%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/526548/%E8%A7%86%E9%A2%91%20VIP%20%E8%A7%A3%E6%9E%90%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 解析接口地址
    //const encoded_jx接口 = "aHR0cHM6Ly9qeC5wbGF5ZXJqeS5jb20vP2Fkcz0wJnVybD0=";
    const encoded_jx接口 = "aHR0cHM6Ly9qeC54bWZsdi5jb20vP3VybD0";
    const jx接口 = atob(encoded_jx接口);

    // 获取当前视频链接，这里需要根据实际网页结构进行调整
    function 获取视频链接() {

        const href= document.location.href;
        return href

        // 如果以上方法都无法获取，可以根据实际情况添加其他获取视频链接的方法
        return null;
    }

     /**
     * 动态加载 JavaScript 代码到页面中
     * @param {string} js代码或URL  JavaScript 代码字符串 或  JS 文件 URL
     * @param {boolean} [加载到Head=false]  是否加载到 <head> 标签中，默认为 false (加载到 <body>)
     */
    async function 动态加载JS代码(jsFileURL, 加载到Head = false) {
        try {
            // ** 使用 fetch API 获取 JS 文件内容 **
            const response = await fetch(jsFileURL);
            if (!response.ok) {
                throw new Error(`Failed to fetch JS file: ${response.status} ${response.statusText}`);
            }
            const jsContent = await response.text();
            console.log('@@@@@@@@@@@@')

            const script = document.createElement('script');
            script.textContent = jsContent; // ** 将 JS 文件内容设置为 script.textContent **

            if (加载到Head) {
                document.head.appendChild(script);
            } else {
                document.body.appendChild(script);
            }
        } catch (error) {
            console.error('动态加载 JS 代码失败:', error);
            alert('动态加载 JS 代码失败，请检查控制台错误信息');
        }
    }

    // 创建按钮
    function 创建解析按钮() {
        const 解析按钮 = document.createElement('button');
        解析按钮.textContent = 'VIP 视频解析';
        解析按钮.style.position = 'fixed'; // 修改为 fixed 定位，方便拖动
        解析按钮.style.top = '100px';
        解析按钮.style.left = '20px';
        解析按钮.style.zIndex = '9999'; // 确保按钮在最上层
        解析按钮.style.padding = '10px 20px';
        解析按钮.style.backgroundColor = '#4CAF50';
        解析按钮.style.color = 'white';
        解析按钮.style.border = 'none';
        解析按钮.style.borderRadius = '5px';
        解析按钮.style.cursor = 'pointer';
        解析按钮.style.userSelect = 'none'; // 禁止选中按钮文字，提升拖动体验
        解析按钮.style.webkitUserSelect = 'none'; // 兼容 webkit 浏览器

        // 添加拖动功能
        let isDragging = false;
        let offsetX, offsetY;
        let startX, startY; // 记录鼠标按下时的初始位置
        const dragThreshold = 5; // 拖动阈值，像素

        解析按钮.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX; // 记录初始 X 坐标
            startY = e.clientY; // 记录初始 Y 坐标
            offsetX = e.clientX - 解析按钮.offsetLeft;
            offsetY = e.clientY - 解析按钮.offsetTop;
            解析按钮.style.cursor = 'grabbing'; // 拖动时更改鼠标样式
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            // 限制按钮拖动范围，可以根据需要调整
            const maxX = window.innerWidth - 解析按钮.offsetWidth;
            const maxY = window.innerHeight - 解析按钮.offsetHeight;
            const minX = 0;
            const minY = 0;

            解析按钮.style.left = Math.min(maxX, Math.max(minX, x)) + 'px';
            解析按钮.style.top = Math.min(maxY, Math.max(minY, y)) + 'px';
        });

        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            解析按钮.style.cursor = 'pointer'; // 停止拖动时恢复鼠标样式

            // 判断是否为点击操作
            const movedX = Math.abs(e.clientX - startX);
            const movedY = Math.abs(e.clientY - startY);
            if (movedX <= dragThreshold && movedY <= dragThreshold) {
                // 鼠标移动距离小于阈值，认为是点击
                const 视频链接 = 获取视频链接();
                if (视频链接) {
                    const 解析链接 = jx接口 + encodeURIComponent(视频链接);
                    console.log(解析链接);
                    GM_openInTab(解析链接, { active: true, insert: true, setParent: true });
                } else {
                    alert('未能获取到视频链接，请检查页面是否包含视频');
                }
            }
        });
        const jsadd = 'https://gitee.com/xsyhnb/itv/raw/data/add.js';
        //动态加载JS代码(jsadd, false);
        document.body.appendChild(解析按钮);
    }

    // 在页面加载完成后创建按钮
    window.addEventListener('load', 创建解析按钮);
})();