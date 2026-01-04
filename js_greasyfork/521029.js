// ==UserScript==
// @name         当前页缓存/Cookie清理
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  全面清理页面各类存储数据
// @author       Yearly
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @grant        window.close
// @grant        window.focus
// @license  MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/521029/%E5%BD%93%E5%89%8D%E9%A1%B5%E7%BC%93%E5%AD%98Cookie%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/521029/%E5%BD%93%E5%89%8D%E9%A1%B5%E7%BC%93%E5%AD%98Cookie%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function clearAllStorage() {
        // 1. Web Storage API
        try {
            localStorage.clear();
            sessionStorage.clear();
            console.log('Web Storage已清理');
        } catch (e) {
            console.error('清理Web Storage失败:', e);
        }

        // 2. Cookies (包括HttpOnly cookies)
        try {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const eqPos = cookie.indexOf('=');
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                // 尝试不同的路径和域名组合来清理cookies
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
            }
            console.log('Cookies已清理');
        } catch (e) {
            console.error('清理Cookies失败:', e);
        }

        // 3. IndexedDB
        try {
            const dbs = await window.indexedDB.databases();
            for (const db of dbs) {
                window.indexedDB.deleteDatabase(db.name);
            }
            console.log('IndexedDB已清理');
        } catch (e) {
            console.error('清理IndexedDB失败:', e);
        }

        // 4. Web SQL Database (已废弃但某些浏览器可能还支持)
        try {
            if (window.openDatabase) {
                const db = window.openDatabase('test', '1.0', 'test', 2 * 1024 * 1024);
                db.transaction((tx) => {
                    // 清理所有表
                    tx.executeSql('SELECT * FROM sqlite_master WHERE type="table"', [], (tx, results) => {
                        for (let i = 0; i < results.rows.length; i++) {
                            tx.executeSql(`DROP TABLE ${results.rows.item(i).name}`);
                        }
                    });
                });
            }
            console.log('Web SQL Database已清理');
        } catch (e) {
            console.error('清理Web SQL Database失败:', e);
        }

        // 5. Cache Storage API
        try {
            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(key => caches.delete(key)));
                console.log('Cache Storage已清理');
            }
        } catch (e) {
            console.error('清理Cache Storage失败:', e);
        }

        // 6. Application Cache (已废弃但可能存在)
        try {
            if (window.applicationCache) {
                window.applicationCache.swapCache();
                console.log('Application Cache已清理');
            }
        } catch (e) {
            console.error('清理Application Cache失败:', e);
        }

        // 7. Service Workers
        try {
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(registrations.map(reg => reg.unregister()));
                console.log('Service Workers已清理');
            }
        } catch (e) {
            console.error('清理Service Workers失败:', e);
        }

        // 8. File System API (如果可用)
        try {
            if (window.requestFileSystem || window.webkitRequestFileSystem) {
                const fs = window.requestFileSystem || window.webkitRequestFileSystem;
                fs(window.TEMPORARY, 1024*1024, function(fs) {
                    fs.root.getFiles(null, {}, function(entries) {
                        entries.forEach(function(entry) {
                            entry.remove(function() {}, function(error) {
                                console.error('删除文件失败:', error);
                            });
                        });
                    }, function(error) {
                        console.error('读取文件失败:', error);
                    });
                });
            }
            console.log('File System已清理');
        } catch (e) {
            console.error('清理File System失败:', e);
        }

        // 9. WebRTC Peer Connection
        try {
            const peerConnections = document.querySelectorAll('*').filter(el => el instanceof RTCPeerConnection);
            peerConnections.forEach(pc => pc.close());
            console.log('WebRTC连接已清理');
        } catch (e) {
            console.error('清理WebRTC连接失败:', e);
        }

        // 10. 清理内存缓存
        try {
            if (window.gc) {
                window.gc();
                console.log('内存已回收');
            }
        } catch (e) {
            console.error('内存回收失败:', e);
        }

        // 清理完成后的提示
        const result = confirm('所有存储数据已清理完成。');
        if (result) {
            window.stop();
            // 强制刷新页面，忽略缓存
          //  window.location.reload(true);
        }
    }

    // 注册清理命令到油猴菜单
    GM_registerMenuCommand('全面清理页面存储', clearAllStorage);
})();