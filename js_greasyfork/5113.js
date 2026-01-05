// ==UserScript==
// @name       选课脚本
// @namespace  http://use.i.E.your.homepage/
// @version    0.2
// @description  enter something useful
// @match    http://jwxt.sdu.edu.cn:7890/pls/wwwbks/xk.CourseInput
// @include http://jwxt.sdu.edu.cn:*/*
// @require http://code.jquery.com/jquery-2.1.1.min.js
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/5113/%E9%80%89%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/5113/%E9%80%89%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

setInterval(function () {
    	//var $firstNum,$secondNum;
		var $fistInput = $('input[name = p_qxrxk]');
		var $secondInput = $('input[name = p_qxrxk_kxh]');
		var $button = $('input[value = "提交"]');
		$fistInput.val("0051400110");
		$secondInput.val("602");
		$button.click();
		},1000);