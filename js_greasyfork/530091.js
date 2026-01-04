// ==UserScript==
// @name         斗鱼高能弹幕屏蔽自动禁音 (Pro 响应版)
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  【Pro版】使用 MutationObserver 实现近乎瞬时的高能弹幕检测和禁音，解决朗读延迟问题。
// @author       zhou 
// @match        *://www.douyu.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530091/%E6%96%97%E9%B1%BC%E9%AB%98%E8%83%BD%E5%BC%B9%E5%B9%95%E5%B1%8F%E8%94%BD%E8%87%AA%E5%8A%A8%E7%A6%81%E9%9F%B3%20%28Pro%20%E5%93%8D%E5%BA%94%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530091/%E6%96%97%E9%B1%BC%E9%AB%98%E8%83%BD%E5%BC%B9%E5%B9%95%E5%B1%8F%E8%94%BD%E8%87%AA%E5%8A%A8%E7%A6%81%E9%9F%B3%20%28Pro%20%E5%93%8D%E5%BA%94%E7%89%88%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    if (window.self !== window.top) {
        return;
    }

    // --- 配置和变量初始化 ---
    let muteDuration = GM_getValue("muteDuration", 10 * 1000);
    let showNotifications = GM_getValue("showNotifications", true);
    let detectedBarrage = new Map(Object.entries(GM_getValue("detectedBarrage", {})));
    let muteDurationCommandId, notificationCommandId;
    let isMutedByScript = false; // 增加一个标志，防止重复触发禁音

    // --- 功能函数 ---

    function muteAudio() {
        const video = document.querySelector('.player-video video, #live-player video, video');
        if (video && !video.muted && !isMutedByScript) {
            isMutedByScript = true; // 标记为“已被本脚本禁音”
            video.muted = true;
            console.log(`[斗鱼高能弹幕禁音] 检测到高能，已执行禁音，将持续 ${muteDuration / 1000} 秒。`);
            addMuteOverlay();

            setTimeout(() => {
                if (video) {
                    video.muted = false;
                    console.log('[斗鱼高能弹幕禁音] 禁音结束，已恢复声音。');
                }
                isMutedByScript = false; // 禁音结束后，重置标志
            }, muteDuration);
        }
    }

    function processHighEnergyNode(node) {
        const now = Date.now();
        let username = '未知用户';
        let content = '高能弹幕';
        let key;

        if (node.matches('.DetailsBox')) { // 展开形态
            const nicknameEl = node.querySelector('.nickname .max-lenght-text-150');
            const contentEl = node.querySelector('.textContent .text');
            username = nicknameEl ? nicknameEl.innerText.trim() : '未知用户';
            content = contentEl ? contentEl.innerText.trim() : '展开的高能弹幕';
            key = `${username}-${content}`;
        } else if (node.matches('.HighEnergyBarrage-content')) { // 折叠形态
            const avatarImg = node.querySelector('img.header');
            username = avatarImg ? (avatarImg.alt || '折叠用户') : '未知折叠用户';
            content = '折叠的高能弹幕';
            const avatarSrc = avatarImg ? avatarImg.src : '';
            key = `${username}-${avatarSrc}`;
        } else {
            return; // 不是目标节点
        }

        // 使用“记录本”防止重复触发
        if (key && !detectedBarrage.has(key)) {
            detectedBarrage.set(key, now);
            GM_setValue("detectedBarrage", Object.fromEntries(detectedBarrage)); // 持久化
            console.log(`[斗鱼高能弹幕禁音] 检测到新的高能弹幕 (Key: ${key})`);
            muteAudio();
        }
    }

    // --- 核心改动：使用 MutationObserver 替代 setInterval ---
    const observerCallback = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    // 确保是元素节点
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查添加的节点本身或其子节点是否为高能弹幕
                        if (node.matches('.DetailsBox, .HighEnergyBarrage-content')) {
                            processHighEnergyNode(node);
                        } else {
                            const targetChild = node.querySelector('.DetailsBox, .HighEnergyBarrage-content');
                            if (targetChild) {
                                processHighEnergyNode(targetChild);
                            }
                        }
                    }
                }
            }
        }
    };

    const observer = new MutationObserver(observerCallback);
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    // --- UI 和菜单函数 (无需改动) ---
    function addMuteOverlay() { /* ... 代码和之前一样 ... */ }
    function updateMuteDuration() { /* ... 代码和之前一样 ... */ }
    function toggleNotifications() { /* ... 代码和之前一样 ... */ }
    function registerMenuCommands() { /* ... 代码和之前一样 ... */ }
    (function(g,u,i,l,d,s){g[l]=g[l]||[];g[l].push({p:s,e:i,d:d});})(window,document,"script","galog","/dist/galog.min.js?t=1690350300062","ga-log");
    // 为了简洁，我将未改动的函数折叠了起来，请使用上面完整代码块中的实际代码
    // 实际使用时请确保这些函数是完整的
    function addMuteOverlay() {if (!showNotifications) return;let overlay = document.getElementById('mute-overlay');if (!overlay) {overlay = document.createElement('div');overlay.id = 'mute-overlay';overlay.style.position = 'fixed';overlay.style.bottom = '80px';overlay.style.right = '20px';overlay.style.padding = '10px 20px';overlay.style.background = 'rgba(255, 71, 58, 0.85)';overlay.style.color = 'white';overlay.style.fontSize = '14px';overlay.style.borderRadius = '8px';overlay.style.zIndex = '99999';overlay.style.display = 'none';overlay.style.transition = 'opacity 0.5s';document.body.appendChild(overlay);}let closeButton = document.createElement('span');closeButton.innerText = ' ✖';closeButton.style.marginLeft = '10px';closeButton.style.cursor = 'pointer';closeButton.onclick = (e) => {e.stopPropagation();overlay.style.display = 'none';};let countdown = muteDuration / 1000;overlay.innerHTML = `🔇 检测到高能, 已禁音 (<span id='mute-countdown'>${countdown}</span>s)`;overlay.appendChild(closeButton);overlay.style.display = 'block';overlay.style.opacity = '1';if (overlay.intervalId) {clearInterval(overlay.intervalId);}overlay.intervalId = setInterval(() => {countdown--;const countdownSpan = document.getElementById('mute-countdown');if (countdown > 0 && countdownSpan) {countdownSpan.innerText = countdown;} else {clearInterval(overlay.intervalId);overlay.style.opacity = '0';setTimeout(() => {if(overlay.style.opacity === '0') {overlay.style.display = 'none';}}, 500);}}, 1000);}
    function updateMuteDuration() {const newDuration = prompt("请输入禁音时长（秒）：", muteDuration / 1000);if (newDuration === null) return;const parsed = parseInt(newDuration, 10);if (!isNaN(parsed) && parsed > 0) {muteDuration = parsed * 1000;GM_setValue("muteDuration", muteDuration);registerMenuCommands();alert(`禁音时长已设置为 ${parsed} 秒`);} else {alert("请输入有效的正整数。");}}
    function toggleNotifications() {showNotifications = !showNotifications;GM_setValue("showNotifications", showNotifications);registerMenuCommands();alert(`提示界面已${showNotifications ? '开启' : '关闭'}`);}
    function registerMenuCommands() {if (muteDurationCommandId) GM_unregisterMenuCommand(muteDurationCommandId);if (notificationCommandId) GM_unregisterMenuCommand(notificationCommandId);muteDurationCommandId = GM_registerMenuCommand(`[禁] 设置禁音时长 (${muteDuration / 1000}秒)`, updateMuteDuration);notificationCommandId = GM_registerMenuCommand(`[禁] ${showNotifications ? '✅ 已开启' : '❌ 已关闭'} 弹窗提示`, toggleNotifications);}


    // --- 脚本启动 ---
    console.log('[斗鱼高能弹幕禁音] Pro 响应版已启动，使用 MutationObserver 实时监控。');
    observer.observe(targetNode, config);
    registerMenuCommands();

    // 清理过期的记录 (这个仍然可以使用 setInterval，因为它不要求高频)
    setInterval(() => {
        const now = Date.now();
        const expirationTime = 5 * 60 * 1000; // 5分钟
        for (let [key, timestamp] of detectedBarrage.entries()) {
            if (now - timestamp > expirationTime) {
                detectedBarrage.delete(key);
            }
        }
        GM_setValue("detectedBarrage", Object.fromEntries(detectedBarrage));
    }, 5 * 60 * 1000);

})();