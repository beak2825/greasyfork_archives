// ==UserScript==
// @name         淘宝&京东首页自动跳转到搜索页面
// @namespace    http://www.suzhengpeng.com
// @version      0.4
// @description  jump to search page，from the homepage of taobao or jd
// @author       Suzhengpeng
// @include      *www.taobao.com*
// @include      *www.jd.com*
// @downloadURL https://update.greasyfork.org/scripts/30484/%E6%B7%98%E5%AE%9D%E4%BA%AC%E4%B8%9C%E9%A6%96%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/30484/%E6%B7%98%E5%AE%9D%E4%BA%AC%E4%B8%9C%E9%A6%96%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var host = location.host;  
    var host2 = document.domain; 
    if(host=='www.taobao.com')
    {
     location.replace("https://s.taobao.com/");
    }
    if(host=='www.jd.com')
    {
     location.replace("https://search.jd.com");
    }
})();