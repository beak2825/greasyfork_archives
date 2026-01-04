// ==UserScript==
// @name         一键选择并设置拒绝理由（稳定增强版）
// @namespace    http://web.yuyehk.cn/
// @version      2.1
// @description  保留原始一键拒绝逻辑，只增强控制面板稳定显示，仅供内部使用
// @author       yuyehk
// @match        *://*/*
// @grant        none
// @license      Copyright © 2025 yuyehk. All rights reserved.
// @downloadURL https://update.greasyfork.org/scripts/534143/%E4%B8%80%E9%94%AE%E9%80%89%E6%8B%A9%E5%B9%B6%E8%AE%BE%E7%BD%AE%E6%8B%92%E7%BB%9D%E7%90%86%E7%94%B1%EF%BC%88%E7%A8%B3%E5%AE%9A%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/534143/%E4%B8%80%E9%94%AE%E9%80%89%E6%8B%A9%E5%B9%B6%E8%AE%BE%E7%BD%AE%E6%8B%92%E7%BB%9D%E7%90%86%E7%94%B1%EF%BC%88%E7%A8%B3%E5%AE%9A%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防篡改配置 & 防重复执行
    if (window.__oneClickScriptLoaded) {
        console.warn('脚本已加载，禁止重复执行！');
        return;
    }
    Object.defineProperty(window, '__oneClickScriptLoaded', {
        value: true,
        writable: false,
        configurable: false
    });

    // 基础容器选择器（沿用你原来的）
    const containerSelector = '#app > div > div > div:nth-child(2) > div > div:nth-child(4) > div > div.ivu-layout-sider-children > div > div > div.ivu-collapse-content > div > p > div';
    Object.freeze(containerSelector);

    // 理由列表（对应下拉 li 的顺序）
    const reasons = Object.freeze([
        '图片与poi不相关',
        '广告营销海报',
        '人脸',
        '人体',
        '水印',
        '文字占比问题',
        '文字居中遮挡主体',
        '构图问题',
        '门头图截断',
        '图片重复',
        '图片分类有误',
        '图片引起不适',
        '其他问题（拼接/倾斜/清晰度过低/边框过大/色彩失真）'
    ]);

    // 模板函数（完全用你原来的路径）
    const radioPath = i =>
        `${containerSelector} > div:nth-child(${i}) > div > div > div:nth-child(6)` +
        ` > form > div:nth-child(1) > div > div` +
        ` > label.ivu-radio-wrapper.ivu-radio-group-item.radio-active-bg-red`;

    const selectTogglePath = i =>
        `${containerSelector} > div:nth-child(${i}) > div > div > div:nth-child(6)` +
        ` > form > div:nth-child(2) > div > div > div`;

    // 核心：遍历设置（沿用你原来的逻辑）
    function selectAll(reasonIdx) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.warn('未找到容器:', containerSelector);
            alert('❌ 未找到容器元素，请检查 containerSelector 是否匹配当前页面');
            return;
        }

        const total = container.children.length;
        if (!total) {
            console.warn('容器下没有子元素:', containerSelector);
            alert('⚠ 当前容器下没有待处理条目');
            return;
        }

        for (let i = 1; i <= total; i++) {
            // 1. 勾选拒绝单选按钮
            const radio = document.querySelector(radioPath(i));
            if (radio) {
                radio.click();
            } else {
                console.warn(`第 ${i} 条未找到单选按钮`, radioPath(i));
            }

            // 2. 打开下拉框
            const toggle = document.querySelector(selectTogglePath(i));
            if (toggle) {
                toggle.click();
            } else {
                console.warn(`第 ${i} 条未找到下拉触发元素`, selectTogglePath(i));
                continue;
            }

            // 3. 选择对应 li（完全用你之前的路径）
            const liSelector =
                `${containerSelector} > div:nth-child(${i}) > div > div > div:nth-child(6)` +
                ` > form > div:nth-child(2) > div > div > div` +
                ` > div.ivu-select-dropdown > ul.ivu-select-dropdown-list > li:nth-child(${reasonIdx})`;

            const li = document.querySelector(liSelector);
            if (li) {
                li.click();
            } else {
                console.warn(`第 ${i} 条未找到下拉选项 li，第 ${reasonIdx} 个`, liSelector);
            }
        }

        console.log(`已处理 ${total} 条，理由：${reasons[reasonIdx - 1]}`);
    }

    // 控制面板（只做稳定位 + 防重复，不动核心功能）
    function addControlPanel() {
        if (document.getElementById('__oneClickRejectPanel')) return;

        const panel = document.createElement('div');
        panel.id = '__oneClickRejectPanel';

        Object.assign(panel.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: '#fff',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            zIndex: 999999,
            fontSize: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
        });

        const title = document.createElement('div');
        title.textContent = '一键拒绝工具';
        title.style.marginBottom = '6px';
        title.style.fontWeight = 'bold';

        const select = document.createElement('select');
        reasons.forEach((text, idx) => {
            const opt = document.createElement('option');
            opt.value = idx + 1;
            opt.text = text;
            select.appendChild(opt);
        });
        select.style.marginRight = '8px';

        const btn = document.createElement('button');
        btn.textContent = '一键拒绝';
        Object.assign(btn.style, {
            padding: '4px 10px',
            background: '#E74C3C',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        });

        btn.addEventListener('click', () => {
            const idx = parseInt(select.value, 10);
            if (!idx || idx < 1 || idx > reasons.length) {
                alert('非法的理由索引');
                return;
            }
            selectAll(idx);
        });

        panel.appendChild(title);
        panel.appendChild(select);
        panel.appendChild(btn);
        document.body.appendChild(panel);

        console.log('✅ 一键拒绝控制面板已插入');
    }

    // 使用 MutationObserver 保证面板在 SPA / 重渲染页面中始终存在
    function setupObserver() {
        if (!document.body) return;

        // 先尝试插入一次
        addControlPanel();

        const observer = new MutationObserver(() => {
            addControlPanel();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 等 body 可用再启动观察
    if (document.body) {
        setupObserver();
    } else {
        const interval = setInterval(() => {
            if (document.body) {
                clearInterval(interval);
                setupObserver();
            }
        }, 100);
    }
})();
