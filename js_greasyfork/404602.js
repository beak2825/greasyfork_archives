// ==UserScript==
// @name         知乎免登陆自动跳转发现页
// @namespace    https://www.zhihu.com/
// @version      0.6
// @description  去除跳转登录页，以及自动关闭登录提示
// @author       chinaqsq@126.com
// @match        *://*.zhihu.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/404602/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E9%99%86%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%8F%91%E7%8E%B0%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/404602/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E9%99%86%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%8F%91%E7%8E%B0%E9%A1%B5.meta.js
// ==/UserScript==



(function () {
    'use strict';

    let loginClick = 0;

    document.querySelector('body').addEventListener('DOMNodeInserted', function (e) {
        if (e.target.getElementsByClassName('Modal signFlowModal').length !== 0 && loginClick === 0) {            
            e.target.getElementsByClassName('Modal-closeButton')[0].click();
        }
        loginClick = 0;
    });

    
    if (location.href.indexOf("zhihu.com/signin") != -1) {
        location.href = "https://www.zhihu.com/explore";
    } else if (location.href.indexOf("zhihu.com/explore") != -1) {
        let timeout=400;
        // console.log(timeout);
        setTimeout(function () {
            let searchInput = document.getElementById("Popover1-toggle");
            if (searchInput) {
                searchInput.focus();
            }
        }, timeout);
    }

    //#root > div > div:nth-child(2) > header > div.AppHeader-inner > div.AppHeader-userInfo > div > div > button.Button.AppHeader-login.Button--blue
    document.querySelector('body').addEventListener('click', function (e) {
        //console.log(e.target.className);
        if (e.target.className.indexOf('Button--blue') != -1) {            
            loginClick = 1;
        }
    },true);


})();

// Question-sideColumn 
GM_addStyle('.Question-sideColumn{margin-right: -270px}')
// Question-mainColumn
GM_addStyle('.Question-mainColumn{width: 960px}')
GM_addStyle('.ztext p{margin: 0.7em 0}')