// ==UserScript==
// @name         提取链接
// @namespace    http://tampermonkey.net/
// @version      2025-01-06
// @description  他是个提取链接!
// @author       他是个提取链接
// @match        https://tcs.bytedance.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523096/%E6%8F%90%E5%8F%96%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/523096/%E6%8F%90%E5%8F%96%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    // 基础CSS选择器，直到第14个div的父容器
    const baseSelector = "#projectTpl > div.cs-content > section > div > div > div > div > div > div.arco-col.arco-col-16 > div:nth-child(1) > div > div.arco-card-body > div > div > table > tbody > tr:nth-child(5) > td.arco-descriptions-item-value";

    // 存储所有提取的链接的数组
    const links = [];

    // 提取链接的函数
    function extractLinks() {
        // 清空链接数组以避免重复提取
        links.length = 0;

        // 获取第14个div的父容器下所有可能的div
        const parentDivs = document.querySelectorAll(`${baseSelector} > div`);

        // 遍历所有匹配的div元素，逐个处理每一个父容器
        parentDivs.forEach((parentDiv, index) => {
            console.log(`正在处理父容器 ${index + 1}:`, parentDiv); // 输出调试信息，便于后续分析

            // 获取所有符合条件的元素
            const elements = parentDiv.querySelectorAll('span.string-value');

            // 检查是否找到了任何符合条件的元素
            if (elements.length > 0) {
                elements.forEach((element, elementIndex) => {
                    const textContent = element.textContent.trim();
                    console.log(`在父容器 ${index + 1} 中找到元素 ${elementIndex + 1}:`, textContent);

                    // 假设链接以某种特定格式存在于文本中
                    const regex = /https?:\/\/[^\s]+/g; // 正则表达式用于匹配链接
                    const foundLinks = textContent.match(regex); // 提取链接

                    // 如果找到链接，将其添加到链接数组中
                    if (foundLinks) {
                        foundLinks.forEach(link => {
                            // 去掉链接两端的引号
                            const cleanLink = link.replace(/['"]/g, ''); // 去掉引号，确保链接格式正确
                            links.push(cleanLink);
                        });
                    }
                });
            } else {
                console.log(`在父容器 ${index + 1} 中没有找到任何符合条件的元素`); // 如果没有找到元素，打印提示信息
            }
        });

        // 打印所有找到的链接并展示弹窗
        console.log("提取到的链接:", links);
        showLinksInPopup(links);
    }

    // 创建并展示弹窗
    function showLinksInPopup(links) {
        // 创建弹窗背景，以便在页面上覆盖显示
        const popupBackground = document.createElement('div');
        popupBackground.style.position = 'fixed';
        popupBackground.style.top = 0;
        popupBackground.style.left = 0;
        popupBackground.style.width = '100%';
        popupBackground.style.height = '100%';
        popupBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        popupBackground.style.display = 'flex';
        popupBackground.style.justifyContent = 'center';
        popupBackground.style.alignItems = 'center';
        popupBackground.style.zIndex = 1000;

        // 创建弹窗内容区域
        const popupContent = document.createElement('div');
        popupContent.style.backgroundColor = '#fff';
        popupContent.style.padding = '20px';
        popupContent.style.borderRadius = '5px';
        popupContent.style.maxWidth = '500px';
        popupContent.style.overflowY = 'auto';
        popupContent.style.maxHeight = '80%';

        // 添加复制链接的按钮
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制全部链接';
        copyButton.style.backgroundColor = 'green'; // 设置背景颜色为绿色
        copyButton.style.color = 'white'; // 设置文字颜色为白色，以便在绿色背景上可见
        copyButton.style.padding = '10px 20px'; // 设置按钮的内边距，增加按钮的宽度
        copyButton.style.border = 'none'; // 移除边框
        copyButton.style.cursor = 'pointer'; // 鼠标悬停时显示指针
        copyButton.style.marginBottom = '10px'; // 添加底部间距
        copyButton.onclick = () => {
            // 将链接数组转换为字符串，每个链接占一行
            const linksString = links.join('\n');
            navigator.clipboard.writeText(linksString).then(() => {
                alert('链接已成功复制到剪贴板！'); // 提示用户链接已成功复制
            }).catch(err => {
                console.error('复制失败:', err); // 如果复制失败，输出错误信息到控制台
            });
        };
        popupContent.appendChild(copyButton);

        // 将提取到的链接添加到弹窗内容中
        links.forEach(link => {
            const linkElement = document.createElement('div');
            linkElement.textContent = link; // 设置链接文本内容
            linkElement.style.marginBottom = '10px';
            linkElement.style.wordWrap = 'break-word'; // 防止长链接溢出
            popupContent.appendChild(linkElement); // 将链接元素添加到弹窗内容中
        });

        // 将弹窗内容添加到背景中
        popupBackground.appendChild(popupContent);
        document.body.appendChild(popupBackground); // 将弹窗添加到文档中

        // 点击弹窗背景即可关闭弹窗
        popupBackground.addEventListener('click', () => {
            document.body.removeChild(popupBackground); // 点击后关闭弹窗
        });
    }


    // 监听键盘事件
    document.addEventListener('keydown', (event) => {
        console.log(`按下的键: ${event.key}`); // 输出按下的键，便于调试
        if (event.key === '1') { // 检测按下的键是否为数字 1
            extractLinks(); // 调用提取链接的函数
        } else if (event.key === '2') { // 检测按下的键是否为数字 2
            // 使用提供的输入框路径查找输入框
            const inputBox = document.querySelector("#semi-modal-body > div > div > input");
            if (inputBox) { // 如果找到输入框
                inputBox.value+= '无内容'; // 在输入框中输入“无内容”
                // 触发 input 事件以确保更新生效
                const event = new Event('input', { bubbles: true });
                inputBox.dispatchEvent(event);
                console.log('输入框值已设置为“无内容”');
            } else {
                console.error('未找到输入框元素'); // 如果未找到输入框，输出错误信息
            }
        } else {
            console.error('未找到输入框元素'); // 如果未找到输入框，输出错误信息
        }
    });
})();