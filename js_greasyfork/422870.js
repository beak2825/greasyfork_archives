// ==UserScript==
// @name         Gitee第三方登录按钮全部显示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://gitee.com/login
// @icon         https://www.google.com/s2/favicons?domain=gitee.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422870/Gitee%E7%AC%AC%E4%B8%89%E6%96%B9%E7%99%BB%E5%BD%95%E6%8C%89%E9%92%AE%E5%85%A8%E9%83%A8%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/422870/Gitee%E7%AC%AC%E4%B8%89%E6%96%B9%E7%99%BB%E5%BD%95%E6%8C%89%E9%92%AE%E5%85%A8%E9%83%A8%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var line_1_div = document.getElementsByClassName("session-oauth__list");
    var line_1_div_childs = line_1_div[0].children;
    line_1_div[0].removeChild(line_1_div_childs[line_1_div_childs.length-1]);

    var div_1 = document.createElement("div");
    div_1.setAttribute("class","ui horizontal list session-oauth__list");
    div_1.setAttribute("style","margin-top:10px");
    div_1.innerHTML='<a class="item" href="https://gitee.com/auth/weibo"><div class="git-other-login-icon"><i class="icon-logo-weibo iconfont weibo" title="使用 Weibo 帐号登录"></i></div></a> \
        <a class="item" href="https://gitee.com/auth/qq_connect"><div class="git-other-login-icon"><i class="icon-logo-qq iconfont qq" title="使用 QQ 帐号登录"></i></div></a> \
        <a class="item" href="https://gitee.com/auth/windowslive"><div class="git-other-login-icon"><i class="icon-logo-windows iconfont windows" title="使用 WindowsLive 帐号登录"></i></div></a> \
        <a class="item" href="https://gitee.com/auth/wechat"><div class="git-other-login-icon"><i class="icon-logo_wechat iconfont wechat" title="使用微信帐号登录"></i></div></a> \
        <a class="item" href="https://gitee.com/auth/dingding"><div class="git-other-login-icon"><i class="dingding icon-logo-dingding iconfont" title="使用钉钉帐号登录"></i></div></a> \
        <a class="item" href="https://gitee.com/auth/trustie"><div class="git-other-login-icon"><i class="icon-logo_trustie iconfont trustie" title="使用 Trustie 帐号登录"></i></div></a>';

    var parent_div = document.getElementsByClassName("session-login-oauth__container");
    parent_div[0].appendChild(div_1);

})();