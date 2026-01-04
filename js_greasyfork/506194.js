// ==UserScript==
// @name         ahri8NavigationSaver
// @namespace    https://github.com/JAZZA132/ahri8NavigationSaver
// @description         松鼠症倉庫擴充,免點選與紀錄頁數
// @description:zh-TW   松鼠症倉庫擴充,免點選與紀錄頁數
// @author       AaronWang
// @match        https://ahri8.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ahri8.top
// @grant        GM_log
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_addStyle
// @grant		GM_registerMenuCommand
// @license      GPL-3.0
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/506194/ahri8NavigationSaver.user.js
// @updateURL https://update.greasyfork.org/scripts/506194/ahri8NavigationSaver.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentUrl = window.location.href;
    let referrerUrl = document.referrer;//返回一個字符串，這個字符串是用來表示使用者從哪個網頁跳轉到當前頁面的 URL

    // 检查当前 URL 是否符合指定模式
    let regex1 = /^https:\/\/ahri8\.top\/post\.php\?ID=(\d+)$/; // 匹配點選漫畫畫面
    let regex2 = /^https:\/\/ahri8\.top\/readOnline.*$/; // 匹配從漫畫頁到漫畫簡介
    let match = currentUrl.match(regex1);
    let match2 = referrerUrl.match(regex2);

    let isButtonClicked = false;
    // 獲取按鈕元素
    let readButton = document.querySelector('a.apo.btn.btn-white.btn-default');
    // 檢查按鈕是否存在於頁面中
    if (readButton) {
        // 添加點擊事件監聽器
        readButton.addEventListener('click', function(event) {
            // 防止默認的跳轉行為，根據需要選擇是否阻止
            // event.preventDefault();

            // 在這裡執行你的動作代碼
            console.log('閱讀漫畫按鈕被點擊！');
            
            // 如果你需要執行某些動作，比如存儲資料到 localStorage
            // localStorage.setItem('yourKey', 'yourValue');

            // 如果你想在執行完動作後繼續跳轉頁面，不要使用 event.preventDefault()
            // 使用 GM_setValue 持久化按鈕點擊狀態
            GM_setValue('isButtonClicked', true);
        });
    }
    console.log('GM_getValue(isButtonClicked):', GM_getValue('isButtonClicked'));
    // 網頁是使用ajax,監視url變化
    let nowHref = document.location.href;
    let nowMangaPage = nowHref.match(regex2); // 匹配當前是不是漫畫頁


    if (match2) {
        //如果是從漫畫頁進入到漫畫簡介,則不動作
        console.log('match2');
        // 離開漫畫頁面時重置按鈕點擊狀態
        GM_setValue('isButtonClicked', false);

    } else if (match || GM_getValue('isButtonClicked')) {
        console.log('match1 or isButtonClicked');
        // 正則,取得 ex: https://ahri8.top/readOnline2.php?ID=125691 的ID
        let postId = nowHref.match(/ID=(\d+)/)[1];

        // 从 localStorage 中获取页数
        let pageValue = localStorage.getItem(postId);
        if (pageValue === null) {
            pageValue = 1;
        }

        // 构建重定向 URL
        let redirectUrl = 'https://ahri8.top/readOnline2.php?ID=' + postId + '&host_id=0&page=' + pageValue;

        // 执行重定向
        window.location.href = redirectUrl;

        // 重定向後重置按鈕點擊狀態
        GM_setValue('isButtonClicked', false);

    }

    if (nowMangaPage) {

        console.log('nowMangaPage');
        // 監控url變化
        setInterval(function () {
            if (nowHref != document.location.href) {
                nowHref = document.location.href;
                let newHref = document.location.href;
                // 正則,取得 ex: https://ahri8.top/readOnline2.php?ID=125691 的ID
                let postId = newHref.match(/ID=(\d+)/)[1];

                // 取得當前頁數
                var newPageValue = newHref.match(/&page=(\d+)/)[1];
                console.log('newPageValue:', newPageValue);
                localStorage.setItem(postId, newPageValue);
                console.log(postId + '儲存值 ' + newPageValue + ' 到 localStorage。');
            }
        }, 1000);
    }

})();
