// ==UserScript==
// @name DeepSeek展开页面
// @namespace http://www.mapaler.com/
// @version 0.3
// @description 展开DeepSeek的页面以方便直接截长图
// @author 枫谷剑仙 <mapaler@163.com>
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.chat.deepseek.com/*
// @downloadURL https://update.greasyfork.org/scripts/528201/DeepSeek%E5%B1%95%E5%BC%80%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/528201/DeepSeek%E5%B1%95%E5%BC%80%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
let css = `
.ds-theme>div { /*网页内容不要固定位置*/
	position: relative;
}

.ds-theme>div>div:nth-last-child(1)>div:nth-last-child(1)>div>div:nth-last-child(1)>div {
	position: relative;
	& div { /*整个对话框自动高度*/
		height: auto;
		
		& div:nth-child(1) { /*实质内容框，不限制宽度*/
			max-width: unset;
		}
		
		& div:nth-last-child(1) { /*发送消息框，不要钉在下面*/
			position: relative;
		}
	}
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
