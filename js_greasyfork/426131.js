// ==UserScript==
// @name         マクロミル（SP版）マトリクスをロングタップで項目を閉じる
// @namespace    macromill_matrixclose
// @version      0.0.2
// @description  普通のタップなら普通に回答、ロングタップなら項目を閉じるので楽
// @author       monitor_support
// @include      https://monitor.macromill.com/airs/exec/smartAnswerAction.do*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js
// @license     新UI作ったやつはうんちでも食べてろ
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426131/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%EF%BC%88SP%E7%89%88%EF%BC%89%E3%83%9E%E3%83%88%E3%83%AA%E3%82%AF%E3%82%B9%E3%82%92%E3%83%AD%E3%83%B3%E3%82%B0%E3%82%BF%E3%83%83%E3%83%97%E3%81%A7%E9%A0%85%E7%9B%AE%E3%82%92%E9%96%89%E3%81%98%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/426131/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%EF%BC%88SP%E7%89%88%EF%BC%89%E3%83%9E%E3%83%88%E3%83%AA%E3%82%AF%E3%82%B9%E3%82%92%E3%83%AD%E3%83%B3%E3%82%B0%E3%82%BF%E3%83%83%E3%83%97%E3%81%A7%E9%A0%85%E7%9B%AE%E3%82%92%E9%96%89%E3%81%98%E3%82%8B.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

	var matrixflg=0;
	var timerId;
	$('.qnr-q-ch-form, .rcnone, .radio').on("mousedown touchstart", function(){
		var elm=this;
		matrixflg=0;
		timerId = setTimeout(function(){
			matrixflg=1;
		}, 300);
	});
	$('.qnr-q-ch-form, .rcnone, .radio').on("mouseup touchend", function(){
		clearTimeout(timerId);
		if(matrixflg == 1) {
//			$(this).trigger("click");
			$(this).parent().parent().parent().parent().children(".matrix-item").trigger("click");
		}
		matrixflg=0;
	});
})();
