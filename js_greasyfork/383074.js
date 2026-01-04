// ==UserScript==
// @name         清理百度搜索记录
// @namespace    https://github.com/favouriter/js/blob/master/clearbaidu
// @version      0.2
// @description  当你使用百度搜索的时候是不是没错都要清理搜索记录，F12删除本地存储，或者百度图片清理cookie
// @author       favouriter
// @match        *://www.baidu.com/*
// @match        *://fanyi.baidu.com/*
// @match        *://image.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383074/%E6%B8%85%E7%90%86%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/383074/%E6%B8%85%E7%90%86%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    localStorage.removeItem("BDSUGSTORED");
    localStorage.removeItem("pcTransHistory");
    delete_cookie('indexPageSugList')
    function delete_cookie( name ) {
      document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
})();
