// ==UserScript==
// @name         多站点屏蔽词过滤器合集
// @namespace    http://tampermonkey.net/
// @version      2025-07-23
// @description  支持知乎、X.com 等多个网站的关键词屏蔽功能，可扩展更多站点逻辑模块化管理
// @author       clearives
// @match        https://www.zhihu.com/*
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543464/%E5%A4%9A%E7%AB%99%E7%82%B9%E5%B1%8F%E8%94%BD%E8%AF%8D%E8%BF%87%E6%BB%A4%E5%99%A8%E5%90%88%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/543464/%E5%A4%9A%E7%AB%99%E7%82%B9%E5%B1%8F%E8%94%BD%E8%AF%8D%E8%BF%87%E6%BB%A4%E5%99%A8%E5%90%88%E9%9B%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** 公共函数：判断文本是否包含屏蔽关键词 */
    function hasBlockedKeyword(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    function setFixedStyles(element, key) {
        element.style.display = 'none';
        element.style.border = "2px solid #f60";
        element.style.opacity = "0.1";
        // element.style.height = "30px";
        // element.style.overflow = "auto";
        // element.textContent = key || "已屏蔽";
    }

    /** ===================== 知乎模块 ===================== */
    function zhihuHandler() {
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
            '俄乌', '普京', '泽连斯基', '高层住宅', '房价'
        ];

        const QUESTION_CONTAINER_SELECTOR = '.ContentItem';
        const TITLE_SELECTOR = '.ContentItem-title a';

        function processQuestionElement(element) {
            const titleElement = element.querySelector(TITLE_SELECTOR);
            if (titleElement) {
                const title = titleElement.textContent.trim();
                if (hasBlockedKeyword(title, BLOCK_KEYWORDS)) {
                    setFixedStyles(element, title)
                    console.log(`知乎已屏蔽: ${title}`);
                }
            }
        }

        function processAllQuestions() {
            document.querySelectorAll(QUESTION_CONTAINER_SELECTOR).forEach(processQuestionElement);
        }

        function observeDOMChanges() {
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.matches?.(QUESTION_CONTAINER_SELECTOR)) {
                                processQuestionElement(node);
                            } else {
                                node.querySelectorAll?.(QUESTION_CONTAINER_SELECTOR).forEach(processQuestionElement);
                            }
                        }
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        window.addEventListener('load', () => {
            processAllQuestions();
            observeDOMChanges();
        });
    }

    /** ===================== X.com / Twitter 模块 ===================== */
    function twitterHandler() {
        const BLOCK_KEYWORDS = [
            '政治', '拜登', '川普', '以色列', '加沙', 'AI绘图',
            '女权', '男权', '饭圈', '明星', '偶像', '粉红',
            'Bitcoin', 'NFT', '美股', '币圈', '推荐'
        ];

        const TWEET_SELECTOR = 'article[role="article"]';

        function processTweet(element) {
            const text = element.innerText || '';
            if (hasBlockedKeyword(text, BLOCK_KEYWORDS)) {
                setFixedStyles(element, )
                console.log(`X.com 已屏蔽推文: ${text.substring(0, 20)}...`);
            }
        }

        function processAllTweets() {
            document.querySelectorAll(TWEET_SELECTOR).forEach(processTweet);
        }

        function observeDOMChanges() {
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.matches?.(TWEET_SELECTOR)) {
                                processTweet(node);
                            } else {
                                node.querySelectorAll?.(TWEET_SELECTOR).forEach(processTweet);
                            }
                        }
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        window.addEventListener('load', () => {
            processAllTweets();
            observeDOMChanges();
        });
    }

    /** ===================== 路由调度器 ===================== */
    const siteHandlers = {
        'www.zhihu.com': zhihuHandler,
        'x.com': twitterHandler,
        'twitter.com': twitterHandler
        // 可在此添加更多网站
        // 'weibo.com': weiboHandler,
        // 'www.bilibili.com': bilibiliHandler,
    };

    /** 启动：根据当前域名执行对应站点处理函数 */
    const host = window.location.hostname;
    const handler = siteHandlers[host];

    if (handler) {
        handler();
    } else {
        console.log(`[屏蔽脚本] 当前网站 (${host}) 暂无屏蔽逻辑。`);
    }
})();
