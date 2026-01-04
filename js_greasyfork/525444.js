// ==UserScript==
// @name         DMM番号展示
// @namespace    https://github.com/candymagicshow/dmm_bangou_shower
// @version      4.0
// @license      GPL License
// @description  在标题下方展示番号
// @author       candymagic
// @include      https://*.dmm.co.*/*
// @include      https://*.mgstage.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dmm.co.jp
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525444/DMM%E7%95%AA%E5%8F%B7%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/525444/DMM%E7%95%AA%E5%8F%B7%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 容器样式配置
    const containerStyle = {
        position: 'relative',
        display: 'block',
        marginTop: '4px' // 与标题的间距
    };

    // CID样式配置
    const cidStyle = {
        display:'inline-block',
        color: 'rgb(198, 40, 40)',
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 8px',
        background: 'rgb(255, 235, 238)',
        borderRadius: '4px',
        border: '1px solid rgb(239, 154, 154)',
        margin: '3px 0px',
        lineHeight: '1.4',
        cursor: 'pointer'
    };

    // 标记处理过的属性名，避免与站点自身属性冲突
    const PROCESSED_ATTR = 'data-dmm-cid-shower';

    // 复制到剪贴板
    const copyCID = async (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                return;
            } catch (e) {
                // fallback below
            }
        }
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    };

    // CID处理模块
    const processCID = {
        // 通用CID提取，兼容新版 /av/content/?id=XXX 结构
        extract: (url) => {
            const cidMatch = url.match(/\/(?:cid=|cid\/)([^\/?&]+)/i);
            if (cidMatch) return cidMatch[1];

            const idMatch = url.match(/[?&]id=([^&]+)/i);
            return idMatch ? idMatch[1] : null;
        },

        // 智能格式化
        format: (rawCID) => {
            const match = rawCID.match(/.*?([a-z]+)(\d+)$/i);
            if (!match) return rawCID;

            const letters = match[1].toUpperCase();
            let numbers = match[2].replace(/^0+/, ''); // 去除前导零

            // 处理全零的特殊情况
            if (numbers === '') numbers = '0';

            // 短编号补零逻辑
            numbers = numbers.padStart(3, '0');
            // 但保留超过3位的长编号
            numbers = numbers.length > 3 ? numbers.replace(/^0+/, '') : numbers;

            return `${letters}-${numbers}`;
        },

        // 创建展示元素
        createElement: (cid) => {
            const badge = document.createElement('div');
            badge.textContent = cid;
            badge.title = '点击复制番号';
            Object.assign(badge.style, cidStyle);

            // 点击复制并短暂提示
            let resetTimer = null;
            badge.addEventListener('click', async () => {
                await copyCID(cid);
                const original = cid;
                badge.textContent = `${original} (已复制)`;
                if (resetTimer) clearTimeout(resetTimer);
                resetTimer = setTimeout(() => {
                    badge.textContent = original;
                }, 1200);
            });
            return badge;
        }
    };

    // 定位插入点，兼容新版卡片结构
    const findParentContainer = (target) => {
        // 优先寻找列表/卡片元素
        const container = target.closest('li, .c-item, .product-list_item, .flex');
        if (container) return container;

        // 保底：退回到父级
        return target.parentElement || target;
    };

    // mgstage 专用处理
    const processMgstage = () => {
        document.querySelectorAll(`p.price:not([${PROCESSED_ATTR}])`).forEach(priceEl => {
            // 寻找同容器内的主商品链接
            const link = priceEl.closest('.carousel-2row-item, .rank-list-item, .rank-item, .item, .contents')?.querySelector('a[href*="/product/product_detail/"]');
            if (!link || link.hasAttribute(PROCESSED_ATTR)) return;

            const url = new URL(link.href, location.origin);
            const parts = url.pathname.split('/').filter(Boolean);
            const cid = parts.pop();
            if (!cid) return;

            const formattedCID = processCID.format(cid);
            const badge = processCID.createElement(formattedCID);

            // 将番号插入到价格后方
            priceEl.insertAdjacentElement('afterend', badge);

            link.setAttribute(PROCESSED_ATTR, 'processed');
            priceEl.setAttribute(PROCESSED_ATTR, 'processed');
        });
    };

    // 主处理逻辑
    const processTitles = () => {
        // mgstage 走独立逻辑
        if (location.hostname.includes('mgstage.com')) {
            processMgstage();
            return;
        }

        const linkSelectors = [
            'a[href*="/cid="]',
            'a[href*="/cid/"]',
            'a[href*="/av/content/?id="]'
        ];
        const selector = linkSelectors.map(sel => `${sel}:not([${PROCESSED_ATTR}])`).join(',');

        document.querySelectorAll(selector).forEach(link => {
            // 如果链接包含data-e2eid="title"，则跳过该链接
            if (link.hasAttribute('data-e2eid') && link.getAttribute('data-e2eid') === 'title') {
                return;
            }

            const rawCID = processCID.extract(link.href);
            if (!rawCID) return;

            // 格式化CID
            const formattedCID = processCID.format(rawCID);

            // 优先在价格模块所在容器内插入（价格在下方）
            const priceContainer = link.parentElement && link.parentElement.querySelector('div.font-bold') ? link.parentElement : null;

            // 获取商品项父容器
            const container = priceContainer || findParentContainer(link);

            // 创建专用容器
            const cidElement = processCID.createElement(formattedCID);

            // 插入到商品容器末尾
            container.appendChild(cidElement);

            // 修改所有.product-items_package元素的高度样式
            const packageElements = document.querySelectorAll('.product-items_package');
            packageElements.forEach(packageElement => {
                //添加 height: 400px
                packageElement.style.height = '400px';
            });

            // 标记处理状态
            link.setAttribute(PROCESSED_ATTR, 'processed');
        });
    };

    // DOM监听优化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                requestAnimationFrame(processTitles);
            }
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: false
    });

    // 初始化执行
    processTitles();
})();
