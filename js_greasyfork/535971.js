// ==UserScript==
// @name         Etherscan Priority Fee Calculator | 以太坊优先费用计算器
// @name:zh-CN   以太坊优先费用计算器
// @name:en      Etherscan Priority Fee Calculator
// @namespace    https://github.com/yuouiu/etherscan-priority-fee-calculator
// @version      1.0.0
// @description  在Etherscan交易页面显示实际的Priority Fee (小费) 计算结果，支持EIP-1559交易
// @description:zh-CN  在Etherscan交易页面显示实际的Priority Fee (小费) 计算结果，支持EIP-1559交易
// @description:en   Display actual Priority Fee calculation results on Etherscan transaction pages, supporting EIP-1559 transactions
// @author       yuouiu
// @match        https://etherscan.io/tx/*
// @match        https://*.etherscan.io/tx/*
// @license      MIT
// @grant        none
// @supportURL   https://github.com/yuouiu/etherscan-priority-fee-calculator
// @homepage     https://github.com/yuouiu/etherscan-priority-fee-calculator
// @icon         https://www.ethereum.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/535971/Etherscan%20Priority%20Fee%20Calculator%20%7C%20%E4%BB%A5%E5%A4%AA%E5%9D%8A%E4%BC%98%E5%85%88%E8%B4%B9%E7%94%A8%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/535971/Etherscan%20Priority%20Fee%20Calculator%20%7C%20%E4%BB%A5%E5%A4%AA%E5%9D%8A%E4%BC%98%E5%85%88%E8%B4%B9%E7%94%A8%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ENDPOINT = "https://eth.blockrazor.xyz";

    // 辅助函数：将16进制转换为整数
    function hexToInt(hexStr) {
        return hexStr && hexStr.startsWith('0x') ? parseInt(hexStr, 16) : 0;
    }

    // 辅助函数：将Wei转换为Gwei
    function weiToGwei(weiStr) {
        const wei = hexToInt(weiStr);
        return wei / 1e9;
    }

    // 获取交易数据
    async function getTransactionData(txHash) {
        const payload = {
            "jsonrpc": "2.0",
            "method": "eth_getTransactionByHash",
            "params": [txHash],
            "id": 1
        };
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        return await response.json();
    }

    // 获取区块数据
    async function getBlockData(blockNumber) {
        const payload = {
            "jsonrpc": "2.0",
            "method": "eth_getBlockByNumber",
            "params": [blockNumber, false],
            "id": 1
        };
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        return await response.json();
    }

    // 获取区块收据数据
    async function getBlockReceipts(txHash) {
        const payload = {
            "jsonrpc": "2.0",
            "method": "eth_getTransactionReceipt",
            "params": [txHash],
            "id": 1
        };
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        return await response.json();
    }

    // 计算Priority Fee
    function calculatePriorityFee(maxPriorityFeePerGas, maxFeePerGas, baseFeePerGas, gasUsed) {
        const basePriorityFee = Math.max(0, Math.min(
            weiToGwei(maxPriorityFeePerGas),
            weiToGwei(maxFeePerGas) - weiToGwei(baseFeePerGas)
        ));
        return basePriorityFee * hexToInt(gasUsed);
    }

    // 创建显示元素
    function createPriorityFeeDisplay() {
        const container = document.createElement('div');
        container.style.padding = '10px';
        container.style.margin = '10px 0';
        container.style.backgroundColor = '#f8f9fa';
        container.style.border = '1px solid #dee2e6';
        container.style.borderRadius = '4px';
        container.id = 'priorityFeeContainer';
        return container;
    }

    // 主函数
    async function main() {
        try {
            // 从URL中获取交易哈希
            const txHash = window.location.pathname.split('/').pop();
            if (!txHash) return;

            // 获取交易数据
            const txData = await getTransactionData(txHash);
            if (!txData.result) return;

            // 获取区块数据
            const blockData = await getBlockData(txData.result.blockNumber);
            if (!blockData.result) return;

            // 获取交易收据数据
            const receiptData = await getBlockReceipts(txHash);
            if (!receiptData.result) return;

            // 计算Priority Fee
            const priorityFee = calculatePriorityFee(
                txData.result.maxPriorityFeePerGas,
                txData.result.maxFeePerGas,
                blockData.result.baseFeePerGas,
                receiptData.result.gasUsed
            );

            // 创建显示元素
            const container = createPriorityFeeDisplay();
            const priorityFeeETH = priorityFee / 1e9;
            container.innerHTML = `
                <div>Priority Fee: ${priorityFee.toFixed(9)} Gwei (${priorityFeeETH.toFixed(18)} ETH)</div>
            `;

            // 插入到页面中
            const targetElement = document.querySelector('h1').parentElement;
            if (targetElement) {
                targetElement.after(container);
            }

        } catch (error) {
            console.error('计算Priority Fee时发生错误:', error);
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', main);
})();