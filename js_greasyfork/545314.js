// ==UserScript==
// @name         微博首页净化 (Weibo Homepage Cleaner) v1.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  微博首页净化
// @author       Lome
// @match        *://weibo.com/*
// @match        *://www.weibo.com/*
// @grant        none
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545314/%E5%BE%AE%E5%8D%9A%E9%A6%96%E9%A1%B5%E5%87%80%E5%8C%96%20%28Weibo%20Homepage%20Cleaner%29%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/545314/%E5%BE%AE%E5%8D%9A%E9%A6%96%E9%A1%B5%E5%87%80%E5%8C%96%20%28Weibo%20Homepage%20Cleaner%29%20v10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---- 🚫 配置区：定义所有需要屏蔽的目标 🚫 ----

    // 1. 通过【模糊匹配类名】屏蔽的元素 (处理动态哈希)
    const CLASS_PREFIXES_TO_HIDE = [
        'Home_publishCard_',      // 发布新鲜事的整个卡片
        'index_box_',             // 发布框本身
        'Nav_logoWrap_',          // 顶部栏的微博Logo
    ];

    // 2. 通过【包含的文本内容】来屏蔽其所在的整个“卡片”
    const TEXTS_TO_HIDE_PARENT_CARD = [
        '你可能感兴趣的人'
    ];

    // 3. 通过【精确文本】屏蔽的按钮或链接本身
    const EXACT_TEXTS_TO_HIDE = [
        // 左侧栏按钮
        '特别关注',
        '好友圈',
        '管理',
        // 内容区下方筛选按钮
        '视频',
        '超话社区',
        'V+微博',
        '群微博'
    ];

    // 4. 通过【固定选择器】屏蔽的元素 (ID、固定链接等)
    const STATIC_SELECTORS_TO_HIDE = [
        // 顶部导航栏
        'a[href="/hot"]',                     // 推荐
        'a[href="/tv"]',                      // 视频
        '#cniil_wza',                         // 无障碍按钮
        'a[class*="Ctrls_alink_"][href^="/u/"]',// 顶部栏的用户头像和昵称

        // 左侧栏
        'h3.Home_title_2CF0q',                // “自定义分组”标题
        'a[href*="/mygroups?gid="]',          // 隐藏所有自定义分组链接 (脚本会自动豁免“最新微博”)
        'div[node-type="left_nav_group"]',    // 【备用规则】自定义分组

        // 右侧栏
        'a[href="https://me.weibo.com"]',     // 创作者中心
        '.wbpro-side-copy',                   // 整个版权合作信息栏

        // 广告
        'article:has(div[mark*="_reallog_mark_ad"])',
        'article:has(div.head-info_tag_3iMJw)',
    ];

    // ---- ⚙️ 核心执行代码 ⚙️ ----

    let hasClickedLatestWeibo = false; // 用于确保自动点击只执行一次的标志

    function runCleanerAndActions() {
        // --- Part 1: 自动点击 "最新微博" ---
        if (!hasClickedLatestWeibo && !window.location.href.includes('gid=110001547520101')) {
            // 查找“最新微博”按钮，它的gid是固定的
            const latestWeiboButton = document.querySelector('a[href*="gid=110001547520101"]');
            if (latestWeiboButton) {
                // 检查它当前是否是选中的状态，如果不是才点击
                const isNotSelected = !latestWeiboButton.querySelector('.NavItem_cur_2ercx');
                if(isNotSelected) {
                    latestWeiboButton.click();
                }
                hasClickedLatestWeibo = true; // 无论是否已选中，都标记为已处理
            }
        }

        // --- Part 2: 隐藏元素 ---

        // 1. 处理固定选择器
        STATIC_SELECTORS_TO_HIDE.forEach(selector => {
            // 特殊处理：确保不隐藏“最新微博”
            if (selector === 'a[href*="/mygroups?gid="]') {
                document.querySelectorAll(selector).forEach(el => {
                    if (el.innerText !== '最新微博') { // 豁免“最新微博”，因我们需要它来触发点击
                        el.style.display = 'none';
                    }
                });
            } else {
                 try {
                    document.querySelectorAll(selector).forEach(el => el.style.display = 'none');
                } catch (e) { /* 忽略 :has() 在旧浏览器中的报错 */ }
            }
        });

        // 2. 处理模糊类名
        CLASS_PREFIXES_TO_HIDE.forEach(prefix => {
            document.querySelectorAll(`[class^="${prefix}"]`).forEach(el => {
                el.style.display = 'none';
            });
        });

        // 3. 隐藏包含特定文本的父级卡片
        if (TEXTS_TO_HIDE_PARENT_CARD.length > 0) {
            document.querySelectorAll('.Card_wrap_2ibWe, [class^="Card_wrap_"]').forEach(card => {
                const cardText = card.innerText;
                if (cardText && TEXTS_TO_HIDE_PARENT_CARD.some(text => cardText.includes(text))) {
                    card.style.display = 'none';
                }
            });
        }

        // 4. 隐藏文本完全匹配的按钮/链接
        if (EXACT_TEXTS_TO_HIDE.length > 0) {
            document.querySelectorAll('.NavItem_text_3Z0D7, .Home_editText_175Mf, .wbpro-textcut').forEach(el => {
                const text = el.innerText.trim();
                if (EXACT_TEXTS_TO_HIDE.includes(text)) {
                    const parent = el.closest('a, button, .woo-box-item-inlineBlock');
                    if (parent) parent.style.display = 'none';
                }
            });
        }
    }

    // --- 🚀 启动监视 🚀 ---
    const observer = new MutationObserver(() => {
        window.requestAnimationFrame(runCleanerAndActions);
    });

    // 确保 body 存在后再开始监视
    const waitForBody = setInterval(() => {
        if (document.body) {
            clearInterval(waitForBody);
            runCleanerAndActions(); // 立即执行一次
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }, 100);

})();