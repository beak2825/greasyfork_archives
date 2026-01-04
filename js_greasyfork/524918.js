// ==UserScript==
// @name         qBittorrent Magnet Link Handler
// @namespace    http://tampermonkey.net/
// @version      1.6
// @author       diana7127
// @description  Intercept magnet links and send them to qBittorrent WebUI.
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524918/qBittorrent%20Magnet%20Link%20Handler.user.js
// @updateURL https://update.greasyfork.org/scripts/524918/qBittorrent%20Magnet%20Link%20Handler.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    console.log("脚本已加载");

    // qBittorrent Web UI 配置
    const defaultQbWebUIHost = 'http://localhost:8080';
    let qbWebUIHost = GM_getValue('qbWebUIHost', defaultQbWebUIHost);

    // 添加菜单命令以设置 qBittorrent Web UI 地址
    GM_registerMenuCommand('Set qBittorrent WebUI URL', () => {
        const newUrl = prompt('Enter the qBittorrent WebUI URL:', qbWebUIHost);
        if (newUrl) {
            GM_setValue('qbWebUIHost', newUrl);
            qbWebUIHost = newUrl;
            alert(`qBittorrent WebUI URL set to: ${newUrl}`);
        }
    });

    // 登录 qBittorrent Web UI
    async function login() {
        const url = `${qbWebUIHost}/api/v2/auth/login`;
        const data = `username=admin&password=adminadmin`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                onload: function (response) {
                    if (response.responseText === 'Ok.') {
                        resolve();
                    } else {
                        reject('登录失败');
                    }
                },
                onerror: function (error) {
                    reject('登录出错: ' + error);
                },
            });
        });
    }

    // 添加磁力链接到 qBittorrent
    async function addMagnetLink(magnetLink) {
        const url = `${qbWebUIHost}/api/v2/torrents/add`;
        const data = `urls=${encodeURIComponent(magnetLink)}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                onload: function (response) {
                    if (response.status === 200) {
                        resolve();
                    } else {
                        reject('添加磁力链接失败: ' + response.statusText);
                    }
                },
                onerror: function (error) {
                    reject('添加磁力链接出错: ' + error);
                },
            });
        });
    }

    // 处理磁力链接点击事件
    function handleMagnetLinkClick(event) {
        console.log("捕获到点击事件:", event);

        if ((event.type === 'click' && event.button !== 0) ||
            (event.type === 'mouseup' && event.button !== 1)) {
            return;
        }

        let target = event.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }

        if (target?.href.startsWith('magnet:')) {
            console.log("捕获到磁力链接:", target.href);
            event.preventDefault();

            const magnetLink = target.href;

            // 登录并添加磁力链接
            login()
                .then(() => addMagnetLink(magnetLink))
                .then(() => alert('磁力链接已添加到 qBittorrent'))
                .catch((error) => alert('错误: ' + error));
        }
    }

    // 监听页面中的点击事件
    document.addEventListener('click', handleMagnetLinkClick, true);
    document.addEventListener('mouseup', handleMagnetLinkClick, true);
})();