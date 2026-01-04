// ==UserScript==
// @name         Bing屏蔽csdn
// @namespace    http://tampermonkey.net/
// @version      2024-06-07
// @description  block csdn when searching with bing!
// @author       You
// @match        https://www.bing.com/search*
// @match        https://cn.bing.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_unregisterMenuCommand
// @grant GM_registerMenuCommand
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/503279/Bing%E5%B1%8F%E8%94%BDcsdn.user.js
// @updateURL https://update.greasyfork.org/scripts/503279/Bing%E5%B1%8F%E8%94%BDcsdn.meta.js
// ==/UserScript==


(function() {
    'use strict';

    //油猴菜单id
    let menuCommandId = -1;
    // 屏蔽列表
    let sites = [
        "*.csdn.net",
    ]

    updateMenuCommand();
    checkAndRun()

    function checkAndRun() {
        if (GM_getValue("active")) {
            enableSiteBlock();
        } else {
            cancelSiteBlock();
        }
    }

    //开启屏蔽
    function enableSiteBlock() {
        const blocks = ["+" + sites.map(item => "-site%3a"+item).join("+"), "+" + sites.map(item => "-site%3A"+item).join("+"), "+" + sites.map(item => "-site:"+item).join("+")]
        const host = window.location.host;
        const p = window.location.search.indexOf("q=");
        const q = window.location.search.indexOf("&", p);
        if (!p) return;
        const search = q === -1 ? window.location.search.slice(p) : window.location.search.slice(p, q);
        for (let block of blocks) {
            if (search.indexOf(block) !== -1) {
                return;
            }
        }
        window.location.replace("https://"+host+"/"+window.location.search.slice(0, q)+blocks[0]+window.location.search.slice(q));
    }

    //关闭屏蔽
    function cancelSiteBlock() {
        const blocks = ["+" + sites.map(item => "-site%3a"+item).join("+"), "+" + sites.map(item => "-site%3A"+item).join("+"), "+" + sites.map(item => "-site:"+item).join("+")]
        const host = window.location.host;
        const p = window.location.search.indexOf("q=");
        const q = window.location.search.indexOf("&", p);
        if (!p) return;
        const search = q === -1 ? window.location.search.slice(p) : window.location.search.slice(p, q);
        for (let block of blocks) {
            if (search.indexOf(block) !== -1) {
                window.location.replace("https://"+host+"/"+window.location.search.replace(block, ""));
            }
        }
    }

    // 函数：更新按钮标签
    function updateMenuCommand() {
        const label = GM_getValue("active") ? '禁用屏蔽' : '启用屏蔽';
        // 先删除之前的按钮（如果有）
        if (menuCommandId !== -1) {
            GM_unregisterMenuCommand(menuCommandId);
        }
        // 注册新的菜单命令，并存储其 ID
        menuCommandId = GM_registerMenuCommand(label, toggleFeature);
    }

    // 函数：切换功能状态
    function toggleFeature() {
        GM_setValue("active", !GM_getValue("active"));
        updateMenuCommand();
        checkAndRun()
    }
})();