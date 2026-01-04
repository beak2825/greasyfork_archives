// ==UserScript==
// @name         【中羽在线】新闻过滤与自动展开
// @namespace   https://github.com/realSilasYang
// @version         2025-9-13
// @description    多合一功能脚本：1. 过滤低评论新闻 2. 过滤疑似广告 3. 智能后台加载(5次/轮)  4. 新标签页打开新闻详情。5. 光标悬停新闻卡片显示手型
// @author          阳熙来
// @match          https://www.badmintoncn.com/*
// @icon            data:image/png;base64,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
// @license      GNU GPLv3
// @grant        GM_openInTab
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543770/%E3%80%90%E4%B8%AD%E7%BE%BD%E5%9C%A8%E7%BA%BF%E3%80%91%E6%96%B0%E9%97%BB%E8%BF%87%E6%BB%A4%E4%B8%8E%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/543770/%E3%80%90%E4%B8%AD%E7%BE%BD%E5%9C%A8%E7%BA%BF%E3%80%91%E6%96%B0%E9%97%BB%E8%BF%87%E6%BB%A4%E4%B8%8E%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --------------------------------------------------------------------------------
    // 模块0: 添加自定义样式
    // 作用：让新闻列表和热点新闻在鼠标悬停时显示为可点击状态
    // --------------------------------------------------------------------------------
    GM_addStyle(`
        .news_list, .newst.hot {
            cursor: pointer;
        }
    `);

    // --------------------------------------------------------------------------------
    // 模块1: 新闻过滤 (评论数)
    // 作用：只保留评论数 >= 20 的新闻，低于此数的直接移除
    // --------------------------------------------------------------------------------
    function shouldKeep(box) {
        // 找到评论图标
        const pjImg = box.querySelector('img.news_pj');
        if (!pjImg) return false;

        // 评论数在图标的下一个文本节点
        const nextNode = pjImg.nextSibling;
        if (!nextNode || nextNode.nodeType !== 3 || !nextNode.nodeValue) return false;

        // 转换为数字
        const commentNum = parseInt(nextNode.nodeValue.trim(), 10);

        // 保留评论数 >= 20 的新闻
        return !isNaN(commentNum) && commentNum >= 20;
    }

    // 过滤单条新闻
    function filterSingle(box) {
        if (!shouldKeep(box)) {
            box.remove();
        }
    }

    // 过滤整个页面的新闻
    function filterAll(root = document) {
        root.querySelectorAll('.news_list').forEach(filterSingle);
    }

    // 监听 DOM 变化，动态过滤新加载的新闻
    const newsObserver = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType !== 1) continue; // 只处理元素节点
                if (node.classList && node.classList.contains('news_list')) {
                    filterSingle(node);
                } else {
                    filterAll(node);
                }
            }
        }
    });

    // --------------------------------------------------------------------------------
    // 模块2: 过滤疑似广告内容
    // 作用：移除包含特定广告关键词的新闻
    // --------------------------------------------------------------------------------
    function filterExclamationNews() {
        const mainNewsContainer = document.querySelector('div.news.main');
        if (!mainNewsContainer) return;

        // 定义广告关键词（大小写不敏感）
        const adKeywords = [
            '！', '品牌', '胜利', 'VICTOR', 'YONEX', '尤尼克斯', '安踏', '李宁', '薰风', '薰',
            'KUMPOOO', '川崎', 'Kawasaki', '得物', '波力', 'BONNY', '极光', '亚瑟士',
            'ASICS', '耐克', '欧击', '蟹羽', '球拍', '球鞋', '羽鞋', '球线', '新品',
            '产品', '上市', '发布', '评测', '测评', '赏析', '试打', '试穿', '上手',
            '限量', '抢先', '纪念', '隆重', '报名', '签约', '代言'
        ];

        // 转换为正则（忽略大小写）
        const adRegex = new RegExp(adKeywords.join('|'), 'i');

        // 遍历新闻列表
        const listItems = mainNewsContainer.querySelectorAll('li');
        listItems.forEach(li => {
            if (li.textContent && adRegex.test(li.textContent)) {
                li.remove(); // 删除匹配的新闻
            }
        });
    }

    // --------------------------------------------------------------------------------
    // 模块3: 混合模式自动点击展开
    // 作用：自动点击“加载更多”按钮，最多点击5次
    // --------------------------------------------------------------------------------
    let isInitialLoad = true;

    // 延迟函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 批量点击“加载更多”
    async function performClickBatch() {
        console.log('开始新一轮自动加载（最多5次）...');
        const CLICK_LIMIT = 5;
        const CLICK_DELAY = 500; // 每次点击间隔 0.5 秒

        for (let i = 0; i < CLICK_LIMIT; i++) {
            const currentButton = document.getElementById('loadingButton');
            if (currentButton && currentButton.offsetParent !== null) {
                currentButton.click();
                console.log(`后台自动点击第 ${i + 1} 次。`);
                await sleep(CLICK_DELAY);
            } else {
                console.log('“加载更多”按钮消失，提前结束本轮。');
                break;
            }
        }
        console.log('本轮点击完成。');
    }

    // 监听“加载更多”按钮是否进入视口
    const buttonObserver = new IntersectionObserver(async (entries) => {
        const buttonEntry = entries[0];
        if (!isInitialLoad && buttonEntry.isIntersecting) {
            console.log('检测到您已滚动到底部，再次启动自动加载...');
            const button = buttonEntry.target;
            buttonObserver.unobserve(button);
            await performClickBatch();

            const buttonAfterClick = document.getElementById('loadingButton');
            if (buttonAfterClick) {
                 console.log('加载完成，进入“待命”状态，等待您下一次滚动...');
                 buttonObserver.observe(buttonAfterClick);
            } else {
                 console.log('所有内容已加载完毕。');
            }
        }
    }, { threshold: 0.1 });

    // --------------------------------------------------------------------------------
    // 模块4: 点击新闻区域打开新标签页
    // 作用：点击新闻列表项时，在新标签页打开新闻详情
    // --------------------------------------------------------------------------------
    function handleNewsClick(event) {
        const newsList = event.target.closest('.news_list');
        if (!newsList) return;

        // 如果点击的是标签（如分类标签），则不触发
        if (event.target.closest('.gray_label')) return;

        // 获取新闻 ID
        const newsIdElement = newsList.querySelector('.newst');
        if (!newsIdElement) return;

        const newsId = newsIdElement.getAttribute('title');
        if (newsId) {
            event.preventDefault();
            event.stopPropagation();
            const url = `https://www.badmintoncn.com/newsm.php?a=view&id=${newsId}&mag_hide_progress=1`;
            console.log(`打开新标签页: ${url}`);
            GM_openInTab(url, { active: true });
        }
    }

    // --------------------------------------------------------------------------------
    // 模块5: 脚本初始化
    // --------------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', async () => {
        // 1. 启动两种新闻过滤
        filterAll(); // 过滤低评论新闻
        filterExclamationNews(); // 过滤疑似广告新闻
        newsObserver.observe(document.documentElement, { childList: true, subtree: true });

        // 2. 启动点击打开新标签页功能
        document.body.addEventListener('click', handleNewsClick, true);

        // 3. 启动混合模式加载
        let loadButton = document.getElementById('loadingButton');
        while (!loadButton) {
            await sleep(500);
            loadButton = document.getElementById('loadingButton');
        }

        if (isInitialLoad) {
            await performClickBatch();
            isInitialLoad = false;
        }

        const buttonToObserve = document.getElementById('loadingButton');
        if (buttonToObserve) {
             console.log('首次加载完成，进入“待命”状态，等待您滚动到底部...');
             buttonObserver.observe(buttonToObserve);
        }
    });
})();
