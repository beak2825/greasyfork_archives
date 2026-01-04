// ==UserScript==
// @name         迷迷加速替换充值金额
// @namespace    https://greasyfork.org/zh-CN/scripts/380888
// @version      1.1
// @description  添加￥0.01的充值金额
// @author       AngryEagle
// @match        *://www.mimissr.net/user/code
// @require      http://code.jquery.com/jquery-migrate-1.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380888/%E8%BF%B7%E8%BF%B7%E5%8A%A0%E9%80%9F%E6%9B%BF%E6%8D%A2%E5%85%85%E5%80%BC%E9%87%91%E9%A2%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/380888/%E8%BF%B7%E8%BF%B7%E5%8A%A0%E9%80%9F%E6%9B%BF%E6%8D%A2%E5%85%85%E5%80%BC%E9%87%91%E9%A2%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var recharge = document.getElementById('type'); //定位元素
    //recharge.parentNode.removeChild(recharge);
    var myoption = document.createElement('option'); //创建新选项元素
    myoption.value = "0.01";    //新选项赋值
    myoption.text = "0.01￥（点击查看更多）"
    recharge.insertBefore(myoption,recharge.childNodes[0]); //插入到最左边
})();