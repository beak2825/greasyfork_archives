// ==UserScript==
// @name         Shopline 編輯頁面跳轉
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Inject an edit button on specific pages
// @author       元魁魁
// @match      *://*.example.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479159/Shopline%20%E7%B7%A8%E8%BC%AF%E9%A0%81%E9%9D%A2%E8%B7%B3%E8%BD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/479159/Shopline%20%E7%B7%A8%E8%BC%AF%E9%A0%81%E9%9D%A2%E8%B7%B3%E8%BD%89.meta.js
// ==/UserScript==

// 如何自定義網域
/*
   如何自定義匹配的網域：
   1. 打開 Tampermonkey Dashborad。
   2. 點擊此腳本旁邊的編輯按鈕。
   3. 在腳本頂部，找到 "@match" 行。
   4. 修改網址以匹配您希望此腳本運行的網站。
      例如，若要只在"example.com"上運行，您可以將其修改為：
      @match      *://*.example.com/*
      如果要匹配多個網域，只要用多行 //@match 即可，像是：
      @match      *://*.example1.com/*
      @match      *://*.example2.com/*
   5. 儲存腳本。
   目前因為 Page 頁沒有辦法直接對應後台編輯頁的網址，所以只能先到總編輯頁😭。
*/

(function() {
    'use strict';

    // 獲取當前URL和品牌名
    const currentURL = window.location.href;
    const parts = new URL(currentURL).hostname.split('.');
    const brand = (parts.length > 2 && parts[0] === 'www') ? parts[1] : parts[0];

    let editURL = '';
    let btnText = '編輯該頁面';

    if (currentURL.includes('/categories/')) {
        // 產品分類頁
        const id = document.querySelector('[id^="product-list-nested-list-"]').id.split('-').pop();
        editURL = `https://admin.shoplineapp.com/admin/${brand}/categories/${id}/edit`;
    } else if (currentURL.includes('/products/')) {
        // 產品頁
        const productData = JSON.parse(document.querySelector('script[type="application/ld+json"]').innerText);
        const sku = productData.sku;
        editURL = `https://admin.shoplineapp.com/admin/${brand}/products/${sku}/edit`;
    } else if (currentURL.includes('/post')) {
        // 部落格文章頁
        editURL = `https://admin.shoplineapp.com/admin/${brand}/blog/posts`;
    } else if (currentURL.includes('/pages/')) {
        // 頁面
        btnText = 'page 總編輯頁';
        editURL = `https://admin.shoplineapp.com/admin/${brand}/pages-gate`;
    }

    if (editURL) {
        // 創建按鈕
        var button = document.createElement('button');
        button.className = 'btn-6';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '10px';
        button.style.zIndex = 10000;
        button.onclick = function() {
            window.location.href = editURL;
        };

        var span = document.createElement('span');
        span.innerHTML = btnText;
        button.appendChild(span);

        // 添加按鈕到頁面
        document.body.appendChild(button);
    }

    // 添加按鈕樣式
    var style = document.createElement('style');
    style.innerHTML = `
    .btn-6 {
    text-align: center;  // 水平居中
    padding-left: 20px;  // 左內部間距
    padding-right: 20px; // 右內部間距
    line-height: 42px;
    background: rgb(247,150,192);
    background: radial-gradient(circle, rgba(247,150,192,1) 0%, rgba(118,174,241,1) 100%);
    line-height: 42px;
    border: none;
    color: white;
    }
    .btn-6 span {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    }
    .btn-6:before,
    .btn-6:after {
    position: absolute;
    content: "";
    height: 0%;
    width: 1px;
    box-shadow:
    -1px -1px 20px 0px rgba(255,255,255,1),
    -4px -4px 5px 0px rgba(255,255,255,1),
    7px 7px 20px 0px rgba(0,0,0,.4),
    4px 4px 5px 0px rgba(0,0,0,.3);
    }
    .btn-6:before {
    right: 0;
    top: 0;
    transition: all 500ms ease;
    }
    .btn-6:after {
    left: 0;
    bottom: 0;
    transition: all 500ms ease;
    }
    .btn-6:hover{
    background: transparent;
    color: #76aef1;
    box-shadow: none;
    }
    .btn-6:hover:before {
    transition: all 500ms ease;
    height: 100%;
    }
    .btn-6:hover:after {
    transition: all 500ms ease;
    height: 100%;
    }
    .btn-6 span:before,
    .btn-6 span:after {
    position: absolute;
    content: "";
    box-shadow:
    -1px -1px 20px 0px rgba(255,255,255,1),
    -4px -4px 5px 0px rgba(255,255,255,1),
    7px 7px 20px 0px rgba(0,0,0,.4),
    4px 4px 5px 0px rgba(0,0,0,.3);
    }
    .btn-6 span:before {
    left: 0;
    top: 0;
    width: 0%;
    height: .5px;
    transition: all 500ms ease;
    }
    .btn-6 span:after {
    right: 0;
    bottom: 0;
    width: 0%;
    height: .5px;
    transition: all 500ms ease;
    }
    .btn-6 span:hover:before {
    width: 100%;
    }
    .btn-6 span:hover:after {
    width: 100%;
    }
    `;
    document.head.appendChild(style);
})();