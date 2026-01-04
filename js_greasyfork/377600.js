// ==UserScript==
// @name         力哥爱英语网站验证码自动填写
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  力哥爱英语网站验证码自动填写脚本
// @author       Aaron
// @match        https://ienglish521.com/*.html
// @grant        none
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/377600/%E5%8A%9B%E5%93%A5%E7%88%B1%E8%8B%B1%E8%AF%AD%E7%BD%91%E7%AB%99%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/377600/%E5%8A%9B%E5%93%A5%E7%88%B1%E8%8B%B1%E8%AF%AD%E7%BD%91%E7%AB%99%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var input_verify = $("input[id=verifycode]");
    var input_len = input_verify.length;
    if (input_len > 0){
        input_verify.first().val("诸事顺利");
        $("input[id=verifybtn]").click();
    }
})();