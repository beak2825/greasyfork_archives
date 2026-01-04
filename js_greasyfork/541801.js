// ==UserScript==
// @name         拖拽文字搜索|拖拽图片下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Drag text to search or drag images to download
// @author       Dost
// @match        *://*/*
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541801/%E6%8B%96%E6%8B%BD%E6%96%87%E5%AD%97%E6%90%9C%E7%B4%A2%7C%E6%8B%96%E6%8B%BD%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/541801/%E6%8B%96%E6%8B%BD%E6%96%87%E5%AD%97%E6%90%9C%E7%B4%A2%7C%E6%8B%96%E6%8B%BD%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认搜索引擎配置
    const defaultEngines = [
        { name: "Google", url: "https://www.google.com/search?q={query}", enabled: false },
        { name: "Bing", url: "https://www.bing.com/search?q={query}", enabled: false },
        { name: "Yandex", url: "https://yandex.com/search/?text={query}", enabled: false },
        { name: "DuckDuckGo", url: "https://duckduckgo.com/?q={query}", enabled: false }
    ];

    // 图片扩展名列表
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];

    // 初始化配置
    let engines = GM_getValue('engines', defaultEngines);
    let tabBehavior = GM_getValue('tabBehavior', 1);

    // 注册脚本菜单
    function registerMenu() {
        GM_registerMenuCommand('🔍 设置搜索引擎', setSearchEngines);
        GM_registerMenuCommand('🔄 设置标签页行为', setTabBehavior);
    }

    // 设置搜索引擎
    function setSearchEngines() {
        let engineList = engines.map((engine, index) =>
            `${engine.enabled ? '✅' : '❌'} ${index + 1}. ${engine.name}`).join('\n');

        const input = prompt(
            `输入需要启用的引擎序号（用逗号分隔）：\n\n${engineList}\n\n示例：输入 "1,3"`,
            engines.map((e, i) => e.enabled ? i + 1 : '').filter(Boolean).join(',')
        );

        if (input === null) return;

        engines.forEach(engine => engine.enabled = false);

        if (input.trim() !== '') {
            input.split(',').forEach(num => {
                const index = parseInt(num.trim()) - 1;
                if (index >= 0 && index < engines.length) engines[index].enabled = true;
            });
        }

        GM_setValue('engines', engines);
        alert(`已启用：${engines.filter(e => e.enabled).map(e => e.name).join(', ') || "无"}`);
    }

    // 设置标签页行为
    function setTabBehavior() {
        const behaviors = [
            "1. 在新标签页打开并跳转",
            "2. 在新标签页打开但不跳转",
            "3. 在当前标签页打开"
        ];

        const currentBehavior = behaviors[tabBehavior - 1];
        const choice = prompt(
            `选择标签页行为（输入序号）：\n\n${behaviors.join('\n')}\n\n当前：${currentBehavior}`,
            tabBehavior
        );

        if (choice && [1, 2, 3].includes(parseInt(choice))) {
            tabBehavior = parseInt(choice);
            GM_setValue('tabBehavior', tabBehavior);
            alert(`已设置为：${behaviors[tabBehavior - 1]}`);
        }
    }

    // 检查是否是图片URL
    function isImageUrl(url) {
        try {
            const pathname = new URL(url).pathname.toLowerCase();
            const ext = pathname.split('.').pop();
            return imageExtensions.includes(ext);
        } catch {
            return false;
        }
    }

    // 执行搜索
    function searchText(query) {
        // 如果是图片URL则不搜索
        if (isImageUrl(query)) return;

        engines.forEach(engine => {
            if (engine.enabled) {
                const url = engine.url.replace('{query}', encodeURIComponent(query));
                switch (tabBehavior) {
                    case 1: GM_openInTab(url, { active: true }); break;
                    case 2: GM_openInTab(url, { active: false }); break;
                    case 3: window.location.href = url; break;
                }
            }
        });
    }

    // 生成图片文件名
    function generateImageFilename() {
        const domain = window.location.hostname
            .replace('www.', '')
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase();

        const now = new Date();
        const timestamp = [
            now.getFullYear(),
            (now.getMonth()+1).toString().padStart(2, '0'),
            now.getDate().toString().padStart(2, '0'),
            now.getHours().toString().padStart(2, '0'),
            now.getMinutes().toString().padStart(2, '0'),
            now.getSeconds().toString().padStart(2, '0')
        ].join('');

        return `${domain}_${timestamp}.jpg`;
    }

    // 拖拽事件处理
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.dataTransfer.setData('text/uri-list', e.target.src);
            e.dataTransfer.effectAllowed = 'copy';
        } else if (window.getSelection().toString().trim()) {
            e.dataTransfer.setData('text/plain', window.getSelection().toString().trim());
        }
    });

    document.addEventListener('dragend', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            const imageUrl = e.target.src;
            const filename = generateImageFilename();

            GM_download({
                url: imageUrl,
                name: filename,
                saveAs: true, // 让用户选择保存位置
                onload: () => GM_notification({
                    title: '图片下载成功',
                    text: `已保存为: ${filename}`,
                    timeout: 2000
                }),
                onerror: (err) => GM_notification({
                    title: '下载失败',
                    text: `错误: ${err.details}`,
                    timeout: 3000
                })
            });
        }
    });

    document.addEventListener('drop', (e) => {
        const text = e.dataTransfer.getData('text/plain');
        if (text && !isImageUrl(text)) {  // 只搜索非图片URL的文本
            e.preventDefault();
            searchText(text);
        }
    });

    document.addEventListener('dragover', (e) => e.preventDefault());

    // 初始化
    registerMenu();
})();