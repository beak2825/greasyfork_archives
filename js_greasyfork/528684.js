// ==UserScript==
// @name         尚香书苑-主页 帖子过滤器
// @namespace    https://greasyfork.org/zh-CN/users/1441970-%E5%8D%97%E7%AB%B9
// @version      1.2
// @description  通过关键词屏蔽主页帖子，支持白名单功能，并通过Ctrl+Shift+E快捷键或点击右下方按钮显示过滤历史窗口（显示当前页面上屏蔽和保护的帖子列表）
// @author       南竹
// @match        https://sxsy21.com/*
// @match        https://sxsy122.com/*
// @match        https://sxsy19.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528684/%E5%B0%9A%E9%A6%99%E4%B9%A6%E8%8B%91-%E4%B8%BB%E9%A1%B5%20%E5%B8%96%E5%AD%90%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528684/%E5%B0%9A%E9%A6%99%E4%B9%A6%E8%8B%91-%E4%B8%BB%E9%A1%B5%20%E5%B8%96%E5%AD%90%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 关键词列表（黑名单）
    const KEYWORDS = [
        // 3个字及以下
        "NTR", "绿母", "绿妈", "媚黑", "扶她", "扶他", "肥猪", "扶他", "绿帽", "绿文",
        "黑人", "黑鬼", "倪哥", "绿黑", "媚黑", "改绿", "绿改", "加绿", "深绿", "纯绿",
        "公用", "绿奴", "黑爹", "美人篇", "浴房篇", "轮奸", "黑奴", "黑绿",

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
        "冷艳高挑教师妈妈", "待替换", "待替换关键词", "待替换关键词", "待替换关键词",
        "待替换关键词", "待替换关键词", "待替换关键词", "待替换关键词", "待替换关键词"
    ];

    // 白名单关键词
    const WHITELIST = ['无绿', '绿改纯', '非绿文', '纯绿不两立'];

    // 存储屏蔽和白名单保护的帖子标题（使用 Set 去重）
    let blockedTitles = new Set();
    let whitelistedTitles = new Set();

    // 过滤函数
    function filterTitles() {
        document.querySelectorAll('ul.category_newlist li a').forEach(titleLink => {
            // 获取完整标题，从 tip 属性中提取 <strong> 标签内的内容
            const tip = titleLink.getAttribute('tip');
            let fullTitle = '';
            if (tip) {
                const match = tip.match(/<strong>(.*?)<\/strong>/);
                fullTitle = match ? match[1] : '';
            }
            // 如果没有完整标题，则回退到显示的标题
            const text = (fullTitle || titleLink.textContent).toLowerCase();
            const li = titleLink.closest('li');

            // 跳过已隐藏的元素
            if (li.style.display === 'none') return;

            // 检查白名单
            const isWhitelisted = WHITELIST.some(wl => text.includes(wl.toLowerCase()));
            if (isWhitelisted) {
                if (!whitelistedTitles.has(fullTitle || titleLink.textContent)) {
                    console.log('Whitelisted: ' + titleLink.href + ' [' + (fullTitle || titleLink.textContent) + ']');
                    whitelistedTitles.add(fullTitle || titleLink.textContent);
                }
                return; // 跳过屏蔽检查
            }

            // 检查黑名单
            if (KEYWORDS.some(kw => text.includes(kw.toLowerCase()))) {
                if (!blockedTitles.has(fullTitle || titleLink.textContent)) {
                    console.log('Removed: ' + titleLink.href + ' [' + (fullTitle || titleLink.textContent) + ']');
                    blockedTitles.add(fullTitle || titleLink.textContent);
                }
                li.style.display = 'none';
            }
        });
    }

    // 初始执行 + 监听动态加载
    filterTitles();
    new MutationObserver(filterTitles).observe(document.body, { childList: true, subtree: true });

    // 创建浮动窗口
    function createFloatingWindow() {
        var win = document.createElement('div');
        win.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 10cm;
            height: 10cm;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 9999;
            padding: 10px;
            resize: both;
            overflow: auto;
            display: none;
        `;

        var header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 10px;';

        var shortcutInput = document.createElement('input');
        shortcutInput.type = 'text';
        shortcutInput.placeholder = 'Ctrl+Shift+E (默认)';
        shortcutInput.style.width = '100px';
        shortcutInput.disabled = true;

        var closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.onclick = function() {
            win.style.display = 'none';
            console.log('Floating window closed');
        };

        header.appendChild(shortcutInput);
        header.appendChild(closeBtn);

        var content = document.createElement('div');
        content.style.cssText = 'max-height: calc(100% - 40px); overflow-y: auto;';

        function updateContent() {
            content.innerHTML = `
                <strong>当前被黑名单屏蔽的帖子：</strong><br>
                ${Array.from(blockedTitles).map(t => `《${t}》`).join('<br>') || '无'}<br><br>
                <strong>当前被白名单保护的帖子：</strong><br>
                ${Array.from(whitelistedTitles).map(t => `《${t}》`).join('<br>') || '无'}
            `;
        }

        win.appendChild(header);
        win.appendChild(content);
        document.body.appendChild(win);
        updateContent();

        return { window: win, update: updateContent, toggle: function() {
            win.style.display = win.style.display === 'none' ? 'block' : 'none';
        }};
    }

    // 初始化窗口并绑定触发
    var floatingWindow = null;
    function initWindow() {
        if (!floatingWindow) {
            floatingWindow = createFloatingWindow();
            console.log('Floating window initialized');
        }
    }

    // 快捷键 Ctrl+Shift+E
    window.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
            e.preventDefault();
            console.log('Ctrl+Shift+E pressed');
            initWindow();
            floatingWindow.toggle();
            floatingWindow.update();
        }
    }, true);

    // 添加备用触发按钮
    function addTriggerButton() {
        var btnContainer = document.createElement('div');
        btnContainer.style.cssText = `
            position: fixed;
            bottom: 35px;
            right: 10px;
            z-index: 9999;
            display: flex;
            align-items: center;
        `;

        var btn = document.createElement('button');
        btn.textContent = '过滤窗口（主页）';
        btn.style.cssText = `
            padding: 2px 6px;
            background: rgba(0, 120, 215, 0.5); /* 蓝色，50%透明度 */
            color: white; /* 白色字体 */
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
        `;
        btn.onclick = function() {
            console.log('Button clicked to toggle window');
            initWindow();
            floatingWindow.toggle();
            floatingWindow.update();
        };

        var closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.style.cssText = `
            margin-left: 5px;
            padding: 2px 6px;
            background: rgba(255, 0, 0, 0.5);
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
        `;
        closeBtn.onclick = function() {
            btnContainer.style.display = 'none';
            console.log('Trigger button closed');
        };

        btnContainer.appendChild(btn);
        btnContainer.appendChild(closeBtn);
        document.body.appendChild(btnContainer);
    }

    // 页面加载后添加按钮
    window.addEventListener('load', function() {
        console.log('Page loaded, script initialized');
        addTriggerButton();
    });
})();