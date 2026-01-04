// ==UserScript==
// @name         京东恢复优惠卷
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  这TM是一个恢复京东优惠卷的脚本
// @author       烟花小神 killall love
// @match             *://quan.jd.com/*
// @connect           jd.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428142/%E4%BA%AC%E4%B8%9C%E6%81%A2%E5%A4%8D%E4%BC%98%E6%83%A0%E5%8D%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/428142/%E4%BA%AC%E4%B8%9C%E6%81%A2%E5%A4%8D%E4%BC%98%E6%83%A0%E5%8D%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){setTimeout(()=>{$(".c-operate span")[0].click();setTimeout(()=>{$("div .btn2.btn-gutter").click()},1000);setTimeout(()=>{console.log("删除成功")},2000)},1000)});
})();