// ==UserScript==
// @name 			站长工具去广告js屏蔽版
// @author			www.wdja.net
// @version			0.0.1
// @description		站长工具平台去广告
// @match       https://*.chinaz.com/*
// @run-at			document-idle
// @namespace           https://greasyfork.org/zh-CN/scripts/479707
// @require           https://code.jquery.com/jquery-2.1.4.min.js
// @license                    MIT
// @downloadURL https://update.greasyfork.org/scripts/479707/%E7%AB%99%E9%95%BF%E5%B7%A5%E5%85%B7%E5%8E%BB%E5%B9%BF%E5%91%8Ajs%E5%B1%8F%E8%94%BD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/479707/%E7%AB%99%E9%95%BF%E5%B7%A5%E5%85%B7%E5%8E%BB%E5%B9%BF%E5%91%8Ajs%E5%B1%8F%E8%94%BD%E7%89%88.meta.js
// ==/UserScript==
(function(){
    setTimeout(
        function()
        {
            $("#view").each(function(){
                $(this).hide();
            });
            $("#centerTxt").each(function(){
                $(this).hide();
            });
            $("#navAfter").each(function(){
                $(this).hide();
            });
            $("#contentImg").each(function(){
                $(this).hide();
            });
            $("#toolLeftImg").each(function(){
                $(this).hide();
            });
            $(".backtoTop").each(function(){
                $(this).hide();
            });
            $(".wrapperTopBtm").each(function(){
                $(this).hide();
            });
            console.log("ok");
        }
        ,2000); //延迟2秒执行
})();