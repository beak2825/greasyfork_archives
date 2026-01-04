// ==UserScript==
// @name        知乎 - 阻止知乎在 Firefox Android 下自动跳转至 zhihu://
// @description 刘看山啊，你知不知道，在没有安装你家客户端的情况下，用 Firefox Android 打开问答页面，会发生什么啊？
// @namespace   RainSlide
// @author      RainSlide
// @icon        https://static.zhihu.com/static/favicon.ico
// @version     1.0
// @license     blessing
// @match       https://www.zhihu.com/question/*
// @grant       none
// @run-at      document-start
// @inject-into context
// @compatible  必须支持 exportFunction() 方法
// @downloadURL https://update.greasyfork.org/scripts/411338/%E7%9F%A5%E4%B9%8E%20-%20%E9%98%BB%E6%AD%A2%E7%9F%A5%E4%B9%8E%E5%9C%A8%20Firefox%20Android%20%E4%B8%8B%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%87%B3%20zhihu%3A.user.js
// @updateURL https://update.greasyfork.org/scripts/411338/%E7%9F%A5%E4%B9%8E%20-%20%E9%98%BB%E6%AD%A2%E7%9F%A5%E4%B9%8E%E5%9C%A8%20Firefox%20Android%20%E4%B8%8B%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%87%B3%20zhihu%3A.meta.js
// ==/UserScript==

/* From https://static.zhihu.com/heifetz/mobile.question-routes.ddbe47f5365563636c6f.js :

window.addEventListener("load",function(){d.Android&&s&&(O.a.trackEvent(e,{id:5427,action:"Unknown"}),location.href="zhihu://".concat(u?"answer/".concat(u):"question/".concat(n),"?utm_source=mobile_web_scheme"))})

*/

"use strict";

if ( typeof exportFunction === "function" ) exportFunction(
	function (type, listener, ...args) {
		if ( type === "load" && typeof listener === "function" ) {
			const payload = String(listener);
			if (
				payload.includes('"zhihu://"') &&
				payload.includes('"?utm_source=mobile_web_scheme"')
			) return;
		}
		EventTarget.prototype.addEventListener.apply(this, [type, listener, ...args]);
	}, window.wrappedJSObject, { defineAs: "addEventListener" }
);
