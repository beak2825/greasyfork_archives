// ==UserScript==
// @name         问道破防沉迷
// @namespace    http://kuangke.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://wd.gyyx.cn:8066/data.html
// @match        http://wd.gyyx.cn:8066/data_success.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39162/%E9%97%AE%E9%81%93%E7%A0%B4%E9%98%B2%E6%B2%89%E8%BF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/39162/%E9%97%AE%E9%81%93%E7%A0%B4%E9%98%B2%E6%B2%89%E8%BF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var vHref = window.location.href.toString();
    if(vHref.indexOf('success') != -1)
    {
        window.location.href = 'http://wd.gyyx.cn:8066/data.html';
    }
    else
    {
        var vShenFenZhengHao = '130924199001013453';
        var vShenFenZhengXingMing = '谢建';
        var vZhangHaoPassWord = 'liudenghui';
        var vZhuCeYouJian = 'liu@qq.com';
        var vZhuCeZhangHao = 'zhanji100001';
        $("input.js_account").val(vZhuCeZhangHao);
        $("input.js_idCard").val(vShenFenZhengHao);
        $("input.js_trueName").val(vShenFenZhengXingMing);
        $("input.js_password").val(vZhangHaoPassWord);
        $("input.js_email").val(vZhuCeYouJian);
    }
    // Your code here...
})();