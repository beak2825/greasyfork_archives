// ==UserScript==
// @name         BigSeller-TikTok Discount Extension
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  SKU级别设置个性折扣 2.0
// @author       Bihairui
// @match        https://www.bigseller.pro/web/listing/tiktok/discount/edit/*
// @match        https://www.bigseller.pro/web/listing/tiktok/discount/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533730/BigSeller-TikTok%20Discount%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/533730/BigSeller-TikTok%20Discount%20Extension.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // —— 全局统一延时（ms） ——
    const delay = 100;

    // 简易延时
    function wait(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    // 插入顶部工具栏：型号、折扣、限额、执行按钮
    function insertToolbar() {
        const toolbar = document.createElement('div');
        Object.assign(toolbar.style, {
            position: 'fixed',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            background: '#fff',
            padding: '6px 10px',
            borderRadius: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            fontSize: '13px'
        });

        // 型号输入
        const variantInput = document.createElement('input');
        variantInput.type = 'text';
        variantInput.value = 'Black, S';
        variantInput.style.width = '100px';
        variantInput.title = '变种型号 (与页面标题完全一致)';

        // 折扣输入
        const discountInput = document.createElement('input');
        discountInput.type = 'number';
        discountInput.min = '0';
        discountInput.max = '100';
        discountInput.value = '60';
        discountInput.style.width = '50px';
        discountInput.title = '折扣 (%)';

        // 限额输入
        const limitInput = document.createElement('input');
        limitInput.type = 'number';
        limitInput.min = '1';
        limitInput.value = '1';
        limitInput.style.width = '50px';
        limitInput.title = '限额 (件)';

        // 执行按钮
        const btn = document.createElement('button');
        btn.textContent = '批量执行 (0/0)';
        Object.assign(btn.style, {
            padding: '4px 10px',
            backgroundColor: '#1890ff',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
        });

        toolbar.append(
            document.createTextNode('型号:'), variantInput,
            document.createTextNode('折扣%:'), discountInput,
            document.createTextNode('限额:'), limitInput,
            btn
        );
        document.body.appendChild(toolbar);

        btn.addEventListener('click', async () => {
            btn.disabled = true;
            const rows = Array.from(document.querySelectorAll('table.table_box > tbody > tr.border_bottom'));
            const total = rows.length;
            for (let i = 0; i < total; i++) {
                btn.textContent = `批量执行 (${i+1}/${total})`;
                await processOne(rows[i], variantInput.value.trim(), discountInput.value, limitInput.value);
                await wait(delay);
            }
            btn.textContent = `全部完成 (${total}/${total})`;
            btn.disabled = false;
        });
    }

    // 处理单个商品行
    async function processOne(row, variantText, discountVal, limitVal) {
        const expandLink = row.querySelector('a.v_show');
        if (expandLink) expandLink.click();
        await wait(delay);

        // 定位目标变种行
        const variantRows = Array.from(row.querySelectorAll('tbody tr.pti_r'));
        const target = variantRows.find(r =>
            r.querySelector('td:first-child h4')?.textContent.trim() === variantText
        );
        if (!target) {
            // 收起后返回
            if (expandLink) expandLink.click();
            await wait(delay);
            return;
        }

        // 滚动到可视
        target.scrollIntoView({ block: 'center' });
        await wait(delay);

        // 设置折扣
        const discInput = target.querySelector('td:nth-child(3) input.ant-input');
        if (discInput) {
            discInput.value = discountVal;
            discInput.dispatchEvent(new Event('input', { bubbles: true }));
            discInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        await wait(delay);

        // 打开买家购买限额下拉
        const buyerCell = target.querySelector('td:nth-child(6)');
        const selToggle = buyerCell.querySelector('.ant-select-selection');
        if (selToggle) {
            selToggle.click();
            await wait(delay);

            // 从最新 overlay 中选“设置限制”
            const dropdowns = document.querySelectorAll('.ant-select-dropdown');
            const dd = dropdowns[dropdowns.length - 1];
            const item = Array.from(dd.querySelectorAll('.ant-select-dropdown-menu-item'))
                              .find(o => o.textContent.trim() === '设置限制');
            if (item) item.click();
            await wait(delay);

            // 填写限额
            const inp = buyerCell.querySelector('input.ant-input:not([style*="display: none"])');
            if (inp) {
                inp.value = limitVal;
                inp.dispatchEvent(new Event('input', { bubbles: true }));
                inp.dispatchEvent(new Event('change', { bubbles: true }));
            }
            await wait(delay);
        }

        // 收起
        if (expandLink) expandLink.click();
        await wait(delay);
    }

    window.addEventListener('load', insertToolbar);
})();