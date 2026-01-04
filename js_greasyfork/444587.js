// ==UserScript==
// @name         b站直播弹幕自动补中括号+快捷语 同传脚本
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  参考说明
// @author       You
// @match        https://live.bilibili.com/*
// @grant        none
// @icon         http://bilibili.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444587/b%E7%AB%99%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E8%87%AA%E5%8A%A8%E8%A1%A5%E4%B8%AD%E6%8B%AC%E5%8F%B7%2B%E5%BF%AB%E6%8D%B7%E8%AF%AD%20%E5%90%8C%E4%BC%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/444587/b%E7%AB%99%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E8%87%AA%E5%8A%A8%E8%A1%A5%E4%B8%AD%E6%8B%AC%E5%8F%B7%2B%E5%BF%AB%E6%8D%B7%E8%AF%AD%20%E5%90%8C%E4%BC%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

window.onload = function() {
	var t1 = window.setTimeout(function() {
        // 【】开关
        var func_switch = 1;
		var shurukuang = document.getElementsByClassName("chat-input")[1];
		if (shurukuang != null) {
			shurukuang.onkeydown = function(e) {
				var event = e ? e: window.event;
				var currKey = event.keyCode || event.which || event.charCode;
				// console.log(currKey);
				var dom_input = document.getElementsByClassName('chat-input')[1];
				var evt = document.createEvent('HTMLEvents');
				evt.initEvent('input', true, true);
				if (currKey == 13) {
                    // Enter回车按键快捷输入【】
                    // 如果需要单括号，就修改下面这行''中的内容为【即可
                    if(1 == func_switch) {
                        dom_input.value = '【】';
                        dom_input.dispatchEvent(evt);
                        var inpObj = document.getElementsByClassName("chat-input")[1];
                        if (inpObj.setSelectionRange) {
                            inpObj.setSelectionRange(1, 1);
                        } else {
                            console.log('不兼容setSelectionRange方法');
                        }
                    }
				} else if (currKey == 112) { // F1按键快捷输入
					dom_input.value = '【晚上好】';
					dom_input.dispatchEvent(evt);
					setTimeout(function() {
						document.getElementsByClassName("bl-button")[0].click();
					},
					50);
				} else if (currKey == 113) { // F2按键快捷输入
					dom_input.value = '【晚安】';
					dom_input.dispatchEvent(evt);
					setTimeout(function() {
						document.getElementsByClassName("bl-button")[0].click();
					},
					50);
				} else if (currKey == 114) { // F3按键快捷输入
					dom_input.value = '【感谢礼物】';
					dom_input.dispatchEvent(evt);
					setTimeout(function() {
						document.getElementsByClassName("bl-button")[0].click();
					},
					50);
				} else if (currKey == 115) { // F4按键快捷输入
					dom_input.value = '【感谢sc】';
					dom_input.dispatchEvent(evt);
					setTimeout(function() {
						document.getElementsByClassName("bl-button")[0].click();
					},
					50);
				} else if (currKey == 118) { // F7按键快捷输入
					dom_input.value = '【感谢上船】';
					dom_input.dispatchEvent(evt);
					setTimeout(function() {
						document.getElementsByClassName("bl-button")[0].click();
					},
					50);
				} else if (currKey == 119) { // F8按键快捷输入 开关【】功能
                    func_switch = func_switch == 1 ? 0 : 1;
                    /*
					dom_input.value = '【老板大气】';
					dom_input.dispatchEvent(evt);
					setTimeout(function() {
						document.getElementsByClassName("bl-button")[0].click();
					},
					50);
                    */
				}
			};
			// 去除定时器
			window.clearTimeout(t1);
		}
	},
	1000);
};
