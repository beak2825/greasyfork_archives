// ==UserScript==
// @name         Steam 格式助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在Steam游戏/讨论组中添加格式帮助工具。支持拖拽定位、边缘检测和动画，防止UI冲突。
// @author       Your name
// @match        https://store.steampowered.com/app/*
// @match        https://steamcommunity.com/app/*/discussions/*
// @match        https://steamcommunity.com/discussions/*
// @match        https://steamcommunity.com/groups/*/discussions/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/542476/Steam%20%E6%A0%BC%E5%BC%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542476/Steam%20%E6%A0%BC%E5%BC%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前页面是否是指定类型的讨论页面
    function isDiscussionsPage() {
        const path = window.location.pathname;
        return path.includes('/discussions/') &&
               (path.includes('/app/') ||
                path.startsWith('/discussions/') ||
                path.includes('/groups/'));
    }

    // 检查当前页面是否是游戏商店页面
    function isGameStorePage() {
        return window.location.href.match(/https:\/\/store\.steampowered\.com\/app\/\d+/);
    }

    if (!isGameStorePage() && !isDiscussionsPage()) {
        return;
    }

    // 添加自定义样式
    GM_addStyle(`
        #formatHelperBtn {
            position: fixed; /* 改为fixed以支持拖拽定位 */
            z-index: 10000;
            background: linear-gradient( to bottom, #a4d007 5%, #536904 95%);
            color: #e5e4dc;
            border: none;
            border-radius: 2px;
            height: 28px;
            padding: 0 15px;
            font-size: 12px;
            font-family: "Motiva Sans", Arial, sans-serif;
            font-weight: normal;
            text-transform: none;
            text-shadow: 1px 1px 0px rgb(0 0 0 / 30%);
            cursor: grab; /* 初始光标为抓取手势 */
            display: flex;
            align-items: center;
            justify-content: center;
            transition: box-shadow 0.2s ease;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            user-select: none; /* 防止拖拽时选中文字 */
        }

        #formatHelperBtn:hover {
            background: linear-gradient( to bottom, #b6d908 5%, #7a8b05 95%);
        }

        #formatHelperBtn:active {
            cursor: grabbing;
        }

        #formatHelperMenu {
            position: fixed; /* 改为fixed以支持动态定位 */
            width: 280px;
            background: #1b2838;
            border-radius: 3px;
            box-shadow: 0 0 12px #000000;
            z-index: 9999;
            overflow: hidden;
            border: 1px solid #000;
            /* === 动画与可见性 === */
            transition: opacity 0.2s ease, transform 0.2s ease;
            opacity: 0;
            transform: translateY(10px);
            pointer-events: none;
        }

        #formatHelperMenu.visible {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }

        .format-section {
            padding: 10px;
            border-bottom: 1px solid #2a3f5a;
        }
        .format-section:last-child {
            border-bottom: none;
        }

        .format-section-title {
            color: #67c1f5; font-weight: bold; margin-bottom: 8px; cursor: pointer;
            display: flex; justify-content: space-between; align-items: center;
            font-family: "Motiva Sans", Arial, sans-serif; font-size: 14px;
        }

        .format-section-content {
            display: none; flex-direction: column; gap: 5px;
        }

        .format-section.expanded .format-section-content {
            display: flex;
        }

        .format-option {
            padding: 8px; background: #2a3f5a; border-radius: 2px;
            color: #c6d4df; cursor: pointer; transition: all 0.2s;
            display: flex; align-items: center; gap: 8px;
            position: relative; overflow: hidden; font-family: Arial, sans-serif;
            font-size: 13px; border: 1px solid transparent;
        }

        .format-option:hover {
            background: #3d5775; border: 1px solid #6d8ba5;
        }

        .format-option-preview { flex-grow: 1; }

        .copy-feedback {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(103, 193, 245, 0.9); display: flex;
            align-items: center; justify-content: center; opacity: 0;
            transition: opacity 0.3s; color: white; font-weight: bold;
            font-size: 12px; pointer-events: none;
        }

        .copy-feedback.show { opacity: 1; }

        /* --- 预览样式 --- */
        .preview-h1 { font-size: 18px; font-weight: bold; color: #ffffff; font-family: "Motiva Sans", Arial, sans-serif; }
        .preview-h2 { font-size: 16px; font-weight: bold; color: #ffffff; font-family: "Motiva Sans", Arial, sans-serif; }
        .preview-h3 { font-size: 14px; font-weight: bold; color: #ffffff; font-family: "Motiva Sans", Arial, sans-serif; }
        .preview-bold { font-weight: bold; color: #ffffff; }
        .preview-underline { text-decoration: underline; color: #ffffff; }
        .preview-italic { font-style: italic; color: #ffffff; }
        .preview-strike { text-decoration: line-through; color: #ffffff; }
        .preview-spoiler { background: #000000; color: #000000; padding: 0 2px; }
        .preview-spoiler:hover { color: #ffffff; }
        .preview-link { color: #67c1f5; text-decoration: underline; }
        .preview-list-item { display: flex; align-items: center; gap: 5px; }
        .preview-list-bullet { display: inline-block; width: 5px; height: 5px; background: white; border-radius: 50%; }
        .preview-nlist-item { display: flex; align-items: center; gap: 5px; }
        .preview-quote { background: #2a3f5a; border-left: 3px solid #67c1f5; padding: 5px 8px; color: #c6d4df; }
        .preview-code { font-family: monospace; background: #2a3f5a; padding: 2px 4px; border-radius: 3px; color: #ffffff; }
    `);

    // 格式选项配置 (与v1.2相同)
    const formatOptions = [
        {
            title: "标题",
            options: [
                { name: "一级标题", format: "[h1]请输入标题文字[/h1]", preview: '<span class="preview-h1">一级标题</span>' },
                { name: "二级标题", format: "[h2]请输入标题文字[/h2]", preview: '<span class="preview-h2">二级标题</span>' },
                { name: "三级标题", format: "[h3]请输入标题文字[/h3]", preview: '<span class="preview-h3">三级标题</span>' }
            ]
        },
        {
            title: "文本样式",
            options: [
                { name: "粗体", format: "[b]请输入粗体文本[/b]", preview: '<span class="preview-bold">粗体文本</span>' },
                { name: "下划线", format: "[u]请输入下划线文本[/u]", preview: '<span class="preview-underline">下划线文本</span>' },
                { name: "斜体", format: "[i]请输入斜体文本[/i]", preview: '<span class="preview-italic">斜体文本</span>' },
                { name: "删除线", format: "[strike]请输入删除文本[/strike]", preview: '<span class="preview-strike">删除线文本</span>' },
                { name: "剧透", format: "[spoiler]请输入隐藏文本[/spoiler]", preview: '<span class="preview-spoiler">剧透(隐藏)文本</span>' }
            ]
        },
        {
            title: "列表",
            options: [
                { name: "无序列表", format: "[list]\n[*] 项目符号列表\n[*] 项目符号列表\n[/list]", preview: '<div class="preview-list-item"><span class="preview-list-bullet"></span><span>项目符号列表</span></div>' },
                { name: "有序列表", format: "[olist]\n[*] 有序列表\n[*] 有序列表\n[/olist]", preview: '<div class="preview-nlist-item"><span>1.</span><span>有序列表</span></div>' }
            ]
        },
        {
            title: "其他元素",
            options: [
                { name: "链接", format: "[url=请输入链接地址]请输入网站名称[/url]", preview: '<span class="preview-link">网站链接</span>' },
                { name: "引用", format: "[quote=请输入引用来源]请输入引用文本[/quote]", preview: '<div class="preview-quote">引用文本</div>' },
                { name: "代码", format: "[code]请输入代码或等宽文本[/code]", preview: '<span class="preview-code">等宽字体，保留空格</span>' }
            ]
        }
    ];

    /**
     * 更新菜单位置，实现边缘检测
     * @param {HTMLElement} btn - 按钮元素
     * @param {HTMLElement} menu - 菜单元素
     */
    function updateMenuPosition(btn, menu) {
        const btnRect = btn.getBoundingClientRect();
        const menuHeight = menu.offsetHeight;
        const menuWidth = menu.offsetWidth;
        const gap = 10; // 按钮和菜单间的距离

        let top, left;

        // 优先在按钮上方显示
        if (btnRect.top > menuHeight + gap) {
            top = btnRect.top - menuHeight - gap;
        } else {
            // 上方空间不足，则在下方显示
            top = btnRect.bottom + gap;
        }

        // 水平方向上，尽量让菜单右侧与按钮右侧对齐
        left = btnRect.right - menuWidth;

        // 边缘检测：防止菜单超出屏幕左右边界
        if (left < gap) {
            left = gap;
        }
        if (left + menuWidth > window.innerWidth - gap) {
            left = window.innerWidth - menuWidth - gap;
        }

        menu.style.top = `${top}px`;
        menu.style.left = `${left}px`;
    }

    /**
     * 使元素可拖拽并记忆位置
     * @param {HTMLElement} btn - 要拖拽的按钮元素
     */
    function makeDraggable(btn) {
        // 读取保存的位置
        const savedPos = GM_getValue('formatHelperBtnPos');
        if (savedPos) {
            btn.style.top = savedPos.top;
            btn.style.left = savedPos.left;
        } else {
            // 默认初始位置
            btn.style.bottom = '20px';
            btn.style.right = '20px';
        }

        let isDragging = false;
        let wasDragged = false;
        let offsetX, offsetY;

        btn.addEventListener('mousedown', (e) => {
            isDragging = true;
            wasDragged = false;
            // 如果是绝对定位，需要转换
            btn.style.right = 'auto';
            btn.style.bottom = 'auto';

            const rect = btn.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            wasDragged = true;

            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            // 限制在视窗内
            const rect = btn.getBoundingClientRect();
            if (newLeft < 0) newLeft = 0;
            if (newTop < 0) newTop = 0;
            if (newLeft + rect.width > window.innerWidth) newLeft = window.innerWidth - rect.width;
            if (newTop + rect.height > window.innerHeight) newTop = window.innerHeight - rect.height;

            btn.style.left = newLeft + 'px';
            btn.style.top = newTop + 'px';
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            if (wasDragged) {
                 // 保存最终位置
                GM_setValue('formatHelperBtnPos', {
                    top: btn.style.top,
                    left: btn.style.left
                });
            }
        }

        // 返回一个检查是否被拖拽的函数，用于区分点击和拖拽
        return () => wasDragged;
    }


    // 创建帮助按钮和菜单
    function createFormatHelper() {
        const btn = document.createElement('button');
        btn.id = 'formatHelperBtn';
        btn.textContent = '格式助手';

        const menu = document.createElement('div');
        menu.id = 'formatHelperMenu';

        // 填充菜单内容...
        formatOptions.forEach(section => {
            const sectionEl = document.createElement('div');
            sectionEl.className = 'format-section';

            const titleEl = document.createElement('div');
            titleEl.className = 'format-section-title';
            titleEl.textContent = section.title;
            titleEl.innerHTML += '<span>▼</span>';

            const contentEl = document.createElement('div');
            contentEl.className = 'format-section-content';

            section.options.forEach(option => {
                const optionEl = document.createElement('div');
                optionEl.className = 'format-option';
                optionEl.dataset.format = option.format;
                const feedbackEl = document.createElement('div');
                feedbackEl.className = 'copy-feedback';
                feedbackEl.textContent = '已复制!';
                optionEl.innerHTML = `<div class="format-option-preview">${option.preview}</div>`;
                optionEl.appendChild(feedbackEl);
                optionEl.addEventListener('click', () => {
                    GM_setClipboard(option.format, 'text');
                    feedbackEl.classList.add('show');
                    setTimeout(() => feedbackEl.classList.remove('show'), 1000);
                });
                contentEl.appendChild(optionEl);
            });

            titleEl.addEventListener('click', () => {
                const isExpanded = sectionEl.classList.toggle('expanded');
                titleEl.querySelector('span').textContent = isExpanded ? '▲' : '▼';
            });

            sectionEl.appendChild(titleEl);
            sectionEl.appendChild(contentEl);
            menu.appendChild(sectionEl);
        });

        document.body.appendChild(btn);
        document.body.appendChild(menu);

        const wasDraggedCheck = makeDraggable(btn);

        btn.addEventListener('click', (e) => {
            if (wasDraggedCheck()) return; // 如果是拖拽结束，则不触发点击

            e.stopPropagation();
            const isVisible = menu.classList.contains('visible');

            if (!isVisible) {
                updateMenuPosition(btn, menu); // 显示前更新位置
                menu.classList.add('visible');
                // 默认展开第一个分类
                if (!menu.querySelector('.expanded')) {
                    const firstSection = menu.querySelector('.format-section');
                    if (firstSection) {
                        firstSection.classList.add('expanded');
                        firstSection.querySelector('.format-section-title span').textContent = '▲';
                    }
                }
            } else {
                menu.classList.remove('visible');
            }
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.classList.remove('visible');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFormatHelper);
    } else {
        createFormatHelper();
    }
})();