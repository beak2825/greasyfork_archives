// ==UserScript==
// @name         塑贸网测试
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.3
// @description  测试油猴脚本执行情况
// @author       wanghui
// @match        http://testdp.sumao.com/
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/523286/%E5%A1%91%E8%B4%B8%E7%BD%91%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/523286/%E5%A1%91%E8%B4%B8%E7%BD%91%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("body").click(function(){
         if(window.location.href == "http://testdp.sumao.com/#/contractManage"){
             alert('测试油猴脚本更新变化');
         }
    })


})();