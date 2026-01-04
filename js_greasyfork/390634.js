// ==UserScript==
// @icon            http://taobao.com/favicon.ico
// @name            去掉淘宝卖家中心弹出的提示框
// @namespace       [url=mailto:admin@dyyy.net]admin@dyyy.net[/url]
// @author          高海林
// @description     打开淘宝后台的卖家中心的时候总是提示烦人的卖家工作台的升级提示，基本没用处，脚本负责去掉
// @match           *://myseller.taobao.com*
// @require         http://code.jquery.com/jquery-2.1.1.min.js
// @version         0.0.1
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/390634/%E5%8E%BB%E6%8E%89%E6%B7%98%E5%AE%9D%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83%E5%BC%B9%E5%87%BA%E7%9A%84%E6%8F%90%E7%A4%BA%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/390634/%E5%8E%BB%E6%8E%89%E6%B7%98%E5%AE%9D%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83%E5%BC%B9%E5%87%BA%E7%9A%84%E6%8F%90%E7%A4%BA%E6%A1%86.meta.js
// ==/UserScript==
(function () {
    $(document).ready(function() {
       setTimeout(function(){
          $(".indexcourseContainer-2QG6y").remove();
          $(".indexshowDom-3EAPG").remove();
          $(".indexnotice-container-3Ace0").remove();
       },500)
    });
//页面加载完，再执行
})();