// ==UserScript==
// @name         cnbeta 页面清洁
// @namespace    zzsoft.cnbeta.clearner
// @version		 0.13
// @description	 让cnbeta清清爽爽不紧绷
// @author		 zzsoft
// @match        https://*.cnbeta.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399253/cnbeta%20%E9%A1%B5%E9%9D%A2%E6%B8%85%E6%B4%81.user.js
// @updateURL https://update.greasyfork.org/scripts/399253/cnbeta%20%E9%A1%B5%E9%9D%A2%E6%B8%85%E6%B4%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(() => {
        let observer = new MutationObserver(list => {
            for(let murec of list) {
                if (murec.addedNodes.length>0)
                {
                    setTimeout(removeAds,100);
                }               
            }
        }).observe($('body')[0], {
            childList: true
        });
    });
  
    function removeAds()
    {       
        console.log("removeAds");
        //去除 脑残提示
		$("body").attr("style","");
		$("[id*='-ad-']").hide();
		$("a[href*='/articles/3.htm']").parents("[id]")
			.attr("style","")
			.hide();
		$("div[id][style*=fixed]").remove();
		//去除 页面广告
		$("#fixed_area").hide();
		$("[id*=right]").hide();
		$(".tac").hide();
		$(".cbv").hide();
		$("a:hidden").attr("href","");
		$("iframe").remove();
		$("[src*=google]").remove();
		$("div.item.cooperation").remove();
        $('.tbl-feed-container').remove();
        $('trc_related_container').remove();   
        $('span.sub-title').remove();
        $("#upcoming_box").remove();
        $("div.tks").remove();
    }
})();