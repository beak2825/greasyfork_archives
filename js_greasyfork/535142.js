// ==UserScript==
// @name         志愿云 - 自动填写登录验证码
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  打开页面后自动获取验证码并填写
// @match        https://*.zhiyuanyun.com/app/user/login.php
// @grant        GM_xmlhttpRequest
// @connect      www.bv2008.cn
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535142/%E5%BF%97%E6%84%BF%E4%BA%91%20-%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E7%99%BB%E5%BD%95%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/535142/%E5%BF%97%E6%84%BF%E4%BA%91%20-%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E7%99%BB%E5%BD%95%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x6309092b) XWEB/8461 Flue';

    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://www.bv2008.cn/app/api/view.php?m=get_login_yzm',
        headers: {
            'User-Agent': customUA
        },
        onload: function(response) {
            if (response.status === 200) {
                const match = response.responseText.match(/<p[^>]*font-weight:bold[^>]*>(\d{6})<\/p>/);
                if (match && match[1]) {
                    const code = match[1];
                    const input = document.querySelector('#uyzm');
                    if (input) {
                        input.value = code;
                        console.log('验证码已自动填写：', code);
                    } else {
                        console.warn('找不到输入框 #uyzm');
                    }
                } else {
                    console.warn('验证码提取失败');
                }
            } else {
                console.error('验证码请求失败：HTTP', response.status);
            }
        }
    });
})();
