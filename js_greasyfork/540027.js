// ==UserScript==
// @name         Bilibili自动开启字幕（增强版）
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  默认开启所有Bilibili视频字幕，支持黑名单管理。基于initsnow原版脚本改进：全局开启、黑名单机制、数据迁移、完整管理菜单
// @author       ggm
// @license      GPL-3.0
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @supportURL   https://github.com/zrdrzzgy
// @homepageURL  https://github.com/zrdrzzgy
// @downloadURL https://update.greasyfork.org/scripts/540027/Bilibili%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E5%AD%97%E5%B9%95%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/540027/Bilibili%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E5%AD%97%E5%B9%95%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

const BVID = getCurrentlyBVID();

// 数据迁移：处理旧版本的白名单数据
migrateOldData();

var blacklist = GM_getValue("blacklist", []); // 改为黑名单
var globalEnabled = GM_getValue("globalEnabled", true); // 添加全局开关，默认开启

// 如果全局开启且不在黑名单中，则启用字幕
if (globalEnabled && !blacklist.includes(BVID)) {
    enable();
}

registerMenu();

function registerMenu() {
    blacklist = GM_getValue("blacklist", []);
    globalEnabled = GM_getValue("globalEnabled", true);
    
    // 全局开关菜单
    const globalMenuLabel = `${globalEnabled ? '✅' : '❌'}全局自动字幕`;
    const globalMenuId = GM_registerMenuCommand(globalMenuLabel, () => {
        toggleGlobalEnabled();
        unregisterAllMenus();
        registerMenu();
    });
    
    // 当前视频菜单
    const isBlacklisted = blacklist.includes(BVID);
    const videoMenuLabel = `${isBlacklisted ? '❌' : '✅'}当前视频字幕`;
    const videoMenuId = GM_registerMenuCommand(videoMenuLabel, () => {
        toggleBlacklist(isBlacklisted);
        unregisterAllMenus();
        registerMenu();
    });
    
    // 查看黑名单
    const viewMenuId = GM_registerMenuCommand('📋查看黑名单', () => {
        const blacklist = GM_getValue("blacklist", []);
        if (blacklist.length === 0) {
            alert('黑名单为空');
        } else {
            alert(`黑名单视频 (${blacklist.length}个):\n${blacklist.join('\n')}`);
        }
    });
    
    // 清空黑名单
    const clearMenuId = GM_registerMenuCommand('🗑️清空黑名单', () => {
        if (confirm('确定要清空所有黑名单视频吗？')) {
            GM_setValue("blacklist", []);
            alert('黑名单已清空');
            unregisterAllMenus();
            registerMenu();
        }
    });
    
    // 重置所有数据（隐藏选项，仅在需要时使用）
    const resetMenuId = GM_registerMenuCommand('⚠️重置所有数据', () => {
        if (confirm('这将清空所有设置和黑名单，确定继续吗？')) {
            GM_deleteValue("blacklist");
            GM_deleteValue("globalEnabled");
            GM_deleteValue("migrationDone");
            GM_deleteValue("whitelist"); // 确保清理可能残留的旧数据
            alert('所有数据已重置，页面将刷新');
            location.reload();
        }
    });
    
    // 存储菜单ID用于注销
    window.menuIds = [globalMenuId, videoMenuId, viewMenuId, clearMenuId, resetMenuId];
}

function toggleGlobalEnabled() {
    globalEnabled = !GM_getValue("globalEnabled", true);
    GM_setValue("globalEnabled", globalEnabled);
    
    if (globalEnabled && !blacklist.includes(BVID)) {
        enable();
    }
}

// 统一注销所有菜单的函数
function unregisterAllMenus() {
    if (window.menuIds) {
        window.menuIds.forEach(id => GM_unregisterMenuCommand(id));
    }
}

function toggleBlacklist(isBlacklisted) {
    blacklist = GM_getValue("blacklist", []);
    const updatedList = isBlacklisted
        ? blacklist.filter(e => e !== BVID)
        : [...blacklist, BVID];
    GM_setValue("blacklist", updatedList);
    
    // 如果从黑名单移除且全局开启，则启用字幕
    if (isBlacklisted && globalEnabled) {
        enable();
    }
}

function getCurrentlyBVID() {
    return location.pathname.match(/\/video\/(BV\w+)\//)[1];
}

// 数据迁移函数
function migrateOldData() {
    const oldWhitelist = GM_getValue("whitelist", null);
    const migrationDone = GM_getValue("migrationDone", false);
    
    // 如果存在旧白名单且未迁移过
    if (oldWhitelist && oldWhitelist.length > 0 && !migrationDone) {
        // 给用户选择迁移方式
        const choice = confirm(
            `检测到旧版本的白名单数据 (${oldWhitelist.length}个视频)\n\n` +
            `新版本默认为所有视频开启字幕，您希望如何处理？\n\n` +
            `点击"确定"：保持这些视频开启字幕（推荐）\n` +
            `点击"取消"：将这些视频设为不开启字幕\n\n` +
            `注意：选择后旧数据将被清理`
        );
        
        if (!choice) {
            // 用户选择取消，将旧白名单转为新黑名单
            GM_setValue("blacklist", oldWhitelist);
            console.log('已将旧白名单转换为黑名单');
        }
        // 如果用户选择确定，什么都不做（默认全开启）
        
        // 清理旧数据并标记迁移完成
        GM_deleteValue("whitelist");
        GM_setValue("migrationDone", true);
        
        alert('数据迁移完成！页面将刷新以应用新设置。');
        location.reload();
    }
}

function enable() {
    enableSubtitle();
    history.pushState = bindHistoryEvent("pushState");
    window.addEventListener("pushState", function (e) {
        enableSubtitle();
    });
}

function enableSubtitle() {
    const interval = setInterval(() => {
        const subtitleIcon = document.querySelector(".bpx-player-ctrl-subtitle .bpx-common-svg-icon");
        if (subtitleIcon) {
            clearInterval(interval);
            subtitleIcon.click();
        }
    }, 800);
}

// from https://juejin.cn/post/7039605917284843534
function bindHistoryEvent(method) {
    const originMethod = history[method];
    if (!originMethod) {
        throw new Error("history has not this method named " + method);
    }
    return function () {
        let result = null;
        try {
            result = originMethod.apply(this, arguments);
            const evt = new Event(method);
            evt.arguments = arguments;
            window.dispatchEvent(evt);
        } catch (error) {
            throw new Error("执行出错");
        }
        return result;
    };
}