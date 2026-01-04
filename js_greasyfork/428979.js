// ==UserScript==
// @name 美化滚动条
// @description 美化滚动条。
// @match *://*/*
// @version 1.0
// @namespace aecra_meihua
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/428979/%E7%BE%8E%E5%8C%96%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/428979/%E7%BE%8E%E5%8C%96%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==

-function() {
	'use strict';
	try {
		if (self != top) {} else {
			if (document.readyState || document.childNodes || document.onreadystatechange) {
				scrollBarChange()
			} else {
				scrollBarChange()
			}
			function scrollBarChange() {
				let css = '::-webkit-resizer,::-webkit-scrollbar-button,::-webkit-scrollbar-corner{display:none !important;max-width:0 !important;max-height:0 !important;overflow:hidden !important;position:absolute;left:-102030px}::-webkit-scrollbar-track{border-left-color:transparent !important;background:transparent !important;box-shadow:none !important;-webkit-box-shadow:none !important;border:none !important;outline:none !important}::-webkit-full-screen{visibility:visible;max-width:none}::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-track-piece{border-radius:10px;-webkit-border-radius:10px;background-color:transparent !important}::-webkit-scrollbar-thumb:vertical{height:10px;border-radius:10px;-webkit-border-radius:10px;background-color:#E7EAED}::-webkit-scrollbar-thumb:horizontal{width:10px;border-radius:10px;-webkit-border-radius:10px;background-color:#C1C1C1}::-webkit-scrollbar-track-piece:no-button,::-webkit-scrollbar-thumb{border-radius:10px;background-color:transparent}::-webkit-scrollbar-thumb:hover{background-color:#A8A8A8}::-webkit-scrollbar-thumb:active{background-color:#787878}::-webkit-scrollbar-button:horizontal,::-webkit-scrollbar-button:vertical{width:10px}::-webkit-scrollbar-button:horizontal:end:increment,::-webkit-scrollbar-button:horizontal:start:decrement,::-webkit-scrollbar-button:vertical:end:increment,::-webkit-scrollbar-button:vertical:start:decrement{background-color:transparent !important}::-moz-resizer,::-moz-scrollbar-button,::-moz-scrollbar-corner{display:none !important;max-width:0 !important;max-height:0 !important;overflow:hidden !important;position:absolute;left:-102030px}::-moz-scrollbar-track{border-left-color:transparent !important;background:transparent !important;box-shadow:none !important;-moz-box-shadow:none !important;border:none !important;outline:none !important}::-moz-full-screen{visibility:visible;max-width:none}::-moz-scrollbar{width:10px;height:10px}::-moz-scrollbar-track-piece{border-radius:10px;-moz-border-radius:10px;background-color:transparent !important}::-moz-scrollbar-thumb:vertical{height:10px;border-radius:10px;-moz-border-radius:10px;background-color:#E7EAED}::-moz-scrollbar-thumb:horizontal{width:10px;border-radius:10px;-moz-border-radius:10px;background-color:#C1C1C1}::-moz-scrollbar-track-piece:no-button,::-moz-scrollbar-thumb{border-radius:10px;background-color:transparent}::-moz-scrollbar-thumb:hover{background-color:#A8A8A8}::-moz-scrollbar-thumb:active{background-color:#787878}::-moz-scrollbar-button:horizontal,::-moz-scrollbar-button:vertical{width:10px}::-moz-scrollbar-button:horizontal:end:increment,::-moz-scrollbar-button:horizontal:start:decrement,::-moz-scrollbar-button:vertical:end:increment,::-moz-scrollbar-button:vertical:start:decrement{background-color:transparent !important}::-ms-resizer,::-ms-scrollbar-button,::-ms-scrollbar-corner{display:none !important;max-width:0 !important;max-height:0 !important;overflow:hidden !important;position:absolute;left:-102030px}::-ms-scrollbar-track{border-left-color:transparent !important;background:transparent !important;box-shadow:none !important;-ms-box-shadow:none !important;border:none !important;outline:none !important}::-ms-full-screen{visibility:visible;max-width:none}::-ms-scrollbar{width:10px;height:10px}::-ms-scrollbar-track-piece{border-radius:10px;-ms-border-radius:10px;background-color:transparent !important}::-ms-scrollbar-thumb:vertical{height:10px;border-radius:10px;-ms-border-radius:10px;background-color:#E7EAED}::-ms-scrollbar-thumb:horizontal{width:10px;border-radius:10px;-ms-border-radius:10px;background-color:#C1C1C1}::-ms-scrollbar-track-piece:no-button,::-ms-scrollbar-thumb{border-radius:10px;background-color:transparent}::-ms-scrollbar-thumb:hover{background-color:#A8A8A8}::-ms-scrollbar-thumb:active{background-color:#787878}::-ms-scrollbar-button:horizontal,::-ms-scrollbar-button:vertical{width:10px}::-ms-scrollbar-button:horizontal:end:increment,::-ms-scrollbar-button:horizontal:start:decrement,::-ms-scrollbar-button:vertical:end:increment,::-ms-scrollbar-button:vertical:start:decrement{background-color:transparent !important}::-o-resizer,::-o-scrollbar-button,::-o-scrollbar-corner{display:none !important;max-width:0 !important;max-height:0 !important;overflow:hidden !important;position:absolute;left:-102030px}::-o-scrollbar-track{border-left-color:transparent !important;background:transparent !important;box-shadow:none !important;-o-box-shadow:none !important;border:none !important;outline:none !important}::-o-full-screen{visibility:visible;max-width:none}::-o-scrollbar{width:10px;height:10px}::-o-scrollbar-track-piece{border-radius:10px;-o-border-radius:10px;background-color:transparent !important}::-o-scrollbar-thumb:vertical{height:10px;border-radius:10px;-o-border-radius:10px;background-color:#E7EAED}::-o-scrollbar-thumb:horizontal{width:10px;border-radius:10px;-o-border-radius:10px;background-color:#C1C1C1}::-o-scrollbar-track-piece:no-button,::-o-scrollbar-thumb{border-radius:10px;background-color:transparent}::-o-scrollbar-thumb:hover{background-color:#A8A8A8}::-o-scrollbar-thumb:active{background-color:#787878}::-o-scrollbar-button:horizontal,::-o-scrollbar-button:vertical{width:10px}::-o-scrollbar-button:horizontal:end:increment,::-o-scrollbar-button:horizontal:start:decrement,::-o-scrollbar-button:vertical:end:increment,::-o-scrollbar-button:vertical:start:decrement{background-color:transparent !important}';
				function addCss() {
					document.head.insertAdjacentHTML("beforeend", '<style id = "meiHuaStyle" type = "text/css" media = "all" class = "stylus">' + (css) + "</style>")
				};
				try {
					var stylusjiangxiaobaicss = document.querySelector("style#meiHuaStyle");
					if (stylusjiangxiaobaicss) {} else {
						addCss()
					}
				} catch (err) {
					addCss()
				}
			}
		}
	} catch (err) {
		return false
	}
}(Object);