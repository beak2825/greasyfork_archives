// ==UserScript==
// @name         谷歌网页翻译-自改
// @namespace    https://github.com/mefengl
// @version      2.0.2
// @description  自改mefengl的谷歌网页翻译脚本，修复部分网页jquery重复加载导致无法使用或无法提交表单的bug
// @author       mefengl
// @match        http://*/*
// @match        https://*/*
// @exclude      https://edition.cnn.com/
// @exclude      https://www.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=translate.google.com

// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459688/%E8%B0%B7%E6%AD%8C%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91-%E8%87%AA%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/459688/%E8%B0%B7%E6%AD%8C%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91-%E8%87%AA%E6%94%B9.meta.js
// ==/UserScript==

(function () {
	"use strict";

	// @require      https://cdn.staticfile.org/jquery/3.6.1/jquery.min.js
	/*async function loadJqueryFuc(){
		console.log($())
		if(!$()){
			let script = document.createElement("script");
			script.type = "text/javascript";
			script.src="https://cdn.staticfile.org/jquery/3.6.1/jquery.min.js";
			document.querySelectorAll('head')[0].appendChild(script);
			console.log("loadJquery success")
			await timeout(1000);
		}
	}

	function timeout(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}*/

	// 防止在iframe中也调用本脚本
	if ((self.frameElement && self.frameElement.tagName == "IFRAME") || (window.frames.length != parent.frames.length) || (self != top) ) {
		console.log('在iframe中');
		return
	}

	// if origin end with '.translate.goog', then return
	if (window.location.origin.endsWith(".translate.goog")) return;

	// if title contains Chinese, then make button less visible
	const hide_right = document.title.match(/[\u4e00-\u9fa5]/)? "-130px": "-120px";

	const style = document.createElement("style");
	const styleStr = `
	  #translateBtn{
       position: fixed;
       width: 140px;
       top: 120px;
       right: ${hide_right};
       z-index: 999999;
       background-color: #4285f4;
       color: #fff;
       opacity: 0.8;
       border: none;
       border-radius: 4px;
       padding: 10px 16px;
       font-size: 18px;
       cursor: pointer;
     }
	  #translateBtn:hover{
       right:-10px;
	    animation-name: showBtn;
       animation-duration: 0.4s;
	  }
     @keyframes showBtn {
       0% {
        right: ${hide_right};
       }
       100% {
        right:-10px;
       }
     }
	`
	style.appendChild(document.createTextNode(styleStr))
	document.head.appendChild(style)
	const translateBtn = document.createElement("button");
	translateBtn.innerHTML = "翻译网页";
	translateBtn.setAttribute("id","translateBtn")
	translateBtn.onclick = function () {
		window.location.href = `https://translate.google.com/translate?sl=auto&tl=zh-CN&u=${window.location.href}`;
	}
	document.body.appendChild(translateBtn);

	// hide button if full screen
	/*$(document).on("fullscreenchange", function () {
		document.fullscreenElement ? $button.hide() : $button.show();
	});*/
	/*$(function () {

	});*/
})();
