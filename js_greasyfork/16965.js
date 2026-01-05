// ==UserScript==
// @name					nicovideo_Reload_on_error_message
// @namespace			http://d.hatena.ne.jp/wfwjfow/
// @description			エラー時に自動再読み込み
// @include					http://www.nicovideo.jp/watch/*
// @version					0.1.1
// @grant					none
// @downloadURL https://update.greasyfork.org/scripts/16965/nicovideo_Reload_on_error_message.user.js
// @updateURL https://update.greasyfork.org/scripts/16965/nicovideo_Reload_on_error_message.meta.js
// ==/UserScript==

//参考スクリプト
//https://greasyfork.org/ja/scripts/9457-reload-on-error-message/code


/*エラーメッセージのパターン*/
var errors = [];
errors[0] = "サーバーが大変混み合っております";
//errors[1] = "メンテナンス中のため動画の切り替えができません";
//errors[2] = "メンテナンス中のためご利用になれません";
//errors[3] = "動画の切り替えができなくなっております";
//errors[4] = "ログイン状態が解除されている可能性があります";
//errors[5] = "短期間での連続したアクセスがあったため";
//errors[6] = "この動画には切り替えを行うことができません";
//errors[7] = "動画切り替えを行うことができませんでした";
//errors[8] = "この動画はご視聴いただけない状態です";
//errors[9] = "正常にアクセスできませんでした";
//errors[10] = "画面の有効期限が切れました";
//errors[11] = "ログインしてください";
errors[12] = "動画情報の取得に失敗しました";


function check() {

/*エラーメッセージの表示状態*/
	var errorsdisplay = document.getElementsByClassName("translations")[0].style.display;
//document.getElementsByClassName("watchAPIError")[0].textContent.match(reg)
	for(var j=0; j<errors.length; j++) {
		reg = new RegExp(errors[j]);
		if((errorsdisplay!="none")&&(document.getElementsByClassName("busy")[0].textContent.match(reg))||(errorsdisplay!="none")&&(document.getElementsByClassName("need_login")[0].textContent.match(reg))){
			window.location.reload();
		}
	}
}

setInterval(function(){check()},1000);
