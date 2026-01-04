        // ==UserScript==
        // @name         一夕茵便利化插件
        // @namespace    https://github.com/HaoNShi/Tampermonkey_Scripts
        // @version      1.2
        // @icon         https://img.alicdn.com/imgextra/i3/1744682549/O1CN01oWhtgh1UhUDHv4nVS_!!1744682549.png
        // @description 便利你工作与生活是我们一直努力的方向
        // @author       yixiyin
        // @match        *://*.www.yixiyin.com/*
        // @grant        none
        // @require      https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/424690/%E4%B8%80%E5%A4%95%E8%8C%B5%E4%BE%BF%E5%88%A9%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/424690/%E4%B8%80%E5%A4%95%E8%8C%B5%E4%BE%BF%E5%88%A9%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
        // ==/UserScript==

         const refreshTime = 1000; // 检测广告的刷新时间
        // 百度网盘粘贴提取码
        if (location.href.indexOf('pan.baidu.com') > 0) {
            alert('百度网盘')
            setInterval(function() {
                if (document.querySelector('#accessCode') != null) {
                    let accessCode = document.querySelector('#accessCode');
                    accessCode.value = '5555';
                }
            }, refreshTime);
        }