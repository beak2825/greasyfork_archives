// ==UserScript==
// @name        蝦皮短網址DS
// @namespace   https://greasyfork.org/zh-TW/scripts/510400
// @match       *shopee.tw/*
// @author      Dabinn/XPRAMT/czh
// @icon        https://www.google.com/s2/favicons?sz=64&domain=shopee.tw
// @run-at      document-idle
// @license     GNU GPLv3
// @description 產生一個複製短網址的按鈕
// @version 1.5
// @downloadURL https://update.greasyfork.org/scripts/510400/%E8%9D%A6%E7%9A%AE%E7%9F%AD%E7%B6%B2%E5%9D%80DS.user.js
// @updateURL https://update.greasyfork.org/scripts/510400/%E8%9D%A6%E7%9A%AE%E7%9F%AD%E7%B6%B2%E5%9D%80DS.meta.js
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
        navigator.clipboard.writeText('https://'+ShortURL);
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

    function checkContainer() {
        setTimeout(function() {
            MainFun()
        },1500);
    }

    function checkVisible() {
        if (!document.hidden) {
            checkContainer();
        } else {
            document.addEventListener('visibilitychange', checkVisible,{once: true});
        }
    }

    // 頁面狀態檢查
    // 蝦皮疑似在頁面onfocus時有作額外處理
    // 如果頁面開在背景分頁，移到分頁時，插入的CopyButton會被清除
    checkVisible();

    // 換頁偵測
    // 蝦皮直接click商品連結時，是用js控制換頁，不是正常的http導向
    // script不會重新載入，需偵測頁面是否改變
    window.navigation.addEventListener("navigate", function(e) {
        //alert('location changed!');
        checkContainer();
    })


})();