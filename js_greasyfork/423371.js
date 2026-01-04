// ==UserScript==
// @name         Alibaba国际站强制营销|阿里巴巴国际站强制访客详情营销脚本
// @namespace    https://ali404.com/
// @icon         data:image/jpg;base64,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
// @version      1.0.9
// @description  本脚本可对alibaba.com阿里巴巴国际站 无法营销/已被抢 访客进行强制解锁!本脚本完全免费,仅供个人学习研究使用,请勿用于非法用途或盗卖、盈利等行为,作者不承担任何责任!
// @author       运营有数
// @match        https://data.alibaba.com/marketing/visitor*
// @grant             unsafeWindow
// @license      Apache Licence 2.0
// @supportURL https://ali404.com
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/423371/Alibaba%E5%9B%BD%E9%99%85%E7%AB%99%E5%BC%BA%E5%88%B6%E8%90%A5%E9%94%80%7C%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E5%BC%BA%E5%88%B6%E8%AE%BF%E5%AE%A2%E8%AF%A6%E6%83%85%E8%90%A5%E9%94%80%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/423371/Alibaba%E5%9B%BD%E9%99%85%E7%AB%99%E5%BC%BA%E5%88%B6%E8%90%A5%E9%94%80%7C%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E5%BC%BA%E5%88%B6%E8%AE%BF%E5%AE%A2%E8%AF%A6%E6%83%85%E8%90%A5%E9%94%80%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

      var button = document.createElement("button");
 button.id = "jsp4p";
 button.title = "本脚本完全免费,仅供个人学习研究使用,请勿用于非法用途或盗卖、盈利等行为,作者不承担任何责任!微信公众号@运营有数";
 button.textContent = "国际站外贸侠助手";
 button.style = "width: 100px;height: 50px;margin-left: 22px;";
 var timer;

 function js(type) {
 	var obj = document.getElementsByName("visitor-check");
 	var a = 0;
 	for (var i = 0; i < obj.length; i++) {
 		var f = false;
 		if (type == 2) {
 			f = true;
 			clearInterval(timer)
 		} else {
 			f = obj[i].getAttribute("buyermemberseq")
 		} if (f) {
 			obj[i].removeAttribute("disabled");
 			obj[i].setAttribute("mailable", "true");
 			obj[i].setAttribute("buyermemberseq", obj[i].getAttribute("visitorid"));
 			a = 1
 		} else {
 			obj[i].setAttribute("title", "本脚本已失效，欢迎使用新插件》国际站外贸侠助手~依旧免费、良心插件")
                     
 		}
 	}
 	return a
 }
 window.onload = function() {
 	timer = window.setInterval(function() {
 		js(1)
 	}, 1000 * 2);
 	var button1 = document.createElement("button");
 	button1.id = "jsp4p1";
 	button1.title = "本脚本已失效，欢迎使用新扩展插件【国际站外贸侠助手】，依旧免费、不用注册、收集任何信息 良心插件~";
 	button1.textContent = "解锁全部";
 	button1.style = "width: 100px;height: 50px;margin-left: 22px;";
 	var x = document.getElementsByClassName("w-batch-edm")[0];
 	x.appendChild(button);
 	x.appendChild(button1);
 	js();
 	button.onclick = function() {
 		var aa = js(1);
 		if (aa == 0) {
 			alert("本脚本已失效，欢迎使用新插件》国际站外贸侠助手~依旧免费、良心插件");
 		        window.open("https://greasyfork.org/zh-CN/scripts/423371");
 		}
 		return
 	};
 	button1.onclick = function() {
 		js(2);
 			alert("本脚本已失效，欢迎使用新插件》国际站外贸侠助手~依旧免费、良心插件");
 		window.open("https://greasyfork.org/zh-CN/scripts/423371");
 		return
 	}
 };


})();
