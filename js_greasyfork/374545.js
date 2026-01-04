// ==UserScript==
// @name         南信大6小时实验学习，每5分钟Confirm确认框取消
// @name:zh-CN   南信大6小时实验学习，每5分钟Confirm确认框取消
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  针对南京信息大学实验网6小时学习用，让你在一个页面直接刷时间，不再受5分钟确认提示框干扰。
// @author       UaN
// @match        *://examsafety.nuist.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374545/%E5%8D%97%E4%BF%A1%E5%A4%A76%E5%B0%8F%E6%97%B6%E5%AE%9E%E9%AA%8C%E5%AD%A6%E4%B9%A0%EF%BC%8C%E6%AF%8F5%E5%88%86%E9%92%9FConfirm%E7%A1%AE%E8%AE%A4%E6%A1%86%E5%8F%96%E6%B6%88.user.js
// @updateURL https://update.greasyfork.org/scripts/374545/%E5%8D%97%E4%BF%A1%E5%A4%A76%E5%B0%8F%E6%97%B6%E5%AE%9E%E9%AA%8C%E5%AD%A6%E4%B9%A0%EF%BC%8C%E6%AF%8F5%E5%88%86%E9%92%9FConfirm%E7%A1%AE%E8%AE%A4%E6%A1%86%E5%8F%96%E6%B6%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
let cf = window.confirm;
window.confirm = function(...args){
	if(args[0].indexOf("5分钟")>=0){
		return true;
	}else{
		return cf(...args)
	}
}
})();