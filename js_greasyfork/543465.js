// ==UserScript==
// @name         帅地玩编程 删缓存
// @namespace    http://tampermonkey.net/
// @version      2025-07-24
// @description  帅地玩编程 删缓存1
// @author       You
// @match        https://www.iamshuaidi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iamshuaidi.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543465/%E5%B8%85%E5%9C%B0%E7%8E%A9%E7%BC%96%E7%A8%8B%20%E5%88%A0%E7%BC%93%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/543465/%E5%B8%85%E5%9C%B0%E7%8E%A9%E7%BC%96%E7%A8%8B%20%E5%88%A0%E7%BC%93%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 删除所有 Cookie
    function clearAllCookies() {
        const cookies = document.cookie.split(';');
        for (let c of cookies) {
            let eqPos = c.indexOf('=');
            let name = eqPos > -1 ? c.slice(0, eqPos).trim() : c.trim();
            // 针对所有常用路径尝试删除
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=';
        }
        // 有些 cookie（如带 domain）只能手动指定 domain 删除
    }

    // 删除 localStorage
    function clearLocalStorage() {
        localStorage.clear();
    }

    // 删除 sessionStorage
    function clearSessionStorage() {
        sessionStorage.clear();
    }

    // 删除 IndexedDB（需要较新浏览器支持）
    function clearIndexedDBs() {
        if (window.indexedDB && window.indexedDB.databases) {
            window.indexedDB.databases().then(dbs => {
                (dbs || []).forEach(db => {
                    window.indexedDB.deleteDatabase(db.name);
                });
            });
        } else if (window.indexedDB) {
            // 兼容老浏览器(需你事先知道db名)
            console.warn('无法自动列出所有数据库，请手动指定 db 名称进行删除');
            // 例如 window.indexedDB.deleteDatabase('your_db_name');
        }
    }

    // 一键清除所有本地缓存
    function clearAllWebCache() {
        clearAllCookies();
        clearLocalStorage();
        clearSessionStorage();
        clearIndexedDBs();
        console.log('已尝试清除所有 cookie、localStorage、sessionStorage 和 IndexedDB');
    }

    // 调用主函数
    clearAllWebCache();

    // Your code here...
})();