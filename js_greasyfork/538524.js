// ==UserScript==
// @name         京东一键保价自动点击
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动点击京东一键保价按钮并处理确认流程
// @author       YourName
// @match        https://h5.m.jd.com/pb/016454810/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538524/%E4%BA%AC%E4%B8%9C%E4%B8%80%E9%94%AE%E4%BF%9D%E4%BB%B7%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/538524/%E4%BA%AC%E4%B8%9C%E4%B8%80%E9%94%AE%E4%BF%9D%E4%BB%B7%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主按钮选择器
    const MAIN_BUTTON_SELECTORS = [
        '#one-btn',
        'button:contains("一键价保")',
        'button:contains("一键保价")',
        'button:contains("价保")',
        '.price-protect-btn'
    ];

    // 确认按钮XPath
    const CONFIRM_BUTTON_XPATH = '//*[@id="root"]/div/div[18]/div/div/div[4]/span[2]';
    
    // 完成检测XPath
    const COMPLETION_XPATHS = [
        '//*[@id="root"]/div/div[6]/div/div[1]/div[3]', // 去探索低价好物
        '//div[contains(text(),"价保完成")]', // 价保完成提示
        '//div[contains(text(),"暂无价保")]'  // 无价保提示
    ];

    // 配置参数
    const CONFIG = {
        initialDelay: 1000,     // 点击前等待1秒
        checkInterval: 1000,    // 检查间隔1秒
        maxAttempts: 15         // 最大尝试次数
    };

    let attempts = 0;
    let isProcessing = false;
    let checkInterval;

    function startProcess() {
        if (isProcessing) return;
        isProcessing = true;
        
        console.log('开始自动价保流程...');
        
        // 初始等待1秒
        setTimeout(() => {
            clickMainButton();
        }, CONFIG.initialDelay);
    }

    function clickMainButton() {
        attempts++;
        console.log(`尝试查找主按钮 (${attempts}/${CONFIG.maxAttempts})`);

        const button = findClickableButton(MAIN_BUTTON_SELECTORS);
        
        if (button) {
            console.log('找到主按钮，正在点击...', button);
            button.click();
            console.log('主按钮已点击');
            
            // 开始检查确认按钮
            checkInterval = setInterval(checkConfirmButton, CONFIG.checkInterval);
        } else if (attempts < CONFIG.maxAttempts) {
            setTimeout(clickMainButton, CONFIG.checkInterval);
        } else {
            console.log('未找到主按钮，停止尝试');
            isProcessing = false;
        }
    }

    function checkConfirmButton() {
        // 先检查是否已完成
        if (checkCompletion()) {
            console.log('检测到价保已完成，停止流程');
            clearInterval(checkInterval);
            isProcessing = false;
            return;
        }

        // 查找确认按钮
        const result = document.evaluate(
            CONFIRM_BUTTON_XPATH,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        
        const confirmButton = result.singleNodeValue;
        
        if (confirmButton && isClickable(confirmButton)) {
            console.log('找到确认按钮，正在点击...', confirmButton);
            clearInterval(checkInterval);
            confirmButton.click();
            console.log('确认按钮已点击');
            
            // 点击后继续检查完成状态
            checkInterval = setInterval(checkCompletionOnly, CONFIG.checkInterval);
        }
    }

    function checkCompletion() {
        for (const xpath of COMPLETION_XPATHS) {
            const result = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            );
            
            if (result.singleNodeValue) {
                return true;
            }
        }
        return false;
    }

    function checkCompletionOnly() {
        if (checkCompletion()) {
            console.log('检测到价保已完成，停止流程');
            clearInterval(checkInterval);
            isProcessing = false;
        }
    }

    function findClickableButton(selectors) {
        for (const selector of selectors) {
            let button = document.querySelector(selector);
            
            if (!button && selector.startsWith('#')) {
                const xpath = `//*[@id="${selector.replace('#', '')}"]`;
                const result = document.evaluate(
                    xpath, document, null, 
                    XPathResult.FIRST_ORDERED_NODE_TYPE, null
                );
                button = result.singleNodeValue;
            }
            
            if (button && isClickable(button)) {
                return button;
            }
        }
        return null;
    }

    function isClickable(element) {
        return (
            !element.disabled &&
            element.offsetWidth > 0 &&
            element.offsetHeight > 0 &&
            window.getComputedStyle(element).display !== 'none' &&
            window.getComputedStyle(element).visibility !== 'hidden'
        );
    }

    // 启动流程
    if (document.readyState === 'complete') {
        startProcess();
    } else {
        window.addEventListener('load', startProcess);
    }
})();