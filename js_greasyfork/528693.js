// ==UserScript==
// @name         搜书小组(404吧)-刘备小说版块 帖子过滤器
// @namespace    https://greasyfork.org/zh-CN/users/1441970-%E5%8D%97%E7%AB%B9
// @version      1.3
// @description  通过编辑脚本代码管理黑/白名单。增加过滤历史窗口（Ctrl+Shift+Q 或右下角按钮触发）。优化观察器性能。
// @author       南竹 & AI
// @match        https://404ku.com/forum-*-*
// @match        https://404ku.com/forum-*-*.html
// @match        https://404ku.com/forum.php?mod=forumdisplay&fid=*
// @match        https://404zu.org/forum-*-*
// @match        https://404zu.org/forum-*-*.html
// @match        https://404zu.org/forum.php?mod=forumdisplay&fid=*
// @match        https://404zu.net/forum-*-*
// @match        https://404zu.net/forum-*-*.html
// @match        https://404zu.net/forum.php?mod=forumdisplay&fid=*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528693/%E6%90%9C%E4%B9%A6%E5%B0%8F%E7%BB%84%28404%E5%90%A7%29-%E5%88%98%E5%A4%87%E5%B0%8F%E8%AF%B4%E7%89%88%E5%9D%97%20%E5%B8%96%E5%AD%90%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528693/%E6%90%9C%E4%B9%A6%E5%B0%8F%E7%BB%84%28404%E5%90%A7%29-%E5%88%98%E5%A4%87%E5%B0%8F%E8%AF%B4%E7%89%88%E5%9D%97%20%E5%B8%96%E5%AD%90%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======================
    // Globals & History Storage
    // ======================
    let blockedTitles = new Set();
    let whitelistedTitles = new Set();
    let floatingWindow = null;

    // ======================
    // User Configuration
    // ======================
    const BLACKLIST = [
        // 3个字及以下
        "NTR", "绿母", "绿妈", "媚黑", "扶她", "扶他", "肥猪", "扶他", "绿帽", "绿文",
        "黑人", "黑鬼", "倪哥", "尼哥", "绿黑", "媚黑", "改绿", "绿改", "加绿", "深绿", "纯绿",
        "公用", "绿奴", "黑爹", "美人篇", "浴房篇", "轮奸", "黑奴", "黑绿", "轮姦",

        // 4个字
        "夜色皇后", "玩我妻女", "救母？弑母", "逆子难防",
        "洋人小鬼", "我种的因，女", "册母为后2", "待修改关键词",

        // 5个字
        "母一去兮不复还", "母蚀：我无能为力", "议员长妈妈被", "她们被灌到怀孕", "世子之我家娘子们",
        "我家娘子们为了", "做韵律操的妈妈",

        // 6个字
        "绿爱之高贵美艳", "17岁的种马体育生", "克鲁鲁，被背刺的", "我的肉感妹妹被别人",
        "神雕后记之龙女奶荒", "《我家娘子们为了", "救今州的英雄漂泊者才", "爱妻小薇智斗恶棍1-2",
        "妈妈和表弟的蛛丝马迹",

        // 7个字及以上
        "间谍过家家：处女", "高冷的丝袜女总裁妈妈被混", "我的武林大侠母亲和冷艳", "被同事邀请 开始尝试",
        "《艳母调教房》高h 重口 绿", "闭关千年，我的娇媚妻子", "两个公公轮流调教儿媳",

        //待新增替换
        "我把美艳的妻子亲手", "老婆在我安排下的开发真实经历", "我和老婆的三人生活", "爱妻终于屈服在", "我的未亡人宗师师娘",
        "冷艳高挑教师妈妈", "KTV妻子被当做妓女", "我的仙子美母", "妻孝", "被调教成肉玩具的女友",
        "冷艳巨乳美母被", "善良老师妈妈被", "男娘", "伪娘", "未婚妻與兒女們",
        "绿在丧尸", "美母清衍静的堕落", "册母为后", "我爱淫妻雅雯", "妈妈被霸凌我的同学",
        "妈妈，去哪了？", "绿如潮水将你我包围", "从青梅女友到完美淫妻的故事", "绿意渐浓", "被染绿的幸福",
        "我的绿主系统", "被混混同学调教", "我那貌美如花的教师", "黑欲", "青梅绿事",
        "被全班男生狂插小淫穴", "全校男生都想插我的淫穴","妻子们的绿色爱情", "我和我的清纯老婆被","妈妈为了我的未来主动", "被校霸调教",
        "我帮仇敌","作者：皇箫", "绿如潮水将","作者：郡主","偷看母亲偷情系列", "我成了妻子与父亲的月老","我的妻子和父亲周雯","红粉佳人", "花盈纪",
        "作者：喵喵大人","我那绝美旗袍学姐", "妈妈的丰腴被同","待替换关键词","待替换关键词", "待替换关键词","待替换关键词","待替换关键词", "待替换关键词",
        "待替换关键词","待替换关键词", "待替换关键词","待替换关键词","待替换关键词", "待替换关键词","待替换关键词","待替换关键词", "待替换关键词",
        "待替换关键词","待替换关键词", "待替换关键词","待替换关键词","待替换关键词", "待替换关键词","待替换关键词","待替换关键词", "待替换关键词",
        // ... 可继续添加 ...
    ];
    const WHITELIST = [
        '无绿', '绿改纯', '非绿文', '绿改纯', '纯绿不两立', '全处', '纯爱版', '纯爱修改版'
                    , '改纯爱', '修改者：Kars', '纯爱', '自定义关键词', '自定义关键词'
                    , '自定义关键词', '自定义关键词', '自定义关键词', '自定义关键词', '自定义关键词'
        // ... 可继续添加 ...
    ];

    // ======================
    // Core Filtering Logic
    // ======================
    function getFilterStatus(title) {
        if (!title) return { action: 'none', reason: 'No title' };
        const lowerTitle = title.toLowerCase();
        const hasBlack = BLACKLIST.some(kw => lowerTitle.includes(kw.toLowerCase()));
        const hasWhite = WHITELIST.some(kw => lowerTitle.includes(kw.toLowerCase()));
        if (hasBlack && !hasWhite) return { action: 'block', reason: 'Blacklisted' };
        if (hasWhite) return { action: 'whitelist', reason: 'Whitelisted' };
        return { action: 'none', reason: 'No match' };
    }

    function filterTopics(selector) {
        document.querySelectorAll(selector).forEach(a => {
            if (!a || !a.parentElement || !a.parentElement.parentElement) {
                // console.warn('Filter script: Skipping element due to missing parent structure.', a);
                return; // Skip if structure is unexpected
            }
            const title = a.getAttribute('tip') || a.innerText;
            const status = getFilterStatus(title);

            try { // Add try-catch around DOM modification for safety
                if (status.action === 'block') {
                    if (!blockedTitles.has(title)) {
                        blockedTitles.add(title);
                    }
                    // Double-check parent existence before removing
                    if (a.parentElement && a.parentElement.parentElement) {
                        a.parentElement.parentElement.remove();
                    }
                } else if (status.action === 'whitelist') {
                    if (!whitelistedTitles.has(title)) {
                        whitelistedTitles.add(title);
                    }
                }
            } catch (error) {
                console.error('Filter script: Error processing element:', error, a);
            }
        });

        // Update window content if it exists and is visible (after loop)
        if (floatingWindow && floatingWindow.window.style.display === 'block') {
            floatingWindow.update();
        }
    }

    // ======================
    // Floating Window Functionality
    // ======================
    function createFloatingWindow() {
        var win = document.createElement('div');
        win.id = 'filter-history-window'; // Give window an ID
        win.style.cssText = `
            position: fixed; top: 10px; right: 10px; width: 10cm; height: 10cm;
            background: white; border: 1px solid #ccc; box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 9999; padding: 0; /* Remove padding, apply to inner elements */
            resize: both; overflow: hidden; /* Change overflow to hidden, content div will scroll */
            display: none; font-family: sans-serif; font-size: 13px;
        `;

        var header = document.createElement('div');
        header.style.cssText = `
            display: flex; justify-content: space-between; align-items: center;
            padding: 5px 10px; background-color: #f1f1f1; cursor: move; border-bottom: 1px solid #ccc;
        `;

        var titleText = document.createElement('span');
        titleText.textContent = '过滤历史';
        titleText.style.fontWeight = 'bold';

        var shortcutInfo = document.createElement('span');
        shortcutInfo.textContent = '(Ctrl+Shift+Q)';
        shortcutInfo.style.fontSize = '11px';
        shortcutInfo.style.marginLeft = '8px';
        shortcutInfo.style.color = '#555';

        var headerLeft = document.createElement('div');
        headerLeft.appendChild(titleText);
        headerLeft.appendChild(shortcutInfo);

        var closeBtn = document.createElement('button');
        closeBtn.textContent = '×'; // Use multiplication sign for close
        closeBtn.title = '关闭窗口';
        closeBtn.style.cssText = `
            padding: 0 8px; font-size: 16px; cursor: pointer; border: none;
            background: transparent; color: #666; font-weight: bold;
        `;
        closeBtn.onmouseover = () => closeBtn.style.color = '#000';
        closeBtn.onmouseout = () => closeBtn.style.color = '#666';
        closeBtn.onclick = function(e) {
            e.stopPropagation(); // Prevent triggering drag
            win.style.display = 'none';
        };

        header.appendChild(headerLeft);
        header.appendChild(closeBtn);

        var content = document.createElement('div');
        content.style.cssText = `
             padding: 10px; height: calc(100% - 31px); /* Adjust height based on header */
             overflow-y: auto; box-sizing: border-box;
        `;

        function updateContent() {
            content.innerHTML = `
                <strong style="display: block; margin-bottom: 5px;">被黑名单屏蔽 (${blockedTitles.size}):</strong>
                <div style="max-height: 40%; overflow-y: auto; border: 1px solid #eee; padding: 5px; margin-bottom: 10px; background: #fff8f8;">
                ${blockedTitles.size > 0 ? Array.from(blockedTitles).map(t => `&bull; ${t}`).join('<br>') : '<i>无</i>'}
                </div>
                <strong style="display: block; margin-bottom: 5px;">被白名单保护 (${whitelistedTitles.size}):</strong>
                 <div style="max-height: 40%; overflow-y: auto; border: 1px solid #eee; padding: 5px; background: #f8fff8;">
                ${whitelistedTitles.size > 0 ? Array.from(whitelistedTitles).map(t => `&bull; ${t}`).join('<br>') : '<i>无</i>'}
                 </div>
            `;
        }

        win.appendChild(header);
        win.appendChild(content);
        document.body.appendChild(win);
        updateContent(); // Initial content fill

        // Drag functionality
        let isDragging = false;
        let offsetX, offsetY;
        header.onmousedown = function(e) {
            if (e.target === closeBtn) return; // Don't drag if clicking close button
            isDragging = true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
            header.style.cursor = 'grabbing';
            win.style.userSelect = 'none'; // Prevent text selection during drag
            e.preventDefault();
        };
        document.onmousemove = function(e) {
            if (isDragging) {
                win.style.left = Math.max(0, e.clientX - offsetX) + 'px'; // Keep window within viewport horizontally
                win.style.top = Math.max(0, e.clientY - offsetY) + 'px'; // Keep window within viewport vertically
            }
        };
        document.onmouseup = function() {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'move';
                win.style.userSelect = ''; // Restore text selection
            }
        };

        return {
            window: win,
            update: updateContent,
            toggle: function() {
                const isHidden = win.style.display === 'none';
                win.style.display = isHidden ? 'block' : 'none';
                if (isHidden) {
                   updateContent();
                }
            }
        };
    }

    function initWindow() {
        if (!floatingWindow) {
            try {
                floatingWindow = createFloatingWindow();
            } catch (error) {
                 console.error("Filter script: Failed to create floating window:", error);
            }
        }
    }

    function addTriggerButton() {
        // Check if button already exists
        if (document.getElementById('filter-trigger-container')) return;

        var btnContainer = document.createElement('div');
        btnContainer.id = 'filter-trigger-container';
        btnContainer.style.cssText = `
            position: fixed; bottom: 10px; right: 10px; z-index: 9998;
            display: flex; align-items: center;
        `;

        var btn = document.createElement('button');
        btn.textContent = '过滤窗口';
        btn.title = '显示/隐藏过滤历史 (Ctrl+Shift+Q)';
        btn.style.cssText = `
            padding: 3px 8px; background: rgba(0, 120, 215, 0.5); color: white;
            border: none; border-radius: 3px; cursor: pointer; font-size: 12px;
            transition: background-color 0.2s;
        `;
        btn.onmouseover = () => btn.style.background = 'rgba(0, 120, 215, 0.8)';
        btn.onmouseout = () => btn.style.background = 'rgba(0, 120, 215, 0.5)';
        btn.onclick = function() {
            initWindow(); // Ensure window exists
            if (floatingWindow) { // Check if window creation succeeded
               floatingWindow.toggle();
            } else {
               console.error("Filter script: Window not available to toggle.");
               alert("过滤窗口初始化失败，请检查浏览器控制台获取更多信息。");
            }
        };

        var closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.title = '隐藏此按钮';
        closeBtn.style.cssText = `
            margin-left: 5px; padding: 3px 6px; background: rgba(255, 0, 0, 0.5);
            color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;
            transition: background-color 0.2s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255, 0, 0, 0.8)';
        closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(255, 0, 0, 0.5)';
        closeBtn.onclick = function() {
            btnContainer.remove(); // Use remove() instead of display:none
        };

        btnContainer.appendChild(btn);
        btnContainer.appendChild(closeBtn);
        document.body.appendChild(btnContainer);
    }

    // ======================
    // Initialization & Execution
    // ======================
    const SELECTORS = [
        'a[href^="thread-"]',
        'a[href^="forum.php?mod=redirect&tid="]',
        'a[href^="forum.php?mod=viewthread&tid="]',
        'a.s.xst'
    ];

    // Initial filtering run
    try {
        SELECTORS.forEach(selector => filterTopics(selector));
    } catch(e) {
        console.error("Filter script: Error during initial filtering:", e);
    }


    // *** Optimized MutationObserver Setup ***
    const observerCallback = (mutationsList) => {
        // Optimization: Check if the added/removed nodes actually contain relevant links
        // This adds complexity, so for now, we'll re-run filtering on any relevant mutation.
        // console.log("Mutation detected, re-filtering...");
        try {
            SELECTORS.forEach(selector => filterTopics(selector));
        } catch(e) {
             console.error("Filter script: Error during filtering after mutation:", e);
        }

    };

    // Try to observe a more specific container first
    const primaryTargetNode = document.querySelector('#ct'); // Common content wrapper ID in Discuz!
    const observerOptions = { childList: true, subtree: false }; // Observe only direct children additions/removals

    let observerAttached = false;
    if (primaryTargetNode) {
        try {
            const observer = new MutationObserver(observerCallback);
            observer.observe(primaryTargetNode, observerOptions);
            observerAttached = true;
            // console.log("Filter script: Observer attached to #ct with childList focus.");
        } catch (e) {
             console.error("Filter script: Error attaching observer to #ct:", e);
        }
    }

    // Fallback to observing body if primary target fails or doesn't exist
    if (!observerAttached) {
        console.warn("Filter script: Primary target #ct not found or observer failed. Falling back to observing document.body (subtree: true). This might impact performance.");
        try {
            const fallbackObserver = new MutationObserver(observerCallback);
            fallbackObserver.observe(document.body, { childList: true, subtree: true }); // Original broad observer
        } catch (e) {
            console.error("Filter script: Error attaching fallback observer to document.body:", e);
        }
    }

    // Shortcut key listener
    window.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'q') {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling further
            initWindow();
            if (floatingWindow) {
               floatingWindow.toggle();
            } else {
                 console.error("Filter script: Window not available for shortcut toggle.");
            }
        }
    }, true); // Use capture phase

    // Add trigger button on load
    // Use 'DOMContentLoaded' for potentially faster button appearance
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addTriggerButton);
    } else {
        addTriggerButton(); // Already loaded
    }

})();