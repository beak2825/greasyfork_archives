// ==UserScript==
// @name         雪球网股东行为查询
// @namespace    http://tampermonkey.net/
// @version      20250712
// @description  在股票名称添加股东行为查询按钮
// @author       MA200@xueqiu.com https://xueqiu.com/u/sybd
// @match         *://*.xueqiu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541098/%E9%9B%AA%E7%90%83%E7%BD%91%E8%82%A1%E4%B8%9C%E8%A1%8C%E4%B8%BA%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/541098/%E9%9B%AA%E7%90%83%E7%BD%91%E8%82%A1%E4%B8%9C%E8%A1%8C%E4%B8%BA%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断股票类型的函数
    function getStockType(code) {
        if (!code) return null;

        // A股代码规则：6位数字
        if (/^\d{6}$/.test(code)) {
            return 'A_STOCK';
        }

        // 港股代码规则：通常是4-5位数字，前面可能有0
        if (/^\d{4,5}$/.test(code)) {
            return 'HK_STOCK';
        }

        return null;
    }

    // 获取股票代码的函数
    function getStockCode() {
        // 从URL中提取股票代码
        const urlMatch = window.location.href.match(/(?:stock|symbol|code|sh|sz)[=\/](\d{4,6})/i);
        if (urlMatch) {
            const code = urlMatch[1];
            if (code.length === 6) {
                return code; // A股代码
            } else {
                return code.padStart(4, '0'); // 港股代码
            }
        }

        // 从页面标题中提取
        const titleMatch = document.title.match(/(\d{4,6})/);
        if (titleMatch) {
            const code = titleMatch[1];
            if (code.length === 6) {
                return code; // A股代码
            } else {
                return code.padStart(4, '0'); // 港股代码
            }
        }

        // 从页面内容中查找
        const bodyText = document.body.innerText;
        const bodyMatch = bodyText.match(/(?:股票代码|股份代號|Stock Code|证券代码)[：:\s]*(\d{4,6})/i);
        if (bodyMatch) {
            const code = bodyMatch[1];
            if (code.length === 6) {
                return code; // A股代码
            } else {
                return code.padStart(4, '0'); // 港股代码
            }
        }

        return null;
    }

    // 格式化日期为 DD/MM/YYYY 格式（港股用）
    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // 获取当前日期和一年前的日期
    function getDateRange() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 1);

        return {
            start: formatDate(startDate),
            end: formatDate(endDate)
        };
    }

    // 构建港股HKEX披露链接
    function buildHKEXLinks(stockCode, dateRange) {
        const baseParams = `scsd=${encodeURIComponent(dateRange.start)}&sced=${encodeURIComponent(dateRange.end)}&sc=${stockCode}&src=MAIN&lang=ZH&g_lang=zh-HK`;

        return {
            disclosure: `https://di.hkex.com.hk/di/NSSrchCorpList.aspx?sa1=cl&${baseParams}`,
            shareholderChange: `https://www.etnet.com.hk/www/sc/stocks/realtime/quote_ca_sdi.php?code=${stockCode}`,
            lixingerChange: `https://www.lixinger.com/analytics/company/detail/hk/${stockCode}/${parseInt(stockCode)}/shareholders/hk-shareholders-equity-change`,
            buyback: `https://www.etnet.com.hk/www/sc/stocks/realtime/quote_ca_buyback.php?code=${stockCode}&page=1`
        };
    }

    // 构建A股链接
    function buildAStockLinks(stockCode) {
        // 根据股票代码前缀确定市场
        const marketPrefix = stockCode.startsWith('6') ? 'sh' : 'sz';

        return {
            shareholderChange: `https://data.eastmoney.com/executive/gdzjc/${stockCode}.html`,
            lixingerChange: `https://www.lixinger.com/analytics/company/detail/${marketPrefix}/${stockCode}/${stockCode}/shareholders/cn-marjor-shareholders-change`,
            buyback: `https://data.eastmoney.com/gphg/${stockCode}.html`
        };
    }

    // 创建按钮
    function createButton(text, onClick, color = '#667eea') {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            padding: 4px 8px;
            margin: 0 2px;
            background: ${color};
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.background = '#5a67d8';
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = color;
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', onClick);

        return button;
    }

    // 创建下拉菜单按钮
    function createDropdownButton(text, options, color = '#667eea') {
        const container = document.createElement('div');
        container.style.cssText = `
            position: relative;
            display: inline-block;
            margin: 0 2px;
        `;

        const button = document.createElement('button');
        button.textContent = text + ' ▼';
        button.style.cssText = `
            padding: 4px 8px;
            background: ${color};
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
        `;

        const dropdown = document.createElement('div');
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 1000;
            display: none;
            min-width: 100px;
        `;

        options.forEach(option => {
            const item = document.createElement('div');
            item.textContent = option.text;
            item.style.cssText = `
                padding: 6px 12px;
                cursor: pointer;
                font-size: 12px;
                color: #333;
                border-bottom: 1px solid #eee;
            `;
            item.addEventListener('mouseenter', () => {
                item.style.background = '#f5f5f5';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = 'white';
            });
            item.addEventListener('click', () => {
                option.onClick();
                dropdown.style.display = 'none';
            });
            dropdown.appendChild(item);
        });

        // 移除最后一个边框
        if (dropdown.lastChild) {
            dropdown.lastChild.style.borderBottom = 'none';
        }

        button.addEventListener('mouseenter', () => {
            button.style.background = '#5a67d8';
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = color;
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', () => {
            dropdown.style.display = 'none';
        });

        container.appendChild(button);
        container.appendChild(dropdown);

        return container;
    }

    // 创建按钮容器
    function createButtons() {
        const stockCode = getStockCode();
        if (!stockCode) return null;

        const stockType = getStockType(stockCode);
        if (!stockType) return null;

        const container = document.createElement('div');
        container.style.cssText = `
            display: inline-flex;
            align-items: center;
            margin-left: 10px;
            vertical-align: middle;
        `;

        if (stockType === 'HK_STOCK') {
            // 港股按钮
            const dateRange = getDateRange();
            const links = buildHKEXLinks(stockCode, dateRange);

            const disclosureBtn = createButton('披露易', () => {
                window.open(links.disclosure, '_blank');
            }, '#667eea');

            // 港股增减持下拉菜单
            const shareholderOptions = [
                {
                    text: 'etnet',
                    onClick: () => window.open(links.shareholderChange, '_blank')
                },
                {
                    text: '理杏仁',
                    onClick: () => window.open(links.lixingerChange, '_blank')
                }
            ];

            const shareholderBtn = createDropdownButton('增减持', shareholderOptions, '#ed8936');

            const buybackBtn = createButton('回购', () => {
                window.open(links.buyback, '_blank');
            }, '#48bb78');

            container.appendChild(disclosureBtn);
            container.appendChild(shareholderBtn);
            container.appendChild(buybackBtn);

        } else if (stockType === 'A_STOCK') {
            // A股按钮
            const links = buildAStockLinks(stockCode);

            // A股增减持下拉菜单
            const shareholderOptions = [
                {
                    text: '东方财富',
                    onClick: () => window.open(links.shareholderChange, '_blank')
                },
                {
                    text: '理杏仁',
                    onClick: () => window.open(links.lixingerChange, '_blank')
                }
            ];

            const shareholderBtn = createDropdownButton('增减持', shareholderOptions, '#ed8936');

            const buybackBtn = createButton('回购', () => {
                window.open(links.buyback, '_blank');
            }, '#48bb78');

            container.appendChild(shareholderBtn);
            container.appendChild(buybackBtn);
        }

        return container;
    }

    // 查找股票名称位置并插入按钮
    function insertButtons() {
        // 移除已存在的按钮
        const existingButtons = document.querySelectorAll('.stock-quick-buttons');
        existingButtons.forEach(btn => btn.remove());

        const buttons = createButtons();
        if (!buttons) return;

        buttons.className = 'stock-quick-buttons';

        // 尝试多种选择器来找到股票名称的位置
        const selectors = [
            '.stock-name',
            '.quote-name',
            '.symbol-name',
            'h1[class*="name"]',
            '[class*="stock"][class*="name"]',
            '[class*="symbol"][class*="name"]',
            '.stock-info h1',
            '.quote-info h1'
        ];

        let inserted = false;

        for (const selector of selectors) {
            const nameElement = document.querySelector(selector);
            if (nameElement) {
                // 如果是块级元素，在后面插入
                if (window.getComputedStyle(nameElement).display === 'block') {
                    nameElement.appendChild(buttons);
                } else {
                    // 如果是行内元素，在父元素中插入
                    nameElement.parentNode.insertBefore(buttons, nameElement.nextSibling);
                }
                inserted = true;
                break;
            }
        }

        // 如果没找到合适位置，尝试插入到标题区域
        if (!inserted) {
            const titleArea = document.querySelector('h1') || document.querySelector('[class*="title"]');
            if (titleArea) {
                titleArea.appendChild(buttons);
                inserted = true;
            }
        }

        // 最后的备选方案：插入到页面顶部
        if (!inserted) {
            document.body.insertBefore(buttons, document.body.firstChild);
            buttons.style.cssText += `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 10000;
                background: rgba(255,255,255,0.9);
                padding: 5px;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            `;
        }
    }

    // 初始化
    function init() {
        insertButtons();

        // 监听页面变化（适用于SPA应用）
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(insertButtons, 1000); // 延迟1秒等待页面更新
            }
        }).observe(document, {subtree: true, childList: true});

        console.log('🎉 股票信息快速查询已加载！');
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();