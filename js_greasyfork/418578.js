// ==UserScript==
// @name         试客巴解绑银行卡
// @namespace    http://ziyuandcn
// @version      0.1
// @description  取消银行卡解绑按钮注释
// @author       You
// @match        https://wx.shike8888.com/bank/findCard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418578/%E8%AF%95%E5%AE%A2%E5%B7%B4%E8%A7%A3%E7%BB%91%E9%93%B6%E8%A1%8C%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/418578/%E8%AF%95%E5%AE%A2%E5%B7%B4%E8%A7%A3%E7%BB%91%E9%93%B6%E8%A1%8C%E5%8D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.bank_icon').append('<a class="delete right" id="unbind_bankCard">解绑</a>')
//<a class="delete right" id="unbind_bankCard">解绑</a>
    // Your code here...
})();