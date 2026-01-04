// ==UserScript==
// @name         纸质发票快递选择
// @namespace    lezizi
// @version      0.1
// @description  净化纸质发票的快递列表
// @author       You
// @match        https://einvoice.taobao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/462890/%E7%BA%B8%E8%B4%A8%E5%8F%91%E7%A5%A8%E5%BF%AB%E9%80%92%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/462890/%E7%BA%B8%E8%B4%A8%E5%8F%91%E7%A5%A8%E5%BF%AB%E9%80%92%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ERPRESS_NAMES = `
    /EMS/
    /邮政快递包裹/
    /韵达快递/
    /顺丰速运/
    `;
    var missonCode = 0;
    // Your code here...
    GM_registerMenuCommand("自动检测快递列表", function () {
        missonCode = setInterval(()=>{
            console.log(`misson ${missonCode} is running`);
            let items = document.querySelectorAll("li.next-menu-item");
            if (items.length>0){
                console.log("got it");
                for(let item of items){
                    if (!ERPRESS_NAMES.includes(`/${item.innerText}/`)){
                        item.remove();
                    }
                }
                console.log("list is clear");
                items = [];
            }else{
                console.log("not found");
            }
        },2000);
    });
    //
    GM_registerMenuCommand("停止检测任务", function () {
        if (missonCode !== 0){
            clearInterval(missonCode);
            console.log(`misson ${missonCode} is terminal`);
        }
    });
})();