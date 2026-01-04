// ==UserScript==
// @name		bro3_beyond
// @namespace	bro3_beyond
// @include		https://*.3gokushi.jp/*
// @include		http://*.3gokushi.jp/*
// @description	ブラウザ三国志beyondリメイク by Craford 氏 with RAPT
// @version		1.05

// @grant	GM_addStyle
// @grant	GM_deleteValue
// @grant	GM_getValue
// @grant	GM_listValues
// @grant	GM_log
// @grant	GM_setValue
// @grant	GM_xmlhttpRequest
// @grant	GM_getResourceText
// @require	https://code.jquery.com/jquery-2.1.4.min.js
// @require	https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @resource	jqueryui_css	http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css

// @downloadURL https://update.greasyfork.org/scripts/374963/bro3_beyond.user.js
// @updateURL https://update.greasyfork.org/scripts/374963/bro3_beyond.meta.js
// ==/UserScript==
// version	date
// 0.01		2016/05/**	試験的に着手
// 0.91		2017/07/13	Craford 氏	http://silent-stage.air-nifty.com/steps/2017/07/beyond091.html
//--------------------	以下について、https://gist.github.com/RAPT21?direction=desc&sort=updated で公開しています。
// 0.91.1	2017/07/14	RAPT. 2017/07/12 の大型アップデートに伴い、ツールが動作しなくなっていたのを一部修正
//								デッキ表示小判定の修正、スキル系判定の修正、ついでに内政スキルをホバー時太字にするようにした。
// 0.91.2	2017/07/14	RAPT. 内政スキルが使えていなかったのを修正
// 0.91.3	2017/07/20	RAPT. 資源パネル探索が使えていなかったのを修正
// 0.91.4	2017/07/22	RAPT. トレード画面にクリアボタンを追加
// 0.91.5	2017/08/06	RAPT. 報告書の討伐・攻撃ログのTSV出力機能が動作しない環境があったので対策
// 0.91.6	2017/08/13	RAPT. 内政官をセットして即スキルを使う処理を新方式で対応してみた、少し速くなったかも。
// 0.91.7	2017/08/23	RAPT. 0.91.6 の改修の影響で、スキル検索結果からスキルが使えなくなっていたのを修正。（スキル検索結果からは従来方式でスキルを使います）
// 0.91.8	2017/11/19	RAPT. カードの武将名が上部に移動された影響で、自動スキルレベルアップ合成の「水鏡を素材として使用する」をチェック時に動作しなくなっていたのを修正
// 0.91.9	2017/12/06	RAPT. Google Chrome で動かなくなったらしいので修正
// 0.91.10	2017/12/06	RAPT. 運営のメンテ？にて、Google Chrome で内政スキル使用リンクの追加機能が動作しなくなった問題を修正
// 0.92		2018/01/08	Greasemonkey4で動かない問題を修正
// 0.93		2018/03/05	運営のアップデートにより連続合成、連続副将合成が動かなくなっていた問題を修正。武将図鑑から即完検索ができない問題を修正。名声タイマーをステータス右に移動。一括ラベルセット機能を追加。その他微修正。
// 0.94		2018/07/19	一括出兵に鹵獲モードを追加
// 0.94.1	2018/07/20	RAPT. 2018/07/18 の大型アップデートに伴い、内政官を1クリックでファイルに下げるボタンが表示できなくなっていたのを修正
// 0.96		2018/08/02	スキーム変更に対応
// 1.00 	2018/10/21	リファクタ（デザイン修正、機能整理等）。プロフィール周りの判定修正。本拠地座標保存を恒久化。全体スクロール機能削除。他
// 1.01 	2018/10/29	一斉援軍が動かなくなっていた問題を修正。緊急呼集が内政スキルとみなされていた問題を修正。
// 1.02 	2018/11/14	新兵種鯖対応を追加。報告書整形を新旧鯖どちらでも動くように修正。簡易出品時のレアリティ判定が新兵種鯖で効かない問題修正。
//						デッキの内政スキル発動が新兵種鯖で効かない問題を修正。新兵種鯖ではステータス補正表示を一時無効化。
// 1.03 	2018/11/19	天気情報を画面上の天気バー上に展開するようオプションを追加
// 1.04 	2018/11/21	天気情報をすべてのタブで表示されるように修正。簡易補正情報の表示を追加。設定の位置を移動。
// 1.05 	2018/11/23	一斉出兵が新兵科マップで動かない問題を修正
//
// TODO:
// 内政ボタンで、拠点を変更せずにセットする新方式対応
// 回復系スキルは、空いている拠点で実行するオプション
// 内政ボタン/内政スキルで、すでにその拠点に内政官がいる場合、置き換えるかの確認。「呉の治世」スキル発動中です。内政官を置き換えますか？　はい「いいえ」

// ローカル開発なので、uploadする前に正規バージョンにすること
//----------------------------------------------------------------------
// ロケーションが info.3gokushi.jp の場合はなにもしない
//----------------------------------------------------------------------
if (location.hostname.indexOf("info.3gokushi.jp") >= 0) {
	return;
}

//----------------------------------------------------------------------
// Firefox+GreaseMonkey4ではjQueryとjQuery-uiの読み込み方を変える
//----------------------------------------------------------------------
var ua = window.navigator.userAgent;
if (ua.indexOf("Firefox") > 0 && GM_info.version >= 4) {
	// Firefox + GreaseMonkey4 でGMラッパー関数を動かすための定義
	function initGMWrapper() {
		// @copyright		2009, James Campos
		// @license		cc-by-3.0; http://creativecommons.org/licenses/by/3.0/
		if ((typeof GM_getValue == 'undefined') || (GM_getValue('a', 'b') == undefined)) {
			GM_addStyle = function (css) {
				var style = document.createElement('style');
				style.textContent = css;
				document.getElementsByTagName('head')[0].appendChild(style);
			};
			GM_getValue = function (name, defaultValue) {
				var value;
				value = sessionStorage.getItem(name);
				if (!value) {
					value = localStorage.getItem(name);
					if (!value) {
						return defaultValue;
					}
				}
				var type = value[0];
				value = value.substring(1);
				switch (type) {
				case 'b':
					return value == 'true';
				case 'n':
					return Number(value);
				default:
					return value;
				}
			};
			GM_setValue = function (name, value) {
				value = (typeof value)[0] + value;
				try {
					localStorage.setItem(name, value);
				} catch (e) {
					localStorage.removeItem(name);
					sessionStorage.setItem(name, value);
					throw e;
				}
			};
		}
	}

	// GreaseMonkeyラッパー関数の定義
	initGMWrapper();

	// load jQuery（q$にしているのはtampermonkey対策）
	q$ = $;
	q$.ajax({
		url:'http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/redmond/jquery-ui.min.css',
		success:function(data){
			$('<style></style>').appendTo('head').html(data);
		}
	});
} else {
	// load jQuery
	jQuery.noConflict();
	q$ = jQuery;

	// load jQueryUI css
	var jqueryUICss = GM_getResourceText("jqueryui_css");

	// jquery-ui で404になる画像の設定を除去
	jqueryUICss = jqueryUICss.replace(/ url\("images\/ui-bg_highlight-soft_75_cccccc_1x100.png"\)/, "");
	jqueryUICss = jqueryUICss.replace(/ url\("images\/ui-bg_flat_75_ffffff_40x100.png"\)/, "");
	jqueryUICss = jqueryUICss.replace(/ url\("images\/ui-bg_glass_75_dadada_1x400.png"\)/, "");
	jqueryUICss = jqueryUICss.replace(/ url\("images\/ui-bg_glass_65_ffffff_1x400.png"\)/, "");
	jqueryUICss = jqueryUICss.replace(/ url\("images\/ui-bg_glass_75_e6e6e6_1x400.png"\)/, "");

	// スタイルの適用
	GM_addStyle(jqueryUICss);
}

//----------------------------------------------------------------------
// スクリプト全体で共有する固有定義
//----------------------------------------------------------------------
var SERVER_SCHEME = location.protocol + "//";
var BASE_URL = SERVER_SCHEME + location.hostname;
var SERVER_NAME = location.hostname.match(/^(.*)\.3gokushi/)[1];
var SORT_UP_ICON = BASE_URL + "/20160427-03/extend_project/w945/img/trade/icon_up.gif";
var SORT_DOWN_ICON = BASE_URL + "/20160427-03/extend_project/w945/img/trade/icon_down.gif";
var AJAX_REQUEST_INTERVAL = 200;   // (ms)

//----------------------------------------------------------------------
// 画面設定項目-保存フィールド名対応定数群
//----------------------------------------------------------------------
// 共通タブ
var COMMON_01 = 'co01';		// 資源タイマー
var COMMON_02 = 'co02';		// プルダウンメニューを差し替える
var COMMON_03 = 'co03';		// 天気予告常時表示

// プロフィールタブ
var PROFILE_01 = 'pr01';	// ランキングリンク追加
var PROFILE_02 = 'pr02';	// デュエルの次階級表示
var PROFILE_03 = 'pr03';	// 領地座標を全体地図へのリンクに変換
var PROFILE_04 = 'pr04';	// 領地一覧にソート機能の追加
var PROFILE_05 = 'pr05';	// 領地、NPC座標、NPC取得・隣接情報の検索機能を追加

// 都市タブ
var VILLAGE_01 = 'vi01';	// 兵士生産時間制限
var VILLAGE_02 = 'vi02';	// 兵士生産時間縛りの設定時間

// 全体地図タブ
var MAP_11 = 'ma11';		// 出兵時にデッキ武将を一斉出兵する機能を追加
var MAP_12 = 'ma12';		// 出兵種別初期選択の制御をできる機能を追加
var MAP_13 = 'ma13';		// 鹵獲先座標リスト

// 同盟タブ
var ALLIANCE_01 = 'al01';	// 同盟トップ：同盟ランキングソート機能の追加
var ALLIANCE_02 = 'al02';	// 同盟トップ：同盟ランキング内の自分の位置を着色
var ALLIANCE_03 = 'al03';	// 同盟トップ：同盟補助情報の追加
var ALLIANCE_04 = 'al04';	// 同盟トップ：CSVダウンロード機能を追加
var ALLIANCE_05 = 'al05';	// 同盟トップ：同盟員本拠座標取得機能を追加
var ALLIANCE_11 = 'al11';	// 同盟ログ：自動整形機能の追加
var ALLIANCE_12 = 'al12';	// 同盟ログ：損害率表示列の追加
var ALLIANCE_13 = 'al13';	// 同盟ログ：ログ検索機能の追加
var ALLIANCE_21 = 'al21';	// 同盟掲示板：発言順序を逆順（＝最新記事が一番上になるよう）にする
var ALLIANCE_31 = 'al31';	// 管理：離反ラジオボタンを選択不可能にする
var ALLIANCE_41 = 'al41';	// 配下管理：配下検索機能の追加

// デッキタブ
var DECK_01 = 'de01';		// 共通：パッシブスキルの着色
var DECK_02 = 'de02';		// 共通：トレードへのリンクを追加
var DECK_03 = 'de03';		// 共通：ページ切り替えのプルダウンを追加
var DECK_11 = 'de11';		// デッキ：ファイル内スキル検索機能の追加
var DECK_12 = 'de12';		// デッキ：スキル補正効果表示機能の追加
var DECK_13 = 'de13';		// デッキ：内政スキル使用リンクの追加（回復：赤、内政：青）
var DECK_14 = 'de14';		// デッキ：1クリックデッキセットボタン追加
var DECK_15 = 'de15';		// デッキ：ファイルに下げるボタンを1クリックで使用に変更
var DECK_16 = 'de16';		// デッキ：内政官を1クリックでファイルに下げるボタンを追加
var DECK_17 = 'de17';		// デッキ：内政官以外を1クリックで全てファイルに下げるボタンを追加
var DECK_18 = 'de18';		// デッキ：一括デッキセット機能を追加
var DECK_19 = 'de19';		// デッキ：内政官解除後にデッキを更新する
var DECK_1A = 'de1a';		// デッキ：内政スキル使用後画面を強制更新する
var DECK_1B = 'de1b';		// デッキ：一括ラベルセット機能を追加
var DECK_21 = 'de21';		// 領地一覧：領地一覧のソートに取得順を追加
var DECK_22 = 'de22';		// 領地一覧：「新領地」で始まる領地を全て破棄
var DECK_31 = 'de31';		// 修行合成でレベルが上がった時に、レベルアップボタンを追加
var DECK_32 = 'de32';		// 自動スキルレベルアップ合成機能を追加
var DECK_33 = 'de33';		// スキルレベルアップ合成画面でベースカードの交換機能を追加
var DECK_34 = 'de34';		// 合成画面のボタン説明表示を消す
var DECK_35 = 'de35';		// 自動副将枠解放合成機能を追加
var DECK_51 = 'de51';		// 兵士管理リンクをクリックした際の初期タブを「全て表示」にする
var DECK_61 = 'de61';		// スキル3つ以上、レベル50、スコア100万のいずれかに該当するカードを倉庫へ移動できなくする

// 報告書タブ
var REPORT_01 = 're01';		// 自動整形機能の追加
var REPORT_02 = 're02';		// 損害率表示列の追加
var REPORT_11 = 're11';		// 討伐・攻撃ログのTSV出力機能の追加

// 書簡タブ
var NOTE_01 = 'no01';		// 開封補助機能の追加
var NOTE_02 = 'no02';		// gyazo自動展開

// トレードタブ
var TRADE_01 = 'tr01';		// 一覧上にページ切り替えリンクを追加
var TRADE_02 = 'tr02';		// レアリティ固定ボタンの追加
var TRADE_03 = 'tr03';		// 合成効率表示機能の追加
var TRADE_04 = 'tr04';		// トレード・武将図鑑へのリンクを追加
var TRADE_05 = 'tr05';		// 簡易落札ボタンを追加
var TRADE_06 = 'tr06';		// 強制公開期限の日付で色を変える
var TRADE_07 = 'tr07';		// 落札まで24時間を超える入札リンクを消す
var TRADE_11 = 'tr11';		// 出品中：自動出品リンク作成機能を追加
var TRADE_12 = 'tr12';		// 出品中：推定収入・手数料表示を追加
var TRADE_13 = 'tr13';		// 出品中：収入期待値表示を追加
var TRADE_21 = 'tr21';		// 入札中：リンクURLからの自動入札機能を追加
var TRADE_31 = 'tr31';		// 出品：パッシブスキル着色
var TRADE_32 = 'tr32';		// 出品：トレードへのリンクを追加
var TRADE_33 = 'tr33';		// 出品：即時落札価格確認ボタンを追加
var TRADE_34 = 'tr34';		// 出品：簡易出品機能を追加
var TRADE_35 = 'tr35';		// 出品：固定額出品ボタンを追加
var TRADE_36 = 'tr36';		// 出品：出品カードがR以上のとき警告する
var TRADE_37 = 'tr37';		// 出品値の初期値（テキストボックス）
var TRADE_38 = 'tr38';		// 出品値の初期値（固定出品ボタン1）
var TRADE_39 = 'tr39';		// 出品値の初期値（固定出品ボタン2）
var TRADE_3A = 'tr3A';		// 出品値の初期値（固定出品ボタン3）
var TRADE_41 = 'tr41';		// トレード履歴で、当日9:30-10:30落札分のみ背景色を変える

// ブショーダスタブ
var BUSYODAS_01 = 'bu01';	// 出品機能を追加
var BUSYODAS_02 = 'bu02';	// 簡易出品ボタンを追加
var BUSYODAS_11 = 'bu11';	// 武将カード入手履歴：トレード・武将図鑑へのリンクを追加

// 図鑑タブ
var BOOK_01 = 'bo01';		// 武将図鑑：トレードへのリンクを追加
var BOOK_02 = 'bo02';		// 武将図鑑：即時落札価格確認・簡易落札ボタンを追加
var BOOK_11 = 'bo11';		// スキル図鑑：トレードへのリンクを追加
var BOOK_99 = 'bo99';		// 武将図鑑：スキル補正効果表示機能の追加（新カード検証用）

// その他タブ
var ANY_01 = 'an01';		// レイド：右メニューにショートカットを追加
var ANY_02 = 'an02';		// 個人掲示板の領地座標をリンクに変換

//----------------------------------------------------------------------
// グローバル変数群
//----------------------------------------------------------------------
// オプション設定管理用
var g_beyond_options;
var g_history_mode;

// イベント駆動制御用
var g_event_process = false;

// リソースタイマー
var g_res_timer = null;

// 共通スタイルの設定
addGlobalStyles();

//----------------------------------------------------------------------
// スタイル設定
//----------------------------------------------------------------------
function addGlobalStyles() {
	// CSS定義（メニューのプルダウンについては次を参考にした：http://theorthodoxworks.com/web-design/drop-down-menu-multi-css/）
	var css = "\
		<!-- プルダウンメニュー用css --> \
		.menu { \
			position: relative; \
			width: 100%; \
			height: 10px; \
			margin: 0; \
			z-index: 9901; \
		} \
		.menu > li { \
			float: left; \
			width: 105px; \
			height: 10px; \
			background-image: url('/20160714-01/extend_project/w945/img/menu_mark.jpg'); \
			z-index: 9902; \
		} \
		.menu > li a { \
			display: block; \
			color: #fff; \
		} \
		.menu > li a:hover { \
			color: #000; \
			background-color: #fff; \
		} \
		.menu > li div { \
			display: block; \
			color: #fff; \
			text-decoration: underline; \
		} \
		.menu > li div:hover { \
			color: #000; \
			background-color: #fff; \
			text-decoration: underline; \
		} \
		ul.second { \
			visibility: hidden; \
			width: auto; \
			opacity: 0; \
			z-index: 1; \
		} \
		ul.third { \
			width: auto; \
			visibility: hidden; \
			opacity: 0; \
		} \
		ul.fourth { \
			width: auto; \
			visibility: hidden; \
			opacity: 0; \
		} \
		ul.fifth { \
			width: auto; \
			visibility: hidden; \
			opacity: 0; \
		} \
		.menu > li:hover { \
			-webkit-transition: all .5s; \
			transition: all .5s; \
		} \
		.second li { \
			font-size: 12px; \
			margin-left: 2px; \
			border-top: 1px solid #111; \
		} \
		.third li { \
			font-size: 12px; \
			margin-left: 2px; \
			border-top: 1px solid #111; \
		} \
		.fourth li { \
			font-size: 12px; \
			margin-left: 2px; \
			border-top: 1px solid #111; \
		} \
		.menu:before, \
		.menu:after { \
			content: ' '; \
			display: table; \
		} \
		.menu:after { \
			clear: both; \
		} \
		.menu { \
			*zoom: 1; \
		} \
		.menu > li.multi { \
			position: relative; \
		} \
		li.multi ul.second { \
			position: absolute; \
			top: 10px; \
			width: 100%; \
			background: #222; \
			-webkit-transition: all .2s ease; \
			transition: all .2s ease; \
		} \
		li.multi:hover ul.second { \
			top: 10px; \
			visibility: visible; \
			opacity: 1; \
		} \
		li.multi ul.second li { \
			position: relative; \
		} \
		li.multi ul.second li ul.third { \
			position: absolute; \
			top: -1px; \
			left: 100%; \
			width: 100%; \
			background: #222; \
			-webkit-transition: all .2s ease; \
			transition: all .2s ease; \
		} \
		li.multi ul.second li:hover ul.third { \
			visibility: visible; \
			opacity: 1; \
		} \
		li.multi ul.second li ul.third li { \
			position: relative; \
		} \
		li.multi ul.second li ul.third li ul.fourth { \
			position: absolute; \
			top: -1px; \
			left: 100%; \
			width: 100%; \
			background: #222; \
			-webkit-transition: all .2s ease; \
			transition: all .2s ease; \
		} \
		li.multi ul.second li ul.third li:hover ul.fourth { \
			visibility: visible; \
			opacity: 1; \
		} \
		li.multi ul.second li ul.third li ul.fourth li { \
			position: relative; \
		} \
		li.multi ul.second li ul.third li ul.fourth ul.fifth { \
			position: absolute; \
			top: -1px; \
			left: 100%; \
			width: 100%; \
			background: #222; \
			-webkit-transition: all .2s ease; \
			transition: all .2s ease; \
		} \
		li.multi ul.second li ul.third li ul.fourth li:hover ul.fifth { \
			visibility: visible; \
			opacity: 1; \
		} \
		.init-right:after { \
			content: ''; \
			display: inline-block; \
			width: 6px; \
			height: 6px; \
			margin: 0 0 0 15px; \
			border-right: 1px solid #fff; \
			border-top: 1px solid #fff; \
			-webkit-transform: rotate(45deg); \
			-ms-transform: rotate(45deg); \
			transform: rotate(45deg); \
		} \
		<!-- 色定義 --> \
		.red { \
			color: red; \
		} \
		.green { \
			color: green; \
		} \
		.darkgreen { \
			color: darkgreen; \
		} \
		.pointer { \
			cursor: pointer; \
		} \
		.bold-red { \
			color: red; \
			font-weight: bold; \
		} \
		.skb { \
			cursor: pointer; \
			text-decolation: underline; \
			color: blue; \
		} \
		.skr { \
			cursor: pointer; \
			text-decolation: underline; \
			color: red; \
		} \
		.skb:hover { \
			font-weight: bold; \
		} \
		.skr:hover { \
			font-weight: bold; \
		} \
		.m4l { \
			margin-left: 4px; \
		} \
		.app-lnk { \
			cursor: pointer; \
			text-decolation: underline; \
			color: #09c; \
			margin-right: 12px; \
		} \
		fieldset.rad-box { \
			-moz-border-radius:5px; \
			border-radius: 5px; \
			-webkit-border-radius: 5px; \
			margin-bottom:6px; \
			border: 2px solid black; \
			text-align: center; \
		} \
		div.roundbox { \
			-moz-border-radius:3px; \
			border-radius: 3px; \
			-webkit-border-radius: 3px; \
			margin-bottom:6px; \
			border: 2px solid #009; \
			position: absolute; \
			z-index:9999; \
			background-color: white; \
		}\
		.tpad { \
			border: 1px solid black; \
			padding: 2px; \
			white-space: nowrap; \
		} \
	";

	GM_addStyle(css);
}

//----------------------------------------------------------------------
// メインルーチン
//----------------------------------------------------------------------
(function() {
	// 実行判定
	if (isExecute() === false) {
		return;
	}

//console.log(location.pathname);

	// 設定のロード
	loadBeyondSettings();

	// 全体共通
	execCommonPart();

	// プロフィール画面
	if (location.pathname === "/user/" || location.pathname === "/user/index.php") {
		profileControl();
	}

	// 都市タブ
	villageTabControl();

	// 全体地図タブ
	mapTabControl();

	// 同盟タブ
	allianceTabControl();

	// デッキタブ
	deckTabControl();

	// 報告書タブ
	reportTabControl();

	// 書簡タブ
	messageTabControl();

	// 建設・内政系
	internalControl();

	// 出兵画面
	troopControl();

	// ブショーダス
	busyodasControl();

	// 武将図鑑
	cardbookControl();

	// スキル図鑑
	skillbookControl();

	// その他
	anyControl();

	// リソースタイマー
	execResourceTimer();
})();

//----------------------------------------------------------------------
// プロフィール画面の実行制御
//----------------------------------------------------------------------
function profileControl() {
	// 他人のプロフィールならtrue
	if (q$(location).attr('search').length > 0) {
		return;
	}

	// beyond設定リンクの作成
	q$("ul[id=statMenu]").eq(1).children("li[class='last']").after(
		"<li class='last'><a href='#' id='beyond_setting' class='darkgreen'>beyond設定</a></li>"
	).attr('class', '');

	// beyond設定画面の描画
	draw_setting_window(q$("ul[id=statMenu]").eq(1));

	// beyond設定リンクのクリックイベント
	q$("#beyond_setting").on('click',
		function() {
			if (q$("#beyond_setting_view").css('display') == 'none' ) {
				// 設定のロード
				loadBeyondSettings();

				// 保存されているoption設定を設定画面に反映
				for (var key in g_beyond_options) {
					if (q$("#" + key).length > 0) {
						// チェックボックスの場合、チェックのオンオフを再現
						if (q$("#" + key).attr('type') === 'checkbox') {
							q$("#" + key).prop('checked', g_beyond_options[key]);
						} else if (q$("#" + key).attr('type') === 'text') {
							q$("#" + key).val(g_beyond_options[key]);
						}
					}
				}

				q$("#beyond_setting_view").css('display', '');
			} else {
				q$("#beyond_setting_view").css('display', 'none');
			}
		}
	);

	// 同盟ランキング着色用のユーザー名記録
	if (g_beyond_options[ALLIANCE_02]) {
		var username = q$("#gray02Wrapper table[class='commonTables'] tbody tr").eq(1).children("td").eq(1).text().replace(/[ \t\r\n]/g, "");
		GM_setValue(SERVER_NAME + '_username', username);
	}

	// テーブルエレメントアクセス用の変数
	var selector_path = "#gray02Wrapper table[class='commonTables'] tr";
	var elem = q$(selector_path);
	
	// デュエルランク情報追加（ダイレクトリンク作成前に行う）
	if (g_beyond_options[PROFILE_02] == true) {
		var dpindex = -1;
		elem.each(function(i) {
			if (i <= 3 || i >= 9) return;
			var items = q$(this).children("td");
			items.each(function() {
				var text = q$(this).html().trim();
				if (text === "DP") {
					dpindex = i;
					return;
				}
			});
		});

		if (dpindex > 0) {
			var duels = [
				['入門', 100], ['駆け出し', 200], ['初心者', 400], ['中級心得', 700], ['中級者', 1100], ['上級心得', 1600], ['上級者', 2300],
				['熟練心得', 3000], ['熟練', 3800], ['練達', 4800], ['指導者', 5800], ['練士補', 6900], ['練士', 8200],
				['師範代', 9500], ['師範', 11000], ['準名人', 13000], ['名人', 15500], ['準達人', 18500], ['達人', 22500], ['覇王', 28000], ['天覇王', 35000]
			];
			var dp = elem.eq(dpindex).children("td").eq(1).text();
			var next = -1;
			for (var i = 0; i < duels.length; i++) {
				if (dp < duels[i][1]) {
						next = i;
						break;
				}
			}
			if (next >= 0) {
				elem.eq(dpindex).children("td").eq(1).append(
					"<div class='bold-red'>Next:" + (duels[next][1] - dp) + "</div>"
				);
				elem.eq(dpindex).children("td").eq(3).append(
					"<div class='bold-red'>Next:" + (duels[next][0]) + "</div>"
				);
			}
		}
	}

	// ランキングへのダイレクトリンク追加
	if (g_beyond_options[PROFILE_01]) {
		var flowlist = [
			['同盟', '/alliance/list.php'],
			['総合', '/user/ranking.php'],
			['総人口', '/user/ranking.php?m=population'],
			['攻撃', '/user/ranking.php?m=attack'],
			['防御', '/user/ranking.php?m=defense'],
			['撃破スコア', '/user/ranking.php?m=attack_score'],
			['防衛スコア','/user/ranking.php?m=defense_score'],
			['DP', '/user/ranking.php?m=duel']
		];
		
		elem.each(function(i) {
			if (i <= 3 || i >= 9) return;
			var items = q$(this).children("td");
			items.each(function() {
				var text = q$(this).html().trim();
				for (var i = 0; i < flowlist.length; i++) {
					if (text !== flowlist[i][0]) {
						continue;
					}
					q$(this).html("<a href='" + BASE_URL + flowlist[i][1] + "' target='blank'>" + flowlist[i][0] + "</a>")
				}
			});
		});
	}

	// 領地一覧の座標を全体地図へのリンクに変換
	var startpos = 18 + (elem.eq(18).children("th").length > 0) * 1;
	if (g_beyond_options[PROFILE_03]) {
		for (var i = startpos; i < elem.length; i++) {
			var match = elem.eq(i).children("td").eq(1).text().match(/([-]*[0-9]*),([-]*[0-9]*)/);
			if (!match) {
				continue;
			}
			elem.eq(i).children("td").eq(1).html(
				"<a href='" + BASE_URL + "/map.php?x=" + match[1] + "&y=" + match[2] + "' target='_blank'>(" + match[0] + ")</a>"
			);
		}
	}

	// 領地一覧のテーブルソートを追加
	if (g_beyond_options[PROFILE_04]) {
		// ソーターアイコンの追加
		elem.eq(startpos - 1).children("th").each(
			function(index) {
				// 人口列はソートをつけない
				if (index === 2) {
					return;
				}

				// ソートアイコン追加
				q$(this).append(
					"<span style='margin-left: 4px; margin-right: 4px; cursor: pointer;'>" +
						"<img id='lowersort_" + index + "' src='" + SORT_UP_ICON + "' title='低い順に並び替え' alt='低い順に並び替え'></img>" +
					"</span>" +
					"<span class='pointer'>" +
						"<img id='uppersort_" + index + "' src='" + SORT_DOWN_ICON + "' title='高い順に並び替え' alt='高い順に並び替え'></img>" +
					"</span>"
				);

				// 自分の領地の場合のみ、領地取得順ソートを追加
				if (index === 0) {
					q$(this).append(
						"<span class='m4l'>（領地取得順" +
							"<span style='margin-left: 4px; margin-right: 4px; cursor: pointer;'>" +
								"<img id='lowersort_obtained' src='" + SORT_UP_ICON + "' title='低い順に並び替え' alt='低い順に並び替え'></img>" +
							"</span>" +
							"<span class='pointer'>" +
								"<img id='uppersort_obtained' src='" + SORT_DOWN_ICON + "' title='高い順に並び替え' alt='高い順に並び替え'></img>" +
							"</span>" +
						"）</span>"
					);
				}
			}
		);

		// 拠点はソート対象外にするため、位置を調査
		var pos = startpos;
		for (var i = startpos; i < elem.length; i++) {
			if (isNaN(parseInt(elem.eq(i).children("td").eq(2).text()))) {
				break;
			}
			pos ++;
		}

		var sorter_length = elem.eq(startpos - 1).children("th").length;
		for (var i = 0; i < sorter_length; i++) {
			// 昇順ソートイベント
			q$("#lowersort_" + i).on('click',
				{selector: selector_path, offset: pos, index: i, order_ascend: true},
				function(param) {
					tableSorter(param.data.selector, param.data.offset, param.data.index, param.data.order_ascend);
				}
			);

			// 降順ソートイベント
			q$("#uppersort_" + i).on('click',
				{selector: selector_path, offset: pos, index: i, order_ascend: false},
				function(param) {
					tableSorter(param.data.selector, param.data.offset, param.data.index, param.data.order_ascend);
				}
			);
		}

		// 領地取得順昇順ソートイベント
		var func = function(a) {
			var match = a.children('a').attr('href').match(/village_id=([0-9]*)/);
			return match[1];
		};
		q$("#lowersort_obtained").on('click',
			{selector: selector_path, offset: pos, index: 0, order_ascend: true},
			function(param) {
				tableSorter(param.data.selector, param.data.offset, param.data.index, param.data.order_ascend, func);
			}
		);

		q$("#uppersort_obtained").on('click',
			{selector: selector_path, offset: pos, index: 0, order_ascend: false},
			function(param) {
				tableSorter(param.data.selector, param.data.offset, param.data.index, param.data.order_ascend, func);
			}
		);
	}

	// 資源、NPC隣接検索ツールの追加
	if (g_beyond_options[PROFILE_05]) {
		// 資源、NPC隣接検索ツールリンクの作成
		q$("ul[id=statMenu]").eq(1).children("li[class='last']").after(
			"<li class='last'><a href='#' id='search_resource_setting' class='darkgreen'>資源・NPC探索設定</a></li>"
		).attr('class', '');

		q$("#gray02Wrapper").css('position', 'relative').append(
			"<div id='search_resource' class='roundbox' style='display: block; position: absolute; top: 92px; display: none;'>" +
				"<div style='margin: 4px; font-weight: bold; font-size: 12px; color: #009;'>" +
					"<span style='font-weight: bold;'>資源・NPC探索</span>" +
				"</div>" +
				"<div id='search_resource_tabs' style='margin: 4px; font-size:12px;'>" +
					"<ul>" +
						"<li><a href='#tab-search-resource'>資源パネル探索</a></li>" +
						"<li><a href='#tab-search-npc'>NPC座標・NPC隣接同盟探索</a></li>" +
					"</ul>" +
					"<div id='tab-search-resource'>" +
						"<div>" +
							"<div style='font-weight: bold; color: red;'>マップ探索範囲" +
								"<span id='count_info'></span>" +
							"</div>" +
							"<div style='margin-left: 4px;'>" +
								"<span style='font-weight: bold;'>(</span>" +
								"<input id='posx1' type=text size=5 style='margin-left:4px; margin-right: 4px;'>" +
								"<span style='font-weight: bold;'>,</span>" +
								"<input id='posy1' type=text size=5 style='margin-left:4px; margin-right: 4px;'>" +
								"<span style='font-weight: bold;'>) - (</span>" +
								"<input id='posx2' type=text size=5 style='margin-left:4px; margin-right: 4px;'>" +
								"<span style='font-weight: bold;'>,</span>" +
								"<input id='posy2' type=text size=5 style='margin-left:4px; margin-right: 4px;'>" +
								"<span style='font-weight: bold;'>)</span>" +
							"</div>" +
						"</div>" +
						"<div>" +
							"<div style='font-weight: bold; color: red; font-size: 12px;'>探索する資源パネル</div>" +
							"<input type='button' value='追加' id='search_panel_append'>" +
							"<div style='margin-left: 8px;' id='search_panels'></div>" +
						"</div>" +
						"<div>" +
							"<input type='checkbox' id='search_empty' checked>" +
								"<label for='search_empty'>空き地のみ探索</label>" +
							"</input>" +
							"<input type='checkbox' id='search_event' style='margin-left: 6px;'>" +
								"<label for='search_event'>イベント鯖マップ探索</label>" +
							"</input>" +
						"</div>" +
						"<div style='width: 670px;'>" +
							"<input type='button' value='探索実行' id='search_resource_exec'></input>" +
							"<span id='resource_search_info' style='margin-left: 8px; color: red; font-weight: bold;'>探索範囲が広い場合時間がかかります。ご注意ください！</span>" +
						"</div>" +
						"<div>" +
							"<textarea id='result_box' cols='90' rows='10' style='overflow: auto; display: block;'></textarea>" +
						"</div>" +
						"<br><input id='close_result' type='button' value='閉じる'></input>" +
					"</div>" +
					"<div id='tab-search-npc'>" +
						"<div>" +
							"<div style='font-weight: bold; color: red;'>マップ探索範囲" +
								"<span id='count_info'></span>" +
							"</div>" +
							"<div style='margin-left: 4px;'>" +
								"<span style='font-weight: bold;'>(</span>" +
								"<input id='posx1' type=text size=5 style='margin-left:4px; margin-right: 4px;'>" +
								"<span style='font-weight: bold;'>,</span>" +
								"<input id='posy1' type=text size=5 style='margin-left:4px; margin-right: 4px;'>" +
								"<span style='font-weight: bold;'>) - (</span>" +
								"<input id='posx2' type=text size=5 style='margin-left:4px; margin-right: 4px;'>" +
								"<span style='font-weight: bold;'>,</span>" +
								"<input id='posy2' type=text size=5 style='margin-left:4px; margin-right: 4px;'>" +
								"<span style='font-weight: bold;'>)</span>" +
							"</div>" +
						"</div>" +
						"<div>" +
							"<div style='font-weight: bold; color: red; font-size: 12px;'>NPC調査対象</div>" +
							"<div style='margin-left: 8px;'>" +
								"<div>" +
									"<input type='radio' name='search_npc_target' value='pos'>" +
										"<label for='search_pos'>NPC座標（こちらの探索は時間がかかります）</label>" +
									"</input>" +
								"</div>" +
								"<div>" +
									"<input type='radio' name='search_npc_target' value='neighbor' checked>" +
										"<label for='search_neighbor'>NPCの隣接同盟（NPC座標リストが必要です）</label>" +
									"</input>" +
								"</div>" +
							"</div>" +
						"</div>" +
						"<div>" +
							"<div style='font-weight: bold; color: red; font-size: 12px;'>NPC座標リスト（座標探索しない場合は貼り付けが必要です）</div>" +
							"<textarea style='margin-left: 8px;' id='npc_box' rows='10' cols='90'></textarea>" +
						"</div>" +
						"<div>" +
							"<input type='checkbox' id='search_event_npc' style='margin-left: 6px;'>" +
								"<label for='search_event'>イベント鯖マップ探索</label>" +
							"</input>" +
						"</div>" +
						"<div>" +
							"<input type='button' value='探索実行' id='search_npc_exec'></input>" +
							"<span id='npc_search_info' style='margin-left: 8px; color: red; font-weight: bold;'>探索範囲が広い場合時間がかかります。ご注意ください	！</span>" +
						"</div>" +
						"<div>" +
							"<textarea id='result_npc_box' cols='90' rows='10' style='overflow: auto; display: block;'></textarea>" +
						"</div>" +
						"<br><input id='close_result' type='button' value='閉じる'></input>" +
					"</div>" +
				"</div>" +
			"</div>"
		);

		// 運営のcssを無効化
		q$("#search_resource_tabs li").css({'padding':'0px', 'min-width':'0px'});
		q$("#search_resource_tabs li a").css({'background':'none'});
		q$("#search_resource_tabs div label").css({'font-size':'12px', 'margin-left':'4px', 'vertical-align':'0.2em'});
		q$("div[id*='tab-search-'] div").css({'padding':'2px'});

		// タブを有効化
		q$("#search_resource_tabs").tabs();

		// 処理制御変数
		var stop = false;
		var wait = false;

		// タイマー変数
		var npc_timer = null;
		var search_resource_timer = null;

		// 資源、NPC隣接検索ツール有効化
		q$("#search_resource_setting").on('click',
			function() {
				if (q$("#search_resource").css('display') == 'none') {
					q$("#search_resource").css('display', '');
				} else {
					stop = true;
					q$("#search_resource").css('display', 'none');
				}
			}
		);

		// 探索資源パネル追加ボタン
		q$("#search_panel_append").on('click', function() {
			var ct = q$("div[id*='search_panel_box_']").length;
			if (ct >= 5) {
				alert("同時に探索できる資源パネルの枚数は5種類までです");
				return;
			}
			var obj = q$("#search_panels").append(
				"<div id='search_panel_box'>" +
					"<input type='button' value='削除'></input>" +
					"<span style='margin-left: 4px;'>レベル</span>" +
					"<select style='margin-left: 4px;'>" +
						"<option value='1'>★1</option>" +
						"<option value='2'>★2</option>" +
						"<option value='3'>★3</option>" +
						"<option value='4'>★4</option>" +
						"<option value='5'>★5</option>" +
						"<option value='6'>★6</option>" +
						"<option value='7'>★7</option>" +
						"<option value='8'>★8</option>" +
						"<option value='9'>★9</option>" +
					"</select>" +
					"<span style='margin-left: 8px;'>資源数</span>" +
					"<div style='display: inline-block'>" +
						"<span style='margin-left: 4px; margin-right: 2px;' for='xx1'>" +
							"木" +
						"</label>" +
						"<input type='text' size='2'></input>" +
						"<span style='margin-left: 4px; margin-right: 2px;' for='xx1'>" +
							"石" +
						"</label>" +
						"<input type='text' size='2'></input>" +
						"<span style='margin-left: 4px; margin-right: 2px;' for='xx1'>" +
							"鉄" +
						"</label>" +
						"<input type='text' size='2'></input>" +
						"<span style='margin-left: 4px; margin-right: 2px;' for='xx1'>" +
							"糧" +
						"</label>" +
						"<input type='text' size='2'></input>" +
					"</div>" +
				"</div>"
			);

			// 削除ボタン制御
			q$("input[type='button']", obj).on('click',
				function() {
					q$(this).parent().remove();
				}
			);
		});

		// イベント定義（座標入力欄）
		q$("div[id*='tab-search-'] input[id*='pos']").on('change',
			function() {
				var base = q$(this).parent().parent();
				var result = checkRange(base);
				q$("#count_info", base).text('（推定マップ探索枚数: ' + result.ct + ', 推定所要時間: 約' + parseInt(result.ct / 60 + 1) + '分）');
			}
		);

		// 入力範囲のチェック
		function checkRange(element) {
			var x1 = parseInt(q$("#posx1", element).val());
			var y1 = parseInt(q$("#posy1", element).val());
			var x2 = parseInt(q$("#posx2", element).val());
			var y2 = parseInt(q$("#posy2", element).val());
			if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
				return null;
			}

			// x1 < x2 となるよう座標交換
			if (x1 > x2) {
				var sw = x2;
				x2 = x1;
				x1 = sw;
			}

			// y1 < y2 となるよう座標交換
			if (y1 > y2) {
				var sw = y2;
				y2 = y1;
				y1 = sw;
			}

			if (x1 < -900) {
				x1 = -900;
			}
			if (x2 > 900) {
				x2 = 900;
			}
			if (y1 < -900) {
				y1 = -900;
			}
			if (y2 > 900) {
				y2 = 900;
			}

			var sizex = Math.abs(x2 - x1) + 1 - 10 * 2;
			var sizey = Math.abs(y2 - y1) + 1 - 10 * 2;
			var mapct = (Math.floor(sizex / 21) + 2) * (Math.floor(sizey / 21) + 2);

			return {x1: x1, y1: y1, x2: x2, y2: y2, ct: mapct};
		}

		// 資源探索
		q$("#search_resource_exec").on('click',
			function() {
				if (q$(this).val() == '探索を中止') {
					stop = true;
					return;
				}

				if (g_event_process) {
					alert("NPCの検索処理が実行中です");
					return;
				}

				var base = q$("#tab-search-resource");

				// 範囲指定が行われているかチェック
				var result = checkRange(base);
				if (result == null) {
					alert('探索範囲を指定してください。');
					return;
				}

				// 検索条件が指定されているかチェック
				var search_target = q$("div[id='search_panel_box']");
				if (search_target.length == 0) {
					alert('検索する領地が設定されていません。');
					return;
				}

				// イベント制御
				g_event_process = true;

				// ボタン名変更
				q$(this).val('探索を中止');

				// 空き地検索
				var search_empty = q$("#search_empty").prop('checked');

				// イベント検索
				var search_event = q$("#search_event").prop('checked');

				var targets = [];
				for (var i = 0; i < search_target.length; i++) {
					var inputs = search_target.eq(i).find('input');
					var target = [];
					for (var j = 1; j < inputs.length; j++) {
						var num = parseInt(inputs.eq(j).val());
						if (isNaN(num)) {
							return;
						}
						target.push(num);
					}

					targets.push({
						level: q$("select option:selected", search_target.eq(i)).val(),
						wood: target[0], stone: target[1], iron: target[2], food: target[3]
					});
				}

				var matches = [];
				for (var i = 0; i < targets.length; i++) {
					var matchstr = "'" + '★'.repeat(targets[i].level) +
									"', '.*', '" + targets[i].wood +
									"', '" + targets[i].stone +
									"', '" + targets[i].iron +
									"', '"	+ targets[i].food + "', '', '0', \\w+\\); over";
					var reg = new RegExp(matchstr);
					matches.push(reg);
				}

				q$("#result_box").val("高速化のため、検出中のデータは最後に表示します");
				var sx = result.x1;
				var sy = result.y1;

				var list = new Array();
				list.push("★\t領地タイプ\tX座標\tY座標\t所有同盟\t所有者");
				var listcnt = 0;
				var count = 1;
				wait = false;
				var search_resource_func = function() {
					if (stop) {
						q$("#result_box").val(list.join("\t"));
						clearInterval(search_resource_timer);
						q$("#search_resource_exec").val('探索実行');
						stop = false;
						g_event_process = false;
						alert("探索を中止しました");
						return;
					}

					if (wait) {
						return;
					}

					q$("#resource_search_info").text("マップ探索中(" + count + ") 中心座標(" + sx + "," + sy + ") ヒット数:" + listcnt);
					count += 1;

					wait = true;

					var loc = {'x':sx, 'y':sy, 'type':5};
					q$.ajax({
						url: BASE_URL + '/map.php',
						type: 'GET',
						datatype: 'html',
						cache: false,
						data: loc
					})
					.done(function(res) {
						var resp = q$("<div>").append(res);
						var area = q$("#mapOverlayMap area", resp);
						for (var i = 0; i < area.length; i++) {
							var index = -1;
							for (var j = 0; j < matches.length; j++) {
								if (q$(area[i]).attr("onmouseover").match(matches[j]) != null) {
									index = j;
									break;
								}
							}
							if (index == -1) {
								continue;
							}

							// 一致検索
							var match;
							if (search_event == false) {
							//	match = q$(area[i]).attr("onmouseover").match(/rewrite\('.*', '(.*)', '.*', '(.*)', '(.*)', '[★]+', '.*', '(\d+)', '(\d+)', '(\d+)', '(\d+)', '', '.*'\); over.*$/);
								match = q$(area[i]).attr("onmouseover").match(/rewriteAddRemoving\('\d+','.*', '(.*)', '.*', '(.*)', '(.*)', '[★]+', '.*', '(\d+)', '(\d+)', '(\d+)', '(\d+)', '', '(\d+)', \w+\); over.*$/);
							} else {
								match = q$(area[i]).attr("onmouseover").match(/rewritePF\(.*,'.*', '(.*)', '.*', '(.*)', '(.*)', '[★]+', '.*', '(\d+)', '(\d+)', '(\d+)', '(\d+)', '', '.*'\); over.*$/);
							}

							if (match == null) {
								clearInterval(timer);
								q$("#search_resource_exec").text("探索中断");
								stop = false;
								g_event_process = false;
								alert("マップデータの形式が変わりました。探索できません。");
								return;
							}

							// 空き地検索で所持者がいる場合除外
							if (match[1] != '' && search_empty == true) {
								continue;
							}

							// 範囲外の座標の場合除外
							var pos = match[2].match(/([-]*\d+),([-]*\d+)/);
							if (parseInt(pos[1]) < result.x1 || parseInt(pos[1]) > result.x2) {
								continue;
							}
							if (parseInt(pos[2]) < result.y1 || parseInt(pos[2]) > result.y2) {
								continue;
							}
							if (match[3] == '') {
								match[1] = '-';
								match[3] = '-';
							}

							// 結果生成
							list.push(
								"★" + targets[index].level +
								"\t" +
								"(" + targets[index].wood +
								"," + targets[index].stone +
								"," + targets[index].iron +
								"," + targets[index].food + ")" +
								"\t" + parseInt(pos[1]) +
								"\t" + parseInt(pos[2]) +
								"\t" + match[3] +
								"\t" + match[1]
							);
							listcnt ++;
						}

						// 探索座標切り替え
						sx += 21;
						if (sx > result.x2) {
							sx = result.x1;
							sy += 21;
							if (sy > result.y2) {
								// 結果ボックスに値を入れる
								q$("#result_box").val(list.join("\r\n"));

								clearInterval(search_resource_timer);
								q$("#resource_search_info").text("探索終了");
								q$("#search_resource_exec").val('探索開始');
								stop = false;
								g_event_process = false;
								alert("探索終了");
							}
						}
						wait = false;
					});
				};

				var search_resource_timer = setInterval(search_resource_func, 150);
			}
		);

		// NPCの探索
		q$("#search_npc_exec").on('click',
			function() {
				if (q$(this).val() == '探索を中止') {
					stop = true;
					return;
				}

				if (g_event_process) {
					alert("資源の検索処理が実行中です");
					return;
				}

				var base = q$("#tab-search-npc");

				// 範囲指定が行われているかチェック
				var result = checkRange(base);
				if (result == null) {
					alert('探索範囲を指定してください。');
					return;
				}

				// ボタン名変更
				q$(this).val('探索を中止');

				// イベント制御
				g_event_process = true;

				// イベント検索
				var search_pattern = "";

				// NPC検索対象
				var search_target = q$("input[name='search_npc_target']:checked").val();
				if (search_target == 'pos') {
					//-------------
					// NPC座標探索
					//-------------
					if (q$("#search_event_npc").prop('checked') == false) {
						//search_pattern = new RegExp("rewriteAddRemoving\\('\d+','.*', '(.*)', '.*', '(.*)', '(.*)', '[★]+', '.*', '', '', '', '', '1', '(\d+)', \w+\\); overOpe");
					    //search_pattern = new RegExp("rewrite\\('(.*)', '.*', '.*', '(.*)', '(.*)', '([★]+)', '.*', '', '', '', '', '1', '.*'\\); overOpe");
                        search_pattern = new RegExp("rewriteAddRemoving\\('.*','(.*)', '.*', '.*', '(.*)', '.*', '([★]+)', '.*', '', '', '', '', '1', '.*', .*\\); overOpe");
                    } else {
						search_pattern = new RegExp("rewritePF\\(.*,'(.*)', '.*', '.*', '(.*)', '(.*)', '([★]+)', '.*', '', '', '', '', '1', '.*'\\); overOpe");
					}

					q$("#npc_box").val("高速化のため、検出中のデータは最後に表示します");
					var sx = result.x1;
					var sy = result.y1;

					var list = new Array();
					list.push("NPC名\tX座標\tY座標\t★");
					var listcnt = 0;
					var count = 1;
					wait = false;
					var npc_timer = null;
					var npc_search_func = function() {
						if (stop) {
							q$("#npc_box").val(list.join("\t"));
							clearInterval(npc_timer);
							q$("#search_npc_exec").val('探索実行');
							stop = false;
							g_event_process = false;
							alert("探索を中止しました");
							return;
						}

						if (wait) {
							return;
						}

						q$("#npc_search_info").text("マップ探索中(" + count + ") 中心座標:(" + sx + "," + sy + ") ヒット数:" + listcnt);
						count += 1;

						wait = true;

						var loc = {'x':sx, 'y':sy, 'type':5};
						q$.ajax({
							url: BASE_URL + '/map.php',
							type: 'GET',
							datatype: 'html',
							cache: false,
							data: loc
						})
						.done(function(res) {
							loc = null;
							var resp = q$("<div>").append(res);
							var area = q$("#mapOverlayMap area", resp);

							// NPC座標調査
							for (var i = 0; i < area.length; i++) {
								// 一致検索
                                var test1 = q$(area[i]).attr("onmouseover");
                                console.log(test1);
								var match = q$(area[i]).attr("onmouseover").match(search_pattern);
								if (match == null) {
									continue;
								}

								// 範囲外の座標の場合除外
								var pos = match[2].match(/([-]*\d+),([-]*\d+)/);
								if (parseInt(pos[1]) < result.x1 || parseInt(pos[1]) > result.x2) {
									match = null;
									pos = null;
									continue;
								}
								if (parseInt(pos[2]) < result.y1 || parseInt(pos[2]) > result.y2) {
									match = null;
									pos = null;
									continue;
								}
								if (match[3] == '') {
									match[3] = '-';
								}

								// ヒットした座標を蓄積
								list.push(match[1] + "\t" + parseInt(pos[1]) + "\t" + parseInt(pos[2]) + "\t" + "\t★" + match[3].length);
								listcnt ++;

								match = null;
								pos = null;
							}
							resp = null;
							area = null;

							// 探索座標切り替え
							sx += 21;
							if (sx > result.x2) {
								sx = result.x1;
								sy += 21;
								if (sy > result.y2) {
									// NPC座標検索では座標ボックスに値を入れる
									q$("#npc_box").val(list.join("\r\n"));

									clearInterval(npc_timer);
									q$("#npc_search_info").text("探索終了");
									q$("#search_npc_exec").val('探索開始');
									stop = false;
									g_event_process = false;
									alert("探索終了");
								}
							}
							wait = false;
						});
					};
					npc_timer = setInterval(npc_search_func, 150);
				} else {
					//-------------
					// NPC隣接探索
					//-------------
					if (q$("#search_event_npc").prop('checked') == false) {
						search_pattern = new RegExp("rewrite\\('(.*)', '(.*)', '.*', '(.*)', '(.*)', '([★]*)', '.*', '.*', '.*', '.*', '.*', '.*', '.*'\\); overOpe");
					} else {
						search_pattern = new RegExp("rewritePF\\(.*,'(.*)', '(.*)', '.*', '(.*)', '(.*)', '([★]*) '.*', '.*', '.*', '.*', '.*', '.*', '.*'\\); overOpe");
					}

					q$("#result_npc_box").val("高速化のため、検出中のデータは最後に表示します");

					// 隣接探索対象のNPC探索
					var target = q$("#npc_box").val().split(/\r\n|\r|\n/);
					var search_target = new Array();
					for (var i = 0; i < target.length; i++) {
						var match = target[i].replace(/ /g, "").match(/^.*\t([-]*\d+)\t([-]*\d+)+\t.*$/);
						if (match == null) {
							continue;
						}

						if (parseInt(match[1]) < result.x1 || parseInt(match[1]) > result.x2) {
							match = null;
							continue;
						}
						if (parseInt(match[2]) < result.y1 || parseInt(match[2]) > result.y2) {
							match = null;
							continue;
						}

						search_target.push({x: match[1], y: match[2]});
					}

					var result_box = q$("#result_npc_box");

					var list = new Array();
					list.push("NPC名\tX座標\tY座標\t★\t所有同盟\t北西\t北\t北東\t西\t東\t南西\t南\t南東");
					var listcnt = 0;
					var count = 1;
					var max = search_target.length;
					wait = false;
					var neighbor_search_func = function() {
						if (stop) {
							clearInterval(npc_timer);
							q$("#search_npc_exec").val('探索実行');
							stop = false;
							g_event_process = false;
							alert("探索を中止しました");
							return;
						}

						if (wait) {
							return;
						}

						q$("#npc_search_info").text("マップ探索中(" + count + "/" + max + ") 中心座標(" + search_target[count-1].x + "," + search_target[count-1].y + ")");

						wait = true;

						var loc = {'x':search_target[count-1].x, 'y':search_target[count-1].y, 'type':1};
						q$.ajax({
							url: BASE_URL + '/map.php',
							type: 'GET',
							datatype: 'html',
							cache: false,
							data: loc
						})
						.done(function(res) {
							var resp = q$("<div>").append(res);
							var area = q$("#mapOverlayMap area", resp);

							// NPC隣接調査
							var check = [60, 48, 59, 70, 49, 71, 50, 61, 72];
							var tsv = "";
							var neighbor = "";
							for (var i = 0; i < check.length; i++) {
								// 一致検索
								var match = q$(area[check[i]]).attr("onmouseover").match(search_pattern);
								if (match == null) {
									continue;
								}
								if (match[4] == '') {
									match[4] = '-';
								}

								if (i == 0) {
									// NPC名、座標、★数、所有同盟
									var pos = match[3].match(/([-]*\d+),([-]*\d+)/);
									tsv += match[1] + "\t" + parseInt(pos[1]) + "\t" + parseInt(pos[2]) + "\t★" + match[5].length + "\t" + match[4];
								} else {
									// 隣接（北西、北、北東、西、東、南西、南、南東の順）。所持同盟がいない場合'-'
									if (match[4] != '-') {
										tsv += match[4];
									} else {
										tsv += "-";
									}
								}
								if (i != 8) {
									tsv += "\t";
								}
							}

							if (tsv != "") {
								// 結果の保存
								list.push(tsv);
								listcnt ++;
							}

							count += 1;
							if (count > max) {
								// 結果の表示
								q$("#result_npc_box").val(list.join("\r\n"));

								clearInterval(npc_timer);
								q$("#npc_search_info").text("探索終了");
								q$("#search_npc_exec").val('探索開始');
								stop = false;
								g_event_process = false;
								alert("探索終了");
							}
							wait = false;
						});
					};
					npc_timer = setInterval(neighbor_search_func, 150);
				}
			}
		);

		// 閉じるボタン
		q$("input[id='close_result']").on('click',
			function() {
				stop = true;
				q$("#search_resource").css('display', 'none');
			}
		);
	}
}

//----------------------------------------------------------------------
// 都市画面の実行制御
//----------------------------------------------------------------------
function villageTabControl() {
	if (location.pathname === "/village.php") {
		execVillagePart();
	}
}

//----------------------------------------------------------------------
// 全体地図の実行制御
//----------------------------------------------------------------------
function mapTabControl() {
	// 出兵画面
	if (location.pathname === "/facility/castle_send_troop.php") {
		// 出兵時にデッキ武将を一斉出兵する
		if (g_beyond_options[MAP_11]) {
			// 出兵対象
			var dispatchTargets = [
				[true, "infantry_count"],		// 剣兵
				[false, "shield_count"],		// 盾兵
				[true, "spear_count"],			// 槍兵
				[true, "archer_count"], 		// 弓兵
				[true, "cavalry_count"],		// 騎兵
				[false, "ram_count"],			// 衝車
				[false, "scout_count"], 		// 斥候
				[true, "large_infantry_count"], // 大剣兵
				[false, "heavy_shield_count"],	// 重盾兵
				[true, "halbert_count"],		// 矛槍兵
				[true, "crossbow_count"],		// 弩兵
				[true, "cavalry_guards_count"], // 近衛騎兵
				[false, "catapult_count"],		// 投石機
				[false, "cavalry_scout_count"]	// 斥候騎兵
			];

			// 出兵座標の取得
			var troop_x = q$("input[name='village_x_value']").val();
			var troop_y = q$("input[name='village_y_value']").val();

			var solvals = q$("table[class='innerTables'] tr td span");
			var sols = new Array();
			for (var i = 0; i < solvals.length; i++) {
				var match = solvals.eq(i).text().match(/\d+/);
				sols.push(parseInt(match[0]));
			}

			// 選択可能武将の取得
			var generalEnts = q$("table[class='general attackGeneralListTbl']");
			var generals = new Array();
			for (var i = 0; i < generalEnts.length; i++) {
				if (q$("input[id*='card_radio_']", generalEnts.eq(i)).length == 0) {
					continue;
				}
				var all1 = generalEnts.eq(i).html().match(/(全軍|全兵)の/);
				var all2 = generalEnts.eq(i).html().match(/剴切.*(攻奪|攻令)/);
				var hasWAll = false;
				if (all1 !== null || all2 !== null) {
					hasWAll = true;
				}
				all = generalEnts.eq(i).html().match(/(鹵獲|大徳|劫略|攻奪|収奪|趁火打劫|桃賊の襲撃)/);
				var hasPrize = false;
				if (all != null) {
					hasPrize = true;
				}
				var id = q$("input[id*='card_radio_']", generalEnts.eq(i)).val();
				var name = q$("a[class^='thickbox']", generalEnts.eq(i)).eq(1).text();
				var html = q$("tr", generalEnts.eq(i)).eq(1).html().replace(/[ \t\r\n]/g, "");
				var match = html.match(/Lv<\/strong>(\d+).*兵科[ :]?<\/strong>(.兵?).*<strong>HP[ ]?<\/strong>(\d+).*<strong>討[ ]?<\/strong>(\d+)/);
				generals.push({id: id, name: name, lv: match[1], type: match[2], hp: match[3], gauge: match[4], wall: hasWAll, prize: hasPrize});
			}

			// 選択用チェックボックスの作成
			html = "";
			var html_r = "";
			for (var i = 0; i < generals.length; i++) {
				var wa = "";
				var gn = "";
				if (generals[i].wall === true || generals[i].prize === true) {
					if (generals[i].wall === false) {
						wa = ", <span style='color: red;'>鹵獲持ち</span>";
						gn = "<span style='color: red;'>" + generals[i].name + "</span>";
					} else if (generals[i].prize === false) {
						wa = ", <span style='color: blue;'>全軍持ち(剴切含む)</span>";
						gn = "<span style='color: blue;'>" + generals[i].name + "</span>";
					} else {
						wa = ", <span style='color: purple;'>全軍(剴切含む)、鹵獲持ち</span>";
						gn = "<span style='color: purple;'>" + generals[i].name + "</span>";
					}
				} else {
					gn = generals[i].name;
				}
				html +=
					"<div>" +
						"<input type='checkbox' id='g_troop" + i + "' cardno='" + generals[i].id + "' gauge='" + generals[i].gauge + "' prize='" + generals[i].prize + "' style='vertical-align: middle'>" +
							"<label style='margin-left: 4px; margin-right: 4px;' for='g_troop" + i + "'>" +
								gn +
								"（レベル: " + generals[i].lv +
								", 兵科: " + generals[i].type +
								", HP: " + generals[i].hp +
								", 討伐: " + generals[i].gauge +
								wa + "）" +
							"</label>" +
						"</input>" +
					"</div>";
				html_r +=
					"<div>" +
						"<input type='checkbox' id='g_reinforce" + i + "' cardno='" + generals[i].id + "' gauge='" + generals[i].gauge + "' prize='" + generals[i].prize + "' style='vertical-align: middle'>" +
							"<label style='margin-left: 4px; margin-right: 4px;' for='g_reinforce" + i + "'>" +
								gn +
								"（レベル: " + generals[i].lv +
								", 兵科: " + generals[i].type +
								", HP: " + generals[i].hp +
								", 討伐: " + generals[i].gauge +
								wa + "）" +
							"</label>" +
						"</input>" +
					"</div>";
			}

			// 画面構築
			q$("table[class='general']").before(
				"<div style='margin-bottom: 4px;'>" +
					"<input style='margin-right: 4px;' id='multiple_troop' type='button' value='一斉出兵'>" +
					"<input id='multiple_reinforce' style='margin-right: 4px;' type='button' value='一斉援軍'>" +
					"<span id='multiple_troop_info' style='font-weight: bold; font-size:14px; color: red;'></span>" +
				"</div>" +
				"<div id='troop_setting_view' class='roundbox' style='display: none; padding-left: 4px; padding-right: 4px;'>" +
					"<div style='margin: 4px;font-weight: bold; font-size: 14px; color: #C00;'>一斉出兵指定&nbsp;&nbsp;出兵先:(" + troop_x + "," + troop_y +")</div>" +
					"<div>" +
						"<input style='margin-bottom: 4px; margin-right: 4px;' id='checkoff_all' type='button' value='選択解除'>" +
						"<input style='margin-bottom: 4px; margin-right: 4px;' id='check_all' type='button' value='全選択'>" +
						"<input style='margin-bottom: 4px; margin-right: 4px;' id='check_gauge_100' type='button' value='討伐100以上を選択'>" +
						"<input style='margin-bottom: 4px;' id='check_gauge_max' type='button' value='討伐500を選択'>" +
					"</div>" +
					"<div>" +
						html +
					"</div>" +
					"<div style='margin-top: 10px; margin-bottom: 4px;'>" +
						"<input type='checkbox' id='use_sol' style='vertical-align: middle'>" +
							"<label style='margin-left: 4px; margin-right: 4px;' for='use_sol'>" +
								"兵士をつけて出兵（出兵時に盾・車・斥候以外の兵を均等割り配分します）" +
							"</label>" +
						"</input>" +
					"</div>" +
					"<div style='margin-bottom: 4px;'>" +
						"<input type='checkbox' id='use_prize' style='vertical-align: middle'>" +
							"<label style='margin-left: 4px; margin-right: 4px;' for='use_prize'>" +
								"鹵獲として出兵" +
							"</label>" +
						"</input>" +
					"</div>" +
					"<div style='margin-bottom: 4px;'>" +
						"<input style='margin-right: 4px; margin-top: 8px;' id='exec_multiple_troop' type='button' value='出兵する'>" +
						"<input id='close_multiple_troop' type='button' value='閉じる'>" +
					"</div>" +
				"</div>" +

				"<div id='reinforce_setting_view' class='roundbox' style='display: none; padding-left: 4px; padding-right: 4px;'>" +
					"<div style='margin: 4px;font-weight: bold; font-size: 14px; color: #090;'>一斉援軍指定&nbsp;&nbsp;援軍先:(" + troop_x + "," + troop_y +")</div>" +
					"<div>" +
						"<input style='margin-bottom: 4px; margin-right: 4px;' id='checkoff_r_all' type='button' value='選択解除'>" +
						"<input style='margin-bottom: 4px; margin-right: 4px;' id='check_r_all' type='button' value='全選択'>" +
					"</div>" +
					"<div>" +
						html_r +
					"</div>" +
					"<div style='margin-bottom: 4px;'>" +
						"<input style='margin-right: 4px; margin-top: 8px;' id='exec_multiple_reinforce' type='button' value='援軍出兵する'>" +
						"<input id='close_multiple_reinforce' type='button' value='閉じる'>" +
					"</div>" +
				"</div>"
			);

			// 一斉出兵枠表示
			q$("#multiple_troop").on('click',
				function() {
					q$("#troop_setting_view").css('display', 'block');
					q$("#reinforce_setting_view").css('display', 'none');
				}
			);

			// 一斉援軍枠表示
			q$("#multiple_reinforce").on('click',
				function() {
					q$("#troop_setting_view").css('display', 'none');
					q$("#reinforce_setting_view").css('display', 'block');
				}
			);

			// 閉じるボタン
			q$("#close_multiple_troop").on('click',
				function() {
					q$("#troop_setting_view").css('display', 'none');
				}
			);
			q$("#close_multiple_reinforce").on('click',
				function() {
					q$("#reinforce_setting_view").css('display', 'none');
				}
			);

			// 選択解除
			q$("#checkoff_all").on('click',
				function() {
					q$("input[id*='g_troop']").prop('checked', false);
				}
			);
			q$("#checkoff_r_all").on('click',
				function() {
					q$("input[id*='g_reinforce']").prop('checked', false);
				}
			);

			// 全選択
			q$("#check_all").on('click',
				function() {
					q$("input[id*='g_troop']").prop('checked', true);
				}
			);
			q$("#check_r_all").on('click',
				function() {
					q$("input[id*='g_reinforce']").prop('checked', true);
				}
			);

			// 討伐100以上選択
			q$("#check_gauge_100").on('click',
				function() {
					var ents = q$("input[id*='g_troop']");
					for (var i = 0; i < ents.length; i++) {
						if (ents.eq(i).attr('gauge') < 100) {
							continue;
						}
						ents.eq(i).prop('checked', true);
					}
				}
			);

			// 討伐500選択
			q$("#check_gauge_max").on('click',
				function() {
					var ents = q$("input[id*='g_troop']");
					for (var i = 0; i < ents.length; i++) {
						if (ents.eq(i).attr('gauge') == 500) {
							ents.eq(i).prop('checked', true);
						} else {
							ents.eq(i).prop('checked', false);
						}
					}
				}
			);

			// 出兵ボタン
			q$("#exec_multiple_troop").on('click',
				function() {
					// 選択した武将の数を数える
					var ents = q$("input[id*='g_troop']");
					var sel_count = 0;
					var troop_gen = new Array();
					for (var i = 0; i < ents.length; i++) {
						if (ents.eq(i).prop('checked') == true) {
							sel_count ++;
							troop_gen.push(ents.eq(i).attr('cardno'));
						}
					}
					if (sel_count == 0) {
						alert('出兵武将を選択してください。');
						return;
					}

					// 画面を開けなくし、閉じる
					q$("#multiple_troop").css('display', 'none');
					q$("#multiple_reinforce").css('display', 'none');
					q$("#troop_setting_view").css('display', 'none');
					q$("#reinforce_setting_view").css('display', 'none');

					// 出兵兵数を武将の数で分散する
					var use_sol = false;
					var solpergen = new Array();
					if (q$("#use_sol").prop('checked') == true) {
						use_sol = true;

						for (var i = 0; i < dispatchTargets.length; i++) {
							if (dispatchTargets[i][0]) {
								solpergen.push(Math.floor(sols[i] / sel_count));
							} else {
								solpergen.push(0);
							}
						}
					} else {
						for (var i = 0; i < dispatchTargets.length; i++) {
								solpergen.push(0);
						}
					}

					// 送信データの作成
					var postdata = new Object;
					for (var i = 0; i < solpergen.length; i++) {
						postdata[dispatchTargets[i][1]] = solpergen[i];
					}
					postdata['village_x_value'] = parseInt(troop_x);
					postdata['village_y_value'] = parseInt(troop_y);
					if (q$("#use_prize").prop('checked') == true) {
						postdata['radio_move_type'] = 307;		// 鹵獲
					} else {
						postdata['radio_move_type'] = 302;		// 通常出兵
					}
					postdata['show_beat_bandit_flg'] = 1;
					postdata['radio_reserve_type'] = 0;
					postdata['card_id'] = 204;
					postdata['btn_send'] = '出兵';

					// 出兵処理
					var wait = false;
					var count = 1;
					var max = sel_count;
					var timer1 = setInterval(
						function() {
							if (wait) {
								return;
							}
							wait = true;

							// 出兵する武将カード
							postdata['unit_assign_card_id'] = troop_gen[count - 1];

							q$("#multiple_troop_info").text("一斉出兵中 (" + count + "/" + max + ")");

							q$.ajax({
								url: BASE_URL + "/facility/castle_send_troop.php",
								type: 'POST',
								datatype: 'html',
								cache: false,
								data: postdata
							})
							.done(function(res){
								var resp = q$("<div>").append(res);
								if (q$("#btn_preview", resp).length > 0) {
									// プレビューに戻るということは出兵失敗
									q$("#multiple_troop_info").text(
										"座標(" + troop_x + "," + troop_y + ")に出兵できませんでした。処理を中断しました。"
									);

									clearInterval(timer1);
									timer1 = null;
									wait = false;
								}

								count++;
								if (count > max) {
									clearInterval(timer1);
									timer1 = null;
									location.href = BASE_URL + "/facility/unit_status.php?type=sortie";
								}
								wait = false;
							});
						}, AJAX_REQUEST_INTERVAL
					);
				}
			);

			// 援軍出兵ボタン
			q$("#exec_multiple_reinforce").on('click',
				function() {
					// 選択した武将の数を数える
					var ents = q$("input[id*='g_reinforce']");
					var sel_count = 0;
					var troop_gen = new Array();
					for (var i = 0; i < ents.length; i++) {
						if (ents.eq(i).prop('checked') == true) {
							sel_count ++;
							troop_gen.push(ents.eq(i).attr('cardno'));
						}
					}
					if (sel_count === 0) {
						alert('出兵武将を選択してください。');
						return;
					}

					// 画面を開けなくし、閉じる
					q$("#multiple_troop").css('display', 'none');
					q$("#multiple_reinforce").css('display', 'none');
					q$("#troop_setting_view").css('display', 'none');
					q$("#reinforce_setting_view").css('display', 'none');

					// 出兵兵数を武将の数で分散する
					var use_sol = false;
					var solpergen = new Array();
					if (q$("#use_sol").prop('checked') == true) {
						use_sol = true;

						for (var i = 0; i < dispatchTargets.length; i++) {
							if (dispatchTargets[i][0]) {
								solpergen.push(Math.floor(sols[i] / sel_count));
							} else {
								solpergen.push(0);
							}
						}
					} else {
						for (var i = 0; i < dispatchTargets.length; i++) {
								solpergen.push(0);
						}
					}

					// 送信データの作成
					var postdata = new Object;
					for (var i = 0; i < solpergen.length; i++) {
						postdata[dispatchTargets[i][1]] = solpergen[i];
					}
					postdata['village_x_value'] = parseInt(troop_x);
					postdata['village_y_value'] = parseInt(troop_y);
					postdata['radio_move_type'] = 301;
					postdata['show_beat_bandit_flg'] = 1;
					postdata['radio_reserve_type'] = 0;
					postdata['card_id'] = 204;
					postdata['btn_send'] = '出兵';

					// 出兵処理
					var wait = false;
					var count = 1;
					var max = sel_count;
					var timer1 = setInterval(
						function() {
							if (wait) {
								return;
							}
							wait = true;

							// 出兵する武将カード
							postdata['unit_assign_card_id'] = troop_gen[count - 1];

							q$("#multiple_troop_info").text("一斉援軍中 (" + count + "/" + max + ")");

							q$.ajax({
								url: BASE_URL + "/facility/castle_send_troop.php",
								type: 'POST',
								datatype: 'html',
								cache: false,
								data: postdata
							})
							.done(function(res){
								var resp = q$("<div>").append(res);
								if (q$("#btn_preview", resp).length > 0) {
									// プレビューに戻るということは援軍出兵失敗
									q$("#multiple_troop_info").text(
										"座標(" + troop_x + "," + troop_y + ")に援軍出兵できませんでした。処理を中断しました。"
									);

									clearInterval(timer1);
									timer1 = null;
									wait = false;
								}

								count++;
								if (count > max) {
									clearInterval(timer1);
									timer1 = null;
									location.href = BASE_URL + "/facility/unit_status.php?type=sortie";
								}
								wait = false;
							});
						}, AJAX_REQUEST_INTERVAL
					);
				}
			);
		}
	}
}

//----------------------------------------------------------------------
// 同盟タブの実行制御
//----------------------------------------------------------------------
function allianceTabControl() {
	// 同盟拠点ページ
	if (location.pathname === "/alliance/village.php") {
		// 運営のレイヤー重ねバグの対応
		q$("#alliance-base div[class='donation-info-top']").css('z-index', 1);
	}

	// 同盟ページ
	if (location.pathname === "/alliance/info.php") {
		// テーブルソーターの追加
		if (g_beyond_options[ALLIANCE_01]) {
			q$("table[class='tables'] th:not(:eq(0))").each(
				function(index) {
					// ソートアイコン追加
					q$(this).append(
						"<br>" +
						"<span style='margin-right: 4px; cursor: pointer;'>" +
							"<img id='lowersort_" + index + "' src='" + SORT_UP_ICON + "' title='低い順に並び替え' alt='低い順に並び替え'></img>" +
						"</span>" +
						"<span class='pointer'>" +
							"<img id='uppersort_" + index + "' src='" + SORT_DOWN_ICON + "' title='高い順に並び替え' alt='高い順に並び替え'></img>" +
						"</span>"
					);

					// 昇順ソートイベント
					q$("#lowersort_" + index).on('click',
						{selector: "table[class='tables'] tr", offset: 2, index: index, order_ascend: true},
						function(param) {
							tableSorter(param.data.selector, param.data.offset, param.data.index, param.data.order_ascend);
						}
					);

					// 降順ソートイベント
					q$("#uppersort_" + index).on('click',
						{selector: "table[class='tables'] tr", offset: 2, index: index, order_ascend: false},
						function(param) {
							tableSorter(param.data.selector, param.data.offset, param.data.index, param.data.order_ascend);
						}
					);
				}
			);
		}

		// 同盟情報付与
		if (g_beyond_options[ALLIANCE_03] && q$("#contribution_table").length !== 0) {
			var elem = q$("#gray02Wrapper table[class='commonTables'] tbody tr");

			// 同盟レベル
			var alliance_lv = parseInt(elem.eq(7).children("td").eq(0).text());

			// 同盟人数枠
			var match = elem.eq(7).children("td").eq(1).text().match(/([0-9]*)\/([0-9]*)/);
			var now_members = parseInt(match[1]);
			var alliance_capacity = parseInt(match[2]);
			var frame_capacity = alliance_capacity - now_members;
			if (frame_capacity > 0) {
				elem.eq(7).children("td").eq(1).append(
					"<div class='bold-red'>あと " + frame_capacity + " 人加入できます</div>"
				);
			} else {
				elem.eq(7).children("td").eq(1).append(
					"<div class='bold-red'>最大人数です</div>"
				);
			}

			// 寄付枠
			if (alliance_lv < 20) {
				match = elem.eq(8).children("td").eq(0).text().match(/([0-9]*)\/([0-9]*)/);
				var capacity = parseInt(match[2]) - parseInt(match[1]);
				elem.eq(8).children("td").eq(0).append(
					"<span class='bold-red'>" +
						"<div>次レベル迄 " + capacity + "</div>" +
						"<div>一人あたり " + Math.ceil(capacity / now_members) + "</div>" +
					"</span>"
				);
			}

			// 次レベル同盟人数
			if (alliance_lv < 20) {
				var next_alliance_capacity = parseInt(elem.eq(8).children("td").eq(1).text());
				capacity = next_alliance_capacity - alliance_capacity;
				elem.eq(8).children("td").eq(1).append(
					"<span class='bold-red'> (+" + capacity + ")</span>"
				);
			}
		}

		// 同盟ランキング内のプレイヤー着色
		if (g_beyond_options[ALLIANCE_02]) {
			var username = GM_getValue(SERVER_NAME + '_username', null);
			if (username != null) {
				var elems = q$("table[class='tables'] tbody tr");
				for (var i = 0; i < elems.length; i++) {
					var elem = q$("td a", elems.eq(i));
					if (elem.length > 0) {
						var name = elem.eq(0).text();
						if (name === username) {
							elems.eq(i).css('background-color', 'yellow');
							break;
						}
					}
				}
			}
		}

		// CSVダウンロード機能追加、同盟員本拠座標取得機能追加
		if (g_beyond_options[ALLIANCE_04] || g_beyond_options[ALLIANCE_05]) {
			var tb = q$("table[class='tables']");
			var htmlText = "";
			htmlText += "<div>";
			if (g_beyond_options[ALLIANCE_04]) {
				htmlText += "<span id='alliance_get_all' class='app-lnk'>同盟員全領地座標CSV取得</span>";
			}
			if (g_beyond_options[ALLIANCE_05]) {
				htmlText += "<span id='alliance_pos_get_all'><span class='app-lnk'>同盟員本拠座標取得</span></span>";
			}
			htmlText += "</div>" +
				"<div id='result_box' style='position: absolute; background-color: #a9a9a9; display: none;'>" +
					"<div style='background-color: #d3d3d3; margin: 2px;'>" +
						"<div id='list_title' style='margin-left: 4px; font-weight: bold;'>領地取得中</div>" +
						"<textarea id='result_csv' cols='98' rows='15' style='overflow: auto; margin: 4px; '></textarea>" +
						"<br><input id='close_result' type='button' value='閉じる'></input>" +
					"</div>" +
				"</div>";
			tb.before(htmlText);

			// CSVダウンロードボタンクリックイベント
			if (g_beyond_options[ALLIANCE_04]) {
				q$("#alliance_get_all").on('click',
					function() {
						q$("#result_box").css('display', 'block');
						q$("#result_csv").val("領地取得中です。しばらくお待ち下さい。");

						// 同盟名を取得
						var alliance_name = q$("table[class='commonTables'] tbody tr").eq(1).children('td').text().replace(/[ \t\r\n]/g, "");

						// 所属同盟員の鯖内IDを全て取得
						var users = new Array();
						var usernames = new Array();
						var elems = q$("table[class='tables'] tbody tr");
						for (var i = 2; i < elems.length; i++) {
							var userid = elems.eq(i).children('td').eq(1).children('a').attr('href').replace(/^.*user_id=/,'');
							var name = elems.eq(i).children('td').eq(1).text().replace(/[ \t\r\n]/g, "");
							usernames.push(name);
							users.push(userid);
						}

						// 領地リストを取得(非同期)
						var wait = false;
						var count = 1;
						var max = users.length;
						var result = ["同盟\t君主\t領地名\tX\tY\t人口\t本拠"];
						var timer1 = setInterval(
							function() {
								// ウインドウが閉じられたら処理を止める
								if (q$("#result_box").css('display') === 'none') {
									clearInterval(timer1);
									return;
								}
								if (wait) {
									return;
								}
								wait = true;

								q$("#list_title").text('( ' + count + ' / ' + max + ' ) ' + usernames[count-1] + 'の領地取得中...');
								q$.ajax({
									url: BASE_URL + "/user",
									type: 'GET',
									datatype: 'html',
									cache: false,
									data: {'user_id': users[count - 1]}
								})
								.done(function(res){
									var resp = q$("<div>").append(res);
									var landelems = q$("#gray02Wrapper table[class='commonTables'] tr", resp);
									var start = 18 + (landelems.eq(18).children("th").length > 0) * 1;
									for (var i = start; i < landelems.length; i++) {
										var land = landelems.eq(i).children("td").eq(0).children('a').text().replace(/[ \t\r\n]/g, "");
										var match = landelems.eq(i).children("td").eq(1).text().match(/([-]*[0-9]*),([-]*[0-9]*)/);
										var populations = landelems.eq(i).children("td").eq(2).text().replace(/[ \t\r\n]/g, "");
										var base = '';
										if (i == start) {
											base = '1';
										}
										result.push(
											alliance_name + "\t" + usernames[count - 1] + "\t" + land + "\t" + match[1] + "\t" + match[2] + "\t" + populations + "\t" + base
										);
									}

									count++;
									if (count > max) {
										clearInterval(timer1);
										q$("#result_csv").val("整形中です");
										q$("#result_csv").val(result.join('\r\n'));
										q$("#list_title").text('完了しました。CTRL + A → CTRL + Cでコピーし、Excelなどに貼り付けてください');
									}
									wait = false;
								});
							}, AJAX_REQUEST_INTERVAL
						);
					}
				);

				// 閉じるボタンのクリックイベント
				q$("#close_result").on('click',
					function() {
						q$("#result_box").css('display', 'none');
					}
				);
			}

			// 同盟員本拠座標取得ボタンクリックイベント
			if (g_beyond_options[ALLIANCE_05]) {
				// 同盟IDを取得
				var match = location.search.match(/id=(\d+)/);

				// 保存されている同盟情報を取得
				var userlist = GM_getValue(SERVER_NAME + '_alist_' + match[1], null);
				if (userlist != null) {
					if (typeof userlist !== 'string') {
						userlist = null;
					} else {
						userlist = JSON.parse(userlist);
					}
				}
				
				// 本拠地列を作る
				var elems = q$("table[class='tables'] tbody tr");
				var myAlliance = (elems.eq(1).children('th').length == 7);
				for (var i = 1; i < elems.length; i++) {
					if (i == 1) {
						if (myAlliance == true) {
							elems.eq(0).children('th').attr('colspan', '8');
						} else {
							elems.eq(0).children('th').attr('colspan', '7');
						}
						elems.eq(1).append('<th class="all">本拠地</th>');
						continue;
					}

					// すでに保存されている情報があればそれをマッピング
					var userid = elems.eq(i).children('td').eq(1).children('a').attr('href').replace(/^.*user_id=/,'');
					if (userlist !== null) {
						if (find = userlist.find(c => c.id === userid)) {
							elems.eq(i).append(
								"<td style='text-align: center;'>" +
									"<a href='" + BASE_URL + "/map.php?x=" + find.x + "&y=" + find.y + "' target='_blank'>(" + find.x + "," + find.y + ")</a>" +
								"</td>"
							);
						} else {
							elems.eq(i).append('<td style="text-align: center;">(-,-)</td>');
						}
					} else {
						elems.eq(i).append('<td style="text-align: center;">(-,-)</td>');
					}
				}

				// 本拠地座標取得アクション
				q$("#alliance_pos_get_all").on('click',
					function() {
						// 同盟IDを取得
						var match = location.search.match(/id=(\d+)/);
						var alliance_id = match[1];

						// 所属同盟員の鯖内IDを全て取得
						var users = [];
						var usernames = [];
						var elems = q$("table[class='tables'] tbody tr");
						var myAlliance = (elems.eq(1).children('th').length == 8);
						for (var i = 2; i < elems.length; i++) {
							var userid = elems.eq(i).children('td').eq(1).children('a').attr('href').replace(/^.*user_id=/,'');
							var name = elems.eq(i).children('td').eq(1).text().replace(/[ \t\r\n]/g, "");
							usernames.push(name);
							users.push(userid);
						}

						q$("#alliance_pos_get_all").css('color', 'red').css('font-weight', 'bold');

						// 領地リストを取得(非同期)
						var wait = false;
						var count = 1;
						var max = users.length;
						var userlist = new Array();
						var timer1 = setInterval(
							function() {
								if (wait) {
									return;
								}
								wait = true;

								q$("#alliance_pos_get_all").text('(' + count + '/' + max + ')人目の座標取得中...');
								q$.ajax({
									url: BASE_URL + "/user",
									type: 'GET',
									datatype: 'html',
									cache: false,
									data: {'user_id': users[count - 1]}
								})
								.done(function(res){
									var resp = q$("<div>").append(res);
									var result = "";
									var landelems = q$("#gray02Wrapper table[class='commonTables'] tr", resp);
									var start = 18 + (landelems.eq(18).children("th").length > 0) * 1;
									var match = landelems.eq(start).children("td").eq(1).text().match(/([-]*[0-9]*),([-]*[0-9]*)/);
									var pos = 6;
									if (myAlliance == true) {
										pos = 7;
									}
									elems.eq(count + 1).children('td').eq(pos).html(
										"<a href='" + BASE_URL + "/map.php?x=" + match[1] + "&y=" + match[2] + "' target='_blank'>(" + match[0] + ")</a>"
									);

									userlist.push({id: users[count -1], x: match[1], y: match[2]});
									count++;
									if (count > max) {
										// 一回取得したデータは鯖＋同盟IDごとに保存
										GM_setValue(SERVER_NAME + '_alist_' + alliance_id, userlist);

										clearInterval(timer1);
										q$("#alliance_pos_get_all").css('color', 'red').text('完了しました。');
									}
									wait = false;
								});
							}, AJAX_REQUEST_INTERVAL
						);
					}
				);
			}
		}
	}

	// 同盟掲示板
	if (location.pathname === "/bbs/res_view.php") {
		// 掲示板の逆順ソート
		if (g_beyond_options[ALLIANCE_21]) {
			var trlist = q$("#gray02Wrapper table[class='commonTables'] tr");
			var max = trlist.length;
			if (trlist.length % 2 != 0) {
				max = trlist.length - 1;
			}
			if (max > 10) {
				var trhtmls = [];
				for (var i = 4; i < max - 4; i++) {
					if (i == max - 5) {
						trlist.eq(i).children('th').css('background-color', '#ffe4e1');
						trlist.eq(i).children('th').append("<div class='red'>(最新発言)</div>");
					}
					trhtmls[trhtmls.length] = trlist.eq(i).prop('outerHTML');
					trlist.eq(i).remove();
				}

				var html = "";
				for (var i = trhtmls.length / 2 - 1; i >= 0; i-- ) {
					for (var j = 0; j < 2; j++) {
						html += trhtmls[i * 2 + j];
					}
				}

				trlist.eq(3).after(html);
			}
		}
	}

	// 同盟ログページ
	if (location.pathname === "/alliance/alliance_log.php") {
		if (g_beyond_options[ALLIANCE_13]) {
			// 同盟ログ検索機能を追加
			// 最大ページ番号の取得
			var max = 1;
			if (q$("ul[class=pager]").length > 0) {
				var pages = q$("ul[class=pager] li");
				for (var i = 0; i < pages.length; i++) {
					var page = parseInt(q$(pages[i]).text());
					if (!isNaN(page) && max < page) {
						max = page;
					}
				}
			}

			// 検索ボックスの追加
			var timer1 = null;
			q$("ul[class='ui-tabs-nav']").before(
				"<div>" +
					"<div class='bold-red'>同盟ログ検索</div>" +
						"<fieldset style='-moz-border-radius:5px; border-radius: 5px; -webkit-border-radius: 5px; margin-bottom: 6px; border: 2px solid black;'>" +
							"<div style='margin: 3px 3px 3px 3px;'>" +
								"<span style='margin-right: 8px; font-weight: bold;'>検索文字列</span>" +
								"<input style='margin-right: 8px;' type='text' id='search_str' size='20' value=''/>" +
								"<span style='margin-right: 8px; font-weight: bold;'>(直近</span>" +
								"<input style='margin-right: 8px;' type='text' id='search_count' size='3' value='20'/>" +
								"<span style='margin-right: 8px; font-weight: bold;'>件検索)</span>" +
								"<input style='margin-right: 8px;' type='button' id='exec_search' name='exec_search' value='検索'/>" +
								"<span style='margin-right: 8px; font-weight: bold;' id='search_status'></span>" +
							"</div>" +
						"</fieldset>" +
						"<div id='search-result-div' class='roundbox' style='display: none;'>" +
							"<div style='padding: 4px;'>" +
								"<span style='font-weight: bold; color: red;'>同盟ログ検索結果</span>" +
								"<input type='button' id='close_search_log' style='margin: 4px;' value='閉じる'>&nbsp;" +
								"<div style='overflow-y: auto; max-height: 1000px;'>" +
									"<table class='commonTables tables' style='margin: 0px;'>" +
										"<tbody id='result_box'>" +
										"</tbody>" +
									"</table>" +
								"</div>" +
								"<input type='button' id='close_search_log' style='margin: 4px;' value='閉じる'>&nbsp;" +
							"</div>" +
						"</div>" +
					"</div>" +
				"</div>"
			);

			// イベント設定
			q$("#exec_search").on('click',
				function() {
					var match = location.search.match(/m=(.*)/);
					var tabname = "";
					if (match != null) {
						tabname = match[1];
					}
					var target = q$("#search_str").val();
					var limit = parseInt(q$("#search_count").val());
					if (isNaN(limit)) {
						limit = 20;
						q$("#search_count").val(20);
					}
					var scope = q$("#search_hours option:selected").val();

					if (target == "") {
						return;
					}

					if (timer1 != null) {
						clearInterval(timer1);
						timer1 = null;
						q$("#search-result-div").css('display', 'block');
						q$("#exec_search").val('検索');
						q$("#search_status").text('終了しました');
						return;
					}

					q$("#exec_search").val('停止');

					q$("#result_box").children().remove();
					q$("#search-result-div").css('display', 'none');

					// 検索ログ名の正規表現を作る
					var regexp = new RegExp(target);

					// 領地ログを検索
					var wait = false;
					var count = 1;
					var found = false;
					timer1 = setInterval(
						function() {
							if (wait) {
								return;
							}
							wait = true;

							q$("#search_status").text('(' + count + '/' + max + ')のログ検索中...');

							q$.ajax({
								url: BASE_URL + "/alliance/alliance_log.php",
								type: 'GET',
								datatype: 'html',
								cache: false,
								data: {'p': count, 'm': tabname}
							})
							.done(function(res){
								var resp = q$("<div>").append(res);
								var trlist = q$("table[class='commonTables tables'] tbody tr", resp);
								for (var i = 0; i < trlist.length; i++) {
									var tdlist = trlist.eq(i).children("td");
									if (tdlist.length == 0) {
										continue;
									}

									var logtext = tdlist.eq(1).text().replace(/[ \t\r\n]/g, "");
									if (logtext.match(regexp) != null) {
										q$("#result_box").append(trlist.eq(i).prop('outerHTML'));
										limit --;
										if (found == false) {
											// 途中経過表示
											q$("#search-result-div").css('display', 'block');
											found = true;
										}
									}
									if (limit <= 0) {
										break;
									}
								}

								count++;
								if (count > max || limit <= 0) {
									clearInterval(timer1);
									q$("#search-result-div").css('display', 'block');
									q$("#exec_search").val('検索');
									q$("#search_status").text('終了しました');
									timer1 = null;
								}
								wait = false;
							});
						}, 150
					);
				}
			);

			// 閉じる
			q$("input[id='close_search_log']").on('click',
				function(){
					if (timer1 != null) {
						clearInterval(timer1);
						timer1 = null;
						q$("#exec_search").val('検索');
						q$("#search_status").text('終了しました');
					}
					q$("#search-result-div").css({'display':'none'});
					q$("#search-result").css({'display':'none'});
					q$("#search-result tr").remove();
				}
			);
		}
	}

	// 配下同盟管理ページ
	if (location.pathname == "/alliance/manage_dep.php") {
		if (g_beyond_options[ALLIANCE_41] == true) {
			// 配下検索機能を追加

			q$("form").before(
				"<div>" +
					"<div>" +
						"<fieldset style='-moz-border-radius:5px; border-radius: 5px; -webkit-border-radius: 5px; margin-bottom: 6px; border: 2px solid black;'>" +
							"<div style='margin: 3px 3px 3px 3px;'>" +
								"<span style='font-weight: bold;'>検索条件</span>" +
								"<span style='margin-left: 4px;'>同盟名</span>" +
								"<input type='text' id='search_alliance' size=20 style='margin-left:4px; margin-right: 4px; padding: 2px;'>" +
								"<span style='margin-left: 4px;'>君主名</span>" +
								"<input type='text' id='search_name' size=20 style='margin-left:4px; margin-right: 4px; padding: 2px;'>" +
								"<input type='button' id='search_sub' value='検索'>&nbsp;" +
								"<span id='search_status' style='font-weight: bold;'></span>" +
							"</div>" +
						"</fieldset>" +
						"<div id='search-result-div' class='roundbox' style='display: none;'>" +
							"<div style='padding: 4px;'>" +
								"<span style='font-weight: bold; color: red;'>配下検索結果</span>" +
								"<input type='button' id='close_search_box' style='margin: 4px;' value='閉じる'>&nbsp;" +
								"<div style='overflow-y: auto; max-height: 500px;'>" +
									"<table id='search-result' style='font-size: 8pt; display: none; margin-right: 25px;'>" +
									"</table>" +
								"</div>" +
								"<input type='button' id='close_search_box' style='margin: 4px;' value='閉じる'>&nbsp;" +
							"</div>" +
						"</div>" +
					"</div>" +
				"</div>"
			);

			// 検索
			q$("input[id='search_sub']").on('click',
				function(){
					var target_alliance = q$("#search_alliance").val().replace(/[ \t　]/g, "");
					var target_name = q$("#search_name").val().replace(/[ \t　]/g, "");
					if (target_alliance === "" && target_name === "") {
						alert("検索する同盟名、または君主名を入力してください。");
						return;
					}
					q$("#search_sub").val("処理実行中").prop("disabled", true);

					q$("#search-result-div").css({'display':'none'});
					q$("#search-result").css({'display':'none'});
					q$("#search-result tr").remove();

					search_sub(target_alliance, target_name);
				}
			);

			// 閉じる
			q$("input[id='close_search_box']").on('click',
				function(){
					q$("#search-result-div").css({'display':'none'});
					q$("#search-result").css({'display':'none'});
					q$("#search-result tr").remove();
				}
			);

			// regexp用エスケープ
			function regexp_escape(str) {
				return str.replace(/[-[\]{}()*+!<=:?.\/\\^$#\s,]/g, '\\$&');
			}

			// 一致する配下を検索
			function search_sub(target_alliance, target_name) {
				// 検索スキル名の正規表現を作る
				var regexp_alliance = new RegExp(target_alliance);
				var regexp_name = new RegExp(target_name);

				// 最大ページ番号の取得
				var max = 1;
				if (q$("#gray02Wrapper ul[class=pager]").eq(0).length > 0) {
					var pages = q$("#gray02Wrapper ul[class=pager]").eq(0).children("li");
					for (var i = 0; i < pages.length; i++) {
						var page = parseInt(q$(pages[i]).text());
						if (!isNaN(page) && max < page) {
							max = page;
						}
					}
				}

				// 配下ページの検索
				var wait = false;
				var count = 1;
				var result = [];
				var maxhits = 0;
				var timer1 = setInterval(
					function () {
						if (wait) {
							return;
						}
						wait = true;

						q$("#search_status").text("配下検索中・・・" + count + " / " + max);

						no = {'p': count};
						q$.ajax({
							url: BASE_URL + '/alliance/manage_dep.php',
							type: 'GET',
							datatype: 'html',
							cache: false,
							data: no
						})
						.done(function(res) {
							var resp = q$("<div>").append(res);
							var lists = q$("table[class='tables'] tr", resp);
							if (lists.length > 0) {
								for (var i = 0; i < lists.length; i++) {
									// 条件にマッチするか調べる
									var hits = [];
									if (target_alliance !== "" && lists.eq(i).children("td").eq(0).children('a').text().match(regexp_alliance) === null) {
										continue;
									}
									if (target_name !== "" && lists.eq(i).children("td").eq(2).children('a').text().match(regexp_name) === null) {
										continue;
									}

									result.push({
										page: count,
										alliance: lists.eq(i).children("td").eq(0).children('a').text(),
										name: lists.eq(i).children("td").eq(2).children('a').text()
									});
								}
							}

							count++;
							if (count > max) {
								clearInterval(timer1);

								q$("#search_status").text("結果作成中");

								// 結果描画
								var tr = "<tr>" +
											 "<th class='tpad'>ページ</th>" +
											 "<th class='tpad'>同盟名</th>" +
											 "<th class='tpad'>君主名</th>" +
											 "</tr>";

								// 見出し
								q$("#search-result").append(tr);

								// 結果
								for (var i = 0; i < result.length; i++) {
									var tr = "<tr>" +
										"<td class='tpad'><a href='/alliance/manage_dep.php?p=" + result[i].page + "' target='_blank'>" + result[i].page + "ページ</a></td>" +
										"<td class='tpad'>" + result[i].alliance + "</td>" +
										"<td class='tpad'>" + result[i].name + "</td>";
									q$("#search-result").append(tr);
								}

								q$("#search-result-div").css({'display':'block'});
								q$("#search-result").css({'display': 'block'});

								q$("#search_status").text("ヒット数：" + result.length);
								q$("#search_sub").val("検索").prop("disabled", false);
							}
							wait = false;
						});
					}, AJAX_REQUEST_INTERVAL
				);
			}
		}
	}

	// 管理ページ
	if (location.pathname === "/alliance/manage.php") {
		if (g_beyond_options[ALLIANCE_31]) {
			// 管理ページから離反選択項目を消す
			q$("#gray02Wrapper table input[value='force_secession']").prop('disabled', true);
			q$("#gray02Wrapper table select[name='direction']").prop('disabled', true);
		}
	}

	// 報告書
	if (location.pathname === "/alliance/detail.php") {
		// 書式整形
		if (g_beyond_options[ALLIANCE_11]) {
			reformat_report(g_beyond_options[ALLIANCE_12]);
		}

	}
}

//----------------------------------------------------------------------
// デッキタブの実行制御
//----------------------------------------------------------------------
function deckTabControl() {
	// デッキ画面
	deckControl();

	// 領地一覧
	if (location.pathname === "/facility/territory_status.php" || location.pathname === "//facility/territory_status.php") {
		execFacilityPart();
	}

	// トレード画面
	if (location.pathname === "/card/trade.php") {
		execTradePart();
	}

	// トレード合成画面
	if (location.pathname.match(/union/)) {
		// 修行結果画面以外は小カード効果処理を実行
		if (location.pathname !== "/union/result_expup.php") {
			execUnionPart();
		}

		if (location.pathname === "/union/result_expup.php") {
			// 修行結果画面からステータス振り分け画面への遷移を追加
			if (g_beyond_options[DECK_31]) {
				if (q$("div[id='resultSuccess']").text().match(/Lvが[0-9]*上がり/)) {
					var list_a = q$("div[class*='continue-union-buttons-basepanel'] ul[class='continue-union-buttons'] li a");
					var cid = -1;
					for (var i = 0; i < list_a.length; i++) {
						var match = list_a.eq(i).attr('href').match(/cid=([0-9]*)/);
						if (match !== null) {
							cid = match[1];
							break;
						}
					}

					// カードIDが取れたらレベルアップボタンを作る
					if (cid > 0) {
						q$("div[class='front'] span[class='status_frontback']").append(
							"<span class='status_levelup'>" +
								"<a href='" + BASE_URL + "/card/status_info.php?cid=" + cid + "'>" +
									"<img src='/20160620-01/extend_project/w945/img/card/common/btn_levelup.png' alt='ステータス強化' title='ステータス強化' class='levelup'>" +
								"</a>" +
							"</span>"
						);
					}
				}
			}
		}
	}

	// 倉庫画面
	if (location.pathname === "/card/card_stock_file.php" || location.pathname === "/card/card_stock.php" || location.pathname === "/card/card_stock_file_confirm.php") {
		execStockPart();
	}

	// トレード履歴画面
	if (location.pathname === "/card/trade_history.php") {
		execTradeHistoryPart();
	}

	// トレード出品中画面
	if (location.pathname === "/card/exhibit_list.php") {
		execExhibitListPart();
	}

	// トレード入札中画面
	if (location.pathname === "/card/bid_list.php") {
		execBidListPart();
	}

	// 出品する画面
	if (location.pathname === "/card/trade_card.php") {
		execTradeCardPart();
	}
}

//----------------------//
// 報告書タブの実行制御 //
//----------------------//
function reportTabControl() {
	if (location.pathname === "/report/detail.php") {
		// 書式整形
		if (g_beyond_options[REPORT_01]) {
			reformat_report(g_beyond_options[REPORT_02]);
		}
	}

	if (location.pathname === "/report/list.php") {
		// 討伐ログの収集
		if (1) {
			getExpeditionTextReport();
		}
	}
}

// 討伐ログ収集
function getExpeditionTextReport() {
	// 全て、または攻撃ログ以外ではボタンを出さない
	if (!(location.href.indexOf("m=") < 0 || location.href.indexOf("m=attack") >= 0)) {
		return;
	}

	q$("#statMenu").after(
		"<div style='margin-left: 4px;'>" +
			"<input id='tsv_report_button' type='button' value='現ページの討伐・攻撃ログをTSV形式でテキスト出力する'></input>" +
		"</div>" +
		"<div id='result_box' style='position: absolute; background-color: #a9a9a9; display: none; margin-top: 4px;'>" +
			"<div style='background-color: #d3d3d3; margin: 2px;'>" +
				"<div style='margin-left: 4px; font-weight: bold;'>" +
					"<input id='close_result' style='margin-right: 4px;' type='button' value='閉じる'></input>" +
					"<span id='list_title'>報告書解析中</span>" +
				"</div>" +
				"<textarea id='result_tsv' cols='98' rows='20' style='overflow: scroll; margin: 4px; '></textarea>" +
				"<br><input id='close_result' type='button' value='閉じる'></input>" +
			"</div>" +
		"</div>"
	);

	// 閉じるボタン
	q$("#close_result").on('click',
		function() {
			q$("#tsv_report_button").prop('disabled', false);
			q$("#result_box").css('display', 'none');
		}
	);

	// TSV出力ボタン
	q$("#tsv_report_button").on('click',
		function() {
			q$("#tsv_report_button").prop('disabled', true);
			q$("#result_box").css('display', 'block');

			var trlist = q$("#gray02Wrapper table[class='tables'] tbody tr");

			var urllist = [];
			for (var i = 1; i < trlist.length; i++) {
				var td = trlist.eq(i).children('td');

				// 攻撃ログ以外は除外
				if (td.eq(1).children("img").attr("src").indexOf("icon_attack") < 0) {
					continue;
				}

				// アクセスURLの取得
				var url = td.eq(2).children("a").attr("href");
				urllist.push(url);
			}

			var wait = false;
			var count = 1;
			var max = urllist.length;
			var result = "";
			var timer1 = setInterval(
				function() {
					if (q$("#result_box").css('display') == 'none') {
						clearInterval(timer1);
						return;
					}

					if (wait) {
						return;
					}
					wait = true;

					q$("#list_title").text("報告書解析中・・・(" + count + "/" + max + ")");

					// 絶対パスになっている場合もあるので対策
					var requestUrl = urllist[count - 1];
					if (requestUrl.indexOf(SERVER_SCHEME) === -1) {
						requestUrl = BASE_URL + "/report/" + requestUrl;
					}

					q$.ajax({
						url: requestUrl,
						type: 'GET',
						datatype: 'html',
						cache: false
					})
					.done(function(res){
						var summary = [];
						var villageid = [];
						var resp = q$("<div>").append(res);

						// 見出し
						var trlist = q$("table[summary='件名'] tr", resp);
						var tdlist = trlist.eq(1).children("td");

						var match = tdlist.eq(1).html().match(/land.php\?x=([-]\d+)&amp;y=([-]\d+)/);
						summary.push(tdlist.eq(3).text().replace(/[\t\r\n]/g, ""));						// 日時
						summary.push(tdlist.eq(1).text().replace(/[\t\r\n]/g, ""));						// ログタイトル

						// 出兵先が空き地の場合、座標を出す
						if (match != null) {
							summary.push(match[1]);
							summary.push(match[2]);
						} else {
							summary.push("");
							summary.push("");
						}
						summary.push(tdlist.eq(2).children("div").text().replace(/[\t\r\n]/g, ""));		// 攻撃先の★数

						// 詳細
						var target = ['攻撃者', '防御者'];
						q$.each(target,
							function(index, val) {
								trlist = q$("table[summary='" + val + "'] tr", resp);

								// ターゲット、攻撃・防御者
								var thlist = trlist.eq(0).children("th");
								summary.push(thlist.eq(0).text().replace(/[\t\r\n]/g, ""));	// ターゲット
								summary.push(thlist.eq(1).text().replace(/[\t\r\n]/g, ""));	// 攻撃・防御者

								// 兵士詳細
								var alog = "";
								var dlog = "";
								for (var i = 0; i < 2; i++) {
									var alist = trlist.eq(i * 3 + 2).children("td");
									var dlist = trlist.eq(i * 3 + 3).children("td");
									for (var j = 0; j <= 6; j++, alog += "\t", dlog += "\t") {
										alog += alist.eq(j).text();
										dlog += dlist.eq(j).text();
									}
								}
								summary.push("兵士\t" + alog);
								summary.push("死傷\t" + dlog);
								summary.push("情報\t" + trlist.eq(7).children("td").text().replace(/[\t\r\n]/g, ""));
							}
						);

						// 資源
						trlist = q$("table[summary='資源の獲得'] tr", resp);
						if (trlist.length > 0) {
							summary.push("資源獲得情報\t" + trlist.eq(0).children("td").eq(0).text().replace(/[\t\r\n]/g, ""));
						}

						var result_line = "";
						for (var i = 0; i < summary.length; i++, result_line += "\t") {
							result_line += summary[i];
						}

						result += result_line + "\r\n";
						q$("#result_tsv").val(result);

						count++;
						if (count > max) {
							clearInterval(timer1);
							q$("#list_title").text("報告書解析完了");
						}
						wait = false;
					});
				}, AJAX_REQUEST_INTERVAL
			);
		}
	);
}

//--------------------//
// 書簡タブの実行制御 //
//--------------------//
function messageTabControl() {
	if (location.pathname == "/message/inbox.php") {
		// トレード書簡開封/削除
		if (g_beyond_options[NOTE_01] == true) {
			// コンパネ追加
			q$("#gray02Wrapper ul[id='statMenu']").after(
				"<fieldset style='-moz-border-radius:5px; border-radius: 5px; -webkit-border-radius: 5px; margin-bottom:6px; border: 2px solid black;'>" +
					"<div style='margin: 3px 3px 3px 3px;'>" +
						"<div>" +
							"<span class='bold-red' class='m4l'>運営書簡</span>" +
							"<input id='select_all' type='checkbox' class='m4l'>" +
								"<label for='select_all' class='m4l'>全て選択</label>" +
							"</input>" +
							"<input id='open_admin' type='button' class='m4l' value='開封する'>" +
							"<span id='open_info' style='margin-left:6px; font-weight: bold; float: right;'></span>" +
						"</div>" +
					"</div>" +
				"</fieldset>"
			);

			// 運営書簡全選択/全解除
			q$("#select_all").on('click',
				function() {
					// 運営ON(しました、されました含む)
					select_mail(q$(this).prop('checked'), true, false, false);
				}
			);

			// 落札しました書簡全選択/全解除
			q$("#select_buy").on('click',
				function() {
					// 運営OFF、しましたON、されましたOFF
					select_mail(q$(this).prop('checked'), false, true, false);
				}
			);

			// 落札されました書簡全選択/全解除
			q$("#select_sell").on('click',
				function() {
					// 運営OFF、しましたOFF、されましたON
					select_mail(q$(this).prop('checked'), false, false, true);
				}
			);

			// 運営書簡開封
			q$("#open_admin").on('click',
				function() {
					// 未読ON、既読OFF、削除OFF、運営ON
					open_mail(true, false, false, true, q$(location).attr('href').replace(/#ptop/, ""));
				}
			);

			// トレード書簡開封
			q$("#open_trade_mail").on('click',
				function() {
					// 未読ON、既読OFF、削除OFF、運営OFF、処理後の飛び先URL
					open_mail(true, false, false, false, q$(location).attr('href').replace(/#ptop/, ""));
				}
			);

			// トレード書簡開封済み削除
			q$("#remove_opened_trade_mail").on('click',
				function() {
					// 未読OFF、既読ON、削除ON、運営OFF、処理後の飛び先URL
					open_mail(false, true, true, false, q$(location).attr('href').replace(/#ptop/, ""));
				}
			);

			// トレード未読書簡開封削除
			q$("#remove_unread_trade_mail").on('click',
				function() {
					// 未読OFF、既読ON、削除ON、運営OFF、処理後の飛び先URL
					open_mail(true, true, true, false, q$(location).attr('href').replace(/#ptop/, ""));
				}
			);
		}
	}

	// 処理対象の書簡をすべて取得
	function get_target_mail(is_unread, is_opened, is_administrator, is_remove, is_forced) {
		var maillist = q$("table[class='commonTables'] tbody tr:has(td)");

		var urllist = [];
		if (is_administrator && is_remove) {
			return urllist;
		}

		for (var ct = 0; ct < maillist.length; ct++) {
			var selected = q$("td input", maillist[ct]).eq(0).prop('checked');
			var target = false;
			if (selected) {
				var title = q$("td a", maillist[ct]).eq(0).text();
				var author = q$("td:has(span[class='notice'])", maillist[ct]).text();
				if (author.match(/ブラウザ三国志運営チーム/) != null) {
					if (is_administrator) {
						target = true;
					} else if (title.match(/落札しました/) != null || title.match(/落札されました/) != null) {
						target = true;
					}
				}
			}

			if (target) {
				if (is_unread || is_forced) {
					// 未読または強制指定の場合は、未読文書のみ積み上げ
					if (q$(maillist[ct]).attr('class') == 'unread') {
						urllist[urllist.length] = q$("td a", maillist[ct]).eq(0).attr('href');
					}
				}
				if (is_opened || is_forced) {
					// 既読または強制指定の場合は、既読文書を積み上げ
					if (q$(maillist[ct]).attr('class') != 'unread') {
						urllist[urllist.length] = q$("td a", maillist[ct]).eq(0).attr('href');
					}
				}
			}
		}

		return urllist;
	}

	// 書簡を選択する
	function select_mail(is_select, is_administrator, is_trade_buy, is_trade_sell) {
		var maillist = q$("table[class='commonTables'] tbody tr:has(td)");
		for (var ct = 0; ct < maillist.length; ct++) {
			// 保護書簡は無視
			var lock = q$("td:has(img[src*='icon_lock'])", maillist[ct]);
			if (lock.length > 0) {
				continue;
			}

			// 条件に合致する書簡にチェックをつける
			var author = q$("td:has(span[class='notice'])", maillist[ct]).text();
			var title = q$("td a", maillist[ct]).eq(0).text();
			if (is_administrator && author.match(/ブラウザ三国志運営チーム/) != null) {
				q$("td input", maillist[ct]).eq(0).prop('checked', is_select);
			} else if (is_trade_buy && author.match(/ブラウザ三国志運営チーム/) != null && title.match(/落札しました/) != null) {
				q$("td input", maillist[ct]).eq(0).prop('checked', is_select);
			} else if (is_trade_sell && author.match(/ブラウザ三国志運営チーム/) != null && title.match(/落札されました/) != null) {
				q$("td input", maillist[ct]).eq(0).prop('checked', is_select);
			}
		}
	}

	// 書簡を開く
	function open_mail(is_unread, is_opened, is_remove, is_administrator, render_url) {
		// 対象書簡の取得
		var openurl = get_target_mail(is_unread, is_opened, is_administrator, false, false);
		if (openurl.length == 0) {
			alert("処理対象の書簡がありませんでした");
			return;
		}

		// 既読化処理
		q$("#open_info").text("");	// 進捗表示クリア
		var wait = false;
		if (openurl.length > 0 && is_unread) {
			var pos = 0;
			var timer = setInterval(
				function() {
					if (wait) {
						return;
					}
					wait = true;

					if (is_opened) {
						q$("#open_info").text("書簡開封確認＆開封中：" + parseInt(pos+1) + " / " + openurl.length);
					} else {
						q$("#open_info").text("書簡開封中：" + parseInt(pos+1) + " / " + openurl.length);
					}

					q$.ajax({
						url: BASE_URL + '/message/' + openurl[pos],
						type: 'GET',
						datatype: 'html',
						cache: false
					})
					.done(function(res) {
						pos++;
						if (pos >= openurl.length) {
							clearInterval(timer);
							q$("#open_info").text("");	// 進捗表示クリア

							// 開封後削除の指定があるばあいは削除(強制指定あり)
							if (is_remove) {
								remove_mail(is_administrator, true, render_url);
							} else {
								location.href = render_url;
							}
						}
						wait = false;
					});
				}, 150
			);
		} else if (is_opened) {
			// 既読削除の指定があるばあいは削除(強制指定なし)
			remove_mail(is_administrator, false, render_url);
		}
	}

	// 書簡一括削除
	function remove_mail(is_administrator, is_forced, render_url) {
		// 削除対象を全て取得(未読OFF、既読ON、remove指定）
		var remove_url = get_target_mail(false, true, is_administrator, true, is_forced);
		if (remove_url.length == 0) {
			alert("処理対象の書簡がありませんでした");
		}

		var post_target = [];
		var mode = "";
		var page = "";
		for (var i = 0; i < remove_url.length; i++) {
			var match = remove_url[i].match(/id=(\d+)&m=(.*)&p=(\d+)/);
			post_target[post_target.length] = RegExp.$1;
			if (i == 0) {
				mode = RegExp.$2;
				page = RegExp.$3;
			}
		}

		// 書簡の削除
		q$("#open_info").text("");
		if (post_target.length > 0) {
			q$("#open_info").text("書簡削除中");
			var target_url = BASE_URL + '/message/delete.php';
			var param = {'chk':post_target, 'mode':mode, 'p':page};

			q$.ajax({
				url: target_url,
				type: 'POST',
				datatype: 'html',
				cache: false,
				data: param
			})
			.done(function(res) {
				q$("#open_info").text("");	// 進捗表示クリア
				location.href = render_url;
			});
		}
	}

	if (location.pathname == "/message/detail.php") {
		// gyazo展開
		if (g_beyond_options[NOTE_02] == true) {
			show_message_image();
		}
	}
}

//------------------------//
// ブショーダスの実行制御 //
//------------------------//
function busyodasControl() {
	// ブショーダス結果
	if (location.pathname == "/busyodas/busyodas_result.php") {
		if (g_history_mode == false && g_beyond_options[BUSYODAS_01] == true) {
			q$("table[summary='取得カード情報']").after(
				"<fieldset class='rad-box' style='width: 250px;'>" +
					"<div style='margin: 3px 3px 3px 3px;'>" +
						"<span style='font-weight: bold; color: blue;'>カードの出品</span>" +
						"<span style='margin-left: 6px;'>" +
							"<input type='button' id='sell-price-check-button' value='即落調査'></input>" +
						"</span>" +
						"<span id='sell_frame'></span>" +
					"</div>" +
				"</fieldset>"
			);

			// 即時落札価格取得イベントの定義
			q$("#sell-price-check-button").on('click',
				function() {
					var cardno = q$("#gray02Wrapper div[class='cardWrapper'] span[class='cardno']").text();
					searchBuyRate("sell-price-check-button", cardno, false);
				}
			);

			var base = q$("div[id*=cardWindow_]");
			var cardid = base.attr("id").replace(/cardWindow_/, "");
			var cardno = base.find("span[class='cardno']").text();
			var rarity = base.find("span[class='rarerity'] img").attr('title');

			// 固定出品ボタンを出す場合、最後がtrue
			createSellBox("sell_frame", "0", cardid, cardno, rarity, g_beyond_options[BUSYODAS_02]);
		}
	}

	// 武将カード入手履歴
	if (location.pathname == "/busyodas/busyodas_history.php") {
		if (g_beyond_options[BUSYODAS_11]) {
			q$("table[class='commonTables'] tbody tr").each(
				function() {
					// トレード・図鑑リンク作成
					if (1) {
						// カードNo.にトレードリンクを作成
						var elem = q$("td", this).eq(0);
						var cardno = elem.text();
						elem.html(
							"<a href='" + BASE_URL + "/card/trade.php?t=no&k=" + cardno + "&tl=1&s=price&o=a&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>" + cardno + "</a>"
						);

						// 武将名に図鑑リンクを作成
						elem = q$("td", this).eq(2);
						elem.html(
							"<a href='" + BASE_URL + "/card/busyo_data.php?search_options=&q=&status=&ability_type=&ability_value=&sort=card-no-asc&search_mode=detail&view_mode=&double_skill_height=&card_number=" + cardno + "' target='_blank'>" + elem.text() + "</a>"
						);
					}
				}
			);
		}
	}
}

//--------------------//
// 武将図鑑の実行制御 //
//--------------------//
function cardbookControl() {
	if (location.pathname == "/card/busyo_search.php") {
		// 図鑑オプション有効時
		if (g_beyond_options[BOOK_01] == true || g_beyond_options[BOOK_02] == true) {
			q$("#busyo-search-result-basic tbody tr").each(
				function(index) {
					if (q$("td[class='center card-no']", this).length == 0) {
						return;
					}

					// トレードリンク作成
					if (g_beyond_options[BOOK_01] == true) {
						var cardno = q$("td[class='center card-no']", this).text();
						q$("td[class='center card-no']", this).html(
							"<a href='" + BASE_URL + "/card/trade.php?t=no&k=" + cardno + "&tl=1&s=price&o=a&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>" + cardno + "</a>"
						);
						var elem = q$("td[class='left skill'] a", this);
						for (var i = 0; i < elem.length; i++) {
							var match = elem.eq(i).text().match(/(.*)LV[0-9]*/);
							if (match) {
								elem.eq(i).after(
									"<a href='" + BASE_URL + "/card/trade.php?s=price&o=a&t=skill&k=" + match[1] + "&tl=1&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>(T)</a>"
								);
							}
						}
					}

					// 即時落札
					if (g_beyond_options[BOOK_02] == true) {
						q$("td[class*='busyo-name']", this).append(
							"<div style='font-size: 14px;'>" +
								"<input type='button' id='sell-price-check-button" + index + "' value='即落調査' style='font-size: 12px;'></input>" +
							"</div>"
						);

						// 即時落札価格取得イベントの定義
						q$("input[id='sell-price-check-button" + index + "']").on('click',
							function() {
								cardno = q$(this).parents("tr").children("td[class='center card-no']").text();
								searchBuyRate(q$(this).attr("id"), cardno, true);
							}
						);
					}
				}
			);
		}
	}

	if (location.pathname == "/card/busyo_data.php") {
		if (g_beyond_options[BOOK_99] == true) {
			//--------------------------------------------------------------------//
			// 新規スキル追加時の補正検証用に、スキル補正機能を図鑑に対応しておく //
			//--------------------------------------------------------------------//
			var id_name = "auto_calc";
			var select_id = id_name + '_select';
			var addHtml = "<div style='margin-bottom: 4px;'><select id='" + select_id + "' name='" + select_id + "' style='width: 220px;'><option value=''>指定なし</option>";

			var skills = q$("ul[class='back_skill'] li");
			for (var j = 0; j < skills.length; j++) {
				var skill = skills.eq(j).children("span[class*=skillName]").text().replace(/[ \t\r\n]/g, "");
				var skill_text = skills.eq(j).children("div[class*=skill]").text().replace(/[ \t\r\n]/g, "");
				if (skill != "") {
					if (is_healing_skill(skill_text) == true) {
						skill += " (回復)";
					}
					addHtml += "<option value='" + j + "'>" + skill + "</option>";
				}
			}
			addHtml += "</select>";
			q$("div[class='card_frontback-front']").eq(0).before(addHtml);

			// 各スキル値に補正枠を追加
			q$("div[class*='omote_4sk']").each(
				function(index) {
					// 兵種への直接アクセス導線を作る
					q$("span[class='soltype-for-sub']", this).attr('id', 'sol_type');

					// Lカードだけ着色を赤ではなく紫色にするため、レアリティ判定をする
					var color = "red";
					if (q$(this).parent().attr('class').match(/_l$/)) {
						color = "violet";
					}

					// ステータス値への直接アクセス導線を作る
					var status_list = q$("ul[class='status'] li", this);
					for (var j = 0; j < status_list.length; j++) {
						var cname = status_list.eq(j).attr('class');
						var match = cname.match(/status_([a-z]*)/);
						var status_value = status_list.eq(j).text();

						status_list.eq(j).attr({'id':'status_n_0', 'status':match[1]});
						status_list.eq(j).after(
							"<li id='status_p_0' status='" + match[1] + "' style='display: none; color: " + color + ";' class='" + cname + "'>" + status_value + "</li>"
						);
					}

					// スキル説明文への直接アクセス導線を作る
					q$("ul[class='back_skill'] li div[class*='skill']", q$(this).parents("div[class='busyo-search-result_card-detail clearfix']")).each(
						function(index) {
							q$(this).attr('id', 'skill_text_' + index);
						}
					);
				}
			);

			// スキル選択時のイベント
			q$("select[id*='auto_calc_']").change(
				function() {
					var target = q$(this).parent().parent();
					correct_status(
						"",
						q$(this).prop('selectedIndex') - 1,
						q$("div[id*='skill_text']", target),
						q$("span[id='sol_type'] img", target).eq(0).attr('title').substr(0,1),
						q$("li[id*='status_n']", target),
						q$("li[id*='status_p']", target),
						null,
						null
					);
				}
			);

			// 初期選択
			correct_status(
				"",
				-1,
				q$("div[id*='skill_text']"),
				q$("span[id='sol_type'] img").eq(0).attr('title').substr(0,1),
				q$("li[id*='status_n']"),
				q$("li[id*='status_p']"),
				null,
				null
			);
		}
	}
}

//----------------------//
// スキル図鑑の実行制御 //
//----------------------//
function skillbookControl() {
	if (location.pathname == "/skill_book/skill_book.php") {
		// スキル一覧にトレードリンク追加
		if (g_beyond_options[BOOK_11] == true) {
			q$("table[class='skill-search-result_tbl'] tbody tr").each(
				function(index) {
					var elem = q$(this).children("td").eq(0).children("a");
					var skill = elem.text().replace(/LV1/, "");
					elem.after(
						"<a href='" + BASE_URL + "/card/trade.php?s=price&o=a&t=skill&k=" + skill + "&tl=1&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>(T)</a>"
					);
				}
			);
		}
	}

	if (location.pathname == "/skill_book/skill_detail.php") {
		// スキル詳細にトレードリンク追加
		if (g_beyond_options[BOOK_11] == true) {
			q$("table[class='skill-detail_tbl mb10'] tbody tr td a").each(
				function() {
					var skill = q$(this).text();
					if (skill.match(/所持/)) {
						return;
					}

					q$(this).after(
							"<a href='" + BASE_URL + "/card/trade.php?s=price&o=a&t=skill&k=" + skill + "&tl=1&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>(T)</a>"
					);
				}
			);
		}
	}
}

//------------------------//
// 建設・内政系の実行制御 //
//------------------------//
function internalControl() {
	if (location.pathname == "/facility/unit_confirm.php") {
		// 生産時間チェッカー
		if (g_beyond_options[VILLAGE_01] == true) {
			var settingHours = parseInt(g_beyond_options[VILLAGE_02]);
			var time = q$("table[class='commonTables'] tr").eq(2).children("td").text();
			if (time != null || time != undefined) {
				var match = time.match(/(\d+):\d+:\d+/);
				if (parseInt(RegExp.$1) >= settingHours) {
					q$("table[class='commonTables'] tr").eq(2).children("td").html(
						"<span>" + time + "</span>" +
						"<span style='color:red'>兵士生産時間が" + settingHours + "時間を超えています。スキルを確認してください。</span>"
					);
					q$("#btn_send").css("display", "none");
				}
			}
		}
	}
}

//----------------------------------------------------------------------
// 出兵系の実行制御
//----------------------------------------------------------------------
function troopControl() {
	if (location.pathname === "/facility/castle_send_troop.php") {
	}
}

//----------------------------------------------------------------------
// デッキの実行制御
//----------------------------------------------------------------------
function deckControl() {
	if (location.pathname !== "/card/deck.php" && location.pathname !== "/card/event_battle_attack.php" && location.pathname !== "/card/set_subgeneral.php") {
		return;
	}

	// レイドデッキ限定処理
	if (location.pathname === "/card/event_battle_attack.php") {
		return;
	}

	// 副将設定画面限定処理
	if (location.pathname === "/card/set_subgeneral.php") {
		// パッシブ着色、スキル使用OFF、スキル効果計算、簡易デッキセット
		addSkillViewOnSmallCardDeck(g_beyond_options[DECK_01], false, false, false);
		return;
	}

	// 運営のデッキのマージン枠が広すぎるので減らす
	q$("#cardListDeck").css('margin-bottom', '10px');
	// 一括デッキ解除
	if (g_beyond_options[DECK_17]) {
		addAllDropDeckButton();
	}

	// 簡易デッキ解除
	if (g_beyond_options[DECK_15] == true) {
		addDropDeckCard();
	}

	// 簡易内政官解除
	if (g_beyond_options[DECK_16] == true) {
		addDropDomesticDeckCard();
	}

	// デッキモード取得
	if (getDeckModeSmall() == false) {
		return;
	}

	// 一括デッキセット
	if (g_beyond_options[DECK_18] == true) {
		multipleDeckSet();
	}

	// 一括ラベルセット
	if (g_beyond_options[DECK_1B] == true) {
		multipleLabelSet();
	}

	if (g_beyond_options[DECK_11] == true) {
		// スキル回復時間調査
		deck_resttime_checker();
	}

	// トレードリンク作成
	if (g_beyond_options[DECK_02] == true) {
		addTradeLinkOnSmallCardDeck();
	}

	// ページ切り替え簡略化
	if (g_beyond_options[DECK_03] == true) {
		createPagerPulldown();
	}

	// パッシブ着色、スキル使用、スキル効果計算、簡易デッキセット
	addSkillViewOnSmallCardDeck(g_beyond_options[DECK_01], g_beyond_options[DECK_13], g_beyond_options[DECK_12], g_beyond_options[DECK_14]);
}

// ページャープルダウンの作成
function createPagerPulldown() {
	// 最大ページ番号の取得
	var max = 1;
	var default_params = "";
	if (q$("#rotate ul[class=pager]").length > 0) {
		var pages = q$("#rotate ul[class=pager] li");
		for (var i = 0; i < pages.length; i++) {
			var page = parseInt(q$(pages[i]).text());
			if (!isNaN(page) && max < page) {
				max = page;
			}
		}

		default_params = q$("#rotate ul[class=pager] li a").eq(0).attr('href').replace(/^.*\?/, "?");
	} else {
		return;
	}

	if (max != 1) {
		// 現在ページ
		var match = location.href.match(/p=(\d+)/);
		var now = 1;
		if (match != null) {
			now = parseInt(match[1]);
		}

		var html = "<select id='page_change'>";
		for (var i = 1; i <= max; i++) {
			if (i == now) {
				html += "<option value='" + i + "' selected>" + i + "ページ</option>";
			} else {
				html += "<option value='" + i + "'>" + i + "ページ</option>";
			}
		}
		q$("#rotate ul[class='pager']").append(
			"<span style='margin-left: 4px;'>" +
				html +
			"</span>"
		);
		q$("#rotate div.rotateInfo ul.pager").css('width', '550px');

		q$("select[id='page_change']").on('change',
			function() {
				var default_params = "";
				if (q$("#rotate ul[class=pager]").length > 0) {
					var pages = q$("#rotate ul[class=pager] li a");
					for (var i = 0; i < pages.length; i++) {
						var page = parseInt(q$(pages[i]).attr("title"));
						if (!isNaN(page) && max < page) {
							max = page;
						}
					}
					default_params = pages.eq(0).attr('href').replace(/^.*\?/, "?");
				} else {
					return;
				}

				var page = q$("option:selected", this).val();
				var redirect_url = "";
				if (default_params.indexOf("&p=") < 0 || default_params.indexOf("?p=") < 0) {
					redirect_url = default_params.replace(/p=\d+/, "p=" + page);
					redirect_url = redirect_url.replace(/&l=0/, "");
				} else {
					if (default_params.indexOf("?") < 0) {
						redirect_url = default_params.replace(/\.php/, ".php?p=" + page);
					} else {
						redirect_url = default_params.replace(/\?/, "?p=" + page);
					}
				}
				location.href = location.pathname + redirect_url;
			}
		);
	}
}

//------------------//
// その他の実行制御 //
//------------------//
function anyControl() {
	// レイド用のショートカットを右メニューに追加
	if (g_beyond_options[ANY_01] == true) {
		var battle_event = q$("#sidebar ul li:has(a[href*='/card/event_battle_top.php'])");
		if (battle_event.length == 1) {
			// 対象選択用select box
			var addHtml = "<div>" +
				"<select id='event_target_select' name='event_target'>" +
					"<option value='3'>ワールド</option>" +
					"<option value='2'>同盟</option>" +
					"<option value='1'>参戦中</option>" +
				"</select>" +
				"<select id='event_type_select' name='event_type' style='margin-left: 2px;'>" +
					"<option value='-1'>全て</option>" +
					"<option value='1'>攻撃</option>" +
					"<option value='2'>防御</option>" +
					"<option value='3'>知力</option>" +
					"<option value='4'>速度</option>" +
				"</select>" +
				"</div>" +
				"<div style='margin-top: 2px;'>" +
					"<span style='color: white; margin-right: 2px;'>No.</span>" +
					"<input id='event_target_id' size=6 value=''></input>" +
					"<input id='event_submit' type='button' value='実行'></input>" +
				"</div>";
			battle_event.eq(0).append(addHtml);

			q$("#event_submit").on('click',
				function() {
					var scope = q$("#event_target_select option:selected").val();
					var filter_damage = q$("#event_type_select option:selected").val();
					var battle_id = q$("#event_target_id").val();
					if (scope != 1) {
						if (!isNaN(parseInt(battle_id)) != "") {
							location.href = BASE_URL + "/card/event_battle_top.php?filter_damege=" + filter_damage + "&filter_hp=-1&scope=" + scope + "&battle_id=" + battle_id;
						} else {
							location.href = BASE_URL + "/card/event_battle_top.php?filter_damege=" + filter_damage + "&filter_hp=-1&scope=" + scope + "&battle_id=";
						}
					} else {
						location.href = BASE_URL + "/card/event_battle_top.php?scope=" + scope;
					}
				}
			);
		}
	}

	// 個人掲示板の領地座標をリンクに変換
	if (location.pathname == "/bbs/personal_res_view.php") {
		if (g_beyond_options[ANY_02] == true) {
			var colist = q$("table[class='commonTables'] td[class='contents']");
			for (var i = 0; i < colist.length; i++) {
				var match = colist.eq(i).html().match(/\([-]*[0-9]+,[-]*[0-9]+\)/g);
				if (match == null) {
					continue;
				}

				var html = colist.eq(i).html();
				for (var j = 0; j < match.length; j++) {
					var m = match[j].match(/([-]*[0-9]+),([-]*[0-9]+)/);
					html = html.replace(
						match[j],
						"<a href='" + BASE_URL + "/map.php?x=" + m[1] + "&y=" + m[2] + "' target='_blank'>" + match[j] + "</a>"
					);
				}
				colist.eq(i).html(html);
			}
		}
	}
}

//------------------//
// 全画面共通の処理 //
//------------------//
function execCommonPart() {
	// プルダウンメニュー
	if (g_beyond_options[COMMON_02] == true) {
		// 運営のプルダウンメニューを消す
		q$("#menu_container").remove();

		// 独自のメニューを追加
		var cardnourl = BASE_URL + '/card/trade.php?t=no&tl=1&s=price&o=a&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1&k=';
		var nameurl = BASE_URL + '/card/trade.php?t=name&tl=1&s=&o=&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1&sub=&e-type=0&e-group=0&e-rarity=0&k=';
		var sklurl = BASE_URL + '/card/trade.php?t=skill&tl=1&s=&o=&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1&sub=&e-type=0&e-group=0&e-rarity=0&k=';
		var alurl = BASE_URL + '/alliance';
		var alogurl = alurl + '/alliance_log.php';
		var facurl = BASE_URL + '/facility';
		var facsturl = facurl + '/unit_status.php';

		var loc = q$("li.gnavi02 a").attr('href');
		var menus = [
			// 都市
			[
				['同盟拠点', BASE_URL + '/alliance/village.php'], ['プロフィール', BASE_URL + '/user/'],
			],
			// 全体地図
			[
				['11x11', loc + '&type=1'], ['15x15', loc + '&type=2'], ['21x21', loc + '&type=5'], ['51x51', loc + '&type=4'],
			],
			// 同盟
			[
				['同盟ログ', BASE_URL + '/alliance/alliance_log.php',
					[
						['全て', alogurl], ['攻撃', alogurl + '?m=attack'], ['防御', alogurl + '?m=defense'], ['偵察', alogurl + '?m=scout'],
						['破壊', alogurl + '?m=fall'], ['援軍', alogurl + '?m=reinforcement'], ['同盟', alogurl + '?m=alliance'],
					],
				],
				['ランキング', alurl + '/ranking.php'], ['勢力リスト', alurl + '/dependency.php'], ['同盟掲示板', BASE_URL + '/bbs/topic_view.php'],
				['同盟スキル', alurl + '/alliance_skill.php'],
				['管理', alurl + '/manage.php'],
				['配下同盟管理', alurl + '/manage_dep.php'],
			],
			// デッキ
			[
				['城トップ', facurl + '/castle.php'],
				['兵士管理', facsturl,
					[
						['全て', facsturl + '?type=all'], ['待機', facsturl + '?type=wait'], ['援軍先待機', facsturl + '?type=help_wait'],
						['出撃', facsturl + '?type=sortie'], ['予約', facsturl + '?type=reserve'], ['帰還', facsturl + '?type=return'],
						['援軍', facsturl + '?type=help'], ['敵襲', facsturl + '?type=enemy'], ['偵察', facsturl + '?type=scout'],
					],
				],
				['領地管理', facurl + '/territory_status.php'],
				['出兵', facurl + '/castle_send_troop.php'],
				['内政設定', BASE_URL + '/card/domestic_setting.php'],
				['デッキ', BASE_URL + '/card/deck.php',
					[
						['カード入手履歴', BASE_URL + '/busyodas/busyodas_history.php'],
						['カード一括破棄', BASE_URL + '/card/allcard_delete.php'],
					],
				],
				['合成', BASE_URL + '/union/index.php',
					[
						['合成履歴', BASE_URL + '/union/union_history.php'],
					],
				],
				['トレード', BASE_URL + '/card/trade.php',
					[
						['一覧', BASE_URL + '/card/trade_card_list.php'],
						['出品中', BASE_URL + '/card/exhibit_list.php'],
						['入札中', BASE_URL + '/card/bid_list.php'],
						['出品する', BASE_URL + '/card/trade_card.php'],
					],
				],
				['カード倉庫', BASE_URL + '/card/card_stock_file.php',
					[
						['ファイル', BASE_URL + '/card/card_stock_file.php'],
						['ストック', BASE_URL + '/card/card_stock.php'],
					],
				],
				['トレード検索', '',
					[
						['スキル別', '',
							[
								['HP回復', '',
									[
										['仁君', sklurl + '仁君'], ['弓腰姫の愛', sklurl + '弓腰姫の愛'], ['桃色吐息', sklurl + '桃色吐息'],
										['神医の施術', sklurl + '神医の施術'], ['神医の術式', sklurl + '神医の術式'], ['発憤興起', sklurl + '発憤興起'],
										['酔吟吐息', sklurl + '酔吟吐息'], ['神卜の方術', sklurl + '神卜の方術'],
									]
								],
								['討伐回復', '',
									[
										['傾国', sklurl + '傾国'], ['才女の瞳', sklurl + '才女の瞳'], ['○○の慈愛', sklurl + '慈愛'],
									]
								],
								['スキル回復', '',
									[
										['優雅な調べ', sklurl + '優雅な調べ'], ['勇姫督励', sklurl + '勇姫督励'],
									]
								],
								['耐久回復', '',
									[
										['城壁補強', sklurl + '城壁補強'],
									]
								],
								['鹵獲通常', '',
									[
										['趁火打劫', sklurl + '趁火打劫'], ['桃賊の襲撃', sklurl + '桃賊の襲撃'], ['迅速劫略', sklurl + '迅速劫略'],
										['神速劫略', sklurl + '神速劫略'], ['○○の縮地劫略', sklurl + '縮地劫略'], ['猛将の鹵獲', sklurl + '猛将の鹵獲'],
										['鬼神の鹵獲', sklurl + '鬼神の鹵獲'], ['劉備の大徳', sklurl + '劉備の大徳'],
									],
								],
								['鹵獲自動', '',
									[
										['鹵獲の進攻', sklurl + '鹵獲の進攻'], ['鹵獲の強攻', sklurl + '鹵獲の強攻'], ['鹵獲の猛攻', sklurl + '鹵獲の猛攻'],
										['鹵獲の極攻', sklurl + '鹵獲の極攻'], ['収奪の猛攻', sklurl + '収奪の猛攻'], ['収奪の極攻', sklurl + '収奪の極攻'],
									],
								],
							],
						],
						['素材別', '',
							[
								['神医の術式', '',
									[
										['傾国', sklurl + '傾国'], ['劉備の大徳', sklurl + '劉備の大徳'], ['○○の天恵沢', sklurl + '天恵沢'],
										['○○の檄文', sklurl + '檄文'], ['神算鬼謀', sklurl + '神算鬼謀'], ['○○の慈愛', sklurl + '慈愛'],
										['大皇帝', sklurl + '大皇帝'], ['臥竜覚醒', sklurl + '臥竜覚醒'], ['群雄の極撃', sklurl + '群雄の極撃'],
										['神医の施術', sklurl + '神医の施術'], ['皇叔の号令', sklurl + '皇叔の号令'], ['万華招来', sklurl + '万華招来'],
										['徳義為政', sklurl + '徳義為政'], ['○○の義勇軍', sklurl + '義勇軍'], ['神卜の方術', sklurl + '神卜の方術'],
									],
								],
								['神医の施術', '',
									[
										['孫呉の烈火', sklurl + '孫呉の烈火'], ['天華招来', sklurl + '天華招来'],
									],
								],
								['傾国', '',
									[
										['市場繁栄', sklurl + '市場繁栄'], ['月下羽衣', sklurl + '月下羽衣'], ['皇后の慈愛', sklurl + '皇后の慈愛'],
										['才媛○○', sklurl + '才媛'], ['文姫の慈愛', sklurl + '文姫の慈愛'], ['○○の祈り', sklurl + '祈り'],
										['王佐の才', sklurl + '王佐の才'], ['勇美鼓舞', sklurl + '勇美鼓舞'], ['賢妃施政', sklurl + '賢妃施政'],
									],
								],
								['飛将', '',
									[
										['賢妃施政', sklurl + '賢妃施政'], ['龍神の縮地劫略', sklurl + '龍神の縮地劫略'], ['天華招来', sklurl + '天華招来'],
										['覇王の進撃', sklurl + '覇王の進撃'], ['軍神', sklurl + '軍神'], ['弓将の采配', sklurl + '弓将の采配'],
										['魏武王', sklurl + '魏武王'], ['苦肉の計', sklurl + '苦肉の計'], ['神飛将', sklurl + '神飛将'],
										['憂姫護国', sklurl + '憂姫護国'], ['隻眼将の軍略', sklurl + '隻眼将の軍略'], ['聡明叡知', sklurl + '聡明叡知'],
										['背水陣の極攻', sklurl + '背水陣の極攻'],
									],
								],
								['護君', '',
									[
										['洛神の舞', sklurl + '洛神の舞'], ['○○の大天撃', sklurl + '大天撃'], ['全軍の飛速令', sklurl + '全軍の飛速令'],
										['龍神の縮地劫略', sklurl + '龍神の縮地劫略'], ['全軍の大極攻令', sklurl + '全軍の大極攻令'], ['天華招来', sklurl + '天華招来'],
										['お菓子の攻奪', sklurl + 'お菓子の攻奪'], ['不撓不屈', sklurl + '不撓不屈'], ['優姫の敬愛', sklurl + '優姫の敬愛'],
										['勇猛果敢', sklurl + '勇猛果敢'], ['勇姫督励', sklurl + '勇姫督励'], ['堅忍不抜', sklurl + '堅忍不抜'],
										['暴姫の威令', sklurl + '暴姫の威令'],
									],
								],
							],
						],
						['特殊', '',
							[
								['UR水鏡', cardnourl + 4079], ['SR水鏡', cardnourl + 4080], ['R水鏡', cardnourl + 4081], ['UC水鏡', cardnourl + 4082],
								['パンダ', nameurl + 'パンダ'], ['全軍攻撃', sklurl + '攻令'], ['全軍速度', sklurl + '速令'],
							],
						],
					],
				],
				['トレード獲得履歴', BASE_URL + '/card/trade_history.php?mode=buy'],
				['トレード放出履歴', BASE_URL + '/card/trade_history.php?mode=sell'],
			],
			// アイテム
			[
				['便利アイテム', BASE_URL + '/item/index.php'],
				['受信箱', BASE_URL + '/item/inbox.php'],
			],
			// 統計
			[
				['全体', BASE_URL + '/conditions/top.php'],
				['同盟', BASE_URL + '/alliance/npc_mastery_ranking.php'],
				['個人', BASE_URL + '/user/ranking.php',
					[
						['総合', BASE_URL + '/user/ranking.php'],
						['人口', BASE_URL + '/user/ranking.php?m=population'],
						['攻撃', BASE_URL + '/user/ranking.php?m=attack'],
						['防御', BASE_URL + '/user/ranking.php?m=defense'],
						['撃破スコア', BASE_URL + '/user/ranking.php?m=attack_score'],
						['防衛スコア', BASE_URL + '/user/ranking.php?m=defense_score'],
						['デュエル', BASE_URL + '/user/ranking.php?m=duel'],
						['期間', BASE_URL + '/user/period_ranking.php'],
						['週間', BASE_URL + '/user/weekly_ranking.php'],
					],
				],
			],
			// 報告書
			[
				['全て', BASE_URL + '/report/list.php?u='],
				['攻撃', BASE_URL + '/report/list.php?m=attack&u='],
				['防御', BASE_URL + '/report/list.php?m=defence&u='],
				['偵察', BASE_URL + '/report/list.php?m=scout&u='],
				['破壊', BASE_URL + '/report/list.php?m=fall&u='],
				['援軍', BASE_URL + '/report/list.php?m=reinforcement&u='],
				['同盟', BASE_URL + '/report/list.php?m=alliance&u='],
			],
			// 書簡
			[
				['受信箱', BASE_URL + '/message/inbox.php'],
				['送信履歴', BASE_URL + '/message/outbox.php'],
				['新規作成', BASE_URL + '/message/new.php'],
				['ブラックリスト', BASE_URL + '/message/black_list/black_list.php'],
			],
			// クエスト
			[
				['すべて', BASE_URL + '/quest/index.php?list=1&p=1&action=apply_condition&disp_mode=0&scroll_pos=0&selected_tab=1'],
				['基本', BASE_URL + '/quest/index.php?list=1&p=1&action=apply_condition&disp_mode=0&scroll_pos=0&selected_tab=2'],
				['内政', BASE_URL + '/quest/index.php?list=1&p=1&action=apply_condition&disp_mode=0&scroll_pos=0&selected_tab=3'],
				['戦闘', BASE_URL + '/quest/index.php?list=1&p=1&action=apply_condition&disp_mode=0&scroll_pos=0&selected_tab=4'],
				['同盟', BASE_URL + '/quest/index.php?list=1&p=1&action=apply_condition&disp_mode=0&scroll_pos=0&selected_tab=5'],
				['武将', BASE_URL + '/quest/index.php?list=1&p=1&action=apply_condition&disp_mode=0&scroll_pos=0&selected_tab=6'],
				['繰り返し', BASE_URL + '/quest/index.php?list=1&p=1&action=apply_condition&disp_mode=0&scroll_pos=0&selected_tab=7'],
				['期間限定', BASE_URL + '/quest/index.php?list=1&p=1&action=apply_condition&disp_mode=0&scroll_pos=0&selected_tab=8'],
				['デイリー受領', 'id:receipt_quest'],
			],
		];

		// メニューの生成(プルダウン+3階層サイドメニュー)
		var html = "<ul class='menu clearfix'>";
		for (var g = 0; g < menus.length; g++) {	// メニューグループ
			html += "<li class='multi'><ul class='second'>";

			// メニュ－ > 縦リスト
			for (var v = 0; v < menus[g].length; v++) {
				html += "<li>";
				if (menus[g][v].length == 2) {
					// 固定メニュー（メニュ－ > 縦リスト）
					if (menus[g][v][1].match(/^id:/) == null) {  // id駆動のメソッド実行をこのレベルに追加（クエスト対応）
						if (menus[g][v][1] != '') {
							html += "<a href='" + menus[g][v][1] + "'>" + menus[g][v][0] + "</a>";
						} else {
							html += "<div>" + menus[g][v][0] + "</div>";
						}
					} else {
						html += "<div class='pointer' id='" + menus[g][v][1].replace(/^id:/,'') + "'>" + menus[g][v][0] + "</div>";
					}
				} else {
					// サブメニュー（メニュ－ > 縦リスト >）
					if (menus[g][v][1] != '') {
						html += "<a href='" + menus[g][v][1] + "' class='init-right'>" + menus[g][v][0] + "</a>";
					} else {
						html += "<div class='init-right'>" + menus[g][v][0] + "</div>";
					}

					html += "<ul class='third'>";
					var sub1 = menus[g][v][2];
					for (var s1 = 0; s1 < sub1.length; s1++) {
						html += "<li>";
						if (sub1[s1].length == 2) {
							// 固定メニュー（メニュ－ > 縦リスト > 横リスト）
							if (sub1[s1][1] != '') {
								html += "<a href='" + sub1[s1][1] + "'>" + sub1[s1][0] + "</a>";
							} else {
								html += "<div>" + sub1[s1][0] + "</div>";
							}
						} else {
							// サブメニュー（メニュ－ > 縦リスト > 横リスト >）
							if (sub1[s1][1] != '') {
								html += "<a href='" + sub1[s1][1] + "' class='init-right'>" + sub1[s1][0] + "</a>";
							} else {
								html += "<div class='init-right'>" + sub1[s1][0] + "</div>";
							}

							html += "<ul class='fourth'>";
							var sub2 = sub1[s1][2];
							for (var s2 = 0; s2 < sub2.length; s2++) {
								html += "<li>";
								if (sub2[s2].length == 2) {
									// 固定メニュー（メニュ－ > 縦リスト > 横リスト > 横リスト）
									if (sub2[s2][1] != '') {
										html += "<a href='" + sub2[s2][1] + "'>" + sub2[s2][0] + "</a>";
									} else {
										html += "<div>" + sub2[s2][0] + "</div>";
									}
								} else {
									// サブメニュー（メニュ－ > 縦リスト > 横リスト > 横リスト >）
									if (sub2[s2][1] != '') {
										html += "<a href='" + sub2[s2][1] + "' class='init-right'>" + sub2[s2][0] + "</a>";
									} else {
										html += "<div class='init-right'>" + sub2[s2][0] + "</div>";
									}

									html += "<ul class='fifth'>";
									var sub3 = sub2[s2][2];
									for (var s3 = 0; s3 < sub3.length; s3++) {
										html += "<li><a href='" + sub3[s3][1] + "'>" + sub3[s3][0] + "</a></li>";
									}
									html += "</ul>";
								}
								html += "</li>";
							}
							html += "</ul>";
						}
						html += "</li>";
					}
					html += "</ul>";
				}
				html += "</li>";
			}
			html += "</ul></li>";
		}
		html += "</ul>";

		q$("#tabArea").after(html);

		// クエスト受領メニューのイベント定義(メニューをhtmlに反映後に実装が必要なため、ここに記述)
		q$("#receipt_quest").on('click',
			function() {
				if (q$("#quest_status").length == 0) {
					q$("#status").after(
						"<div id='quest_status' style='float: right; right: 0px; top: 0px; color: #fff; background-color: #a00; font-weight: bold; margin: 1px; padding: 1px;'></div>"
					);
				}

				// デイリークエストを受領(非同期)
				var quests = [[254, '寄付'], [256, '殲滅'], [255, 'デュエル']];
				var wait = false;
				var count = 1;
				var max = 3;
				var timer1 = setInterval(
					function() {
						if (wait) {
							return;
						}
						wait = true;
						q$("#quest_status").text(quests[count - 1][1] + "クエ受領中");

						q$.ajax({
							url: BASE_URL +
									"/quest/index.php?list=1&p=1&mode=0&action=take_quest&disp_mode=0&scroll_pos=&selected_tab=1&filter_reward=-1&id=" + quests[count - 1][0] + "&p=1&selected_tab=1",
							type: 'GET',
							datatype: 'html',
							cache: false
						})
						.done(function(res){
							count++;
							if (count > max) {
								clearInterval(timer1);
								q$("#quest_status").remove();
							}
							wait = false;
						});
					}, AJAX_REQUEST_INTERVAL
				);
			}
		);
	}

	if (g_beyond_options[COMMON_03] == true) {
		if (q$("#weather-ui").length === 0) {
			return;
		}
		
		// 天候効果
		var weather_effects = [
			['晴れ', '↑:なし', '↓:なし'],
			['雨', '↑:槍、弓、双', '↓:馬、錘'],
			['曇り', '↑:剣、斧', '↓:槍、弓、双'],
			['雪', '↑:馬、錘', '↓:剣、斧']
		];
		
		// 現在の天気のリストを作る
		var weather_list = q$("#weather-information table[class='weather-information__table']").children("tbody").children("tr");
		var weather_html = [];
		for (var i = 0; i < weather_list.length; i++) {
			var now = q$(weather_list.eq(i));
			var weather_spans = q$(now).children("th").eq(0);
			var weathers = q$(now).children("td").eq(0);
			var timeline = q$(weather_spans).text().replace(/[\n \t]/g, "");
			var weather = q$(weathers).text().replace(/[\n \t]/g, "");
				
			var weather_no = 0;
			var effect = '';
			if (weather === '雨') {
				weather_no = 1;
			} else if (weather === '曇り') {
				weather_no = 2;
			} else if (weather === '雪') {
				weather_no = 3;
			}
			effect = '<br><span style="color: cyan;">' + weather_effects[weather_no][1] +
				'</span>&nbsp;&nbsp;<span style="color: #dc143c">' + weather_effects[weather_no][2] + '</span>';

			var weather_style = 'width: 180px; margin-right: 8px;';
			weather_html.push(
				'<p class="weather-ui__p--current-weather" style="' + weather_style + '">' +
					'<span style="margin-right: 10px;">' + timeline + '</span>' +
					'<img class="weather-icon" src="https://cdn-3gokushi.marv-games.jp/20181114-02/extend_project/w945/img/weather/icon_weather_' + weather_no + '_s.png">' +
					'&nbsp;' +
					'<span class="weather-name">' + weather + '</span>' +
					effect +
				'</p>'				  
			);
			if (i === 2) {
				weather_html.push(
					'<p class="weather-ui__p--about-weather"><a href="https://mixi.jp/navigate_to_external_site_from_appli.pl?app_id=6598&amp;url=https%3A%2F%2Fw22.3gokushi.jp%2Fhelp%2Fhelp_other_151.html&amp;owner_uid=1qin59yw9barm&amp;site_type=general" target="_blank">天候の種類について</a></p>'
				);
			}
		}

		q$("#weather-ui").css('height', '48px');
		q$("#weather-ui").html(weather_html.join(''));
	}

	// デッキ：兵士管理のURLを書き換える（デッキ機能だが、URLに統一性がないので処理は共通側に配置）
	if (g_beyond_options[DECK_51] == true && q$("#statMenu").length > 0) {
		var statli = q$("#statMenu li");
		if (statli.eq(1).children('a').length > 0 && statli.eq(1).children('a').text() == '兵士管理') {
			statli.eq(1).children('a').attr('href', statli.eq(1).children('a').attr('href') + "?type=all");
		}
	}
}

//------------------//
// リソースタイマー //
//------------------//
function execResourceTimer() {
	// 資源タイマー
	if (g_beyond_options[COMMON_01] == true) {
		// 名声タイマーがセッション切れで死んでいたら復旧
		if (GM_getValue(SERVER_NAME + '_fame_timer', null) == "FAILED") {
		  GM_setValue(SERVER_NAME + '_fame_timer', null);
		}
		
		// 資源倉庫上限までの時間を計算
		if (g_res_timer != null) {
			clearInterval(g_res_timer);
			g_res_timer = null;
		}

		// 倉庫サイズ
		var max = parseInt(q$("#wood_max").text());
		var now = new Array();
		now['木'] = parseInt(q$("#wood").text());
		now['石'] = parseInt(q$("#stone").text());
		now['鉄'] = parseInt(q$("#iron").text());
		now['糧'] = parseInt(q$("#rice").text());

		var resources = [];
		q$("#sidebar div[class='sideBox'] div[class='sideBoxInner'] ul li").each(
			 function() {
				var text = q$(this).text();
				var accounting = (q$("span[class='increase']", q$(this)).length == 0);
				var match = text.match(/(木|石|鉄|糧) *([-]*\d+) *[+](\d+)/);
				if (match != null) {
					var obj = new Object;
					obj.type = match[1];
					obj.per = (parseInt(match[2]) + parseInt(match[3]));
					obj.rate = obj.per / 3600;
					obj.accounting = accounting;
					if (obj.rate > 0) {
						obj.remaining = parseInt((max - now[obj.type]) / obj.rate);
					} else {
						obj.remaining = -parseInt(parseInt(now[obj.type]) / obj.rate);
					}
					resources.push(obj);
				}
			}
		);

		// bp, tp, cp の描画エリアを移動
		q$("#status_resources").css('height', 46);
		q$("#status_point").css('margin-top', 24);

		// タイマー描画エリアを作成
		var li = q$("#status_resources ul[class='resorces'] li");
		for (var i = 0; i < 5; i++) {
			q$(li[i]).attr('class', null);
			var left = parseInt(q$(li[i]).offset().left - 17);
			var id = "res_" + i;
			var top = 13;
			q$(li[i]).append(
				"<div id='" + id + "' style='position: absolute; top: " + top + "px; left: " + left + "px; font-size: 10px;'></div>"
			);
		}

		// タイマーセット
		var timer_func = function() {
			for (var ri = 0; ri < 4; ri++) {
				var res = "";
				if (resources[ri].per > 0) {
					res = "+" + resources[ri].per;
				} else {
					res = resources[ri].per;
				}
				if (resources[ri].rate < 0) {
					q$("#res_" + ri).css('color', '#f00');
				} else if (resources[ri].accounting == true) {
					q$("#res_" + ri).css('color', '#f60');
				} else {
					q$("#res_" + ri).css('color', '#29d4ff');
				}
				q$("#res_" + ri).html(
					"<span>(" + res + "</span><span style='margin-left:8px;'>" + formatSeconds(resources[ri].remaining) + ")</span>"
				);
				if (resources[ri].remaining > 0) {
					resources[ri].remaining --;
				}
			}
			var fame_timer = GM_getValue(SERVER_NAME + '_fame_timer', null);
			if (fame_timer == null && fame_timer != "FAILED") {
				getFameTimer();
			} else {
				var dt = new Date(q$("#server_time").text());
				var ldt = new Date(fame_timer);
				var resttime = (ldt.getTime() - dt.getTime()) / 1000;
				var display = "(00:00:00)";
				if (resttime > 0) {
					display = "(" + formatSeconds(resttime) + ")";
				} else {
					getFameTimer();
				}
				q$("#res_4").css('color', 'yellow').html(display);
			}
		};
		g_res_timer = setInterval(
			timer_func, 1000
		);
	}
}

//--------------//
// 名声タイマー //
//--------------//
function getFameTimer() {
	if (GM_getValue(SERVER_NAME + '_fame_timer') == "FAILED") {
		return;
	}

	// 名声タイマーの取得
	q$.ajax({
		url: BASE_URL + "/facility/facility.php?x=3&y=3",
		type: 'GET',
		datatype: 'html',
		cache: false
	})
	.done(function(res){
		var resp = q$("<div>").append(res);
		var ct = q$("table", resp);
		if (ct.length == 0) {
			// 名声タイマーの取得に失敗
			GM_setValue(SERVER_NAME + '_fame_timer', "FAILED");
		} else {
			var fame_rest = null;
			for (var i = 0; i < ct.length; i++) {
				var match = ct.eq(i).text().replace(/[\t\r\n]/g, "").match(/ (.*) 頃に獲得/);
				if (match != null) {
					fame_rest = match[1];
					break;
				}
			}

			if (fame_rest != null) {
				GM_setValue(SERVER_NAME + '_fame_timer', fame_rest);
			} else {
				// 名声タイマーの取得に失敗
				GM_setValue(SERVER_NAME + '_fame_timer', "FAILED");
			}
		}
	});
}


//----------------//
// 都市画面の処理 //
//----------------//
function execVillagePart() {
}

//--------------------//
// 領地一覧画面の処理 //
//--------------------//
function execFacilityPart() {
	if (g_beyond_options[DECK_21] == true) {
		q$("#all table[class='commonTables']").eq(0).before(
			"<span style='margin-right: 10px;'>" +
				"<a href='" + BASE_URL + "/facility/territory_status.php?p=1&s=0&o=0'>領地一覧の並び方を初期状態に戻す</a>" +
			"</span>"
		);
	}

	if (g_beyond_options[DECK_22] == true) {
		q$("#all table[class='commonTables']").eq(0).before(
			"<span id='drop_territory' style='float: right;'>" +
				"<input type='button'value='「新領地」で始まる領地を全て破棄' />" +
			"</span>"
		);

		q$("#drop_territory").on('click',
			function() {
				var trlist = q$("table[class='commonTables'] tbody tr");
				var targets = new Array();
				for (var i = 0; i < trlist.length; i++) {
					var tdlist = trlist.eq(i).children("td");
					if (tdlist.length == 0) {
						continue;
					}
					if (!tdlist.eq(0).text().match(/^新領地/)) {
						continue;
					}
					if (tdlist.eq(12).text().match(/破棄中/)) {
						continue;
					}
					var match = tdlist.eq(1).text().match(/([-]*[0-9]*),([-]*[0-9]*)/);
					targets.push([match[1], match[2]]);
				}

				// 領地を破棄
				var wait = false;
				var count = 1;
				var max = targets.length;
				var timer1 = setInterval(
					function() {
						if (wait) {
							return;
						}
						wait = true;

						q$("#drop_territory").html(
							"<span style='background-color: red; color: white; font-weight: bold;'>(" + count + "/" + max + ") 領地破棄実行中...</span>"
						);

						q$.ajax({
							url: BASE_URL + "/territory_proc.php",
							type: 'GET',
							datatype: 'html',
							cache: false,
							data: {'x': targets[count - 1][0], 'y': targets[count - 1][1], 'mode': 'remove'}
						})
						.done(function(res){
							count++;
							if (count > max) {
								clearInterval(timer1);
								location.reload();
							}
							wait = false;
						});
					}, AJAX_REQUEST_INTERVAL
				);
			}
		);
	}
}

//--------------------//
// トレード画面の処理 //
//--------------------//
function execTradePart() {
	// ページャを画面上にもつける
	if (g_beyond_options[TRADE_01] == true) {
		q$("table[class='tradeTables']").before(
			q$("div[class='ui-tabs-panel'] ul[class='pager']").prop('outerHTML')
		);
	}

	// クリアボタンを設置 @RAPT
	q$("#button").after(
		"<input type='button' id='clear_search_form' value='クリア' class='btn' style='margin-left: 6px'></input>"
	);
	q$("#clear_search_form").on('click',
		function() {
			q$("#t option:selected").prop('selected', false);
			q$("#t").val('name');
			q$("#k").val('');
		}
	);

	// 特定レアリティのみボタン追加
	if (g_beyond_options[TRADE_02] == true) {
		q$("#filtering input[class='all_rarity_display']").css({'display':'none'});
		var style = 'vertical-align: top; margin: -6px 6px 6px 0px';
		q$("#filtering input[class='all_rarity_display']").after(
			"<span>" +
				"<input type='button' id='change_rarity_all' value='全て' style='" + style + "'></input>" +
				"<input type='button' id='change_rarity_l' value='Lのみ' style='" + style + "'></input>" +
				"<input type='button' id='change_rarity_ur' value='URのみ' style='" + style + "'></input>" +
				"<input type='button' id='change_rarity_sr' value='SRのみ' style='" + style + "'></input>" +
				"<input type='button' id='change_rarity_r' value='Rのみ' style='" + style + "'></input>" +
				"<input type='button' id='change_rarity_uc' value='UCのみ' style='" + style + "'></input>" +
				"<input type='button' id='change_rarity_c' value='Cのみ' style='" + style + "'></input>" +
			"</span>"
		);
		q$("#filtering input[id*='change_rarity_']").on('click',
			function() {
				var t = q$("#t option:selected").val();
				var k = q$("#k").val();
				var r = "r_" + q$(this).attr('id').replace(/change_rarity_/, "");
				var url = "";
				if (r != 'r_all') {
					url = "trade.php?t=" + t + "&k=" + k + "&tl=1&r_l=0&r_ur=0&r_sr=0&r_r=0&r_uc=0&r_c=0".replace(r + "=0", r + "=1");
				} else {
					url = "trade.php?t=" + t + "&k=" + k + "&tl=1&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1";
				}
				location.href = url;
			}
		);
	}

	// スコア表示、修行効率制御
	if (g_beyond_options[TRADE_03] == true) {
		// コンパネ追加
		q$("#filtering").after(
			"<fieldset style='-moz-border-radius:5px; border-radius: 5px; -webkit-border-radius: 5px; margin-bottom:6px; border: 2px solid black;'>" +
				"<div id='box-effect' style='margin: 3px 3px 3px 3px;'>" +
					"<span class='bold-red'>効率表示</span>" +
					"<span id='effect-type'></span>" +
					"<span id='effect-group' style='display:none;'></span>" +
					"<span id='effect-rarity' style='display:none;'></span>" +
				"</div>" +
			"</fieldset>"
		);

		var label = ['なし', 'スコア', '修行'];
		for (var i = 0; i < label.length; i++) {
			q$("#effect-type").append(
				"<input type='radio' id='e-type" + i + "' name='e-type' value='" + i + "' class='m4l'>" +
					"<label for='e-type" + i + "'>" + label[i] + "</label>" +
				"</input>"
			);
		}
		q$("#effect-group").append("<span>｜</span>");

		label = ['魏', '呉', '蜀', '他'];
		for (var i = 0; i < label.length; i++) {
			q$("#effect-group").append(
				"<input type='radio' id='e-group" + i + "' name='e-group' value='" + i + "' class='m4l'>" +
					"<label for='e-group" + i + "'>" + label[i] + "</label>" +
				"</input>"
			);
		}
		q$("#effect-rarity").append("<span>｜</span>");

		label = ['L', 'UR', 'SR', 'R', 'UC', 'C'];
		for (var i = 0; i < label.length; i++) {
			q$("#effect-rarity").append(
				"<input type='radio' id='e-rarity" + i + "' name='e-rarity' value='" + i + "' class='m4l'>" +
					"<label for='e-rarity" + i + "'>" + label[i] + "</label>" +
				"</input>"
			);
		}
		q$("#e-type0").prop('checked', true);
		q$("#e-group0").prop('checked', true);
		q$("#e-rarity0").prop('checked', true);

		// イベント追加
		q$("#box-effect input:radio").change(
			function() {
				q$("div[id='effect-view']").remove();
				var target = q$(this).attr('name');
				var sel_type = 0;

				// 効率表示種別選択
				if (target == 'e-type') {
					sel_type = q$(this).val();
					if (sel_type == 2) {
						q$("#effect-group").css('display', 'inline');
						q$("#effect-rarity").css('display', 'inline');
					} else {
						q$("#effect-group").css('display', 'none');
						q$("#effect-rarity").css('display', 'none');
					}
				} else {
					sel_type = q$("#effect-type input[name='e-type']:checked").val();
				}

				if (sel_type == 2) {
					// 所属勢力選択
					var sel_group = 0;
					if (target == 'e-group') {
						sel_group = q$(this).val();
					} else {
						sel_group = q$("#effect-group input[name='e-group']:checked").val();
					}

					// レアリティ選択
					var sel_rarity = 0;
					if (target == 'e-rarity') {
						sel_rarity = q$(this).val();
					} else {
						sel_rarity = q$("#effect-rarity input[name='e-rarity']:checked").val();
					}

					// 修行効率表示
					var rarebase = {l: [45000, 50, 0], ur: [15000, 40, 1], sr: [6000, 30, 2], r: [1000, 20, 3], uc: [25, 10, 4], c: [10, 5, 5]};
					var skillsbase = [0, 0, 4, 10, 12];
					var grouplist = {gi: 0, go: 1, shoku: 2, hoka: 3, ha: 4};
					var tradelist = q$("table[class='tradeTables'] tbody tr:not(tr[class='tradeTop'])");
					for (var tri = 0; tri < tradelist.length; tri++) {
						var tp = parseInt(q$("td[class='right']", tradelist[tri]).eq(3).text().replace(/,/g, ''));
						var rarity = q$("td[class='center'] span[class*='rare_']", tradelist[tri]).attr('class').replace(/rare_/, '');
						var skills = q$("td[class='skill'] div", tradelist[tri]);
						var skillct = 0;
						for (var j = 0; j < skills.length; j++) {
							if (!skills.eq(j).text().match(/--/)) {
								skillct ++;
							}
						}
						var exp = parseInt(q$("td[class='busho'] span[class='ex_now']", tradelist[tri]).text().replace(/経験値:/, ''));
						var groupmatch = q$("td[class='busho'] div[class*='omote_4sk cardStatus_rarerity_']", tradelist[tri]).attr('class').match(/rarerity_(.*)_/);
						var group = grouplist[groupmatch[1]];

						var rate = 40 + rarebase[rarity][1] + skillsbase[skillct] + (sel_rarity == rarebase[rarity][2]) * 4 + (sel_group == group) * 4 + (group == 4) * 4;
						var sumexp = parseInt(exp * rate / 100) + rarebase[rarity][0];
						var per = Math.floor(sumexp / tp);
						q$("td[class='right']", tradelist[tri]).eq(3).append(
							"<div id='effect-view' style='font-size: 9px; color:green;'><span>+" + sumexp + "</span><br><span>" + per + "/TP</span></div>"
						);
					}
				} else if (sel_type == 1) {
					// スコアレート表示
					var tradelist = q$("table[class='tradeTables'] tbody tr:not(tr[class='tradeTop'])");
					for (var tri = 0; tri < tradelist.length; tri++) {
						var tp = parseInt(q$("td[class='right']", tradelist[tri]).eq(3).text().replace(/,/g, ''));
						var score = parseInt(q$("td[class='right']", tradelist[tri]).eq(2).text().replace(/,/g, ''));
						var per = Math.floor(score / tp);
						q$("td[class='right']", tradelist[tri]).eq(3).append(
							"<div id='effect-view' style='font-size: 9px; color:blue;'><span>" + per + "/TP</span></div>"
						);
					}
				}
			}
		);
	}

	if (g_beyond_options[TRADE_04] == true || g_beyond_options[TRADE_05] == true || g_beyond_options[TRADE_06] == true || g_beyond_options[TRADE_07] == true) {
		var dt = new Date(q$("#server_time").text());

		var tradelist = q$("table[class='tradeTables'] tbody tr:not(tr[class='tradeTop'])");
		for (var tri = 0; tri < tradelist.length; tri++) {
			// カードNo.をトレードリンクにし、図鑑へのリンクを付与
			if (g_beyond_options[TRADE_04] == true) {
				// ID列
				var id = q$("td[class='center']", tradelist[tri]).eq(0).text();
				q$("td[class='center']", tradelist[tri]).eq(0).html(
					"<a href='trade.php?s=price&o=a&t=no&k=" + id + "&tl=1&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>" + id + "</a>" +
					"<br><a href='" + BASE_URL + "/card/busyo_data.php?search_options=&q=&status=&ability_type=&ability_value=&sort=card-no-asc&search_mode=detail&view_mode=&double_skill_height=&card_number=" + id + "' target='_blank'>(図鑑)</a>"
				);

				// カードID表示
				var id = q$("td[class='busho'] div[id*='cardWindow_']", tradelist[tri]).attr('id').replace(/cardWindow_/, '');
				q$("td[class='busho']", tradelist[tri]).append(
					"<div style='font-size: 9px;'><span>ID:" + id + "</span></div>"
				);

				// スキル名にトレードリンクを付与
				var skills = q$("td[class='skill'] div", tradelist[tri]);
				for (var j = 0; j < skills.length; j++) {
					var match = skills.eq(j).text().match(/(.*):(.*)(LV[0-9]*)/);
					if (match) {
						skills.eq(j).html(
							match[1] +
							":<a href='" + BASE_URL + "/card/trade.php?s=price&o=a&t=skill&k=" + match[2] + "&tl=1&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>" + match[2] + "</a>"
							+ match[3] +
							"<a href='" + BASE_URL + "/card/trade.php?s=price&o=a&t=skill&k=" + match[2] + match[3] + "&tl=1&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>(T)</a>"
						);
					}
				}
			}

			// 即時落札ボタン追加
			if (g_beyond_options[TRADE_05] == true) {
				// 即時落札可能で、TP不足でない場合のみ即時落札可能
				if (q$("td[class='limit']", tradelist[tri]).text() == '---' && !q$("td[class='trade']", tradelist[tri]).text().match(/(TP不足|件数制限)/)) {
					// 入札ボタン作成
					var tr_id = "tr_" + tri;
					var match = q$("td[class='trade'] a", tradelist[tri]).attr('href').match(/id=([0-9]*)/);
					q$("td[class='trade']", tradelist[tri]).attr("id", tr_id);
					createJustBuyButton(tr_id, match[1]);
				}
			}

			var limit = q$("td[class='limit']", tradelist[tri]).text();
			if (limit != "---") {
				var ldt = new Date(limit.substr(0,10) + " " + limit.substr(10));
				var resttime = (ldt.getTime() - dt.getTime()) / 1000;

				// 当日落札と翌日落札を見分ける
				if (g_beyond_options[TRADE_06] == true) {
					if (resttime >= 86400) {
						q$("td[class='limit']", tradelist[tri]).css('color', 'green');
					}
				}

				// 24時間以上落札まで時間があるものは、入札リンクを消す
				if (g_beyond_options[TRADE_07] == true) {
					if (resttime >= 86400) {
						q$("td[class='trade']", tradelist[tri]).html("<span class='green'>24時間超</span>");
					}
				}
			}
		}
	}
}

//----------------------//
// デッキ合成画面の処理 //
//----------------------//
function execUnionPart() {
	// ボタン説明文除去
	if (location.pathname == "/union/index.php") {
		if (g_beyond_options[DECK_34] == true) {
			q$("div[class='information subgeneral']").css('display', 'none');
		}
	}

	// デッキモード取得
	if (getDeckModeSmall() == false) {
		return;
	}

	// トレードリンク作成
	if (g_beyond_options[DECK_02] == true) {
		addTradeLinkOnSmallCardDeck();
	}

	// ページ切り替え簡略化
	if (g_beyond_options[DECK_03] == true) {
		createPagerPulldown();
	}

	// パッシブ着色、スキル使用OFF、スキル効果計算OFF、簡易デッキセットOFF
	addSkillViewOnSmallCardDeck(g_beyond_options[DECK_01], false, false, false);

	// 連続スキルレベルアップ
	if (location.pathname == "/union/lvup.php") {
		if (g_beyond_options[DECK_32] == true && q$("#gray02Wrapper div[class='number union clearfix']").length > 0) {
			// 更新ボタンを追加
			q$("#gray02Wrapper div[class='number union clearfix']").eq(0).before(
				"<div sytle='font-size: 14px;'>" +
					"<input id='reload_file' type='button' value='一覧の更新'></input>" +
				"</div>"
			);
			q$("#reload_file").on('click',
				function() {
					location.reload();
				}
			);

			// 副将枠を消す
			q$("#gray02Wrapper div[id='bacecard'] div[class='sgSlotBox']").css('display', 'none');

			// 連続合成枠
			q$("#gray02Wrapper div[id='bacecard'] div[class='left sgCombineLeft'] p").eq(0).after(
				"<fieldset style='-moz-border-radius: 5px; border-radius: 5px; -webkit-border-radius: 5px; margin: 10px 0px 6px 10px; border: 2px solid black;'>" +
					"<div style='font-weight: bold; padding: 2px;'>" +
						"<span style='color: black;'>ベースカードと同一カードNo.のカードを合成素材として、連続でスキルレベルアップを実施します。</span>" +
						"<div class='red'>" +
							"<div>次のカードは素材対象外となります。</div>" +
							"<div style='margin-left: 6px;'>・保護状態のカード</div>" +
							"<div style='margin-left: 6px;'>・2つ以上のスキルを持つカード</div>" +
						"</div>" +
						"<div id='target_skills'></div>" +
					"</div>" +
					"<div id='lvupDiv' style='text-align: center;'>" +
						"<div>" +
							"<input type='checkbox' id='use_almighty'>" +
								"<label for='use_almighty' style='margin-left: 4px; font-weight: bold; color: blue;'>水鏡を素材として使用する</label>" +
							"</input>" +
						"</div>" +
						"<label>停止レベル</label>" +
						"<input type='text' size='2' id='limit_level' value='10'></input>" +
						"<input type='button' id='multi_levelup_start' value='連続合成実行'>" +
					"</div>" +
					"<div id='lvup_info' style='font-weight: bold; text-align: center;'>" +
					"</div>" +
					"<div id='lvup_result' style='font-weight: bold; text-align: center;'>" +
					"</div>" +
					"<div id='lvup_status' style='font-weight: bold; text-align: center;'>" +
					"</div>" +
				"</fieldset>" +
				"<div>" +
					"<div id='lvup_alert' class='bold-red' style='text-align: center;'></div>" +
				"</div>"
			);

			// レベルアップ選択ラジオボタンの描画
			var skills = q$("#gray02Wrapper div[class*='right'] ul[class='back_skill'] li:not([class='subgeneral']) span");
			var stats = q$("#gray02Wrapper div[class*='right'] ul[class='back_skill'] li a[class*=btn_detail_s]");
			for (var i = 0; i < skills.length && i < stats.length; i++) {
				var skillText = skills.eq(i).text().replace(/[ \t\r\n]/g, "");
				if (skillText == "") {
					// 副将スキルは無視
					continue;
				}
				var match = stats.eq(i).attr('onclick').match(/Thick\('(.....)([0-9])',/);
				if (match[2] != '9') {
					q$("#target_skills").append(
						"<div style='padding: 1px;'>" +
							"<input type='radio' id='skill_" + i + "' name='skill_name' value='" + match[1] + match[2] + "'>" +
								"<label for='skill_" + i + "' style='margin-left:4px;'>" + skillText + "</label>" +
							"</input>" +
						"</div>"
					);
				} else {
					q$("#target_skills").append(
						"<div>" +
							"<input type='radio' id='skill_" + i + "' name='skill_name' value='" + match[1] + match[2] + "' disabled>" +
								"<label for='skill_" + i + "' style='color: gray; margin-left: 4px;'>" + skillText + "</label>" +
							"</input>" +
						"</div>"
					);
				}
			}

			// 検索
			q$("#multi_levelup_start").on('click',
				function(){
					q$("#lvup_alert").text("");

					// ラジオボタンの選択をチェック
					var target = q$("input[name='skill_name']:checked");
					if (target.length == 0) {
						q$("#lvup_alert").text("スキルを選択してください。");
						return;
					}

					// 上限スキルレベルをチェック
					var limit_lv = parseInt(q$("#limit_level").val());
					if (isNaN(limit_lv) || limit_lv < 2 || limit_lv > 10) {
						q$("#lvup_alert").text("停止レベルは2～10が指定可能です。");
						return;
					}

					// ベースカードのカードNo.を取得
					var base_card_no = q$("#bacecard div[class*='right'] div[class*='omote_4sk'] span[class='cardno']").text();

					// ベースカードのidを取得
					var base_cid = q$("input[name='base_cid']").val();

					// 処理開始
					q$("#multi_levelup_start").val("処理実行中").prop("disabled", true);
					skill_lvup_step1(base_card_no, base_cid, q$("input[name='skill_name']:checked").val(), limit_lv, q$("#use_almighty").prop('checked'));
				}
			);

			// デッキからスキルを検索
			function skill_lvup_step1(base_card_no, base_cid, skill_id, limit_lv, use_almighty) {
				// 最大ページ番号の取得
				var max = 1;
				if (q$("#rotate ul[class=pager]").length > 0) {
					var pages = q$("#rotate ul[class=pager] li");
					for (var i = 0; i < pages.length; i++) {
						var page = parseInt(q$(pages[i]).text());
						if (!isNaN(page) && max < page) {
							max = page;
						}
					}
				}

				// ファイルの検索
				var wait = false;
				var count = 1;
				var total_cards = 0;
				var added_cards = [];
				var timer1 = setInterval(
					function () {
						if (wait) {
							return;
						}
						wait = true;

						q$("#lvup_info").text("ファイル検索中・・・" + count + " / " + max);

						var no = {'p': count, 'cid': base_cid};
						q$.ajax({
							url: BASE_URL + '/union/lvup.php',
							type: 'GET',
							datatype: 'html',
							cache: false,
							data: no
						})
						.done(function(res) {
							var resp = q$("<div>").append(res);
							var cards = q$("#cardFileList div[class='cardStatusDetail label-setting-mode']", resp);
							if (cards.length > 0) {
								for (var i = 0; i < cards.length; i++) {
									total_cards ++;

									// カードの保護状態が取れないものは無視する
									if (q$("div[class='control new-mode'] a", cards[i]).length == 0) {
										continue;
									}

									var mode = q$("div[class='control new-mode'] a", cards[i]).eq(0).attr('class');
									// 保護中カードは無視する
									if (mode == 'protection') {
										continue;
									}

									// 水鏡指定がある場合、水鏡かどうかを判定
									var almighty = false;
									if (use_almighty == true) {
										var card_name = q$("div[class='left'] div[class='illustMini__div--name']", cards[i]).eq(0).text();
										card_name = card_name.replace(/[ \t]/g, "");
										if (card_name == "水鏡" || card_name == "水鏡(自分用)") {
											almighty = true;
										}
									}

									// 同一カードNo.でないものは無視する
									var card_no = parseInt(q$("div[class*='right'] table[class='statusParameter1'] tbody tr", cards[i]).eq(0).children('td').eq(0).text());
									if (isNaN(card_no) || (almighty == false && card_no != base_card_no)) {
										continue;
									}

									// 2つ目のスキルを保持するカードは無視する
									var second_skill = q$("div[class*='right'] table[class^='statusParameter2'] tbody tr", cards[i]).eq(3).children('td').text();
									second_skill = second_skill.replace(/[ \t]/g, "");
									if (second_skill != "") {
										continue;
									}

									// 素材IDを取得
									var match = q$("div[id*='cardWindow_']", cards[i]).attr('id').match(/cardWindow_([0-9].*)/);
									added_cards[added_cards.length] = match[1];
								}
							}

							count++;
							if (count > max) {
								clearInterval(timer1);
								q$("#lvup_info").text("合成素材カード数 " + added_cards.length + " / " + total_cards);
								if (added_cards.length > 0) {
									// スキルレベルアップ
									skill_lvup_step2(base_cid, skill_id, limit_lv, added_cards);
								} else {
									q$("#lvup_result").html(
										"<div class='bold-red'>合成素材カードがありません</div>"
									);
								}
							}

							wait = false;
						});
					}, AJAX_REQUEST_INTERVAL
				);
			}

			// スキルレベルアップ
			function skill_lvup_step2(base_cid, skill_id, limit_lv, target_cards) {
				var ssid = getSessionId();
				var skill_name_obj = q$("#target_skills input[value='" + skill_id + "']").parent().children('label');
				var match = skill_name_obj.text().match(/^(.*)LV([0-9]).*$/, '');
				var skill_name = match[1];
				var skill_lv_start = match[2];
				var wait = false;
				var count = 0;
				var max = target_cards.length;
				var timer1 = setInterval(
					function () {
						if (wait) {
							return;
						}
						wait = true;

						q$("#lvup_result").html(
							"<div style='color:red; font-weight: bold;'>" +
								"合成中・・・" + parseInt(count + 1) + " / " + max +
							"</div>"
						);

						var params = {'ssid': ssid, 'selected_skill_radio': skill_id, 'base_cid': base_cid, 'added_cid': target_cards[count], 'union_item_id': 0, 'buy_and_use': ''};
						q$.ajax({
							url: BASE_URL + '/union/union_lv.php',
							type: 'POST',
							datatype: 'html',
							cache: false,
							data: params
						})
						.done(function(res) {
							var resp = q$("<div>").append(res);
							if (q$("#resultSuccess", resp).length > 0) {
								// レベルアップ成功

								// 次のレベルにする
								var skill_lv = parseInt(skill_id.substr(5,1)) + parseInt(1);
								var view_lv = parseInt(skill_lv + 1);

								// 成功表示
								skill_name_obj.html("<span class='bold-red'>" + skill_name + "LV" + view_lv + " (+" + parseInt(view_lv - skill_lv_start) + ")</span>");
								q$("#lvup_status").html(
									"<div style='color:red;'>レベルアップ成功</div>"
								);

								// 上限レベルに達したら終了
								if (parseInt(view_lv) >= parseInt(limit_lv)) {
									clearInterval(timer1);
									q$("#multi_levelup_start").val("処理終了");
									q$("#lvup_status").html(
										"<div style='color:red;'>レベルアップ処理完了</div>"
									);

									wait = false;
									return;
								}

								// 次のPOSTに渡すスキルidを作成
								skill_id = skill_id.substr(0,5) + skill_lv;
							} else {
								q$("#lvup_status").html(
									"<div style='color:blue;'>レベルアップ失敗</div>"
								);
							}
							count++;
							if (count >= max) {
								clearInterval(timer1);
								q$("#lvup_status").html(
									"<div style='color:red;'>レベルアップ処理完了</div>"
								);
								q$("#multi_levelup_start").val("処理終了");
							}
							wait = false;
						});
					}, AJAX_REQUEST_INTERVAL
				);
			}
		}

		// レベルアップ合成画面でベースカードの交換機能を追加
		if (g_beyond_options[DECK_33] == true) {
			var cards = q$("#cardFileList div[class='cardStatusDetail label-setting-mode']");
			if (cards.length > 0) {
				for (var i = 0; i < cards.length; i++) {
					var cw = q$("div[id*='cardWindow_']", cards[i]);

					// 「特」スキル持ちは除外
					var match = cw.html().match(/特[:：]/);
					if (match != null) {
						continue;
					}

					// カード番号を取得
					match = cw.attr('id').match(/cardWindow_([0-9].*)/);
					if (match == null) {
						continue;
					}
					var card_id = match[1];

					q$("div[class='left']", cards[i]).eq(0).append(
						'<a href=' + BASE_URL + '/union/lvup.php?cid=' + card_id + '>' +
							'<img style="width: 90%; cursor: pointer;" src="/20161222-01/extend_project/w945/img/union/btn_levelupskill_mini.png" alt="ベースカードをこのカードに変更" title="ベースカードをこのカードに変更">' +
						'</a>'
					);
				}
			}
		}
	}

	// 連続副将合成枠
	if (location.pathname == "/union/subgeneral.php") {
		if (g_beyond_options[DECK_35] == true && q$("#gray02Wrapper div[class='number union clearfix']").length > 0) {
			// 更新ボタンを追加
			q$("#gray02Wrapper div[class='number union clearfix']").eq(0).before(
				"<div sytle='font-size: 14px;'>" +
					"<input id='reload_file' type='button' value='一覧の更新'></input>" +
				"</div>"
			);
			q$("#reload_file").on('click',
				function() {
					location.reload();
				}
			);

			// 副将上限コストのリストを作る（武将カードのコスト～-2.0コストまたは1.0コストまで）
			var cardcost = parseFloat(q$("#gray02Wrapper div[id='bacecard']  div[class='right'] span[class='cost-for-sub']").eq(0).text());
			var costoption = "";
			for (var f = cardcost; f >= cardcost - 2.0 && f >= 1.0; f -= 0.5) {
				var cost = f.toFixed(1);
				costoption += "<option value='" + cost + "'>" + f + "</option>";
			}

			// 副将合成枠
			q$("#gray02Wrapper div[id='bacecard'] div[class='left sgCombineLeft'] p").eq(0).after(
				"<fieldset style='-moz-border-radius: 5px; border-radius: 5px; -webkit-border-radius: 5px; margin: 0px 0px 6px 10px; border: 2px solid black; position:relative; top: -6px;'>" +
					"<div style='font-weight: bold; padding: 2px;'>" +
						"<span style='color: black;'>連続で副将枠解放を実施します。</span>" +
						"<div class='red'>" +
							"<div>次のカードは素材対象外となります。</div>" +
							"<div style='margin-left: 6px;'>・保護状態のカード</div>" +
							"<div style='margin-left: 6px;'>・2つ以上のスキルを持つカード</div>" +
						"</div>" +
						"<div id='target_skills'></div>" +
					"</div>" +
					"<div id='lvupDiv' style='text-align: center;'>" +
						"<div>" +
							"<input type='checkbox' id='use_almighty'>" +
								"<label for='use_almighty' style='margin-left: 4px; font-weight: bold; color: blue;'>水鏡を素材として使用する</label>" +
							"</input>" +
						"</div>" +
						"<label>停止コスト</label>" +
						"<select id='limit_cost' style='margin-right: 6px;'>"
							+ costoption +
						"</select>" +
						"<input type='button' id='multi_subup_start' value='連続解放実行'>" +
					"</div>" +
					"<div id='lvup_info' style='font-weight: bold; text-align: center;'>" +
					"</div>" +
					"<div id='lvup_result' style='font-weight: bold; text-align: center;'>" +
					"</div>" +
					"<div id='lvup_status' style='font-weight: bold; text-align: center;'>" +
					"</div>" +
				"</fieldset>" +
				"<div>" +
					"<div id='lvup_alert' class='bold-red' style='text-align: center;'></div>" +
				"</div>"
			);

			q$("#gray02Wrapper div[id='bacecard'] div[class='left sgCombineLeft'] p").eq(0).remove();

			// 検索
			q$("#multi_subup_start").on('click',
				function(){
					q$("#lvup_alert").text("");

					// ベースカードのカードNo.を取得
					var base_card_no = q$("#bacecard div[class='right'] div[class*='omote_4sk'] span[class='cardno']").text();

					// ベースカードのidを取得
					var base_cid = q$("input[name='base_cid']").val();

					// 処理開始
					q$("#multi_subup_start").val("処理実行中").prop("disabled", true);
					sub_lvup_step1(base_card_no, base_cid, q$("#limit_cost").val(), q$("#use_almighty").prop('checked'));
				}
			);

			// デッキからカードを検索
			function sub_lvup_step1(base_card_no, base_cid, limit_cost, use_almighty) {
				// 最大ページ番号の取得
				var max = 1;
				if (q$("#rotate ul[class=pager]").length > 0) {
					var pages = q$("#rotate ul[class=pager] li");
					for (var i = 0; i < pages.length; i++) {
						var page = parseInt(q$(pages[i]).text());
						if (!isNaN(page) && max < page) {
							max = page;
						}
					}
				}

				// ファイルの検索
				var wait = false;
				var count = 1;
				var total_cards = 0;
				var added_cards = [];
				var timer1 = setInterval(
					function () {
						if (wait) {
							return;
						}
						wait = true;

						q$("#lvup_info").text("ファイル検索中・・・" + count + " / " + max);

						var no = {'p': count, 'cid': base_cid};
						q$.ajax({
							url: BASE_URL + '/union/subgeneral.php',
							type: 'GET',
							datatype: 'html',
							cache: false,
							data: no
						})
						.done(function(res) {
							var resp = q$("<div>").append(res);
							var cards = q$("#cardFileList div[class='cardStatusDetail label-setting-mode']", resp);
							if (cards.length > 0) {
								for (var i = 0; i < cards.length; i++) {
									total_cards ++;

									var mode = q$("div[class='control new-mode'] a", cards[i]).eq(0).attr('class');
									// 保護中カードは無視する
									if (mode == 'protection') {
										continue;
									}

									// 水鏡指定がある場合、水鏡かどうかを判定
									var almighty = false;
									if (use_almighty == true) {
										var card_name = q$("div[class='left'] div[class='illustMini__div--name']", cards[i]).eq(0).text();
										card_name = card_name.replace(/[ \t]/g, "");
										if (card_name == "水鏡" || card_name == "水鏡(自分用)") {
											almighty = true;
										}
									}

									// 同一カードNo.でないものは無視する
									var card_no = parseInt(q$("div[class*='right'] table[class='statusParameter1'] tbody tr", cards[i]).eq(0).children('td').eq(0).text());
									if (isNaN(card_no) || (almighty == false && card_no != base_card_no)) {
										continue;
									}

									// 2つ目のスキルを保持するカードは無視する
									var second_skill = q$("div[class*='right'] table[class^='statusParameter2'] tbody tr", cards[i]).eq(3).children('td').text();
									second_skill = second_skill.replace(/[ \t]/g, "");
									if (second_skill != "") {
										continue;
									}

									// 素材IDを取得
									var match = q$("div[id*='cardWindow_']", cards[i]).attr('id').match(/cardWindow_([0-9].*)/);
									added_cards[added_cards.length] = match[1];
								}
							}

							count++;
							if (count > max) {
								clearInterval(timer1);
								q$("#lvup_info").text("合成素材カード数 " + added_cards.length + " / " + total_cards);
								if (added_cards.length > 0) {
									// スキルレベルアップ
									sub_lvup_step2(base_cid, limit_cost, added_cards);
								} else {
									q$("#lvup_result").html(
										"<div class='bold-red'>合成素材カードがありません</div>"
									);
								}
							}

							wait = false;
						});
					}, AJAX_REQUEST_INTERVAL
				);
			}

			// 副将枠合成アップ
			function sub_lvup_step2(base_cid, limit_cost, target_cards) {
				var ssid = getSessionId();
				var wait = false;
				var count = 0;
				var max = target_cards.length;
				var successopen = "";
				var timer1 = setInterval(
					function () {
						if (wait) {
							return;
						}
						wait = true;

						if (successopen == "") {
							q$("#lvup_result").html(
								"<div style='color:red; font-weight: bold;'>" +
									"解放中・・・" + parseInt(count + 1) + " / " + max +
								"</div>"
							);
						} else {
							q$("#lvup_result").html(
								"<div style='color:red; font-weight: bold;'>" +
									"解放中・・・" + parseInt(count + 1) + " / " + max + " (" + successopen + "解放)" +
								"</div>"
							);
						}

						var params = {'ssid': ssid, 'base_cid': base_cid, 'added_cid': target_cards[count], 'union_item_id': 0, 'buy_and_use': '', 'submit_subgeneral': 1};
						q$.ajax({
							url: BASE_URL + '/union/union_subgeneral.php',
							type: 'POST',
							datatype: 'html',
							cache: false,
							data: params
						})
						.done(function(res) {
							var resp = q$("<div>").append(res);
							if (q$("#sgResultFalse", resp).length == 0) {
								// 解放成功

								// コスト
								var opencost = parseFloat(q$("#sgResult p[class='lead clearfix'] span", resp).eq(0).text());
								successopen = opencost.toFixed(1);

								// 成功表示
								q$("#lvup_status").html(
									"<div style='color:red;'>コスト " + successopen + " 解放成功</div>"
								);

								q$("#lvup_result").html(
									"<div style='color:red; font-weight: bold;'>" +
										"解放中・・・" + parseInt(count + 1) + " / " + max + " (" + successopen + "解放)" +
									"</div>"
								);

								// 上限コストに達したら終了
								if (limit_cost - opencost < 0.5) {
									clearInterval(timer1);
									q$("#multi_subup_start").val("処理終了");
									q$("#lvup_status").html(
										"<div style='color:red;'>副将枠解放完了</div>"
									);

									wait = false;
									return;
								}
							} else {
								q$("#lvup_status").html(
									"<div style='color:blue;'>副将枠解放失敗</div>"
								);
							}
							count++;
							if (count >= max) {
								clearInterval(timer1);
								q$("#multi_subup_start").val("処理終了");
								q$("#lvup_status").html(
									"<div style='color:red;'>副将枠解放完了</div>"
								);
							}
							wait = false;
						});
					}, AJAX_REQUEST_INTERVAL
				);
			}
		}
	}
}

//----------------//
// 倉庫画面の処理 //
//----------------//
function execStockPart() {
	// テーブルアクセス用のリスト
	var tbllist = q$("table[class='tbl_cards_list'] tbody tr");

	// カードNo.をトレードリンクにし、図鑑へのリンクを付与
	if (g_beyond_options[DECK_02] == true) {

		// スキル名変換列の決定
		var skill_col = 6;
		if (location.pathname == "/card/card_stock_file.php") {
			skill_col = 8;
		}

		for (var i = 0; i < tbllist.length; i++) {
			var tdlist = tbllist.eq(i).children("td");

			// ID列
			// スキル名にトレードリンクを付与
			var skills = tdlist.eq(skill_col).html().replace(/[ \t\r\n]/g, "").split("<br>");
			var replaced = "";
			for (var j = 0; j < skills.length; j++) {
				var match = skills[j].match(/(.*)(LV[0-9]*)/);
				if (match) {
					replaced += "<div>" +
						"<a href='" + BASE_URL + "/card/trade.php?s=price&o=a&t=skill&k=" + match[1] + "&tl=1&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>" + match[1] + "</a>"
						+ match[2] +
						"<a href='" + BASE_URL + "/card/trade.php?s=price&o=a&t=skill&k=" + match[1] + match[2] + "&tl=1&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>(T)</a>" + "</div>";
				} else {
					replaced += "<div>" + skills[j] + "</div>";
				}
			}
			tdlist.eq(skill_col).html(replaced);
		}
	}

	// 倉庫に移動できる武将を制限する
	if (location.pathname == "/card/card_stock_file_confirm.php") {
		if (g_beyond_options[DECK_61] == true) {
			var move = true;
			for (var i = 0; i < tbllist.length; i++) {
				var tdlist = tbllist.eq(i).children("td");

				// レベル
				if (parseInt(tdlist.eq(4).text()) >= 50) {
					tdlist.eq(4).css('background-color', 'orange');
					move = false;
				}

				// スコア
				if (parseInt(tdlist.eq(5).text()) >= 1000000) {
					tdlist.eq(5).css('background-color', 'orange');
					move = false;
				}

				// スキル
				if (tdlist.eq(6).children('div').length > 3) {
					tdlist.eq(6).css('background-color', 'orange');
					move = false;
				}
			}

			// 移動できない条件を満たす場合は、移動ボタンを無効化
			if (move == false) {
				var buttons = q$("input[class='user_action_button']");
				for (var i = 0; i < buttons.length; i++) {
					if (buttons.eq(i).val() == '移動') {
						buttons.eq(i).attr('disabled', 'true');
					}
				}

				q$("p[class='notice align_center']").after(
					"<div style='color: red; font-weight: bold; text-align: center;'>" +
						"beyondにより倉庫への移動が禁止されているカードが選択されています。</br>"+
						"（スキルが3つある、レベルが50以上、スコアが100万以上のいずれかを満たすカード：オレンジ色着色）" +
					"</div>"
				);
			}
		}
	}
}

//------------------------//
// トレード履歴画面の処理 //
//------------------------//
function execTradeHistoryPart() {
	// 履歴画面の当日9:30-10:00の落札分を着色する
	if (g_beyond_options[TRADE_41] == true) {
		var trlist = q$("table[class='tradeLogTables'] tr");
		if (trlist.length > 0) {
			var dt = new Date(q$("#server_time").text());
			for (var i = 1; i < trlist.length; i++) {
				var time = q$("td", trlist.eq(i)).eq(5).text().replace(/[ \t\r\n]/g, "");
				var ldt = new Date(time.substr(0,10) + " " + time.substr(10));
				var resttime = (dt.getTime() - ldt.getTime()) / 1000;
				if (resttime > 0 && resttime < 86400 && (time.match(/09:3[0-9]:[0-9]*$/) != null || time.match(/09:5[0-9]:[0-9].*$/)) != null) {
					trlist.eq(i).children('td').css('background-color', '#f5deb3');
				}
			}
		}
	}
}

//--------------------------//
// トレード出品中画面の処理 //
//--------------------------//
function execExhibitListPart() {
	// 出品中がない
	if (q$("div[class='ui-tabs-panel']").length == 0) {
		return;
	}

	// テーブルアクセス用のリスト
	var tradelist = q$("table[class='tradeTables'] tbody tr:not(tr[class='tradeSell'])");

	// カードNo.をトレードリンクにし、図鑑へのリンクを付与
	if (g_beyond_options[TRADE_04] == true) {
		for (var tri = 0; tri < tradelist.length; tri++) {
			// ID列
			var id = q$("td[class='center']", tradelist[tri]).eq(0).text();
			q$("td[class='center']", tradelist[tri]).eq(0).html(
				"<a href='trade.php?s=price&o=a&t=no&k=" + id + "&tl=1&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>" + id + "</a>" +
				"<br><a href='" + BASE_URL + "/card/busyo_data.php?search_options=&q=&status=&ability_type=&ability_value=&sort=card-no-asc&search_mode=detail&view_mode=&double_skill_height=&card_number=" + id + "' target='_blank'>(図鑑)</a>"
			);

			// カードID表示
			var id = q$("td[class='busho'] div[id*='cardWindow_']", tradelist[tri]).attr('id').replace(/cardWindow_/, '');
			q$("td[class='busho']", tradelist[tri]).append(
				"<div style='font-size: 9px;'><span>ID:" + id + "</span></div>"
			);

			// スキル名にトレードリンクを付与
			var skills = q$("td[class='skill'] div", tradelist[tri]);
			for (var j = 0; j < skills.length; j++) {
				var match = skills.eq(j).text().match(/(.*):(.*)(LV[0-9]*)/);
				if (match) {
					skills.eq(j).html(
						match[1] +
						":<a href='" + BASE_URL + "/card/trade.php?s=price&o=a&t=skill&k=" + match[2] + "&tl=1&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>" + match[2] + "</a>"
						+ match[3] +
						"<a href='" + BASE_URL + "/card/trade.php?s=price&o=a&t=skill&k=" + match[2] + match[3] + "&tl=1&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>(T)</a>"
					);
				}
			}
		}
	}

	// 出品リンク生成
	if (g_beyond_options[TRADE_11] == true) {
		// リンクボックス生成
		q$("table[class='tradeTables']").after(
			"<div style='margin-top: 4px;'>" +
				"<div style='font-size: 14px; font-weight: bold;'>出品リンク</div>" +
				"<textarea id='sell-box' style='border: inset 2px; width: 713px; height:320px; resize: none;'></textarea>" +
			"</div>"
		);

		var text = "";
		for (var tri = 0; tri < tradelist.length; tri++) {
			var elem = q$("td[class='trade'] a", tradelist[tri]);
			if (elem.length == 0) {
				continue;
			}
			var match = elem.attr('href').match(/del_id=([0-9]*)/);
			text += BASE_URL + "/card/trade_bid.php?id=" + match[1] + "\n";
		}

		q$("#sell-box").text(text);
	}

	// 収入表示
	if (g_beyond_options[TRADE_12] == true || g_beyond_options[TRADE_13] == true) {
		if (g_beyond_options[TRADE_13] == true) {
			q$("table[class='tradeTables'] tbody tr[class='tradeSell'] th").eq(5).html(
				"<div>落札希望価格</div>" +
				"<div style='color: green;'>収入期待値</div>"
			);
		} else {
			q$("table[class='tradeTables'] tbody tr[class='tradeSell'] th").eq(5).html(
				"<div>落札希望価格</div>"
			);
		}
		if (g_beyond_options[TRADE_12] == true) {
			q$("table[class='tradeTables'] tbody tr[class='tradeSell']").append(
				"<th>収入TP</th>"
			);
		}
		var total = 0;
		var charge_total = 0;
		for (var tri = 0; tri < tradelist.length; tri++) {
			// 収入期待値の計算
			if (g_beyond_options[TRADE_13] == true) {
				var tp = tradelist.eq(tri).children("td[class='tp']").text().replace(",", "");
				tp = tp - calcCharge(tp);
				tp = String(tp).replace(/^([+-]?\d+)(\d{3})/,"$1,$2");
				tradelist.eq(tri).children("td[class='tp']").append("<div style='color: green;'>" + tp + "</div>");
			}

			// 収入列の追加
			if (g_beyond_options[TRADE_12] == true) {
				var trade_text = q$("td[class='trade']", tradelist.eq(tri)).text().replace(/,/g, '');
				if (!trade_text.match(/取消/)) {
					// 入手TPの表示
					var tp = parseInt(trade_text);
					var charge = calcCharge(tp);
					var income = tp - charge;
					q$(tradelist[tri]).append(
						"<td class='center' style='color: #c00; font-weight: bold;'>" + income + "</td>"
					);
					total += income;
					charge_total += charge;
				} else {
					q$(tradelist[tri]).append(
						"<td class='center'>--</td>"
					);
				}
			}
		}
		if (g_beyond_options[TRADE_12] == true) {
			q$("table[class='tradeTables']").after(
				"<div style='font-family:Verdana,arial,sans-serif; font-size: 14px; font-weight: bold; color: #c00; text-align: right;'>" +
					"<span>収入合計: " + total + " TP<span>" +
					"<br>" +
					"<span>（手数料: " + charge_total + " TP）</span>" +
				"</div>"
			);
		}
	}
}

//--------------------------//
// トレード入札中画面の処理 //
//--------------------------//
function execBidListPart() {
	// 自動入札
	if (g_history_mode == false && g_beyond_options[TRADE_21] == true) {
		// 自動入札用ボックス
		q$("div[class='ui-tabs-panel']").after(
			"<div style='margin-top: 4px;'>" +
				"<div style='font-size: 14px; font-weight: bold;'>入札BOX（出品リンクから生成される形式のアドレスリストが必要です）</div>" +
				"<input type='button' id='auto-buy-button' value='自動入札実行'>" +
				"<span id='buy_info' style='float: right; font-weight: bold;'></span>" +
				"<textarea id='buy-box' style='border: inset 2px; width: 733px; height:320px; resize: none;'></textarea>" +
			"</div>"
		);

		q$("#auto-buy-button").on('click',
			function() {
				var base_url = BASE_URL + '/card/trade_bid.php';

				// 入力URLリストを精査
				var lists = q$("#buy-box").val().split(/\r\n|\r|\n/);
				var exec_id_list = [];
				for (var i = 0; i < lists.length; i++) {
					// 自サーバ以外のリストは除外
					if (lists[i].indexOf(base_url) != 0) {
						continue;
					}

					var match = lists[i].match(/\?id=([0-9].*)/);
					if (match == null) {
						continue;
					}

					// 有効リストの作成
					exec_id_list[exec_id_list.length] = match[1];
				}

				// 入札・落札準備
				var wait = false;
				var count = 0;
				var max = exec_id_list.length;
				var params = [];
				var timer1 = setInterval(
					function () {
						if (wait) {
							return;
						}
						wait = true;

						q$("#buy_info").text("入札準備中： " + parseInt(count + 1) + " / " + max);

						q$.ajax({
							url: base_url + '?id=' + exec_id_list[count],
							type: 'GET',
							datatype: 'html',
							cache: false
						})
						.done(function(res) {
							var resp = q$("<div>").append(res);
							var is_bid = q$("input[name='bid_btn']", resp).length;
							var is_buy = q$("input[name='buy_btn']", resp).length;

							if (is_bid == 0 && is_buy == 0) {
								// 入札する、落札するボタンがないので入札できない
								return;
							}

							// パラメータ作成
							var pos = params.length;
							params[pos] = [];
							params[pos]['ssid'] = getSessionId();
							if (is_bid) {
								// 入札処理
								params[pos]['type'] = 'bid';
								params[pos]['exhibit_id'] = q$("input[name='exhibit_id']", resp).val();
								params[pos]['exhibit_price'] = q$("input[name='exhibit_price']", resp).val();
							} else {
								// 落札処理
								params[pos]['type'] = 'buy';
								params[pos]['exhibit_cid'] = q$("input[name='exhibit_cid']", resp).val();
								params[pos]['exhibit_id'] = q$("input[name='exhibit_id']", resp).val();
							}

							count++;
							if (count >= max) {
								clearInterval(timer1);

								// 入札・落札処理
								exec_auto_bid(params);
							}
							wait = false;
						});
					}, AJAX_REQUEST_INTERVAL
				);
			}
		);

		// 入札・落札処理
		function exec_auto_bid(params) {
			var wait = false;
			var count = 0;
			var max = params.length;
			var timer1 = setInterval(
				function () {
					if (wait) {
						return;
					}
					wait = true;

					q$("#buy_info").text("入札中： " + parseInt(count + 1) + " / " + max);

					var postdata;
					if (params[count]['type'] == 'bid') {
						postdata = {
							'ssid':params[count]['ssid'],
							'exhibit_id':params[count]['exhibit_id'],
							'exhibit_price':params[count]['exhibit_price'],
							'bid_btn':'入札する'
						};
					} else {
						postdata = {
							'ssid':params[count]['ssid'],
							'exhibit_cid':params[count]['exhibit_cid'],
							'exhibit_id':params[count]['exhibit_id'],
							'buy_btn':'落札する'
						};
					}

					q$.ajax({
						url: BASE_URL + '/card/trade_bid.php',
						type: 'POST',
						datatype: 'html',
						cache: false,
						data: postdata
					})
					.done(function(res) {
						// 成功判定は一旦あと
//						var resp = q$("<div>").append(res);

						count++;
						if (count >= max) {
							clearInterval(timer1);
							q$("#buy_info").text("入札完了");
							q$("#buy-box").val("");
						}
						wait = false;
					});
				}, AJAX_REQUEST_INTERVAL
			);
		}
	}
}

//------------------------//
// トレード出品画面の処理 //
//------------------------//
function execTradeCardPart() {
	// デッキモード取得
	if (getDeckModeSmall() == false) {
		return;
	}

	// 落札価格調査ボタン追加
	if (g_beyond_options[TRADE_33] == true) {
		// 即時落札価格調査ボタン追加
		var cards = q$("#cardFileList div[class='cardStatusDetail label-setting-mode'] div[class='statusDetail clearfix'] div[class='left']");
		for (var i = 0; i < cards.length; i++) {
			cards.eq(i).append(
				"<div>" +
					"<input type='button' id='sell-price-check-button" + i + "' value='即落調査'></input>" +
				"</div>"
			);
		}

		// 即時落札価格取得イベントの定義
		q$("input[id*='sell-price-check-button']").on('click',
			function() {
				var base = q$(this).parents("div[class='cardStatusDetail label-setting-mode']");
				var no_elem = q$("table[class='statusParameter1'] tbody tr", base).eq(0).children("td").eq(0);
				searchBuyRate(q$(this).attr("id"), no_elem.text(), false);
			}
		);
	}

	// トレードリンク作成
	if (g_beyond_options[TRADE_32] == true) {
		addTradeLinkOnSmallCardDeck();
	}

	// パッシブ着色、スキル使用OFF、スキル効果計算OFF、簡易デッキセットOFF
	addSkillViewOnSmallCardDeck(g_beyond_options[TRADE_31], false, false, false);

	// 出品ボックス作成
	if (g_beyond_options[TRADE_34] == true) {
		q$("#cardFileList div[class='cardStatusDetail label-setting-mode'] div[class='statusDetail clearfix']").each(
			function(index) {
				q$(this).after(
					"<span id='sell_frame" + index + "'></span>"
				);

				var base = q$(this).parents("div[class='cardStatusDetail label-setting-mode']");
				var cardid = base.children("div[id*='cardWindow_']").attr("id").replace(/cardWindow_/, "");
				var rarity = base.find("span[class='rarerity'] img").attr('title');
				var cardno = base.find("table[class='statusParameter1'] tbody tr").eq(0).children("td").eq(0).text();

				// 固定出品ボタンを出す場合、最後がtrue
				createSellBox("sell_frame" + index, index, cardid, parseInt(cardno), rarity, g_beyond_options[TRADE_35]);
			}
		);
	}
}

//----------------------//
// beyond設定画面の描画 //
//----------------------//
function draw_setting_window(append_target) {
	append_target.append(" \
		<div id='beyond_setting_view' class='roundbox' style='display: none;'> \
			<div style='margin: 4px; font-weight: bold; font-size: 12px; color: #009;'> \
				<span style='font-weight: bold;'>beyond設定</span> \
				<span><input id='beyond_option_on' type='button' value='全設定をON'></input></span> \
				<span><input id='beyond_option_off'  type='button' value='全設定をOFF'></input></span> \
				<span><input id='beyond_option_default'  type='button' value='初期設定に戻す'></input></span> \
			</div> \
			<div id='beyond_tabs' style='margin: 4px; font-size:10px;'> \
				<ul> \
					<li><a href='#tab-common'>共通</a></li> \
					<li><a href='#tab-profile'>Profile</a></li> \
					<li><a href='#tab-village'>都市</a></li> \
					<li><a href='#tab-map'>地図</a></li> \
					<li><a href='#tab-alliance'>同盟</a></li> \
					<li><a href='#tab-deck'>デッキ</a></li> \
					<li><a href='#tab-deck2'>デッキ2</a></li> \
					<li><a href='#tab-trade'>Trade</a></li> \
					<li><a href='#tab-report'>報告書</a></li> \
					<li><a href='#tab-note'>書簡</a></li> \
					<li><a href='#tab-busyodas'>武将ダス</a></li> \
					<li><a href='#tab-book'>図鑑</a></li> \
					<li><a href='#tab-any'>その他</a></li> \
				</ul> \
				<div id='tab-common'> \
					<div><input type='checkbox' id='" + COMMON_01 + "'><label for='" + COMMON_01 + "'>資源タイマーを追加</label></input></div> \
					<div><input type='checkbox' id='" + COMMON_02 + "'><label for='" + COMMON_02 + "'>プルダウンメニューを差し替える</label></input></div> \
					<div><input type='checkbox' id='" + COMMON_03 + "'><label for='" + COMMON_03 + "'>天気バー上に天気予告を常時表示する</label></input></div> \
				</div> \
				<div id='tab-profile'> \
					<div><input type='checkbox' id='" + PROFILE_01 + "'><label for='" + PROFILE_01 + "'>ランキングへのリンクを追加</label></input></div> \
					<div><input type='checkbox' id='" + PROFILE_02 + "'><label for='" + PROFILE_02 + "'>デュエルの次階級へのDPを表示</label></input></div> \
					<div><input type='checkbox' id='" + PROFILE_03 + "'><label for='" + PROFILE_03 + "'>座標を全体地図へのリンクに変換</label></input></div> \
					<div><input type='checkbox' id='" + PROFILE_04 + "'><label for='" + PROFILE_04 + "'>領地一覧にソート機能を追加</label></input></div> \
					<div><input type='checkbox' id='" + PROFILE_05 + "'><label for='" + PROFILE_05 + "'>領地、NPC座標、NPC取得・隣接情報の検索機能を追加</label></input></div> \
				</div> \
				<div id='tab-village'> \
					<div style='font-weight: bold'>兵士生産画面</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + VILLAGE_01 + "'><label for='" + VILLAGE_01 + "'>生産時間が一定時間を超える兵士生産を禁止</label></input></div> \
						<div style='margin-left: 8px;'> \
							<div> \
								<input type='text' size='2' id='" + VILLAGE_02 + "'></input><span class='m4l'>時間</span> \
							</div> \
						</div> \
					</div> \
				</div> \
				<div id='tab-map'> \
					<div style='font-weight: bold'>出兵画面</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + MAP_11 + "'><label for='" + MAP_11 + "'>出兵時にデッキ武将を一斉出兵する機能を追加</label></input></div> \
					</div> \
					<br> \
					<div style='font-weight: bold; display: none;'>出兵先自動選択対応機能</div> \
					<div style='margin-left: 8px; display: none;'> \
						<div><input type='checkbox' id='" + MAP_12 + "'><label for='" + MAP_12 + "'>出兵種別を初期設定する</label></input></div> \
						<div style='margin-left: 8px;'> \
							<div>以下に設定された座標の場合「鹵獲」、記載のない座標の場合「殲滅」に出兵種別を設定</div> \
							<div>記入方法 座標-600,600の場合、(-600,600)または-600,600</div> \
							<div> \
								<input type='textarea'	rows='12' cols='20' id='" + MAP_13 + "'></input> \
							</div> \
						</div> \
					</div> \
				</div> \
				<div id='tab-alliance'> \
					<div style='font-weight: bold'>同盟トップ画面</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + ALLIANCE_01 + "'><label for='" + ALLIANCE_01 + "'>同盟ランキングのソート機能を追加</label></input></div> \
						<div><input type='checkbox' id='" + ALLIANCE_02 + "'><label for='" + ALLIANCE_02 + "'>自分のランキング位置を着色</label></input></div> \
						<div><input type='checkbox' id='" + ALLIANCE_03 + "'><label for='" + ALLIANCE_03 + "'>同盟補助情報の追加</label></input></div> \
						<div><input type='checkbox' id='" + ALLIANCE_04 + "'><label for='" + ALLIANCE_04 + "'>CSVダウンロード機能の追加</label></input></div> \
						<div><input type='checkbox' id='" + ALLIANCE_05 + "'><label for='" + ALLIANCE_05 + "'>同盟員本拠座標取得機能の追加</label></input></div> \
					</div> \
					<br> \
					<div style='font-weight: bold'>同盟ログ</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + ALLIANCE_11 + "'><label for='" + ALLIANCE_11 + "'>報告書自動整形機能を追加</label></input></div> \
						<div style='margin-left: 8px;'> \
							<div><input type='checkbox' id='" + ALLIANCE_12 + "'><label for='" + ALLIANCE_12 + "'>損害率表示列を追加</label></input></div> \
						</div> \
						<div><input type='checkbox' id='" + ALLIANCE_13 + "'><label for='" + ALLIANCE_13 + "'>ログ検索機能を追加</label></input></div> \
					</div> \
					<br> \
					<div style='font-weight: bold'>配下同盟管理</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + ALLIANCE_41 + "'><label for='" + ALLIANCE_41 + "'>配下検索機能を追加</label></input></div> \
					</div> \
					<br> \
					<div style='font-weight: bold'>同盟掲示板</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + ALLIANCE_21 + "'><label for='" + ALLIANCE_21 + "'>発言順序を逆順（＝最新記事が一番上になるよう）にする</label></input></div> \
					</div> \
					<br> \
					<div style='font-weight: bold'>管理画面</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + ALLIANCE_31 + "'><label for='" + ALLIANCE_31 + "'>離反ラジオボタンを選択不可能にする</label></input></div> \
					</div> \
					<br> \
				</div> \
				<div id='tab-deck'> \
					<div style='font-weight: bold'>共通設定</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + DECK_51 + "'><label for='" + DECK_51 + "'>兵士管理リンクをクリックした際の初期タブを「全て表示」にする</label></input></div> \
					</div> \
					<div style='margin-left: 8px;'> \
						<div class='red'>以下の機能はカード表示モード（小）でのみ有効です</div> \
						<div><input type='checkbox' id='" + DECK_01 + "'><label for='" + DECK_01 + "'>パッシブスキルを着色</label></input></div> \
						<div><input type='checkbox' id='" + DECK_02 + "'><label for='" + DECK_02 + "'>トレードへのリンクを追加</label></input></div> \
						<div><input type='checkbox' id='" + DECK_03 + "'><label for='" + DECK_03 + "'>ページ切り替えのプルダウンを追加</label></input></div> \
					</div> \
					<br> \
					<div style='font-weight: bold'>デッキ画面</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + DECK_15 + "'><label for='" + DECK_15 + "'>デッキ：ファイルに下げるボタンを1クリックで使用に変更</label></input></div> \
						<div><input type='checkbox' id='" + DECK_16 + "'><label for='" + DECK_16 + "'>デッキ：内政官を1クリックでファイルに下げるボタンを追加</label></input></div> \
						<div style='margin-left: 8px;'> \
							<div><input type='checkbox' id='" + DECK_19 + "'><label for='" + DECK_19 + "'>内政官解除後にデッキ表示を更新する（チェックがない場合は更新ボタンが出ます）</label></input></div> \
						</div> \
						<div><input type='checkbox' id='" + DECK_17 + "'><label for='" + DECK_17 + "'>デッキ：内政官以外を1クリックで全てファイルに下げるボタンを追加</label></input></div> \
						<div><input type='checkbox' id='" + DECK_18 + "'><label for='" + DECK_18 + "'>デッキ：一括デッキセット機能を追加</label></input></div> \
						<div><input type='checkbox' id='" + DECK_1B + "'><label for='" + DECK_1B + "'>デッキ：一括ラベルセット機能を追加</label></input></div> \
						<div class='red'>以下の機能はカード表示モード（小）でのみ有効です</div> \
						<div><input type='checkbox' id='" + DECK_11 + "'><label for='" + DECK_11 + "'>ファイル内スキル検索機能を追加</label></input></div> \
						<div><input type='checkbox' id='" + DECK_12 + "'><label for='" + DECK_12 + "'>スキル補正効果表示機能を追加</label></input></div> \
						<div><input type='checkbox' id='" + DECK_13 + "'><label for='" + DECK_13 + "'>デッキ：内政スキル使用リンクの追加（回復：赤、内政：青）</label></input></div> \
						<div style='margin-left: 8px;'> \
							<div><input type='checkbox' id='" + DECK_1A + "'><label for='" + DECK_1A + "'>デッキ：内政スキル使用後画面を強制更新する</label></input></div> \
						</div> \
						<div><input type='checkbox' id='" + DECK_14 + "'><label for='" + DECK_14 + "'>デッキ：1クリックデッキセットボタン追加</label></input></div> \
					</div> \
					<br> \
					<div style='font-weight: bold'>合成画面</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + DECK_34 + "'><label for='" + DECK_34 + "'>合成画面のボタン説明表示を消す</label></input></div> \
						<div><input type='checkbox' id='" + DECK_31 + "'><label for='" + DECK_31 + "'>修行合成でレベルが上がった時に、レベルアップボタンを追加</label></input></div> \
						<div class='red'>以下の機能はカード表示モード（小）でのみ有効です</div> \
						<div><input type='checkbox' id='" + DECK_32 + "'><label for='" + DECK_32 + "'>自動スキルレベルアップ合成機能を追加</label></input></div> \
						<div><input type='checkbox' id='" + DECK_33 + "'><label for='" + DECK_33 + "'>スキルレベルアップ合成画面でベースカードの交換機能を追加</label></input></div> \
						<div><input type='checkbox' id='" + DECK_35 + "'><label for='" + DECK_35 + "'>自動副将枠解放合成機能を追加</label></input></div> \
					</div> \
				</div> \
				<div id='tab-deck2'> \
					<div style='font-weight: bold'>倉庫画面</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + DECK_61 + "'><label for='" + DECK_61 + "'>スキル3つ以上、レベル50、スコア100万のいずれかに該当するカードを倉庫へ移動できなくする</label></input></div> \
					</div> \
					<br> \
					<div style='font-weight: bold'>領地一覧画面</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + DECK_21 + "'><label for='" + DECK_21 + "'>領地一覧の並び方を初期状態に戻す</label></input></div> \
						<div><input type='checkbox' id='" + DECK_22 + "'><label for='" + DECK_22 + "'>「新領地」で始まる領地を全て破棄する機能を追加</label></input></div> \
					</div> \
				</div> \
				<div id='tab-report'> \
					<div><input type='checkbox' id='" + REPORT_01 + "'><label for='" + REPORT_01 + "'>報告書自動整形機能を追加</label></input></div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + REPORT_02 + "'><label for='" + REPORT_02 + "'>損害率表示列を追加</label></input></div> \
					</div> \
					<div><input type='checkbox' id='" + REPORT_11 + "'><label for='" + REPORT_11 + "'>討伐・攻撃ログのTSV出力機能の追加</label></input></div> \
					<br> \
				</div> \
				<div id='tab-note'> \
					<div><input type='checkbox' id='" + NOTE_01 + "'><label for='" + NOTE_01 +"'>運営書簡の開封補助機能を追加</label></input></div> \
					<div><input type='checkbox' id='" + NOTE_02 + "'><label for='" + NOTE_02 +"'>書簡に添付されたgyazoを自動展開する</label></input></div> \
				</div> \
				<div id='tab-trade'> \
					<div style='font-weight: bold'>トレード画面</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + TRADE_01 + "'><label for='" + TRADE_01 + "'>一覧の上にページ切り替えリンクを追加</label></input></div> \
						<div><input type='checkbox' id='" + TRADE_02 + "'><label for='" + TRADE_02 + "'>表示レアリティ固定ボタン追加</label></input></div> \
						<div><input type='checkbox' id='" + TRADE_03 + "'><label for='" + TRADE_03 + "'>合成・修行効率表示機能を追加</label></input></div> \
						<div><input type='checkbox' id='" + TRADE_04 + "'><label for='" + TRADE_04 + "'>トレード・武将図鑑へのリンクを追加</label></input></div> \
						<div><input type='checkbox' id='" + TRADE_05 + "'><label for='" + TRADE_05 + "'>簡易落札ボタンを追加</label></input></div> \
						<div><input type='checkbox' id='" + TRADE_06 + "'><label for='" + TRADE_06 + "'>強制公開期限の日付で色を変える</label></input></div> \
						<div><input type='checkbox' id='" + TRADE_07 + "'><label for='" + TRADE_07 + "'>落札まで24時間を超える入札リンクを消す</label></input></div> \
					</div> \
					<br> \
					<div style='font-weight: bold'>トレード履歴画面</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + TRADE_41 + "'><label for='" + TRADE_41 + "'>当日9:30-10:00落札カードのみ背景色を変える</label></input></div> \
					</div> \
					<br> \
					<div style='font-weight: bold'>出品中のカード画面</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + TRADE_11 + "'><label for='" + TRADE_11 + "'>自動出品リンク作成機能を追加</label></input></div> \
						<div><input type='checkbox' id='" + TRADE_12 + "'><label for='" + TRADE_12 + "'>推定収入・手数料表示を追加</label></input></div> \
						<div><input type='checkbox' id='" + TRADE_13 + "'><label for='" + TRADE_13 + "'>収入期待値表示を追加</label></input></div> \
					</div> \
					<br> \
					<div style='font-weight: bold'>入札中のカード画面</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + TRADE_21 + "'><label for='" + TRADE_21 + "'>リンクURLからの自動入札機能を追加</label></input></div> \
					</div> \
					<br> \
					<div style='font-weight: bold'>出品画面</div> \
					<div style='margin-left: 8px;'> \
						<div class='red'>以下の機能はカード表示モード（小）でのみ有効です</div> \
						<div><input type='checkbox' id='" + TRADE_31 + "'><label for='" + TRADE_31 + "'>パッシブスキルの着色</label></input></div> \
						<div><input type='checkbox' id='" + TRADE_32 + "'><label for='" + TRADE_32 + "'>トレードへのリンクを追加</label></input></div> \
						<div><input type='checkbox' id='" + TRADE_33 + "'><label for='" + TRADE_33 + "'>即時落札価格確認ボタンを追加</label></input></div> \
						<div><input type='checkbox' id='" + TRADE_34 + "'><label for='" + TRADE_34 + "'>出品機能を追加</label></input></div> \
						<div style='margin-left: 8px;'> \
							<div><input type='checkbox' id='" + TRADE_35 + "'><label for='" + TRADE_35 + "'>簡易出品ボタンを追加</label></input></div> \
							<div><input type='checkbox' id='" + TRADE_36 + "'><label for='" + TRADE_36 + "'>出品カードがR以上のとき警告する</label></input></div> \
							<div><input type='text' size='6' id='" + TRADE_37 + "'><label for='" + TRADE_37 + "'>出品額初期値（テキストボックス）</label></input></div> \
							<div><input type='text' size='6' id='" + TRADE_38 + "'><label for='" + TRADE_38 + "'>出品額初期値（固定値ボタン１）</label></input></div> \
							<div><input type='text' size='6' id='" + TRADE_39 + "'><label for='" + TRADE_39 + "'>出品額初期値（固定値ボタン２）</label></input></div> \
							<div><input type='text' size='6' id='" + TRADE_3A + "'><label for='" + TRADE_3A + "'>出品額初期値（固定値ボタン３）</label></input></div> \
						</div> \
					</div> \
				</div> \
				<div id='tab-busyodas'> \
					<div style='font-weight: bold'>ブショーダス結果（1枚引き）</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + BUSYODAS_01 + "'><label for='" + BUSYODAS_01 + "'>結果画面に出品機能を追加</label></input></div> \
						<div style='margin-left: 8px;'> \
							<div><input type='checkbox' id='" + BUSYODAS_02 + "'><label for='" + BUSYODAS_02 + "'>簡易出品ボタンを追加</label></input></div> \
						</div> \
					</div> \
					<br> \
					<div style='font-weight: bold'>武将カード入手履歴画面</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + BUSYODAS_11 + "'><label for='" + BUSYODAS_11 + "'>トレード・武将図鑑へのリンクを追加</label></input></div> \
					</div> \
				</div> \
				<div id='tab-book'> \
					<div style='font-weight: bold'>武将図鑑</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + BOOK_01 + "'><label for='" + BOOK_01 + "'>トレードへのリンクを追加</label></input></div> \
						<div><input type='checkbox' id='" + BOOK_02 + "'><label for='" + BOOK_02 + "'>即時落札価格確認・簡易落札ボタンを追加</label></input></div> \
						<div><input type='checkbox' id='" + BOOK_99 + "'><label for='" + BOOK_99 + "' class='green'>武将図鑑：スキル補正効果表示機能の追加（新カード検証用）</label></input></div> \
					</div> \
					<br> \
					<div style='font-weight: bold'>スキル図鑑</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + BOOK_11 + "'><label for=' + BOOK_11 + '>トレードへのリンクを追加</label></input></div> \
					</div> \
				</div> \
				<div id='tab-any'> \
					<div style='font-weight: bold'>その他</div> \
					<div style='margin-left: 8px;'> \
						<div><input type='checkbox' id='" + ANY_01 + "'><label for='" + ANY_01 + "'>右メニューにレイド用のショートカットを追加</label></input></div> \
						<div><input type='checkbox' id='" + ANY_02 + "'><label for='" + ANY_02 + "'>個人掲示板の領地座標をリンクに変換</label></input></div> \
					</div> \
					<br> \
					<div style='font-weight: bold'>エクスポート／インポート</div> \
					<div style='margin-left: 8px;'> \
						<div style='font-weight: bold;'>beyondの設定のエクスポート／インポートができます</div> \
						<div style='font-weight: bold; color: red;'>（注意：エクスポートは現在保存されているオプションの情報を出力します）</div> \
						<div> \
							<textarea id='beyond_io_box' rows='12' cols='70'></textarea> \
							<br> \
							<input type='button' id='export_options' value='エクスポート'></input> \
							<input type='button' id='import_options' value='インポート'></input> \
						</div> \
					</div> \
				</div> \
			</div> \
			<div style='margin: 4px;'> \
				<input type='button' id='save_beyond_options' value='保存'></input> \
				<input type='button' id='close_settings' value='閉じる'></input> \
			</div> \
		</div> \
	");

	// 運営のcssを無効化
	q$("#beyond_tabs li").css({'padding':'0px', 'min-width':'0px'});
	q$("#beyond_tabs li a").css({'background':'none'});
	q$("#beyond_tabs div label").css({'font-size':'12px', 'margin-left':'4px', 'vertical-align':'0.2em'});
	q$("div[id*='tab-'] div").css({'padding':'1px'});

	q$("#beyond_tabs").tabs();

	// 保存されているoption設定を設定画面に反映
	for (var key in g_beyond_options) {
		if (q$("#" + key).length > 0) {
			// チェックボックスの場合、チェックのオンオフを再現
			if (q$("#" + key).attr('type') == 'checkbox') {
				q$("#" + key).prop('checked', g_beyond_options[key]);
			} else if (q$("#" + key).attr('type') == 'text') {
				q$("#" + key).val(g_beyond_options[key]);
			}
		}
	}

	// エクスポートオプション
	q$("#export_options").on('click',
		function() {
			q$("#beyond_io_box").val(JSON.stringify(g_beyond_options));
		}
	);

	// インポートオプション
	q$("#import_options").on('click',
		function() {
			var options;
			try {
				options = JSON.parse(q$("#beyond_io_box").val());
			} catch(e) {
				alert("文法エラーがあるため設定を取り込めません");
				return;
			}
			if (typeof options !="object") {
				alert("文法エラーがあるため設定を取り込めません");
				return;
			}

			// まず初期値に戻す
			q$("#beyond_option_default").click();

			// インポートした設定に戻す
			for (var key in options) {
				if (q$("#" + key).length > 0) {
					// チェックボックスの場合、チェックのオンオフを再現
					if (q$("#" + key).attr('type') == 'checkbox') {
						q$("#" + key).prop('checked', options[key]);
					} else if (q$("#" + key).attr('type') == 'text') {
						q$("#" + key).val(options[key]);
					}
				}
			}

			alert("オプションをインポートしました。保存せずに閉じた場合はインポートは無効になります。");
		}
	);

	// 設定オンボタン
	q$("#beyond_option_on").on('click',
		function() {
			for (var key in g_beyond_options) {
				if (q$("#" + key).length > 0) {
					// チェックボックスの場合、全てオン
					if (q$("#" + key).attr('type') == 'checkbox') {
						q$("#" + key).prop('checked', true);
					}
				}
			}
		}
	);

	// 設定オフボタン
	q$("#beyond_option_off").on('click',
		function() {
			for (var key in g_beyond_options) {
				if (q$("#" + key).length > 0) {
					// チェックボックスの場合、全てオフ
					if (q$("#" + key).attr('type') == 'checkbox') {
						q$("#" + key).prop('checked', false);
					}
				}
			}
		}
	);

	// 初期値に戻すボタン
	q$("#beyond_option_default").on('click',
		function() {
			var options = getDefaultOptions();

			for (var key in g_beyond_options) {
				if (q$("#" + key).length > 0) {
					// チェックボックスの場合、全てオフ
					if (q$("#" + key).attr('type') == 'checkbox') {
						q$("#" + key).prop('checked', options[key]);
					} else {
						q$("#" + key).val(options[key]);
					}
				}
			}
		}
	);

	// 保存ボタン
	q$("#save_beyond_options").on('click',
		function() {
			var options = getDefaultOptions();

			var obj = new Object;
			var items = q$("#beyond_setting_view input");
			for (var i = 0; i < items.length; i++) {
				if (items.eq(i).attr('type') == 'checkbox') {
					obj[items.eq(i).attr('id')] = items.eq(i).prop('checked');
				} else if (items.eq(i).attr('type') == 'text') {
					var num = parseInt(items.eq(i).val());
					if (!isNaN(num) && num > 0) {
						obj[items.eq(i).attr('id')] = num;
					} else {
						obj[items.eq(i).attr('id')] = options[items.eq(i).attr('id')];
					}
				}
			}

			// 設定を保存
			GM_setValue(SERVER_NAME + '_beyond_options', JSON.stringify(obj));

			alert("保存しました。");
			q$("#close_settings").click();
		}
	);

	// 閉じるボタン
	q$("#close_settings").on('click',
		function() {
			q$("#beyond_setting_view").css({'display':'none'});
		}
	);
}

//----------------------------//
// デッキ：回復時間チェッカー //
//----------------------------//
function deck_resttime_checker() {
	// 小カード表示以外では出さない
	if (getDeckModeSmall() == false) {
		return;
	}

	q$("#file-head").before(
		"<div>" +
			"<div class='bold-red'>ファイル内カードスキル・回復時間検索（スキル名、スキル効果、武将カードNo.で検索可能。副将は対象外）</div>" +
				"<fieldset style='-moz-border-radius:5px; border-radius: 5px; -webkit-border-radius: 5px; margin-bottom: 6px; border: 2px solid black;'>" +
					"<div style='margin: 3px 3px 3px 3px;'>" +
						"<span style='font-weight: bold;'>検索条件</span>" +
						"<input type='text' id='search_skill' size=20 style='margin-left:4px; margin-right: 4px; padding: 2px;'>" +
						"<input type='button' id='search_file' value='検索'>&nbsp;" +
						"<span id='search_status' style='font-weight: bold;'></span>" +
					"</div>" +
				"</fieldset>" +
				"<div id='search-result-div' class='roundbox' style='display: none;'>" +
					"<div style='padding: 4px;'>" +
						"<span style='font-weight: bold; color: red;'>スキル検索結果</span>" +
						"<input type='button' id='close_search_file' style='margin: 4px;' value='閉じる'>&nbsp;" +
						"<div style='overflow-y: auto; max-height: 500px;'>" +
							"<table id='search-result' style='font-size: 8pt; display: none; margin-right: 25px;'>" +
							"</table>" +
						"</div>" +
						"<input type='button' id='close_search_file' style='margin: 4px;' value='閉じる'>&nbsp;" +
					"</div>" +
				"</div>" +
			"</div>" +
		"</div>"
	);

	// 検索
	q$("input[id='search_file']").on('click',
		function(){
			var target = q$("#search_skill").val().replace(/[ \t　]/g, "");
			if (target == "") {
				alert("検索するスキル名を入力してください。");
				return;
			}
			q$("#search_file").val("処理実行中").prop("disabled", true);

			q$("#search-result-div").css({'display':'none'});
			q$("#search-result").css({'display':'none'});
			q$("#search-result tr").remove();
			search_skills(target);
		}
	);

	// 閉じる
	q$("input[id='close_search_file']").on('click',
		function(){
			q$("#search-result-div").css({'display':'none'});
			q$("#search-result").css({'display':'none'});
			q$("#search-result tr").remove();
		}
	);

	// regexp用エスケープ
	function regexp_escape(str) {
		return str.replace(/[-[\]{}()*+!<=:?.\/\\^$#\s,]/g, '\\$&');
	}

	// デッキからスキルを検索
	function search_skills(skill_name) {
		// 検索スキル名の正規表現を作る
		var regexp = new RegExp(skill_name);

		// 最大ページ番号の取得
		var max = 1;
		if (q$("#rotate ul[class=pager]").length > 0) {
			var pages = q$("#rotate ul[class=pager] li");
			for (var i = 0; i < pages.length; i++) {
				var page = parseInt(q$(pages[i]).text());
				if (!isNaN(page) && max < page) {
					max = page;
				}
			}
		}

		// ラベル取得
		var match = location.search.match(/l=(\d+)/);
		var lab = 0;
		if (match != null) {
			lab = match[1];
		}

		// ファイルの検索
		var wait = false;
		var count = 1;
		var result = [];
		var maxhits = 0;
		var timer1 = setInterval(
			function () {
				if (wait) {
					return;
				}
				wait = true;

				q$("#search_status").text("ファイル検索中・・・" + count + " / " + max);

				var no;
				if (lab != 0) {
					no = {'p': count, 'l' : lab};
				} else {
					no = {'p': count};
				}
				q$.ajax({
					url: BASE_URL + '/card/deck.php',
					type: 'GET',
					datatype: 'html',
					cache: false,
					data: no
				})
				.done(function(res) {
					var resp = q$("<div>").append(res);
					var cards = q$("#cardFileList div[class='cardStatusDetail label-setting-mode']", resp);
					if (cards.length > 0) {
						for (var i = 0; i < cards.length; i++) {
							// 戦闘不可カードは飛ばす
							var unset = q$("div[class='set dis_set_mini']", cards.eq(i));
							if (unset.length > 0 && unset.eq(0).text() == '戦闘不可カード') {
								continue;
							}

							// カードID
							var match = q$("div[class='left'] a[class^='thickbox']", cards.eq(i)).attr('href').match(/cardWindow_(\d+)/);
							var cid = match[1];

							// スキル本文
							var skillTexts = q$("#cardWindow_" + cid, cards.eq(i));

							// 基礎情報(武将名、武将レベル、コスト）
							var info = q$("table[class='statusParameter1'] tbody tr", cards.eq(i));
							var cname = q$("td", info.eq(1)).eq(0).text();
							var clevel = q$("td", info.eq(2)).eq(0).text();
							var cost = q$("td", info.eq(3)).eq(0).text();
							var chp = q$("td", info.eq(5)).eq(0).text();
							var cno = q$("td", info.eq(0)).eq(0).text();

							// スキル名＋回復時間
							var info2 = q$("div[class='kaifuku_cnt']", cards.eq(i));
							var skills = [];
							for (var j = 2; j < info2.length || j <= 5; j++) {
								var skill = q$("b", info2).eq(j).text().replace(/[ \t]/g, "").replace(/^.*:/, "");
								var rest = q$("p", info2).eq(j).text().replace(/[\t]/g, "");
								skills.push({name: skill, rest: rest});
							}

							// スキル説明文
							var texts = [];
							var ss = q$("ul[class='back_skill'] li div[class*='skill']", skillTexts);
							for (var j = 0; j < ss.length; j++) {
								texts[j] = ss.eq(j).text().replace(/\n/g, "");
							}

							// ラベルセレクタ
							var labelselector = q$("div[class='otherDetail clearfix'] select[class*='changelabelbox']", cards.eq(i));

							// 内政スキルとして使用可能なスキルか判定、パッシブスキル判定
							var is_domskills = [];
							var passives = [];
							ss = q$("ul[class='back_skill'] li span[class*='skillName']", skillTexts);
							for (var j = 0; j < ss.length; j++) {
								passives[j] = ss.eq(j).hasClass("red");
								is_domskills[j] = (ss.eq(j).text().match(/防:/) != null) && (!passives[j]);
							}

							// 条件にマッチするか調べる
							var hits = [];
							for (var j = 0; j < 4; j++) {
								if (typeof skills[j] == 'undefined' || typeof texts[j] == 'undefined') {
									continue;
								}
								if (skills[j].name.match(regexp) != null || texts[j].match(regexp) != null || cno == skill_name) {
									var is_use = (skills[j].rest == '回復済み' && is_domskills[j] == true && chp == 100);
									hits.push({
										skill: skills[j],						// スキル名＋回復時間
										is_dom: is_domskills[j],				// 内政スキルとして使用可能か
										is_passive: passives[j],				// パッシブスキルか
										is_heal: is_healing_skill(texts[j]),	// 回復スキルか
										is_use: is_use							// 現在使用可能なスキルか
									});
								}
							}
							if (hits.length > 0) {
								if (maxhits < hits.length) {
									maxhits = hits.length;
								}
								result.push({
									page: count,
									cardid: cid,
									name: cname,
									level: clevel,
									cost: cost,
									hp: chp,
									skills: hits,
									selector: labelselector.prop('outerHTML').replace(/[\t\r\n]/g, "")
								});
							}
						}
					}

					count++;
					if (count > max) {
						clearInterval(timer1);

						q$("#search_status").text("結果作成中");

						// 並び替える
						result.sort(
							function(a, b) {
								var chka = a.skills[0].skill.rest.replace(/[: -]/g, "");
								var chkb = b.skills[0].skill.rest.replace(/[: -]/g, "");
								if (!isNaN(parseInt(chka)) && !isNaN(parseInt(chkb))) {
									return parseInt(chka) < parseInt(chkb) ? -1 : 1;
								}
								if (a.skills[0].skill.rest == "回復済み") {
									return -1;
								}
								if (b.skills[0].skill.rest == "回復済み") {
									return 1;
								}
								if (!isNaN(parseInt(chka))) {
									return -1;
								}
								return a.skills[0].page < b.skills[0].page ? -1 : 1;
							}
						);

						// 結果描画
						var tr = "<tr>" +
									 "<th class='tpad'>武将名</th>" +
									 "<th class='tpad'>Lv.</th>" +
									 "<th class='tpad'>HP</th>" +
									 "<th class='tpad'>ｺｽﾄ</th>" +
									 "<th class='tpad'>ラベル</th>";
						for (var i = 0; i < maxhits; i++) {
							tr += "<th class='tpad'>スキル</th>" +
									"<th class='tpad' style='width:75px;'>回復予定</th>";
						}
						tr += "</tr>";

						// 見出し
						q$("#search-result").append(tr);

						// 結果
						var recovery = 0;
						for (var i = 0; i < result.length; i++) {
							// ステータスの描画
							var st = "";
							if (result[i].hp < 100) {
								st = "style='color: red;'";
							}
							var tr = "<tr>" +
								"<td class='tpad'>" + result[i].name + "</td>" +
								"<td class='tpad'>" + result[i].level + "</td>" +
								"<td class='tpad' " + st + ">" + result[i].hp + "</td>" +
								"<td class='tpad'>" + result[i].cost + "</td>" +
								"<td class='tpad' style='padding-left: 4px; padding-right: 4px;'>" + result[i].selector + "</td>";

							// スキルの描画
							for (var j = 0; j < maxhits; j++) {
								if (j == 0) {
									var chk = result[i].skills[j].skill.rest.replace(/[: -]/g, "");
									if (!isNaN(chk)) {
										recovery ++;
									}
								}
								if (typeof result[i].skills[j] != 'undefined') {
									var color = "black";
									if (result[i].skills[j].is_heal == true) {
										color = "red";
									} else if (result[i].skills[j].is_dom == true) {
										color = "blue";
									}
									tr += "<td class='tpad' style='color: " + color + ";'>" + result[i].skills[j].skill.name + "</td>";
									if (result[i].skills[j].is_use == true) {
										tr += "<td class='tpad ctime' cardid='" + result[i].cardid + "' skill='" + result[i].skills[j].skill.name + "' heal='" + result[i].skills[j].is_heal + "'>" +
											"<span style='cursor: pointer; color: " + color + ";'>[スキル使用]</span>" +
											"</td>";
									} else {
										tr += "<td class='tpad'>" + result[i].skills[j].skill.rest + "</td>";
									}
								} else {
									tr += "<td class='tpad'>-</td>" +
											"<td class='tpad'>-</td>";
								}
							}
							tr += "</tr>";
							q$("#search-result").append(tr);
						}

						q$("#search-result-div").css({'display':'block'});
						q$("#search-result").css({'display': 'block'});

						q$("#search_status").text("ヒット数：" + result.length +", スキル回復中：" + recovery);
						q$("#search_file").val("検索").prop("disabled", false);

						// スキル実行
						q$("#search-result tr td[class*='ctime']").on('click',
							function() {
								// 実行制御
								if (g_event_process == true) {
									alert('現在スキル実行中です');
									return;
								}
								g_event_process = true;

								// 現在拠点の取得
								var village_id = q$("#deck_add_selected_village").val();

								// スキル発動後
								var _this = q$(this);
								exec_domestic_skill_step1(
									q$(this).children('span'),			// 状態表示用エレメント
									q$(this).attr('heal') == 'true',	// 回復の場合実施後デッキから落とす
									village_id,
									q$(this).attr('cardid'),	// カードID
									q$(this).attr('skill'),		// 実行スキル名
									function() {
										// 成功時挙動
										q$("td[class*='ctime']", _this.parent('tr')).off();
										q$("td[class*='ctime'] span", _this.parent('tr')).html(
											"<span style='color: gray;'>使用不可</span>"
										);
										g_event_process = false;
									},
									function() {
										// 失敗時挙動
										_this.children('span').text("[スキル使用]");
										g_event_process = false;
									}
								);
							}
						);
					}
					wait = false;
				});
			}, AJAX_REQUEST_INTERVAL
		);
	}
}

//----------------------------------------------------------------------
// デッキ：一括デッキ解除追加
//----------------------------------------------------------------------
function addAllDropDeckButton() {
	// デッキにカードがない場合は何もしない
	if (q$("#cardListDeck").length === 0) {
		return;
	}

	// 解除ボタン追加
	q$("#cardListDeck div[class='number cost clearfix']").append(
		"<div id='drop_all_cards' style='font-weight: bold; font-size: 14px;'>" +
			"<input type='button' style='margin-top: 4px;' value='内政官以外を全てファイルに下げる'></input>" +
		"</div>"
	);

	q$("#drop_all_cards input").on('click',
		function() {
			// デッキから下ろせるカードIDを取得
			var deckcards = q$("#cardListDeck div[class='cardColmn']");
			var cardid_list = [];
			for (var i = 0; i < deckcards.length; i++) {
				var base = q$("div[class='clearfix']", deckcards.eq(i));
				var cardid = 0;

				// 1クリック有効時とそうでない場合でとり方が変わる
				if (g_beyond_options[DECK_15]) {
					var span = q$("span[id*='card_']", base);
					if (span.length === 0) {
						continue;
					}
					var match = span.attr('id').match(/card_(\d+)/);
					if (match !== null) {
						cardid = match[1];
					}
				} else {
					var inner_a = base.children('a');
					if (inner_a.length === 0) {
						continue;
					}
					var match = inner_a.html().match(/operationExecution\(.*,.(\d+),/);
					if (match !== null) {
						cardid = match[1];
					}
				}
				if (cardid !== 0) {
					cardid_list.push(match[1]);
				}
			}

			// 下ろす武将がいなければ何もしない
			if (cardid_list.length === 0) {
				return;
			}

			// デッキから武将を下ろす
			var wait = false;
			var count = 1;
			var max = cardid_list.length;
			var timer1 = setInterval(
				function () {
					if (wait) {
						return;
					}
					wait = true;

					q$("#drop_all_cards").html("<span>武将デッキ解除処理中・・・" + count + " / " + max + "</span>");

					// 送信データ作成
					var ssid = getSessionId();
					var target_url = BASE_URL + '/card/deck.php';
					var param = {'ssid':ssid, 'mode':'unset', 'target_card':cardid_list[count - 1]};

					// 通信処理
					q$.ajax({
						url: target_url,
						type: 'POST',
						datatype: 'html',
						cache: false,
						data: param
					})
					.done(function(res) {
						count++;
						if (count > max) {
							clearInterval(timer1);

							// デッキのリロード
							location.reload();
						}
						wait = false;
					});
				}, AJAX_REQUEST_INTERVAL
			);
		}
	);
}

//------------------------//
// デッキ：一括ラベル設定 //
//------------------------//
function multipleLabelSet() {
	// 簡易ラベルセット用選択肢
	var label_texts = [];
	q$("#tab-labels li a").each(
		function() {
			if (q$(this).attr("href").indexOf("l=99") >= 0) {
				return;
			}
			label_texts.push(q$(this).text());
		}
	);

	var select_label_html = "";
	for (var i = 0; i < label_texts.length; i++) {
		select_label_html += "<option value='" + i + "'>" + label_texts[i] + "</option>";
	}

	// 一括ラベルセットボタン追加
	q$("#rotate div[class='number card_count clearfix']").eq(0).append(
		"<fieldset style='-moz-border-radius:5px; border-radius: 5px; -webkit-border-radius: 5px; border: 2px solid black; float: right;'>" +
			"<div style='margin: 2px 2px 2px 2px;'>" +
				"<div id='multiple_set_status'>" +
					"<span style='margin-left: 4px;'>一括ラベル</span>" +
					"<select id='multiple_label_set' style='margin: 4px;'>" + select_label_html +
					"</select>" +
					"<span>" +
						"<span id='multi_label_set_status' style='display: none;'></span>" +
						"<input id='multi_label_set' type='button' style='font-size: 12px;' value='実行'></input>" +
					"</span>" +
				"</div>" +
			"</div>" +
		"</fieldset>"
	);

	// 一括デッキセットボタン
	q$("#multi_label_set").on('click',
		function() {
			q$("#multi_label_set").css('display', 'none');
			q$("#multi_label_set_status").css('display', 'inline');
			q$("#multiple_label_set").css('enabled', 'false');

			var selected_label = q$("#multiple_label_set option:selected").val();

			// 最大ページ番号の取得
			var max = 1;
			if (q$("#rotate ul[class=pager]").length > 0) {
				var pages = q$("#rotate ul[class=pager] li");
				for (var i = 0; i < pages.length; i++) {
					var page = parseInt(q$(pages[i]).text());
					if (!isNaN(page) && max < page) {
						max = page;
					}
				}
			}

			// ラベル取得
			match = location.search.match(/l=(\d+)/);
			var lab = 0;
			if (match != null) {
				lab = match[1];
			}

			// ファイルの検索
			var base_search_string = location.search.replace(/[?&]p=\d+/,"").replace(/[?&]l=\d+/,"").replace(/#file.*$/,"");
			var wait = false;
			var count = 1;
			var cids = [];
			var timer1 = setInterval(
				function () {
					if (wait) {
						return;
					}
					wait = true;

					var no;
					if (base_search_string === "") {
						base_search_string += "?";
					} else {
						base_search_string += "&";
					}
					if (lab != 0) {
						base_search_string += "p=" + count + "&l=" + lab;
					} else {
						base_search_string += "p=" + count;
					}

					q$("#multi_label_set_status").text("検索中(" + Math.floor((count - 1)/max * 100) + "%)");

					q$.ajax({
						url: BASE_URL + '/card/deck.php' + base_search_string,
						type: 'GET',
						datatype: 'html',
						cache: false
					})
					.done(function(res) {
						var resp = q$("<div>").append(res);
						var cards = q$("#cardFileList div[class='cardStatusDetail label-setting-mode']", resp);
						if (cards.length > 0) {
							for (var i = 0; i < cards.length; i++) {
								// カードID
								var match = q$("div[class='left'] a[class^='thickbox']", cards.eq(i)).attr('href').match(/cardWindow_(\d+)/);
								if (match == null) {
									continue;
								}
								cids.push(match[1]);
							}
						}

						count++;
						if (count > max) {
							clearInterval(timer1);

							q$("#multi_label_set_status").text("検索中(100%)");

							// ラベル一括変更
							multiple_labe_set_finalstep(selected_label, cids);
						}

 						wait = false;
					});
				}, 150
			);
		}
	);

	// 選定された武将のラベルを変更する
	function multiple_labe_set_finalstep(select_label, cids) {
		var ssid = getSessionId();

		// ラベル変更
		var wait = false;
		var count = 1;
		var max = cids.length;
		var timer1 = setInterval(
			function () {
				if (wait) {
					return;
				}
				wait = true;

				q$("#multi_label_set_status").text("変更中(" + Math.floor((count - 1)/max * 100) + "%)");

				var target_url = BASE_URL + '/card/change_card_label.php';
				var param = {'SSID':ssid, 'label':select_label, 'target_card':cids[count - 1]};
				q$.ajax({
					url: target_url,
					type: 'GET',
					datatype: 'html',
					cache: false,
					data: param
				})
				.done(function(res) {
					count++;
					if (count > max) {
						clearInterval(timer1);
						location.reload();
					}
					wait = false;
				});
			}, 150
		);
	}
}

//--------------------------//
// デッキ：一括デッキセット //
//--------------------------//
function multipleDeckSet() {
	// 簡易デッキセット用選択肢
	var select_box = q$("#deck_add_selected_village").prop('outerHTML');
	var selects = q$(select_box).attr({'id': 'multiple_set_village', 'name':null}).css('margin-right', '4px');

	// 一括デッキセットボタン追加
	q$("#rotate div[class='number card_count clearfix']").eq(0).after(
		"<fieldset style='-moz-border-radius:5px; border-radius: 5px; -webkit-border-radius: 5px; margin: 4px; border: 2px solid black;'>" +
			"<div style='margin: 3px 3px 3px 3px;'>" +
				"<div id='multiple_set_status'>" +
					"<span style='margin-left: 4px;'>一括デッキセット</span>" +
					"<select id='multiple_set_mode' style='margin: 4px;'>" +
						"<option value='gi'>魏の軍極・軍防・督戦対象武将</option>" +
						"<option value='go'>呉の軍極・軍防・督戦対象武将</option>" +
						"<option value='shoku'>蜀の軍極・軍防・督戦対象武将</option>" +
						"<option value='hoka'>他の軍極・軍防・督戦対象武将</option>" +
						"<option value='renkan'>連環の計対象武将</option>" +
						"<option value='lowcost'>低コスト武将（コスト順）</option>" +
					"</select>" +
					selects.prop('outerHTML') +
					"<input id='multi_card_set' type='button' style='font-size: 12px;' value='実行'></input>" +
				"</div>" +
			"</div>" +
		"</fieldset>"
	);

	// 検索枠
	q$("div[class='sortSystem']").before(
		"<div id='multiple_deckset_div' class='roundbox' style='display: none; margin-left: 4px;'>" +
			"<div style='padding: 4px;'>" +
				"<span id='multiple_deckset_status' style='font-weight: bold; font-size: 12pt; color: red;'></span>" +
				"<table id='multiple_deckset_result' style='font-size: 10pt; display: block;'>" +
				"</table>" +
			"</div>" +
		"</div>"
	);

	// 一括デッキセットボタン
	q$("#multi_card_set").on('click',
		function() {
			// 実行ボタンを停止
			q$("#multi_card_set").prop('disabled', 'true');
			q$("#multiple_deckset_div").css('display', 'block');

			// コスト抽出
			var match = q$("div[class='number cost deck-cost__div'] div[class='state'] span[class='volume']").text().match(/(\d+) \/ (\d+)/)
			var freecost = parseFloat(parseInt(match[2]) - parseInt(match[1]));

			// 選択した一括対象
			var select_target = q$("#multiple_set_mode option:selected").val();

			// 選択した設定先拠点
			var select_village = q$("#multiple_set_village option:selected").val();

			// 最大ページ番号の取得
			var max = 1;
			if (q$("#rotate ul[class=pager]").length > 0) {
				var pages = q$("#rotate ul[class=pager] li");
				for (var i = 0; i < pages.length; i++) {
					var page = parseInt(q$(pages[i]).text());
					if (!isNaN(page) && max < page) {
						max = page;
					}
				}
			}

			q$("#multiple_deckset_status").text("一括デッキセット 対象検索中 (0/" + max + "), 候補武将数：0");

			// ラベル取得
			match = location.search.match(/l=(\d+)/);
			var lab = 0;
			if (match != null) {
				lab = match[1];
			}

			// ファイルの検索
			var wait = false;
			var count = 1;
			var generals = [];
			var general_ct = 0;
			var timer1 = setInterval(
				function () {
					if (wait) {
						return;
					}
					wait = true;

					q$("#multiple_deckset_status").text("一括デッキセット 対象検索中 (" + count + "/" + max + "), 候補武将数：" + general_ct);

					var no;
					if (lab != 0) {
						no = {'p': count, 'l' : lab};
					} else {
						no = {'p': count};
					}

					q$.ajax({
						url: BASE_URL + '/card/deck.php',
						type: 'GET',
						datatype: 'html',
						cache: false,
						data: no
					})
					.done(function(res) {
						var resp = q$("<div>").append(res);
						var cards = q$("#cardFileList div[class='cardStatusDetail label-setting-mode']", resp);
						if (cards.length > 0) {
							for (var i = 0; i < cards.length; i++) {
								// セットできないカードは除外
								var isset = q$("div[class='left'] div[class='set']", cards.eq(i));
								if (isset.length == 0) {
									continue;
								}

								// カードID
								var match = q$("div[class='left'] a[class^='thickbox']", cards.eq(i)).attr('href').match(/cardWindow_(\d+)/);
								if (match == null) {
									continue;
								}
								var cid = match[1];

								// 所属
								match = q$("#cardWindow_" + cid + " div[class*='omote_4sk cardStatus_rarerity_']", cards.eq(i)).attr('class').match(/rarerity_(gi|go|shoku|hoka)/);
								if (match == null || select_target != 'renkan' && select_target != 'lowcost' && match[1] != select_target) {
									// 所属が違う場合除外
									continue;
								}

								// 基礎情報(武将名、武将レベル、コスト）
								var info = q$("table[class='statusParameter1'] tbody tr", cards.eq(i));
								var chp = parseInt(q$("td", info.eq(5)).eq(0).text());
								if (chp < 100) {
									// HPが不足している場合は除外
									continue;
								}

								var cname = q$("td", info.eq(1)).eq(0).text();
								var clevel = parseInt(q$("td", info.eq(2)).eq(0).text());
								var cost = parseFloat(q$("td", info.eq(3)).eq(0).text());
								var cint = parseFloat(q$("td", info.eq(1)).eq(1).text());
								var cgauge = parseFloat(q$("td", info.eq(6)).eq(0).text());
								generals.push({cardid: cid, group: match[1], target: select_target, name: cname, level: clevel, cost: cost, cint: cint, pint: cint / cost, cgauge: cgauge});

								general_ct ++;
							}
						}

						count++;
						if (count > max) {
							clearInterval(timer1);

							q$("#multiple_deckset_status").text("一括デッキセット 候補抽出中(武将数：" + general_ct + ")");

							// 並び替える
							generals.sort(
								function(a, b) {
									if (a.target == 'renkan') {
										// 連環の計の場合は知力/コストの大きい順
										if (a.cint != b.cint) {
											return a.cint < b.cint ? 1 : -1;
										}
									} else if (a.target == 'lowcost') {
										// 低コストの順
										if (a.cost != b.cost) {
											return a.cost > b.cost ? 1 : -1;
										}
									} else {
										// 軍極系はコストの低い順
										if (a.cost != b.cost) {
											return a.cost > b.cost ? 1 : -1;
										}
									}
									return 0;
								}
							);

							// 候補の選定
							var used = [];
							var choosed = [];
							for (var i = 0; i < generals.length; i++) {
								if (freecost < 1 || freecost < generals[i].cost) {
									break;
								}
								if (q$.inArray(generals[i].name, used) != -1) {
									continue;
								}
								used.push(generals[i].name);
								choosed.push(generals[i]);
								freecost -= generals[i].cost;
							}

							// 武将の設定(next step)
							multiple_deck_set_finalstep(select_village, select_target, choosed);
						}
						wait = false;
					});
				}, 150
			);
		}
	);

	// 選定された武将をデッキにセットする
	function multiple_deck_set_finalstep(select_village, select_target, targets) {
		// 抽出した武将をテーブルに描画
		for (var i = 0; i < targets.length; i++) {
			// 結果描画
			var tr = "<tr>" +
						"<th class='tpad'>所属</th>" +
						"<th class='tpad'>武将名</th>" +
						"<th class='tpad'>Lv.</th>" +
						"<th class='tpad'>コスト</th>";
			if (select_target == "renkan") {
				tr += "<th class='tpad'>知力</th>";
			} else if (select_target == "lowcost") {
				tr += "<th class='tpad'>討伐</th>";
			}
			tr += "</tr>";

			// 結果
			for (var i = 0; i < targets.length; i++) {
				var group;
				var gbcolor;
				var gfcolor;
				if (targets[i].group == "gi") {
					group = "魏";
					gbcolor = "blue";
					gfcolor = "white";
				} else if (targets[i].group == "go") {
					group = "呉";
					gbcolor = "red";
					gfcolor = "white";
				} else if (targets[i].group == "shoku") {
					group = "蜀";
					gbcolor = "green";
					gfcolor = "white";
				} else {
					group = "他";
					gbcolor = "gray";
					gfcolor = "black";
				}
				tr += "<tr>" +
							"<td class='tpad' style='color: " + gfcolor + "; background-color: " + gbcolor + ";'>" + group + "</td>" +
							"<td class='tpad'>" + targets[i].name + "</td>" +
							"<td class='tpad'>" + targets[i].level + "</td>" +
							"<td class='tpad'>" + targets[i].cost + "</td>";
				if (select_target == "renkan") {
					tr += "<td class='tpad'>" + targets[i].cint + "</td>";
				} else if (select_target == "lowcost") {
					tr += "<td class='tpad'>" + targets[i].cgauge + "</td>";
				}
				tr += "</tr>";
			}

			// 見出し
			q$("#multiple_deckset_result").append(tr);

			// 武将の配置
			var ssid = getSessionId();

			// ファイルの検索
			var wait = false;
			var count = 1;
			var max = targets.length;
			var timer1 = setInterval(
				function () {
					if (wait) {
						return;
					}
					wait = true;

					q$("#multiple_deckset_status").text("一括デッキセット 武将配置中 (" + count + "/" + max + ")");
					var target_url = BASE_URL + '/card/deck.php';
					var card_id = targets[count - 1].cardid;
					var param = {'ssid':ssid, 'target_card':card_id, 'mode':'set'};
					param["selected_village[" + card_id + "]"] = select_village;
					q$.ajax({
						url: target_url,
						type: 'POST',
						datatype: 'html',
						cache: false,
						data: param
					})
					.done(function(res) {
						count++;
						if (count > max) {
							clearInterval(timer1);
							location.reload();
						}
						wait = false;
					});
				}, 150
			);
		}
	}
}

//----------------------------------------------------------------------
// デッキ：デッキ解除追加
//----------------------------------------------------------------------
function addDropDeckCard() {
	// デッキにカードがない場合は何もしない
	if (q$("#cardListDeck").length === 0) {
		return;
	}

	// ファイルに戻すボタンのイベントを書き換える
	var deckcards = q$("#cardListDeck div[class='cardColmn']");
	for (var i = 0; i < deckcards.length; i++) {
		var base = q$("div[class='clearfix']", deckcards.eq(i));
		var inner_a = base.children('a');
		if (inner_a.length > 0) {
			var img = inner_a.children('img');
			var match = inner_a.html().match(/operationExecution\(.*,.([0-9].*),/);
			img.attr('onclick', null);
			if (match != null) {
				inner_a.replaceWith("<span class='pointer' id='card_" + match[1] + "'>" + inner_a.html() + "</span>");
				base.children('span').on(
					'click', function() {
						var match = q$(this).attr('id').match(/_([0-9].*)/);
						card_id = match[1];

						// 状態更新
						var elem = q$(this);
						elem.html(
							"<span class='btn_deck_set_s' style='background-color: pink; font-weight: bold; vertical-align: middle; height: 33px;'>解除中</span>"
						);
						q$(this).off('click');

						// デッキ解除実行
						setTimeout(
							function() {
								// 送信データ作成
								var ssid = getSessionId();
								var target_url = BASE_URL + '/card/deck.php';
								var param = {'ssid':ssid, 'mode':'unset', 'target_card':card_id};

								// 通信処理
								q$.ajax({
									url: target_url,
									type: 'POST',
									datatype: 'html',
									cache: false,
									data: param
								})
								.done(function(res) {
									// 状態更新
									elem.html(
										"<span class='btn_deck_set_s' style='background-color: pink; font-weight: bold; vertical-align: middle; height: 33.0333px;'>解除完了</span>"
									);
									elem.children("span").append(
										"<input type='button' value='更新'></input>"
									).on('click',
										function() {
											// デッキのリロード
											location.reload();
										}
									);
								});
							}, AJAX_REQUEST_INTERVAL
						);
					}
				);
			}
		}
	}
}

//----------------------------------------------------------------------
// デッキ：デッキ内政官解除追加
//----------------------------------------------------------------------
function addDropDomesticDeckCard() {
	// デッキにカードがない場合は何もしない
	if (q$("#cardListDeck").length === 0) {
		return;
	}

	// 現在拠点の取得
	var village_id = q$("#deck_add_selected_village").val();

	// ファイルに戻すボタンのイベントを書き換える
	var deckbase = q$("#cardListDeck form[class='clearfix']");
	var deckcards = deckbase.children("div[class='cardColmn']");
	for (var i = 0; i < deckcards.length; i++) {
		var base = q$("div[class='clearfix']", deckcards.eq(i));
		var html = base.html();

		// 内政設定かつ自拠点の武将のみ
		if (html.indexOf("内政セット済") < 0) {
			continue;
		} else {
			q$("dd[class='btm_none']", base).css('color', 'red');
		}

		// 内政官の所在拠点ID
		var match = q$("dd[class='btm_none'] a", base).attr('href').match(/village_change.php\?village_id=(\d+)/);

		q$("img[class='btn_deck_set_s']", base).replaceWith(
			"<span class='btn_deck_set_s' id='drop_vid_" + match[1] + "' style='font-weight: bold; vertical-align: middle; height: 33px;'>" +
				"<input value='ファイルに下げる' type='button'></input>" +
			"</span>"
		);

		q$("#drop_vid_" + match[1]).on('click',
			function() {
				if (g_event_process === true) {
					alert("他の内政官解除実行中です");
					return;
				}
				g_event_process = true;

				// イベント停止
				q$(this).off();

				// 内政官解除 step1
				drop_domestic_step1(q$(this));
			}
		);
	}

	// STEP1：拠点移動＆内政官設定チェック
	function drop_domestic_step1(element) {
		// 拠点IDの取得
		var id = element.attr('id');

		// ステータス表示変更
		element.css('background-color', 'pink').html("拠点変更中");

		// 拠点ID抽出
		var match = id.match(/drop_vid_(\d+)/);

		// 拠点移動・内政確認実行
		setTimeout(
			function() {
				// host
				var host = BASE_URL;

				// 送信データ作成
				var target_url = host + '/village_change.php?village_id=' + match[1] + '&from=menu&page=' + host + '/card/domestic_setting.php?village_id=' +  + match[1];

				// 通信処理
				q$.ajax({
					url: target_url,
					type: 'GET',
					datatype: 'html',
					cache: false
				})
				.done(function(res) {
					// 内政官がいるかチェック
					var resp = q$("<div>").append(res);
					if (q$("ul[class='domesticBtnArea']", resp).length > 0) {
						var generals = q$("ul[class='domesticBtnArea']", resp).text().replace(/[ \t\r\n]/g, "");
						if (generals.indexOf("内政中") < 0) {
							alert("内政武将がいないため中止します");

							// イベント駆動制御停止
							g_event_process = false;

							// ステータス表示変更
							element.html("処理完了");
							return;
						}
					}

					var modes = q$("input[name='mode']", resp);
					var card_id = -1;
					for (var i = 0; i < modes.length; i++) {
						if (modes.eq(i).val() != 'u_domestic') {
							continue;
						}
						card_id = q$("input[name='id']", modes.eq(i).parent()).val();
					}
					if (card_id === -1) {
						alert("内政カード情報の取得に失敗しました");

						// イベント駆動制御停止
						g_event_process = false;

						// ステータス表示変更
						element.html("処理完了");
						return;
					}

					// step2の実行
					drop_domestic_step2(element, card_id);
				});
			}, AJAX_REQUEST_INTERVAL
		);
	}

	// STEP2：内政官解除
	function drop_domestic_step2(element, card_id) {
		// ステータス表示変更
		element.html("内政官解除中");

		// 内政官解除実行
		setTimeout(
			function() {
				// 送信データ作成
				var ssid = getSessionId();
				var target_url = BASE_URL + '/card/domestic_setting.php';
				var param = {'mode':'u_domestic', 'id':card_id};

				// 通信処理
				q$.ajax({
					url: target_url,
					type: 'GET',
					datatype: 'html',
					cache: false,
					data: param
				})
				.done(function(res) {
					// step3の実行
					drop_domestic_step_final(element, card_id);
				});
			}, AJAX_REQUEST_INTERVAL
		);
	}

	// STEP3: デッキ解除
	function drop_domestic_step_final(element, card_id) {
		// ステータス表示変更
		element.html("デッキ解除中");

		// デッキ解除実行
		setTimeout(
			function() {
				// 送信データ作成
				var ssid = getSessionId();
				var target_url = BASE_URL + '/card/deck.php';
				var param = {'ssid':ssid, 'mode':'unset', 'target_card':card_id};

				// 通信処理
				q$.ajax({
					url: target_url,
					type: 'POST',
					datatype: 'html',
					cache: false,
					data: param
				})
				.done(function(res) {
					// イベント駆動制御停止
					g_event_process = false;

					// 内政官解除後にリロードするか
					if (g_beyond_options[DECK_19]) {
						// デッキのリロード
						location.reload();
					} else {
						element.html(
							"<div>解除完了<input type='button' value='更新'></input></div>"
						).on('click',
							function() {
								// デッキのリロード
								location.reload();
							}
						);

						// イベント駆動制御停止
						g_event_process = false;
					}
				});
			}, AJAX_REQUEST_INTERVAL
		);
	}
}

//--------------------------//
// デッキ：スキル系機能追加 //
//--------------------------//
function addSkillViewOnSmallCardDeck(is_draw_passive, is_draw_use_link, is_draw_skill_effect, is_easy_deck_set) {
	// ファイルリストがないページから呼ばれたら何もしない
	if (q$("#cardFileList").length == 0) {
		return;
	}

	// デッキ、ファイルへのアクセスオブジェクト
	var deckcards = q$("#cardListDeck form[class='clearfix']").children("div[class='cardColmn']");
	var cards = q$("#cardFileList div[class='cardStatusDetail label-setting-mode']");

	// パッシブスキル描画＋内政スキル発動リンク作成
	if (is_draw_passive == true || is_draw_use_link == true || is_easy_deck_set == true) {
		// ファイル制御
		for (var i = 0; i < cards.length; i++) {
			// パッシブ判定
			var elembase = cards.eq(i).children("div[class='statusDetail clearfix']");
			var elems = q$("div[class*='right'] table[class^='statusParameter2'] tbody tr", elembase);
			var elems_l = q$("div[class*='left']", elembase);
			var match = q$("div[class='illustMini'] a[class^='thickbox']", elems_l).attr('href').match(/inlineId=cardWindow_(\d+)/);
			var skills = q$("div[id='cardWindow_" + match[1] + "'] ul[class='back_skill'] li", cards.eq(i));
			var skillTexts = q$("div[id='cardWindow_" + match[1] + "'] ul[class='back_skill'] div", cards.eq(i));
			
			// デッキにセットできるかチェック
			var is_active = false;
			if (elems_l.children("div[class='set']").length == 1) {
				is_active = true;
			}

			// 簡易デッキセット用選択肢
			var select_box = q$("#deck_add_selected_village").prop('outerHTML');
			var selects = q$(select_box).attr({'id':null, 'name':null});

			for (var j = 0; j < skills.length; j++) {
				var is_passive = skills.eq(j).children("span").hasClass("red");

				// パッシブスキル可視化ならパッシブスキルのセルを赤に着色
				if (is_draw_passive == true && is_passive == true) {
					elems.eq(j+2).children("td").css('background-color', '#ffd0db');
				}

				// ここに、同一武将はセットできない、コストが足りないなどの対応がいる

				// 通常スキルかつ、内政スキル使用リンクが有効化ならスキルのセルに「使用」リンクをつける
				if (g_history_mode == false && is_draw_use_link == true && is_passive == false && is_active == true) {
					// 副将スキル以外で、防御スキルのみ使用可能とする（暫定）
					var target_el = elems.eq(j+2).children("th").eq(0);
					if (target_el.text().indexOf("副将") >= 0 || skills.eq(j).children("span").text().match(/防/) == null) {
						continue;
					}
					if (elems.eq(j+2).attr('class') == 'used') {
						// 使用済みスキルは除外
						continue;
					}

					// 回復系スキルか、通常系スキルかで処理を分ける
					if (is_healing_skill(skillTexts.eq(j).text()) == true) {
						// 回復系
						target_el.html("<span class='skr'>[使用]</span>");
						target_el.eq(0).on(
							'click', function() {
								// 自動回復スキル発動実行
								if (q$(this).children('span').length > 0) {
									q$(this).html("[使用中]");

									// 現在のスキルhtml取得
									var recover_html = q$(this).parent().children('td').html();

									var elembase = q$(this).parents("div[class='cardStatusDetail label-setting-mode']");
									var elems_l = q$("div[class='left']", elembase);
									var match = q$("div[class='illustMini'] a[class^='thickbox']", elems_l).attr('href').match(/inlineId=cardWindow_(\d+)/);

									// 現在拠点の取得
									var village_id = q$("#deck_add_selected_village").val();

									// カードID、使用スキルの取得
									var card_id = match[1];
									var use_skill = q$(this).parent().children('td').text().replace(/[ \t\r\n]/g, "").replace(/\(T\)/, '');

									// スキル発動後、デッキから落とすまで実行（＝回復）
									var _this = q$(this);
									exec_domestic_skill_step1(
										q$(this).parent().children('td'),	// 状態表示用エレメント
										true,			// 実施後デッキから落とす
										village_id,
										card_id,
										use_skill,
										function() {
											// 成功時挙動
											if (g_beyond_options[DECK_1A] == true) {	// リロード設定で挙動をかえる
												location.reload();
											} else {
												_this.off();
												_this.parent().children('td').html(recover_html).css('background-color', '#d3d3d3');
												_this.html("<span style='color: red; background-color: #ffffe0; cursor: pointer;'>[更新]</span>").off().on('click',
													function() {
														location.reload();
													}
												);
											}
										},
										function() {
											// 失敗時挙動
											_this.parent().children('td').html(recover_html);
											_this.html("<span class='skr'>[使用]</span>");
										}
									);
								}
							}
						);
					} else {
						// 内政系
						target_el.html("<span class='skb'>[使用]</span>");
						target_el.eq(0).on(
							'click', function() {
								// 自動内政スキル発動実行
								if (q$(this).children('span').length > 0) {
									q$(this).html("[使用中]");

									// 現在のスキルhtml取得
									var recover_html = q$(this).parent().children('td').html();

									var elembase = q$(this).parents("div[class='cardStatusDetail label-setting-mode']");
									var elems_l = q$("div[class='left']", elembase);
									var match = q$("div[class='illustMini'] a[class^='thickbox']", elems_l).attr('href').match(/inlineId=cardWindow_(\d+)/);

									// 現在拠点の取得
									var village_id = q$("#deck_add_selected_village").val();

									// カードID、使用スキルの取得
									var card_id = match[1];
									var use_skill = q$(this).parent().children('td').text().replace(/[ \t\r\n]/g, "").replace(/\(T\)/, '');

									// スキル発動で終了（＝内政）
									var _this = q$(this);
									exec_domestic_skill_step1(
										q$(this).parent().children('td'),	// 状態表示用エレメント
										false,
										village_id,
										card_id,
										use_skill,
										function() {
											// 成功時挙動
											if (g_beyond_options[DECK_1A] == true) {	// リロード設定で挙動をかえる
												location.reload();
											} else {
												_this.off();
												_this.parent().children('td').html(recover_html).css('background-color', '#d3d3d3');
												_this.html("<span style='color: red; background-color: #ffffe0; cursor: pointer;'>[更新]</span>").off().on('click',
													function() {
														location.reload();
													}
												);
											}
										},
										function() {
											// 失敗時挙動
											_this.parent().children('td').html(recover_html);
											_this.html("<span class='skb'>[使用]</span>");
										}
									);
								}
							}
						);
					}
				}
			}

			// 簡易デッキセットモード
			if (g_history_mode == false && is_easy_deck_set == true) {
				var el = cards.eq(i).children("div[class='otherDetail clearfix']");
				if (is_active == true) {
					el.before(
						"<div>" +
							"<input type='button' id='deck_domestic_" + i + "' style='font-size: 10px;' value='内政'></input>" +
							"<input type='button' id='deck_set_" + i + "' style='font-size: 10px;' value='配置'></input>" +
							"<span style='margin-left: 1px; font-size: 12px;'>" +
								selects.prop('outerHTML') +
							"</span>" +
						"</div>"
					);
				} else {
					el.before(
						"<div>" +
							"<input type='button' style='font-size: 10px;' value='内政' disabled></input>" +
							"<input type='button' style='font-size: 10px;' value='配置' disabled></input>" +
							"<span style='margin-left: 1px; font-size: 12px;'>" +
								selects.prop('outerHTML') +
							"</span>" +
						"</div>"
					);
				}

				// イベント定義(配置)
				q$("input[id='deck_set_" + i + "']").on('click',
					function() {
						// 状態変更
						q$(this).parent().children('input[type="button"]').prop("disabled", true);

						// デッキセット処理
						exec_deck_set(q$(this));
					}
				);

				// イベント定義(内政)
				q$("input[id='deck_domestic_" + i + "']").on('click',
					function() {
						// 状態変更
						q$(this).parent().children('input[type="button"]').prop("disabled", true);

						// デッキセット処理
						exec_domestic_step1(q$(this));
					}
				);
			}
		}
	}

	// スキル効果自動計算ボックス追加（一旦天候対応鯖では機能させない）
	if (is_draw_skill_effect == true && q$("#weather-ui").length === 0) {
		//-----------
		// 設定画面
		//-----------
		q$("form[name='form_cancel_reserved']").after(
			"<div style='position: absolute; left: 320px; width: 464px;'>" +
				"<fieldset style='-moz-border-radius:5px; border-radius: 5px; -webkit-border-radius: 5px; margin-bottom:6px; border: 2px solid black;'>" +
					"<div style='margin: 2px 2px 2px 2px;'>" +
						"<span style='font-weight: bold;'>課金設定</span>" +
						"<input type='checkbox' id='auto_atk_10' style='margin-left:6px; margin-right: 4px; padding: 2px;'>" +
						"<label for='auto_atk_10'>攻撃課金</span>" +
						"<input type='checkbox' id='auto_def_10' style='margin-left:6px; margin-right: 4px; padding: 2px;'>" +
						"<label for='auto_def_10'>防御課金</span>" +
						"<input type='checkbox' id='auto_spd_10' style='margin-left:6px; margin-right: 4px; padding: 2px;'>" +
						"<label for='auto_spd_10'>速度課金</span>" +
					"</div>" +
					"<div style='margin: 2px 2px 2px 2px;'>" +
						"<span style='font-weight: bold;'>全軍補正</span>" +
						"<span style='margin-left: 6px;'>攻撃</span>" +
						"<input type='text' id='auto_atk' size=6 style='margin-left:4px; margin-right: 4px; padding: 2px;' value='0'>" +
						"<span>%</span>" +
						"<span style='margin-left: 6px;'>防御</span>" +
						"<input type='text' id='auto_def' size=6 style='margin-left:4px; margin-right: 4px; padding: 2px;' value='0'>" +
						"<span>%</span>" +
						"<span style='margin-left: 6px;'>速度</span>" +
						"<input type='text' id='auto_spd' size=6 style='margin-left:4px; margin-right: 4px; padding: 2px;' value='0'>" +
						"<span>%</span>" +
						"<input type='button' id='save_settings' style='margin-left: 6px;' value='保存'>" +
					"</div>" +
				"</fieldset>" +
			"</div>"
		);

		//---------------------
		// 保存ボタンイベント
		//---------------------
		q$("#save_settings").on('click',
			function() {
				var obj = new Object;
				obj.auto_atk = 0;
				obj.auto_def = 0;
				obj.auto_spd = 0;
				if (!isNaN(parseFloat(q$("#auto_atk").val()))) {
					obj.auto_atk = q$("#auto_atk").val();
				}
				if (!isNaN(parseFloat(q$("#auto_def").val()))) {
					obj.auto_def = q$("#auto_def").val();
				}
				if (!isNaN((q$("#auto_spd").val()))) {
					obj.auto_spd = q$("#auto_spd").val();
				};
				obj.auto_atk_10 = q$("#auto_atk_10").prop('checked');
				obj.auto_def_10 = q$("#auto_def_10").prop('checked');
				obj.auto_spd_10 = q$("#auto_spd_10").prop('checked');

				GM_setValue(SERVER_NAME + '_auto_calc', JSON.stringify(obj));

				// チェックボックス全てのカードに反映
				q$("input[id*='auto_calc_chk_atk']").prop('checked', obj.auto_atk_10);
				q$("input[id*='auto_calc_chk_def']").prop('checked', obj.auto_def_10);
				q$("input[id*='auto_calc_chk_spd']").prop('checked', obj.auto_spd_10);

				// 全てのカードのイベントを再実行
				q$("select[id*='auto_calc']").change();
			}
		);

		//-------------------
		// デッキカード処理
		//-------------------
		var calc_options = JSON.parse(GM_getValue(SERVER_NAME + '_auto_calc', null));
		for (var i = 0; i < deckcards.length; i++) {
			var id_name = "auto_calc_w_" + i;
			var select_id = id_name + '_select';
			var addHtml = "<div style='margin-bottom: 4px;'><select id='" + select_id + "' style='width: 200px;'><option value=''>指定なし</option>";

			var skills = q$("ul[class='back_skill'] li", deckcards.eq(i).children("div[id*='card_frontback']").eq(0));
			for (var j = 0; j < skills.length; j++) {
				var skill = skills.eq(j).children("span[class*=skillName]").text().replace(/[ \t\r\n]/g, "");
				if (skill != "") {
					addHtml += "<option value='" + j + "'>" + skill + "</option>";
				}
			}
			addHtml += "</select>";

			q$("div[id*='card_frontback']", deckcards.eq(i)).eq(0).before(
				addHtml +
				"<div>" +
					"<input type='checkbox' class='m4l' id='auto_calc_chk_atk_w_" + i + "'>" +
						"<label for='auto_calc_chk_atk_w_" + i + "' style='margin-left: 2px;' >攻撃課金</label>" +
					"</input>" +
					"<input type='checkbox' class='m4l' id='auto_calc_chk_def_w_" + i + "'>" +
						"<label for='auto_calc_chk_def_w_" + i + "' style='margin-left: 2px;' >防御課金</label>" +
					"</input>" +
					"<input type='checkbox' class='m4l' id='auto_calc_chk_spd_w_" + i + "'>" +
						"<label for='auto_calc_chk_spd_w_" + i + "' style='margin-left: 2px;' >速度課金</label>" +
					"</input>" +
				"</div>"
			);

			// 各スキル値に補正枠を追加
			q$("div[class*='omote_4sk']", deckcards.eq(i)).eq(0).each(
				function() {
					// 兵種への直接アクセス導線を作る
					q$("span[class='soltype-for-sub']", this).attr('id', 'sol_type');

					// 副将表示モードの値を保持
					q$("ul[class='status']", this).append(
						"<span style='display: none;' id='sgview_w_" + i + "'>1</span>"
					);

					// Lカードだけ着色を赤ではなく紫色にするため、レアリティ判定をする
					var color = "red";
					if (q$(this).parent().attr('class').match(/_l$/)) {
						color = "violet";
					}

					// ステータス値への直接アクセス導線を作る
					var status_list = q$("ul[class='status'] li", this);
					for (var j = 0; j < status_list.length; j++) {
						var cname = status_list.eq(j).attr('class');
						var match = cname.match(/status_([a-z]*)/);
						var status_value = status_list.eq(j).text();
						var mode = "";
						if (cname.indexOf("black") >= 0) {
							mode = "0";
						} else if (cname.indexOf("red") >= 0) {
							mode = "1";
						}
						if (mode != "") {
							status_list.eq(j).attr({'id':'status_n_' + i, 'status':match[1], 'mode':mode});
							status_list.eq(j).after(
								"<li id='status_p_" + i + "' status='" + match[1] + "' mode='" + mode + "' style='display: none; color: " + color + ";' class='" + cname + "'>" + status_value + "</li>"
							);
						} else {
							status_list.eq(j).attr({'id':'status_n_' + i, 'status':match[1]});
							status_list.eq(j).after(
								"<li id='status_p_" + i + "' status='" + match[1] + "' style='display: none; color: " + color + ";' class='" + cname + "'>" + status_value + "</li>"
							);
						}
					}

					// スキル説明文への直接アクセス導線を作る
					q$("ul[class='back_skill'] li div[class*='skill']", q$(this).parents("div[id*='card_frontback']")).each(
						function(index) {
							q$(this).attr('id', 'skill_text_' + index);
						}
					);
				}
			);
		}

		//-----------------------
		// 小カードファイル処理
		//-----------------------
		var stats = ['att', 'int', 'wdef', 'sdef', 'bdef', 'rdef', 'speed'];	// ステータスマッピング用
		for (var i = 0; i < cards.length; i++) {
			var id_name = "auto_calc_" + i;
			var select_id = id_name + '_select';
			var addHtml = "<div style='margin-bottom: 4px;'><select id='" + select_id + "' name='" + select_id + "' style='width: 200px;'><option value=''>指定なし</option>";

			var elembase = cards.eq(i).children("div[class='statusDetail clearfix']");
			var elems_l = q$("div[class='left']", elembase);
			var match = q$("div[class='illustMini'] a[class^='thickbox']", elems_l).attr('href').match(/inlineId=cardWindow_(\d+)/);
			var cid = match[1];

			var skills = q$("div[id='cardWindow_" + cid + "'] ul[class='back_skill'] li", cards.eq(i));
			for (var j = 0; j < skills.length; j++) {
				var skill = skills.eq(j).children("span").text().replace(/[ \t\r\n]/g, "");
				if (skill != "" && skill.match(/^副/) == null) {
					addHtml += "<option value='" + j + "'>" + skill + "</option>";
				}
			}
			addHtml += "</select>";

			q$("div[class='statusDetail clearfix']", cards.eq(i)).before(
				addHtml +
				"<div>" +
					"<input type='checkbox' class='m4l' id='auto_calc_chk_atk_" + i + "'>" +
						"<label for='auto_calc_chk_atk_" + i + "' style='margin-left: 2px;' >攻撃課金</label>" +
					"</input>" +
					"<input type='checkbox' class='m4l' id='auto_calc_chk_def_" + i + "'>" +
						"<label for='auto_calc_chk_def_" + i + "' style='margin-left: 2px;' >防御課金</label>" +
					"</input>" +
					"<input type='checkbox' class='m4l' id='auto_calc_chk_spd_" + i + "'>" +
						"<label for='auto_calc_chk_spd_" + i + "' style='margin-left: 2px;' >速度課金</label>" +
					"</input>" +
				"</div>"
			);

			// 副将表示モードの値を保持
			cards.eq(i).after(
				"<span style='display: none;' id='sgview_" + i + "'>1</span>"
			);

			var trlist = q$("table[class='statusParameter1'] tr", cards.eq(i));
			for (var j = 0; j < trlist.length - 1; j++) {
				// 兵種への直接アクセス導線を作る
				if (j == 4) {
					trlist.eq(j).children('td').eq(0).attr('id', 'sol_type');
				}

				// ステータス値への直接アクセス導線を作る
				var tdlist = trlist.eq(j).children('td');
				if (tdlist.length == 2) {
					// 副将補正なし枠
					tdlist.eq(1).attr({'id':'status_n_' + i, 'status':stats[j]});
					tdlist.eq(1).after(
						"<td id='status_p_" + i + "' status='" + stats[j] + "' style='display: none; color: red;'>" + tdlist.eq(1).text() + "</li>"
					);
				} else {
					// 副将補正あり枠
					for (var k = 1; k <= 2; k++) {
						var cname = tdlist.eq(k).attr('class');
						var mode = "";
						if (cname.indexOf("black") >= 0) {
							mode = "0";
						} else if (cname.indexOf("red") >= 0) {
							mode = "1";
						}

						tdlist.eq(k).attr({'id':'status_n_' + i, 'status':stats[j], 'mode':mode});
						tdlist.eq(k).after(
							"<td id='status_p_" + i + "' status='" + stats[j] + "' mode='" + mode + "' style='display: none; color: red;' class='" + cname + "'>" + tdlist.eq(k).text() + "</li>"
						);
					}
				}
			}

			// スキル説明文への直接アクセス導線を作る
			q$("div[id='cardWindow_" + cid + "'] ul[class='back_skill'] li div[class*='skill']", cards.eq(i)).each(
				function(index) {
					q$(this).attr('id', 'skill_text_' + index);
				}
			);
		}

		//-------------------
		// イベント割り当て
		//-------------------
		// スキル選択時のイベント
		q$("select[id*='auto_calc']").change(
			function() {
				var options = JSON.parse(GM_getValue(SERVER_NAME + '_auto_calc', null));
				var target = q$(this).parent().parent();
				var match = q$(this).attr('id').match(/(\d+)/);
				if (q$(this).attr('id').indexOf('_w') > 0) {
					// デッキ
					correct_status(
						"sgview_w_" + match[1],
						q$(this).prop('selectedIndex') - 1,
						q$("div[id*='skill_text']", target),
						q$("span[id='sol_type'] img", target).eq(0).attr('title').substr(0,1),
						q$("li[id*='status_n']", target),
						q$("li[id*='status_p']", target),
						options,
						q$("input[id*='auto_calc_chk_']", target)
					);
				} else {
					// ファイル
					correct_status(
						"sgview_" + match[1],
						q$(this).prop('selectedIndex') - 1,
						q$("div[id*='skill_text']", target),
						q$("td[id='sol_type']", target).eq(0).text().substr(0,1),
						q$("td[id*='status_n']", target),
						q$("td[id*='status_p']", target),
						options,
						q$("input[id*='auto_calc_chk_']", target)
					);
				}
			}
		);

		// チェックボックス選択時のイベント
		q$("input[id*='auto_calc']").on('click',
			function() {
				var options = JSON.parse(GM_getValue(SERVER_NAME + '_auto_calc', null));
				var target = q$(this).parent().parent().parent();
				var match = q$(this).attr('id').match(/(\d+)/);
				if (q$(this).attr('id').indexOf('_w') > 0) {
					// デッキ
					correct_status(
						"sgview_w_" + match[1],
						q$("select", target).prop('selectedIndex') - 1,
						q$("div[id*='skill_text']", target),
						q$("span[id='sol_type'] img", target).eq(0).attr('title').substr(0,1),
						q$("li[id*='status_n']", target),
						q$("li[id*='status_p']", target),
						options,
						q$("input[id*='auto_calc_chk_']", target)
					);
				} else {
					// ファイル
					correct_status(
						"sgview_" + match[1],
						q$("select", target).prop('selectedIndex') - 1,
						q$("div[id*='skill_text']", target),
						q$("td[id='sol_type']", target).eq(0).text().substr(0,1),
						q$("td[id*='status_n']", target),
						q$("td[id*='status_p']", target),
						options,
						q$("input[id*='auto_calc_chk_']", target)
					);
				}
			}
		);

		//-----------------------------
		// 自動補正値の設定内容ロード
		//-----------------------------
		var setting_params = GM_getValue(SERVER_NAME + '_auto_calc', null);
		if (setting_params != null) {
			// 設定値がある
			var settings = JSON.parse(setting_params);
			q$("#auto_atk").val(settings.auto_atk);
			q$("#auto_def").val(settings.auto_def);
			q$("#auto_spd").val(settings.auto_spd);
			q$("#auto_atk_10").prop('checked', settings.auto_atk_10);
			q$("#auto_def_10").prop('checked', settings.auto_def_10);
			q$("#auto_spd_10").prop('checked', settings.auto_spd_10);

			// チェックボックス全てのカードに反映
			q$("input[id*='auto_calc_chk_atk']").prop('checked', settings.auto_atk_10);
			q$("input[id*='auto_calc_chk_def']").prop('checked', settings.auto_def_10);
			q$("input[id*='auto_calc_chk_spd']").prop('checked', settings.auto_spd_10);
		} else {
			// 設定値がないときは、初期値で保存
			var obj = new Object;
			obj.auto_atk = 0;
			obj.auto_def = 0;
			obj.auto_spd = 0;
			obj.auto_atk_10 = false;
			obj.auto_def_10 = false;
			obj.auto_spd_10 = false;
			GM_setValue(SERVER_NAME + '_auto_calc', JSON.stringify(obj));
		}

		//---------------------------------------------------------
		// 初期状態ではファイル内の全カードを白スキル未使用で計算
		//---------------------------------------------------------
		// デッキ
		for (var i = 0; i < deckcards.length; i++) {
			correct_status(
				"sgview_w_" + i,		// カード連番
				-1,		// 選択スキル
				q$("div[id*='skill_text']", deckcards.eq(i)),
				q$("span[id='sol_type'] img", deckcards.eq(i)).eq(0).attr('title').substr(0,1),
				q$("li[id*='status_n']", deckcards.eq(i)),
				q$("li[id*='status_p']", deckcards.eq(i)),
				calc_options,
				q$("input[id*='auto_calc_chk_']", deckcards.eq(i))
			);

			var sgviews = q$("div[class='effect clearfix'] p[class='view'] a", deckcards.eq(i));
			if (sgviews.length > 0) {
				// 運営の副将枠イベントを殺す
				sgviews.eq(0).attr({'onclick': null, 'viewid': i}).text("*表示");
				sgviews.eq(1).attr({'onclick': null, 'viewid': i}).text("-非表示");

				// オンクリック時の挙動
				sgviews.eq(0).on('click',
					function() {
						var viewid = q$(this).attr('viewid');
						q$("#sgview_w_" + viewid).text("1");

						var sel_skill = q$("#auto_calc_w_" + viewid + "_select").prop('selectedIndex') - 1;
						var dcards = q$("#cardListDeck form[class='clearfix']").children("div[class='cardColmn']");

						var sgviews = q$("div[class='effect clearfix'] p[class='view'] a", dcards.eq(viewid));
						sgviews.eq(0).text("*表示");
						sgviews.eq(1).text("-非表示");

						correct_status(
							"sgview_w_" + viewid,	// カード連番
							sel_skill,				// 選択スキル
							q$("div[id*='skill_text']", dcards.eq(viewid)),
							q$("span[id='sol_type'] img", dcards.eq(viewid)).eq(0).attr('title').substr(0,1),
							q$("li[id*='status_n']", dcards.eq(viewid)),
							q$("li[id*='status_p']", dcards.eq(viewid)),
							JSON.parse(GM_getValue(SERVER_NAME + '_auto_calc', null)),
							q$("input[id*='auto_calc_chk_']", dcards.eq(viewid))
						);
					}
				);

				// オフクリック時の挙動
				sgviews.eq(1).on('click',
					function() {
						var viewid = q$(this).attr('viewid');
						q$("#sgview_w_" + viewid).text("0");

						var sel_skill = q$("#auto_calc_w_" + viewid + "_select").prop('selectedIndex') - 1;
						var dcards = q$("#cardListDeck form[class='clearfix']").children("div[class='cardColmn']");

						var sgviews = q$("div[class='effect clearfix'] p[class='view'] a", dcards.eq(viewid));
						sgviews.eq(0).text("-表示");
						sgviews.eq(1).text("*非表示");

						correct_status(
							"sgview_w_" + viewid,	// カード連番
							sel_skill,				// 選択スキル
							q$("div[id*='skill_text']", dcards.eq(viewid)),
							q$("span[id='sol_type'] img", dcards.eq(viewid)).eq(0).attr('title').substr(0,1),
							q$("li[id*='status_n']", dcards.eq(viewid)),
							q$("li[id*='status_p']", dcards.eq(viewid)),
							JSON.parse(GM_getValue(SERVER_NAME + '_auto_calc', null)),
							q$("input[id*='auto_calc_chk_']", dcards.eq(viewid))
						);
					}
				);
			}
		}

		// ファイル
		for (var i = 0; i < cards.length; i++) {
			correct_status(
				"sgview_" + i,		// カード連番
				-1,					// 選択スキル
				q$("div[id*='skill_text']", cards.eq(i)),
				q$("td[id='sol_type']", cards.eq(i)).eq(0).text().substr(0,1),
				q$("td[id*='status_n']", cards.eq(i)),
				q$("td[id*='status_p']", cards.eq(i)),
				calc_options,
				q$("input[id*='auto_calc_chk_']", cards.eq(i))
			);

			var sgviews = q$("div[class='effect clearfix'] p[class='view'] a", cards.eq(i));
			if (sgviews.length > 0) {
				// 運営の副将枠イベントを殺す
				sgviews.eq(0).attr({'onclick': null, 'viewid': i}).text("*表示");
				sgviews.eq(1).attr({'onclick': null, 'viewid': i}).text("-非表示");

				// オンクリック時の挙動
				sgviews.eq(0).on('click',
					function() {
						var viewid = q$(this).attr('viewid');
						q$("#sgview_" + viewid).text("1");

						var sel_skill = q$("#auto_calc_" + viewid + "_select").prop('selectedIndex') - 1;
						var dcards = q$("#cardFileList div[class='cardStatusDetail label-setting-mode']");

						var sgviews = q$("div[class='effect clearfix'] p[class='view'] a", cards.eq(viewid));
						sgviews.eq(0).text("*表示");
						sgviews.eq(1).text("-非表示");

						correct_status(
							"sgview_" + viewid,		// カード連番
							sel_skill,				// 選択スキル
							q$("div[id*='skill_text']", dcards.eq(viewid)),
							q$("td[id='sol_type']", dcards.eq(viewid)).eq(0).text().substr(0,1),
							q$("td[id*='status_n']", dcards.eq(viewid)),
							q$("td[id*='status_p']", dcards.eq(viewid)),
							JSON.parse(GM_getValue(SERVER_NAME + '_auto_calc', null)),
							q$("input[id*='auto_calc_chk_']", dcards.eq(viewid))
						);
					}
				);

				// オフクリック時の挙動
				sgviews.eq(1).on('click',
					function() {
						var viewid = q$(this).attr('viewid');
						q$("#sgview_" + viewid).text("0");

						var sel_skill = q$("#auto_calc_" + viewid + "_select").prop('selectedIndex') - 1;
						var dcards = q$("#cardFileList div[class='cardStatusDetail label-setting-mode']");

						var sgviews = q$("div[class='effect clearfix'] p[class='view'] a", cards.eq(viewid));
						sgviews.eq(0).text("-表示");
						sgviews.eq(1).text("*非表示");

						correct_status(
							"sgview_" + viewid,		// カード連番
							sel_skill,				// 選択スキル
							q$("div[id*='skill_text']", dcards.eq(viewid)),
							q$("td[id='sol_type']", dcards.eq(viewid)).eq(0).text().substr(0,1),
							q$("td[id*='status_n']", dcards.eq(viewid)),
							q$("td[id*='status_p']", dcards.eq(viewid)),
							JSON.parse(GM_getValue(SERVER_NAME + '_auto_calc', null)),
							q$("input[id*='auto_calc_chk_']", dcards.eq(viewid))
						);
					}
				);
			}
		}
	}

	//--------------------------//
	// 各種デッキ制御用メソッド //
	//--------------------------//
	// デッキセット
	function exec_deck_set(element) {
		var elembase = element.parents("div[class='cardStatusDetail label-setting-mode']");
		var elems_l = q$("div[class='left']", elembase);
		var match = q$("div[class='illustMini'] a[class^='thickbox']", elems_l).attr('href').match(/inlineId=cardWindow_(\d+)/);

		// 状態表示
		element.parents("div[class='cardStatusDetail label-setting-mode']").find("div[class*=set]").eq(0).attr('class','set dis_set_mini').css('background-color', 'pink').html("デッキセット中");

		// 拠点IDの取得
		var village_id = element.parent().find('select').val();

		// カードIDの取得
		var card_id = match[1];

		// 拠点IDの取得
		var village_id = element.parent().find('select').val();

		// 送信データ作成
		var ssid = getSessionId();
		var target_url = BASE_URL + '/card/deck.php';
		var param = {'ssid':ssid, 'target_card':card_id, 'mode':'set'};
		param["selected_village[" + card_id + "]"] = village_id;

		// 通信処理
		q$.ajax({
			url: target_url,
			type: 'POST',
			datatype: 'html',
			cache: false,
			data: param
		})
		.done(function(res) {
			// 状態変更
			element.parents("div[class='cardStatusDetail label-setting-mode']").find("div[class='set dis_set_mini']").eq(0).css('background-color', 'pink').html("デッキセット済");
		});
	}

	// 内政設定のみ STEP1：拠点移動＆内政官設定チェック
	function exec_domestic_step1(element) {
		var elembase = element.parents("div[class='cardStatusDetail label-setting-mode']");
		var elems_l = q$("div[class='left']", elembase);
		var match = q$("div[class='illustMini'] a[class^='thickbox']", elems_l).attr('href').match(/inlineId=cardWindow_(\d+)/);

		// 拠点IDの取得
		var village_id = element.parent().find('select').val();

		// カードID、使用スキルの取得
		var card_id = match[1];

		// ステータス表示変更
		element.parents("div[class='cardStatusDetail label-setting-mode']").find("div[class*='set']").eq(0).attr('class','set dis_set_mini').css('background-color', 'pink').html("拠点変更中");

		// 拠点移動・内政確認実行
		setTimeout(
			function() {
				// host
				var host = BASE_URL;

				// 送信データ作成
				var target_url = host + '/village_change.php?village_id=' + village_id + '&from=menu&page=' + host + '/card/domestic_setting.php?village_id=' + village_id;

				// 通信処理
				q$.ajax({
					url: target_url,
					type: 'GET',
					datatype: 'html',
					cache: false
				})
				.done(function(res) {
					// 内政官がいるかチェック
					var resp = q$("<div>").append(res);
					if (q$("ul[class='domesticBtnArea']", resp).length > 0) {
						var generals = q$("ul[class='domesticBtnArea']", resp).text().replace(/[ \t\r\n]/g, "");
						if (generals.indexOf("内政中") != -1) {
							alert("内政設定済みの武将がいるため使用できません");

							// 状態を戻す
							element.parents().children('input[type="button"]').prop("disabled", false);
							element.parents("div[class='cardStatusDetail label-setting-mode']").find("div[class='set dis_set_mini']").eq(0).css('background-color', 'pink').html("処理完了");
							return;
						}
					}

					// step2の実行
					exec_domestic_step2(element, village_id, card_id);
				});
			}, AJAX_REQUEST_INTERVAL
		);
	}

	// 内政設定のみ STEP2：デッキ設定
	function exec_domestic_step2(element, village_id, card_id) {
		// ステータス表示変更
		element.parents("div[class='cardStatusDetail label-setting-mode']").find("div[class='set dis_set_mini']").eq(0).css('background-color', 'pink').html("ﾃﾞｯｷ設定中");

		// デッキセット実行
		setTimeout(
			function() {
				// 送信データ作成
				var ssid = getSessionId();
				var target_url = BASE_URL + '/card/deck.php';
				var param = {'ssid':ssid, 'target_card':card_id, 'mode':'set'};
				param["selected_village[" + card_id + "]"] = village_id;

				// 通信処理
				q$.ajax({
					url: target_url,
					type: 'POST',
					datatype: 'html',
					cache: false,
					data: param
				})
				.done(function(res) {
					// 拠点がずれていないかチェック
					var resp = q$("<div>").append(res);
					if (q$("#deck_add_selected_village", resp).val() != village_id) {
						alert("拠点が移動しているため中断します");

						// 状態を戻す
						element.parents().children('input[type="button"]').prop("disabled", false);
						element.parents("div[class='cardStatusDetail label-setting-mode']").find("div[class='set dis_set_mini']").eq(0).css('background-color', 'pink').html("処理完了");
					} else {
						// step3：内政設定
						exec_domestic_step3(element, card_id);
					}
				});
			}, AJAX_REQUEST_INTERVAL
		);
	}

	// 内政設定のみ STEP3：内政設定
	function exec_domestic_step3(element, card_id) {
		// ステータス表示変更
		element.parents("div[class='cardStatusDetail label-setting-mode']").find("div[class='set dis_set_mini']").eq(0).css('background-color', 'pink').html("内政設定中");

		// デッキセット実行
		setTimeout(
			function() {
				// 送信データ作成
				var target_url = BASE_URL + '/card/domestic_setting.php';
				var param = {'id':card_id, 'mode':'domestic'};

				// 通信処理
				q$.ajax({
					url: target_url,
					type: 'GET',
					datatype: 'html',
					cache: false,
					data: param
				})
				.done(function(res) {
					// スキルIDの特定
					var resp = q$("<div>").append(res);
					var cards = q$("ul[class='domesticBtnArea'] form", resp);
					var card_found = false;
					for (var j = 0; j < cards.length; j++) {
						if (q$("input[name='domestic_id']", cards.eq(j)).length == 0) {
							continue;
						}

						// 内政にセットしたはずの武将がいない場合、エラー
						if (q$("input[name='domestic_id']", cards.eq(j)).val() == card_id) {
							// デッキにセットしたカードを見つけた
							card_found = true;
							break;
						}
					}

					if (card_found == false) {
						alert("武将を内政官にセットできませんでした。");
					}

					// ステータス表示変更
					element.parents("div[class='cardStatusDetail label-setting-mode']").find("div[class='set dis_set_mini']").eq(0).css('background-color', 'pink').html("処理完了");
				});
			}, AJAX_REQUEST_INTERVAL
		);
	}
}

//----------------------------------------------------------------------
// 共通function(個別機能)
//----------------------------------------------------------------------
// スクリプト実行判定
function isExecute() {
	// mixi鯖障害回避用: 広告iframe内で呼び出されたら無視
	if (q$("#container").length == 0) {
		return false;
	}

	// ログイン・ログアウト画面は無視
	if (location.pathname.indexOf('login.php') >= 0 || location.pathname.indexOf('logout.php') >= 0 ) {
		return false;
	}

	// 歴史書モードでは動かさない
	if (q$("#sidebar img[title=歴史書]").length != 0) {
		g_history_mode = true;
	} else {
		g_history_mode = false;
	}

	return true;
}

// セッションID取得
function getSessionId() {
	return getCookie('SSID');
}

// 取引手数料計算
function calcCharge(tp) {
	return parseInt((tp * 0.1) + (tp > 500) * (tp - 500) * 0.1 + (tp > 1000) * (tp - 1000) * 0.1);
}

// デッキモード取得
function getDeckModeSmall() {
	var select = q$("select[name='show_deck_card_count']");
	var value = select.attr("data-selected-value");
	return q$("option[value=" + value + "]", select).text().match(/小/) != null;
	//return q$("select[name='show_deck_card_count'] option:selected").text().match(/小/) != null;
}

// テーブルソーター
function tableSorter(selector, offset, index, order_ascend, call_back) {
	// ソート対象の列を記憶し、テーブルから削除
	var list = q$(selector);
	var nodes = [];
	for (var i = offset; i < list.length; i++) {
		var obj = new Object;
		if (typeof call_back != 'undefined') {
			obj.value = call_back(list.eq(i).children("td").eq(index));
		} else {
			obj.value = list.eq(i).children("td").eq(index).text().replace(/ /g, "");
		}
		obj.html = list.eq(i).prop('outerHTML');
		nodes.push(obj);
		list.eq(i).remove();
	}

	// ソート対象列を並び替える
	nodes.sort(
		function(a, b) {
			var result = 0;
			if (q$.isNumeric(a.value) && q$.isNumeric(b.value)) {
				var num1 = parseInt(a.value);
				var num2 = parseInt(b.value);
				if (num1 < num2) {
					result = -1;
				} else if (num1 > num2) {
					result = 1;
				}
			} else {
				result = a.value.localeCompare(b.value);
			}
			if (order_ascend) {
				return result;
			} else {
				return -result;
			}
		}
	);

	// テーブルに再描画
	for (var i = 0; i < nodes.length; i++) {
		q$(selector).parent().append(nodes[i].html);
	}
}

// 小モードトレードリンク作成
function addTradeLinkOnSmallCardDeck() {
	// ファイル内全カード取得
	var cards = q$("#cardFileList div[class='cardStatusDetail label-setting-mode'] div[class='statusDetail clearfix'] div[class='left']");
	for (var i = 0; i < cards.length; i++) {
		// カードNo.に(T)をつける
		var base = cards.eq(i).parents("div[class='cardStatusDetail label-setting-mode']");
		var no_elem = q$("table[class='statusParameter1'] tbody tr", base).eq(0).children("td").eq(0);
		var cardno = no_elem.text();
		q$(no_elem).html(
			cardno + "<a href='" + BASE_URL + "/card/trade.php?t=no&k=" + cardno + "&tl=1&s=price&o=a&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>(T)</a>"
		);

		// スキル名検索のリンクをつける
		var elems = q$("table[class^='statusParameter2'] tbody tr", base);
		for (var j = 2; j < elems.length; j++) {
			var skillname = elems.eq(j).children("td").eq(0).text();
			var match = skillname.match(/(.*)(LV[0-9]*)/);
			if (match) {
				elems.eq(j).children("td").eq(0).html(
					"<a href='" + BASE_URL + "/card/trade.php?s=price&o=a&t=skill&k=" + match[1] + "&tl=1&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>" + match[1] + "</a>" +
					match[2] +
					"<a href='" + BASE_URL + "/card/trade.php?s=price&o=a&t=skill&k=" + match[1] + match[2] + "&tl=1&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=1' target='_blank'>(T)</a>"
				);
			}
		}
	}
}

// 即時落札価格調査
function searchBuyRate(id, cardno, addBuyButton) {
	var url = BASE_URL + "/card/trade.php?t=no&k=" + cardno + "&tl=1&s=price&o=a&r_l=1&r_ur=1&r_sr=1&r_r=1&r_uc=1&r_c=1&r_pr=&r_hr=&r_lr=&lim=0";
	q$.ajax({
		url: url,
		type: 'GET',
		datatype: 'html',
		cache: false
	})
	.done(function(trade_res) {
		var tr_div = q$("<div>").append(trade_res);
		var tradelist = q$("table[class='tradeTables'] tbody tr:not(tr[class='tradeTop'])", tr_div);
		var html = "";
		if (tradelist.length > 0) {
			var tp = q$("td[class='right']", tradelist.eq(0)).eq(3).text().replace(/,/g, '');
			html = "<span style='font-family:Verdana,arial,sans-serif; font-size: 14px; font-weight: bold; color: #c00;'>" + tp + "</span>";
			// addBuyButton が設定されていたら、落札ボタンをつける
			if (addBuyButton == true) {
				// ボタン生成先作成
				html += "<span id='" + id + "_box' style='float: right; font-size: 14px; font-weight: bold;'></span>";
				q$("#" + id).parent().html(html);
				var elem = q$("td[class='trade'] a", tradelist.eq(0));
				// ボタン生成
				if (elem.length > 0) {
					var match = elem.eq(0).attr('href').match(/id=([0-9]*)/);
					createJustBuyButton(id + "_box", match[1]);
				} else {
					createJustBuyButton(id + "_box", null);
				}
			} else {
				q$("#" + id).parent().html(html);
			}
		} else {
			html = "<span style='font-family:Verdana,arial,sans-serif; font-size: 14px; font-weight: bold; color: blue;'>即落なし</span>";
			q$("#" + id).parent().html(html);
		}
	});
}

// 即時落札ボタン作成
function createJustBuyButton(id, bid) {
	if (bid == null) {
		// なんらかの理由で買えない
		q$("#" + id).html(
			"<div>" +
				"<span style='font-family:Verdana,arial,sans-serif; font-size: 14px; font-weight: bold; color: #c00;'>購入不可</span>" +
			"</div>"
		);
		return;
	}

	var tr_id = id + "_buy";
	q$("#" + id).html(
		"<div>" +
			"<input type='button' id='" + tr_id + "' style='background-color: blue; color: white; border-color: silver;' value='落札'>" +
		"</div>"
	);

	// 落札ボタンクリック時の動作定義
	var url = BASE_URL + "/card/trade_bid.php?id=" + bid + "&t=&k=&p=&s=&o=";
	q$("#" + tr_id).on('click',
		{url: url, id: tr_id},
		function(trade_param) {
			// 落札ボタンの多重実行禁止
			q$("#" + trade_param.data.id).off('click');

			// 状態表示
			q$("#" + trade_param.data.id).parent().html("<div style='color: blue;' id='" + trade_param.data.id + "'>落札中</div>");

			// トレード入札画面を取得
			q$.ajax({
				url: trade_param.data.url,
				type: 'GET',
				datatype: 'html',
				cache: false
			})
			.done(function(trade_res) {
				// すでに買うカードがなかった
				if (!trade_res.match(/value="落札する"/)) {
					q$("#" + trade_param.data.id).parent().html("<div class='red'>落札失敗</div>");
					return;
				}

				// 購入処理
				var tr_div = q$("<div>").append(trade_res);
				var trade_form = q$("form[name='exec_bid_form']", tr_div);
				var trade_exhibit_cid = q$("input[name='exhibit_cid']", trade_form).attr('value');
				var trade_exhibit_id = q$("input[name='exhibit_id']", trade_form).attr('value');
				var trade_t = q$("input[name='t']", trade_form).attr('value');
				var trade_k = q$("input[name='k']", trade_form).attr('value');
				var trade_p = q$("input[name='p']", trade_form).attr('value');
				var trade_s = q$("input[name='s']", trade_form).attr('value');
				var trade_o = q$("input[name='o']", trade_form).attr('value');
				var target_url = BASE_URL + '/card/trade_bid.php';
				var target_params = {
					'exhibit_cid':trade_exhibit_cid,
					'exhibit_id':trade_exhibit_id,
					't':trade_t,
					'k':trade_k,
					'p':trade_p,
					's':trade_s,
					'o':trade_o,
					'buy_btn':'落札する'
				};

				// 落札実行
				q$.ajax({
					url: target_url,
					type: 'POST',
					datatype: 'html',
					cache: false,
					data: target_params
				})
				.done(function(trade_res) {
					if (trade_res.match(/カードを落札しました/)) {
						q$("#" + trade_param.data.id).parent().html("<div class='green'>落札</div>");
					} else {
						q$("#" + trade_param.data.id).parent().html("<div class='red'>落札失敗</div>");
					}
				});
			});
		}
	);
}

// 出品処理
function sellCard(id, cardid, price, rarity) {
	// 出品画面からの出品時にレアリティチェックをする
	if (g_beyond_options[TRADE_36] == true) {
		if (rarity != 'UC' && rarity != 'C' && rarity != undefined) {
			if (!confirm("R以上のカードですがよろしいですか？")) {
				return;
			}
		}
	}

	var session_id = getSessionId();

	var target_params = {
		'ssid':session_id,
		'exhibit_cid':cardid,
		'exhibit_price':price,
		'exhibit_btn':'出品する'
	};

	var target_url = BASE_URL + "/card/exhibit_confirm.php";
	q$.ajax({
		url: target_url,
		type: 'POST',
		datatype: 'html',
		cache: false,
		data: target_params
	})
	.done(function(trade_res) {
		var height = q$("#" + id).height();
		if (trade_res.match(/カードを出品しました/)) {
			q$("#" + id).html("<div style='color:green; font-size: 14px; font-weight: bold; height:" + height + "px;'>" + price + "TPで出品</div>");
		} else if (trade_res.match(/これ以上の出品はできません/)) {
			q$("#" + id).html("<div style='color:red; font-size: 14px; font-weight: bold; height:" + height + "px;'>出品上限です</div>");
		} else {
			q$("#" + id).html("<div style='color:red; font-size: 14px; font-weight: bold; height:" + height + "px;'>出品失敗</div>");
		}
	});
}

// 入札枠作成
function createSellBox(id, subid, cardid, cardno, rarity, showFixPriceButton) {
	// 歴史書モードでは動かない
	if (g_history_mode == true) {
		return;
	}

	// コンパネ作成
	q$("#" + id).after(
		"<div id='sell_box" + subid + "' cardid='" + cardid + "' cardno='" + cardno + "' rarity='" + rarity + "'>" +
			"<input id='sell_price" + subid + "' size=6 value='" + g_beyond_options[TRADE_37] + "'></input>" +
			"<input type='button' id='sell_button" + subid + "' value='出品' class='m4l'></input>" +
			"<input type='button' id='check_charge_button" + subid + "' value='手数料' class='m4l'></input>" +
			"<span id='charge_result" + subid + "' style='font-family:Verdana,arial,sans-serif; margin-left: 4px; font-size: 10px; font-weight: bold; color: #c00;'></span>" +
			"<div id='sell_box_fix_price" + subid + "' style='display: none;'>" +
				"<input type='button' id='sell_a_button" + subid + "' value='" + g_beyond_options[TRADE_38] + "TP' class='m4l'></input>" +
				"<input type='button' id='sell_b_button" + subid + "' value='" + g_beyond_options[TRADE_39] + "TP' class='m4l'></input>" +
				"<input type='button' id='sell_c_button" + subid + "' value='" + g_beyond_options[TRADE_3A] + "TP' class='m4l'></input>" +
			"</div>" +
		"</div>"
	);

	// 手数料ボタン
	q$("#check_charge_button" + subid).on('click',
		function() {
			var match = q$(this).attr('id').match(/\d+/);
			var price = parseInt(q$("#sell_price" + match[0]).val());
			if (price >= 10) {
				q$("#charge_result" + match[0]).text(calcCharge(price) + "TP");
			} else {
				q$("#charge_result" + match[0]).text("");
			}
		}
	);

	// 出品ボタン
	q$("#sell_button" + subid).on('click',
		function() {
			var match = q$(this).attr('id').match(/\d+$/);
			var price = parseInt(q$("#sell_price" + match[0]).val());
			if (price >= 10) {
				sellCardCheckAdvance("sell_box" + match[0],
					q$("#sell_box" + match[0]).attr('cardid'),
					q$("#sell_box" + match[0]).attr('cardno'),
					price,
					q$("#sell_box" + match[0]).attr('rarity')
				);
			}
		}
	);

	// 定額出品ボタン
	q$("#sell_a_button" + subid).on('click',
		function() {
			var match = q$(this).attr('id').match(/\d+$/);
			sellCardCheckAdvance("sell_box" + match[0],
				q$("#sell_box" + match[0]).attr('cardid'),
				q$("#sell_box" + match[0]).attr('cardno'),
				g_beyond_options[TRADE_38],
				q$("#sell_box" + match[0]).attr('rarity')
			);
		}
	);
	q$("#sell_b_button" + subid).on('click',
		function() {
			var match = q$(this).attr('id').match(/\d+$/);
			sellCardCheckAdvance("sell_box" + match[0],
				q$("#sell_box" + match[0]).attr('cardid'),
				q$("#sell_box" + match[0]).attr('cardno'),
				g_beyond_options[TRADE_39],
				q$("#sell_box" + match[0]).attr('rarity')
			);
		}
	);
	q$("#sell_c_button" + subid).on('click',
		function() {
			var match = q$(this).attr('id').match(/\d+$/);
			sellCardCheckAdvance("sell_box" + match[0],
				q$("#sell_box" + match[0]).attr('cardid'),
				q$("#sell_box" + match[0]).attr('cardno'),
				g_beyond_options[TRADE_3A],
				q$("#sell_box" + match[0]).attr('rarity')
			);
		}
	);

	// 固定額出品ボタン追加
	if (showFixPriceButton == true) {
		q$("#sell_box_fix_price" + subid).css('display', 'block');
	}
	
	// カード売却前事前チェック
	function sellCardCheckAdvance(id, cardid, cardno, price, rarity) {
		if (rarity === 'undefined') {
			// 新兵種鯖ではレアリティが取れないので、武将図鑑に問い合わせる
			q$.ajax({
				url: BASE_URL + "/card/busyo_search.php?search_configs[type]=2&search_configs[q]=" + cardno,
				type: 'GET',
				datatype: 'html',
				cache: false
			})
			.done(function(res) {
				var resp = q$("<div>").append(res);
				var rarity = q$("#busyo-search-result-basic td[class='center rarity']", resp).text().trim();
				sellCard(id, cardid, price, rarity);
			});
		} else {
			sellCard(id, cardid, price, rarity);
		}
	}
}

// 報告書整形
function reformat_report(is_view_damaged) {    
	var elem_reports = q$("#gray02Wrapper table");
	if (q$("#gray02Wrapper table").text().match(/援軍が到着しました/)) {
		return;
	}

	// 損害率表示をスイッチできるボタン
	if (is_view_damaged == true) {
		q$("#gray02Wrapper table").eq(2).before(
			"<input type='button' id='view_repo' value='損害率表示OFF' style='float: right;'></input>"
		);

		q$("#view_repo").on('click',
			function() {
				if (q$("#view_repo").val().indexOf("OFF") >= 0) {
					q$("tr[id*='add_repo']").css('display', 'none');
					q$("#view_repo").val("損害率表示ON");
				} else {
					q$("tr[id*='add_repo']").css('display', '');
					q$("#view_repo").val("損害率表示OFF");
				}
			}
		);
	}

	// 新兵種鯖判定
	var isNewArmy = false;
	var columns = 8;	// 現行鯖では表の列は8列
	var reportRows = 2; // 現行鯖では2段
	if (q$("#gray02Wrapper table").text().indexOf("戦斧兵") >= 0) {
		isNewArmy = true;
		columns = 7;	// 新兵種では表の横が7列になる
		reportRows = 3; // 新兵種は3段
	}
	
	var summary = new Object;
	summary.ct = new Array();
	var ct = 0;
	for (var i = 0; i < elem_reports.length; i++) {
		// 総防御兵士の表示がある（防御側ログ）場合には、総合防御ログは集計対象外とする
		if (q$("th[class='defense_total']", elem_reports.eq(i)).length > 0) {
			elem_reports.eq(i).css('display', 'none');
			continue;
		}

		var elem_td = q$("td", elem_reports.eq(i));

		// 32以下は報告書の集計情報ではない
		if (elem_td.length < 32) {
			continue;
		}

		// 集計(target = 0: 攻撃側, target = 1: 防御側)
		var target = (ct >= 1) * 1;
		if (ct < 2) {
			summary.ct[target] = new Array();
		}
		for (var j = 0; j < reportRows * 2; j++) {
			if (ct < 2) {
				summary.ct[target][j] = new Array();
			}
			for (var k = 0; k < columns; k++) {
				if (ct < 2) {
					summary.ct[target][j][k] = 0;
				}
				var num = elem_td.eq(j * columns + k).text().replace(/[ \t\r\n]/g, "");
				if (num ===  '') {
					summary.ct[target][j][k] = -1;
				} else if (num === '?') {
					summary.ct[target][j][k] = -2;
				} else {
					summary.ct[target][j][k] = parseInt(summary.ct[target][j][k]) + parseInt(num);
				}
			}
		}
		ct ++;
	}

	// 防御集計結果を描画
	if (ct >= 2) {
		var result_elem = elem_reports.eq(2).clone();
		result_tr = q$("tr", result_elem);

		// 情報列があったら消す
		if (result_tr.length > reportRows * 3 + 1) {
			result_tr.eq(reportRows * 3 + 1).remove();
		}

		// 防御者ログの設定
		var pos = 2;
		var delta = 0;
		var is_unknown = false;
		for (var i = 0; i < reportRows * 2; i++) {
			var td_list = q$("td", result_tr.eq(pos + delta));
			for (var j = 0; j < columns; j++) {
				if (summary.ct[1][i][j] >= 0) {
					td_list.eq(j).text(summary.ct[1][i][j]);
				} else if (summary.ct[1][i][j] === -1){
					td_list.eq(j).text("");
				} else {
					td_list.eq(j).text("?");
					is_unknown = true;
				}
			}
			pos ++;
			
			// 見出し行を飛ばす必要があるため
			if (pos % 2 === 0) {
				delta ++;
			}
		}

		// 差分列の作成
		if (is_view_damaged == true && is_unknown == false) {
			for (var i = 3; i > 0; i--) {
				var t = result_tr.eq(i * 3).clone();
				t.attr('id', 'add_repo');
				result_tr.eq(i * 3).after(t.prop('outerHTML'));
			}

			// 結果をマッピングする
			result_tr = q$("tr", result_elem);
			drawReport(summary, result_tr, columns, reportRows, 1);
		}

		// ヘッダーの書き換え
		var th = result_tr.eq(0).children("th");
		th.eq(0).text("防御者").css({'background-color':'green', 'color':'white'});
		th.eq(1).text("全防御合計").css({'background-color':'green', 'color':'white'});

		// 結果の描画
		elem_reports.eq(2).after(result_elem.prop('outerHTML'));
	}

	// 攻撃集計結果を描画（処理同じなので共通化したい）
	if (is_view_damaged == true) {
		// 攻撃集計結果を描画（処理同じなので共通化したい）
		var result_tr = q$("tr", elem_reports.eq(2));
		for (var i = reportRows; i > 0; i--) {
			var t = result_tr.eq(i * 3).clone();
			t.attr('id', 'add_repo');
			result_tr.eq(i * 3).after(t.prop('outerHTML'));
		}

		// 結果をマッピングする
		result_tr = q$("tr", elem_reports.eq(2));
		drawReport(summary, result_tr, columns, reportRows, 0);
	}
	
	// レポート反映共通処理
	function drawReport(sum, items, cols, rows, itemIndex) {
		for (var k = 0; k < rows; k++) {
			var idx = (k + 1) * 4;
			q$("th", items.eq(idx)).eq(0).html(
				"<span>残り</span><br><span>損害率</span>"
			).css('color', 'red');

			for (var i = 0; i < cols; i++) {
				var rate = "";
				var rest = 0;
				if (sum.ct[itemIndex][k * 2][i] < 0) {
					continue;
				} else if (sum.ct[itemIndex][k * 2][i] === 0) {
					rate = "-";
				} else {
					rest = sum.ct[itemIndex][k * 2][i] - sum.ct[itemIndex][k * 2 + 1][i];
					rate = (1000 - Math.round(rest / sum.ct[itemIndex][k * 2][i] * 1000)) / 10	+ "%";
				}

				q$("td", items.eq(idx)).eq(i).html(
					"<span>" + rest + "</span><br><span>(" + rate + ")</span>"
				).css('color', 'red');
			}
		}
	}
}

// 書簡内のgyazoを展開
function show_message_image() {
	// 崩れることが多いので更新ボタンを追加
	q$("#gray02Wrapper table tr").eq(4).children("td").append(
		"<span style='float: right;'>" +
			"<input id='reload' type='button' value='更新'></input>" +
		"</span>"
	);
	q$("#reload").on('click', function() {
		location.reload();
	});

	var elem_body = q$("#messageBody").html();

	// 展開後gyazoはimgタグを付与
	var match = elem_body.match(/https:\/\/i.gyazo.com\/[a-z0-9]+\.(png|gif)/g);
	if (match != null) {
		for (var i = 0; i < match.length; i++) {
			elem_body = elem_body.replace(
				match[i],
				"<span>" +
					"<div><a href='" + match[i] + "' target='_blank'>" + match[i] + "</a></div>" +
					"<img src='" + match[i] + "' style='max-width: 100%; border: 1px solid black;'></img>" +
				"</span>"
			);
		}
		q$("#messageBody").html(elem_body);
	}

	// 非展開gyazoはpng->gifの順に展開にトライ
	match = elem_body.match(/https:\/\/gyazo.com\/[a-z0-9]+/g);
	if (match != null) {
		// まずpngにしてみる
		for (var i = 0; i < match.length; i++) {
			var eid = "gimg_" + i;
			var url = match[i].replace("http://gyazo.com/", "");
			elem_body = elem_body.replace(
				"http:\/\/gyazo.com\/" + url,
				"<span>" +
					"<div><a href='" + match[i] + "' target='_blank'>" + match[i] + "</a></div>" +
					"<img id='" + eid + "' src='http://i.gyazo.com/" + url + ".png' style='max-width: 100%; border: 1px solid black;'></img>" +
				"</span>"
			);
		}

		q$("#messageBody").html(elem_body);

		// だめならgifにし、それでもだめならURLに戻す
		for (var i = 0; i < match.length; i++) {
			var eid = "gimg_" + i;
			q$("#" + eid).on('error', function() {
				var vid = q$(this).attr('id');
				q$("#" + vid).off();
				var isrc = q$(this).attr('src');
				isrc = isrc.replace("png", "gif");
				q$("#" + vid).attr('src', isrc);
				setTimeout(
					function() {
						q$("#" + vid).on('error', function() {
							var vid = q$(this).attr('id');
							q$("#" + vid).off();
							isrc = isrc.replace("i.gyazo.com", "gyazo.com");
							isrc = isrc.replace(".gif", " (展開できませんでした)");
							q$("#" + vid).parent().html(isrc);
						});
					}, 50
				);
			});
		}
	}
}

// 時間整形
function formatSeconds(remain) {
	var hour = parseInt(remain / 3600);
	var minutes = parseInt((remain % 3600) / 60);
	var seconds = parseInt(remain % 3600 % 60);
	var time_text = "";
	if (hour <= 9) {
		time_text += "0" + hour + ":";
	} else {
		time_text += hour + ":";
	}
	if (minutes < 10) {
		time_text += "0";
	}
	time_text += minutes + ":";
	if (seconds < 10) {
		time_text += "0";
	}
	time_text += seconds;

	return time_text;
}

//--- スキル使用 ---//
// 自動内政スキル実行 STEP1：内政官設定チェック
function exec_domestic_skill_step1(element, is_after_drop, village_id, card_id, use_skill, success_func, fail_func) {
	// ステータス表示変更
	element.html(
		"<span style='color: blue;'>拠点確認中</span>"
	);

	// 拠点移動・内政確認実行
	setTimeout(
		function() {
			// host
			var host = BASE_URL;

			// 送信データ作成
			var target_url = host + '/village_change.php?village_id=' + village_id + '&from=menu&page=' + host + '/card/domestic_setting.php?village_id=' + village_id;

			// 通信処理
			q$.ajax({
				url: target_url,
				type: 'GET',
				datatype: 'html',
				cache: false
			})
			.done(function(res) {
				// 内政官がいるかチェック
				var resp = q$("<div>").append(res);
				if (q$("ul[class='domesticBtnArea']", resp).length > 0) {
					var generals = q$("ul[class='domesticBtnArea']", resp).text().replace(/[ \t\r\n]/g, "");
					if (generals.indexOf("内政中") != -1) {
						fail_func();	// リカバー処理
						alert("内政設定済みの武将がいるため使用できません");
						return;
					}
				}

				// step2の実行
				//exec_domestic_skill_step2(element, village_id, card_id, use_skill, is_after_drop, success_func, fail_func);
				exec_domestic_skill_step2_ex(element, village_id, card_id, use_skill, is_after_drop, success_func, fail_func);
			});
		}, AJAX_REQUEST_INTERVAL
	);
}

// 自動内政スキル実行 STEP2：デッキ設定
function exec_domestic_skill_step2_ex(element, village_id, card_id, use_skill, is_after_drop, success_func, fail_func) {
	// ステータス表示変更
	element.html(
		"<span style='color: blue;'>スキルEX発動中</span>"
	);

	// 使用するスキルのIDを調べる
	var skill_id = '';
	var skills = element.closest(".cardStatusDetail").find(".card_back_extra .back_skill li span[class*='skill_name']");
	skills.each(function(){
		if (q$(this).text().substr(2).trim() === use_skill) {
			var match = q$(this).next().children('a[class="btn_detail_s"]').attr("onclick").match(/openSkillInfoThick\('([a-z0-9]+)'/);
			if (match !== null) {
				skill_id = match[1];
			}
		}
	});

	if (skill_id.length === 0) {
		console.log("スキルIDが取得できませんでした。従来方式で実行を試みます。");
		exec_domestic_skill_step2(element, village_id, card_id, use_skill, is_after_drop, success_func, fail_func);
		return;
	}

	// デッキセット実行
	setTimeout(
		function() {
			// 送信データ作成
			var ssid = getSessionId();
			var target_url = BASE_URL + '/card/deck.php';
			var action_type = is_after_drop ? '2' : '1';
			var param = {
				'ssid': ssid,
				'target_card': card_id,
				'mode': 'domestic_set',
				'l': '0',	// Labelのようだが指定しても特に変化はみられない
				'p': '1',	// Page のようだが指定しても特に変化はみられない
				'action_type': action_type,
				'choose_attr1_skill': skill_id
			};
			param["selected_village[" + card_id + "]"] = village_id;

			// 通信処理
			q$.ajax({
				url: target_url,
				type: 'POST',
				datatype: 'html',
				cache: false,
				data: param
			})
			.done(function(res) {
				success_func();
			});
		}, AJAX_REQUEST_INTERVAL
	);
}

function exec_domestic_skill_step2(element, village_id, card_id, use_skill, is_after_drop, success_func, fail_func) {
	// ステータス表示変更
	element.html(
		"<span style='color: blue;'>デッキセット中</span>"
	);

	// デッキセット実行
	setTimeout(
		function() {

			// 送信データ作成
			var ssid = getSessionId();
			var target_url = BASE_URL + '/card/deck.php';
			var param = {'ssid':ssid, 'target_card':card_id, 'mode':'set'};
			param["selected_village[" + card_id + "]"] = village_id;

			// 通信処理
			q$.ajax({
				url: target_url,
				type: 'POST',
				datatype: 'html',
				cache: false,
				data: param
			})
			.done(function(res) {
				// 拠点がずれていないかチェック
				var resp = q$("<div>").append(res);
				if (q$("#deck_add_selected_village", resp).val() != village_id) {
					fail_func();	// リカバー処理
					alert("拠点が移動しているため中断します");
				} else {
					// step3：内政設定
					exec_domestic_skill_step3(element, card_id, use_skill, is_after_drop, success_func, fail_func);
				}
			});
		}, AJAX_REQUEST_INTERVAL
	);
}

// 自動内政スキル実行 STEP3：内政設定
function exec_domestic_skill_step3(element, card_id, use_skill, is_after_drop, success_func, fail_func) {
	// ステータス表示変更
	element.html(
		"<span style='color: blue;'>内政セット中</span>"
	);

	// デッキセット実行
	setTimeout(
		function() {
			// 送信データ作成
			var target_url = BASE_URL + '/card/domestic_setting.php';
			var param = {'id':card_id, 'mode':'domestic'};

			// 通信処理
			q$.ajax({
				url: target_url,
				type: 'GET',
				datatype: 'html',
				cache: false,
				data: param
			})
			.done(function(res) {
				// スキルIDの特定
				var resp = q$("<div>").append(res);
				var cards = q$("ul[class='domesticBtnArea'] form", resp);
				var skill_id = "";
				var card_found = false;
				for (var j = 0; j < cards.length && skill_id == ""; j++) {
					if (q$("input[name='domestic_id']", cards.eq(j)).length == 0) {
						continue;
					}

					// 内政にセットしたはずの武将がいない場合、エラー
					if (q$("input[name='domestic_id']", cards.eq(j)).val() != card_id) {
						break;
					}

					// デッキにセットしたカードを見つけた
					card_found = true;

					var tr_list = q$("table[class='general domesticGeneralListTbl'] tbody tr", cards.eq(j));
					var is_domestic = false;
					for (var k = 0; k < tr_list.length && skill_id == ""; k++) {
						var td_list = q$("td", tr_list.eq(k));
						if (td_list.length == 0) {
							continue;
						}

						if (td_list.eq(0).text().replace(/[ \t\r\n]/g, "") == "内政中") {
							is_domestic = true;
						}

						// 使用するスキルのスキルIDを特定する
						for (var l = 0; l < td_list.length; l++) {
							if (td_list.eq(l).attr('class') == 'skill') {
								var text = td_list.eq(l).text().replace(/[ \t\r\n]/g, "");
								if (text.indexOf(use_skill) != -1) {
									var href = td_list.eq(l).children("a").attr('href');
									var match = href.match(/sid=(.*)/);
									if (match != null) {
										skill_id = match[1];
										break;
									}
								}
							}
						}
					}

					// スキルは見つけたが内政中武将のものでない場合は、該当なし
					if (is_domestic == false) {
						skill_id = "";
					}
				}

				if (card_found == false || skill_id == "") {
					fail_func();	// リカバー処理

					if (card_found == false) {
						alert("武将を内政官にセットできませんでした。");
					} else {
						alert("発動するスキルが見つかりませんでした。");
					}
					return;
				}

				// step4：内政スキル発動
				exec_domestic_skill_step4(element, card_id, skill_id, is_after_drop, success_func, fail_func);
			});
		}, AJAX_REQUEST_INTERVAL
	);
}

// 自動内政スキル実行 STEP4：内政スキル発動
function exec_domestic_skill_step4(element, card_id, skill_id, is_after_drop, success_func, fail_func) {
	// ステータス表示変更
	element.html(
		"<span style='color: blue;'>スキル発動中</span>"
	);

	// スキル実行
	setTimeout(
		function() {
			// 送信データ作成
			var ssid = getSessionId();
			var target_url = BASE_URL + '/card/domestic_setting.php';
			var param = {'mode':'skill', 'id':card_id, 'sid':skill_id};

			// 通信処理
			q$.ajax({
				url: target_url,
				type: 'GET',
				datatype: 'html',
				cache: false,
				data: param
			})
			.done(function(res) {
				// step5：内政官解除
				if (is_after_drop == true) {
					exec_domestic_skill_step5(element, card_id, success_func, fail_func);
				} else {
					// 成功処理
					success_func();
				}
			});
		}, AJAX_REQUEST_INTERVAL
	);
}

// 自動内政スキル実行 STEP5：内政官解除
function exec_domestic_skill_step5(element, card_id, success_func, fail_func) {
	// ステータス表示変更
	element.html(
		"<span style='color: blue;'>内政解除中</span>"
	);

	// 内政官解除実行
	setTimeout(
		function() {
			// 送信データ作成
			var ssid = getSessionId();
			var target_url = BASE_URL + '/card/domestic_setting.php';
			var param = {'mode':'u_domestic', 'id':card_id};

			// 通信処理
			q$.ajax({
				url: target_url,
				type: 'GET',
				datatype: 'html',
				cache: false,
				data: param
			})
			.done(function(res) {
				// step6：デッキ解除
				exec_domestic_skill_step_final(element, card_id, success_func, fail_func);
			});
		}, AJAX_REQUEST_INTERVAL
	);
}

// 自動内政スキル実行 STEP6：デッキ解除
function exec_domestic_skill_step_final(element, card_id, success_func, fail_func) {
	// ステータス表示変更
	element.html(
		"<span style='color: blue;'>デッキ解除中</span>"
	);

	// デッキ解除実行
	setTimeout(
		function() {
			// 送信データ作成
			var ssid = getSessionId();
			var target_url = BASE_URL + '/card/deck.php';
			var param = {'ssid':ssid, 'mode':'unset', 'target_card':card_id};

			// 通信処理
			q$.ajax({
				url: target_url,
				type: 'POST',
				datatype: 'html',
				cache: false,
				data: param
			})
			.done(function(res) {
				// 成功処理
				success_func();
			});
		}, AJAX_REQUEST_INTERVAL
	);
}

//---------------------------
// スキル計算・描画メソッド
//---------------------------
// 選択されたスキルの補正値を求め、ステータス表に反映する
function correct_status(viewmode_id, select_index, skill_texts, sol_type, now_statuses, plus_statuses, defaults, accountings) {
	// スキル補正値を計算
	var effects = calc_correct_params(select_index, skill_texts, sol_type);

	// パッシブ初期値指定があるときは初期値を加算
	if (defaults != null) {
		effects[0] += parseFloat(defaults.auto_atk);
		effects[1] += parseFloat(defaults.auto_def);
		effects[2] += parseFloat(defaults.auto_spd);
	}

	// 課金指定があるときは10%加算
	if (accountings != null) {
		for (var i = 0; i < 3; i++) {
			if (accountings.eq(i).prop('checked') == true) {
				effects[i] *= parseFloat(1.1);
			}
		}
	}

	// ステータスを補正し、画面を更新
	var view_mode = q$("#" + viewmode_id);
	for (var i = 0; i < now_statuses.length; i++) {
		// 副将表示時で、オン・オフが合わない場合は該当ステータスは出さない
		var mode = now_statuses.eq(i).attr('mode');
		if (view_mode.length != 0 && mode != undefined && parseInt(mode) != parseInt(view_mode.text())) {
			plus_statuses.eq(i).css('display', 'none');
			now_statuses.eq(i).css('display', 'none');
			continue;
		}

		// ステータスを補正する
		var status = now_statuses.eq(i).attr('status');
		var status_value = parseFloat(now_statuses.eq(i).text());
		var correct_status = 0;
		if (status == "att") {	// 攻撃
			correct_status = Math.floor(status_value * effects[0] / 100);
		} else if (status == "speed") {	// 速度
			correct_status = Math.round(status_value * effects[2] / 10) / 10;
			if (correct_status == parseInt(correct_status)) {
				correct_status += '.0';
			}
		} else if (status == "int") {	// 知力（現在補正なし）
			correct_status = status_value;
		} else {	// 防御
			correct_status = Math.floor(status_value * effects[1] / 100);
		}

		// 値が違う場合にスキル効果ありとみなす
		if (status_value != correct_status) {
			now_statuses.eq(i).css('display', 'none');
			plus_statuses.eq(i).text(correct_status).css('display', 'block');
		} else {
			plus_statuses.eq(i).css('display', 'none');
			now_statuses.eq(i).css('display', 'block');
		}
	}
}

// 兵種とスキル効果から補正値を求める
function calc_correct_params(select_index, skill_texts, sol_type) {

	var summary = new Array();
	summary[0] = 100.0;  // 攻撃
	summary[1] = 100.0;  // 防御
	summary[2] = 100.0;  // 速度

	for (var i = 0; i < skill_texts.length; i++) {
		var skill_text = skill_texts.eq(i).text();

		// パッシブ計算
		if (skill_text.indexOf("自動で発動") > 0) {
			// 効果計算
			var effects = calc_skilltext_correct_effect(skill_text, sol_type);
			for (var j = 0; j < 3; j++) {
				summary[j] += effects[j];
			}
			continue;
		}

		// 通常スキル
		if (i != select_index) {
			continue;
		}

		// 効果計算
		var effects = calc_skilltext_correct_effect(skill_text, sol_type);
		for (var j = 0; j < 3; j++) {
			summary[j] += effects[j];
		}
	}

	return summary;
}

// スキル文から効果を計算
function calc_skilltext_correct_effect(skill_text, sol_type) {
	var effects = new Array();
	effects[0] = 0.0;  // 攻撃
	effects[1] = 0.0;  // 防御
	effects[2] = 0.0;  // 速度

	// 同一勢力スキルは除外
	if (skill_text.indexOf("同一勢力") > 0) {
		return effects;
	}

	// 兵科判定
	var chk_sol_type = sol_type;
	if (sol_type == "剣") {
		chk_sol_type = "歩";
	}

	var is_other = false;
	var match = skill_text.match(/(歩|槍|弓|騎)[兵科の\/]*武将/);
	if (match != null && match[1] != chk_sol_type) {
		// 昭烈帝、大皇帝、魏武王対策
		if (!skill_text.match(/他兵科/)) {
			return effects;
		}
		is_other = true;
	}

	// 武将に効果がない場合無視
	if (skill_text.indexOf("武将") == -1) {
		return effects;
	}

	// 援軍スキルは無視
	if (skill_text.indexOf("援軍") != -1) {
		return effects;
	}

	// 効果判定(攻)
	if (is_other == false) {
		match = skill_text.match(/攻撃力[がを]*([0-9.]*)%/);
	} else {
		// 昭烈帝、大皇帝、魏武王対策
		match = skill_text.match(/他兵科の攻撃力が([0-9.]*)%/);
	}
	if (match != null) {
		effects[0] += parseFloat(match[1]);
	}

	// 効果判定(防)
	match = skill_text.match(/防御[力全てが]*([0-9.]*)%/);
	if (match != null) {
		effects[1] += parseFloat(match[1]);
	}

	// 効果判定(移)
	match = skill_text.match(/移動*速[度が]*([0-9.]*)%/);
	if (match != null) {
		// 蛮族対策
		if (skill_text.indexOf("減少") != -1) {
			effects[2] -= parseFloat(match[1]);
		} else {
			effects[2] += parseFloat(match[1]);
		}
	}

	return effects;
}

// 回復系スキルかどうかを判定（着弾時等は除く）
function is_healing_skill(skill_text) {
	// 回復系スキルでないスキルは false
	var isTargetSkillText = ['回復', '討伐', 'ずつ獲得', '部隊を帰還させる', '援軍で出兵した部隊の到着時間を'];
	var isFound = false;
	for (var i = 0; i < isTargetSkillText.length; i++) {
		if (skill_text.indexOf(isTargetSkillText[i]) != -1) {
			isFound = true;
			break;
		}
	}
	if (isFound == false) {
		return false;
	}

	// 戦闘系、個人専用、忠誠回復系スキルは false
	var isExcludeSkillText = ['戦闘', '自身', '忠誠'];
	for (var i = 0; i < isExcludeSkillText.length; i++) {
		if (skill_text.indexOf(isExcludeSkillText[i]) != -1) {
			return false;
		}
	}

	return true;
}

//------------------------------//
// beyondの設定の読み込み・保存 //
//------------------------------//
// デフォルトオプション定義の取得
function getDefaultOptions() {
	var settings = new Object;

	// 共通
	settings[COMMON_01] = true;		// 資源タイマー
	settings[COMMON_02] = true;		// プルダウンメニューを差し替える
	settings[COMMON_03] = true; 	// 天気予告常時表示

	// プロフィール
	settings[PROFILE_01] = true;	// ランキングのリンク追加
	settings[PROFILE_02] = true;	// デュエルの次階級表示
	settings[PROFILE_03] = false;	// 領地座標を全体地図へのリンクに変換
	settings[PROFILE_04] = true;	// 領地一覧にソート機能を追加
	settings[PROFILE_05] = false;	// 領地、NPC座標、NPC取得・隣接情報の検索機能を追加

	// 都市
	settings[VILLAGE_01] = true;	// 兵士生産時間制限
	settings[VILLAGE_02] = 24;		// 制限時間

	// 全体地図
	settings[MAP_11] = false;		// 出兵時にデッキ武将を一斉出兵する機能を追加
	settings[MAP_12] = false;		// 出兵種別初期選択を有効にする機能を追加
	settings[MAP_13] = '';			// 鹵獲先座標設定用ボックス

	// 同盟
	settings[ALLIANCE_01] = true;	// 同盟トップ：同盟ランキングソート機能追加
	settings[ALLIANCE_02] = true;	// 同盟トップ：同盟ランキング内の自分の位置を着色
	settings[ALLIANCE_03] = true;	// 同盟トップ：同盟補助情報の追加
	settings[ALLIANCE_04] = true;	// 同盟トップ：CSVダウンロード機能の追加
	settings[ALLIANCE_05] = true;	// 同盟トップ：同盟員本拠座標取得機能の追加
	settings[ALLIANCE_11] = true;	// 同盟ログ：報告書の自動整形機能の追加
	settings[ALLIANCE_12] = true;	// 同盟ログ：報告書の損害率表示列の追加
	settings[ALLIANCE_13] = true;	// 同盟ログ：ログ検索機能の追加
	settings[ALLIANCE_21] = false;	// 同盟掲示板：発言順序を逆順（＝最新記事が一番上になるよう）にする
	settings[ALLIANCE_31] = false;	// 管理：離反ラジオボタンを選択不可能にする
	settings[ALLIANCE_41] = true;	// 配下同盟管理：配下検索機能の追加

	// デッキ
	settings[DECK_01] = true;		// 共通：パッシブスキル着色
	settings[DECK_02] = true;		// 共通：トレードへのリンク追加
	settings[DECK_03] = true;		// 共通：ページ切り替えのプルダウンを追加
	settings[DECK_11] = true;		// デッキ：ファイル内スキル検索機能の追加
	settings[DECK_12] = true;		// デッキ：スキル補正効果表示機能の追加
	settings[DECK_13] = true;		// デッキ：内政スキル使用リンクの追加（回復：赤、内政：青）
	settings[DECK_14] = true;		// デッキ：1クリックデッキセットボタン追加
	settings[DECK_15] = false;		// デッキ：ファイルに下げるボタンを1クリックで使用に変更
	settings[DECK_16] = false;		// デッキ：内政官を1クリックでファイルに下げるボタンを追加
	settings[DECK_17] = false;		// デッキ：内政官以外を1クリックで全てファイルに下げるボタンを追加
	settings[DECK_18] = false;		// デッキ：一括デッキセット機能を追加
	settings[DECK_19] = false;		// デッキ：内政官解除後にデッキを更新する
	settings[DECK_1A] = true;		// デッキ：内政スキル使用後画面を強制更新する
	settings[DECK_1B] = true;		// デッキ：一括ラベルセット機能を追加
	settings[DECK_21] = true;		// 領地一覧：領地一覧の並び方を初期状態に戻す
	settings[DECK_22] = true;		// 領地一覧：「新領地」で始まる領地を全て破棄
	settings[DECK_31] = true;		// 修行合成でレベルが上がった時に、レベルアップボタンを追加
	settings[DECK_32] = true;		// 自動スキルレベルアップ合成機能を追加
	settings[DECK_33] = true;		// スキルレベルアップ合成画面でベースカードの交換機能を追加
	settings[DECK_34] = true;		// 合成画面のボタン説明表示を消す
	settings[DECK_35] = true;		// 自動副将枠解放合成機能を追加
	settings[DECK_51] = true;		// 兵士管理リンクをクリックした際の初期タブを「全て表示」にする
	settings[DECK_61] = false;		// スキル3つ以上、レベル50、スコア100万のいずれかに該当するカードを倉庫へ移動できなくする

	// 報告書
	settings[REPORT_01] = true;		// 自動整形機能の追加
	settings[REPORT_02] = true;		// 損害率表示列の追加
	settings[REPORT_11] = true;		// 討伐・攻撃ログのTSV出力機能の追加

	// 書簡
	settings[NOTE_01] = true;		// 開封補助機能の追加
	settings[NOTE_02] = true;		// gyazoを自動展開する

	// トレード
	settings[TRADE_01] = true;		// 一覧上にページ切り替えリンクを追加
	settings[TRADE_02] = true;		// レアリティ固定ボタンの追加
	settings[TRADE_03] = true;		// 合成効率表示機能の追加
	settings[TRADE_04] = true;		// トレード・武将図鑑へのリンクを追加
	settings[TRADE_05] = true;		// 簡易落札ボタンを追加
	settings[TRADE_06] = true;		// 強制公開期限の日付で色を変える
	settings[TRADE_07] = false;		// 落札まで24時間を超える入札リンクを消す
	settings[TRADE_11] = true;		// 出品中：自動出品リンク作成機能を追加
	settings[TRADE_12] = true;		// 出品中：推定収入・手数料表示を追加
	settings[TRADE_13] = true;		// 出品中：収入期待値表示を追加
	settings[TRADE_21] = true;		// 入札中：リンクURLからの自動入札機能を追加
	settings[TRADE_31] = true;		// 出品：パッシブスキル着色
	settings[TRADE_32] = true;		// 出品：トレードへのリンクを追加
	settings[TRADE_33] = true;		// 出品：即時落札価格確認ボタンを追加
	settings[TRADE_34] = false;		// 出品：簡易出品機能を追加
	settings[TRADE_35] = false;		// 出品：固定額出品ボタンを追加
	settings[TRADE_36] = true;		// 出品：出品カードがR以上のとき警告する
	settings[TRADE_37] = '';		// 出品値の初期値（テキストボックス）
	settings[TRADE_38] = 499;		// 出品値の初期値（固定出品ボタン1）
	settings[TRADE_39] = 999;		// 出品値の初期値（固定出品ボタン2）
	settings[TRADE_3A] = 4999;		// 出品値の初期値（固定出品ボタン3）
	settings[TRADE_41] = true;		// トレード履歴：当日9:30-10:00落札カードのみ背景色を変える

	// ブショーダス
	settings[BUSYODAS_01] = true;	// 出品機能を追加
	settings[BUSYODAS_02] = false;	// 簡易出品ボタンを追加
	settings[BUSYODAS_11] = true;	// 武将カード入手履歴：トレード・武将図鑑へのリンクを追加

	// 図鑑
	settings[BOOK_01] = true;		// 武将図鑑：トレードへのリンクを追加
	settings[BOOK_02] = true;		// 武将図鑑：即時落札価格確認・簡易落札ボタンを追加
	settings[BOOK_11] = true;		// スキル図鑑：トレードへのリンクを追加
	settings[BOOK_99] = false;		// 武将図鑑：スキル補正効果表示機能の追加（新カード検証用）

	// その他
	settings[ANY_01] = true;		// 右メニューにレイド用のショートカットを追加
	settings[ANY_02] = true;		// 個人掲示板の領地座標をリンクに変換

	return settings;
}

// beyondの設定のロード
function loadBeyondSettings() {
	// 保存データの取得
	var obj = GM_getValue(SERVER_NAME + '_beyond_options', null);
	var options;
	if (obj == null) {
		options = getDefaultOptions();
	} else {
		options = JSON.parse(obj);
	}

	// 保存データにデフォルト設定の情報がない場合、デフォルト設定を追加
	var defaults = getDefaultOptions();
	for (var key in defaults) {
		if (typeof options[key] == "undefined") {
			options[key] = defaults[key];
		}
	}
	g_beyond_options = options;
}

// source: http://stackoverflow.com/questions/10687746/getcookie-returns-null
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
