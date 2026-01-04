// ==UserScript==
// @name         百度搜索自动去除CSDN结果
// @namespace    http://tampermonkey.net/
// @version      2024-07-04
// @description  百度搜索自动去除CSDN结果 -- 去除烦人的CSDN搜索结果
// @author       TheNow
// @match        https://www.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499975/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4CSDN%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/499975/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4CSDN%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var suButton = document.getElementById("su");
    var suInput = document.getElementById("kw");
    suButton.addEventListener("click", function(){
      var inputValueOrigin = suInput.value;
        if("" != inputValueOrigin) {
           suInput.value = inputValueOrigin + " -csdn";
        }
    });
})();