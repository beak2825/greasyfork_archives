// ==UserScript==
// @name         Figma CN
// @match        *://*.figma.com/*
// @icon         https://cdn.jim-nielsen.com/macos/1024/figma-2021-05-05.png
// @license      GPL-3.0 license
// @version      1.4.0
// @namespace Violentmonkey Scripts
// @description from figma.cool
// @downloadURL https://update.greasyfork.org/scripts/526503/Figma%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/526503/Figma%20CN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 远程脚本的 URL
    const contentScriptUrl = 'https://raw.githubusercontent.com/Figma-Cool/figmaCN/refs/heads/master/js/content.js';
    const translationsScriptUrl = 'https://raw.githubusercontent.com/Figma-Cool/figmaCN/refs/heads/master/js/translations.js';

    console.log('FigmaCN 脚本开始加载...');

    Promise.all([
        fetch(contentScriptUrl).then(res => res.text()),
        fetch(translationsScriptUrl).then(res => res.text())
    ])
    .then(([contentScriptText, translationsScriptText]) => {
        console.log('FigmaCN: 远程脚本已成功获取。');

        // 步骤 1: 解析翻译数据
        const getTranslationsData = new Function(translationsScriptText + '; return translations;');
        const translationData = getTranslationsData();

        if (!translationData || !Array.isArray(translationData) || translationData.length === 0) {
            throw new Error('FigmaCN: 未能成功解析翻译数据，或者数据为空。');
        }
        console.log(`FigmaCN: 已加载 ${translationData.length} 条翻译词条。`);

        // 步骤 2: 准备并执行主逻辑
        // 移除远程脚本中会引发错误的自动执行调用 `loadTranslationData()`
        // 使用正则表达式以应对可能的空格差异，增强稳定性
        const modifiedContentScript = contentScriptText.replace(/loadTranslationData\s*\(\s*\);/g, '//$& -- 被用户脚本禁用');

        // 创建一个安全的、独立的执行器函数
        // 这个函数接收一个名为 `allData` 的参数
        // 函数体是修改后的远程脚本，它会定义 `initializeTranslation` 函数，然后我们紧接着调用它
        const mainLogicRunner = new Function('allData', `
            // --- 以下是远程 content.js 脚本的内容 ---
            ${modifiedContentScript}
            // --- 远程脚本内容结束 ---

            // 在这个独立的作用域内，直接调用刚刚被定义的函数
            if (typeof initializeTranslation === 'function') {
                console.log('FigmaCN: 启动翻译引擎...');
                initializeTranslation(allData);
                console.log('FigmaCN: 翻译功能已激活！');
            } else {
                throw new Error('FigmaCN: 核心函数 initializeTranslation 未找到，可能是远程脚本已更新。');
            }
        `);

        // 步骤 3: 运行执行器，并传入我们获取的翻译数据
        mainLogicRunner(translationData);
    })
    .catch(error => {
        console.error('FigmaCN: 加载或执行脚本时发生严重错误:', error);
    });
})();