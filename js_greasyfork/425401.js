// ==UserScript==
// @name        优化m.baidu.com
// @namespace   Violentmonkey Scripts
// @match       *://m.baidu.com/*
// @match       *://3g.baidu.com/*
// @license MIT
// @description 百度主页净化，只保留搜索功能，作用于m.baidu.com和3g.baidu.com;本脚本永久开源，永久免费。 
// @run-at document-start
// @require https://greasyfork.org/scripts/435697-%D8%A8%D9%84%D8%AF%D9%8A-%D9%85%D8%AE%D8%B5%D8%B5-%D9%85%D8%AE%D8%B7%D9%88%D8%B7%D8%A7%D8%AA-public/code/%D8%A8%D9%84%D8%AF%D9%8A%20%D9%85%D8%AE%D8%B5%D8%B5%20%D9%85%D8%AE%D8%B7%D9%88%D8%B7%D8%A7%D8%AA-Public.js?version=999450
// @version 0.0.1.20230128142238
// @downloadURL https://update.greasyfork.org/scripts/425401/%E4%BC%98%E5%8C%96mbaiducom.user.js
// @updateURL https://update.greasyfork.org/scripts/425401/%E4%BC%98%E5%8C%96mbaiducom.meta.js
// ==/UserScript==
(function(){
    添加样式(`div{background-image:none!important;/*background:#f1f1f1!important;*/
    }#navs,#userinfo-wrap,#logo,#menu-container,.menu-icon-layout,.tab_news,#bottom,.callicon-wrap{display:none!important;
    }#index-kw::-webkit-input-placeholder{visibility:hidden!important;
    }#index-form{width:90%;height:100%;position:fixed;bottom:100px;}`);
})();