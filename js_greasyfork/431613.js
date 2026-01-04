// ==UserScript==
// @name         幽隐恋梦OneDrive密码输入与FDM下载捕获支持
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  幽隐恋梦网站的OneDrive密码输入与FDM下载捕获支持
// @author       You
// @match        *://110657-my.sharepoint.com/*
// @icon         https://www.google.com/s2/favicons?domain=sharepoint.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431613/%E5%B9%BD%E9%9A%90%E6%81%8B%E6%A2%A6OneDrive%E5%AF%86%E7%A0%81%E8%BE%93%E5%85%A5%E4%B8%8EFDM%E4%B8%8B%E8%BD%BD%E6%8D%95%E8%8E%B7%E6%94%AF%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/431613/%E5%B9%BD%E9%9A%90%E6%81%8B%E6%A2%A6OneDrive%E5%AF%86%E7%A0%81%E8%BE%93%E5%85%A5%E4%B8%8EFDM%E4%B8%8B%E8%BD%BD%E6%8D%95%E8%8E%B7%E6%94%AF%E6%8C%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 取消注册service workers
    let re = new RegExp("https://110657-my\.sharepoint\.com/:f:/g/personal/yylm_110657_onmicrosoft_com/.*");
    let isVerify = re.test(window.location.href);
    if(isVerify) {
        let password = document.querySelector('#txtPassword');
        password.value = "yylm";

        let submit = document.querySelector('#btnSubmitPassword');
        submit.click();
    } else {
        if ('serviceWorker' in navigator) {
            setInterval(() => {
                navigator.serviceWorker.getRegistrations()
                    .then(function(registrations) {
                    for(let registration of registrations) {
                        registration.unregister();
                    }
                });
                //console.log("clear service worker")
            }, 2000)
        }
    }
})();