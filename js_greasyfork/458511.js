// ==UserScript==
// @name         垃圾清理
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  清除搜索引擎的热点咨询还原简介的页面 关闭插件右下角插件标记 【设置-通用-高级-操作菜单-标记点信息-已禁用】
// @author       凉雨时旧
// @include      *
// @icon         *
// @grant        none
// @license      MIT


// @downloadURL https://update.greasyfork.org/scripts/458511/%E5%9E%83%E5%9C%BE%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/458511/%E5%9E%83%E5%9C%BE%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var url = document.domain;
    if(url == 'cn.bing.com'){
        document.getElementById("vs_cont").style.display = "none";
    }
    if(url == 'www.baidu.com'){
        document.getElementById("hotsearch-content-wrapper").style.display = "none";
        document.getElementById("hotsearch-refresh-btn").style.display = "none";
        document.getElementById("s-hotsearch-wrapper").style.display = "none";


    }

})();