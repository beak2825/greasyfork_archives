// ==UserScript==
// @name         置顶bilibili未读私信
// @namespace    http://tampermonkey.net/
// @version      2025.2.27
// @description  置顶未读消息，自动滚动消息列表到底部，查看下一条未读
// @author       悠亚Yua的洗脚俾
// @match        https://message.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527810/%E7%BD%AE%E9%A1%B6bilibili%E6%9C%AA%E8%AF%BB%E7%A7%81%E4%BF%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/527810/%E7%BD%AE%E9%A1%B6bilibili%E6%9C%AA%E8%AF%BB%E7%A7%81%E4%BF%A1.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

const CLASS = {
    CONTAINER: '.list-container', // 消息列表
    LIST: '.list', // 侧边功能栏列表元素
    ITEM: '.list-item', // 消息列表内对话人
    NOTIFY: 'div.notify-number', // 消息列表内红点标识
    SIDE_BAR: '.side-bar', // 侧边功能栏
    NOTIFY_TOTAL: 'span.notify-number'
};

const MAX_ATTEMPTS = 30; // 限制尝试次数，考虑到ua的群发一般在500内设为30次

// 创建能自然融入侧边栏的元素
const createScopedElement = (tag, cls, text='')=> {
    const element = document.createElement(tag);
    element.className = cls;
    element.setAttribute('data-v-60ecf32f', '');
    if(tag==='li'){
        const link = document.createElement('a');
        link.href = 'javascript:void(0);';
        link.setAttribute('data-v-60ecf32f', '');
        // 添加文本节点
        const textNode = document.createTextNode(text);
        link.appendChild(textNode);

        element.appendChild(link);
    }
    return element;
};

// 下一条未读消息
const nextMsg = async () => {
    const container = document.querySelector(CLASS.CONTAINER);
    if (!document.querySelector(CLASS.NOTIFY_TOTAL)) { // 查看侧边栏我的消息是否有红点
        console.log('没有新消息的说');
        return;
    }
    // 查找未读消息
    const findUnreadMsg = async () => {
        let unreadMsg = document.querySelector(CLASS.NOTIFY); // 查看已加载对话中是否有未读
        let attempts = 0;

        while (!unreadMsg && attempts < MAX_ATTEMPTS) { // 循环直到找到消息或最大次数
            container.scrollTop = container.scrollHeight; // 滚动到底部
            await new Promise(resolve => setTimeout(resolve, 500)); // 等待 500 毫秒让 DOM 更新
            unreadMsg = document.querySelector(CLASS.NOTIFY); // 再次查找
            attempts++;
        }

        if (unreadMsg) {
            unreadMsg.scrollIntoView();
            setTimeout(() => unreadMsg.click(), 300); // 点击前稍微延迟
        } else {
            alert('未在限制次数内找到未读消息，可再次点击继续查找');
        }
    };

    await findUnreadMsg();
};

// 未读消息置顶
const moveNewMessageToTop = () => {
    const container = document.querySelector(CLASS.CONTAINER); // 消息列表容器
    let total = document.querySelector(CLASS.NOTIFY_TOTAL).textContent; // 未读总数
    let msgs = document.querySelectorAll(CLASS.NOTIFY); // 列表内的未读消息标识

    // 置顶消息
    const move = () =>{
        msgs = document.querySelectorAll(CLASS.NOTIFY);
        console.log(msgs.length);
        if (msgs.length>=total) {
            for (let i = msgs.length - 1; i >= 0; i--) { // 反向遍历维持原时间顺序
                container.prepend(msgs[i].parentElement);
            }
            container.scrollTop = 0; // 回到顶部
            return true;
        }
        return false;
    }

    // 页面中的未读消息数小于总数则自动滚动加载更多消息
    if (container){
        if (move()) return;
        let intervalId = null;
        let attempts = 0;
        intervalId = setInterval(() => {
            if (!move()&&attempts < MAX_ATTEMPTS) {
                container.scrollTop = container.scrollHeight; // 滚动到消息列表底部
                attempts++;
            }else{
                clearInterval(intervalId);
            }
        }, 500);
    }
};

// 自动滚动加载消息
const setupAutoScroll = (button) => {
    let intervalId = null;

    const toggleScroll = () => {
        const container = document.querySelector(CLASS.CONTAINER);
        if (!container) return;
        // 每500ms滚动到底部一次，再次点击停止滚动
        if (!intervalId) {
            intervalId = setInterval(() => {
                container.scrollTop = container.scrollHeight;
            }, 500);
            button.firstChild.textContent = '停止滚动';
        } else {
            clearInterval(intervalId);
            intervalId = null;
            button.firstChild.textContent = '滚动加载';
        }
    };
    return toggleScroll;
};

/* 初始化 */
const init = () => {
    // 创建插件title
    const title = createScopedElement('div', 'title');
    title.textContent='UQU 私信小助手';
    // 创建容纳按钮的list
    const ul = createScopedElement('ul', 'list');
    // 创建list内的item
    const pinButton = createScopedElement('li', 'item', '未读置顶' );
    const loadButton = createScopedElement('li', 'item', '滚动加载');
    const nextButton = createScopedElement('li', 'item', '下个未读');

    // 设置按钮功能
    pinButton.addEventListener('click', moveNewMessageToTop);
    loadButton.addEventListener('click', setupAutoScroll(loadButton));
    nextButton.addEventListener('click', nextMsg);

    // 添加按钮到列表
    [pinButton, loadButton, nextButton].forEach(item=>{
        ul.appendChild(item);
    });

    // 等待目标容器加载
    const observer = new MutationObserver((_, obs) => {
        const spaceLeft = document.querySelector(CLASS.SIDE_BAR);
        if (spaceLeft) {
            spaceLeft.append(title);
            spaceLeft.append(ul);
            obs.disconnect();
            console.log('list已注入');
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
};

// 启动脚本
init();