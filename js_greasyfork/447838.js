// ==UserScript==
// @name         去除mybatis-plus网址的关闭反广告插件提示
// @namespace    https://greasyfork.org/zh-CN/users/167084-lin-skywood
// @version      1.0
// @description  去除mybatis-plus官网的关闭反广告插件提示
// @author       skywoodlin
// @contributor  skywoodlin
// @match        *://baomidou.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447838/%E5%8E%BB%E9%99%A4mybatis-plus%E7%BD%91%E5%9D%80%E7%9A%84%E5%85%B3%E9%97%AD%E5%8F%8D%E5%B9%BF%E5%91%8A%E6%8F%92%E4%BB%B6%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/447838/%E5%8E%BB%E9%99%A4mybatis-plus%E7%BD%91%E5%9D%80%E7%9A%84%E5%85%B3%E9%97%AD%E5%8F%8D%E5%B9%BF%E5%91%8A%E6%8F%92%E4%BB%B6%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==
$.noConflict();
(function($) {
    'use strict';
    // Your code here...
    var removed=false;
    function removeBanner() {
        console.log("removeBanner run again")
        if(removed){
            clearInterval(timer);
            return;
        }
        let $a = $("a:contains('并不跟踪您的隐私')");
        if($a.length == 0) {
            return;
        }
        $a.parent().remove();
        removed=true;
    }
    //debugger;
    var timer = setInterval(removeBanner, 1000)
})(jQuery);