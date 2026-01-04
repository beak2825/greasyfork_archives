// ==UserScript==
// @name         仓库跳转下载链接
// @namespace    https://github.com/AliubYiero/TamperMonkeyScripts
// @version      1.0.1
// @description  在标签栏添加 跳转下载 按钮, 点击后可快速跳转至下载链接区域
// @author       Yiero
// @match        https://cangku.moe/archives/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513816/%E4%BB%93%E5%BA%93%E8%B7%B3%E8%BD%AC%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/513816/%E4%BB%93%E5%BA%93%E8%B7%B3%E8%BD%AC%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
/**
 * 等待元素载入
 */
const getElement = (selector, parent = document.body, timeout = 0) => {
    return new Promise(resolve => {
        let result = parent.querySelector(selector);
        if (result) {
            return resolve(result);
        }
        let timer;
        // @ts-ignore
        const observer = new window.MutationObserver(mutations => {
            for (let mutation of mutations) {
                for (let addedNode of mutation.addedNodes) {
                    if (addedNode instanceof Element) {
                        result = addedNode.matches(selector) ? addedNode : addedNode.querySelector(selector);
                        if (result) {
                            observer.disconnect();
                            timer && clearTimeout(timer);
                            // 为了避免在元素插入后立即刷新，我们在这里添加一个短暂的延迟。
                            setTimeout(() => resolve(result), 500);
                        }
                    }
                }
            }
        });
        observer.observe(parent, {
            childList: true,
            subtree: true,
        });
        if (timeout > 0) {
            timer = setTimeout(() => {
                observer.disconnect();
                return resolve(null);
            }, timeout);
        }
    });
};
/**
 * 创建 [跳转下载] 按钮
 */
const createJumpButton = () => {
    // 创建按钮容器, 让其和页面元素风格保持一致
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('jump-download-btn-container');
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.padding = '0 0 12px 0';
    /**
     * 创建按钮
     */
    const createBtn = () => {
        /**
         * 创建图标
         */
        const createIcon = () => {
            const icon = document.createElement('i');
            icon.classList.add('el-icon', 'el-icon-bottom');
            return icon;
        };
        /**
         * 创建文本
         */
        const createText = () => {
            const text = document.createElement('span');
            text.textContent = '跳转下载';
            return text;
        };
        // 创建按钮
        const button = document.createElement('button');
        button.classList.add('el-button', 'el-button--small', 'el-button--warning', 'is-plain', 'jump-download-btn');
        button.append(createIcon(), createText());
        // 绑定按钮点击事件
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSelectorList = [
                '.content.format-content .dl-box',
                '.post-wrap',
            ];
            const targetElementSelector = targetSelectorList.find(selector => document.querySelector(selector));
            if (!targetElementSelector) {
                return;
            }
            const targetElement = document.querySelector(targetElementSelector);
            jumpToElement(targetElement);
        });
        return button;
    };
    // 将按钮写入容器
    buttonContainer.append(createBtn());
    // 返回按钮容器
    return buttonContainer;
};
/**
 * 跳转到目标元素的位置
 */
const jumpToElement = (targetElement) => {
    let { top, bottom } = targetElement.getBoundingClientRect();
    // 如果没有找到下载框, 让页面底部为帖子的底部
    if (targetElement.classList.contains('post-wrap')) {
        window.scrollTo({
            top: bottom + window.scrollY - window.innerHeight,
            behavior: 'smooth',
        });
        return;
    }
    // 如果当前元素没有高度, 表示该元素被折叠, 找到未被折叠的父元素
    let parentElement = targetElement;
    while (!top) {
        parentElement = parentElement.parentElement;
        if (!parentElement) {
            return;
        }
        ({ top, bottom } = parentElement.getBoundingClientRect());
    }
    if (!parentElement) {
        return;
    }
    window.scrollTo({
        top: top + window.scrollY,
        behavior: 'smooth',
    });
};
;
(async () => {
    // 等待载入
    await getElement('.content.format-content');
    // 创建按钮
    const jumpButton = createJumpButton();
    // 将按钮写入页面
    const metaContainer = document.querySelector('#post .header');
    if (!metaContainer) {
        return;
    }
    metaContainer.appendChild(jumpButton);
})();
