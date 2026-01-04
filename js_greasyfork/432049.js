// ==UserScript==
// @name         百度过滤广告
// @namespace    http://cqx1.com/
// @version      1.0
// @description  过滤百度搜索结果中包含的广告项
// @author       cqx1
// @include      /www\.baidu\.com\/((s|baidu)\?|#wd|(index.*)?$)/
// @icon         http://cqx1.com/public/static/img/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432049/%E7%99%BE%E5%BA%A6%E8%BF%87%E6%BB%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/432049/%E7%99%BE%E5%BA%A6%E8%BF%87%E6%BB%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
	var clearAD = function(){
        $("#content_left div").each(function(){
	        if($(this).find("span:contains('广告')").length !=0){
	            $(this).hide();
	        }
	        if($(this).find("a:contains('广告')").length !=0){
	            $(this).hide();
	        }
        });
    }
    clearAD();
    setInterval(clearAD,500);
})();