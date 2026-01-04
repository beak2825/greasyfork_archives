// ==UserScript==
// @name         TTG 种子标题屏蔽器
// @namespace    http://tampermonkey.net/
// @version      2025.07.27
// @description  在 totheglory.im 的种子列表页面，根据自定义关键词屏蔽整行。
// @author       Gemini-x3c
// @match        https://totheglory.im/browse.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=totheglory.im
// @license      MIT
// @homepageURL  https://greasyfork.org/zh-CN/scripts/543742-ttg-%E7%A7%8D%E5%AD%90%E6%A0%87%E9%A2%98%E5%B1%8F%E8%94%BD%E5%99%A8
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/543742/TTG%20%E7%A7%8D%E5%AD%90%E6%A0%87%E9%A2%98%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543742/TTG%20%E7%A7%8D%E5%AD%90%E6%A0%87%E9%A2%98%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    // 从 Tampermonkey 存储中读取用户设置的关键词
    // 如果是第一次使用，则使用一个示例列表
    const initialKeywords = '國小,國中,初中,小學';
    let blockedKeywords = GM_getValue('blockedKeywords', initialKeywords);

    // --- 核心功能 ---

    /**
     * 主执行函数
     */
    function filterTopics() {
        // 将关键词字符串分割成数组，并进行处理
        // 1. .split(',') 按逗号分割
        // 2. .map(k => k.trim()) 去除每个关键词前后的空格
        // 3. .filter(k => k) 过滤掉因多余逗号产生的空字符串
        // 4. .map(k => k.toLowerCase()) 全部转为小写，用于不区分大小写的匹配
        const keywords = blockedKeywords.split(',').map(k => k.trim()).filter(k => k).map(k => k.toLowerCase());

        // 如果没有设置关键词，则不执行任何操作
        if (keywords.length === 0) {
            console.log('TTG 屏蔽器: 未设置任何关键词。');
            return;
        }

        // 选取所有帖子的行元素
        // 根据你提供的HTML，帖子的tr都带有 'hover_hr' class
        const rows = document.querySelectorAll('tr.hover_hr');
        let hiddenCount = 0;

        rows.forEach(row => {
            // 寻找帖子标题元素
            // 标题位于 <a href="/t/..."><b>...</b></a> 结构中
            const titleElement = row.querySelector('a[href*="/t/"] > b');

            if (titleElement) {
                // 获取标题的完整文本，并转为小写
                const titleText = titleElement.innerText.toLowerCase();

                // 检查标题是否包含任意一个屏蔽词
                // .some() 方法会在找到第一个匹配项后立即返回 true，效率较高
                const shouldBeBlocked = keywords.some(keyword => titleText.includes(keyword));

                if (shouldBeBlocked) {
                    // 如果需要屏蔽，则隐藏整个 <tr> 元素
                    row.style.display = 'none';
                    hiddenCount++;
                }
            }
        });

        if (hiddenCount > 0) {
            console.log(`TTG 屏蔽器: 已成功屏蔽 ${hiddenCount} 个帖子。`);
        }
    }

    /**
     * 设置关键词的函数
     */
    function setKeywords() {
        const currentKeywords = GM_getValue('blockedKeywords', initialKeywords);
        const newKeywords = prompt('请输入要屏蔽的关键词，请用英文逗号 (,) 分隔：', currentKeywords);

        // 如果用户点击了 "确定" (而不是 "取消")
        if (newKeywords !== null) {
            GM_setValue('blockedKeywords', newKeywords);
            alert('关键词已更新，页面将自动刷新以应用新的规则。');
            // 刷新页面以应用新规则
            location.reload();
        }
    }

    // --- 脚本初始化 ---

    // 在 Tampermonkey 菜单中注册一个命令，用于修改关键词
    GM_registerMenuCommand('设置屏蔽关键词', setKeywords);

    // 页面加载完成后执行过滤函数
    window.addEventListener('load', filterTopics);

})();