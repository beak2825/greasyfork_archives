// ==UserScript==
// @name         大众点评网可用性改进
// @namespace    gqqnbig
// @version      0.2
// @description  删除各种碍眼的浮层，增强广告标签的对比度
// @author       gqqnbig
// @match        http://www.dianping.com/*
// @match        https://www.dianping.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406429/%E5%A4%A7%E4%BC%97%E7%82%B9%E8%AF%84%E7%BD%91%E5%8F%AF%E7%94%A8%E6%80%A7%E6%94%B9%E8%BF%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/406429/%E5%A4%A7%E4%BC%97%E7%82%B9%E8%AF%84%E7%BD%91%E5%8F%AF%E7%94%A8%E6%80%A7%E6%94%B9%E8%BF%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //     function waitSelector(selector, retries)
    //     {
    //         return new Promise((resolve, reject)=>{
    //             let result = document.querySelector(selector);
    //             if(result) {
    //                 resolve(result);
    //                 return;
    //             }
    //             else {
    //                 setTimeout(()=> {
    //                     let s=document.querySelector(selector);
    //                     if(s)
    //                         resolve(s);
    //                     else
    //                 }
    //             }

    //         });

    //     }

    function removeRetry(selector) {
        let count=1
        const h= setInterval(()=> {
            count++;
            if(count<10)
                document.querySelector(selector).remove();
            clearInterval(h);
        },200);
    }



    //删除切换城市时显示的全屏下载客户端浮层

    //location.pathname如"/beijing"
    if((location.pathname.match(/\//g)||[]).length==1)
         removeRetry(".fullScreenFlash");

    //删除下载app浮层
    removeRetry(".bottomLayer");

    //删除红包浮层
    removeRetry(".J-bonus");


    //增强搜索结果里广告标签的辨识度。
    let style=document.createElement("style");
    style.innerHTML=`.search-ad {
    background-color: black;
}`;
    document.head.appendChild(style);

})();