// ==UserScript==
// @name         Flomo 增强
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Flomo 增强功能，自用
// @author       Loongphy
// @match        https://v.flomoapp.com/mine
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flomoapp.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491777/Flomo%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/491777/Flomo%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 缓存键，用于存储卡片内容
    const cacheKey = 'card_content';

    // 添加观察者，监视卡片的加载
    observeCardAdditions();

    // 添加观察者，监视 Tooltip 的创建
    observeTooltipAdditions();

    // 监视页面上卡片的添加
    function observeCardAdditions() {
        const cardObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    // 检查节点是否为卡片
                    if (node.nodeType === 1 && node.matches('.memo')) {
                        addHoverListenerToCard(node);
                    }
                });
            });
        });

        cardObserver.observe(document.body, { childList: true, subtree: true });
    }

    // 为卡片添加鼠标悬浮事件，以缓存内容
    function addHoverListenerToCard(cardNode) {
        cardNode.addEventListener('mouseenter', function () {
            const content = convertRichTextToPlainText(cardNode.querySelector('.richText'));
            console.log(content)
            sessionStorage.setItem(cacheKey, content);
        });
    }

    function convertRichTextToPlainText(richTextElement) {
        // 克隆原始元素，避免修改
        let clone = richTextElement.cloneNode(true);

        // 处理加粗文本 - 纯文本中无法表示加粗，这里我们选择保留文本内容
        let boldElements = clone.querySelectorAll('strong');
        boldElements.forEach(bold => {
            bold.outerHTML = bold.innerHTML; // 移除加粗标签，保留文本
        });

        // 处理自定义标签格式
        let tags = clone.querySelectorAll('span.tag');
        tags.forEach(tag => {
            // 在标签文本两侧添加空格
            let newContent = ` ${tag.textContent} `;
            let newTextNode = document.createTextNode(newContent);
            tag.parentNode.replaceChild(newTextNode, tag);
        });

        // 处理超链接，链接前后添加空格
        let links = clone.querySelectorAll('a');
        links.forEach(link => {
            // 提取链接地址，并在前后添加空格
            let newContent = ` ${link.href} `;
            let newTextNode = document.createTextNode(newContent);
            link.parentNode.replaceChild(newTextNode, link);
        });

        // 处理段落换行 - 将每个<p>标签后面添加一个换行符
        let paragraphs = clone.querySelectorAll('p');
        paragraphs.forEach((p, index) => {
            // 如果不是最后一个段落，添加换行
            if (index < paragraphs.length - 1) {
                p.outerHTML = p.innerHTML.trim() + '\n'; // 使用.trim()确保末尾没有多余的空格
            } else {
                p.outerHTML = p.innerHTML.trim(); // 最后一个段落不添加换行，且确保末尾没有多余的空格
            }
        });

        return clone.textContent;
    }

    // 监视 Tooltip 的创建
    function observeTooltipAdditions() {
        const tooltipObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    // 检查节点是否为 Tooltip
                    if (node.nodeType === 1 && node.getAttribute('role') === 'tooltip') {
                        enhanceTooltip(node);
                    }
                });
            });
        });

        tooltipObserver.observe(document.documentElement, { childList: true, subtree: true });
    }


    // 增强 Tooltip，添加分享到 X 的选项
    function enhanceTooltip(tooltipNode) {
        if (tooltipNode.getAttribute('data-enhanced') !== 'true') {
            const popoverMenu = tooltipNode.querySelector('.popover-menu');
            if (popoverMenu) {
                const newItem = createShareOption();
                insertShareOption(popoverMenu, newItem);
                tooltipNode.setAttribute('data-enhanced', 'true');
            }
        }
    }

    // 创建分享选项
    function createShareOption() {
        const newItem = document.createElement('div');
        newItem.className = 'item';
        newItem.textContent = '分享到 X';
        shareToX(newItem);
        return newItem;
    }

    // 插入分享选项到 Tooltip
    function insertShareOption(popoverMenu, newItem) {
        const items = popoverMenu.querySelectorAll('.item');
        if (items.length >= 4) {
            popoverMenu.insertBefore(newItem, items[3]);
        } else {
            popoverMenu.appendChild(newItem);
        }
    }

    // 为分享选项添加点击事件
    function shareToX(newItem) {
        newItem.addEventListener('click', () => {
            const content = sessionStorage.getItem(cacheKey);
            if (content) {
                const encodedText = encodeURIComponent(content);
                const twitterShareUrl = `https://twitter.com/intent/post?text=${encodedText}`;
                window.open(twitterShareUrl, '_blank');
            }
        });
    }
})();