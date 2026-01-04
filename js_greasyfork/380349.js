// ==UserScript==
// @name         U校园环境检测屏蔽
// @namespace    https://github.com/backrunner/GreaseMonkeyJS
// @version      1.3
// @description  屏蔽U校园的环境检测
// @author       BackRunner
// @include      *://u.unipus.cn/user/student?*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380349/U%E6%A0%A1%E5%9B%AD%E7%8E%AF%E5%A2%83%E6%A3%80%E6%B5%8B%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/380349/U%E6%A0%A1%E5%9B%AD%E7%8E%AF%E5%A2%83%E6%A3%80%E6%B5%8B%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addCSS(){
		//变量定义
        var cssText = "";

        cssText += "#layui-layer-shade1 {display: none !important;}";
        cssText += "#layui-layer1 {display: none !important;}"

		var modStyle = document.querySelector('#modCSS');
		if (modStyle === null)
		{
			modStyle = document.createElement('style');
			modStyle.id = 'modCSS';
			document.body.appendChild(modStyle);
		}
		modStyle.innerHTML = cssText;
	}
    addCSS();
})();