// ==UserScript==
// @name         mscststs 系列 克制Blanc
// @namespace    mscststs
// @version      0.4
// @description  用于对定制直播间引入解除字数限制以及键盘控制
// @author       You
// @include     /^https?:\/\/live\.bilibili\.com\/blanc\/\d/
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/372856/mscststs%20%E7%B3%BB%E5%88%97%20%E5%85%8B%E5%88%B6Blanc.user.js
// @updateURL https://update.greasyfork.org/scripts/372856/mscststs%20%E7%B3%BB%E5%88%97%20%E5%85%8B%E5%88%B6Blanc.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
	/**
	* 你也可以参照该格式引入其他的一些脚本，前提是：
	* 这些脚本须是 grant:none，未使用Tampermonkey API
	* 这些脚本的require需要写在脚本之前，以保证按顺序加载
	* 在引入时，这几行简单的代码不能完全替代Tampermonkey的脚本运行机制，最好通过作者修改脚本运行域来使其兼容
	*/
	[
		"https://cdn.bootcss.com/gif.js/0.2.0/gif.js",
		"https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.js",
		"https://greasyfork.org/zh-CN/scripts/37976/code/BiliBili直播间解除字数限制.js",
		"https://greasyfork.org/zh-CN/scripts/35279/code/BiliBili-直播间勋章增强.js",
		"https://greasyfork.org/zh-CN/scripts/370844/code/BiliBili-直播间头衔增强.js",
		"https://greasyfork.org/zh-CN/scripts/36428/code/直播间键盘控制.js",
	].map((url)=>{
		let myScript= document.createElement("script");
		myScript.type = "text/javascript";
		myScript.src=url;
		document.body.appendChild(myScript);
	})
})();