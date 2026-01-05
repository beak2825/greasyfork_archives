// ==UserScript==
// @name 			百度网页搜索 推广过滤
// @author			qw4wer
// @version			0.0.2
// @description		百度网页搜索 推广过滤，隐藏包含推广的广告
// @include			/www\.baidu\.com\/((s|baidu)\?|#wd|(index.*)?$)/
// @icon			http://www.baidu.com/favicon.ico
// @run-at			document-idle
// @namespace https://greasyfork.org/users/28141
// @downloadURL https://update.greasyfork.org/scripts/20327/%E7%99%BE%E5%BA%A6%E7%BD%91%E9%A1%B5%E6%90%9C%E7%B4%A2%20%E6%8E%A8%E5%B9%BF%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/20327/%E7%99%BE%E5%BA%A6%E7%BD%91%E9%A1%B5%E6%90%9C%E7%B4%A2%20%E6%8E%A8%E5%B9%BF%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function(){
    $("#content_left div").each(function(){
        if($(this).find("span:contains('广告')").length !=0){
            $(this).hide();
        }
    });

})();