// ==UserScript==
// @name        动态抓取快手小店用户发送的图片网址
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      
// @license MIT
// @description 2025/7/24 17:39:00 - 持续从动态网页中提取图片网址，并提供一个可交互的显示窗口。
// @downloadURL https://update.greasyfork.org/scripts/543574/%E5%8A%A8%E6%80%81%E6%8A%93%E5%8F%96%E5%BF%AB%E6%89%8B%E5%B0%8F%E5%BA%97%E7%94%A8%E6%88%B7%E5%8F%91%E9%80%81%E7%9A%84%E5%9B%BE%E7%89%87%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/543574/%E5%8A%A8%E6%80%81%E6%8A%93%E5%8F%96%E5%BF%AB%E6%89%8B%E5%B0%8F%E5%BA%97%E7%94%A8%E6%88%B7%E5%8F%91%E9%80%81%E7%9A%84%E5%9B%BE%E7%89%87%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用Set来存储唯一的图片网址，避免重复
    const imageUrls = new Set();
    let displayModal = null; // 存储显示网址的模态窗口DOM元素
    let displayList = null;  // 存储网址列表的DOM元素
    let refreshIntervalId = null; // 用于存储定时器ID

    /**
     * @description 显示自定义消息框，替代alert()。
     * @param {string} message 要显示的消息文本。
     * @param {'info'|'success'|'error'} type 消息类型，影响背景颜色。
     */
    function showMessageBox(message, type = 'info') {
        let messageBox = document.getElementById('image-url-extractor-message-box');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.id = 'image-url-extractor-message-box';
            messageBox.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 10px 20px;
                border-radius: 5px;
                color: white;
                font-family: 'Inter', sans-serif;
                font-size: 0.9em;
                z-index: 100001; /* 确保在最上层 */
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(messageBox);
        }

        messageBox.textContent = message;
        // 根据消息类型设置背景颜色
        if (type === 'success') {
            messageBox.style.backgroundColor = '#28a745'; // 绿色
        } else if (type === 'error') {
            messageBox.style.backgroundColor = '#dc3545'; // 红色
        } else {
            messageBox.style.backgroundColor = '#007bff'; // 蓝色 (信息)
        }

        messageBox.style.opacity = '1'; // 显示消息框

        // 3秒后自动隐藏消息框
        setTimeout(() => {
            messageBox.style.opacity = '0';
        }, 3000);
    }

    /**
     * @description 遍历当前DOM，提取所有<img>标签的src属性，并添加到列表中。
     * 如果是新网址，则添加到Set中并更新显示列表。
     */
    function extractImageUrls() {
        // console.log('extractImageUrls 被调用'); // 调试日志
        // 修改此处，只选择.ChatMessageList类下，并且在.kwaishop-cs-LayoutDefaultWrapper__notMe内部的img标签
        document.querySelectorAll('.ChatMessageList .kwaishop-cs-LayoutDefaultWrapper__notMe img').forEach(img => {
            const src = img.src;

            // 如果img标签有alt属性，则跳过
            if (img.hasAttribute('alt')) {
                return; // 跳过当前循环迭代
            }

            // 检查是否是需要屏蔽的图片地址（包括头像和之前指定的地址）
            if (src.includes('uhead') || // 新增：跳过包含 'uhead' 的网址 (头像)
                src.startsWith('https://ali-ec.static.yximgs.com/udata/pkg/a/kshop3.png') ||
                src.startsWith('https://ali-ec.static.yximgs.com')) {
                // console.log('已屏蔽图片网址:', src); // 调试日志
                return; // 跳过当前循环迭代
            }

            // 检查src是否存在且是否是新网址
            if (src && !imageUrls.has(src)) {
                imageUrls.add(src); // 添加到Set中
                // 如果显示列表已存在，则添加到DOM中
                if (displayList) {
                    const listItem = document.createElement('li');
                    listItem.textContent = src;
                    displayList.appendChild(listItem);
                    // 滚动到列表底部，以便看到新添加的网址
                    displayList.scrollTop = displayList.scrollHeight;
                    // console.log('新图片网址已添加到显示列表:', src); // 调试日志
                }
                console.log('新图片网址:', src); // 在控制台输出新网址
            }
        });
    }

    /**
     * @description 创建并管理显示图片网址的模态窗口。
     */
    function createDisplayModal() {
        if (displayModal) return; // 如果模态窗口已存在，则不重复创建

        displayModal = document.createElement('div');
        displayModal.id = 'image-url-extractor-modal';
        displayModal.style.cssText = `
            position: fixed;
            bottom: 70px; /* 弹窗位于按钮上方，距离底部70px */
            left: 20px; /* 弹窗与按钮对齐，距离左侧20px */
            width: 350px;
            height: 400px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 99999; /* 确保在最上层 */
            display: flex;
            flex-direction: column;
            font-family: 'Inter', sans-serif;
            overflow: hidden;
            resize: both; /* 允许用户调整窗口大小 */
            min-width: 250px;
            min-height: 250px;
            transition: all 0.2s ease-in-out;
        `;

        // 模态窗口头部 (用于拖动和关闭按钮)
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 10px;
            background-color: #e0e0e0;
            border-bottom: 1px solid #ccc;
            cursor: grab; /* 拖动光标 */
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        `;
        const title = document.createElement('span');
        title.textContent = '提取的图片网址';
        title.style.cssText = 'font-weight: bold; color: #333;';
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.cssText = `
            background: none;
            border: none;
            font-size: 1.2em;
            cursor: pointer;
            color: #555;
            padding: 0 8px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
        `;
        closeButton.onmouseover = (e) => e.target.style.backgroundColor = '#ccc';
        closeButton.onmouseout = (e) => e.target.style.backgroundColor = 'none';
        closeButton.onclick = () => {
            displayModal.remove(); // 移除模态窗口
            displayModal = null;
            // 清除定时器，当模态窗口关闭时停止刷新
            if (refreshIntervalId) {
                clearInterval(refreshIntervalId);
                refreshIntervalId = null;
                console.log('图片网址刷新定时器已停止。');
            }
        };
        header.appendChild(title);
        header.appendChild(closeButton);
        displayModal.appendChild(header);

        // 网址列表容器
        displayList = document.createElement('ul');
        displayList.style.cssText = `
            list-style: decimal; /* 显示序号 */
            margin: 0;
            padding: 10px 25px; /* 增加左侧内边距以容纳序号 */
            overflow-y: auto; /* 允许垂直滚动 */
            flex-grow: 1; /* 占据剩余空间 */
            background-color: #fff;
            font-size: 0.9em;
            word-break: break-all; /* 网址过长时自动换行 */
            color: #444;
        `;
        displayModal.appendChild(displayList);

        // 底部按钮区域
        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 10px;
            background-color: #e0e0e0;
            border-top: 1px solid #ccc;
            display: flex;
            justify-content: space-around;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        `;
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制所有网址';
        copyButton.style.cssText = `
            padding: 8px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9em;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: background-color 0.2s ease, transform 0.1s ease;
        `;
        copyButton.onmouseover = (e) => e.target.style.backgroundColor = '#0056b3';
        copyButton.onmouseout = (e) => e.target.style.backgroundColor = '#007bff';
        copyButton.onmousedown = (e) => e.target.style.transform = 'translateY(1px)';
        copyButton.onmouseup = (e) => e.target.style.transform = 'translateY(0)';
        copyButton.onclick = () => {
            const textToCopy = Array.from(imageUrls).join('\n'); // 将所有网址用换行符连接
            const tempTextArea = document.createElement('textarea'); // 创建一个临时的textarea
            tempTextArea.value = textToCopy;
            document.body.appendChild(tempTextArea);
            tempTextArea.select(); // 选中textarea中的文本
            document.execCommand('copy'); // 执行复制命令
            document.body.removeChild(tempTextArea); // 移除临时textarea
            showMessageBox('所有图片网址已复制到剪贴板！', 'success');
        };
        footer.appendChild(copyButton);

        const clearButton = document.createElement('button');
        clearButton.textContent = '清除列表';
        clearButton.style.cssText = `
            padding: 8px 15px;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9em;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: background-color 0.2s ease, transform 0.1s ease;
        `;
        clearButton.onmouseover = (e) => e.target.style.backgroundColor = '#c82333';
        clearButton.onmouseout = (e) => e.target.style.backgroundColor = '#dc3545';
        clearButton.onmousedown = (e) => e.target.style.transform = 'translateY(1px)';
        clearButton.onmouseup = (e) => e.target.style.transform = 'translateY(0)';
        clearButton.onclick = () => {
            imageUrls.clear(); // 清空Set
            displayList.innerHTML = ''; // 清空DOM列表
            showMessageBox('列表已清空！', 'info');
        };
        footer.appendChild(clearButton);
        displayModal.appendChild(footer);

        document.body.appendChild(displayModal); // 将模态窗口添加到页面body中

        // 实现模态窗口拖动功能
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            // 计算鼠标点击位置与模态窗口左上角的偏移量
            offsetX = e.clientX - displayModal.getBoundingClientRect().left;
            offsetY = e.clientY - displayModal.getBoundingClientRect().top;
            displayModal.style.cursor = 'grabbing'; // 改变光标样式
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            // 根据鼠标移动更新模态窗口的位置
            displayModal.style.left = (e.clientX - offsetX) + 'px';
            displayModal.style.top = (e.clientY - offsetY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            displayModal.style.cursor = 'grab'; // 恢复光标样式
        });

        // 首次打开时，将已抓取到的网址填充到列表中
        // 每次打开都会清空并重新填充，确保显示最新数据
        displayList.innerHTML = ''; // 先清空，再填充
        imageUrls.forEach(url => {
            const listItem = document.createElement('li');
            listItem.textContent = url;
            displayList.appendChild(listItem);
        });

        // 启动定时器，每秒刷新一次列表
        if (!refreshIntervalId) { // 避免重复启动定时器
            refreshIntervalId = setInterval(extractImageUrls, 1000); // 每1秒调用一次extractImageUrls
            console.log('图片网址刷新定时器已启动，每秒刷新一次。');
        }
    }

    // 创建一个浮动的切换按钮，用于显示/隐藏模态窗口
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '图片网址';
    toggleButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px; /* 将right改为left */
        padding: 12px 18px;
        background-color: #6c757d;
        color: white;
        border: none;
        border-radius: 50px; /* 圆形按钮 */
        box-shadow: 0 4px 8px rgba(0,0,0,0.25);
        cursor: pointer;
        z-index: 100000; /* 确保在最上层 */
        font-family: 'Inter', sans-serif;
        font-size: 1em;
        font-weight: bold;
        transition: background-color 0.3s ease, transform 0.1s ease;
    `;
    toggleButton.onmouseover = (e) => e.target.style.backgroundColor = '#5a6268';
    toggleButton.onmouseout = (e) => e.target.style.backgroundColor = '#6c757d';
    toggleButton.onmousedown = (e) => e.target.style.transform = 'translateY(2px)';
    toggleButton.onmouseup = (e) => e.target.style.transform = 'translateY(0)';
    toggleButton.onclick = () => {
        if (displayModal) {
            // 如果模态窗口已打开，则关闭它
            displayModal.remove();
            displayModal = null;
            // 清除定时器，当模态窗口关闭时停止刷新
            if (refreshIntervalId) {
                clearInterval(refreshIntervalId);
                refreshIntervalId = null;
                console.log('图片网址刷新定时器已停止。');
            }
        } else {
            // 如果模态窗口未打开，则创建并显示它
            createDisplayModal();
        }
    };
    document.body.appendChild(toggleButton); // 将按钮添加到页面body中

    // 脚本加载时进行首次图片网址提取
    extractImageUrls();

    // 设置MutationObserver来监听DOM变化
    // MutationObserver 仍然全局运行，以确保 imageUrls 集合始终包含最新的图片网址，
    // 即使弹窗关闭时也能持续收集。
    const observer = new MutationObserver((mutationsList) => {
        // console.log('MutationObserver triggered:', mutationsList); // 调试日志：观察者被触发
        for (const mutation of mutationsList) {
            // 检查是否有节点被添加，并且这些节点可能包含图片
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 重新扫描图片网址，以捕获新加载的图片
                extractImageUrls();
            }
        }
    });

    // 启动观察器，监听整个文档body的子节点变化及其子树中的变化
    // 这确保了即使聊天界面通过替换或修改大块DOM来更新，也能被捕获到
    observer.observe(document.body, { childList: true, subtree: true });

})();
