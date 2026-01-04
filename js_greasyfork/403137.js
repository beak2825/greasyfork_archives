// ==UserScript==
// @name         マクロミル（SP版）URLをクリックしたことにする
// @namespace    macromill_autoclick_sp
// @version      0.0.1alpha3
// @description  URLをクリックしたことにする
// @author       monitor_support
// @include      https://monitor.macromill.com/airs/exec/smartAnswerAction.do*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js
// @grant        none
// @license     新UI作ったやつはうんちでも食べてろ
// @downloadURL https://update.greasyfork.org/scripts/403137/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%EF%BC%88SP%E7%89%88%EF%BC%89URL%E3%82%92%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%97%E3%81%9F%E3%81%93%E3%81%A8%E3%81%AB%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/403137/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%EF%BC%88SP%E7%89%88%EF%BC%89URL%E3%82%92%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%97%E3%81%9F%E3%81%93%E3%81%A8%E3%81%AB%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function() {
  'use strict';
 	$(document).ready(function(){
		setTimeout(function(){
		/* 要クリックのものをクリック不要にする */
 			try {
				$("a").removeAttr("check");
			} catch (e) {}
 
			/* 動画の再生時間を1秒にする。ただし動画クリックは必要 */
			/* サーバーに情報が送られてしまうため不安な場合 if(1) を if(0) に変更のこと */
			if(1) {
				try {
					$('[name="attentionRequiredTime"]').val(['1']);
				} catch (e) {}
			}
		},1000);
	});
})();
