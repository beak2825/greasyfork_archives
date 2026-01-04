// ==UserScript==
// @name         创可贴下载无水印图片
// @version      1.1
// @description  下载无水印图片 左键点击下载 鼠标中键按住拖动下载按钮位置  并非源文件下载，适合手机海报使用
// @author       清欢
// @match        https://www.chuangkit.com/odyssey/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-end
// @license MIT
// @namespace https://greasyfork.org/users/815509
// @downloadURL https://update.greasyfork.org/scripts/485241/%E5%88%9B%E5%8F%AF%E8%B4%B4%E4%B8%8B%E8%BD%BD%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/485241/%E5%88%9B%E5%8F%AF%E8%B4%B4%E4%B8%8B%E8%BD%BD%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加下载按钮到页面
    function addDownloadButton() {
        const button = document.createElement('button'); // 创建新的按钮元素
        button.textContent = '下载图片'; // 设置按钮文本内容

        // 从localStorage获取按钮的位置，如果没有则使用默认值
        const storedTop = localStorage.getItem('buttonTop') || '60px';
        const storedLeft = localStorage.getItem('buttonLeft') || 'calc(100% - 800px)';

        // 设置按钮样式
        Object.assign(button.style, {
            position: 'fixed', // 固定位置
            top: storedTop,    // 顶部位置
            left: storedLeft,  // 左侧位置
            zIndex: '99999',   // z-index确保按钮在最上层
            backgroundImage: 'linear-gradient(to right, deepskyblue, rebeccapurple)', // 背景渐变色
            color: 'white',    // 文字颜色
            border: 'none',    // 无边框
            padding: '10px 20px', // 内边距
            textAlign: 'center',  // 文字居中
            textDecoration: 'none', // 无文本装饰
            display: 'inline-block', // 行内块级元素
            fontSize: '16px',    // 文字大小
            margin: '4px 2px',   // 外边距
            cursor: 'pointer',   // 鼠标手势
            borderRadius: '15px', // 边框圆角
        });

        document.body.appendChild(button); // 将按钮添加到页面中
        button.addEventListener('click', download); // 绑定点击事件到下载函数
        makeDraggable(button); // 使按钮可拖动
    }

    // 使元素可拖动的函数
    function makeDraggable(element) {
        let isDragging = false; // 拖动状态标志
        let dragStartX, dragStartY; // 拖动开始时的鼠标位置

        // 鼠标按下事件
        element.addEventListener('mousedown', function(e) {
            if (e.button === 1) { // 中键为1
                isDragging = true; // 设置拖动标志为真
                dragStartX = e.clientX - element.offsetLeft; // 计算初始偏移量X
                dragStartY = e.clientY - element.offsetTop;  // 计算初始偏移量Y
                e.preventDefault(); // 阻止中键的默认行为
            }
        });

        // 鼠标移动事件
        document.addEventListener('mousemove', function(e) {
            if (isDragging) { // 如果正在拖动
                // 更新元素位置
                element.style.left = (e.clientX - dragStartX) + 'px';
                element.style.top = (e.clientY - dragStartY) + 'px';
            }
        });

        // 鼠标释放事件
        document.addEventListener('mouseup', function(e) {
            if (e.button === 1 && isDragging) { // 如果是中键释放且正在拖动
                isDragging = false; // 设置拖动标志为假
                // 存储新位置到localStorage
                localStorage.setItem('buttonTop', element.style.top);
                localStorage.setItem('buttonLeft', element.style.left);
            }
        });
    }

    // 下载函数，用于处理下载操作
    function download() {
        // 从URL中解析设计ID
        const urlParams = new URLSearchParams(window.location.search);
        const designId = urlParams.get('d') || 'default_design_id';

        // 准备POST请求的数据
        const postData = `render_type=101&design_id=${designId}&GW=true&client_type=0`;

        // 发起POST请求
        GM_xmlhttpRequest({
            method: 'POST', // 请求方法
            url: 'https://gw.chuangkit.com/imagehub/task/addSyncThumbTask.do?_dataType=json&client_type=0', // 请求URL
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // 设置内容类型头部
            },
            data: postData, // 请求数据
            onload: function(response) { // 请求加载完毕后的回调函数
                // 解析响应数据为JSON
                const responseData = JSON.parse(response.responseText);
                // 如果响应数据中有图片地址
                if (responseData && responseData.body && responseData.body.data.thumbUrls) {
                    // 获取图片地址
                    const imgUrl = responseData.body.data.thumbUrls[0];
                    // 打开新标签页到图片地址
                    window.open(imgUrl, '_blank');
                } else {
                    // 否则弹出错误提示
                    alert('无法获取图片地址。');
                }
            },
            onerror: function(error) { // 请求出错的回调函数
                // 弹出错误提示
                alert('请求失败。');
            }
        });
    }

    // 加载完毕后添加下载按钮
    window.addEventListener('load', addDownloadButton);
})();