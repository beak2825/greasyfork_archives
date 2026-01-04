// ==UserScript==
// @name         替换百度一下图标
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  学习练习脚本!
// @author       zero
// @match        *://www.baidu.com/
// @grant        unsafeWindow
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/400441/%E6%9B%BF%E6%8D%A2%E7%99%BE%E5%BA%A6%E4%B8%80%E4%B8%8B%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/400441/%E6%9B%BF%E6%8D%A2%E7%99%BE%E5%BA%A6%E4%B8%80%E4%B8%8B%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==
(function() {
    'use strict';
    alert("我来学习油猴脚本！");
    var $ = unsafeWindow.jQuery;


    var lg = $('#lg')
    if(lg.length ==1)
    {
        $(lg).html('<img src="//www.google.com.hk/images/branding/googlelogo/2x/googlelogo_color_160x56dp.png" width="270" height="129" this.onerror=null;" usemap="#mp hidefocus="true" id="s_lg_img" class="index-logo-src" ">');
    }

})();
