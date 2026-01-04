// ==UserScript==
// @name         推特微博知乎B站小红书关键词屏蔽器
// @namespace    http://tampermonkey.net/
// @version      2025-08-05
// @description  屏蔽推特、微博、知乎、小红书、B站含关键词的内容
// @author       clearives
// @match        https://www.zhihu.com/
// @match        https://www.xiaohongshu.com/*
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @match        https://s.weibo.com/*
// @match        https://x.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543491/%E6%8E%A8%E7%89%B9%E5%BE%AE%E5%8D%9A%E7%9F%A5%E4%B9%8EB%E7%AB%99%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543491/%E6%8E%A8%E7%89%B9%E5%BE%AE%E5%8D%9A%E7%9F%A5%E4%B9%8EB%E7%AB%99%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const originalConsoleLog = console.log;
    console.log = (...args) => {
        originalConsoleLog('[关键词屏蔽]', ...args);
    };

    // 统一的屏蔽关键词列表
    const BLOCK_KEYWORDS = [
        // 擦边类
        '小姐姐', '女演员', '健身房', 'JK', '身材', '公主', '腿', '胸',
        // 教育类
        '儿子', '女儿', '小孩', '幼儿园', '幼师', '高考', '录取', '中考', '职高', '大专', '考研', '考公', '补课', '补习', '985', '211',
        // 消费类
        '迪士尼', '盲盒', '奶茶', 'COSER', 'coser', 'Coser', '漫展',
        // 社会类
        '大妈', '男子', '天价耳环', '外卖', '补贴', '农村', '中年', '人生', '无聊',
        // 两性类
        '女性', '男性', '女生', '美女', '女神', '女朋友', '男朋友', '性别', '吵架',
        // 婚姻类
        '单亲', '大龄女', '结婚', '生娃', '扶弟魔', '妈宝男', '凤凰男', '普信男', '婚姻', '不生娃', '不结婚', '彩礼', '嫁妆', '生孩子', '冠姓权', '婆婆', '阳历', '大龄剩女', '老公', '体育生', '黑人',
        // 品牌营销类
        '小米', '华为', '鸿蒙', '雷军', '任正非', '余承东', '董宇辉', '刘强东', '东哥', '杨笠', '傅首尔', '李欣莳', '宗庆后', '娃哈哈', '户晨风', '峰哥', '黄杨',
        // 鉴证类
        '俄乌', '普京', '泽连斯基', '高层住宅', '房价',
        // 广告类
        '保险',
    ];

    // 获取当前网站类型
    function getCurrentSite() {
        const hostname = window.location.hostname;
        if (hostname.includes('zhihu.com')) return 'zhihu';
        if (hostname.includes('xiaohongshu.com')) return 'xiaohongshu';
        if (hostname.includes('bilibili.com')) return 'bilibili';
        if (hostname.includes('weibo.com')) return 'weibo';
        if (hostname.includes('x.com')) return 'twitter';
        return 'unknown';
    }

    // 网站特定的配置
    const siteConfigs = {
        zhihu: {
            containerSelector: '.ContentItem',
            titleSelector: '.ContentItem-title a',
            logPrefix: '已屏蔽知乎问题',
        },
        xiaohongshu: {
            containerSelector: 'section.note-item',
            titleSelector: 'a.title, .title',
            logPrefix: '已屏蔽小红书内容',
        },
        weibo: {
            containerSelector: '.wbpro-scroller-item',
            titleSelector: '.wbpro-feed-content .detail_wbtext_4CRf9',
            logPrefix: '已屏蔽微博内容',
        },
        twitter: {
            containerSelector: 'article[role="article"]',
            titleSelector: '.a',
            BLOCK_KEYWORDS: [
                '政治', '拜登', '川普', '以色列', '加沙', 'AI绘图',
                '女权', '男权', '饭圈', '明星', '偶像', '粉红',
                'Bitcoin', 'NFT', '美股', '币圈', '推荐', 'Ad'
            ],
            logPrefix: '已屏蔽推特内容',
        },
    };

    // 处理单个内容元素
    function processContentElement(element, config) {
        const site = getCurrentSite();
        const titleElement = element.querySelector(config.titleSelector);
        let title = '';

        if (titleElement) {
            title = titleElement.textContent.trim();
        } else {
            // 兜底查找整个元素文本
            title = element.textContent.trim();
        }

        // 检查是否包含屏蔽关键词
        if ((config.BLOCK_KEYWORDS || BLOCK_KEYWORDS).some(keyword => {
            const lowerTitle = title.toLowerCase();
            const lowerKeyword = keyword.toLowerCase();

            if (lowerTitle.includes(lowerKeyword)) {
                console.log(`匹配到关键词（不区分大小写）: ${keyword}`);
                return true;
            }
            return false;
        })) {
            let containerRemoved = false;

            // 针对不同网站的特殊处理：删除整个容器
            if (site === 'zhihu' && false) {
                // 向上查找Card容器
                let cardElement = element.closest('.Card.TopstoryItem.TopstoryItem-isRecommend');
                if (cardElement) {
                    cardElement.remove();
                    console.log(`${config.logPrefix}: ${title} (删除整个卡片)`);
                    containerRemoved = true;
                }
            } else if (site === 'xiaohongshu' && false) {
                // 向上查找note-item容器
                let noteItemElement = element.closest('.note-item');
                if (noteItemElement) {
                    noteItemElement.remove();
                    console.log(`${config.logPrefix}: ${title} (删除整个note-item)`);
                    containerRemoved = true;
                }
            }

            // 如果没找到特定容器或其他网站，使用原来的隐藏方式
            if (!containerRemoved) {
                element.style.display = 'none';
                //element.style.border = "2px solid #f60";
                //element.style.height = "28px";
                //element.style.overflow = "auto";
                // element.style.opacity = "0.01";
                // console.log(`${config.logPrefix}: ${title} (隐藏元素)`);
            }
        }
    }

    // 处理所有内容元素
    function processAllContent() {
        const site = getCurrentSite();
        const config = siteConfigs[site];

        if (!config) {
            console.log('未支持的网站:', window.location.hostname);
            return;
        }

        document.querySelectorAll(config.containerSelector).forEach(element => {
            processContentElement(element, config);
        });
    }

    // 防抖处理函数
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    const debouncedProcessAllContent = debounce(processAllContent, 500);

    // 初始化处理
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processAllContent);
    } else {
        processAllContent();
    }
    window.addEventListener('load', processAllContent);

    // 监听DOM变化
    const observer = new MutationObserver(mutations => {
        const site = getCurrentSite();
        const config = siteConfigs[site];
        if (!config) return;

        let shouldProcess = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches && node.matches(config.containerSelector)) {
                            processContentElement(node, config);
                        } else if (node.querySelectorAll) {
                            const elements = node.querySelectorAll(config.containerSelector);
                            if (elements.length > 0) {
                                shouldProcess = true;
                                elements.forEach(element => processContentElement(element, config));
                            }
                        }
                    }
                });
            }
        });

        if (shouldProcess) debouncedProcessAllContent();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 滚动事件监听
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(debouncedProcessAllContent, 1000);
    }, { passive: true });

    // 定时扫描
    setInterval(processAllContent, 5000);

    console.log(`各平台关键词屏蔽器已启动，当前网站: ${getCurrentSite()}`);
})();