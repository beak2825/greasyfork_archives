// ==UserScript==
// @name         极简化百度知道/经验（讯强定制版）
// @namespace    https://yuzhizhai.top
// @version      0.1.6
// @description  优化百度知道、百度经验页面，由流年_辣椒酱编写
// @author       哔哩哔哩@流年_辣椒酱
// @match        *://jingyan.baidu.com/article/*
// @match        *://zhidao.baidu.com/question/*
// @icon         https://jingyan.baidu.com/favicon.ico?v=20171030
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453981/%E6%9E%81%E7%AE%80%E5%8C%96%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E7%BB%8F%E9%AA%8C%EF%BC%88%E8%AE%AF%E5%BC%BA%E5%AE%9A%E5%88%B6%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/453981/%E6%9E%81%E7%AE%80%E5%8C%96%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E7%BB%8F%E9%AA%8C%EF%BC%88%E8%AE%AF%E5%BC%BA%E5%AE%9A%E5%88%B6%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==


/*
//测试注入
(function(){
    if (document.domain != 'zhidao.baidu.com/' && document.domain != 'zhidao.baidu.com'){
    alert("百度经验-测试注入");}
    else{alert("百度知道-测试注入")};
})();
*/

//注意：部分代码需在HTML5.0环境下方可运行，可能会与其他优化百度页面的(油猴)脚本、广告移除扩展程序(adblocker)产生冲突！
//广告id列组，for循环以移除


//设置定时器，方便启动代码块
var timeout = 150;
(function() {
	'use strict';
	var currentURL = window.location.href;
	// var baike = /baike/;
	var jingyan = /jingyan/;
	var zhidao = /zhidao/;
	// var wenku = /wenku/;
	if(baike.test(currentURL)) {
		setTimeout(function() {
			document.getElementsByClassName("side-content")[0].remove();
			document.getElementsByClassName("topA")[0].remove();
			//document.getElementById("side_box_unionAd").remove();
			document.getElementsByClassName("right-ad")[0].remove();
			console.log("removed");
		}, timeout);
	}

    //-------------百度经验代码块------------
    else if(jingyan.test(currentURL)){
		setTimeout(function(){
            //广告id列组
			var jingyan_ads_ids = ['task-panel-wrap','aside','breadcrumb','bottom-ads-container','bottom-pic-ads-wrap','wgt-footer','wgt-like'];
			for(var a = 0; a < jingyan_ads_ids.length; a++) {
				var jingyan_id_remove = document.getElementById(jingyan_ads_ids[a]);
				// do your task with barElement
				jingyan_id_remove.parentNode.removeChild(jingyan_id_remove);
			}

			//class名列组以移除
			var jingyan_item_class = ['read-whole-mask', 'channel', 'userbar-ul'];
			for(var b = 0; b < jingyan_item_class.length; b++) {
				var jingyan_class_remove = document.getElementsByClassName(jingyan_item_class[b]);
				// .getElementsByClassName返回一个集合，需指定下标值[数字]
				jingyan_class_remove[0].parentNode.removeChild(jingyan_class_remove[0]);
			}

			//变更class名以更改样式，移除需手动‘查看更多’限制
			var jingyan_all_body = document.getElementsByClassName('main-content');
			jingyan_all_body[0].setAttribute("class", "exp-article");

			var jingyan_all_body2 = document.getElementsByClassName('exp-content-container fold');
			jingyan_all_body2[0].setAttribute("class", "exp-content format-exp");

			//移除以nav为class的<nav>标签
			let jingyan_baidu_remove2 = document.body.getElementsByClassName('nav');
			for(var c = 0; c < jingyan_baidu_remove2.length; c++) {
				//删除元素 元素.parentNode.removeChild(元素);
				if(jingyan_baidu_remove2[c] != null);
				jingyan_baidu_remove2[c].parentNode.removeChild(jingyan_baidu_remove2[c]);
			}
			console.log("removed");
		}, timeout);
	}

    //-------------百度知道代码块------------
    else if(zhidao.test(currentURL)) {
		setTimeout(function() {
			//class名列组以移除
			var zhidao_item_class = ['task-panel', 'nav-menu-container', 'jump-goto-star', 'task-list-button','qb-side','channel grid','question-number-text-chain','wgt-replyer-all-follow-box','wgt-ask accuse-response line ','wgt-ads answerlist','wgt-bottom-union mod-shadow last line wgt-union-bottom','mod-shadow mod-merger-push last wgt-asp-top','wgt-footer-new','line f-aid ask-info ff-arial'];
			for(var d = 0; d < zhidao_item_class.length; d++) {
				var zhidao_class_remove = document.getElementsByClassName(zhidao_item_class[d]);
				// .getElementsByClassName返回一个集合，需指定下标值[数字]
				zhidao_class_remove[0].parentNode.removeChild(zhidao_class_remove[0]);
			}

            var zhidao_all_body = document.getElementsByClassName('search-cont clearfix');
			zhidao_all_body[0].setAttribute("class", "container");

            /*
            var zhidao_all_body2 = document.getElementsByClassName('grid qb-content');
			zhidao_all_body2[0].setAttribute("class", "line qb-section");

			className:"text-chain-title","text-chain-content","last line","adTopImg","EC_ads_listborder";
			*/
			console.log("removed");
		}, timeout);
	} else if(wenku.test(currentURL)) {
		setTimeout(function() {
			document.getElementsByClassName("search-aside-adWrap")[0].remove();
			document.getElementsByClassName("search-aside-newadWrap")[0].remove();
			document.getElementsByClassName("yuedu-recommend-wrap")[0].remove();
			document.getElementById("fengchaoad").remove();
			document.getElementById("lastcell-dialog").remove();
			console.log("removed");
		}, timeout);
	}
})();
