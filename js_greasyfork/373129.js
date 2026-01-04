// ==UserScript==
// @name         空间锦鲤屏蔽器
// @namespace    https://pipiqiang.cn/
// @version      0.1
// @description  屏蔽空间烦人的广告
// @author       pipiqiang
// @match        *://*.qzone.qq.com/*
// @match        *://qzone.qq.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/373129/%E7%A9%BA%E9%97%B4%E9%94%A6%E9%B2%A4%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/373129/%E7%A9%BA%E9%97%B4%E9%94%A6%E9%B2%A4%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    let chk=[];
    chk[0]=/(.)*锦鲤(.)*/;
    chk[1]=/(.)*杨超越(.)*/;
    chk[2]=/(.)*考神(.)*/;
    chk[3]=/(.)*必过(.)*/;

    $('li').each(function(){
        let htm=$(this).html();
        chk.forEach(c=>{
            if(c.test(htm)){
               $(this).remove();
            }
        })
    });
})();