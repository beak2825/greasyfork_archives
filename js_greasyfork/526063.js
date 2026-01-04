// ==UserScript==
// @name         DCloud uniapp 插件验证码下载 
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动获取验证码、显示导入HBuilderX和下载ZIP按钮，并处理下载链接中的plugin参数（解析后打开download_url字段）
// @license      MIT
// @match        https://ext.dcloud.net.cn/plugin?id=*
// @match        https://p.dcloud.net.cn/plugin?id=*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      ext.dcloud.net.cn
// @downloadURL https://update.greasyfork.org/scripts/526063/DCloud%20uniapp%20%E6%8F%92%E4%BB%B6%E9%AA%8C%E8%AF%81%E7%A0%81%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/526063/DCloud%20uniapp%20%E6%8F%92%E4%BB%B6%E9%AA%8C%E8%AF%81%E7%A0%81%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取插件ID
    const pluginId = new URLSearchParams(window.location.search).get('id');

    // 创建下载按钮
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '获取下载链接';
    downloadBtn.style.cursor = 'pointer';
    downloadBtn.classList.add("btn", "btn-hx-import");

    // 插入按钮到 .download 区域的第一个元素前
    const downloadSection = document.querySelector('.download');
    if (downloadSection && downloadSection.firstChild) {
        downloadSection.insertBefore(downloadBtn, downloadSection.firstChild);
    }

    // 下载按钮点击事件（异步处理）
    downloadBtn.addEventListener('click', async function () {
        if (!isLoggedIn()) {
            alert('请先登录后再进行操作！');
            return;
        }
        const downloadResult = await tryFetchDownloadUrl();
        if (typeof downloadResult === 'string') {
            // 已经获取到下载链接，显示两个新按钮供选择
            showDownloadOptions(downloadResult);
        } else {
            // 返回 false 表示需要验证码验证
            showCaptchaModal();
        }
    });

    function isLoggedIn() {
        // 检查页面中是否存在退出链接
         const logoutLink = document.querySelector('a[href="http://ext.dcloud.net.cn/auth/logout"]');
        const logoutLinkNew = document.querySelector('a[href="http://p.dcloud.net.cn/auth/logout"]');
        return logoutLink !== null || logoutLinkNew !=null;
    }

    // 尝试获取下载链接，返回 Promise：下载链接字符串或者 false 表示需要验证码
    function tryFetchDownloadUrl() {
        return new Promise((resolve, reject) => {
            const downloadUrl = `https://ext.dcloud.net.cn/plugin/download?id=${pluginId}&hx=1&ex=0&type=1&is_version=0&history_version`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: downloadUrl,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        // ret===3000 表示需要验证码
                        if (data && data.ret === 3000) {
                            resolve(false);
                        } else if (data && data.data && data.data.url) {
                            resolve(data.data.url);
                        } else {
                            alert('获取下载链接失败');
                            resolve(false);
                        }
                    } catch (e) {
                        alert('解析响应失败');
                        resolve(false);
                    }
                },
                onerror: function (error) {
                    alert('请求失败，请检查网络');
                    resolve(false);
                }
            });
        });
    }

    // 显示验证码模态框，用于手动输入验证码
    function showCaptchaModal() {
        // 创建模态框
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.borderRadius = '8px';
        modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        modal.style.zIndex = '9999';
        modal.style.minWidth = '280px';
        modal.style.textAlign = 'center';
        modal.style.fontFamily = 'Arial, sans-serif';

        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '5px';
        closeBtn.style.right = '5px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.background = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '16px';
        closeBtn.addEventListener('click', function () {
            modal.remove();
        });
        modal.appendChild(closeBtn);

        // 验证码图片容器
        const img = document.createElement('img');
        img.style.marginBottom = '10px';
        img.style.maxWidth = '100%';

        // 输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '输入验证码';
        input.style.marginRight = '10px';
        input.style.padding = '5px';
        input.style.width = 'calc(100% - 22px)'; // 适应容器宽度

        // 确认按钮
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '确认';
        confirmBtn.style.padding = '5px 10px';
        confirmBtn.style.backgroundColor = '#007aff';
        confirmBtn.style.color = 'white';
        confirmBtn.style.border = 'none';
        confirmBtn.style.borderRadius = '4px';
        confirmBtn.style.cursor = 'pointer';
        confirmBtn.style.marginTop = '10px';

        // 加载验证码
        loadCaptcha(img);

        modal.appendChild(img);
        modal.appendChild(input);
        modal.appendChild(confirmBtn);

        // 添加到页面
        document.body.appendChild(modal);

        // 确认按钮点击事件
        confirmBtn.addEventListener('click', function () {
            const verifyCode = input.value.trim();
            if (!verifyCode) {
                return;
            }
            fetchDownloadUrl(verifyCode, modal);
        });
    }

    // 加载验证码图片
    function loadCaptcha(imgElement) {
        const timestamp = Date.now();
        const captchaUrl = `https://ext.dcloud.net.cn/captcha/download?t=${timestamp}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: captchaUrl,
            responseType: 'blob',
            onload: function (response) {
                const blob = new Blob([response.response], {type: 'image/png'});
                imgElement.src = URL.createObjectURL(blob);
            },
            onerror: function (error) {
                alert('验证码加载失败，请刷新重试');
            }
        });
    }

    // 根据验证码获取下载链接
    function fetchDownloadUrl(verifyCode, modal) {
        const downloadUrl = `https://ext.dcloud.net.cn/plugin/download?id=${pluginId}&verifycode=${verifyCode}&hx=1&ex=0&type=1&is_version=0&history_version`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: downloadUrl,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    console.log(data);
                    if (data && data.data && data.data.url) {
                        showDownloadOptions(data.data.url, modal);
                    } else {
                        alert('下载失败：' + (data.message || '未知错误'));
                        // 刷新验证码图片
                        loadCaptcha(modal.querySelector('img'));
                    }
                } catch (e) {
                    alert('解析响应失败');
                }
            },
            onerror: function (error) {
                alert('请求失败，请检查网络');
            }
        });
    }

    // 显示导入HBuilderX和下载ZIP两个按钮，并在用户点击时触发相应功能
    function showDownloadOptions(url, modal) {
        // 如果有模态框，先关闭
        if (modal) {
            modal.remove();
        }

        // 清除下载按钮以避免重复添加
        downloadBtn.remove();

        // 创建 导入HBuilderX 按钮
        const importBtn = document.createElement('button');
        importBtn.textContent = '导入HBuilderX';
        importBtn.classList.add("btn", "btn-hx-import");
        importBtn.style.cursor = 'pointer';
        importBtn.style.marginRight = '10px';
        importBtn.addEventListener('click', function () {
            console.log('导入HBuilderX', url);
            GM_openInTab(url, {active: true});
        });

        // 创建 下载ZIP 按钮
        const zipBtn = document.createElement('button');
        zipBtn.textContent = '下载ZIP';
        zipBtn.classList.add("btn", "btn-hx-import");
        zipBtn.style.cursor = 'pointer';
        zipBtn.addEventListener('click', function () {
            console.log('下载ZIP', url);
            handleDownloadZip(url);
        });

        // 添加按钮到 .download 区域（可根据需要插入到具体位置）
        if (downloadSection && downloadSection.firstChild) {
            downloadSection.insertBefore(zipBtn, downloadSection.firstChild);
            downloadSection.insertBefore(importBtn, downloadSection.firstChild);
        }
    }

    // 解析下载链接中的 plugin 参数（JSON格式），并打开其中的 download_url 地址
    function handleDownloadZip(url) {
        try {
            const urlObj = new URL(url);
            const pluginParam = urlObj.searchParams.get('plugin');
            if (!pluginParam) {
                alert('没有找到 plugin 参数');
                return;
            }
            // 使用 decodeURIComponent 处理可能的编码
            const pluginJson = JSON.parse(decodeURIComponent(pluginParam));
            if (pluginJson && pluginJson.download_url) {
                GM_openInTab(pluginJson.download_url, {active: true});
            } else {
                alert('下载链接不存在');
            }
        } catch (e) {
            alert('解析 plugin 参数失败');
        }
    }
})();
