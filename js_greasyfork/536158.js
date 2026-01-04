// ==UserScript==
// @name         123云盘浏览器不限速下载 + 去广告
// @namespace    123pan-download-xiaoyu
// @version      1.0
// @description  登录123云盘后自动提取真实下载地址实现不限速下载，并自动隐藏广告轮播图和提示弹窗。
// @match        https://www.123pan.c*/*
// @match        https://www.123*.com/*
// @match        https://www.123*.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536158/123%E4%BA%91%E7%9B%98%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD%20%2B%20%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/536158/123%E4%BA%91%E7%9B%98%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD%20%2B%20%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    const originalXHR = window.XMLHttpRequest;

    function newXHR() {
        const realXHR = new originalXHR();

        realXHR.open = function (method, url, async, user, password) {
            this._url = url;
            return originalXHR.prototype.open.apply(this, arguments);
        };

        realXHR.setRequestHeader = function (header, value) {
            const headers = {
                "user-agent": "123pan/v3.0.0(Android_14.1.2;Meizu21Pro)",
                "platform": "android",
                "app-version": "65",
                "x-app-version": "3.0.0"
            };
            if (header.toLowerCase() in headers) value = headers[header.toLowerCase()];
            return originalXHR.prototype.setRequestHeader.apply(this, arguments);
        };

        realXHR.send = function () {
            const xhrInstance = this;
            this.addEventListener('readystatechange', function () {
                if (
                    xhrInstance.readyState === 4 &&
                    xhrInstance.status === 200 &&
                    xhrInstance._url?.includes("api/file/download_info")
                ) {
                    let responseJSON;
                    try {
                        responseJSON = JSON.parse(xhrInstance.responseText);
                    } catch (e) {
                        return;
                    }

                    if (responseJSON?.data?.DownloadUrl) {
                        console.log("🎯 捕获到真实下载地址:", responseJSON.data.DownloadUrl);
                        triggerDownload(responseJSON.data.DownloadUrl);

                        // 修改响应信息（防止页面自己触发原始下载）
                        responseJSON.code = 404;
                        responseJSON.message = "✔✔✔ 开始下载 ✔✔✔";

                        Object.defineProperty(xhrInstance, 'responseText', {
                            get: () => JSON.stringify(responseJSON)
                        });
                    }
                }
            });
            return originalXHR.prototype.send.apply(this, arguments);
        };

        return realXHR;
    }

    window.XMLHttpRequest = newXHR;

    // 下载函数
    function triggerDownload(url, filename = '') {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // ========== 二、UI 元素隐藏逻辑 ==========
    const observer = new MutationObserver(() => {
        observer.disconnect();  // 防止死循环
        hideIfExists();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    const hideIfExists = () => {
        // 隐藏轮播图
        document.querySelectorAll('.ant-carousel').forEach(el => {
            if (el.style.display !== 'none') el.style.display = 'none';
        });

        // 修改提示内容，避免无限触发 observer
        document.querySelectorAll('.header-tips').forEach(el => {
            const msg = '🔔请忽略弹窗报错。';
            if (el.innerText !== msg) el.innerText = msg;
        });
    };

    hideIfExists();
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
