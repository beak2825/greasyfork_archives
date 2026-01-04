// ==UserScript==
// @name        知乎屏蔽
// @namespace   https://github.com/mygith/monkey
// @match       https://www.zhihu.com/
// @grant       none
// @version     0.3
// @author      mygith
// @license     GPL License
// @description 模拟点击实现内容屏蔽
// @downloadURL https://update.greasyfork.org/scripts/537286/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/537286/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 配置区====================================================
    const titleStopWords = ['NPD', 'INTP', '北大', '清华', '00元', '小说', '基建狂魔', '出国', '出了国', '中国学生', '留学', '韩流',
        '小米', '华为', '尊界', '长城', '比亚迪', '鸿蒙', '问界', '品牌', '明星', 'NAS', '环保', '健康', '618', '护肤', '敏感肌', '面膜', '新品',
        '跨境电商', '副业', '赚钱', '海外', '富贵', '适合普通人', '赚麻了', '神器', '脱毛', '爱美', '少儿编程', '颜值',
        '暧昧', '异性', '舔狗', '彩礼', '抑郁', '疯狂', '恋', '植发', '分享', '生理性', '婚姻', '男', '女', '虐文', '肉体', '沉迷',
        '为什么我', '只能', '其实', '真的', '听过', '洗白', '焦虑', '劝退', '人生', '底层', '匿名', '路子', '陌生人',
        '电视剧', '中年危机', '亲戚', '夫妻', '内向', '玄', '修炼',
    ];
    const badgeTextStopWords = ['全网', '同名', '家居', '家电', '优质', '文案', '好物', '推荐', '合作', '简介'];
    const targetSelector = '.Topstory-content, .QuestionPage-main';
    const cardSelector = '.Card:not([data-zf-processed])';
    const titleSelector = '.ContentItem-title, [data-za-detail-view-element_name="Title"], .QuestionHeader-title';
    const badgeTextSelector = '.AuthorInfo-badgeText';
    const menuSelector = '.Menu-item';
    const menuText = '不感兴趣';
    const menuTimeout = 2000; // 菜单等待超时时间

    // 逻辑区 ====================================================
    let observer;

    // 智能点击操作（带重试机制）
    const performBlock = async (card) => {
        try {
            // 第一阶段：点击更多按钮
            const moreBtn = card.querySelector('.ContentItem-action button[aria-label="更多"]');
            if (!moreBtn) {
                console.warn('⚠️ 未找到更多按钮', card);
                return false;
            }
            moreBtn.click();

            // 等待菜单渲染
            const menuItem = await waitForElement();
            if (!menuItem) {
                console.error('⌛ 菜单项加载超时');
                return false;
            }

            // 第二阶段：点击屏蔽项
            menuItem.click();
            console.log('✅ 已屏蔽内容');
            return true;
        } catch (e) {
            console.error('❌ 屏蔽流程异常:', e);
            return false;
        }

        function waitForElement() {
            return new Promise((resolve, reject) => {
                const start = Date.now();
                const check = () => {
                    const nodeList = document.querySelectorAll(menuSelector);
                    const el = Array.from(nodeList).find(el =>
                        el.textContent.trim().includes(menuText)
                    );
                    if (el) return resolve(el);
                    if (Date.now() - start > menuTimeout) return reject('Timeout');
                    requestAnimationFrame(check);
                };
                check();
            });
        }
    };

    // 卡片处理器（带状态追踪）
    const processCard = async (card) => {
        if (card.dataset.zfStatus) return; // 防止重复处理

        const title = card.querySelector(titleSelector)?.textContent.trim();
        if (!title) {
            card.dataset.zfStatus = 'no-title';
            return;
        }

        if (titleStopWords.some(w => title.includes(w))) {
            card.dataset.zfStatus = 'processing';
            performBlock(card);
        } else {
            const badgeText = card.querySelector(badgeTextSelector)?.textContent.trim();
            if (badgeTextStopWords.some(w => badgeText.includes(w))) {
                card.dataset.zfStatus = 'processing';
                performBlock(card);
            } else {
                card.dataset.zfStatus = 'passed';
            }
        }
    };

    // 批量处理器（带节流控制）
    const processCards = (() => {
        let processing = false;
        return (root) => {
            if (processing) return;
            processing = true;

            const cards = Array.from(root.querySelectorAll(cardSelector));
            cards.forEach(card => processCard(card));

            requestAnimationFrame(() => processing = false);
        };
    })();

    // 观察器管理（动态容器感知）
    const initObserver = () => {
        if (observer) observer.disconnect();

        const target = document.querySelector(targetSelector) || document.documentElement;
        processCards(target);

        observer = new MutationObserver(mutations => {
            const needsCheck = mutations.some(m =>
                m.addedNodes.length > 0 ||
                m.attributeName === 'class'
            );
            if (needsCheck) processCards(target);
        });

        observer.observe(target, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });

        // SPA路由检测
        let lastPath = location.pathname;
        const checkRoute = () => {
            if (location.pathname !== lastPath) {
                lastPath = location.pathname;
                initObserver(); // 重新初始化
            }
            requestAnimationFrame(checkRoute);
        };
        checkRoute();
    };

    // 启动控制器
    const init = () => {
        if (document.readyState === 'complete') initObserver();
        else window.addEventListener('load', initObserver, { once: true });
    };

    // 兼容性启动
    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();
})();