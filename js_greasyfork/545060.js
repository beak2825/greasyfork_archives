// ==UserScript==
// @name         ZM勋章赠送助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  电力用不完的大佬专属
// @author       You
// @match        *://*/medal*
// @match        *://*/badge*
// @match        *://*/userdetails.php*
// @match        *://*/user.php*
// @match        *://*/profile.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/545060/ZM%E5%8B%8B%E7%AB%A0%E8%B5%A0%E9%80%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/545060/ZM%E5%8B%8B%E7%AB%A0%E8%B5%A0%E9%80%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const medalManager = {
        selectedMedals: GM_getValue('selected_medals', []),
        currentPanel: 'main'
    };

    // 获取保存的位置或使用默认位置
    const savedPosition = GM_getValue('medal_float_btn_position', null);

    const style = `
        #medal-float-btn {
            position: fixed;
            ${savedPosition ? `left: ${savedPosition.x}px; top: ${savedPosition.y}px;` : 'bottom: 20px; right: 20px;'}
            width: 120px; height: 120px;
            z-index: 10001; cursor: pointer; display: flex; flex-direction: column;
            justify-content: center; align-items: center;
            transition: all 0.3s;
        }
        #medal-float-btn:hover {
            transform: scale(1.1);
        }
        #img-pool-gif-box {
            position: relative;
            width: 80px;
            height: 80px;
        }
        #img-pool-gif-box img {
            position: absolute;
            top: 0;
            left: 0;
            width: 80px;
            height: 80px;
            transition: opacity 0.5s ease-in-out;
        }
        #medal-panel {
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%); width: 1000px; max-height: 100vh;
            background: #fff; border: 2px solid rgb(254, 177, 71); border-radius: 8px;
            box-shadow: 0 8px 32px rgba(254, 177, 71, 0.3); z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #333; display: none;
        }
        #medal-header {
            background: rgb(254, 177, 71);
            color: #000; padding: 16px 20px; font-weight: 600; font-size: 16px;
            cursor: move; display: flex; justify-content: space-between; align-items: center;
            border-radius: 6px 6px 0 0;
        }
        #medal-content {
            max-height: 85vh; overflow-y: auto; padding: 20px;
            scrollbar-width: thin; scrollbar-color: rgb(254, 177, 71) #f5f5f5;
        }
        #medal-content::-webkit-scrollbar { width: 6px; }
        #medal-content::-webkit-scrollbar-track { background: #f5f5f5; border-radius: 3px; }
        #medal-content::-webkit-scrollbar-thumb { background: rgb(254, 177, 71); border-radius: 3px; }

        .panel-buttons {
            display: flex; flex-wrap: nowrap; gap: 10px; margin-bottom: 20px; justify-content: center;
        }
        .panel-buttons .btn {
            flex: 1; white-space: nowrap;
        }
        .main-panel-buttons {
            display: flex; gap: 10px; justify-content: center;
        }
        .main-panel-buttons .btn {
            flex: 1; justify-content: center;
        }
        
        /* 新增：两列布局样式 */
        .two-column-layout {
            display: flex;
            gap: 40px;
            margin-top: 20px;
        }
        .column {
            flex: 1;
            min-width: 500px;
        }
        .column-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid rgb(254, 177, 71);
        }
        .column-title {
            color: rgb(254, 177, 71);
            font-weight: 600;
            font-size: 16px;
            margin: 0;
        }
        .search-box {
            flex: 1;
            margin-left: 15px;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }
        .search-box:focus {
            border-color: rgb(254, 177, 71);
        }
        .search-box::placeholder {
            color: #999;
        }
        
        /* 新增：复选框选项样式 */
        .filter-options {
            display: flex !important;
            flex-direction: row !important;
            gap: 10px;
            margin-bottom: 15px;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
            align-items: center;
            flex-wrap: nowrap !important;
            justify-content: flex-start;
            min-height: 40px;
            width: 100%;
        }
        
        .filter-options label {
            display: inline-flex !important;
            align-items: center;
            font-size: 14px;
            color: #333;
            cursor: pointer;
            white-space: nowrap;
            margin: 0;
            flex-shrink: 0;
            float: left !important;
            clear: none !important;
        }
        
        /* 强制复选框在同一行 */
        .filter-options label:first-child {
            margin-right: 10px;
        }
        
        .filter-options label:last-child {
            margin-right: 0;
        }
        
        /* 确保复选框容器不会换行 */
        .filter-options {
            overflow: hidden;
            white-space: nowrap;
        }
        
        /* 强制复选框标签不换行 */
        .filter-options label {
            white-space: nowrap !important;
            word-wrap: normal !important;
            word-break: keep-all !important;
        }
        
        /* Toast 通知样式 */
        .toast-notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100%);
            background: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10002;
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .toast-notification.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        
        .toast-notification.success {
            background: #27ae60;
        }
        
        .toast-notification.error {
            background: #e74c3c;
        }
        
        .toast-notification.warning {
            background: #f39c12;
        }
        
        .toast-notification.info {
            background: #3498db;
        }
        
        /* 独立滚动条样式 */
        .medals-container {
            max-height: 400px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgb(254, 177, 71) #f5f5f5;
        }
        
        .medals-container::-webkit-scrollbar {
            width: 6px;
        }
        
        .medals-container::-webkit-scrollbar-track {
            background: #f5f5f5;
            border-radius: 3px;
        }
        
        .medals-container::-webkit-scrollbar-thumb {
            background: rgb(254, 177, 71);
            border-radius: 3px;
        }
        
        .user-list-container {
            max-height: 400px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #3498db #f5f5f5;
        }
        
        .user-list-container::-webkit-scrollbar {
            width: 6px;
        }
        
        .user-list-container::-webkit-scrollbar-track {
            background: #f5f5f5;
            border-radius: 3px;
        }
        
        .user-list-container::-webkit-scrollbar-thumb {
            background: #3498db;
            border-radius: 3px;
        }
            padding: 8px 0;
            min-width: fit-content;
            flex-shrink: 0;
        }
        
        .filter-options input[type="checkbox"] {
            margin-right: 8px;
            margin-left: 0;
            flex-shrink: 0;
            width: 16px;
            height: 16px;
        }
        
        .medal-item {
            border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 8px;
            background: #f9f9f9; display: flex; align-items: flex-start; transition: all 0.2s;
        }
        .medal-item:hover { background: rgba(254, 177, 71, 0.1); border-color: rgb(254, 177, 71); }
        .medal-checkbox { margin-right: 12px; margin-top: 2px; }
        .medal-info { flex: 1; }
        .medal-name { font-weight: 600; color: #333; margin-bottom: 6px; }
        .medal-price { color: rgb(254, 177, 71); font-size: 14px; margin-bottom: 4px; font-weight: 500; }
        .medal-time { color: #666; font-size: 13px; }
        .medal-disabled { opacity: 0.5; background: #f0f0f0; }
        .filter-option { margin-bottom: 15px; color: #333; }
        .filter-option label { display: flex; align-items: center; font-size: 14px; }
        .filter-option input { margin-right: 8px; }

        .user-input {
            width: 100%; padding: 12px; margin: 8px 0;
            border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;
            background: #fff; color: #333; font-size: 14px;
            transition: border-color 0.2s;
        }
        .user-input:focus { border-color: rgb(254, 177, 71); outline: none; box-shadow: 0 0 0 2px rgba(254, 177, 71, 0.2); }
        .user-input::placeholder { color: #999; }

        .btn {
            background: rgb(254, 177, 71); color: #000; border: none; padding: 10px 16px;
            border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;
            transition: all 0.2s; display: inline-flex; align-items: center;
        }
        .btn:hover { background: rgb(255, 190, 90); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(254, 177, 71, 0.3); }
        .btn-danger { background: #ff6b6b; color: white; }
        .btn-danger:hover { background: #ff5252; }
        .btn-success { background: #28a745; color: white; }
        .btn-success:hover { background: #218838; }
        .btn-small { padding: 6px 12px; font-size: 12px; }

        .user-item {
            padding: 12px; border-bottom: 1px solid #eee; display: flex;
            justify-content: space-between; align-items: center;
            transition: background-color 0.2s;
        }
        .user-item:hover { background-color: rgba(254, 177, 71, 0.1); }
        .user-item:last-child { border-bottom: none; }
        .user-actions { display: flex; gap: 8px; align-items: center; }

        .status { font-size: 12px; padding: 4px 8px; border-radius: 4px; font-weight: 500; }
        .status-not-sent { background: rgb(254, 177, 71); color: #000; }
        .status-sent { background: #28a745; color: white; }
        .status-owned { background: #6c757d; color: white; }

        .close-btn {
            background: none; border: none; color: #000; font-size: 18px;
            cursor: pointer; padding: 4px; border-radius: 4px;
            transition: background-color 0.2s;
        }
        .close-btn:hover { background-color: rgba(0, 0, 0, 0.1); }
        .panel-hidden { display: none; }
        .select-all { margin-bottom: 15px; color: #333; }
        .select-all label { display: flex; align-items: center; font-size: 14px; font-weight: 500; }
        .select-all input { margin-right: 8px; }

        .user-select-item {
            padding: 12px 0; border-bottom: 1px solid #eee; display: flex;
            justify-content: space-between; align-items: center;
            transition: background-color 0.2s;
        }
        .user-select-item:hover { background-color: rgba(254, 177, 71, 0.1); }
        .user-select-item:last-child { border-bottom: none; }

        h3 {
            color: rgb(254, 177, 71); margin: 0 0 20px 0; font-weight: 600; font-size: 18px;
            padding-bottom: 10px; border-bottom: 2px solid rgb(254, 177, 71);
        }

        #user-list {
            max-height: 350px; overflow-y: auto;
            border: 1px solid #ddd; border-radius: 8px;
            margin-top: 15px; background: #fff;
        }

        .medal-status-row {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 8px;
        }

        .medal-select-btn {
            background: #fff; color: rgb(254, 177, 71); border: 1px solid rgb(254, 177, 71);
            font-size: 12px; padding: 4px 8px;
        }
        .medal-select-btn:hover {
            background: rgb(254, 177, 71); color: #000;
        }

        .user-list-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background-color: #f5f5f5;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
            box-sizing: border-box;
        }

        .btn-center {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .user-item, .user-select-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            border-bottom: 1px solid #eee;
            box-sizing: border-box;
        }

        .user-list-header > div,
        .user-item > div,
        .user-select-item > div {
            display: flex;
            align-items: center;
            flex: 1;
        }

        .user-list-header span:nth-child(1),
        .user-item span:nth-child(1),
        .user-select-item span:nth-child(1) {
            min-width: 20px;
            text-align: center;
        }

        .user-list-header span:nth-child(2),
        .user-item span:nth-child(2),
        .user-select-item span:nth-child(2) {
            min-width: 80px;
            text-align: center;
        }

        .user-list-header span:nth-child(3),
        .user-item span:nth-child(3),
        .user-select-item span:nth-child(3) {
            flex: 1;
            text-align: left;
            padding-left: 10px;
        }

        .user-actions {
            flex: 0 0 120px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
        }
        
        /* 新增：用户选择相关样式 */
        .medal-user-checkbox {
            margin-right: 8px;
        }
        
        .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .status-not-sent {
            background: #f8f9fa;
            color: #6c757d;
        }
        
        .status-owned {
            background: #d4edda;
            color: #155724;
        }
        
        .status-sent {
            background: #d1ecf1;
            color: #0c5460;
        }
        
        .btn-small {
            padding: 4px 8px;
            font-size: 12px;
            border-radius: 4px;
        }
    `;

    document.head.insertAdjacentHTML('beforeend', `<style>${style}</style>`);

    document.body.insertAdjacentHTML('beforeend', `
        <div id="medal-float-btn" title="ZM勋章赠送助手">
            <div id="img-pool-gif-box">
                <img src="https://img1.pixhost.to/images/7793/629934819_.gif" alt="勋章图标" style="width:100%;height:100%;">
            </div>
        </div>
        <div id="medal-panel">
            <div id="medal-header">
                <span>ZM勋章赠送助手</span>
                <button class="close-btn" title="关闭">×</button>
            </div>
            <div id="medal-content">
                <div id="main-panel">
                    <div class="main-panel-buttons">
                        <button class="btn btn-center" id="show-medal-btn">🏅 勋章管理</button>
                        <button class="btn btn-center" id="show-user-btn">👥 用户管理</button>
                    </div>
                </div>

                <div id="medal-manage-panel" class="panel-hidden">
                    <h3>勋章管理</h3>
                    <div class="panel-buttons">
                        <button class="btn btn-center" id="back-to-main-1">← 返回</button>
                        <button class="btn btn-center" id="get-medals-btn">🔄 获取勋章</button>
                        <button class="btn btn-success btn-center" id="medal-batch-send-btn">🚀 批量赠送</button>
                    </div>
                    
                    <div class="two-column-layout">
                        <div class="column">
                            <div class="column-header">
                                <h4 class="column-title">🏅 勋章列表</h4>
                                <input type="text" class="search-box" id="medal-search" placeholder="搜索勋章名称...">
                    </div>
                            <div class="filter-options">
                        <label><input type="checkbox" id="select-all-checkbox"> 全选勋章</label>
                                <label><input type="checkbox" id="filter-giftable" checked> 仅显示可赠送勋章</label>
                    </div>
                            <div class="medals-container" id="medals-container"></div>
                        </div>
                        
                        <div class="column">
                            <div class="column-header">
                                <h4 class="column-title">👥 用户列表</h4>
                                <input type="text" class="search-box" id="user-search" placeholder="搜索用户名或UID...">
                            </div>
                            <div class="filter-options">
                                <label><input type="checkbox" id="select-all-users-checkbox"> 全选用户</label>
                            </div>
                            <div class="user-list-container" id="medal-user-list"></div>
                        </div>
                    </div>
                </div>

                <div id="user-panel" class="panel-hidden">
                    <h3>用户管理</h3>
                    <div class="panel-buttons">
                        <button class="btn btn-center" id="back-to-main-2">← 返回</button>
                        <button class="btn btn-center" id="export-users-btn">📤 导出</button>
                        <button class="btn btn-danger btn-center" id="clear-users-btn">🗑️ 清空</button>
                    </div>
                    <input type="text" id="username-input" class="user-input" placeholder="输入用户名">
                    <input type="text" id="uid-input" class="user-input" placeholder="输入用户UID">
                    <button class="btn" id="add-user-btn" style="width: 100%; margin-top: 10px;">➕ 添加用户</button>
                    <button class="btn" id="import-current-user-btn" style="width: 100%; margin-top: 10px; background: #17a2b8; color: white;">📥 导入当前页面用户</button>
                    <div id="user-list"></div>
                </div>

                <div id="medal-user-select-panel" class="panel-hidden">
                    <h3 id="medal-user-select-title">选择用户</h3>
                    <div class="panel-buttons">
                        <button class="btn btn-center" id="back-to-medal-panel">← 返回勋章管理</button>
                    </div>
                    <div class="select-all">
                        <label><input type="checkbox" id="select-all-users-checkbox"> 全选用户</label>
                    </div>
                    <div id="medal-user-list"></div>
                </div>
            </div>
        </div>
    `);

    let currentMedal = null;
    let allMedals = [];
    let apiMedalData = null; // 保存API返回的勋章数据

    // 从页面数据中查找勋章ID的函数
    function findMedalIdInPageData(medalName) {
        console.log(`正在查找勋章 "${medalName}" 的ID...`);

        // 方法1: 从保存的API数据中查找
        if (apiMedalData && apiMedalData.result) {
            // 查找medalGroups中的勋章
            if (apiMedalData.result.medalGroups && Array.isArray(apiMedalData.result.medalGroups)) {
                for (let group of apiMedalData.result.medalGroups) {
                    if (group.medalList && Array.isArray(group.medalList)) {
                        const medal = group.medalList.find(m => m.name === medalName);
                        if (medal && medal.id) {
                            console.log(`从API medalGroups中找到勋章 "${medalName}" ID: ${medal.id}`);
                            return medal.id;
                        }
                    }
                }
            }

            // 查找单独的medals中的勋章
            if (apiMedalData.result.medals && Array.isArray(apiMedalData.result.medals)) {
                const medal = apiMedalData.result.medals.find(m => m.name === medalName);
                if (medal && medal.id) {
                    console.log(`从API medals中找到勋章 "${medalName}" ID: ${medal.id}`);
                    return medal.id;
                }
            }
        }

        // 方法2: 检查window对象上的数据
        if (window.medalData || window.medals) {
            const data = window.medalData || window.medals;
            if (Array.isArray(data)) {
                const medal = data.find(m => m.name === medalName);
                if (medal && medal.id) {
                    console.log(`从window全局变量中找到勋章 "${medalName}" ID: ${medal.id}`);
                    return medal.id;
                }
            }
        }

        // 方法3: 检查页面脚本中的JSON数据
        const scripts = document.querySelectorAll('script');
        for (let script of scripts) {
            const content = script.textContent || script.innerHTML;

            if (content.includes(medalName)) {
                try {
                    // 查找完整的JSON对象
                    const jsonMatches = content.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*"name"\s*:\s*"[^"]*"[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
                    if (jsonMatches) {
                        for (let jsonStr of jsonMatches) {
                            try {
                                const obj = JSON.parse(jsonStr);
                                if (obj.name === medalName && obj.id) {
                                    console.log(`从页面脚本JSON中找到勋章 "${medalName}" ID: ${obj.id}`);
                                    return obj.id;
                                }
                            } catch (e) {
                                // 忽略JSON解析错误
                            }
                        }
                    }

                    // 查找模式如: id: 123, name: "xxx" 或 "id": 123, "name": "xxx"
                    const escapedName = medalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const patterns = [
                        new RegExp(`"?id"?\\s*:\\s*(\\d+)[^}]*"?name"?\\s*:\\s*"${escapedName}"`, 'i'),
                        new RegExp(`"?name"?\\s*:\\s*"${escapedName}"[^}]*"?id"?\\s*:\\s*(\\d+)`, 'i'),
                        new RegExp(`${escapedName}"[^}]*"?id"?\\s*:\\s*(\\d+)`, 'i')
                    ];

                    for (let pattern of patterns) {
                        const match = content.match(pattern);
                        if (match) {
                            console.log(`从页面脚本模式匹配中找到勋章 "${medalName}" ID: ${match[1]}`);
                            return parseInt(match[1]);
                        }
                    }
                } catch (e) {
                    console.log('解析页面数据时出错:', e);
                }
            }
        }

        console.log(`未能从页面数据中找到勋章 "${medalName}" 的ID`);
        return null;
    }

    // 从DOM元素中提取勋章ID
    function extractMedalIdFromDOM(card, medalName) {
        let id = null;

        console.log(`正在从DOM中提取勋章 "${medalName}" 的ID...`);

        // 方法1: 从按钮的各种属性中提取
        const buttons = card.querySelectorAll('button');
        buttons.forEach(btn => {
            if (!id && (btn.textContent.trim() === '赠送' || btn.textContent.trim() === '购买' || btn.textContent.trim() === '佩戴')) {
                // 检查onclick属性
                const onclick = btn.getAttribute('onclick');
                if (onclick) {
                    console.log(`按钮onclick属性: ${onclick}`);
                    const idMatches = onclick.match(/\b(\d+)\b/g);
                    if (idMatches) {
                        // 尝试不同的数字，通常ID是较小的正整数
                        for (let match of idMatches) {
                            const num = parseInt(match);
                            if (num > 0 && num < 10000) { // 合理的ID范围
                                id = num;
                                console.log(`从onclick中提取到可能的ID: ${id}`);
                                break;
                            }
                        }
                    }
                }

                // 检查data属性
                const dataAttrs = ['data-id', 'data-medal-id', 'data-medal', 'medal-id', 'data-target-id'];
                dataAttrs.forEach(attr => {
                    if (!id) {
                        const value = btn.getAttribute(attr);
                        if (value && /^\d+$/.test(value)) {
                            id = parseInt(value);
                            console.log(`从按钮${attr}属性中找到ID: ${id}`);
                        }
                    }
                });
            }
        });

        // 方法2: 从卡片容器的属性中提取
        if (!id) {
            const dataAttrs = ['data-id', 'data-medal-id', 'data-medal', 'medal-id', 'id'];
            dataAttrs.forEach(attr => {
                if (!id) {
                    const value = card.getAttribute(attr);
                    if (value && /^\d+$/.test(value)) {
                        id = parseInt(value);
                        console.log(`从卡片${attr}属性中找到ID: ${id}`);
                    }
                }
            });
        }

        // 方法3: 从表单输入中查找
        if (!id) {
            const inputs = card.querySelectorAll('input[type="hidden"], input[name*="medal"], input[name*="id"], input[value]');
            inputs.forEach(input => {
                if (!id && input.value && /^\d+$/.test(input.value)) {
                    const num = parseInt(input.value);
                    if (num > 0 && num < 10000) {
                        id = num;
                        console.log(`从表单输入中找到ID: ${id}`);
                    }
                }
                // 也检查name属性中是否包含ID
                if (!id && input.name) {
                    const nameMatch = input.name.match(/(\d+)/);
                    if (nameMatch) {
                        const num = parseInt(nameMatch[1]);
                        if (num > 0 && num < 10000) {
                            id = num;
                            console.log(`从input name属性中找到ID: ${id}`);
                        }
                    }
                }
            });
        }

        // 方法4: 从图片URL中提取
        if (!id) {
            const images = card.querySelectorAll('img');
            images.forEach(img => {
                if (!id && img.src) {
                    const urlMatches = img.src.match(/\/(\d+)[_\.]|medal[_-]?(\d+)|id[_-]?(\d+)/i);
                    if (urlMatches) {
                        const num = parseInt(urlMatches[1] || urlMatches[2] || urlMatches[3]);
                        if (num > 0 && num < 10000) {
                            id = num;
                            console.log(`从图片URL中找到ID: ${id}`);
                        }
                    }
                }
            });
        }

        // 方法5: 从链接href中提取
        if (!id) {
            const links = card.querySelectorAll('a[href]');
            links.forEach(link => {
                if (!id) {
                    const hrefMatches = link.href.match(/[?&](?:id|medal_id|medalId)=(\d+)/i);
                    if (hrefMatches) {
                        id = parseInt(hrefMatches[1]);
                        console.log(`从链接href中找到ID: ${id}`);
                    }
                }
            });
        }

        return id;
    }

    async function sendMedalToUser(medalName, uid, username) {
        const medal = allMedals.find(m => m.name === medalName);
        if (!medal || !medal.id) {
            showToast(`勋章 "${medalName}" 缺少ID信息，无法赠送`, 'warning');
            return;
        }

        try {
        const baseUrl = window.location.origin;

            // 创建FormData，参考备份代码的正确格式
        const formData = new FormData();
        formData.append('action', 'giftMedal');
            formData.append('params[medal_id]', medal.id);
        formData.append('params[uid]', uid);

            const response = await fetch(`${baseUrl}/ajax.php`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Origin': window.location.origin,
                'Referer': `${window.location.origin}/medal.php`
            }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            let message;
            if (result.success === true || result.ret === 0) {
                message = '赠送成功';
                // 更新状态
                const medalUserData = GM_getValue(`medal_${medalName}_users`, { userStatus: {} });
                medalUserData.userStatus[uid] = 'sent';
                GM_setValue(`medal_${medalName}_users`, medalUserData);
            } else if (result.ret === -1 && result.msg && result.msg.includes('already')) {
                message = '对方已拥有';
            } else if (result.msg && result.msg.includes('power')) {
                message = '电力不足';
            } else {
                message = result.msg || result.message || '赠送失败';
            }
            
            showToast(`✅ 勋章 "${medalName}" 赠送给用户 ${username}: ${message}`, 'success');
            displayMedalUsers();
        } catch (error) {
            console.error('赠送勋章时出错:', error);
            showToast('❌ 赠送失败，请检查网络连接', 'error');
        }
    }

    async function sendMedalToUserBatch(uid, username) {
        if (medalManager.selectedMedals.length === 0) {
            showToast('请先选择要赠送的勋章', 'warning');
            return;
        }

        if (confirm(`确定要向用户 ${username} 赠送 ${medalManager.selectedMedals.length} 个勋章吗？`)) {
            let successCount = 0;
            let failCount = 0;
            
            for (const medalName of medalManager.selectedMedals) {
                try {
                    await sendMedalToUser(medalName, uid, username);
                    successCount++;
                    // 添加延迟避免请求过快
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    failCount++;
                    console.error(`赠送勋章 "${medalName}" 给用户 ${username} 失败:`, error);
                }
            }
            
            showToast(`批量赠送完成！成功: ${successCount} 个，失败: ${failCount} 个`, 'success');
            displayMedalUsers();
        }
    }

    // 初始化所有事件监听器
    function initEventListeners() {
    // 悬浮按钮点击事件
        const floatBtn = document.getElementById('medal-float-btn');
        if (floatBtn) {
            floatBtn.addEventListener('click', () => {
        const panel = document.getElementById('medal-panel');
        if (panel.style.display === 'none' || !panel.style.display) {
            panel.style.display = 'block';
            // 面板固定居中显示，靠近顶部
            panel.style.transform = 'translateX(-50%)';
        } else {
            panel.style.display = 'none';
        }
    });
        }

    // 关闭按钮事件
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-btn')) {
            document.getElementById('medal-panel').style.display = 'none';
        }
    });

        // 添加事件监听器
        const showMedalBtn = document.getElementById('show-medal-btn');
        if (showMedalBtn) showMedalBtn.addEventListener('click', showMedalPanel);
        
        const showUserBtn = document.getElementById('show-user-btn');
        if (showUserBtn) showUserBtn.addEventListener('click', showUserPanel);
        
        const getMedalsBtn = document.getElementById('get-medals-btn');
        if (getMedalsBtn) getMedalsBtn.addEventListener('click', getMedals);
        
        const medalBatchSendBtn = document.getElementById('medal-batch-send-btn');
        if (medalBatchSendBtn) medalBatchSendBtn.addEventListener('click', medalBatchSend);
        
        const exportUsersBtn = document.getElementById('export-users-btn');
        if (exportUsersBtn) exportUsersBtn.addEventListener('click', exportUsers);
        
        const clearUsersBtn = document.getElementById('clear-users-btn');
        if (clearUsersBtn) clearUsersBtn.addEventListener('click', clearUsers);
        
        const addUserBtn = document.getElementById('add-user-btn');
        if (addUserBtn) addUserBtn.addEventListener('click', addUser);
        
        const importCurrentUserBtn = document.getElementById('import-current-user-btn');
        if (importCurrentUserBtn) importCurrentUserBtn.addEventListener('click', importCurrentUser);
        
        const backToMain1Btn = document.getElementById('back-to-main-1');
        if (backToMain1Btn) backToMain1Btn.addEventListener('click', showMainPanel);
        
        const backToMain2Btn = document.getElementById('back-to-main-2');
        if (backToMain2Btn) backToMain2Btn.addEventListener('click', showMainPanel);
        
        const backToMedalPanelBtn = document.getElementById('back-to-medal-panel');
        if (backToMedalPanelBtn) backToMedalPanelBtn.addEventListener('click', showMedalPanel);
        
        const closeBtn = document.getElementById('close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('medal-panel').style.display = 'none';
            });
        }

        // 添加其他事件监听器
    document.addEventListener('change', function(e) {
        if (e.target.id === 'filter-giftable') {
            filterMedals();
            } else if (e.target.id === 'select-all-checkbox') {
                toggleSelectAll();
            }
        });

        // 添加搜索框事件监听器
        const medalSearch = document.getElementById('medal-search');
        if (medalSearch) {
            medalSearch.addEventListener('input', function() {
                displayMedals();
            });
        }
        
        const userSearch = document.getElementById('user-search');
        if (userSearch) {
            userSearch.addEventListener('input', function() {
                displayMedalUsers();
            });
        }

        console.log('事件监听器初始化完成');
    }

    function showMainPanel() {
        document.getElementById('medal-manage-panel').classList.add('panel-hidden');
        document.getElementById('user-panel').classList.add('panel-hidden');
        document.getElementById('medal-user-select-panel').classList.add('panel-hidden');
        document.getElementById('main-panel').classList.remove('panel-hidden');
    }

    // Toast 通知函数
    function showToast(message, type = 'info', duration = 3000) {
        // 移除现有的 toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // 创建新的 toast
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;
        
        // 添加到页面
        document.body.appendChild(toast);
        
        // 显示动画 - 从顶部滑入
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
            toast.classList.add('show');
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, duration);
    }

    function showMedalPanel() {
        const panel = document.getElementById('medal-panel');
        panel.style.display = 'block';
        
        // 面板固定居中显示，靠近顶部
        panel.style.transform = 'translateX(-50%)';
        
        // 显示勋章管理面板
        document.getElementById('main-panel').classList.add('panel-hidden');
        document.getElementById('medal-manage-panel').classList.remove('panel-hidden');
        document.getElementById('medal-user-select-panel').classList.add('panel-hidden');
        
        // 获取勋章数据
        if (allMedals.length === 0) {
            getMedals();
        } else {
            displayMedals();
        }
        
        // 显示用户列表
        displayMedalUsers();
    }

    function showUserPanel() {
        document.getElementById('main-panel').classList.add('panel-hidden');
        document.getElementById('medal-manage-panel').classList.add('panel-hidden');
        document.getElementById('medal-user-select-panel').classList.add('panel-hidden');
        document.getElementById('user-panel').classList.remove('panel-hidden');
        displayUsers();
    }

    function getMedals() {
        const container = document.getElementById('medals-container');
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">🔄 正在获取勋章数据...</p>';

        // 清空现有数据，避免重复
        allMedals = [];
        apiMedalData = null;

        const baseUrl = window.location.origin;
        fetch(`${baseUrl}/javaapi/user/queryAllMedals`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Referer': `${window.location.origin}/medal.php`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('API返回的原始数据:', data);

            // 保存API响应供DOM解析使用
            apiMedalData = data;

            // 直接使用DOM解析，结合API数据
            console.log('使用DOM解析方式，结合API数据');
            parseMedalsFromDOM();
        })
        .catch(error => {
            console.error('API获取勋章失败，使用纯DOM解析方式:', error);
            // 如果API请求失败，则使用纯DOM解析方式
            parseMedalsFromDOM();
        });
    }

    function parseMedalsFromDOM() {
        const container = document.getElementById('medals-container');
        const selectAllDiv = document.querySelector('.filter-options');
        const filterDiv = document.querySelector('.filter-options');

        const medalCards = document.querySelectorAll('.index-module__card___90vxo');
        console.log(`找到 ${medalCards.length} 个勋章卡片`);

        medalCards.forEach((card, index) => {
            const nameEl = card.querySelector('.index-module__title___ecDG8 > div:first-child');
            const name = nameEl ? nameEl.textContent.trim() : '未知勋章';

            if (name === '未知勋章') return;

            console.log(`\n处理勋章: ${name}`);

            // 多种方法获取勋章ID
            let id = null;

            // 优先从页面数据中查找（包括API数据）
            id = findMedalIdInPageData(name);

            // 如果从页面数据中找不到，则从DOM元素中提取
            if (!id) {
                id = extractMedalIdFromDOM(card, name);
            }

            console.log(`勋章 "${name}" 最终确定的ID: ${id}`);

            // 获取价格信息
            const priceElements = card.querySelectorAll('.index-module__content___Yr-LT');
            let price = '价格未知';

            priceElements.forEach(el => {
                const parent = el.parentElement;
                const label = parent?.querySelector('.index-module__label___dRuRs')?.textContent || '';
                if (label.includes('价格')) {
                    price = el.textContent.trim();
                }
            });

            // 获取时间信息
            let time = '时间未知';
            const timeEl = card.querySelector('.index-module__time-limit___cv1Bw > div');
            if (timeEl) {
                time = timeEl.textContent.trim();
            }

            // 检查是否可以赠送
            const allButtons = card.querySelectorAll('button');
            let canGift = false;

            allButtons.forEach(btn => {
                if (btn.textContent.trim() === '赠送') {
                    canGift = !btn.disabled;
                }
            });

            // 添加到勋章列表
            allMedals.push({
                name,
                id,
                price,
                time,
                canGift,
                hasValidId: id !== null
            });
        });

        console.log('\n所有勋章解析完成:', allMedals);

        if (allMedals.length === 0) {
            container.innerHTML = `<p style="text-align: center; color: #999;">❌ 未找到勋章</p>`;
            selectAllDiv.style.display = 'none';
            filterDiv.style.display = 'none';
        } else {
            selectAllDiv.style.display = 'block';
            filterDiv.style.display = 'block';
            displayMedals();
        }
    }

    function displayMedals() {
        const container = document.getElementById('medals-container');
        const filterGiftable = document.getElementById('filter-giftable')?.checked ?? true;
        const searchTerm = document.getElementById('medal-search')?.value?.toLowerCase() || '';

        let medalsToShow = filterGiftable ? allMedals.filter(m => m.canGift) : allMedals;
        
        // 添加搜索过滤
        if (searchTerm) {
            medalsToShow = medalsToShow.filter(m => m.name.toLowerCase().includes(searchTerm));
        }

        let html = `<p style="color: #666; margin-bottom: 15px;">📊 显示 ${medalsToShow.length} 个勋章（共 ${allMedals.length} 个）</p>`;

        medalsToShow.forEach(medal => {
            const isSelected = medalManager.selectedMedals.includes(medal.name);
            const itemClass = medal.canGift ? 'medal-item' : 'medal-item medal-disabled';
            const giftStatus = medal.canGift ? '✅ 可赠送' : '❌ 不可赠送';
            const idStatus = medal.hasValidId ? `🆔 ID: ${medal.id}` : '❌ 无ID';

            html += `
                <div class="${itemClass}">
                    <input type="checkbox" class="medal-checkbox" data-medal-name="${medal.name}" ${isSelected ? 'checked' : ''} ${!medal.canGift || !medal.hasValidId ? 'disabled' : ''}>
                    <div class="medal-info">
                        <div class="medal-name">${medal.name}</div>
                        <div class="medal-status-row">
                            <span style="color: ${medal.canGift ? '#27ae60' : '#e74c3c'}; font-size: 13px; font-weight: 500;">${giftStatus}</span>
                            <span style="color: ${medal.hasValidId ? '#27ae60' : '#e74c3c'}; font-size: 13px; font-weight: 500;">${idStatus}</span>
                            <button class="btn btn-small medal-select-btn" data-medal-name="${medal.name}" ${!medal.hasValidId ? 'disabled' : ''}>📊 赠送历史</button>
                        </div>
                        <div class="medal-price">💰 价格: ${medal.price}</div>
                        <div class="medal-time">⏰ 购买时间: ${medal.time}</div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        document.querySelectorAll('.medal-checkbox:not([disabled])').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                toggleMedal(this.dataset.medalName);
            });
        });

        document.querySelectorAll('.medal-select-btn:not([disabled])').forEach(btn => {
            btn.addEventListener('click', function() {
                showMedalGiftHistory(this.dataset.medalName);
            });
        });

        updateSelectAllCheckbox();
    }

    function filterMedals() {
        displayMedals();
    }

    function displayMedalUsers() {
        const users = GM_getValue('medal_users', []);
        const container = document.getElementById('medal-user-list');
        const searchTerm = document.getElementById('user-search')?.value?.toLowerCase() || '';

        if (users.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">👥 暂无用户，请先在用户管理中添加用户</p>';
            return;
        }

        // 添加搜索过滤
        let usersToShow = users;
        if (searchTerm) {
            usersToShow = users.filter(user => 
                user.username.toLowerCase().includes(searchTerm) || 
                user.uid.toString().includes(searchTerm)
            );
        }

        let html = `
            <div class="user-list-header">
                <div>
                    <span></span>
                    <span>UID</span>
                    <span>用户名</span>
                </div>
                <div class="user-actions">
                    <span>操作</span>
                </div>
            </div>
        `;

        usersToShow.forEach((user, index) => {
            // 检查用户是否被选中
            const selectedUsers = GM_getValue('selected_users_for_medals', []);
            const userKey = `${user.uid}_${user.username}`;
            const isSelected = selectedUsers.includes(userKey);

            html += `
                <div class="user-select-item">
                    <div>
                        <input type="checkbox" class="medal-user-checkbox" data-uid="${user.uid}" data-username="${user.username}" ${isSelected ? 'checked' : ''}>
                        <span>${user.uid}</span>
                        <span><strong>${user.username}</strong></span>
                    </div>
                    <div class="user-actions">
                        <button class="btn btn-small send-medal-btn" data-uid="${user.uid}" data-username="${user.username}">🎁 赠送</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        document.querySelectorAll('.send-medal-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const uid = this.dataset.uid;
                const username = this.dataset.username;
                if (medalManager.selectedMedals.length === 0) {
                    alert('请先选择要赠送的勋章');
                    return;
                }
                sendMedalToUserBatch(uid, username);
            });
        });

        document.querySelectorAll('.medal-user-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                toggleMedalUser(this.dataset.uid, this.dataset.username);
            });
        });

        updateSelectAllUsersCheckbox();
    }

    function showMedalUserSelect(medalName) {
        currentMedal = medalName;
        // 显示用户选择面板
        document.getElementById('medal-manage-panel').classList.add('panel-hidden');
        document.getElementById('medal-user-select-panel').classList.remove('panel-hidden');
        document.getElementById('medal-user-select-title').textContent = `为勋章「${medalName}」选择用户`;
        displayMedalUsersForMedal(medalName);
    }

    function showMedalGiftHistory(medalName) {
        console.log('🔍 开始显示赠送历史:', medalName);
        
        currentMedal = medalName;
        
        // 显示赠送历史面板
        const managePanel = document.getElementById('medal-manage-panel');
        const userSelectPanel = document.getElementById('medal-user-select-panel');
        const titleElement = document.getElementById('medal-user-select-title');
        
        console.log('🔍 面板元素检查:', {
            managePanel: managePanel,
            userSelectPanel: userSelectPanel,
            titleElement: titleElement
        });
        
        if (managePanel) {
            managePanel.classList.add('panel-hidden');
            console.log('✅ 勋章管理面板已隐藏');
        }
        if (userSelectPanel) {
            userSelectPanel.classList.remove('panel-hidden');
            console.log('✅ 用户选择面板已显示');
            console.log('🔍 面板类名检查:', userSelectPanel.className);
        }
        if (titleElement) {
            titleElement.textContent = `勋章「${medalName}」的赠送历史`;
            console.log('✅ 标题已更新');
        }
        
        // 延迟一点执行，确保DOM更新完成
        setTimeout(() => {
            displayMedalGiftHistoryForMedal(medalName);
        }, 100);
    }

    function displayMedalUsersForMedal(medalName) {
        const users = GM_getValue('medal_users', []);
        const container = document.getElementById('medal-user-list');
        const medalUserData = GM_getValue(`medal_${medalName}_users`, { selectedUsers: [], userStatus: {} });

        if (users.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">👥 暂无用户，请先在用户管理中添加用户</p>';
            return;
        }

        let html = `
            <div class="user-list-header">
                <div>
                    <span></span>
                    <span>UID</span>
                    <span>用户名</span>
                </div>
                <div class="user-actions">
                    <span>状态</span>
                    <span>操作</span>
                </div>
            </div>
        `;

        users.forEach((user, index) => {
            const isSelected = medalUserData.selectedUsers?.includes(user.uid) || false;
            const status = medalUserData.userStatus?.[user.uid] || 'not-sent';
            let statusText = '未赠送';
            let statusClass = 'status-not-sent';

            if (status === 'sent') {
                statusText = '✅ 赠送成功';
                statusClass = 'status-sent';
            } else if (status === 'owned') {
                statusText = '👑 已拥有';
                statusClass = 'status-owned';
            } else if (status === 'failed') {
                statusText = '❌ 赠送失败';
                statusClass = 'status';
            }

            html += `
                <div class="user-select-item">
                    <div>
                        <input type="checkbox" class="medal-user-checkbox" data-uid="${user.uid}" ${isSelected ? 'checked' : ''}>
                        <span>${user.uid}</span>
                        <span><strong>${user.username}</strong></span>
                    </div>
                    <div class="user-actions">
                        <span class="status ${statusClass}" id="medal-status-${user.uid}">${statusText}</span>
                        <button class="btn btn-small send-medal-btn" data-medal="${medalName}" data-uid="${user.uid}" data-username="${user.username}">🎁 赠送</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        document.querySelectorAll('.send-medal-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                sendMedalToUser(this.dataset.medal, this.dataset.uid, this.dataset.username);
            });
        });

        document.querySelectorAll('.medal-user-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                toggleMedalUserForMedal(medalName, this.dataset.uid);
            });
        });

        updateSelectAllUsersCheckbox();
    }

    function displayMedalGiftHistoryForMedal(medalName) {
        const users = GM_getValue('medal_users', []);
        const container = document.getElementById('medal-user-list');
        const medalUserData = GM_getValue(`medal_${medalName}_users`, { selectedUsers: [], userStatus: {} });

        console.log('🔍 调试赠送历史显示:', {
            medalName,
            usersCount: users.length,
            users: users,
            medalUserData: medalUserData,
            container: container
        });
        
        // 检查容器是否存在
        if (!container) {
            console.error('❌ 错误：找不到 medal-user-list 容器元素');
            console.log('🔍 当前页面所有元素:', document.querySelectorAll('[id*="user"]'));
            return;
        }

        if (users.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #999; padding: 20px;">
                    <p>👥 暂无用户数据</p>
                    <p style="font-size: 12px; margin-top: 10px;">
                        请先添加用户才能查看赠送历史：<br>
                        1. 返回主面板 → 用户管理<br>
                        2. 手动输入用户名和UID<br>
                        3. 或访问用户个人页面后点击"导入当前页面用户"
                    </p>
                    <button class="btn btn-small" onclick="showUserPanel()" style="margin-top: 15px;">
                        📥 去添加用户
                    </button>
                </div>
            `;
            return;
        }

        let html = `
            <div class="user-list-header">
                <div>
                    <span>UID</span>
                    <span>用户名</span>
                    <span>赠送状态</span>
                    <span>操作</span>
                </div>
            </div>
        `;

        users.forEach((user, index) => {
            const status = medalUserData.userStatus?.[user.uid] || 'not-sent';
            let statusText = '未赠送';
            let statusClass = 'status-not-sent';

            if (status === 'sent') {
                statusText = '✅ 赠送成功';
                statusClass = 'status-sent';
            } else if (status === 'owned') {
                statusText = '👑 对方已拥有';
                statusClass = 'status-owned';
            } else if (status === 'failed') {
                statusText = '❌ 赠送失败';
                statusClass = 'status';
            }

            html += `
                <div class="user-select-item">
                    <div>
                        <span>${user.uid}</span>
                        <span><strong>${user.username}</strong></span>
                        <span class="status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="user-actions">
                        <button class="btn btn-small send-medal-btn" data-medal="${medalName}" data-uid="${user.uid}" data-username="${user.username}" ${status === 'sent' || status === 'owned' ? 'disabled' : ''}>🎁 重新赠送</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        document.querySelectorAll('.send-medal-btn:not([disabled])').forEach(btn => {
            btn.addEventListener('click', function() {
                sendMedalToUser(this.dataset.medal, this.dataset.uid, this.dataset.username);
            });
        });
    }

    function toggleMedalUserForMedal(medalName, uid) {
        const medalUserData = GM_getValue(`medal_${medalName}_users`, { selectedUsers: [], userStatus: {} });
        const index = medalUserData.selectedUsers.indexOf(uid);

        if (index > -1) {
            medalUserData.selectedUsers.splice(index, 1);
        } else {
            medalUserData.selectedUsers.push(uid);
        }

        GM_setValue(`medal_${medalName}_users`, medalUserData);
    }

    function toggleMedalUser(uid, username) {
        // 使用全局用户选择管理
        let selectedUsers = GM_getValue('selected_users_for_medals', []);
        const userKey = `${uid}_${username}`;
        const index = selectedUsers.indexOf(userKey);

        if (index > -1) {
            selectedUsers.splice(index, 1);
        } else {
            selectedUsers.push(userKey);
        }
        
        GM_setValue('selected_users_for_medals', selectedUsers);
        updateSelectAllUsersCheckbox();
    }

    function toggleSelectAll() {
        const selectAllCheckbox = document.getElementById('select-all-checkbox');
        const medalCheckboxes = document.querySelectorAll('.medal-checkbox:not([disabled])');

        if (selectAllCheckbox.checked) {
            // 全选所有可见的勋章
            medalCheckboxes.forEach(checkbox => {
                checkbox.checked = true;
                const medalName = checkbox.dataset.medalName;
                if (!medalManager.selectedMedals.includes(medalName)) {
                    medalManager.selectedMedals.push(medalName);
                }
            });
        } else {
            // 取消全选
            medalCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            medalManager.selectedMedals = [];
        }
        
        GM_setValue('selected_medals', medalManager.selectedMedals);
        updateSelectAllCheckbox();
        displayMedals(); // 添加这行来重新渲染UI
    }

    function updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('select-all-checkbox');
        if (!selectAllCheckbox) return;
        
        const medalCheckboxes = document.querySelectorAll('.medal-checkbox:not([disabled])');
        const checkedCount = document.querySelectorAll('.medal-checkbox:not([disabled]):checked').length;

        if (checkedCount === 0) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = false;
        } else if (checkedCount === medalCheckboxes.length) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = true;
        } else {
            selectAllCheckbox.indeterminate = true;
        }

        // 移除所有现有的事件监听器并重新添加
        const newCheckbox = selectAllCheckbox.cloneNode(true);
        selectAllCheckbox.parentNode.replaceChild(newCheckbox, selectAllCheckbox);
        
        // 重新添加事件监听器
        newCheckbox.addEventListener('change', function() {
            toggleSelectAll();
        });
    }

    function toggleMedal(medalName) {
        const index = medalManager.selectedMedals.indexOf(medalName);
        if (index > -1) {
            medalManager.selectedMedals.splice(index, 1);
        } else {
            medalManager.selectedMedals.push(medalName);
        }
        GM_setValue('selected_medals', medalManager.selectedMedals);
        updateSelectAllCheckbox();
    }

    function updateSelectAllUsersCheckbox() {
        const selectAllCheckbox = document.getElementById('select-all-users-checkbox');
        if (!selectAllCheckbox) return;

        const users = GM_getValue('medal_users', []);
        const selectedUsers = GM_getValue('selected_users_for_medals', []);
        
        if (users.length === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
            return;
        }

        const visibleUsers = users.filter(user => {
            const searchTerm = document.getElementById('user-search')?.value?.toLowerCase() || '';
            if (searchTerm) {
                return user.username.toLowerCase().includes(searchTerm) || 
                       user.uid.toString().includes(searchTerm);
            }
            return true;
        });

        const visibleSelectedCount = visibleUsers.filter(user => {
            const userKey = `${user.uid}_${user.username}`;
            return selectedUsers.includes(userKey);
        }).length;

        if (visibleSelectedCount === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (visibleSelectedCount === visibleUsers.length) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }

        // 移除所有现有的事件监听器
        const newCheckbox = selectAllCheckbox.cloneNode(true);
        selectAllCheckbox.parentNode.replaceChild(newCheckbox, selectAllCheckbox);
        
        // 重新添加事件监听器
        newCheckbox.addEventListener('change', function() {
            const users = GM_getValue('medal_users', []);
            const selectedUsers = GM_getValue('selected_users_for_medals', []);
            
            if (this.checked) {
                // 全选所有可见用户
                const visibleUsers = users.filter(user => {
                    const searchTerm = document.getElementById('user-search')?.value?.toLowerCase() || '';
                    if (searchTerm) {
                        return user.username.toLowerCase().includes(searchTerm) || 
                               user.uid.toString().includes(searchTerm);
                    }
                    return true;
                });
                
                const newSelectedUsers = [...selectedUsers];
                visibleUsers.forEach(user => {
                    const userKey = `${user.uid}_${user.username}`;
                    if (!newSelectedUsers.includes(userKey)) {
                        newSelectedUsers.push(userKey);
                    }
                });
                GM_setValue('selected_users_for_medals', newSelectedUsers);
            } else {
                // 取消全选
                GM_setValue('selected_users_for_medals', []);
            }
            
            displayMedalUsers();
        });
    }

    function addUser() {
        const username = document.getElementById('username-input').value.trim();
        const uid = document.getElementById('uid-input').value.trim();

        if (!username || !uid) {
            alert('请输入用户名和UID');
            return;
        }

        let users = GM_getValue('medal_users', []);
        if (users.some(user => user.uid === uid)) {
            alert('该UID已存在');
            return;
        }

        users.push({ username, uid });
        GM_setValue('medal_users', users);

        document.getElementById('username-input').value = '';
        document.getElementById('uid-input').value = '';
        displayUsers();
    }

    function displayUsers() {
        let users = GM_getValue('medal_users', []);
        const container = document.getElementById('user-list');

        users.sort((a, b) => {
            return parseInt(a.uid) - parseInt(b.uid);
        });

        if (users.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">👥 暂无保存的用户</p>';
        } else {
            let html = `
                <div class="user-list-header">
                    <div>
                        <span></span>
                        <span>UID</span>
                        <span>用户名</span>
                    </div>
                    <div class="user-actions">
                        <span>操作</span>
                    </div>
                </div>
            `;
            users.forEach((user, index) => {
                html += `
                    <div class="user-item">
                        <div>
                            <span></span>
                            <span>${user.uid}</span>
                            <span><strong>${user.username}</strong></span>
                        </div>
                        <div class="user-actions">
                            <button class="btn btn-danger btn-small" data-remove-index="${index}">🗑️ 删除</button>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;

            container.querySelectorAll('[data-remove-index]').forEach(btn => {
                btn.addEventListener('click', function() {
                    removeUser(parseInt(this.dataset.removeIndex));
                });
            });
        }
    }

    function medalBatchSend() {
        if (medalManager.selectedMedals.length === 0) {
            alert('请先选择要赠送的勋章');
            return;
        }

        const selectedUsers = GM_getValue('selected_users_for_medals', []);
        if (selectedUsers.length === 0) {
            alert('请先选择要赠送的用户');
            return;
        }

        // 检查选中的勋章是否有ID
        const missingIdMedals = medalManager.selectedMedals.filter(medalName => {
            const medal = allMedals.find(m => m.name === medalName);
            return !medal || !medal.id;
        });

        if (missingIdMedals.length > 0) {
            alert(`以下勋章缺少ID信息，无法赠送：\n${missingIdMedals.join(', ')}\n请重新获取勋章列表`);
            return;
        }

        if (confirm(`确定要向 ${selectedUsers.length} 个用户批量赠送 ${medalManager.selectedMedals.length} 个勋章吗？`)) {
            alert('批量赠送功能已启动，请查看控制台了解详细进度');

            let requestCount = 0;
            const totalRequests = medalManager.selectedMedals.length * selectedUsers.length;
            let successCount = 0;
            let failCount = 0;

            const processBatch = async () => {
                for (const medalName of medalManager.selectedMedals) {
                    const medal = allMedals.find(m => m.name === medalName);
                    if (!medal) continue;

                    for (const userKey of selectedUsers) {
                        const [uid, username] = userKey.split('_', 2);
                        if (!uid || !username) continue;

                        try {
                            await sendMedalToUser(medalName, uid, username);
                                        successCount++;
                            requestCount++;
                            
                            console.log(`进度: ${requestCount}/${totalRequests} - 成功: ${successCount}, 失败: ${failCount}`);
                            
                            // 添加延迟避免请求过快
                            await new Promise(resolve => setTimeout(resolve, 1000));
                                    } catch (error) {
                                        failCount++;
                                        requestCount++;
                            console.error(`赠送勋章 "${medalName}" 给用户 ${username} 失败:`, error);
                        }
                    }
                }
                
                console.log(`批量赠送完成！总请求: ${totalRequests}, 成功: ${successCount}, 失败: ${failCount}`);
                alert(`批量赠送完成！\n总请求: ${totalRequests}\n成功: ${successCount} 个\n失败: ${failCount} 个`);
                
                // 刷新显示
                displayMedalUsers();
            };

            processBatch();
        }
    }

    function sendMedalToUserPromise(medalName, uid, username) {
        return new Promise((resolve, reject) => {
            const baseUrl = window.location.origin;

            const medal = allMedals.find(m => m.name === medalName);
            if (!medal) {
                reject(new Error(`未找到勋章 "${medalName}" 的信息，请重新获取勋章列表`));
                return;
            }

            if (!medal.id) {
                reject(new Error(`勋章 "${medalName}" 缺少ID信息，无法赠送`));
                return;
            }

            const medalId = medal.id;

            const formData = new FormData();
            formData.append('action', 'giftMedal');
            formData.append('params[medal_id]', medalId);
            formData.append('params[uid]', uid);

            fetch(`${baseUrl}/ajax.php`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Origin': window.location.origin,
                    'Referer': `${window.location.origin}/medal.php`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                let result, message, statusClass;

                if (data.ret === 0 || data.success === true) {
                    result = 'sent';
                    message = '赠送成功';
                    statusClass = 'status-sent';
                } else if (data.ret === -1 && data.msg && data.msg.includes('already')) {
                    result = 'owned';
                    message = '已拥有';
                    statusClass = 'status-owned';
                } else {
                    result = 'failed';
                    message = data.msg || data.message || '赠送失败';
                    statusClass = 'status';
                }

                const medalUserData = GM_getValue(`medal_${medalName}_users`, { selectedUsers: [], userStatus: {} });
                medalUserData.userStatus[uid] = result;
                GM_setValue(`medal_${medalName}_users`, medalUserData);

                console.log(`向 ${username} (${uid}) 赠送勋章「${medalName}」：${message}`, data);
                resolve(data);
            })
            .catch(error => {
                console.error('赠送勋章出错:', error);
                reject(error);
            });
        });
    }

    function removeUser(index) {
        let users = GM_getValue('medal_users', []);
        users.splice(index, 1);
        GM_setValue('medal_users', users);
        displayUsers();
    }

    function clearUsers() {
        if (confirm('确定要清空所有用户吗？')) {
            GM_setValue('medal_users', []);
            displayUsers();
        }
    }

    function exportUsers() {
        const users = GM_getValue('medal_users', []);
        if (users.length === 0) {
            alert('用户列表为空');
            return;
        }

        let text = '用户名\tUID\n';
        users.forEach(user => text += `${user.username}\t${user.uid}\n`);

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '勋章赠送用户列表.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    // 从当前个人页面导入用户信息
    function importCurrentUser() {
        const currentUrl = window.location.href;

        // 检查是否在个人页面
        if (!currentUrl.includes('userdetails.php') && !currentUrl.includes('user.php') && !currentUrl.includes('profile.php')) {
            alert('当前页面不是个人页面，无法导入用户信息');
            return;
        }

        let username = '';
        let uid = '';

        // 方法1：从URL参数中获取UID
        const urlParams = new URLSearchParams(window.location.search);
        const urlUid = urlParams.get('id') || urlParams.get('uid') || urlParams.get('userid');
        if (urlUid) {
            uid = urlUid;
        }

        // 方法2：从页面标题中获取用户名
        const pageTitle = document.title;
        const titleMatch = pageTitle.match(/用户.*?[:：]\s*(.+?)(?:\s*[-–]\s*|$)/);
        if (titleMatch) {
            username = titleMatch[1].trim();
        }

        // 方法3：从页面内容中获取用户信息
        if (!username || !uid) {
            const userInfoElements = document.querySelectorAll('td, div, span');
            for (let element of userInfoElements) {
                const text = element.textContent || element.innerText;
                
                // 查找用户名
                if (!username && text.includes('用户名') && text.includes('：')) {
                    const match = text.match(/用户名[：:]\s*([^\s\n\r]+)/);
                    if (match) username = match[1].trim();
                }
                
                // 查找UID
                if (!uid && text.includes('UID') && text.includes('：')) {
                    const match = text.match(/UID[：:]\s*(\d+)/);
                    if (match) uid = match[1].trim();
                }
                
                if (username && uid) break;
            }
        }

        if (username && uid) {
            addUser(username, uid);
            alert(`成功导入用户：${username} (UID: ${uid})`);
        } else {
            alert('无法从当前页面获取用户信息，请手动输入');
        }
    }

    // 初始化拖拽功能
    function initDragAndDrop() {
    // 拖拽功能
    const floatBtn = document.getElementById('medal-float-btn');
        if (!floatBtn) {
            console.log('悬浮按钮未找到，延迟初始化拖拽功能');
            setTimeout(initDragAndDrop, 100);
            return;
        }

    let isBtnDragging = false;
    let btnOffsetX, btnOffsetY;

        // 恢复悬浮按钮位置
        const savedBtnPosition = GM_getValue('medal_float_btn_position', null);
        if (savedBtnPosition) {
            floatBtn.style.left = savedBtnPosition.x + 'px';
            floatBtn.style.top = savedBtnPosition.y + 'px';
            floatBtn.style.bottom = 'auto';
            floatBtn.style.right = 'auto';
        }

        // 悬浮按钮拖拽 - 简化版本，参考备份文件
    floatBtn.addEventListener('mousedown', function(e) {
        e.preventDefault(); // 添加这行来修复拖拽问题
        isBtnDragging = true;
        btnOffsetX = e.clientX - floatBtn.getBoundingClientRect().left;
        btnOffsetY = e.clientY - floatBtn.getBoundingClientRect().top;
        floatBtn.style.transition = 'none';
    });

    // 面板拖拽相关变量已禁用
    // let isPanelDragging = false;
    // let currentX, currentY, initialX, initialY;
    // let xOffset = 0, yOffset = 0;
    const panel = document.getElementById('medal-panel');
    const header = document.getElementById('medal-header');

        if (header) {
    header.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('close-btn')) return;
        // 面板拖拽功能暂时禁用，保持居中
        console.log('面板拖拽功能已禁用，保持居中显示');
    });
        }

    document.addEventListener('mousemove', function(e) {
        if (isBtnDragging) {
            const x = e.clientX - btnOffsetX;
            const y = e.clientY - btnOffsetY;
                
                // 限制按钮在可视区域内
                const maxX = window.innerWidth - floatBtn.offsetWidth;
                const maxY = window.innerHeight - floatBtn.offsetHeight;
                
                const clampedX = Math.max(0, Math.min(x, maxX));
                const clampedY = Math.max(0, Math.min(y, maxY));
                
                floatBtn.style.left = clampedX + 'px';
                floatBtn.style.top = clampedY + 'px';
            floatBtn.style.bottom = 'auto';
            floatBtn.style.right = 'auto';
        }

            // 面板拖拽功能已禁用
            // if (isPanelDragging && panel) {
            //     e.preventDefault();
            //     currentX = e.clientX - initialX;
            //     currentY = e.clientY - initialY;
            //     xOffset = currentX;
            //     yOffset = currentY;
            //     panel.style.transform = `translate(-50%, -50%) translate3d(${currentX}px, ${currentY}px, 0)`;
            // }
    });

    document.addEventListener('mouseup', function() {
        if (isBtnDragging) {
            isBtnDragging = false;
            floatBtn.style.transition = 'all 0.3s';

                // 保存按钮位置
            const rect = floatBtn.getBoundingClientRect();
                const position = {
                x: rect.left,
                y: rect.top
                };
                GM_setValue('medal_float_btn_position', position);
                
                console.log('悬浮按钮位置已保存:', position);
        }

        // 面板拖拽功能已禁用
        // if (isPanelDragging) {
        //     initialX = currentX;
        //     initialY = currentY;
        //     isPanelDragging = false;
        //     GM_setValue('medal_panel_position', { x: xOffset, y: yOffset });
        // }
    });

        console.log('拖拽功能初始化完成');
    }

    // 等待DOM加载完成后初始化拖拽功能
    function waitForElements() {
        const floatBtn = document.getElementById('medal-float-btn');
        const panel = document.getElementById('medal-panel');
        
        if (floatBtn && panel) {
            console.log('所有元素都已找到，开始初始化功能');
            // 初始化事件监听器
            initEventListeners();
            // 初始化拖拽功能
            initDragAndDrop();
        } else {
            console.log('等待元素加载...', { floatBtn: !!floatBtn, panel: !!panel });
            setTimeout(waitForElements, 100);
        }
    }

    // 确保在DOM完全加载后再初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForElements);
        } else {
        // 如果DOM已经加载完成，等待一小段时间确保所有元素都已创建
        setTimeout(waitForElements, 100);
    }

    // 测试函数 - 验证修复是否完整
    function testFixes() {
        console.log('🧪 开始测试修复...');
        
        // 测试1: 检查拖拽功能
        const floatBtn = document.getElementById('medal-float-btn');
        if (floatBtn) {
            console.log('✅ 悬浮按钮元素存在');
        } else {
            console.log('❌ 悬浮按钮元素不存在');
        }
        
        // 测试2: 检查全选复选框
        const selectAllCheckbox = document.getElementById('select-all-checkbox');
        if (selectAllCheckbox) {
            console.log('✅ 全选复选框元素存在');
        } else {
            console.log('❌ 全选复选框元素不存在');
        }
        
        // 测试3: 检查事件监听器
        if (typeof toggleSelectAll === 'function') {
            console.log('✅ toggleSelectAll 函数存在');
        } else {
            console.log('❌ toggleSelectAll 函数不存在');
        }
        
        // 测试4: 检查medalManager
        if (medalManager && Array.isArray(medalManager.selectedMedals)) {
            console.log('✅ medalManager 对象正确初始化');
        } else {
            console.log('❌ medalManager 对象初始化失败');
        }
        
        console.log('🧪 测试完成');
    }
    
    // 延迟执行测试
    setTimeout(testFixes, 2000);
})();
