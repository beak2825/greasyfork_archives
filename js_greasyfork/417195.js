// ==UserScript==
// @name         dアニメストア 再生ページを新規タブで開く
// @namespace    wonderlife
// @version      1
// @description  dアニメストアの再生ページをポップアップウィンドウではなく新規タブで開くためのスクリプト
// @author       wonderlife
// @match        https://anime.dmkt-sp.jp/animestore/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417195/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%20%E5%86%8D%E7%94%9F%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E6%96%B0%E8%A6%8F%E3%82%BF%E3%83%96%E3%81%A7%E9%96%8B%E3%81%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/417195/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%20%E5%86%8D%E7%94%9F%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E6%96%B0%E8%A6%8F%E3%82%BF%E3%83%96%E3%81%A7%E9%96%8B%E3%81%8F.meta.js
// ==/UserScript==

playDashMovie = function(defaultPlay, contentId, playlistId, playlistIndex, loginParams) {

	// パラメータ設定
	var url = "/animestore/sc_pc?";
	var initParamFlag = true;
	var partId = contentId;

	if (contentId != null && contentId != "") {
		// contentIdが10桁の場合話IDを切り出す
		if (contentId.length == 10) {
			partId = contentId.toString().substr(0,8);
		}
		url += "partId=" + partId;
		initParamFlag = false;
	}
	// playlistIdが設定されていた場合プレイリスト再生
	if (playlistId != null && playlistId != "") {
		if (!initParamFlag) {
			url += "&";
		}
		url += "playlistId=" + playlistId;
		if (playlistIndex != null && playlistIndex != "") {
			url += "&playlistIndex=" + playlistIndex;
		}
	}

	// 途中から再生用再生開始位置(PCでフリーページから途中から再生の場合、作品indexの初期処理(contentIndex_pc.js)で設定済み)
	// 対象の話IDと一致した場合再生開始位置を更新
	if (paramPartId != null && paramPartId == partId && paramStartPosition != null) {
		startPosition = paramStartPosition;
	}

	// 途中から再生用再生開始位置が設定されている場合
	if (startPosition != null && startPosition != "") {
		url += "&startPosition=" + startPosition;
	}

	// 要ログインかを判定
	if (!loginParams) {
		var windowname = "popupwindow";
		window.open(url, windowname);
	} else {
		// 有料話で非会員の場合はログイン画面を表示する
		loginParams.nextUrlC = url;
		window.popupLogin(loginParams, null, true); // forcePopup=trueでポップアップする
	}

	// 途中から再生用再生開始位置を初期化
	startPosition = null;
	paramStartPosition = null;
}