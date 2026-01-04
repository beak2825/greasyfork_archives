// ==UserScript==
// @name         可能是更优雅的知乎网页版暗黑模式 - Zhihu Dark Mode
// @version      0.2.0
// @description  知乎网页版的暗黑模式就写了一半，我帮它尽量写完
// @author       ByronLeeeee
// @match        *://*.zhihu.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @namespace https://github.com/ByronLeeeee/Zhihu-Dark-Mode
// @downloadURL https://update.greasyfork.org/scripts/529357/%E5%8F%AF%E8%83%BD%E6%98%AF%E6%9B%B4%E4%BC%98%E9%9B%85%E7%9A%84%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E7%89%88%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%20-%20Zhihu%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/529357/%E5%8F%AF%E8%83%BD%E6%98%AF%E6%9B%B4%E4%BC%98%E9%9B%85%E7%9A%84%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E7%89%88%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%20-%20Zhihu%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检查用户保存的深色模式偏好
    const isDark = localStorage.getItem('zhihu-dark-mode') === 'true';

    // 在页面解析之前设置初始主题，避免白屏
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // 在页面解析前注入CSS样式
    const style = document.createElement('style');
    style.textContent = `
        /* 全局悬浮效果 */
        button:hover {
            opacity: 0.8;
            transform: scale(1.1);
            transition: all 0.2s ease;
        }

        /* --- 暗黑模式下的CSS变量 --- */
        html[data-theme="dark"] {
            /* 背景色 */
            --bg-primary: #1a1a1a;       /* 主要内容背景 */
            --bg-secondary: #2a2a2a;    /* 次要/编辑区背景 */
            --bg-code: #242424;         /* 代码块背景 */
            --bg-header: #191b1f;       /* 顶栏背景 */
            --bg-hover: #333333;        /* 悬浮背景 */
            --bg-card: #212121;         /* 卡片背景 */
            --bg-button: #2d2d2d;       /* 按钮背景 */
            --bg-tag: #3a3a3a;          /* 标签背景 */
            --bg-pure-black: #000000;   /* 纯黑背景 */

            /* 文本颜色 */
            --text-primary: #b0b0b0;    /* 主要文本 */
            --text-secondary: #999999;  /* 副文/注释 */
            --text-title: #d3d3d3;      /* 标题 */
            --text-highlight: #ffffff;  /* 高亮/突出文本 */
            --text-link: #86b8ff;       /* 超链接 */

            /* 边框颜色 */
            --border-primary: #404040;
            --border-secondary: #555555;
            --border-hover: #606060;

            /* 其他 */
            --icon-fill: #b0b0b0;
        }

        /* --- 按功能/组件应用变量 --- */

        /* 顶部导航栏 (banner) */
        [data-theme="dark"] .AppHeader,
        [data-theme="dark"] header[role="banner"],
        [data-theme="dark"] .ColumnPageHeader,
        [data-theme="dark"] .css-1ppjin3,
        [data-theme="dark"] .css-nbr1cj,
        [data-theme="dark"] .css-2lvw8d,
        [data-theme="dark"] .sgui-header {
            background-color: var(--bg-header) !important;
            border-bottom: 1px solid var(--border-primary) !important;
        }

        /* 导航栏内的文字和链接 */
        [data-theme="dark"] .Tabs-link {
            color: var(--text-primary) !important;
        }
        [data-theme="dark"] .Tabs-link.is-active {
            color: var(--text-highlight) !important;
        }

        /* 搜索框 */
        [data-theme="dark"] .SearchBar-input {
            background-color: var(--bg-hover) !important;
            color: var(--text-primary) !important;
            border: 1px solid var(--border-primary) !important;
        }

        /* 移除消息、私信、创作中心按钮的边框 */
        [data-theme="dark"] .AppHeader-notifications,
        [data-theme="dark"] .AppHeader-messages,
        [data-theme="dark"] .css-18vqx7l .Button {
            border: none !important;
            background-color: var(--bg-header) !important;
            color: var(--text-primary) !important;
        }

        /* 通用 SVG 图标颜色 */
        [data-theme="dark"] .ZDI,
        [data-theme="dark"] .css-133xqjo svg,
        [data-theme="dark"] .css-3470e2 svg,
        [data-theme="dark"] .css-wuse5b svg {
            fill: var(--icon-fill) !important;
        }

        /* logo 调整（反色以适应暗色背景） */
        [data-theme="dark"] .css-1hlrcxk {
            filter: brightness(0) invert(1) !important;
        }

        /* 用户头像边框 */
        [data-theme="dark"] .AppHeader-profileAvatar {
            border: 1px solid var(--border-primary) !important;
        }

        /* 主要标题文本 */
        [data-theme="dark"] h1,
        [data-theme="dark"] .ContentItem-title,
        [data-theme="dark"] .QuestionHeader-title,
        [data-theme="dark"] .LevelInfoV2-creatorInfo,
        [data-theme="dark"] .css-vurnku, .css-cnnstd, .css-180vb7x, .css-1fu8ne5, .css-1yn8tbw,
        [data-theme="dark"] .css-ac5rcx, .css-12kq1qx, .css-33pnco, .css-dpt3mb, .css-1brgq4x,
        [data-theme="dark"] .css-1yuw5jz, .css-1jrei64, .css-1czelnl {
            color: var(--text-title) !important;
        }

        /* 主要内容区域 (深色背景 + 浅色文字) */
        [data-theme="dark"] .css-nomdw0, .css-i9ss08, .css-1nr5ql7, .css-157mis2, .css-7hb6gj,
        [data-theme="dark"] .css-1mbpn2d, .css-1yjqd5z, .css-12lqyc0, .css-35pmty, .css-1t0dqk7,
        [data-theme="dark"] .css-1cr4989, .css-1357f6, .css-1ury69a, .css-looxkda, .Sticky,
        [data-theme="dark"] .css-xpmfhx, .css-3zr8ne, .CreationManage-CreationCard, .css-slqtjm,
        [data-theme="dark"] .css-1rniuv1, .Tabs, .css-k5im1d, .css-986uza, .css-1w24404, .css-xoei2t,
        [data-theme="dark"] .css-1m8gbjc, .css-1oqbvad, .css-1ta275q, .css-ndiv23, .css-1wof2n,
        [data-theme="dark"] .css-fqja0q, .css-114mqx8, .css-1iazx5e, .css-yckfye, .css-lztgnc,
        [data-theme="dark"] .Creator-salt-author-welfare, .Creator-salt-author-welfare-card,
        [data-theme="dark"] .CreatorSalt-personalInfo, .css-d1sc5t, .CreatorSalt-sideBar-wrapper,
        [data-theme="dark"] .css-19nug30, .css-h9kawn, .css-127i0sx, .WriteIndexLayout-main,
        [data-theme="dark"] .css-wmwsyx, .ListShortcut, .css-4jezjh, .css-10kzyet, .css-1byd3cx,
        [data-theme="darks"] .css-15k5nix, .css-15aftra, .css-kt4t4n, .css-1e7fksk, .css-70t8h2,
        [data-theme="dark"] .css-13445jb, .css-smf7y2, .css-h07o3w, .css-7tlwbh, .css-jtt4ph,
        [data-theme="dark"] .css-qf4x08, .css-1y416g7, .css-1p9otau, .css-qgxdhd, .css-16xfl53,
        [data-theme="dark"] .css-89btt1, .css-3wnwue, .css-1tny33p, .css-5fegde,
        [data-theme="dark"] table.css-our8ff, [data-theme="dark"] table.css-our8ff tr,
        [data-theme="dark"] table.css-our8ff td, [data-theme="dark"] table.css-our8ff th,
        [data-theme="dark"] .css-odpg9, [data-theme="dark"] .css-tl7t4z {
            background-color: var(--bg-primary) !important;
            color: var(--text-primary) !important;
        }

        /* 次要内容区域 (稍亮的背景) */
        [data-theme="dark"] .css-1so3nbl, .WriteIndex-titleInput, .EditorSnapshotWrapper,
        [data-theme="dark"] .css-13mrzb0, .css-qhzfje {
            background-color: var(--bg-secondary) !important;
        }

        /* 主要文本颜色 (无背景修改) */
        [data-theme="dark"] .css-sgbbgb, .Creator-QuestionShared-title, .css-1o7uqnr,
        [data-theme="dark"] .css-atxtl4, .css-qlj5ur, .css-1kq86bv, .css-z06s02, .css-1xvfl67,
        [data-theme="dark"] .css-1yijwry, .css-1rspjpf, .css-15box0, .css-urncze, .css-1k65ame,
        [data-theme="dark"] .css-g62hty, .css-rg9c67, .css-1oq372o, .css-141xy67, .css-vm9s9s,
        [data-theme="dark"] .css-68ooft, .css-1t3in1, .ToolsCopyright-FieldName,
        [data-theme="dark"] .Create-salt-author-complaint-page-content h2, .css-bjox9u,
        [data-theme="dark"] .css-1w0nc6z, .css-1k10w8f, .css-10u695f, .CommentContent,
        [data-theme="dark"] .css-19m36yt, .css-1yj4uzm, .css-1pmadmj, .css-rv8vcy,
        [data-theme="dark"] .css-1tvhjhb, .css-f3930v, .css-13awyku, .css-1f4cz9u,
        [data-theme="dark"] .css-r4op92, .css-1ptti3p, .css-m9wflr, .css-9rfw7f,
        [data-theme="dark"] .AuthorInfo-name, .css-1ggwcl9, .css-4uviby, .css-lmmx7rh,
        [data-theme="dark"] .css-1iz9tag, .css-roes5o, .css-1qqcn7d, .css-yn7rjo, .css-me2vqk,
        [data-theme="dark"] .css-e0p248, .css-iotqsc, .css-onu91o,
        [data-theme="dark"] .Create-salt-author-complaint-page-content p, .css-h5rdys,
        [data-theme="dark"] .css-1symrae, .css-705zp9, .css-l2s8o9, .App-pc, .css-1eqmq6,
        [data-theme="dark"] .css-133xqjo, .css-17rhbf0, .css-3470e2, .css-wuse5b {
            color: var(--text-primary) !important;
        }

        /* 副文/注释文本 */
        [data-theme="dark"] .css-1dydzuy,
        [data-theme="dark"] .AuthorInfo-badgeText {
            color: var(--text-secondary) !important;
        }

        /* 高亮/突出文本 */
        [data-theme="dark"] .css-anmzua, .css-1woiwqg, .MCNQuestionListItem-answerBtn,
        [data-theme="dark"] .css-66w2mh, .css-oxh2a1, .css-1946lac, .css-1wp1nud,
        [data-theme="dark"] .css-zkfaav, .css-qlzdd2, .css-14w1mp, .css-2kp40o,
        [data-theme="dark"] .css-risksa, .css-6j0ktf {
            color: var(--text-highlight) !important;
        }

        /* 超链接文本 */
        [data-theme="dark"] .css-b7erz1,
        [data-theme="dark"] .css-140fcia {
            color: var(--text-link) !important;
        }

        /* 纯黑背景 */
        [data-theme="dark"] .css-2sopzd {
            background-color: var(--bg-pure-black) !important;
        }

        /* 代码区 */
        [data-theme="dark"] code,
        [data-theme="dark"] .css-ob6uua pre,
        [data-theme="dark"] .css-1mev9j9 pre,
        [data-theme="dark"] .css-1yl6ec1 pre,
        [data-theme="dark"] .css-oqi8p3 pre{
            background: var(--bg-code) !important;
        }

        /* 卡片样式 (LinkCard) */
        [data-theme="dark"] .LinkCard {
            background-color: var(--bg-card) !important;
            border: 1px solid var(--border-secondary) !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
        }
        [data-theme="dark"] .LinkCard.new.css-1vqsdx1 {
            background-color: transparent !important;
            color: var(--text-title) !important;
        }
        [data-theme="dark"] .LinkCard.new.css-1vqsdx1:hover {
            background-color: var(--bg-hover) !important;
            transition: background-color 0.3s ease !important;
        }
        [data-theme="dark"] .LinkCard-contents { background-color: transparent !important; }
        [data-theme="dark"] .LinkCard-title { color: var(--text-title) !important; font-weight: 600 !important; }
        [data-theme="dark"] .LinkCard-desc { color: var(--text-primary) !important; }
        [data-theme="dark"] .LinkCard-tag {
            background-color: var(--bg-tag) !important;
            color: var(--text-title) !important;
        }
        [data-theme="dark"] .LinkCard-image {
            background-color: var(--bg-primary) !important;
            border: 1px solid var(--border-secondary) !important;
        }
        [data-theme="dark"] .LinkCard-image img { opacity: 0.9 !important; transition: opacity 0.3s ease !important; }
        [data-theme="dark"] .LinkCard-image img:hover { opacity: 1 !important; }
        [data-theme="dark"] .LinkCard-image--video .Zi.Zi--Play { color: var(--text-highlight) !important; }

        /* 导航菜单悬浮效果 */
        [data-theme="dark"] .css-17rhbf0:hover {
            background-color: var(--bg-hover) !important;
            color: var(--text-highlight) !important;
        }

        /* 特殊图标 */
        [data-theme="dark"] .css-1bh8qzv path:first-child { fill: #d32f2f !important; }
        [data-theme="dark"] .css-1bh8qzv path:last-child { fill: var(--text-highlight) !important; }

        /* “稍后答”等按钮的悬浮效果 */
        [data-theme="dark"] .css-3470e2:hover,
        [data-theme="dark"] .css-wuse5b:hover {
            color: var(--text-highlight) !important;
            background-color: var(--bg-hover) !important;
        }
        [data-theme="dark"] .css-3470e2:hover svg,
        [data-theme="dark"] .css-wuse5b:hover svg {
            fill: var(--text-highlight) !important;
        }

        /* 通用按钮 */
        [data-theme="dark"] .css-hdz1a3,
        [data-theme="dark"] .css-1q65fkr,
        [data-theme="dark"] .css-97fdvh {
            color: var(--text-primary) !important;
            background-color: var(--bg-button) !important;
            border: 1px solid var(--border-primary) !important;
        }
        [data-theme="dark"] .css-hdz1a3:hover {
            color: var(--text-highlight) !important;
            background-color: var(--bg-hover) !important;
            border-color: var(--border-hover) !important;
        }

        /* 滚动条 */
        [data-theme="dark"] .StrollBar { background-color: transparent !important; }
        [data-theme="dark"] .StrollBar > div { background-color: rgba(255, 255, 255, 0.3) !important; }
    `;

    // 立即将样式添加到页面，即使DOM还未完全加载
    document.head ? document.head.appendChild(style) : document.documentElement.appendChild(style);

    // 页面加载完成后执行后续逻辑
    window.addEventListener('DOMContentLoaded', () => {
        // 设置主题函数
        const setTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
        };

        // 创建切换按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.style.position = 'fixed';
        toggleBtn.style.top = '10px';
        toggleBtn.style.right = '10px';
        toggleBtn.style.zIndex = '9999';
        toggleBtn.style.width = '32px';
        toggleBtn.style.height = '32px';
        toggleBtn.style.padding = '0';
        toggleBtn.style.backgroundColor = isDark ? '#333333' : '#ffffff';
        toggleBtn.style.border = '1px solid #404040';
        toggleBtn.style.borderRadius = '50%';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.display = 'flex';
        toggleBtn.style.alignItems = 'center';
        toggleBtn.style.justifyContent = 'center';
        toggleBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        toggleBtn.title = isDark ? '切换到浅色模式' : '切换到深色模式';

        // SVG 图标（太阳和月亮）
        const sunIcon = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        `;

        const moonIcon = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C0C0C0" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;

        // 设置初始图标
        toggleBtn.innerHTML = isDark ? sunIcon : moonIcon;

        // 点击切换主题
        toggleBtn.onclick = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                setTheme('light');
                toggleBtn.innerHTML = moonIcon;
                toggleBtn.style.backgroundColor = '#ffffff';
                toggleBtn.title = '切换到深色模式';
                localStorage.setItem('zhihu-dark-mode', 'false');
            } else {
                setTheme('dark');
                toggleBtn.innerHTML = sunIcon;
                toggleBtn.style.backgroundColor = '#333333';
                toggleBtn.title = '切换到浅色模式';
                localStorage.setItem('zhihu-dark-mode', 'true');
            }
        };

        // 添加按钮到页面
        document.body.appendChild(toggleBtn);

        // 使用 MutationObserver 监控 data-theme 变化，防止知乎自身脚本覆盖主题
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    const shouldBeDark = localStorage.getItem('zhihu-dark-mode') === 'true';
                    if (shouldBeDark && currentTheme !== 'dark') {
                        setTheme('dark');
                    } else if (!shouldBeDark && currentTheme !== 'light') {
                        setTheme('light');
                    }
                }
            });
        });

        // 开始观察 <html> 的属性变化
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    });
})();