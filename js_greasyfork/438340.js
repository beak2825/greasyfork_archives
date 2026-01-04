// ==UserScript==
// @name         合工大自动评教
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动点击第一个选项,适用于合肥工业大学教务系统
// @author       _Grayblue_
// @match        http://jxglstu.hfut.edu.cn/eams5-student/for-std/lesson-survey/start-survey/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438340/%E5%90%88%E5%B7%A5%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/438340/%E5%90%88%E5%B7%A5%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

;(function () {
	'use strict'
    //是否自动提交,是则设为1，否设为0
	var ok = 0
	//等候两秒，网比较差可以延长时间
	setTimeout(function () {
		check()
	}, 2000)
	if (ok == 1) {
		$('body').prepend('<label>自动提交开启</label>')
	} else {
		$('body').prepend('<label>自动提交关闭</label>')
	}
	//单选非常满意
	function check() {
		for (var i = 0; i < document.querySelectorAll('[aria-required=true][type=radio]').length; ) {
			document.querySelectorAll('[aria-required=true][type=radio]')[i].checked = true
			i += 1
		}
		if (ok == 1) {
			document.querySelector('#save-button').click()
		}
	}
})()
