// ==UserScript==
// @name         手机版百度优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  优化手机百度网址的使用体验，去除跳转、app引导等内容。
// @author       You
// @match        https://baijiahao.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432480/%E6%89%8B%E6%9C%BA%E7%89%88%E7%99%BE%E5%BA%A6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/432480/%E6%89%8B%E6%9C%BA%E7%89%88%E7%99%BE%E5%BA%A6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer = setInterval(function(){
        var $continue_btn = $(".layer-itemBtn.normal")
        var $app = $(".headDeflectorContainer")
        var $ctn = $(".newUnfoldIcon")
        var $pop = $(".popup-lead-cancel")
        if(!!$continue_btn) {
            $continue_btn.click();
        }
        if(!!$app) {
            $app.remove();
        }
        if(!!$ctn) {
            $ctn.click();
        }
        if(!!$pop) {
            $pop.click();
        }

    }, 200)


    // Your code here...
})();

