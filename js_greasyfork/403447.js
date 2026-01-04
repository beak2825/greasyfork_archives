// ==UserScript==
// @name         マクロミル（PC版）URLをクリックしたことにする
// @namespace    macromill_autoclick_sp
// @version      0.0.1alpha2
// @description  URL自動クリック
// @author       monitor_support
// @include      https://monitor.macromill.com/airs/exec/answerAction.do*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js
// @license     新UI作ったやつはうんちでも食べてろ
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403447/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%EF%BC%88PC%E7%89%88%EF%BC%89URL%E3%82%92%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%97%E3%81%9F%E3%81%93%E3%81%A8%E3%81%AB%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/403447/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%EF%BC%88PC%E7%89%88%EF%BC%89URL%E3%82%92%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%97%E3%81%9F%E3%81%93%E3%81%A8%E3%81%AB%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

	$(document).ready(function(){
		setTimeout(function(){
			$("a").removeAttr("check");
		},1000);
	});
})();
