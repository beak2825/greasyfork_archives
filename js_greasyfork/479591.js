// ==UserScript==
// @name        蝦皮短網址
// @namespace   https://greasyfork.org/zh-TW/scripts/479591
// @match       *shopee.tw/*
// @author      czh/XPRAMT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=shopee.tw
// @run-at      document-start
// @license     GNU GPLv3
// @description 縮短蝦皮網址
// @version 1.3
// @downloadURL https://update.greasyfork.org/scripts/479591/%E8%9D%A6%E7%9A%AE%E7%9F%AD%E7%B6%B2%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/479591/%E8%9D%A6%E7%9A%AE%E7%9F%AD%E7%B6%B2%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ShortURL

    // Create a button
    var CopyButton = document.createElement('button');
    CopyButton.className = 'CopyButton'; // Add your custom class  tSCitv
    CopyButton.setAttribute('aria-label', 'Copy');
    CopyButton.textContent = 'Short URL';

    // 设置按钮样式
    CopyButton.style.backgroundColor = 'white';
    CopyButton.style.border = 'none';
    CopyButton.style.fontSize = '15px';
    CopyButton.style.lineHeight = '0px';
    CopyButton.style.cursor = 'pointer';

    // Add button click event
    CopyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(ShortURL);
        CopyButton.textContent = 'Copied!';
        setTimeout(function() {
            CopyButton.textContent = 'Short URL';
        }, 1000);
    });

    function MainFun() {
        var flexContainer = document.querySelector('.flex.items-center.idmlsn');// Find the target flex container
        if (flexContainer) {// Check if the flex container exists
            flexContainer.appendChild(CopyButton);//注入按鈕

            var URL=decodeURIComponent(location.href)

            if (/product/.test(URL)) {
                ShortURL=URL.replace(/^https:\/\//, '')
            }else{
            ShortURL = 'shopee.tw' + URL
                .replace(/^https:\/\/shopee.tw/, '')
                .replace(/\/.*-i\./, '/product/')
                .replace(/\?\S*/, '')
                .replace(/\./g, '/')
                
            }
        }
    }

//第一次執行
    setTimeout(function() {
        MainFun()
    },3000);
//循環
    var mz = location.href;
    setInterval(function () {
        if (mz != location.href) {
            mz=location.href;
            MainFun();
        }
    },5000);

})();