// ==UserScript==
// @name         CMCC OA 工具
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       You
// @match        http://eip.hq.cmcc/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523104/CMCC%20OA%20%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/523104/CMCC%20OA%20%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建二级菜单容器
    const subMenuContainer = document.createElement('div');
    subMenuContainer.style.position = 'fixed';
    subMenuContainer.style.top = '0'; // 将容器放在页面最上方
    subMenuContainer.style.left = '20%'; // 将容器水平居中
    subMenuContainer.style.transform = 'translateX(-50%)'; // 水平居中
    subMenuContainer.style.display = 'flex';
    subMenuContainer.style.flexDirection = 'row'; // 按钮横向排列
    subMenuContainer.style.gap = '10px'; // 按钮之间的间距
    subMenuContainer.style.opacity = '1';
    subMenuContainer.style.transition = 'opacity 0.3s ease';
    subMenuContainer.style.pointerEvents = 'auto'; // 允许点击
    subMenuContainer.style.padding = '5px'; // 添加一些内边距
    subMenuContainer.style.backgroundColor = '#f8f9fa'; // 添加背景色
    subMenuContainer.style.borderBottom = '1px solid #ddd'; // 添加底部边框
    subMenuContainer.style.zIndex = '1000'; // 确保在最上层

    // 定义按钮的点击逻辑
    const createSubButton = (dbId, label) => {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.padding = '5px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // 添加按钮点击事件
        button.addEventListener('click', () => {
            // 查找页面中所有 <a> 标签
            const links = document.querySelectorAll('a');

            // 遍历所有 <a> 标签
            for (const link of links) {
                // 检查 db_id 属性是否匹配
                if (link.getAttribute('db_id') === dbId) {
                    // 模拟点击
                    link.click();
                    console.log(`已点击第一个 db_id="${dbId}" 的链接`);
                    // 点击后立即退出循环
                    break;
                }
            }
        });

        return button;
    };

    // 创建二级菜单按钮并添加到容器中
    subMenuContainer.appendChild(createSubButton('109', '商旅'));
    subMenuContainer.appendChild(createSubButton('20156', '人力'));
    subMenuContainer.appendChild(createSubButton('20155', '邮箱'));
    subMenuContainer.appendChild(createSubButton('20158', '报账'));
    subMenuContainer.appendChild(createSubButton('20159', '网大'));
    subMenuContainer.appendChild(createSubButton('19486', 'DICT系统'));



    // 将 OA 助手添加到 header 中，并确保在最上层
    const header = document.querySelector('div#header');
    subMenuContainer.style.zIndex = '1000'; // 设置一个较高的 z-index 值
    header.insertBefore(subMenuContainer, header.firstChild);


    // 获取对话框元素
    const modal = document.getElementById('imageModal');

    if (modal) {
        // 设置对话框的样式，使其占据整个窗口
        modal.style.width = '100%';
        modal.style.height = '80%';
        modal.style.maxWidth = 'none'; // 移除最大宽度限制
        modal.style.maxHeight = 'none'; // 移除最大高度限制
        modal.style.margin = '0'; // 移除外边距
        modal.style.top = '0'; // 顶部对齐
        modal.style.left = '0'; // 左侧对齐
        modal.style.transform = 'none'; // 移除可能的变换

        // 如果需要调整内部内容的样式
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.style.height = 'calc(100% - 100px)'; // 调整内容区域高度
            modalBody.style.overflowY = 'auto'; // 允许内容区域滚动
        }

        console.log('对话框已调整为窗口大小');
    }

    // 查找 banner 元素
    const bannerElement = document.querySelector('.banner');

    // 如果找到 banner 元素，则删除它
    if (bannerElement) {
        bannerElement.remove();
        console.log('Banner 元素已删除');
    } else {
        console.log('未找到 Banner 元素');
    }


})();