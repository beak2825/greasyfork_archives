// ==UserScript==
// @name         宝塔授权管理移动端整合优化（SVG菜单按钮）
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  移动端优化：菜单折叠、主内容全屏、字段名注入、按钮居中、隐藏客服模块，使用SVG图标美化菜单按钮，提升宝塔授权管理页面体验。
// @author       Dia
// @match        https://www.bt.cn/admin/profe_ee
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533472/%E5%AE%9D%E5%A1%94%E6%8E%88%E6%9D%83%E7%AE%A1%E7%90%86%E7%A7%BB%E5%8A%A8%E7%AB%AF%E6%95%B4%E5%90%88%E4%BC%98%E5%8C%96%EF%BC%88SVG%E8%8F%9C%E5%8D%95%E6%8C%89%E9%92%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533472/%E5%AE%9D%E5%A1%94%E6%8E%88%E6%9D%83%E7%AE%A1%E7%90%86%E7%A7%BB%E5%8A%A8%E7%AB%AF%E6%95%B4%E5%90%88%E4%BC%98%E5%8C%96%EF%BC%88SVG%E8%8F%9C%E5%8D%95%E6%8C%89%E9%92%AE%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 样式注入
    GM_addStyle(`
        @media (max-width: 768px) {
            .sidebar-scroll {
                display: none !important;
            }
            .title.plr15 {
                height: 100px !important;
            }
            body.menu-open .sidebar-scroll {
                display: block !important;
                position: fixed;
                top: 0;
                left: 0;
                width: 220px;
                height: 100%;
                background: #2c3e50;
                z-index: 9998;
                overflow-y: auto;
                padding: 10px;
            }
            .menu-toggle-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                position: fixed;
                top: 12px;
                left: 12px;
                z-index: 9999;
                width: 48px;
                height: 48px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 50%;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                cursor: pointer;
                transition: background 0.3s ease;
            }
            .menu-toggle-btn:hover {
                background: #0056b3;
            }
            .menu-toggle-btn svg {
                width: 24px;
                height: 24px;
                fill: white;
            }
            .main-content {
                width: 100% !important;
                margin-left: 0 !important;
                padding: 10px !important;
            }
            body.menu-open .main-content {
                opacity: 0.3;
            }
            .wechat-customer {
                display: none !important;
            }

            /* 表格竖向显示 */
            table thead {
                display: none;
            }
            table tbody tr {
                display: block;
                margin: 12px 0;
                padding: 12px;
                border-top: 1px solid #ccc;
                border-bottom: 1px solid #ccc;
                background: #fff;
                text-align: center;
            }
            table tbody tr td {
                display: block;
                width: 100%;
                padding: 6px 0;
                font-size: 14px;
                border: none !important;
                text-align: center;
            }
            table tbody tr td::before {
                content: attr(data-label) ": ";
                font-weight: bold;
                display: block;
                margin-bottom: 2px;
                color: #555;
            }
            table tbody tr td:last-child {
                text-align: center !important;
            }
            table tbody tr td:last-child a {
                display: inline-block;
                margin: 6px auto;
                padding: 6px 12px;
                background: #007bff;
                color: white;
                border-radius: 4px;
                text-decoration: none;
                font-size: 14px;
            }
        }
    `);

    // 创建菜单按钮（使用 SVG 图标）
    const btn = document.createElement('button');
    btn.className = 'menu-toggle-btn';
    btn.style.display = 'none';
    btn.innerHTML = `
        <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="12"></rect>
            <rect y="30" width="100" height="12"></rect>
            <rect y="60" width="100" height="12"></rect>
        </svg>
    `;
    document.body.appendChild(btn);

    // 切换菜单显示
    btn.addEventListener('click', () => {
        document.body.classList.toggle('menu-open');
    });

    // 判断是否为移动端
    const isMobile = () => window.innerWidth <= 768;

    // 初始化按钮显示
    const initToggle = () => {
        if (isMobile()) {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 'none';
            document.body.classList.remove('menu-open');
        }
    };

    window.addEventListener('resize', initToggle);
    window.addEventListener('load', () => {
        initToggle();

        // 隐藏客服模块
        const tryHideCustomer = () => {
            const el = document.querySelector('.wechat-customer');
            if (el) el.style.display = 'none';
        };
        tryHideCustomer();
        setTimeout(tryHideCustomer, 1000);
    });

    // 字段名数组（与页面顺序严格对应）
    const fieldLabels = [
        "服务器IP",
        "适用产品",
        "备注",
        "本月剩余解绑次数",
        "到期时间",
        "状态",
        "操作"
    ];

    // 注入字段名
    function injectLabels() {
        const rows = document.querySelectorAll('table tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((td, i) => {
                if (fieldLabels[i]) {
                    td.setAttribute('data-label', fieldLabels[i]);
                }
            });
        });
    }

    // 使用 MutationObserver 监听表格变化
    const target = document.querySelector('table tbody');
    if (target) {
        const observer = new MutationObserver(() => {
            injectLabels();
        });
        observer.observe(target, { childList: true, subtree: true });
        injectLabels(); // 初始执行一次
    } else {
        setTimeout(injectLabels, 1000);
    }
})();
