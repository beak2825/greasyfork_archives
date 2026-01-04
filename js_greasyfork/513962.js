// ==UserScript==
// @name         123云盘下载辅助
// @namespace    https://github.com/Bao-qing/123pan
// @version      0.3
// @description  123 Cloud Drive Unlimited Flow
// @match        https://www.123pan.com/*
// @match        https://www.123pan.cn/*
// @match        https://www.123865.com/*
// @match        https://www.123684.com/*
// @grant        none
// @author       Qing
// @downloadURL https://update.greasyfork.org/scripts/513962/123%E4%BA%91%E7%9B%98%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/513962/123%E4%BA%91%E7%9B%98%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    const OriginalXHR = window.XMLHttpRequest;
    const headersToOverride = {
        "user-agent": "123pan/v2.4.7(Android_7.12;Xiaomi)",
        "platform": "android",
        "app-version": "69",
        "x-app-version": "2.4.7"
    };

    function NewXHR() {
        const xhr = new OriginalXHR();

        xhr.open = function (method, url, async, user, password) {
            this._url = url;
            return OriginalXHR.prototype.open.call(this, method, url, async, user, password);
        };

        xhr.setRequestHeader = function (header, value) {
            const lowerHeader = header.toLowerCase();
            if (lowerHeader in headersToOverride) {
                value = headersToOverride[lowerHeader];
            } else {
                console.log('未覆盖的请求头:', header);
            }
            return OriginalXHR.prototype.setRequestHeader.call(this, header, value);
        };

        xhr.send = function (...args) {
            this.addEventListener('readystatechange', function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    try {
                        const responseJSON = JSON.parse(xhr.responseText);
                        console.log('原始响应:', responseJSON);

                        if (responseJSON.data && responseJSON.data.DownloadUrl) {
                            const originUrl = responseJSON.data.DownloadUrl;
                            const newUrlNoRedirect = `${originUrl}&auto_redirect=0`;
                            const base64Data = btoa(newUrlNoRedirect);
                            responseJSON.data.DownloadUrl = `https://web-pro2.123952.com/download-v2/?params=${base64Data}&is_s3=0`;
                            console.log('修改后的 DownloadUrl:', responseJSON.data.DownloadUrl);
                        }

                        const modifiedResponseText = JSON.stringify(responseJSON);

                        Object.defineProperty(xhr, 'responseText', {
                            get: () => modifiedResponseText
                        });
                        console.log('修改后的响应:', modifiedResponseText);
                    } catch (error) {
                        console.error('修改响应时出错:', error);
                    }
                }
            });

            return OriginalXHR.prototype.send.apply(this, args);
        };

        return xhr;
    }

    window.XMLHttpRequest = NewXHR;
})();