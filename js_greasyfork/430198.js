// ==UserScript==
// @name         禁止调试
// @namespace    coderWyh
// @version      0.1.1
// @description  Disable browser debugging function
// @author       coderWyh
// @match        http://www.gczl360.com:8084/Admin/ZLKGL/Template*
// @run-at       document-end
// ==/UserScript==
// 本代码所有权归作者所有 作者QQ：2471630907 手机号：18990193572  微信同手机号
// 本代码具有知识产权 未经作者授权严禁任何人进行使用、传播、二次开发等一系列损害作者知识产权的操作
// 作者对未经授权的操作保留起诉但不仅限于起诉的维护个人知识产权利益的法律途径
(function() {
    'use strict';
    document.onkeydown = function () {
		var e = window.event || arguments[0];
		//屏蔽F12
		if (e.keyCode == 123) {
            alert('自动设置提示：禁止调试控制台！如要调试代码，请先关闭自动设置功能！')
			return false;
			//屏蔽Ctrl+Shift+I
		} else if ((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 73)) {
            alert('自动设置提示：禁止调试控制台！如要调试代码，请先关闭自动设置功能！')
			return false;
			//屏蔽Shift+F10
		} else if ((e.shiftKey) && (e.keyCode == 121)) {
		    alert('自动设置提示：禁止调试控制台！如要调试代码，请先关闭自动设置功能！')
			return false;
		}
	};
	//屏蔽右键单击
	document.oncontextmenu = function () {
	    alert('自动设置提示：禁止调试控制台！如要调试代码，请先关闭自动设置功能！')
		return false;
	}
})();