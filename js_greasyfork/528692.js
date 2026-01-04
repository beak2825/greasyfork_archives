// ==UserScript==
// @name         搜书小组(404吧)-主页 帖子过滤器
// @namespace    https://greasyfork.org/zh-CN/users/1441970-%E5%8D%97%E7%AB%B9
// @version      1.4
// @description  通过编辑代码管理黑/白名单，并通过Ctrl+Shift+E快捷键或点击右下方按钮显示过滤历史窗口（显示当前页面上屏蔽和保护的帖子列表）
// @author       南竹 & AI Assistant
// @match        https://404ku.com/*
// @match        https://404zu.org/*
// @match        https://404zu.net/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528692/%E6%90%9C%E4%B9%A6%E5%B0%8F%E7%BB%84%28404%E5%90%A7%29-%E4%B8%BB%E9%A1%B5%20%E5%B8%96%E5%AD%90%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528692/%E6%90%9C%E4%B9%A6%E5%B0%8F%E7%BB%84%28404%E5%90%A7%29-%E4%B8%BB%E9%A1%B5%20%E5%B8%96%E5%AD%90%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======================================
    // 用户配置区 (直接修改以下数组)
    // ======================================

    // 黑名单：包含这些词的帖子将被隐藏
    const BLACKLIST = [
        // 3个字及以下
        "NTR", "绿母", "绿妈", "媚黑", "扶她", "扶他", "肥猪", "扶他", "绿帽", "绿文",
        "黑人", "黑鬼", "倪哥", "尼哥", "绿黑", "媚黑", "改绿", "绿改", "加绿", "深绿", "纯绿",
        "公用", "绿奴", "黑爹", "美人篇", "浴房篇", "轮奸", "黑奴", "黑绿", "轮姦", "伪娘",

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
        "作者：喵喵大人","我那绝美旗袍学姐", "妈妈的丰腴被同","反差美母的丝袜","换母淫谋：我和死党调教警花美母", "为了避免变成阳痿男将深爱","待替换关键词","待替换关键词", "待替换关键词",
        "待替换关键词","待替换关键词", "待替换关键词","待替换关键词","待替换关键词", "待替换关键词","待替换关键词","待替换关键词", "待替换关键词",
        "待替换关键词","待替换关键词", "待替换关键词","待替换关键词","待替换关键词", "待替换关键词","待替换关键词","待替换关键词", "待替换关键词",
        // ... 可继续添加 ...
    ];

    // 白名单：包含这些词的帖子即使命中黑名单也会保留
    const WHITELIST = [
        '无绿', '绿改纯', '非绿文', '绿改纯', '纯绿不两立', '全处', '纯爱版', '纯爱修改版'
                    , '改纯爱', '修改者：Kars', '纯爱', '自定义关键词', '自定义关键词'
                    , '自定义关键词', '自定义关键词', '自定义关键词', '自定义关键词', '自定义关键词'
        // ... 可继续添加 ...
    ];

    // ======================================
    // 新增：存储过滤历史 (无需修改)
    // ======================================
    let blockedTitles = new Set();
    let whitelistedTitles = new Set();

    // ======================================
    // 核心过滤逻辑 (修改以记录历史)
    // ======================================

    function filterTitles() {
        document.querySelectorAll(`
            ul.category_newlist li a,
            .replaybox li a,
            .hottiebox li a,
            .goodtiebox li a
        `).forEach(titleLink => {
            const li = titleLink.closest('li');
            // 跳过已经被隐藏的元素，避免重复处理
            if (!li || li.style.display === 'none') return;

            // 优先使用 title 属性获取完整标题，如果不存在则用 textContent
            const tipAttr = titleLink.getAttribute('tip') || '';
            const match = tipAttr.match(/标题:\s*<strong>(.*?)<\/strong>/);
            const fullTitle = match ? match[1] : (titleLink.title || titleLink.textContent);

            const text = fullTitle.toLowerCase();

            const hasBlack = BLACKLIST.some(kw =>
                text.includes(kw.toLowerCase())
            );
            const hasWhite = WHITELIST.some(w =>
                text.includes(w.toLowerCase())
            );

            if (hasWhite) {
                // 白名单命中，记录并跳过屏蔽
                if (!whitelistedTitles.has(fullTitle)) {
                    console.log('Whitelisted (404): ' + titleLink.href + ' [' + fullTitle + ']');
                    whitelistedTitles.add(fullTitle);
                }
                return; // 保护该帖子，不进行后续黑名单检查
            }

            if (hasBlack) {
                // 黑名单命中且未被白名单保护，隐藏并记录
                if (!blockedTitles.has(fullTitle)) {
                    console.log('Blocked (404): ' + titleLink.href + ' [' + fullTitle + ']');
                    blockedTitles.add(fullTitle);
                }
                li.style.display = 'none';
            }
        });
        // 过滤后尝试更新窗口内容（如果窗口已创建）
        if (floatingWindow && floatingWindow.window.style.display !== 'none') {
            floatingWindow.update();
        }
    }

    // ======================================
    // 动态加载监听 (无需修改)
    // ======================================

    // 使用 MutationObserver 监听 DOM 变化，以处理动态加载的内容
    const observer = new MutationObserver((mutationsList) => {
        let changed = false;
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                changed = true;
                break; // 只要有节点添加就认为需要重新过滤
            }
        }
        if (changed) {
            // 延迟执行过滤，确保新内容渲染完成
            setTimeout(filterTitles, 300);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ======================================
    // 新增：浮动窗口相关代码 (从尚香书苑脚本移植)
    // ======================================
    var floatingWindow = null; // 存储窗口对象

    // 创建浮动窗口
    function createFloatingWindow() {
        var win = document.createElement('div');
        win.id = 'filter-history-window-404'; // 给个唯一ID避免冲突
        win.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 10cm; /* 保持与尚香一致 */
            height: 10cm; /* 保持与尚香一致 */
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 99999; /* 确保在顶层 */
            padding: 10px;
            resize: both; /* 允许调整大小 */
            overflow: auto; /* 内容过多时滚动 */
            display: none; /* 初始隐藏 */
            font-size: 12px; /* 统一字体大小 */
            line-height: 1.5; /* 改善可读性 */
        `;

        var header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #eee;';

        // 显示快捷键提示（保持一致，设为不可编辑）
        var shortcutInput = document.createElement('input');
        shortcutInput.type = 'text';
        shortcutInput.value = 'Ctrl+Shift+E';
        shortcutInput.placeholder = 'Ctrl+Shift+E';
        shortcutInput.style.cssText = 'width: 100px; font-size: 11px; border: 1px solid #ddd; padding: 2px 4px; background: #f8f8f8;';
        shortcutInput.disabled = true; // 不可编辑

        // 窗口标题
        var windowTitle = document.createElement('span');
        windowTitle.textContent = '过滤历史 (404吧)';
        windowTitle.style.fontWeight = 'bold';

        // 关闭按钮
        var closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = 'padding: 2px 8px; font-size: 11px; cursor: pointer;';
        closeBtn.onclick = function() {
            win.style.display = 'none';
            console.log('Floating window (404) closed');
        };

        header.appendChild(shortcutInput);
        header.appendChild(windowTitle);
        header.appendChild(closeBtn);

        // 内容区域
        var content = document.createElement('div');
        content.id = 'filter-history-content-404';
        content.style.cssText = 'max-height: calc(100% - 40px); overflow-y: auto;'; // 预留头部空间

        // 更新窗口内容的函数
        function updateContent() {
            // 移除这里的 filterTitles(); 调用，因为列表应该由初始加载和 MutationObserver 维护
            //  // <--- 移除或注释掉这一行

            // 直接使用当前 Set 中的数据更新 HTML
            content.innerHTML = `
                <strong style="color: #dc3545;">当前被黑名单屏蔽的帖子 (${blockedTitles.size} 条)：</strong><br>
                ${Array.from(blockedTitles).map(t => `《${t}》`).join('<br>') || '<span style="color: #999;">无</span>'}<br><br>
                <strong style="color: #28a745;">当前被白名单保护的帖子 (${whitelistedTitles.size} 条)：</strong><br>
                ${Array.from(whitelistedTitles).map(t => `《${t}》`).join('<br>') || '<span style="color: #999;">无</span>'}
            `;
            console.log('Floating window (404) content updated (without re-filtering).');
        }


        win.appendChild(header);
        win.appendChild(content);
        document.body.appendChild(win);
        updateContent(); // 初始填充一次内容

        return {
            window: win,
            update: updateContent,
            toggle: function() {
                const isHidden = win.style.display === 'none';
                win.style.display = isHidden ? 'block' : 'none';
                console.log(`Floating window (404) ${isHidden ? 'shown' : 'hidden'}`);
                if (isHidden) { // 如果是显示窗口，则更新内容
                    updateContent();
                }
            }
        };
    }

    // 初始化窗口（确保只创建一次）
    function initWindow() {
        if (!floatingWindow) {
            if (document.readyState === 'loading') {
                // 如果 DOM 未加载完成，则等待
                window.addEventListener('DOMContentLoaded', () => {
                    floatingWindow = createFloatingWindow();
                    console.log('Floating window (404) initialized after DOMContentLoaded.');
                });
            } else {
                // 如果 DOM 已加载，则直接创建
                floatingWindow = createFloatingWindow();
                console.log('Floating window (404) initialized immediately.');
            }
        }
    }

    // 添加快捷键监听 (Ctrl+Shift+E)
    window.addEventListener('keydown', function(e) {
        // 检查是否按下了 Ctrl, Shift 和 E 键 (不区分大小写)
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
            e.preventDefault(); // 阻止浏览器默认行为 (例如 Edge 的网页捕获)
            console.log('Ctrl+Shift+E pressed (404)');
            initWindow(); // 确保窗口已创建
            if(floatingWindow) { // 再次检查，防止异步问题
               floatingWindow.toggle();
            }
        }
    }, true); // 使用捕获阶段确保优先处理

    // 添加备用触发按钮（位于右下角）
    function addTriggerButton() {
        var btnContainer = document.createElement('div');
        btnContainer.id = 'filter-trigger-button-container-404'; // 给个唯一ID
        btnContainer.style.cssText = `
            position: fixed;
            bottom: 35px; /* 与尚香脚本位置保持一致 */
            right: 10px;
            z-index: 99998; /* 比窗口低一点 */
            display: flex;
            align-items: center;
        `;

        var btn = document.createElement('button');
        btn.textContent = '过滤窗口（主页）'; // 保持按钮文字一致
        btn.style.cssText = `
            padding: 2px 6px;
            background: rgba(0, 120, 215, 0.5); /* 保持与尚香一致的颜色和透明度 */
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px; /* 保持字体大小一致 */
        `;
        btn.onclick = function() {
            console.log('Button clicked to toggle window (404)');
            initWindow(); // 确保窗口已创建
             if(floatingWindow) { // 再次检查
               floatingWindow.toggle();
            }
        };

        // 添加关闭按钮 (用于隐藏触发按钮本身)
        var closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.style.cssText = `
            margin-left: 5px;
            padding: 2px 4px; /* 调整内边距使按钮更小 */
            background: rgba(255, 0, 0, 0.5); /* 红色，50%透明度 */
            color: white;
            border: none;
            border-radius: 50%; /* 圆形按钮 */
            cursor: pointer;
            font-size: 9px; /* 更小的字体 */
            line-height: 1; /* 确保文字垂直居中 */
            width: 16px; /* 固定宽度 */
            height: 16px; /* 固定高度 */
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        closeBtn.title = '隐藏此按钮'; // 添加提示
        closeBtn.onclick = function() {
            btnContainer.style.display = 'none';
            console.log('Trigger button (404) hidden');
        };

        btnContainer.appendChild(btn);
        btnContainer.appendChild(closeBtn);
        document.body.appendChild(btnContainer);
        console.log('Trigger button (404) added.');
    }

    // ======================================
    // 初始执行
    // ======================================
    // 不直接在 load 事件里执行 filterTitles，因为 MutationObserver 会处理
    // 在 load 事件里添加按钮
    window.addEventListener('load', () => {
        console.log('Page loaded, adding trigger button (404).');
        // 稍微延迟执行过滤，确保初始内容加载
        setTimeout(filterTitles, 1000);
        addTriggerButton(); // 添加右下角按钮
    });

})();
