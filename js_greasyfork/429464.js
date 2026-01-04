// ==UserScript==
// @name            百科人物出生年月日
// @namespace       @
// @author          @jywyf
// @version	    0.1
// @homepageURL	    @
// @description     自动高亮加粗显示1983年之后的
// @include         https://baike.baidu.com/item/*
// @license         WTFPL
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/429464/%E7%99%BE%E7%A7%91%E4%BA%BA%E7%89%A9%E5%87%BA%E7%94%9F%E5%B9%B4%E6%9C%88%E6%97%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/429464/%E7%99%BE%E7%A7%91%E4%BA%BA%E7%89%A9%E5%87%BA%E7%94%9F%E5%B9%B4%E6%9C%88%E6%97%A5.meta.js
// ==/UserScript==

(function(){
	$(".basicInfo-item value").find("dd").each(function(){
if(parseInt($(this).text().replace(/,/, "")) > 1983){
	$(this).css({"color":"red","font-weight":"bold"});
	$(this).closest('.item','li').css({"background-color":"#E0E0E0"});
		}});      
})();