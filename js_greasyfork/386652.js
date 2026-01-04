// ==UserScript==
// @name         贵族网盘下载地址脚本
// @namespace    undefined
// @version      0.003
// @description  获取飞猫网盘下载地址生成按钮
// @author       hellx
// @date         2019-06-22
// @modified     
// @match        *://www.gueizu.com/down*
// @require      http://code.jquery.com/jquery-1.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386652/%E8%B4%B5%E6%97%8F%E7%BD%91%E7%9B%98%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/386652/%E8%B4%B5%E6%97%8F%E7%BD%91%E7%9B%98%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    $(function () {
        var id = window.location.href.replace(/[^0-9]/ig,"");

        load_down_addr1(id);

        $("div#down_box").css('display','block'); 
    });

})();