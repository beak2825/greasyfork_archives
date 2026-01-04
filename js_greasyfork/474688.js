// ==UserScript==
// @name         Confirm确认框取消
// @name:zh-CN   Confirm确认框取消
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  用于jspxzx网站Confirm确认框取消
// @author       www
// @match        *://online.jspxzx.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474688/Confirm%E7%A1%AE%E8%AE%A4%E6%A1%86%E5%8F%96%E6%B6%88.user.js
// @updateURL https://update.greasyfork.org/scripts/474688/Confirm%E7%A1%AE%E8%AE%A4%E6%A1%86%E5%8F%96%E6%B6%88.meta.js
// ==/UserScript==
// @license MIT
	
(function() {
		'use strict';
		var cf = window.confirm;
		window.confirm = function(...args){
			if(args[0].indexOf("是否继续上次观看")>=0){
				return true;
			}else{
				return cf(...args)
			}
		}
	})();