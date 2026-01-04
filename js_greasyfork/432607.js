// ==UserScript==
// @name         剪贴板净化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  剪贴板净化，去掉多余的网站信息或者用户信息，让分享更方便
// @author       Hunter
// @match        *://*.zhihu.com/*
// @match        *://*.jianshu.com/*
// @match        *://*.csdn.net/*
// @match        *://*.nowcoder.com/*
// @match        *://*.juejin.im/*
// @match        *://*.juejin.cn/*
// @icon         https://www.google.com/s2/favicons?domain=juejin.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432607/%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/432607/%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function clear(e){
		e.preventDefault();
		// 获取用户选择的文本
		var text = window.getSelection().toString();
        // 注入剪贴板中
		navigator.clipboard.writeText(text);
	}
    document.addEventListener('copy',clear)
})();