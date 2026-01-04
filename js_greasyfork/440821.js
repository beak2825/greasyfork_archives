// ==UserScript==
// @name         [SNI模块] 显示时间
// @namespace    cksni-module-show-timer
// @version      1.0
// @description  视频内显示时间
// @author       CKylinMC
// @match        https://*.bilibili.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/440821/%5BSNI%E6%A8%A1%E5%9D%97%5D%20%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/440821/%5BSNI%E6%A8%A1%E5%9D%97%5D%20%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function(){
	let timerInterval = null;
	const padNum = (num,count=2)=>((''+Math.pow(10,count)).substr(1)+num).slice(-1*Math.max(count,(''+num).length));

	const name = "当前时间";
	const module = data=>{
		data.logger.log(data);
		const {domHelper} = data.tools;
		clearInterval(timerInterval);
		return domHelper('span',{
			css:{
				float: "right",
			    transform: "translateX(-30px)"
			},
			init:span=>{
				timerInterval = setInterval(()=>{
					const time = new Date();
					const fmt = `${padNum(time.getHours())}:${padNum(time.getMinutes())}:${padNum(time.getSeconds())}`;
					span.innerText = fmt;
				},1000);
			}
		});
	};
	if(!unsafeWindow.SNIMODULES){
		unsafeWindow.SNIMODULES = {}
	}
	unsafeWindow.SNIMODULES[name] = module;
})();