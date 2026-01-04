// ==UserScript==
// @name         抖音视频直链提取
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  这个工具可以提取指定页面包体大于500KB的数据包的直链
// @author       https://github.com/itsAnstar
// @match        https://www.douyin.com/video*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484383/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E9%93%BE%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/484383/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E9%93%BE%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==


(function() {
    'use strict';

// 新增需求：使用 MutationObserver 监听 DOM 变化，一旦发现目标元素就删除
function observeAndRemoveElement(targetClassName) {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            const addedNodes = mutation.addedNodes;
            for (let i = 0; i < addedNodes.length; i++) {
                const addedNode = addedNodes[i];
                if (addedNode.nodeType === 1 && addedNode.classList.contains(targetClassName)) {
                    addedNode.parentNode.removeChild(addedNode);
                    return; // 删除一个即可，不再继续遍历
                }
            }
        });
    });

    // 配置 MutationObserver 监听子节点的添加
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
}

// 启动监听
observeAndRemoveElement('ezAK2PYX');


    // 创建包含所有元素的容器
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50%'; // 垂直居中
    container.style.left = '50%'; // 水平居中
    container.style.transform = 'translate(-50%, -50%)'; // 居中偏移
    container.style.display = 'flex'; // 设置为弹性布局
    container.style.flexDirection = 'column'; // 垂直排列子元素
    container.style.cursor = 'move';
    document.body.appendChild(container);

    // 创建文本框显示超过500KB的数据包链接
    const resultTextarea = document.createElement('textarea');
    resultTextarea.style.width = '70%';
    resultTextarea.style.height = '200px';
    resultTextarea.style.background = 'lightyellow'; // 浅黄色背景
    container.appendChild(resultTextarea);

    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.innerText = '复制链接';
    copyButton.style.width = '70%';
    copyButton.style.background = 'lightyellow'; // 浅黄色背景
    container.appendChild(copyButton);

    // 记录鼠标位置的变量
    let offsetX, offsetY;

    // 鼠标按下事件
    container.addEventListener('mousedown', function(e) {
        e.preventDefault();
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;

        // 移动事件
        function moveElement(event) {
            container.style.left = event.clientX - offsetX + 'px';
            container.style.top = event.clientY - offsetY + 'px';
        }

        // 鼠标移动事件监听
        function onMouseMove(event) {
            moveElement(event);
        }

        // 鼠标松开事件监听
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        // 添加鼠标移动和松开事件监听
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // 定时监测网络数据包
    function monitorNetwork() {
        setInterval(function() {
            // 获取实时网络数据包
            const realTimeResources = performance.getEntriesByType('resource');

            // 获取已缓存的数据包
            const cachedResources = window.performance.getEntriesByType('resource');

            // 合并实时和已缓存的数据包
            const allResources = [...realTimeResources, ...cachedResources];

            // 过滤出大小超过500KB的资源
            const largeResources = allResources.filter(resource => resource.transferSize > 500 * 1024);

            // 输出链接到文本框
            resultTextarea.value = largeResources.map(resource => resource.name).join('\n');

            // 根据文本框内容定义复制按钮颜色
            copyButton.style.background = resultTextarea.value.trim() !== '' ? 'lightgreen' : 'lightyellow';
        }, 1500); // 每1.5秒执行一次监测
    }



    // 启动监测
    monitorNetwork();

    // 点击复制按钮触发事件
    copyButton.addEventListener('click', function() {
        // 复制文本框中的内容到剪贴板
        resultTextarea.select();
        document.execCommand('copy');
        alert('链接已复制到剪贴板！');
    });

})();