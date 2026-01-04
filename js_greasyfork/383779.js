// ==UserScript==
// @name         Block ads
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       Dave
// @match        https://wenku.baidu.com/*
// @match        https://browser.360.cn/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @run-at       window.onload
// @compatible	 Chrome
// @compatible	 Firefox
// @compatible	 Edge
// @compatible	 Safari
// @compatible	 Opera
// @compatible	 UC
// @downloadURL https://update.greasyfork.org/scripts/383779/Block%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/383779/Block%20ads.meta.js
// ==/UserScript==

(function() {
	'use strict';
    console.log("Hello world! Dave you a good boy!");
    var $ = $ || window.$;
    var window_url = window.location.href;
    var website_host = window.location.host;

    // block 360 ad
    if(website_host.indexOf("browser.360.cn") != -1){
        $(".error8_2").hide();
    }

     // block w3school ad
    if(website_host.indexOf("www.w3school.com.cn") != -1){
        $("#ad").hide();
    }

    //百度文库广告移除
    if(website_host.indexOf("wenku.baidu.com") != -1){
    	var removeBaiduWenkuAd = {};
	    removeBaiduWenkuAd.strt=function(){
	    	$(".banner-ad").hide();
	    	$(".union-ad-bottom").hide();
	    	$("iframe").hide();

	    	//VIP去广告小按钮
	    	$(".ggbtm-vip-close").hide();
	    	$(".ad-vip-close-bottom").hide();
	    	$(".ad-vip-close").hide();

            $("#lastcell-dialog").hide();

	    	//搜索页面
	    	$("#fengchaoad").hide();
	    	$(".search-aside-adWrap").hide();
	    }
	    removeBaiduWenkuAd.strt();
	    setInterval(function(){
	    	removeBaiduWenkuAd.strt();
	    },300);
    }

    /*
    * 网页解除限制，集成了脚本：网页限制解除（精简优化版）
    * 作者：Cat73、xinggsf
    * 原插件地址：https://greasyfork.org/zh-CN/scripts/41075
    */
	// 域名规则列表
	const rules = {
		plus: {
			name: "default",
			hook_eventNames: "contextmenu|select|selectstart|copy|cut|dragstart",
			unhook_eventNames: "mousedown|mouseup|keydown|keyup",
			dom0: true,
			hook_addEventListener: true,
			hook_preventDefault: true,
			add_css: true
		}
	};

	const returnTrue = e => true;
	// 获取目标域名应该使用的规则
	const getRule = (host) => {
		return rules.plus;
	};
	const dontHook = e => !!e.closest('form');
	// 储存被 Hook 的函数
	const EventTarget_addEventListener = EventTarget.prototype.addEventListener;
	const document_addEventListener = document.addEventListener;
	const Event_preventDefault = Event.prototype.preventDefault;
	// 要处理的 event 列表
	let hook_eventNames, unhook_eventNames, eventNames;

	// Hook addEventListener proc
	function addEventListener(type, func, useCapture) {
		let _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
		if (!hook_eventNames.includes(type)) {
			_addEventListener.apply(this, arguments);
		} else {
			_addEventListener.apply(this, [type, returnTrue, useCapture]);
		}
	}

	// 清理或还原DOM节点的onxxx属性
	function clearLoop() {
		let type, prop,
		c = [document,document.body, ...document.getElementsByTagName('div')],
		// https://life.tw/?app=view&no=746862
		e = document.querySelector('iframe[src="about:blank"]');
		if (e && e.clientWidth>99 && e.clientHeight>11){
			e = e.contentWindow.document;
			c.push(e, e.body);
		}

		for (e of c) {
			if (!e) continue;
			e = e.wrappedJSObject || e;
			for (type of eventNames) {
				prop = 'on' + type;
				e[prop] = null;
			}
		}
	}

    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyleBy8626") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyleBy8626";
            document.head.appendChild(style);
            return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

	function init() {
		// 获取当前域名的规则
		let rule = getRule(location.host);

		// 设置 event 列表
		hook_eventNames = rule.hook_eventNames.split("|");
		// Allowed to return value
		unhook_eventNames = rule.unhook_eventNames.split("|");
		eventNames = hook_eventNames.concat(unhook_eventNames);

		if (rule.dom0) {
			setInterval(clearLoop, 9e3);
			setTimeout(clearLoop, 1e3);
			window.addEventListener('load', clearLoop, true);
		}

		if (rule.hook_addEventListener) {
			EventTarget.prototype.addEventListener = addEventListener;
			document.addEventListener = addEventListener;
		}

		if (rule.hook_preventDefault) {
			Event.prototype.preventDefault = function () {
				if (dontHook(this.target) || !eventNames.includes(this.type)) {
					Event_preventDefault.apply(this, arguments);
				}
			};
		}
	}
	init();
})();