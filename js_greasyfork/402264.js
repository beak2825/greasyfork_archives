// ==UserScript==
// @name         测试脚本
// @namespace    https://xiaoshiapp.city/
// @version      0.1
// @description  练习脚本的测试文件,多吉搜索首页图片替换
// @author       小师
// @match        *://www.baidu.com/
// @exclude      https://www.tampermonkey.net/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/402264/%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/402264/%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = unsafeWindow.jQuery;
    var su = $('#su');
    if(su.length){//返回被 jQuery 选择器匹配的元素的数量
        su.attr("value","狗朋一下")
    }
    var lg = $('#lg')
    if(lg.length ==1)
    {
        $(lg).html('<img src="https://www.xiaoshiapp.city/goupeng.jpg" width="120" height="120" this.onerror=null;" usemap="#mp hidefocus="true" id="s_lg_img" class="index-logo-src" ">');
    }
    var bg = $('#dummybodyid')
    if(bg.length ==1){
        $(bg).css("background-image","url('https://xiaoshiapp.city/beijing.jpg'")
        $(bg).css("background-size","100% 100%")
        $(bg).css("opacity","1")
    }
})();