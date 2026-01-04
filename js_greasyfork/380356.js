// ==UserScript==
// @name         umidai Unlock loginPage password input
// @namespace    https://liangz98.github.io/p/f85da3eb/
// @version      0.2
// @description  去除登录页密码框不能粘贴的限制/ 去除登录时的风险提示语
// @author       LiangZ
// @match        *://www.umidai.com/user/login.html*
// @grant        unsafeWindow
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/380356/umidai%20Unlock%20loginPage%20password%20input.user.js
// @updateURL https://update.greasyfork.org/scripts/380356/umidai%20Unlock%20loginPage%20password%20input.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;

    // set password input paste allowed
    $(":password").removeAttr("onpaste");

    // remove login warning pop
    $("input[value='登录']").attr("onclick", "fxclick()");
})();