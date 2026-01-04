// ==UserScript==
// @name         矩阵搜索引擎
// @namespace    http://tampermonkey.net/
// @version      2024-01-13
// @description  用于多网站搜索(解决某些网站无法通过url关键字进行搜索)
// @author       Ambition
// @match        *://www.epochtimes.com/*
// @match        *://www.backchina.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/484757/%E7%9F%A9%E9%98%B5%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/484757/%E7%9F%A9%E9%98%B5%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let currentUrl = decodeURIComponent(window.location.href) ;

    let query = currentUrl.split('q=')[1];
    if(currentUrl.includes("backchina") && query){// 倍可亲
      
        const inputElement = document.querySelector('.search_ipt');
        inputElement.value = query;

        const buttonElement = document.querySelector('.search_btn');
        buttonElement.click();

    }



    if(currentUrl.includes("epochtimes") && query){ // 大纪元
        const inputElement = document.querySelector('.search_input');
        inputElement.value = query;

         const buttonElement = document.querySelector('.search_btn');
        buttonElement.click();


    }

})();