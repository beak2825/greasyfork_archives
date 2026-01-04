// ==UserScript==
// @name ピクトセンス 七六八
// @namespace https://greasyfork.org/users/137
// @version 2.0.1
// @description 『ピクトセンス』において、表示領域の高さが小さい場合でも、必要な情報が表示領域内に入るようにします。
// @author 100の人
// @homepageURL https://greasyfork.org/users/137
// @license CC-BY-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.pictsense.com/*
// @downloadURL https://update.greasyfork.org/scripts/412410/%E3%83%94%E3%82%AF%E3%83%88%E3%82%BB%E3%83%B3%E3%82%B9%20%E4%B8%83%E5%85%AD%E5%85%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/412410/%E3%83%94%E3%82%AF%E3%83%88%E3%82%BB%E3%83%B3%E3%82%B9%20%E4%B8%83%E5%85%AD%E5%85%AB.meta.js
// ==/UserScript==

(function() {
let css = `@namespace url(http://www.w3.org/1999/xhtml);

	/*------------------------------------
		ページ全体
	*/
	#base {
		display: inline-block;
		width: auto !important;
		min-width: 825px !important;    /* 全体の初期幅 */
		margin-left: 175px !important;  /* 左側の広告の幅 */
		margin-right: 175px !important; /* 右側の広告の幅 */
	}
	#gameScreen {
		/* 入室後のページ */
		width: 100vw !important;
		max-width: 1450px !important;   /* キャンバス・パレットの幅 ＋ 全体の初期幅 */
		margin-top: 45px !important;    /* 各設定ボタンの高さ */
		position: relative !important;
		/* 人数が増えた時に参加者名が広告に隠れないように */
		z-index: 1;
	}
	#gameScreen::after {
		/* clearfix */
		content: "";
		display: block;
		clear: both;
	}

	/*------------------------------------
		設定
	*/
	#messageScrollModeSelect,
	#roomDataButton,
	#muteButton,
	#tweetButton,
	#leaveButton,
	#joinButton,
	#gameStartButton {
		position: absolute;
		top: -45px;             /* －（各設定ボタンの高さ） */
	}
	#messageScrollModeSelect {
		/* コメントのマーキーに関する設定 */
		left: 0;
	}
	#roomDataButton {
		/* 「部屋情報」ボタン */
		left: 150px;            /* ボタンの幅 */
		margin-top: 5px !important;
	}
	#muteButton {
		/* 「音声ミュート」ボタン */
		left: 300px;            /* ボタンの幅×2 */
	}
	#tweetButton {
		/* 「部屋をツイート」ボタン */
		left: 450px;            /* ボタンの幅×3 */
	}
	#leaveButton {
		/* 「退室」ボタン */
		left: 600px;            /* ボタンの幅×4 */
	}
	#joinButton,
	#gameStartButton {
		/* 「ゲームに参加する」、または「ゲームスタート」ボタン */
		left: 800px;            /* ボタンの幅×4 ＋ 左マージン */
		margin-top: 5px !important;
	}
	#gameStart > p {
		/* 「ゲームスタート」ボタンの説明文 */
		display: none;
	}

	/*------------------------------------
		残り時間とお題
	*/
	#gameScreenTitle {
		max-width: 825px;       /* 全体の初期幅 */
		position: absolute !important;
		left: 625px;            /* キャンバス・パレットの幅 */
		right: 30px;            /* スクロールバーの幅 */
		text-align: left;
	}
	#countDown {
		/* 残り時間 */
		margin-left: 10px;
		text-align: center;
	}

	/*------------------------------------
		チャット
	*/
	#chatField {
		width: auto !important;
		max-width: 824px;       /* 全体の初期幅 */
		position: absolute;
		top: 42px;              /* お題の高さ */
		left: 625px;            /* キャンバス・パレットの幅 */
		right: 30px;            /* スクロールバーの幅 */
	}

	/*------------------------------------
		コメント送信フォーム
	*/
	#chatForm {
		padding-left: 10px !important;
		text-align: left;
	}
	#chatText {
		/* コメント入力欄 */
		max-width: calc(100% - 100px);  /* コメント送信フォームの幅 － 「回答/発言」ボタンの幅 */
	}
	#chatSubmitButton {
		/* 「回答/発言」ボタン */
		width: auto !important;
	}

	/*------------------------------------
		参加者数・閲覧者数
	*/
	#userListField > h2 {
		position: absolute;
		left: 625px;
		top: 300px;
	}

	/*------------------------------------
		参加者一覧
	*/
	#userList {
		width: auto !important;
		display: block;
		max-width: 825px;       /* 全体の初期幅 */
		position: absolute;
		top: 320px;             /* お題の高さ ＋ チャット欄の高さ + count height */
		left: 625px;            /* キャンバス・パレットの幅 */
		right: 30px;            /* スクロールバーの幅 */
		margin-left: 0 !important;
		border: none !important;
		text-align: left;
	}
	#userList tbody {
		display: block;
	}
	#userList tr {
		/* 参加者 */
		width: 200px;           /* 右カラムの初期幅 */
		display: inline-table;
		margin-right: 4px !important;
		margin-bottom: 4px !important;
	}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
