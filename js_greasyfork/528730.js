// ==UserScript==
// @name         通威永祥去水印
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  去掉通威、永祥内部系统去水印，阅读更丝滑，已实现FBC、ERP、金山文档、知识中心
// @author       ZhengChuan
// @match        http://fbc.tongwei.com/*
// @match        https://fbc.tongwei.com/*
// @match        https://yxerp.tongwei.com/*
// @match        https://tongwei.kdocs.cn/*
// @match        https://zszx.tongwei.com/*
// @match 		 https://fbcpub.tongwei.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tongwei.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528730/%E9%80%9A%E5%A8%81%E6%B0%B8%E7%A5%A5%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/528730/%E9%80%9A%E5%A8%81%E6%B0%B8%E7%A5%A5%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    let currentUrl = document.URL;
	setTimeout(function(){
		if(currentUrl.startsWith("http://fbc.tongwei.com/")){
		let water = document.getElementById("1.23452384164.123412415");
		if(!!water){
			water.style.display='none';
		}
		}else if(currentUrl.startsWith("https://fbc.tongwei.com")){
			let water = document.getElementById("watermark");
			if(!!water){
				water.style.display='none';
			}
		}else if(currentUrl.startsWith("https://zszx.tongwei.com/")){
			let water = document.getElementById("Symbol\(watermark-dom\)");
			if(!!water){
				water.style.display='none';
			}
		}else if(currentUrl.startsWith("https://yxerp.tongwei.com/")){
			let waters = document.getElementsByClassName("T8JcTdAi");
			if(waters.length>0){
				waters[0].style.display='none';
			}
		}else if(currentUrl.startsWith("https://tongwei.kdocs.cn/")){
			let water = document.querySelector("#root > div.outline.pc.read-only.sidebar-visible > div.container-wrap > div.uikit-wo-watermark-plugin.uikit-watermark-container");
			if(!!water){
				water.remove();
			}
		}else if(currentUrl.startsWith("https://fbcpub.tongwei.com/")){
			let water = document.querySelector("#notice1\\.23452384164\\.123412416");
			if(!!water){
				water.style.display='none';
			}
		}
	},2500);
})();
