// ==UserScript==
// @name         V2EX Solana Balance Checker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在V2EX个人主页显示Solana&V2EX资产余额、实时单价和总价值。总价值栏包含可点击复制的完整地址，并适配V2EX日/夜主题。
// @author       Lome (Modified by Gemini)
// @match        https://www.v2ex.com/member/*
// @match        https://v2ex.com/member/*
// @match        https://*.v2ex.com/member/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @connect      api.mainnet-beta.solana.com
// @connect      rpc.ankr.com
// @connect      solana-mainnet.rpc.extrnode.com
// @connect      api.geckoterminal.com
// @downloadURL https://update.greasyfork.org/scripts/545123/V2EX%20Solana%20Balance%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/545123/V2EX%20Solana%20Balance%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 配置信息 (Configuration)
    const V2EX_TOKEN_MINT_ADDRESS = '9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump';
    const SOL_MINT_ADDRESS = 'So11111111111111111111111111111111111111112';
    const RPC_ENDPOINTS = [ 'https://rpc.ankr.com/solana', 'https://api.mainnet-beta.solana.com', 'https://solana-mainnet.rpc.extrnode.com' ];

    // =================================================================================
    // 主函数 - 脚本核心逻辑
    // =================================================================================
    function main(anchorElement) {
        // 2. 从页面中查找用户的 Solana 地址
        function findAddressOnPage() {
            const scripts = document.querySelectorAll('script');
            for (const script of scripts) {
                if (script.textContent.includes('const address =')) {
                    const match = script.textContent.match(/const address = "([1-9A-HJ-NP-Za-km-z]{32,44})";/);
                    if (match && match[1]) { return match[1]; }
                }
            }
            return null;
        }

        const userSolanaAddress = findAddressOnPage();
        if (!userSolanaAddress) {
            console.error('V2EX Balance Checker: Could not find Solana address on page.');
            return;
        }

        // 3. 添加基础样式 (Layout Styles)
        GM_addStyle(`
            .solana-balance-box { background-color: var(--box-background-color); border-bottom: 1px solid var(--box-border-color); margin-bottom: 20px; }
            .solana-balance-table { width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: -1px; }
            .solana-balance-table th, .solana-balance-table td { padding: 12px; text-align: left; border-top: 1px solid var(--box-border-color); font-size: 14px; line-height: 1.6; vertical-align: middle; }
            .solana-balance-table th { background-color: var(--box-header-background-color); font-weight: bold; }
            .solana-balance-table td { font-family: var(--mono-font); word-wrap: break-word; }
            .total-row td { font-weight: bold; border-top: 2px solid var(--box-border-color); }
            .solana-balance-table th:nth-child(1), .solana-balance-table td:nth-child(1) { width: 15%; text-align: center; } /* Asset */
            .solana-balance-table th:nth-child(2), .solana-balance-table td:nth-child(2) { width: 35%; } /* Balance */
            .solana-balance-table th:nth-child(3), .solana-balance-table td:nth-child(3) { width: 25%; } /* Price */
            .solana-balance-table th:nth-child(4), .solana-balance-table td:nth-child(4) { width: 25%; } /* Value */
            .copy-address-link {
                color: var(--link-color); /* 使用 V2EX 原生链接颜色 */
                font-family: var(--mono-font);
                font-weight: normal;
                font-size: 12px;
                margin-left: 10px;
                cursor: pointer;
                text-decoration: none;
                word-break: break-all; /* 强制长地址换行 */
            }
            .copy-address-link:hover {
                text-decoration: underline;
            }
        `);

        // 4. 创建并插入 DOM 元素 (Create & Insert DOM)
        const container = document.createElement('div');
        container.className = 'solana-balance-box';
        container.innerHTML = `
            <table class="solana-balance-table">
                <thead>
                    <tr>
                        <th>Token</th>
                        <th>Balance</th>
                        <th>Price</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr id="sol-row">
                        <td>SOL</td>
                        <td id="sol-balance">Loading...</td>
                        <td id="sol-price">Loading...</td>
                        <td id="sol-value">Loading...</td>
                    </tr>
                    <tr id="v2ex-row">
                        <td>$V2EX</td>
                        <td id="v2ex-balance">Loading...</td>
                        <td id="v2ex-price">Loading...</td>
                        <td id="v2ex-value">Loading...</td>
                    </tr>
                    <tr id="total-row" class="total-row">
                        <td colspan="3">
                            <span>Address: </span>
                            <a id="copy-address-trigger" class="copy-address-link" href="#"></a>
                        </td>
                        <td id="total-value">Loading...</td>
                    </tr>
                </tbody>
            </table>
        `;
        anchorElement.parentNode.insertBefore(container, anchorElement.nextSibling);

        // 地址复制交互逻辑
        const copyTrigger = document.getElementById('copy-address-trigger');
        if (copyTrigger) {
            copyTrigger.textContent = userSolanaAddress; // 直接显示完整地址
            copyTrigger.title = '点击复制完整地址 (Click to copy full address)';

            copyTrigger.addEventListener('click', (event) => {
                event.preventDefault();
                navigator.clipboard.writeText(userSolanaAddress).then(() => {
                    copyTrigger.textContent = '已复制! (Copied!)';
                    setTimeout(() => {
                        copyTrigger.textContent = userSolanaAddress;
                    }, 2000);
                }).catch(err => {
                    console.error('V2EX Balance Checker: Could not copy address.', err);
                    copyTrigger.textContent = '复制失败';
                     setTimeout(() => {
                        copyTrigger.textContent = userSolanaAddress;
                    }, 2000);
                });
            });
        }

        // 5. 实时更新文本颜色以适配主题 (已修复)
        function updateTextColorsForTheme() {
            const nativeTextColor = getComputedStyle(document.body).getPropertyValue('--box-foreground-color').trim();
            const nativeFadeColor = getComputedStyle(document.body).getPropertyValue('--color-fade').trim();

            const cells = container.querySelectorAll('td');
            for (const cell of cells) {
                // 优先处理 Loading/Error 等状态的颜色
                if (cell.textContent.includes('Loading...') || cell.textContent.includes('Error') || cell.textContent.includes('N/A')) {
                    cell.style.setProperty('color', nativeFadeColor, 'important');
                } else {
                    // 为所有其他单元格应用标准文本颜色。CSS会确保里面的链接保持自己的颜色。
                    cell.style.setProperty('color', nativeTextColor, 'important');
                }
            }
            const headers = container.querySelectorAll('th');
            for (const header of headers) {
                header.style.setProperty('color', nativeTextColor, 'important');
            }
        }

        // 6. 监听主题变化
        const themeObserver = new MutationObserver(() => updateTextColorsForTheme());
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        updateTextColorsForTheme();

        // 7. 数据获取与处理 (Data Fetching & Processing)
        function makeRpcRequest(requestPayload) {
            return new Promise((resolve, reject) => {
                let endpointIndex = 0;
                function tryNextEndpoint() {
                    if (endpointIndex >= RPC_ENDPOINTS.length) {
                        reject(new Error('All RPC endpoints failed for method: ' + requestPayload.method));
                        return;
                    }
                    const currentEndpoint = RPC_ENDPOINTS[endpointIndex++];
                    GM_xmlhttpRequest({
                        method: 'POST', url: currentEndpoint, headers: { 'Content-Type': 'application/json' },
                        data: JSON.stringify(requestPayload), timeout: 8000,
                        onload: function(response) {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data.error) { tryNextEndpoint(); } else { resolve(data); }
                            } catch (e) { tryNextEndpoint(); }
                        },
                        onerror: tryNextEndpoint, ontimeout: tryNextEndpoint
                    });
                }
                tryNextEndpoint();
            });
        }

        function fetchSolBalance() {
            return makeRpcRequest({ jsonrpc: '2.0', id: 1, method: 'getBalance', params: [userSolanaAddress] })
                .then(data => data.result.value / 1e9);
        }

        function fetchV2exTokenBalance() {
            return makeRpcRequest({ jsonrpc: '2.0', id: 1, method: 'getTokenAccountsByOwner', params: [userSolanaAddress, { mint: V2EX_TOKEN_MINT_ADDRESS }, { encoding: 'jsonParsed' }] })
                .then(data => data.result.value.length > 0 ? parseFloat(data.result.value[0].account.data.parsed.info.tokenAmount.uiAmountString) : 0);
        }

        function fetchPriceFromGeckoTerminal(tokenAddress) {
            return new Promise((resolve, reject) => {
                const url = `https://api.geckoterminal.com/api/v2/networks/solana/tokens/${tokenAddress}/pools?page=1`;
                GM_xmlhttpRequest({
                    method: 'GET', url: url, timeout: 8000,
                    onload: function(response) {
                        try {
                            const parsed = JSON.parse(response.responseText);
                            if (parsed.data && parsed.data.length > 0) {
                                const price = parseFloat(parsed.data[0].attributes.base_token_price_usd);
                                resolve(price);
                            } else { resolve(null); }
                        } catch (e) { reject(new Error(`Failed to parse GeckoTerminal response for ${tokenAddress}: ${e.message}`)); }
                    },
                    onerror: () => reject(new Error(`GeckoTerminal request failed for ${tokenAddress}`)),
                    ontimeout: () => reject(new Error(`GeckoTerminal request timed out for ${tokenAddress}`))
                });
            });
        }

        function fetchPrices() {
            return Promise.all([
                fetchPriceFromGeckoTerminal(SOL_MINT_ADDRESS),
                fetchPriceFromGeckoTerminal(V2EX_TOKEN_MINT_ADDRESS)
            ]).then(([solPrice, v2exPrice]) => ({ solPrice, v2exPrice }));
        }

        async function fetchAllDataAndUpdateUI() {
            const [solBalanceResult, v2exBalanceResult, pricesResult] = await Promise.allSettled([
                fetchSolBalance(),
                fetchV2exTokenBalance(),
                fetchPrices()
            ]);

            let solBalance, v2exBalance, solPrice, v2exPrice;
            let totalValue = 0;
            let canCalcTotal = true;

            if (solBalanceResult.status === 'fulfilled') {
                solBalance = solBalanceResult.value;
                document.getElementById('sol-balance').textContent = solBalance.toFixed(6);
            } else {
                canCalcTotal = false; document.getElementById('sol-balance').textContent = 'Error';
                console.error("Failed to fetch SOL balance:", solBalanceResult.reason);
            }

            if (v2exBalanceResult.status === 'fulfilled') {
                v2exBalance = v2exBalanceResult.value;
                document.getElementById('v2ex-balance').textContent = v2exBalance.toLocaleString();
            } else {
                canCalcTotal = false; document.getElementById('v2ex-balance').textContent = 'Error';
                console.error("Failed to fetch V2EX balance:", v2exBalanceResult.reason);
            }

            if (pricesResult.status === 'fulfilled') {
                solPrice = pricesResult.value.solPrice;
                v2exPrice = pricesResult.value.v2exPrice;
                document.getElementById('sol-price').textContent = solPrice ? `$${solPrice.toFixed(4)}` : 'N/A';
                document.getElementById('v2ex-price').textContent = v2exPrice ? `$${v2exPrice.toFixed(4)}` : 'N/A';
            } else {
                canCalcTotal = false; document.getElementById('sol-price').textContent = 'Error';
                document.getElementById('v2ex-price').textContent = 'Error';
                console.error("Failed to fetch prices:", pricesResult.reason);
            }

            if (typeof solBalance === 'number' && typeof solPrice === 'number') {
                const solValue = solBalance * solPrice;
                totalValue += solValue;
                document.getElementById('sol-value').textContent = `$${solValue.toFixed(2)}`;
            } else {
                canCalcTotal = false; document.getElementById('sol-value').textContent = 'Error';
            }

            if (typeof v2exBalance === 'number' && typeof v2exPrice === 'number') {
                const v2exValue = v2exBalance * v2exPrice;
                totalValue += v2exValue;
                document.getElementById('v2ex-value').textContent = `$${v2exValue.toFixed(2)}`;
            } else {
                canCalcTotal = false;
                document.getElementById('v2ex-value').textContent = (v2exPrice === null && typeof v2exBalance === 'number') ? '$0.00' : 'Error';
            }

            document.getElementById('total-value').textContent = canCalcTotal ? `$${totalValue.toFixed(2)}` : 'Error';
            updateTextColorsForTheme();
        }

        fetchAllDataAndUpdateUI();
    }

    // =================================================================================
    // 初始化函数 - 等待页面加载完成后执行 main()
    // =================================================================================
    const maxTries = 20;
    let tries = 0;
    const initInterval = setInterval(() => {
        const anchorElement = document.querySelector('#Main .box');
        if (anchorElement) {
            clearInterval(initInterval);
            main(anchorElement);
        } else {
            tries++;
            if (tries > maxTries) {
                clearInterval(initInterval);
                console.error('V2EX Balance Checker: Could not find anchor element #Main .box after 10s.');
            }
        }
    }, 500);

})();