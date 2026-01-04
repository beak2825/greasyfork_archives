// ==UserScript==
// @name         试客巴提现页密码类型修改
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  提现页密码类型修改
// @author       You
// @match        https://wx.shike8888.com/user/takeMoney
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418785/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%8F%90%E7%8E%B0%E9%A1%B5%E5%AF%86%E7%A0%81%E7%B1%BB%E5%9E%8B%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/418785/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%8F%90%E7%8E%B0%E9%A1%B5%E5%AF%86%E7%A0%81%E7%B1%BB%E5%9E%8B%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
$('#password').attr('type','text')
$('#password').attr('value','xwking2525')
    // Your code here...
})();