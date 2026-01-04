// ==UserScript==
// @name         輕小說文庫 簡單介面設定 /轻小说文库 简单介面设定
// @namespace    http://tampermonkey.net/
// @version      0.2
// @icon         https://www.google.com/s2/favicons?domain=wenku8.net
// @description  此外掛用於修改背景顏色、內容背景顏色、文字設定、標題文字設定。移除廣告、設定區。放大書目欄、下一頁超連結字體
// @author       AA^2-逆宮風鈴.tw-星晶坐牢-28780661　is　ヒヒイロカネハンター
// @include      *://www.wenku8.net*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427984/%E8%BC%95%E5%B0%8F%E8%AA%AA%E6%96%87%E5%BA%AB%20%E7%B0%A1%E5%96%AE%E4%BB%8B%E9%9D%A2%E8%A8%AD%E5%AE%9A%20%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%20%E7%AE%80%E5%8D%95%E4%BB%8B%E9%9D%A2%E8%AE%BE%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/427984/%E8%BC%95%E5%B0%8F%E8%AA%AA%E6%96%87%E5%BA%AB%20%E7%B0%A1%E5%96%AE%E4%BB%8B%E9%9D%A2%E8%A8%AD%E5%AE%9A%20%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%20%E7%AE%80%E5%8D%95%E4%BB%8B%E9%9D%A2%E8%AE%BE%E5%AE%9A.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const addStyle = (css) => {
    const style = document.createElement('style')
    style.innerText = css
    document.head.appendChild(style)
  }
   // 背景顏色
  addStyle(`
    body {
      background-color: #000000;
    }
  `)
    // 內容背景顏色
  addStyle(`
    body>div#contentmain{
      background-color: #111111;
      font-size: 26px !important;
      color: rgb(0, 102, 0)!important;
    }
  `)
    // 文字設定
  addStyle(`
    body>div#contentmain>div#content{
      font-size: 26px !important;
      color: rgb(0, 102, 0)!important;
      font-family:"Microsoft Yahei"!important;
    }
  `)
    // 標題文字設定
  addStyle(`
    body>div#contentmain>div#title{
      font-size: 45px !important;
      color: rgb(0, 102, 0)!important;
      font-family:"Microsoft Yahei"!important;
    }
  `)
    //廣告(上)
  addStyle(`
    body>div#adv1>a{
      display: none;
    }
  `)
    //廣告(下)
  addStyle(`
    body>div#footlink>div#adv5{
      display: none;
    }
  `)
    //設定區
  addStyle(`
    body>div#adtop{
      display: none;
    }
  `)
    //下一頁 #放大
  addStyle(`
    body>div#footlink>div#foottext{
      font-size: 22px !important;
      font-family:"Microsoft Yahei"!important;
    }
  `)
    //書目欄 #放大
  addStyle(`
    body>div#headlink{
      font-size: 22px !important;
      font-family:"Microsoft Yahei"!important;
    }
  `)
})();