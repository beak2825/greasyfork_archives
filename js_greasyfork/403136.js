// ==UserScript==
// @name         マクロミル（SP版）説明を自動的に閉じる
// @namespace    macromill_close_sp
// @version      0.0.2
// @description  特に糞長い説明あるとかなり楽になる
// @author       monitor_support
// @include      https://monitor.macromill.com/airs/exec/smartAnswerAction.do*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js
// @license     新UI作ったやつはうんちでも食べてろ
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403136/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%EF%BC%88SP%E7%89%88%EF%BC%89%E8%AA%AC%E6%98%8E%E3%82%92%E8%87%AA%E5%8B%95%E7%9A%84%E3%81%AB%E9%96%89%E3%81%98%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/403136/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%EF%BC%88SP%E7%89%88%EF%BC%89%E8%AA%AC%E6%98%8E%E3%82%92%E8%87%AA%E5%8B%95%E7%9A%84%E3%81%AB%E9%96%89%E3%81%98%E3%82%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

	$(document).ready(function(){
		setTimeout(function(){
			$('.qnr-q-qbody-indicator').trigger("click");
		},2000);
	});
})();
