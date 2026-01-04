// ==UserScript==
// @name         选择页面大麦萤火虫
// @namespace    http://tampermonkey.net/
// @version      2025-4-7
// @description  代抢
// @author       3432276416
// @match        *.detail.damai.cn/*
// @icon         https://img0.baidu.com/it/u=447392558,3405302423&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1066
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532060/%E9%80%89%E6%8B%A9%E9%A1%B5%E9%9D%A2%E5%A4%A7%E9%BA%A6%E8%90%A4%E7%81%AB%E8%99%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/532060/%E9%80%89%E6%8B%A9%E9%A1%B5%E9%9D%A2%E5%A4%A7%E9%BA%A6%E8%90%A4%E7%81%AB%E8%99%AB.meta.js
// ==/UserScript==

(async function() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    let btns=document.querySelectorAll('.button');
      for (let i = 0; i < btns.length; i++) {
        if (btns[i].innerText.includes('知道')) {
            btns[i].click();
        }
    }

    const bt=document.querySelectorAll('.button')[1];
    if(bt){bt.click();}

    // 点击票价选项
    const price=document.querySelectorAll('.select_right_list_item')[0];
    if(price){price.click();}


    await new Promise(resolve => setTimeout(resolve, 500));
    //点击购买按钮
   const buyBtn=document.querySelectorAll('.buy-link')[0];
    if(buyBtn)
    {buyBtn.click();}
      // document.querySelectorAll('.buy-link')[0].click();
   await new Promise(resolve => setTimeout(resolve, 500));
    // 刷新页面
    location.reload();
})();
