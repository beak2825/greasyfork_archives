// ==UserScript==
// @name         B站收藏夹 自动清除已失效视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  超简易的自动取消收藏已失效视频，使用方法进入收藏夹，手动切页即可。省去一个个点击的麻烦。
// @author       You
// @match        https://space.bilibili.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480826/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%20%E8%87%AA%E5%8A%A8%E6%B8%85%E9%99%A4%E5%B7%B2%E5%A4%B1%E6%95%88%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/480826/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%20%E8%87%AA%E5%8A%A8%E6%B8%85%E9%99%A4%E5%B7%B2%E5%A4%B1%E6%95%88%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Your code here...
    while (true){
        let disabledList = document.querySelectorAll('[data-aid].disabled .be-dropdown');
        console.log(disabledList);
        if(disabledList.length){
         for await (const tag of disabledList){
            tag.querySelector('.be-dropdown-item-delimiter').click();
         }
        }
        await new Promise(resolve=>setTimeout(resolve,2000));
    }
})();