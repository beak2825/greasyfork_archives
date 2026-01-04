// ==UserScript==
// @name     	移除知乎专栏的底部推荐
// @version  	1.2
// @match    	*//zhuanlan.zhihu.com/p/*
// @author   	GCNY
// @grant    	none
// @description	专栏的底部推荐真是又丑又大
// @namespace 	https://greasyfork.org/en/users/174988-tdkihrr
// @downloadURL https://update.greasyfork.org/scripts/39527/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E7%9A%84%E5%BA%95%E9%83%A8%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/39527/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E7%9A%84%E5%BA%95%E9%83%A8%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==


var clearRecommendation = function() {
	var recommendation = document.getElementsByClassName("Recommendations-Main")[0];
	if (typeof(recommendation) !== "undefined") {
		recommendation.style.display="none";
	}
};

var nIntervId = setInterval(clearRecommendation, 100);