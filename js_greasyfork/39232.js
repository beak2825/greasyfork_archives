// ==UserScript==
// @name         seo-spider-kj
// @namespace    undefined
// @version      1.0
// @description  开奖公告SEO自动点击
// @author       huangcf
// @match        *://kj.2ncai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39232/seo-spider-kj.user.js
// @updateURL https://update.greasyfork.org/scripts/39232/seo-spider-kj.meta.js
// ==/UserScript==

(function() {

  var domain = "http://kj.2ncai.com";

  var excludeAutoCloseUrl = ["http://kj.2ncai.com", "http://kj.2ncai.com/", "http://kj.2ncai.com/index.html"];

  function lpad(num) {
  	return (Array(2).join(0) + num).slice(-2);
  }


  var SeoSpliderKj = function() {

  	var urls = [];
  	var interval = 2000;
  	var href = window.location.href;

  	var pageType = (function() {
  		if($(".lottery-list-top").length > 0) {//首页
  			return "index";
  		}else if($(".det-body").hasClass("gaopin")) {//高频
  			return "gp";
  		}else if($(".det-body").hasClass("difang")) {//地方
  			return "df";
  		}else if($(".det-body").hasClass("jingjicai") && $(".chaxun a.searchBtn").length >0) {//竞足竞篮
  			return "jjc";
  		}else if($(".det-body").hasClass("jingjicai") && $(".chaxun .selectDiv").length >0) {//北京单场
  			return "bjdc";
  		}else{//数字彩+老足彩
  			return "qg";
  		}
  	})();

  	/**
  	* 查找当前页面需要爬取的URL
  	*/
  	var findUrl = function() {
  		if(href.endsWith(".html") && href.indexOf("index") == -1) {
  			return;
  		}
  		if(pageType == "index") {//首页
  			$(".lottery-name-num a").each(function() {
  				urls.push($(this).attr("href"));
  			});
  			if(excludeAutoCloseUrl.indexOf(window.location.href) > 0) {
  				urls.push("/index/high.html");
  				urls.push("/index/local.html");
  			}
  		}else if(pageType == "gp") {//高频
  			$(".day-tab a[href]").each(function() {
  				urls.push($(this).attr("href"));
  			});
  		}else if(pageType == "df" || pageType == "qg") {//地方、全国
  			$(".search-lotto .selectDiv a[href]:lt(3):gt(0)").each(function(i) {
  				urls.push($(this).attr("href"));
  			});
  		}else if(pageType == "bjdc") {//北京单场
			$(".chaxun .selectDiv a[href]:lt(3):gt(0)").each(function(i) {
  				urls.push($(this).attr("href"));
  			});
  		}else if(pageType == "jjc") {//竞足竞篮
  			var startDate = new Date($("#start").val());
  			var key = "";
  			if(href.indexOf("fb") > -1) {
				key = "/fb";
			}else if(href.indexOf("bb") > -1) {
				key = "/bb";
			}
			key += "/s{date}_e{date}.html";
  			for(var i = 1; i <= 3; i++) {
  				var date = new Date(startDate);
  				date.setDate(startDate.getDate() - i);
  				var dateStr = [date.getFullYear(), lpad(date.getMonth() + 1), lpad(date.getDate())].join("");
  				urls.push(key.replace(/{date}/g, dateStr));
  			}

  		}
  	};

  	/**
  	* 打开页面
  	*/
  	var openUrl = function() {
  		$.each(urls, function(i, url) {
  			(function(i, url) {
  				window.setTimeout(function(){
  					window.open(url, "_blank");
  				}, i * interval);
  			})(i, url);
  		});
  	};

  	/**
  	* 处理完后关闭当前窗口
  	*/
  	var close = function() {
  		if(excludeAutoCloseUrl.indexOf(window.location.href) > 0) {
  			return;
  		}
  		window.setTimeout(function() {
  			window.close();
  		}, urls.length * interval + 500);
  	};

  	return {
  		"start":function() {
  			findUrl();
  			openUrl();
  			close();
  		}
  	}
  };

  SeoSpliderKj().start();
})();