// ==UserScript==
// @name   我的自定义配置
// @version      0.0.1
// @description  1.果壳音乐破解验证码。
// @namespace TheUserConfig
// @author       NoahSuo
// @include http*://music.ghpym.com/*
// @require http://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/407296/%E6%88%91%E7%9A%84%E8%87%AA%E5%AE%9A%E4%B9%89%E9%85%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/407296/%E6%88%91%E7%9A%84%E8%87%AA%E5%AE%9A%E4%B9%89%E9%85%8D%E7%BD%AE.meta.js
// ==/UserScript==

$(document).ready(function(){
//添加样式
(function(){
$($(".el-input__inner")[0]).attr("disabled",false)
})();
});