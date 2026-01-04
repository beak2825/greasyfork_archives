// ==UserScript==
// @name         Papers.cool 分屏显示 Kimi QA
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  将 papers.cool 页面分为左右两部分，点击 [Kimi] 按钮后仅在右侧显示 QA 数据，屏蔽 toggleKimi 内部导致页面跳转和滚动的操作，同时隐藏左侧原始 QA 容器。
// @author       WenDavid
// @match        *://papers.cool/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/526312/Paperscool%20%E5%88%86%E5%B1%8F%E6%98%BE%E7%A4%BA%20Kimi%20QA.user.js
// @updateURL https://update.greasyfork.org/scripts/526312/Paperscool%20%E5%88%86%E5%B1%8F%E6%98%BE%E7%A4%BA%20Kimi%20QA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /***********************
     * 1. 创建分屏布局
     ***********************/
    function createSplitLayout() {
        // 仅在 <body id="arxiv"> 情况下执行移动操作
        if (document.body.id !== 'arxiv') {
            return;
        }

        // 创建左侧容器，并将 body 内所有子节点移入左侧容器
        let leftContainer = document.createElement('div');
        leftContainer.id = 'left-container';
        leftContainer.style.cssText = 'width: 50%; height: 100vh; overflow-y: auto; box-sizing: border-box;';
        while (document.body.firstChild) {
            leftContainer.appendChild(document.body.firstChild);
        }

        // 创建右侧容器，用于显示 QA 数据
        let rightContainer = document.createElement('div');
        rightContainer.id = 'right-container';
        rightContainer.style.cssText = 'width: 50%; height: 100vh; overflow-y: auto; box-sizing: border-box; padding: 10px;';

        // 创建居中可拖动的分界线
        let divider = document.createElement('div');
        divider.id = 'divider';
        divider.style.cssText = 'width: 5px; cursor: col-resize; background-color: #ccc; height: 100vh;';

        // 创建分屏容器，采用 Flex 布局放置左右容器以及中间分界线
        let splitContainer = document.createElement('div');
        splitContainer.id = 'split-container';
        splitContainer.style.cssText = 'width: 100vw; height: 100vh; display: flex;';

        splitContainer.appendChild(leftContainer);
        splitContainer.appendChild(divider);
        splitContainer.appendChild(rightContainer);
        document.body.appendChild(splitContainer);

        // 为分界线添加拖动逻辑
        divider.addEventListener('mousedown', function(e) {
            e.preventDefault();
            let startX = e.clientX;
            // 获取初始宽度（像素值）
            let leftWidth = leftContainer.getBoundingClientRect().width;
            let rightWidth = rightContainer.getBoundingClientRect().width;
            let containerWidth = splitContainer.getBoundingClientRect().width;

            function onMouseMove(e) {
                let deltaX = e.clientX - startX;
                let newLeftWidth = leftWidth + deltaX;
                let newRightWidth = rightWidth - deltaX;
                // 设置最小宽度限制，防止宽度过小
                const minWidth = 100;
                if (newLeftWidth < minWidth) {
                    newLeftWidth = minWidth;
                    newRightWidth = containerWidth - divider.offsetWidth - minWidth;
                } else if (newRightWidth < minWidth) {
                    newRightWidth = minWidth;
                    newLeftWidth = containerWidth - divider.offsetWidth - minWidth;
                }
                leftContainer.style.width = newLeftWidth + 'px';
                rightContainer.style.width = newRightWidth + 'px';
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }


    // 更新右侧容器内容
    function updateRightContainer(htmlContent) {
        let rightContainer = document.getElementById('right-container');
        if (rightContainer) {
            rightContainer.innerHTML = htmlContent;
        }
    }

    /***********************
     * 2. 劫持 toggleKimi 以阻止页面跳转和滚动
     ***********************/
    function hijackToggleKimi() {
        if (typeof toggleKimi === 'function') {
            const originalToggleKimi = toggleKimi;
            toggleKimi = function(paperId, link) {
                console.log(`劫持 toggleKimi，阻止页面跳转与滚动`);
                // 保存原始的 scrollIntoView 与 history.pushState
                const originalScrollIntoView = Element.prototype.scrollIntoView;
                const originalPushState = history.pushState;
                // 临时覆盖这两个方法为空函数
                Element.prototype.scrollIntoView = function() {};
                history.pushState = function() {};

                try {
                    originalToggleKimi(paperId, link);
                } catch (error) {
                    console.error("toggleKimi 执行错误:", error);
                }

                // 100 毫秒后恢复原始方法
                setTimeout(() => {
                    Element.prototype.scrollIntoView = originalScrollIntoView;
                    history.pushState = originalPushState;
                }, 100);
            };
        }
    }
    // 修改后的 handleKimiClick 函数
    function handleKimiClick(event) {
        event.preventDefault();
        event.stopPropagation();

        // 从按钮 id 中提取 paperId（假定格式为 "kimi-<paperId>"）
        let paperId = this.id.replace('kimi-', '');

        // 如果原来的 kimi-container 存在，则将其移除
        let oldContainer = document.getElementById(`kimi-container-${paperId}`);
        if (oldContainer) {
            oldContainer.parentNode.removeChild(oldContainer);
        }

        // 在右侧容器中新建一个 container，并赋予原有的 id
        let rightContainer = document.getElementById('right-container');
        if (!rightContainer) {
            console.error("右侧容器不存在");
            return;
        }
        rightContainer.replaceChildren();
        let newContainer = document.createElement('div');
        newContainer.id = `kimi-container-${paperId}`;
        // 可根据需要设置初始样式（例如初始隐藏）
        newContainer.style.cssText = 'display: none;';
        rightContainer.appendChild(newContainer);

        // 禁用新 container 的 scrollIntoView，防止 toggleKimi 导致页面滚动
        newContainer.scrollIntoView = function() {};

        // 临时覆盖 history.pushState，防止页面跳转（10 秒后恢复）
        const originalPushState = history.pushState;
        history.pushState = function() {};
        setTimeout(() => {
            history.pushState = originalPushState;
        }, 10000);

        // 劫持 toggleKimi 以阻止跳转及滚动（保持原有逻辑）
        hijackToggleKimi();

        // 调用原始的 toggleKimi 函数，此时它会查找 id 为 "kimi-container-<paperId>" 的元素，
        // 而该元素已经在右侧容器中
        if (typeof toggleKimi === 'function') {
            toggleKimi(paperId, this);
        }

        // 可选：使用 MutationObserver 监听新容器的变化，判断 QA 数据何时加载完成
        let observer = new MutationObserver(() => {
            if (newContainer.style.display === 'block' && newContainer.innerHTML.trim() !== '') {
                console.log("QA 数据加载成功，已在右侧容器中显示");
                observer.disconnect();
            }
        });
        observer.observe(newContainer, {
            attributes: true,
            attributeFilter: ['style'],
            childList: true,
            subtree: true
        });

        // 可选：3 秒后进行一次超时检查
        setTimeout(() => {
            if (newContainer.innerHTML.trim() !== '') {
                console.log("超时后数据加载完成，右侧容器已更新");
            }
        }, 3000);
    }


    /***********************
     * 4. 为所有现有的 [Kimi] 按钮绑定事件
     ***********************/
    function setupKimiButtons() {
        let kimiButtons = document.querySelectorAll("[id^='kimi-']");
        kimiButtons.forEach(button => {
            // 移除内联 onclick 事件，确保只走我们的逻辑
            button.removeAttribute('onclick');
            // 采用捕获阶段绑定事件，确保优先拦截
            button.addEventListener('click', handleKimiClick, true);
        });
    }

    /***********************
     * 5. 监听动态加载的 [Kimi] 按钮
     ***********************/
    function observeNewKimiButtons() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        let newButtons = node.querySelectorAll ? node.querySelectorAll("[id^='kimi-']") : [];
                        newButtons.forEach(btn => {
                            btn.removeAttribute('onclick');
                            btn.addEventListener('click', handleKimiClick, true);
                        });
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /***********************
     * 6. 初始化
     ***********************/
    window.addEventListener('load', () => {
        createSplitLayout();
        setupKimiButtons();
        observeNewKimiButtons();
    });
})();
