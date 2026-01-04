// ==UserScript==
// @name         干净的百度翻译
// @namespace    http://tampermonkey.net/
// @version      2024-07-23
// @description  去除百度翻译的广告
// @author       You
// @match        https://fanyi.baidu.com/*
// @icon         https://fanyi.baidu.com/favicon.ico
// @grant        none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/501533/%E5%B9%B2%E5%87%80%E7%9A%84%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/501533/%E5%B9%B2%E5%87%80%E7%9A%84%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 设置定时器，等待2秒后执行
        setTimeout(function() {
         // 检查元素是否存在
        var element = document.querySelector("#multiContainer > div:nth-child(2)");
        if (element) {
            // 隐藏元素
            debugger
            element.style.display = 'none';
			var a = document.querySelector("#root > div:nth-child(2)");
			if(a){
				a.style.display = 'none';
			}

			var b = document.querySelector("#multiContainer > div.ZHrlRAUU > div > div.sF3Yx_p0");
			if(b){
				b.style.display = 'none';
			}
        }
        }, 400); // 400毫秒
    });
})();