// ==UserScript==
// @name         西南交大电费充值页面修正补丁
// @namespace    swjtu.edu.cn
// @version      1.1
// @description  西南交大电费充值页面修正补丁，安装后可在其他各浏览器上使用电费充值页面
// @author       Nathan_21hz
// @match        http://card.swjtu.edu.cn/accountxnjddfInput.action?dktype=*
// @require      http://code.jquery.com/jquery-1.8.2.js
// @downloadURL https://update.greasyfork.org/scripts/369955/%E8%A5%BF%E5%8D%97%E4%BA%A4%E5%A4%A7%E7%94%B5%E8%B4%B9%E5%85%85%E5%80%BC%E9%A1%B5%E9%9D%A2%E4%BF%AE%E6%AD%A3%E8%A1%A5%E4%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/369955/%E8%A5%BF%E5%8D%97%E4%BA%A4%E5%A4%A7%E7%94%B5%E8%B4%B9%E5%85%85%E5%80%BC%E9%A1%B5%E9%9D%A2%E4%BF%AE%E6%AD%A3%E8%A1%A5%E4%B8%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('[name="areaCode"]').eq(0).attr("id","areaCode")
    $('[name="dktype"]').eq(0).attr("id","dktype")
    $('[name="wfaccount"]').eq(0).attr("id","wfaccount")
    $('[name="wfaccount1"]').eq(0).attr("id","wfaccount1")
    $('[name="wfaccount2"]').eq(0).attr("id","wfaccount2")
    // Your code here...
})();
