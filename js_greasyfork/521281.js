// ==UserScript==
// @name         领星售后信息复制
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  一键复制领星 ERP 页面中的售后信息（包括收件人和商品信息）。店铺名称按规则输出，地址格式调整为"城市，州"。适配新版DOM：单号、品名、SKU从指定class提取，并补充“复制失败”原因提示。
// @author       祀尘
// @match        https://erp.lingxing.com/*
// @icon         https://www.google.com/s2/favicons?domain=lingxing.com
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/521281/%E9%A2%86%E6%98%9F%E5%94%AE%E5%90%8E%E4%BF%A1%E6%81%AF%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/521281/%E9%A2%86%E6%98%9F%E5%94%AE%E5%90%8E%E4%BF%A1%E6%81%AF%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========= 配置区 =========

    // 品牌映射：品牌名 -> 简称
    const brandNameMap = {
        'BORNOON': 'BRN',
        'ANYMAPLE': 'AMP',
        'XIXINI': 'XXN',
        'HUANLEGO': 'HLG',
        'Wodeer': 'WD',
        'MCMACROS': 'MC',
        'Thacuok': 'TC',
        'BOXACTION': 'BOX',
        'BOONATU': 'BNT'
    };

    // 店铺名 -> 品牌名（特例）
    const storeToBrandMap = {
        'XIxini-US': 'XIXINI',
        'BOXACTION-US': 'BOX',
        'Jiangxin Tech-US': 'BOONATU'
    };

    // ========= UI：按钮 + 通知 =========

    const button = document.createElement('button');
    button.textContent = '复制售后信息';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '100000';
    button.disabled = true;
    document.body.appendChild(button);

    function showNotification(message, duration = 1800) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '100px';
        notification.style.right = '20px';
        notification.style.maxWidth = '420px';
        notification.style.whiteSpace = 'pre-line';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.78)';
        notification.style.color = '#fff';
        notification.style.padding = '10px 16px';
        notification.style.borderRadius = '6px';
        notification.style.zIndex = '100000';
        notification.style.fontSize = '14px';
        notification.style.lineHeight = '1.35';
        notification.style.transition = 'opacity 0.25s ease';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 250);
        }, duration);
    }

    // ========= 工具函数 =========

    function cleanText(s) {
        return (s ?? '').toString().replace(/\s+/g, ' ').trim();
    }

    function getText(el) {
        return cleanText(el?.textContent);
    }

    /**
     * 从 .detail-box-left 里的 item-grid 按 label 精准取值：
     * <span class="label">SKU</span>
     * <div class="... value"><span> HLG092-WH </span>...</div>
     */
    function getGridValue(detailBoxLeft, labelText) {
        if (!detailBoxLeft) return '';
        const labels = Array.from(detailBoxLeft.querySelectorAll('.item-grid .label'));
        const target = cleanText(labelText);

        for (const lab of labels) {
            const t = cleanText(lab.textContent);
            if (t === target || t.includes(target)) {
                const valueEl = lab.nextElementSibling;
                if (!valueEl) return '';
                // valueEl 里通常有 span 包着真实值
                const span = valueEl.querySelector('span');
                return cleanText(span ? span.textContent : valueEl.textContent);
            }
        }
        return '';
    }

    /**
     * 地址格式调整：
     * - 去掉 "United States of America (USA)(美国)，"
     * - 若格式为 "AZ，GILBERT" => "GILBERT，AZ"
     * - 若格式为 "USA，AZ，GILBERT" => 取最后两段 "GILBERT，AZ"
     */
    function normalizeCityState(addressRaw) {
        let s = cleanText(addressRaw)
            .replace('United States of America (USA)(美国)，', '')
            .trim();

        if (!s) return '';

        const parts = s.split('，').map(x => cleanText(x)).filter(Boolean);

        if (parts.length === 2) return `${parts[1]}，${parts[0]}`;
        if (parts.length >= 3) return `${parts[parts.length - 1]}，${parts[parts.length - 2]}`;

        return s;
    }

    /**
     * 找“订单号”：
     * 你提供的新结构是：
     * <div class="ak-align-center oneLine">
     *   <span class="ak-blue ak-pointer">111-xxxx</span> ...
     * </div>
     * 为避免误抓，限定：必须匹配 Amazon 订单号形态 111-1234567-1234567
     */
    function findAmazonOrderNumber() {
        const spans = Array.from(document.querySelectorAll('span.ak-blue.ak-pointer'));
        const re = /\b\d{3}-\d{7}-\d{7}\b/;
        for (const s of spans) {
            const text = cleanText(s.textContent);
            const m = text.match(re);
            if (m) return m[0];
        }
        return '';
    }

    /**
     * 获取 detail-box-left（你确认店铺名/品名/SKU 都在这里）
     */
    function getDetailBoxLeft() {
        // 可能页面上有多个，优先取包含 item-grid + item-title 的那个
        const list = Array.from(document.querySelectorAll('.detail-box-left'));
        for (const el of list) {
            if (el.querySelector('.item-grid') && el.querySelector('.item-title')) return el;
        }
        // 兜底：取第一个
        return list[0] || null;
    }

    // ========= 核心：复制信息 =========

    function copyInfo() {
        const missing = []; // 用于提示“复制失败的信息”
        try {
            // 收件信息
            const receiveInfo = document.querySelector('div.receive-info');
            if (!receiveInfo) {
                missing.push('收件信息区域(receive-info)未找到');
            }

            // 收件人、电话、邮编（新版 receive-info 的顺序可能变，避免 nth-child）
            const recipient = receiveInfo ? (getText(receiveInfo.querySelector('.info-wrapper:nth-child(1) .value')) || '') : '';
            if (!recipient) missing.push('收件人未找到');

            // 电话：按 label 查找（避免新增“公司”等导致位置变化）
            // 领星这里 label 文本是“电话”
            let phoneRaw = '';
            if (receiveInfo) {
                // 在 receive-info-grid 里用 label 匹配更稳
                const wrappers = Array.from(receiveInfo.querySelectorAll('.info-wrapper'));
                for (const w of wrappers) {
                    const lab = cleanText(w.querySelector('.label')?.textContent);
                    if (lab.includes('电话')) {
                        phoneRaw = cleanText(w.querySelector('.value')?.textContent);
                        break;
                    }
                }
            }
            if (!phoneRaw) missing.push('电话未找到');

            const phone = `电话：${phoneRaw}`;

            const addressElement = receiveInfo ? getText(receiveInfo.querySelector('.receive-address-box .value')) : '';
            const address = normalizeCityState(addressElement);
            if (!address) missing.push('城市/州未找到');

            const detailedAddress = receiveInfo ? getText(receiveInfo.querySelector('.detail-address-box .value')) : '';
            if (!detailedAddress) missing.push('详细地址未找到');

            // 邮编：按 label 取
            let postalCode = '';
            if (receiveInfo) {
                const wrappers = Array.from(receiveInfo.querySelectorAll('.info-wrapper'));
                for (const w of wrappers) {
                    const lab = cleanText(w.querySelector('.label')?.textContent);
                    if (lab.includes('邮编')) {
                        postalCode = cleanText(w.querySelector('.value')?.textContent);
                        break;
                    }
                }
            }
            if (!postalCode) missing.push('邮编未找到');

            // 订单号：按你给的 class + 正则匹配
            const orderNumber = findAmazonOrderNumber();
            if (!orderNumber) missing.push('订单号未找到(111-xxxxxxx-xxxxxxx)');

            // 商品信息：从 .detail-box-left 提取
            const detailBoxLeft = getDetailBoxLeft();
            if (!detailBoxLeft) {
                missing.push('商品信息区域(detail-box-left)未找到');
            }

            // 店铺名：你说应取 BORNOON（来自 item-title 第一个词）
            const itemTitle = detailBoxLeft ? getText(detailBoxLeft.querySelector('.item-title')) : '';
            let brand = itemTitle ? itemTitle.split(' ')[0] : '';
            if (!brand) missing.push('店铺名/品牌未找到(item-title)');

            // 兼容：若 store-name 有特殊映射，优先用 store-name
            const storeNameElement = document.querySelector('.store-name');
            const fullStoreName = cleanText(storeNameElement?.textContent);
            if (fullStoreName && storeToBrandMap[fullStoreName]) {
                brand = storeToBrandMap[fullStoreName];
            }

            // SKU、品名：你提供的结构在 item-grid 内
            const sku = detailBoxLeft ? (getGridValue(detailBoxLeft, 'SKU') || '') : '';
            if (!sku) missing.push('SKU未找到(item-grid)');

            const productName = detailBoxLeft ? (getGridValue(detailBoxLeft, '品名') || '') : '';
            if (!productName) missing.push('品名未找到(item-grid)');

            // 店铺简称映射
            let storeShort = brandNameMap[brand];
            if (!storeShort) {
                storeShort = brand ? brand.substring(0, 3).toUpperCase() : 'N/A';
                if (!brand) missing.push('品牌简称匹配失败');
            }

            // 拼接收件信息
            const recipientInfo = [
                recipient,
                detailedAddress,
                address,
                postalCode,
                phone
            ].filter(Boolean).join('\n');

            // 拼接最终输出
            const output = [
                orderNumber || '单号未找到',
                recipientInfo,
                `货号：${sku || 'SKU 未找到'}`,
                `店铺：${storeShort || 'N/A'}`,
                `${productName || '品名未找到'}，`
            ].join('\n');

            GM_setClipboard(output);

            // 成功提示 + 若有缺失字段，补充提示
            if (missing.length > 0) {
                showNotification(`已复制（部分字段未识别）\n- ${missing.join('\n- ')}`, 2600);
            } else {
                showNotification('复制成功！');
            }
        } catch (err) {
            console.error('[领星售后信息复制] Error:', err);
            const msg = missing.length
                ? `复制失败\n- ${missing.join('\n- ')}`
                : `复制失败：页面结构可能已变更`;
            showNotification(msg, 2800);
        }
    }

    button.addEventListener('click', copyInfo);

    // ========= 启用按钮：等待关键区域出现 =========
    // 以 receive-info + detail-box-left 为准（你确认这两块都存在）
    const observer = new MutationObserver(() => {
        const receiveInfo = document.querySelector('div.receive-info');
        const detailBoxLeft = getDetailBoxLeft();
        if (receiveInfo && detailBoxLeft) {
            button.disabled = false;
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 兜底：慢加载时也尝试启用（点击时仍会校验）
    setTimeout(() => {
        const receiveInfo = document.querySelector('div.receive-info');
        const detailBoxLeft = getDetailBoxLeft();
        if (receiveInfo && detailBoxLeft) button.disabled = false;
    }, 2500);

})();
