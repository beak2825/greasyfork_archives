// ==UserScript==
// @name 显示sunpumpDEV发币数量、资金来源和余额
// @namespace http://foo.bar/
// @version 4.1
// @description 显示sunpump DEV发币数量及代币列表、最多3条资金来源和TRX余额，单个API失败不影响其他显示。如果资金来源没有TAG，继续查询其来源，并以缩进形式显示。所有地址都有超链接。
// @author sdyu
// @match https://sunpump.meme/token/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505433/%E6%98%BE%E7%A4%BAsunpumpDEV%E5%8F%91%E5%B8%81%E6%95%B0%E9%87%8F%E3%80%81%E8%B5%84%E9%87%91%E6%9D%A5%E6%BA%90%E5%92%8C%E4%BD%99%E9%A2%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/505433/%E6%98%BE%E7%A4%BAsunpumpDEV%E5%8F%91%E5%B8%81%E6%95%B0%E9%87%8F%E3%80%81%E8%B5%84%E9%87%91%E6%9D%A5%E6%BA%90%E5%92%8C%E4%BD%99%E9%A2%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DELAY = 3000;
    const PROCESSED_ATTR = 'data-tokens-processed';
    const MAX_DEPTH = 3; // Maximum depth for tracing fund sources
    const INDENT_SIZE = 4; // Number of spaces for each indent level

    // Cache for storing already queried addresses and token counts
    const addressCache = new Map();
    const tokenCountCache = new Map();

    function createAddressLink(address) {
        return `<a href="https://tronscan.org/#/address/${address}" target="_blank" style="color: inherit; text-decoration: underline;">${address}</a>`;
    }

    async function handleAddressElement(addressElement) {
        if (addressElement.hasAttribute(PROCESSED_ATTR)) return;

        let address = addressElement.href.split('/').pop();
        let tronscanApiUrl = `https://apilist.tronscanapi.com/api/new/trx/transfer?sort=timestamp&count=false&limit=50&start=0&address=${address}&toAddress=${address}&filterTokenValue=1`;

        let infoDiv = document.createElement('div');
        infoDiv.style.fontSize = '16px';
        infoDiv.style.marginTop = '10px';
        infoDiv.style.whiteSpace = 'pre-wrap';
        infoDiv.style.fontFamily = 'Consolas, "Courier New", monospace';

        addressElement.parentNode.insertBefore(infoDiv, addressElement.nextSibling);
        addressElement.setAttribute(PROCESSED_ATTR, 'true');

        async function updateDisplay(content) {
            infoDiv.innerHTML += content;
        }

        async function getTokensCount(address) {
            if (tokenCountCache.has(address)) {
                return tokenCountCache.get(address);
            }

            let url = `https://api-v2.sunpump.meme/pump-api/token/search/by_owner?address=${address}&page=1&size=50&sort=id:DESC`;
            try {
                let response = await fetch(url);
                let data = await response.json();
                if (data.code === 0 && data.data.tokens.length > 0) {
                    let count = data.data.tokens.length;
                    let tokensInfo = data.data.tokens.map(token =>
                        `<a href="https://sunpump.meme/token/${token.contractAddress}" target="_blank" style="color: inherit; text-decoration: underline;">${token.name}</a>`
                    ).join(', ');
                    tokenCountCache.set(address, { count, tokensInfo });
                    return { count, tokensInfo };
                }
            } catch (error) {
                console.error('获取发币数量失败:', error);
            }
            tokenCountCache.set(address, { count: 0, tokensInfo: '' });
            return { count: 0, tokensInfo: '' };
        }

        // 显示主地址的发币数量和代币列表
        let { count: mainTokensCount, tokensInfo } = await getTokensCount(address);
        await updateDisplay(`曾发代币数量：${mainTokensCount} ${tokensInfo ? `(${tokensInfo})` : ''}\n\n最早TRX来源（最多3条）：\n`);

        async function getTransfers(address) {
            let url = `https://apilist.tronscanapi.com/api/new/trx/transfer?sort=timestamp&count=false&limit=50&start=0&address=${address}&toAddress=${address}&filterTokenValue=1`;
            try {
                let response = await fetch(url);
                let data = await response.json();
                if (data.data && data.data.length > 0) {
                    return data.data.slice(0, 3);
                }
            } catch (error) {
                console.error('获取转账记录失败:', error);
            }
            return [];
        }

        async function traceFundSource(address, depth = 0, prefix = '', visited = new Set()) {
            if (depth >= MAX_DEPTH || visited.has(address)) return '';
            visited.add(address);

            if (addressCache.has(address)) {
                return addressCache.get(address);
            }

            let transfers = await getTransfers(address);
            let result = '';

            for (let i = 0; i < transfers.length; i++) {
                let transfer = transfers[i];
                let source = transfer.transferFromTag || transfer.transferFromAddress;
                let amount = transfer.amount / 1000000;

                let indent = ' '.repeat(depth * INDENT_SIZE);
                let currentPrefix = prefix ? `${prefix}.${i + 1}` : `${i + 1}`;
                result += `${indent}${currentPrefix}.\n`;
                result += `${indent}    ${transfer.transferFromTag ? source : createAddressLink(source)}: ${amount.toFixed(2)} TRX`;

                let tokensCount = 0;
                if (!transfer.transferFromTag) {
                    let { count } = await getTokensCount(source);
                    tokensCount = count;
                    if (tokensCount > 0) {
                        result += ` (发币数：${tokensCount})`;
                    }
                }
                result += '\n';

                if (!transfer.transferFromTag && depth < MAX_DEPTH - 1) {
                    let furtherSource = await traceFundSource(transfer.transferFromAddress, depth + 1, currentPrefix, visited);
                    if (furtherSource) {
                        result += furtherSource;
                    }
                }
            }

            addressCache.set(address, result);
            return result;
        }

        let content = await traceFundSource(address);
        await updateDisplay(content);
    }

    async function processAddressElement() {
        let addressElement = document.evaluate(
            '/html/body/div[1]/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/div[1]/a',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (addressElement) {
            await handleAddressElement(addressElement);
        }
    }

    setTimeout(processAddressElement, DELAY);

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(processAddressElement, DELAY);
        }
    }).observe(document, {subtree: true, childList: true});
})();
