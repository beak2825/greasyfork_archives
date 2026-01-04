// ==UserScript==
// @name         必应搜索双栏显示
// @name:en      Bing search double column display
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  双栏显示必应搜索结果，来源：https://greasyfork.org/zh-CN/scripts/27825-双栏显示搜索结果
// @description:en Double column shows Bing search results
// @include     *://*.bing.com/search?*
// @author       wusheng
// @match        https://greasyfork.org/zh-CN/scripts/27825-%E5%8F%8C%E6%A0%8F%E6%98%BE%E7%A4%BA%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369836/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%8F%8C%E6%A0%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/369836/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%8F%8C%E6%A0%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
  'use strict';
    var domURL = document.URL;
    var element = document.createElement('style');
    var fontStr = ':not([class*=icon]):not([class*=fa]):not([class*=logo]):not(i):not(strong):not(button){font-family:"-apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif"!important}';
    if(domURL.indexOf('cn.bing.com')!==-1){
       element.innerHTML='body{overflow-y: scroll!important;background-color: #f1f2f3!important;}.b_underSearchbox{padding-left:4em!important;}#b_opalpers,#b_content{padding: 0px 0px 1em 0px!important;},#b_results>.b_msg{display: none!important;}#b_results{width: 93%!important;padding-left: 4%!important;}#b_results>.b_ans,#b_results>.b_algo{display: block!important;width: 48%!important;min-width: 560px!important;min-height: 116px!important;float: left!important;margin: .4%!important;padding: 8px 5px 3px!important;table-layout: fixed!important;border-collapse: separate!important;overflow: hidden!important;box-shadow: 0 2px 3px 0 rgba(0,0,0,.1), 0 0 0 1px rgba(0,0,0,.05);box-shadow-webkit-box-shadow:0 2px 3px 0 rgba(0,0,0,.1), 0 0 0 1px rgba(0,0,0,.05)}.b_rs{margin: 0 auto!important;}'
    }
    element.innerHTML += fontStr;
    document.documentElement.appendChild(element);
    document.getElementById("b_tween").style.padding="0 0 0 6em";
})();