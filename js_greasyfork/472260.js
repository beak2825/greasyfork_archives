// ==UserScript==
// @name         用酷安打开
// @namespace    ShangJixin
// @version      1.1
// @description  解决酷安的分享链接在电脑浏览器拉起WSA版酷安的问题，通过纠正酷安URL Scheme的调用逻辑实现
// @author       尚寂新
// @match        https://www.coolapk.com/feed/*
// @icon         https://static.coolapk.com/static/web/v8/images/header-logo.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472260/%E7%94%A8%E9%85%B7%E5%AE%89%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/472260/%E7%94%A8%E9%85%B7%E5%AE%89%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    toApp = function () {
        // 封装个跳转app的方法
        var device = navigator.userAgent.toLowerCase();
        var config = {
            // scheme:必须要有，与app里的配置scheme一致
            scheme_IOS: 'https://www.coolapk.com/qr/download?type=ios',
            scheme_Adr: 'coolmarket://feed/' + window.location.href.split('/')[4].split('?')[0],
            timeout: 1000
        };

        // 虽然是QQ与微信的打开方法，但酷安把它封装到了toAPP方法里，为了更好的兼容性还是选择留下
        if (device.indexOf('micromessenger') > 0 || (device.indexOf('mqqbrowser') > 0 && device.indexOf('status') > 0)) {
            if (device.indexOf('iphone') > 0 || device.indexOf('ipad') > 0) {
                window.location.href = 'https://www.coolapk.com/qr/download';
            } else {
                window.location.href = 'https://www.coolapk.com/qr/weixin?redirectUrl=' + encodeURIComponent(window.location.href);
            }
        }

        function openApp() {
            var startTime = Date.now();
            var ifr = document.createElement('iframe');
            // 原欠考虑的逻辑，不应将保底回落到小众的APP Store方案上，应该回落到更多设备支持的URL Scheme上来
            // ifr.src = device.indexOf('android') > 0 ? config.scheme_Adr : config.scheme_IOS;
            ifr.src = device.indexOf('iphone') > 0 || device.indexOf('ipad') > 0 ? config.scheme_IOS : config.scheme_Adr;
            ifr.style.display = 'none';
            document.body.appendChild(ifr);
            var time = setTimeout(function () {
                document.body.removeChild(ifr);
                var endTime = Date.now();
                if ((!startTime || endTime - startTime < 2040) && device.indexOf('micromessenger') <= 0) {
                    showDialog('dialog1');
                }
            }, 1000);

            window.onblur = function () {
                clearTimeout(time);//清除定时器
            }
        }
        openApp();
    };
})();