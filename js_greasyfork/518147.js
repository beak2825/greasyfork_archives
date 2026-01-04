// ==UserScript==
// @name         Bilibili哔哩哔哩B站主页极简
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  只有5kb,只保留导航和B站首页的前6个（可自行更改）动态卡片，每个视频卡片调整宽度即可调整大小，简单实用。
// @author       极简实用
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/518147/Bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9B%E7%AB%99%E4%B8%BB%E9%A1%B5%E6%9E%81%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/518147/Bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9B%E7%AB%99%E4%B8%BB%E9%A1%B5%E6%9E%81%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 动态添加CSS
    const styleTag = `
        .header-history-video {
            display: flex;
            padding: 10px 20px;
            transition: background-color .3s;
        }

        .header-dynamic-list-item {
            padding: 12px 20px;
            display: flex;
            flex-direction: column;
            cursor: pointer;
            transition: .3s;
        }

        .header-dynamic-container {
            display: flex;
            flex-direction: row;
         }

        .dynamic-name-line {
            display: inline-block;
            font-size: 13px;
            color: var(--text2);
        }

        .header-dynamic-avatar {
            position: relative;
            display: block;
            width: 38px;
            height: 38px;
            border: 2px solid var(--graph_bg_thick);
            border-radius: 50%;
        }

        .header-history-video__image .v-img {
            position: relative;
            flex-shrink: 0;
            margin-right: 10px;
            width: 128px;
            height: 72px;
            border-radius: 4px;
        }
        .red-num--dynamic {
            z-index: 1;
            position: absolute;
            top: -6px;
            left: 25px;
            padding: 0 4px;
            min-width: 15px;
            border-radius: 10px;
            background-color: #fa5a57;
            color: #fff;
            font-size: 12px;
            line-height: 15px;
        }
        .header-dynamic-list-item:hover {
            background-color: var(--graph_bg_thick);
        }
        .header-dynamic__box--center {
            width: 260px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            padding: 0 12px;
        }
        .header-history-video__duration {
             position: absolute;
             right: 4px;
             bottom: 4px;
             padding: 0;
             border-radius: 2px;
             background: rgba(0,0,0,.4);
             line-height: 17px;
        }
        .header-history-video__duration--text {
             display: inline-block;
             color: #fff;
             font-size: 12px;
             line-height: 14px;
             transform: scale(.85);
             transform-origin: center top;
         }

        #simplified-container {
            display: flex;
            flex-direction: column;
            align-items: center;  /* 水平居中 */
            justify-content: center;  /* 垂直居中 */
            padding: 20px;
            min-height: 100vh;  /* 最小高度为视窗高度 */
        }

        #simplified-container > div {
            display: flex;
            flex-wrap: wrap;  /* 允许换行 */
            justify-content: center;
            align-items: center;
            gap: 10px;  /* 控制间距 */
        }

        #simplified-container .v-popover-wrap {
            height: 30px;
            display: flex;
            margin-right: 5px;
            position: relative;
            z-index: 1000;
        }

        #simplified-container .feed-card {
            width: 380px; /* 调整宽度可更改视频大小 */
            margin: 10px;
        }

        #simplified-container form#nav-searchform {
            display: flex;
            align-items: center;
        }

        #simplified-container form#nav-searchform input[type="text"] {
            width: 200px; /* 根据需要调整搜索框宽度 */
        }

        #simplified-container form#nav-searchform button {
            margin-left: 5px;
        }

        #simplified-container form#nav-searchform .nav-search-clean {
            display: none;
        }
    `;
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styleTag;
    document.head.appendChild(styleElement);

    // 选择器，用于定位要保留的元素
    const popoverWrapSelector = '.v-popover-wrap';  // 导航栏中的下拉菜单
    const feedCardSelector = '.feed-card';          // 推荐视频卡片
    const searchFormSelector = '#nav-searchform';   // 搜索表单

    // 创建一个容器来放置保留的元素
    function createContainer() {
        const container = document.createElement('div');
        container.id = 'simplified-container';
        document.body.appendChild(container);
        return container;
    }

    // 将需要保留的元素移动到容器中
    function moveElementsToContainer(container) {
        // 创建两个子容器
        const headerRow = document.createElement('div');
        const feedRow = document.createElement('div');

        // 移动 v-popover-wrap 到第一行
        const popoverWraps = document.querySelectorAll(popoverWrapSelector);
        popoverWraps.forEach(popoverWrap => {
            headerRow.appendChild(popoverWrap);
        });

        // 移动 nav-searchform 到第一行
        const searchForms = document.querySelectorAll(searchFormSelector);
        searchForms.forEach(searchForm => {
            // 移除 nav-search-clean 子元素
            const cleanDiv = searchForm.querySelector('.nav-search-clean');
            if (cleanDiv) {
                cleanDiv.remove();
            }
            headerRow.appendChild(searchForm);
        });

        // 移动前6个推荐视频卡片到第二行
        const feedCards = document.querySelectorAll(feedCardSelector);
        for (let i = 0; i < Math.min(6, feedCards.length); i++) {
            feedRow.appendChild(feedCards[i]);
        }

        // 将两行添加到主容器中
        container.appendChild(headerRow);
        container.appendChild(feedRow);
    }

    // 删除特定元素
    function removeSpecificElements() {
        // 删除导航栏中的特定元素（如头像）
        const elementsToRemove = document.querySelectorAll('.header-avatar-wrap');
        elementsToRemove.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }

    // 删除除保留元素外的所有其他元素
    function cleanPage() {
        // 创建容器
        const container = createContainer();

        // 移动需要保留的元素到容器中
        moveElementsToContainer(container);

        // 删除特定元素
        removeSpecificElements();

        // 删除其他所有元素
        document.body.querySelectorAll('*').forEach(node => {
            if (node !== container && !container.contains(node) && node.parentNode) {
                node.parentNode.removeChild(node);
            }
        });
    }

    // 使用MutationObserver确保在页面元素加载完毕后执行
    function observeDOM(callback) {
        const observer = new MutationObserver((mutations) => {
            const popoverWraps = document.querySelectorAll(popoverWrapSelector);
            if (popoverWraps.length >= 8 && document.querySelector(feedCardSelector)) {
                observer.disconnect(); // 停止观察
                callback();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 开始观察DOM并执行清理操作
    observeDOM(() => {
        cleanPage();
    });

})();



