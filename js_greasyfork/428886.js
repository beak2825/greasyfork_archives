// ==UserScript==
// @name         百度首页去除百度热搜
// @namespace   我的小世界wdxsj_GreasyFork
// @version      1.01
// @description  百度首页去除“百度热搜”栏，使用了jQuery
// @author       我的小世界
//@require https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
//@run-at document-end
// @match        http*://www.baidu.com/
// @match        http*://www.baidu.com
// @match        http*://baidu.com/
// @match        http*://baidu.com
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428886/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/428886/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';//严格模式

    $(document).ready(function(){
        $("#s-hotsearch-wrapper").hide();
        //debugger;
        $(".hotsearch-item.odd").hide();
        $(".hotsearch-item.even").hide();
  });
})();