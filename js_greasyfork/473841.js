// ==UserScript==
// @name         Bing去除今日热点
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除搜索页的今日热点广告\nRemove Ads from Bing search pages
// @author       寂灭光
// @match        *://www.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/473841/Bing%E5%8E%BB%E9%99%A4%E4%BB%8A%E6%97%A5%E7%83%AD%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/473841/Bing%E5%8E%BB%E9%99%A4%E4%BB%8A%E6%97%A5%E7%83%AD%E7%82%B9.meta.js
// ==/UserScript==

(function() {
	var timeFunction = window.setInterval(function(){loadEnd()},1);
	function loadEnd(){
        var searchBox = document.querySelector('.sb_form_q');
        var searchBox_id = document.querySelector('#sb_form_q');
		var sa_zis_PN = document.querySelectorAll('.sa_sg');

	    //当搜索内容为空时，去除搜索框内部 “今日热点”
        // 获取搜索框内容
        if(searchBox||searchBox_id){
            var searchBoxValue = searchBox ? searchBox.value.trim() : (searchBox_id ? searchBox_id.value.trim() : "");
            if (!searchBoxValue) {
                sa_zis_PN.forEach(function(element) {
                    if (element) {
                        hidenDom(element);
                    }
                });
                                 }
            var asSectionHeading = document.querySelector('.asSectionHeading');
            var sa_hd = document.querySelector('.sa_hd');
            //var as_foot = document.querySelector('#as_foot')
            hidenDom(asSectionHeading);
            hidenDom(sa_hd);
        }

    }

    function removeDom(dom){
    	if(dom){
    		dom.remove();
    	}
    }

    function hidenDom(dom){
    	if(dom){
    		dom.style.display = 'none';
    	}
    }

})();