// ==UserScript==
// @name         哔咔列表优化
// @namespace    http://tampermonkey.net/
// @version      2025-12-20
// @description  哔咔列表优化：新页面打开漫画
// @author       something unknown
// @match        https://manhuabika.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manhuabika.com
// @grant        none    
// @license      MIT    
// @downloadURL https://update.greasyfork.org/scripts/526392/%E5%93%94%E5%92%94%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/526392/%E5%93%94%E5%92%94%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const emoji = '📄';


    const comicFunc = () => {
        // 分类页面核心功能 - 为每个漫画卡片创建新窗口打开链接
        const createComicInterceptLink = (DOMNode) => {
            // 防重复处理 - 如果已存在自定义链接则跳过
            // 对swiper-slide类排除处理，因为是轮播图元素
            if (DOMNode.querySelector('.custom_link') && !DOMNode.classList.contains('swiper-slide')) {
                return;
            }

            // 移除原始点击事件 - 防止冲突
            DOMNode.removeEventListener('click', DOMNode.click);

            // 从React Fiber中提取漫画ID并构建新链接
            const newComicHref = (() => {
                for (let key in DOMNode) {
                    if (key.includes('__reactFiber')) {
                        let tmpKey = DOMNode[key].key ?? DOMNode[key].return.key;
                        if (!tmpKey) continue;
                        tmpKey = tmpKey.replace(/[^0-9a-zA-Z]/g, '');
                        return window.location.origin + '/comic/' + tmpKey;
                    }
                }
            })();

            // 创建覆盖链接元素
            const link = document.createElement('a');
            link.href = newComicHref;
            link.target = '_blank';
            link.style.position = 'absolute';
            link.style.top = '0';
            link.style.left = '0';
            link.style.width = '100%';
            link.style.height = '100%';
            link.style.zIndex = '9999';
            link.className = "custom_link";

            // 绑定点击事件 - 新窗口打开并阻止事件冒泡
            link.addEventListener('click', (e) => {
                window.open(newComicHref, '_blank');
                e.preventDefault();
                e.stopPropagation();
            })

            DOMNode.style.position = 'relative';
            DOMNode.appendChild(link);
        }

        // 获取所有漫画卡片节点
        const comicNodes = [
            ...document.querySelectorAll('.comic-card'),
            ...document.querySelectorAll('.comic-list-item'),
            ...document.querySelectorAll('.rank-card'),
            ...document.querySelectorAll('.rank-item'),
            ...document.querySelectorAll('.swiper-slide'),

        ];
        console.log(`[${emoji}] 检测到 ${comicNodes.length} 个漫画项目`);

        // 为每个节点创建新窗口链接
        comicNodes.forEach((node) => {
            createComicInterceptLink(node);
        })
    }

    // 轮询机制 - 处理动态加载内容
    // 由于哔咔页面采用React动态加载，页面初始化时的轮询不一定能够完全覆盖
    // 这里使用持续轮询，尽可能覆盖
    // 可能影响性能，但影响不会很大

    const loopFunc = () => {
        // 执行对应页面的处理函数
        comicFunc();

        // 继续下一轮检查
        setTimeout(() => {
            loopFunc();
        }, 1000); // 1秒间隔，平衡性能与实时性
    }
    // 启动轮询 - 开始监控页面变化
    loopFunc();

})();