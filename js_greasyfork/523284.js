// ==UserScript==
// @name         憨憨主页种子推送到QB
// @author       Orange7
// @license      GPL-2.0
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  将种子推送到qBittorrent下载
// @icon         https://www.qbittorrent.org/favicon.svg
// @match        https://hhanclub.top/torrents.php*
// @match        https://hhanclub.top/rescue.php*
// @match        https://hhan.club/torrents.php*
// @match        https://hhan.club/rescue.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        window.onurlchange
// @run-at       document-start
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/523284/%E6%86%A8%E6%86%A8%E4%B8%BB%E9%A1%B5%E7%A7%8D%E5%AD%90%E6%8E%A8%E9%80%81%E5%88%B0QB.user.js
// @updateURL https://update.greasyfork.org/scripts/523284/%E6%86%A8%E6%86%A8%E4%B8%BB%E9%A1%B5%E7%A7%8D%E5%AD%90%E6%8E%A8%E9%80%81%E5%88%B0QB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加全局CSS样式
    GM_addStyle(`
        .torrent-manage .flex.flex-col a[href^="download.php"] {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
        }
    `);

    // QB配置
    const DEFAULT_CONFIG = {
        address: 'http://localhost:8080',
        username: 'admin',
        password: 'adminadmin',
        savePath: '',
        autoStart: true,
        tags: '',
        category: '',
        useRawMode: false,  // 添加 raw 模式开关
        upLimit: 0  // 添加上传速度限制参数
    };

    // 获取配置
    function getConfig() {
        return {
            address: GM_getValue('qb_address', DEFAULT_CONFIG.address),
            username: GM_getValue('qb_username', DEFAULT_CONFIG.username),
            password: GM_getValue('qb_password', DEFAULT_CONFIG.password),
            savePath: GM_getValue('qb_savepath', DEFAULT_CONFIG.savePath),
            autoStart: GM_getValue('qb_autostart', DEFAULT_CONFIG.autoStart),
            tags: GM_getValue('qb_tags', DEFAULT_CONFIG.tags),
            category: GM_getValue('qb_category', DEFAULT_CONFIG.category),
            useRawMode: GM_getValue('qb_userawmode', DEFAULT_CONFIG.useRawMode),
            upLimit: GM_getValue('qb_uplimit', DEFAULT_CONFIG.upLimit)
        };
    }

    // QB登录
    function qbLogin() {
        const config = getConfig();
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${config.address}/api/v2/auth/login`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: `username=${encodeURIComponent(config.username)}&password=${encodeURIComponent(config.password)}`,
                onload: function(response) {
                    if (response.status === 200 && response.responseText === 'Ok.') {
                        resolve();
                    } else {
                        reject('登录失败');
                    }
                },
                onerror: function() {
                    reject('连接失败');
                }
            });
        });
    }

    // 添加种子到QB
    function addTorrent(torrentUrl) {
        const config = getConfig();
        return qbLogin().then(() => {
            if (!config.useRawMode) {
                // 使用 URLs 模式
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${config.address}/api/v2/torrents/add`,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: `urls=${encodeURIComponent(torrentUrl)}&savepath=${encodeURIComponent(config.savePath)}&paused=${!config.autoStart}&tags=${encodeURIComponent(config.tags)}&category=${encodeURIComponent(config.category)}&upLimit=${config.upLimit * 1024}`,
                        onload: function(response) {
                            if (response.status === 200 && response.responseText === 'Ok.') {
                                resolve('添加成功');
                            } else {
                                reject('添加失败');
                            }
                        },
                        onerror: function() {
                            reject('连接失败');
                        }
                    });
                });
            } else {
                // 使用 RAW 模式
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: torrentUrl,
                        responseType: 'blob',
                        onload: function(response) {
                            if (response.status === 200) {
                                const torrentBlob = new Blob([response.response], { type: 'application/x-bittorrent' });
                                const formData = new FormData();
                                formData.append('torrents', torrentBlob, 'downloaded.torrent');
                                formData.append('savepath', config.savePath);
                                formData.append('paused', !config.autoStart);
                                formData.append('tags', config.tags);
                                formData.append('category', config.category);
                                formData.append('upLimit', config.upLimit * 1024);
                                GM_xmlhttpRequest({
                                    method: 'POST',
                                    url: `${config.address}/api/v2/torrents/add`,
                                    headers: {
                                    },
                                    data: formData,
                                    onload: function (response) {
                                        if (response.status === 200) {
                                            console.log('种子上传成功', response);
                                            resolve('添加成功');
                                        } else {
                                            console.error('种子上传失败', response);
                                            reject('添加失败');
                                        }
                                    },
                                    onerror: function (err) {
                                        console.error('上传请求失败', err);
                                        reject('连接失败');
                                    },
                                });
                            } else {
                                reject('下载种子失败');
                            }
                        },
                        onerror: function() {
                            reject('下载种子失败');
                        }
                    });
                });
            }
        });
    }

    // 创建配置界面
    function createConfigUI() {
        const config = getConfig();
        const div = document.createElement('div');
        div.innerHTML = `
    <div id="qb-config" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);z-index:9999;display:none;min-width:320px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
        <h3 style="margin:0 0 20px 0;color:#333;font-size:18px;text-align:center;padding-bottom:10px;border-bottom:1px solid #eee;">qBittorrent配置</h3>
        <div style="margin-bottom:15px;">
            <label style="display:block;margin-bottom:5px;color:#666;font-size:14px;">地址</label>
            <input type="text" id="qb-address" value="${config.address}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;margin-top:3px;">
        </div>
        <div style="margin-bottom:15px;">
            <label style="display:block;margin-bottom:5px;color:#666;font-size:14px;">用户名</label>
            <input type="text" id="qb-username" value="${config.username}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;margin-top:3px;">
        </div>
        <div style="margin-bottom:15px;">
            <label style="display:block;margin-bottom:5px;color:#666;font-size:14px;">密码</label>
            <input type="password" id="qb-password" value="${config.password}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;margin-top:3px;">
        </div>
        <div style="margin-bottom:15px;">
            <label style="display:block;margin-bottom:5px;color:#666;font-size:14px;">保存路径(不填取默认)</label>
            <input type="text" id="qb-savepath" value="${config.savePath}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;margin-top:3px;">
        </div>
        <div style="margin-bottom:15px;">
            <label style="display:block;margin-bottom:5px;color:#666;font-size:14px;">分类</label>
            <input type="text" id="qb-category" value="${config.category || ''}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;margin-top:3px;">
        </div>
        <div style="margin-bottom:15px;">
            <label style="display:block;margin-bottom:5px;color:#666;font-size:14px;">标签 (多个用,分隔)</label>
            <input type="text" id="qb-tags" value="${config.tags}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;margin-top:3px;">
        </div>
        <div style="margin-bottom:15px;">
            <label style="display:block;color:#666;font-size:14px;">
                <input type="checkbox" id="qb-autostart" ${config.autoStart ? 'checked' : ''} style="margin-right:5px;">
                自动开始下载
            </label>
        </div>
        <div style="margin-bottom:15px;">
            <label style="display:block;color:#666;font-size:14px;">
                <input type="checkbox" id="qb-userawmode" ${config.useRawMode ? 'checked' : ''} style="margin-right:5px;">
                使用RAW模式 (先下载种子再上传)
            </label>
        </div>
        <div style="margin-bottom:15px;">
            <label style="display:block;margin-bottom:5px;color:#666;font-size:14px;">上传速度限制 (KB/s，0为无限制)</label>
            <input type="number" id="qb-uplimit" value="${config.upLimit}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;margin-top:3px;">
        </div>
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;">
            <button id="qb-cancel" style="padding:8px 16px;border:none;border-radius:4px;cursor:pointer;font-size:14px;background-color:#f5f5f5;color:#666;">取消</button>
            <button id="qb-save" style="padding:8px 16px;border:none;border-radius:4px;cursor:pointer;font-size:14px;background-color:#54F7A4;color:white;">保存</button>
        </div>
    </div>
    `;
        document.body.appendChild(div);

        // 保存配置
        document.getElementById('qb-save').addEventListener('click', () => {
            GM_setValue('qb_address', document.getElementById('qb-address').value);
            GM_setValue('qb_username', document.getElementById('qb-username').value);
            GM_setValue('qb_password', document.getElementById('qb-password').value);
            GM_setValue('qb_savepath', document.getElementById('qb-savepath').value);
            GM_setValue('qb_category', document.getElementById('qb-category').value); // 保存分类
            GM_setValue('qb_autostart', document.getElementById('qb-autostart').checked);
            GM_setValue('qb_tags', document.getElementById('qb-tags').value);
            GM_setValue('qb_userawmode', document.getElementById('qb-userawmode').checked);
            GM_setValue('qb_uplimit', parseInt(document.getElementById('qb-uplimit').value) || 0);
            document.getElementById('qb-config').style.display = 'none';
        });

        document.getElementById('qb-cancel').addEventListener('click', () => {
            document.getElementById('qb-config').style.display = 'none';
        });
    }
    // 主函数
    function main() {
        // 创建配置界面
        createConfigUI();

        // 注册配置菜单
        GM_registerMenuCommand('QB配置', () => {
            document.getElementById('qb-config').style.display = 'block';
        });

        // 查找所有下载按钮
        const torrentDivs = document.querySelectorAll('div.torrent-manage');

        torrentDivs.forEach(div => {
            const downloadLink = div.querySelector('a[href^="download.php"]');
            if (!downloadLink) return;

            // 创建QB按钮
            const qbButton = document.createElement('a');
            qbButton.href = 'javascript:void(0);';
            qbButton.className = 'xl:px-[5px] text-[14px] bg-[#F29D38] !text-[#FFFFFF] rounded-[5px]';
            qbButton.textContent = '推送到QB';
            qbButton.style.marginTop = '5px';

            // 添加点击事件
            qbButton.addEventListener('click', () => {
                const torrentUrl = new URL(downloadLink.href, window.location.href).href;
                addTorrent(torrentUrl)
                    .then(msg => alert(msg))
                    .catch(err => alert('错误: ' + err));
            });

            // 添加按钮到页面
            const buttonContainer = div.querySelector('.flex.flex-col');
            if (buttonContainer) {
                buttonContainer.appendChild(qbButton);
            }
        });
    }

    // 当DOM加载完成后执行
    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();