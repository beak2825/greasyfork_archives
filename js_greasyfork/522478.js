// ==UserScript==
// @name         123网盘无广告下载增强
// @name:zh-TW   123網盤無廣告下載增強
// @description  123网盘去广告，并伪装客户端下载
// @description:zh-TW  123網盤去廣告，並偽裝客戶端下載
// @version       0.33
// @author       HSSkyBoy
// @match      https://www.123pan.com/s/*
// @match      https://www.123pan.cn/s/*
// @match     https://www.123912.com/*
// @match     https://www.123865.com/*
// @namespace   https://www.123pan.cn/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522478/123%E7%BD%91%E7%9B%98%E6%97%A0%E5%B9%BF%E5%91%8A%E4%B8%8B%E8%BD%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/522478/123%E7%BD%91%E7%9B%98%E6%97%A0%E5%B9%BF%E5%91%8A%E4%B8%8B%E8%BD%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // 移除广告元素
    function removeAds() {
        const adSelectors = [
            '.banner_all_wrap',
            '.pointer',
            '.qrcode_btn',
            '.share-time-wrap__operate',
 'img[src="https://statics.123pan.com/share-static/dist/static/H5_logo_top.2b680600.svg"]',
            '.loginModal-footer',
            '.download-msg-info',
            '.inner-container-h5',
            '.app-header-img',
            '.bg_svip_block_ads',
            '.sharheader_left'
        ];

        // 批量移除广告元素
        adSelectors.forEach(selector => {
            const ads = document.querySelectorAll(selector);
            ads.forEach(ad => ad.remove());
        });
    }
})();


function addStyle(cssstyle) {
    let styleNode = document.createElement("style");
    styleNode.appendChild(document.createTextNode(cssstyle));
    (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}

// 设置CSS样式
let css = `
.appBottomBtn {
    position: fixed !important;
    bottom: 0 !important; 
}

#xxl {
    position: fixed !important;
    top: 1% !important;
    right: 1% !important;
    width: 98% !important;
}

.banner_all_wrap, .pointer, .qrcode_btn, share-time-wrap__operate, img[src="https://statics.123pan.com/share-static/dist/static/H5_logo_top.2b680600.svg"], .loginModal-footer, .download-msg-info, nner-container-h5, .app-header-img, .bg_svip_block_ads, .sharheader_left {
   display: none !important; 
}
`;

addStyle(css);

setTimeout(function() {
    var pageTitle = document.title;
    var newTitle = pageTitle.replace("官方版下载丨", "").replace("绿色版下载丨", "").replace("最版下载丨", "");
    document.title = newTitle;
}, 500);


// 修改页面中的特定文本
function modifyText() {
    const allElements = document.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        if (element.textContent && element.textContent.includes('永久')) {
            element.textContent = element.textContent.replace('永久', '10年');
        }
    }
}

// 修改文本
modifyText();

document.addEventListener('copy', function(e) {
    // 阻止默认行为
    e.preventDefault();
    // 阻止事件传播
    e.stopPropagation();
});

(function () {
    // 配置对象，包含请求头和日志记录开关
    const config = {
        headers: {
            "user-agent": "123pan/v2.5.0(Android_12;Honor)",
            "platform": "android",
            "app-version": "73",
            "x-app-version": "2.5.0"
        },
        logEnabled: true // 控制日志记录的开关
    };

    // 重写 XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;

    function newXHR() {
        const realXHR = new originalXHR();

        // 重写 open 方法，记录请求的 URL
        realXHR.open = function (method, url, async, user, password) {
            this._url = url;  // 记录请求的 URL
            return originalXHR.prototype.open.apply(this, arguments);
        };

        // 重写 setRequestHeader 方法，修改特定的请求头
        realXHR.setRequestHeader = function (header, value) {
            // 如果 header 在配置中，则使用配置中的值
            if (header.toLowerCase() in config.headers) {
                value = config.headers[header.toLowerCase()];
            }
            if (config.logEnabled) {
                console.log('Setting header:', header, 'to', value);
            }
            return originalXHR.prototype.setRequestHeader.apply(this, arguments);
        };

        // 重写 send 方法，拦截响应内容，修改 DownloadUrl
        realXHR.send = function () {
            const xhrInstance = this;
            this.addEventListener('readystatechange', function () {
                if (xhrInstance.readyState === 4) {
                    if (xhrInstance.status === 200) {
                        let responseText = xhrInstance.responseText;
                        try {
                            let responseJSON = JSON.parse(responseText);
                            if (config.logEnabled) {
                                console.log('Original Response:', responseJSON);
                            }

                            // 修改 DownloadUrl
                            if (responseJSON.data && responseJSON.data.DownloadUrl) {
                                let origin_url = responseJSON.data.DownloadUrl;
                                let new_url_no_redirect = origin_url + "&auto_redirect=0";
                                let base64data = btoa(unescape(encodeURIComponent(new_url_no_redirect)));
                                responseJSON.data.DownloadUrl = "https://web-pro2.123952.com/download-v2/?params=" + base64data + "&is_s3=0";
                                if (config.logEnabled) {
                                    console.log('Modified DownloadUrl:', responseJSON.data.DownloadUrl);
                                }
                            }

                            // 将修改后的 JSON 转为字符串
                            let modifiedResponseText = JSON.stringify(responseJSON);

                            // 使用 defineProperty 重写 responseText
                            Object.defineProperty(xhrInstance, 'responseText', {
                                get: function () {
                                    return modifiedResponseText;
                                }
                            });
                            if (config.logEnabled) {
                                console.log('Modified Response:', modifiedResponseText);
                            }
                        } catch (e) {
                            if (config.logEnabled) {
                                console.error('Error parsing JSON response:', e);
                            }
                        }
                    } else {
                        if (config.logEnabled) {
                            console.error('Request failed with status:', xhrInstance.status);
                        }
                    }
                }
            });

            return originalXHR.prototype.send.apply(this, arguments);
        };

        return realXHR;
    }

    window.XMLHttpRequest = newXHR;

    removeAds();;
})();
