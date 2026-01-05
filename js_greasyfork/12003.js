// ==UserScript==
// @id            Simple2chViewer_sc
// @name          Simple2chViewer_sc
// @namespace     https://greasyfork.org/ja/scripts/8812
// @homepageURL   https://greasyfork.org/ja/scripts/8812
// @license       http://creativecommons.org/licenses/by-nc-sa/4.0/
// @description   簡易2chブラウザ的な何か
// @include       http://*.2ch.net/test/*
// @include       http://*.bbspink.com/test/*
// @include       http://*.cha2.org/*
// @include       http://camani.on.arena.ne.jp/*
// @include       http://*.machi.to/bbs/*
// @include       http://*.2ch.sc/test/*
// @include       http://jbbs.shitaraba.net/bbs/*
// @exclude       http://find.2ch.net/*
// @exclude       http://p2.chbox.jp/*
// @exclude       http://localhost:*
// @exclude       http://127.0.0.1:*
// @exclude       http*http*2ch.net/test/*
// @exclude       http*http*bbspink.com/test/*
// @exclude       *.html
// @grant         GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @grant         GM_setClipboard
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @grant         GM_log
// @author        noi
// @require       https://greasyfork.org/scripts/9507-gm-option/code/GM_option.js
// @version       2.12+
// @downloadURL https://update.greasyfork.org/scripts/12003/Simple2chViewer_sc.user.js
// @updateURL https://update.greasyfork.org/scripts/12003/Simple2chViewer_sc.meta.js
// ==/UserScript==

///////////////////////////////////////////////////////
// 参考にしたスクリプト                              //
// 2ch Browser Userscript                            //
// http://tmkk.undo.jp/                              //
//                                                   //
// @require ecl.js drk                               //
// http://www.drk7.jp/                               //
// http://www.drk7.jp/pub/js/ecl_test/ecl_new.js     //
// http://nurucom-archives.hp.infoseek.co.jp/digital //
//                                                   //
// 背景素材 フォクすけの Firefox 情報局              //
// http://foxkeh.jp/downloads/                       //
///////////////////////////////////////////////////////


/**************************************************************
[概要]
2ch系掲示板を少し便利にするスクリプトです
簡易的なものなので過度の期待はNG
自分用に作ったものなのであまり積極的に改良する気はないので悪しからず


[対応サイト]
2ch.net
bbspink.com
cha2.org
camani.on.arena.ne.jp
machi.to
2ch.sc(cookieを拒否してる時だけ)×
  cookieチェックを外した
したらば jbbs.shitaraba.net


[機能]
・NGワード
  ※ID指定も可能。レス番レス名レスタイトルから投稿内容まで全部ひっくるめて検索
・あぼーん(マウスオーバーでレス内容表示)
・レス番号やIDやアンカーをマウスオーバーでポップアップ表示
・URLのハイパーテキスト化
・URLクッション除去
・画像URLのサムネ追加
  ※リファラ偽装必要な場合あり(リファラを画像URLのアドレスと同じにするアドオンなど必須)
  注意：したらばはリファラが無いと書き込みできないので通常のリファラを送信すること
・画像モザイク
  ※クリックで元の画像表示。もう一度クリックでモザイク化
・youtubeとニコニコのサムネ表示
・書き込み欄の画面内自由可動
・新着チェックボタン
  ※失敗時はその情報表示、成功時はリロードせずに
・リロード不要な投稿機能
  ※投稿成功で新着チェック、失敗で理由を小窓で表示。
    同意ボタンがあればそれをクリック。何かエラー内容があるならそれを解決してください。
・アンカークリックで対象レスまでジャンプ
・レス番右クリックメニューにレス引用ボタン追加
  ※掲示板のjavascript(対象ホストのもの)を有効にする必要あり
・テキスト選択後右クリックメニューに引用ボタン追加
・既読機能


*******************************************************
備忘録
処理高速化のためDOM操作を減らした。(処理の流れ：可能な限り変数で整形したのち、最終的な調整をDOM操作で行う)
「人大杉サーバ」のcgiをhtmlに変更する機能は再現動作確認できないのと必要性を感じないので暫定削除
マウスオーバーで画像ポップアップ機能は他のアドオンをすでに使ってる人がほとんどだと思うので削除
アンカーは元々はクリックで新しいタブに対象レスだけ表示できるリンクだったが、邪魔なのでページ内ジャンプに変更
open2chはすでにデフォルトで機能豊富なので除外(考慮に入れてないのでこのままincludeするとブラウザが数十秒固まる)
まちBBSも機能が多めなので除外でいいかもしれない
*/

/*
機能実装予定(優先度高い順。ただしめんどいので当分やらない)
・コメント枠の右クリックメニューにスレタイトルコピー機能追加(ついでにURLも一緒にコピーするメニュー追加)
・定型文機能(要はAA貼り付けとかそんな感じ。ボタンで貼り付け、設定画面で保存)・・・自分が使わないので後回し(普段使わないとメンテしづらいという意味で)
・一定期間ごとに新着チェック＆あったら音
・IDで抽出コピーを右クリックメニューに追加
・キーボードショートカットでコメント欄操作(開く閉じる、小さくして初期位置へ移動)

****************************
更新履歴
08/26/2015 - v2.12+ scチェックを外した 
08/14/2015 - v2.12 fix:既読関連の修正位置間違い修正
08/13/2015 - v2.11 fix:既読関連の修正
08/13/2015 - v2.10 fix:NGワード関連・既読関連の修正
07/03/2015 - v2.09 fix:改行が挟まると表示されないバグ、レス範囲指定URLの表示方法変更
05/17/2015 - v2.08 fix:既読修正、投稿フォーム修正など
05/14/2015 - v2.07 add:次スレ検索
05/11/2015 - v2.06 fix:サムネ画像の修正
05/09/2015 - v2.05 fix:サムネ画像が取得エラーの時に空白ができないように変更
05/09/2015 - v2.04 fix:既読ジャンプ機能修正、新着チェック後の発言数表示
05/09/2015 - v2.04 add:host表示対応、ポップアップ開始マージン追加
05/07/2015 - v2.03 fix:透明あぼーんフラグ管理のバグ修正
05/03/2015 - v2.02 fix:既読部分の処理。2ch.scにディレイ追加
04/30/2015 - v2.01 add:sandbox
04/30/2015 - v2.01 fix:既読の一部修正など
04/30/2015 - v2.00 add:設定メニューと既読機能(設定メニューがいらない場合は@require削除と「設定メニュー機能」で挟まれた部分削除で以前の仕様に戻ります。)
04/09/2015 - v1.14 fix:レス引用の際の特殊文字、画像ありのレスで文章が余分に削除されてしまう不具合
04/09/2015 - v1.14 add:逆順表示機能
04/05/2015 - v1.13 add:サムネモザイク機能
04/05/2015 - v1.12 fix:chromeで画像読み込みできない不具合
04/05/2015 - v1.11 fix:cssの不備
04/05/2015 - v1.10 add:chromeに対応
03/31/2015 - v1.09 del:requireが不評なのでLazy Load削除
03/31/2015 - v1.09 add:既読・新着色分け。ダブルクリックでコメント欄拡大・縮小、あぼーんのクリックかマウスオーバー選択
03/31/2015 - v1.09 fix:popupやコメント欄が画面外に表示されるのを抑止。処理が重くなるのでイベントリスナーの終了追加
03/29/2015 - v1.08 del:2ch.scでcookieが有効の場合は除外
03/29/2015 - v1.07 fix:したらばの2000レスすべて埋まった場合、投稿フォームが取得できずにエラーになっていたバグ修正
03/29/2015 - v1.6 fix:レス投稿後の処理でおかしかった箇所修正。アンカーがあった場合のレスの処理バグ修正。
03/29/2015 - v1.6 add:レス投稿フォームを可動式にするかどうかの設定追加
03/28/2015 - v1.5 add:要望のあった右クリックメニューのON・OFF設定追加
03/28/2015 - v1.4 fix:やっつけで作ったmousemoveイベントが重いので細かく設定
03/28/2015 - v1.3 add:デコードエラー回避のためにecl追加
03/28/2015 - v1.2 add:IDやレスのポップアップ方式を選択可能に変更
03/27/2015 - v1.1 fixed:@requireをやめてソースに直書きに変更
03/27/2015 - v1.0 release
**************************************************************/

(function(){


if(window!=parent) return;	//iframeは除外
if(document.URL.match(/#res_[0-9]+$/)) location.href = document.URL.replace(/#res_[0-9]+$/g,"");

const host = location.host;
var scFlg = host.match(/2ch.sc/);
var cha2Flg = host.match(/(cha2\.)/);
//if(scFlg && document.cookie) return;	//scのcookie読み込む場合は除外 // コメントアウト


/*********************************** User Configurations *************************************************/

var config = {
	nameran: "",		//名前欄初期値(「初期化停止」指定でcookieに保存されたデータ使用)
	mailran: "sage",	//メール欄初期値(「初期化停止」指定でcookieに保存されたデータ使用)
	commentran: "",		//コメント欄初期値(「初期化停止」指定でcookieに保存されたデータ使用)
	moveFormFlg: true,	//投稿フォームを可変にする(新着チェック機能含む)
	commentR: 0,		//コメント欄初期位置 右から(moveFormFlg=true時のみ有効)
	commentB: 0,		//コメント欄初期位置 下から(moveFormFlg=true時のみ有効)
	formSize: "small",	//投稿フォームの初期状態(標準:normal、折り畳み：small。moveFormFlg=true時のみ有効)

	redmonkey: 5,		//真っ赤発言(初期：5回以上。0で無効)
	anchored: 1,		//アンカー有(初期：被アンカー1件以上)
	redAnchored: 3,		//真っ赤レス番(初期：被アンカー3回以上。0で無効)

	accessView: true,	//書き込み端末表示

	//NGワード登録(ID指定も可能)・・・要はあぼーん機能
	NGWord:  [
	/ttps?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+\.exe(\n|<| )/,		//正規表現の場合(初期から有効なので嫌ならコメントアウト。ちなみにこれは怪しいURL対策)
	"逝ってよし",		//通常の文字列の場合(初期から有効なので嫌ならコメントアウト)
	],


	abonShowFlg: true,	//あぼーんレス表示(falseで透明あぼーん)

	//文字消去
	DeleteWord: [
	/転載禁止\(.{5}\)/,	//正規表現
	'転載禁止(´・ω・｀)',	//通常の文字列
	],

	reverseFlg: false,	//レスの並び順を逆にする(つまり最新レスから降順)

	popIDType: 'click',	//IDポップアップ方式(「click」or「mouseover」)
	popResType: 'mouseover',//レスポップアップ方式(「click」or「mouseover」)
	popResAbonType: 'click',//あぼーんポップアップ方式(「click」or「mouseover」)
	popupTimeout: 700,	//ポップアップ非表示ディレイ

	thumbFlg: true,		//画像のサムネ表示 ON:true、OFF:false
	thumbnailSize: 150,	//サムネサイズ(横幅)
	mosaicFlg: true,	//サムネモザイク
	mosaicSize: 0.1,	//モザイクサイズ。範囲は大体(0.05～1.0)で、1に近づくほど細かくなっていく

	bgColor: 'aliceblue',	//背景色(RGB指定など。例：#CCFFFF)
	newColor: '#fef',	//新着背景(noneで透過)
	oldColor: '#ddd',	//既読背景(noneで透過)
	dtBg: 'none',		//レスタイトル背景(RGB指定など。例：#CCFFFF)
	mailColor: 'black',	//メール文字色(RGB指定など。例：#CCFFFF)
	timeColor: 'black',	//投稿時間文字色(RGB指定など。例：#CCFFFF)
	dtColor: 'black',	//レスタイトル文字色(RGB指定など。例：#CCFFFF)
	ddBg: 'none',		//レス本文背景(RGB指定など)
	ddColor: 'black',	//レスタイトル文字色(RGB指定など。例：#CCFFFF)
	popBg: 'LightCyan',	//ポップアップ背景(RGB指定など)
	/*AA用フォント*/
	aaFontFlg: true,	//ON:true、OFF:false
	aaFontSize: 16,		//AAフォントサイズ
	aaFont: "MS-PGothic,ＭＳ Ｐゴシック,IPAMonaPGothic,Mona",

	menuFlg: true,		//右クリックメニューにレスコピー機能などを追加する
	delKidoku: 7,		//最後に閲覧してからの日数が指定日数より古い既読履歴削除
};




//おまけ背景画像(gazo初期値:0で非表示、1でフォクすけ、2でロゴ)
const gazo = 0;
const bgSet = [
	'',
	'url(http://www.foxkeh.com/downloads/assets/front.png) no-repeat fixed right bottom',	//(c)フォクすけの Firefox 情報局 http://foxkeh.jp/downloads/
	'url(chrome://branding/content/about-logo.png) no-repeat fixed right bottom',
];

/*********************************** User Configurations end ******************************************/




//init----------

ecl();	//decodeロード


var urlCheck = true;	//全レス表示URL(true) or それ以外(false)
const firstHTML = document.body.innerHTML;

var threadObj = document.getElementsByTagName('dl')[0];
threadObj.id = 'thread';

var textArea = document.getElementsByTagName("textarea")[0];


const url = document.URL.replace(/(http.*\/)[^\/]*$/,"$1");
if(url != document.URL && !document.URL.match(/\d{5,}\/?$/) && !cha2Flg) urlCheck = false;

//サムネローディング中画像
//const srcData = 'chrome://browser/skin/tabbrowser/loading.png';
const srcData = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

var startRes = 0;
var endRes = 0;
document.URL.match(/.*\/(\d+)?\-(\d+)$/,"$1");	//URL末尾のレス数
if(RegExp.$1) startRes = RegExp.$1;
if(RegExp.$2) endRes = RegExp.$2;


//メイン処理
var main={
	lastRes: 0,	//最新レス番
	popupArr: [],	//ポップアップオブジェクトID一覧
	resDB: {},		//全レスDB
	ngDB: [],		//NGレス番
	idDB: {},		//IDの発言レスDB
	anchorDB: {},	//被アンカーDB
	status: {},	//マウス判定(要素のドラッグ移動用)
	errorRes: [],	//取得できなかったレス
	//書き込み端末
	accessDB: {
		'0':'pc',
		'O':'携帯',
		'a':'au,WiMAX2+',
		'd':'docomo スマホ',
		'D':'docomo mopera',
		'E':'Y!mobile EMNet',
		'e':'Y!mobile emb',
		'F':'公衆Wi-Fi',
		'H':'逆引きなし',
		'i':'iPhone',
		'I':'iPod touch',
		'K':'ガラケー',
		'M':'MVNO,WiMAX1,GoogleChrome SPDYプロキシ',
		'o':'WILLCOM',
		'p':'softbank iPhone',
		'P':'p2',
		'Q':'ガラケー フルブラウザ',
		'r':'softbank Android',
		'S':'スマホ',
		'T':'お試し●',
		'W':'WiMAX1',
		'X':'GoogleChrome SPDYプロキシ ',
		'x':'softbank アクセスインターネット',
		'*':'★',
		'!':'海外IP',
	},
	initSet: function(){


		main.hideAbon = '';
		if(!config.abonShowFlg) main.hideAbon = 'display:none;';

		//上級者向け設定--------------------------------------------
		//スタイルシート(よくわからない人はいじらない方がいい)
		//※ここ弄るよりstylishで上書きの方が楽
		main.css = [
			'body{ background:' + config.bgColor + ' ' + bgSet[gazo] + '; }',//背景
			'a:link{color : blue;}',				//リンク色(赤が指定されてる掲示板もあるため)
			'dl.addNewRes{margin:0;}',				//掲示板レス全体
			'dl.bbs_res_One{margin:0;}',				//レス1つ毎
			'dt.bbs_res_header{ background:' + config.dtBg + '; color:' + config.dtColor + '; border-top: dotted 1px #A0A0A0; padding-top: 5px;}',	//レスヘッダ
			'dd.bbs_res_body{ background:' + config.ddBg + '; color:' + config.ddColor + '; margin-left: 0px !important; padding-left: 60px !important; }',	//レス内容
			'dd.bbs_res_aabody { font-family: ' + config.aaFont + '; font-size: ' + config.aaFontSize + '; line-height: 1; }',		//レス内容AAフォント
			'span.bbs_res_name_sage { color: blue; }',		//名前欄(sage)
			'span.bbs_res_name_sagete { color: darkblue; }',	//名前欄(sagete)
			'span.bbs_res_name_age { color: red; }',		//名前欄(age)
			'span.bbs_res_name_agete { color: darkred; }',		//名前欄(agete)
			'span.bbs_res_name_space { color: green; }',		//名前欄(空白)
			'span.bbs_res_mail { font-weight: normal; color: ' + config.mailColor + '; font-size: small; }',//メール欄
			'span.bbs_res_time { color: ' + config.timeColor + '; font-size: middle; }',//投稿時間
			'span.id_text:not(.bbs_redmonkey) { color:blue; }',	//投稿ID
			'span.id_text:hover { text-decoration: underline; }',	//投稿IDマウスオーバー
			'span.bbs_redmonkey { color: red }',			//投稿ID(真っ赤発言者)
			'a.bbs_res_number { display: inline-block; width: 50px; padding-right: 10px; font-weight: bold; text-align: right;}',	//レス番号
			'.bbs_res_number:visited{color : blue!important;}',	//レス番
			'.res_anchor:visited{color:blue!important;}',		//アンカー
			'.bbs_img{ width:' + config.thumbnailSize + 'px; }',	//サムネ画像
			'.res_abon{ color:#a0a0a0; }',				//あぼーん文字
			'.res_Abon_All{ '+ main.hideAbon +' border-top: dotted 1px #A0A0A0;}',	//あぼーん全体
			'b.deleteWord{ display:none; }',			//文字消去
			'.anchored,.anchored:visited{ color:purple!important; }',//被アンカー(通常)
			'.redAnchored,.redAnchored:visited{ color:red!important; }',//被アンカー(真っ赤)
			'dl.popup{position:fixed; max-height:500px;max-width:800px; overflow:auto; background:white; background:' + config.popBg + ';}',	//ポップアップメニュー
			'.movebox{ position:fixed; background:#22EEFF;width:500px; height:300px; padding:30px 2px 1px 1px; z-index:5;border:1px solid blueviolet!important;text-align:left;}',//可動式ボックスの設定
			'#moveFrame{ visibility:hidden; }',			//投稿結果
			'iframe[name="bbs_frame"]{ width:99.5%; height:99.5%; }',//投稿結果内のiframe
			'.message_alert{background:#00CCFF; box-shadow:4px 4px #555;color:darkblue;}',	//アラートデザイン
			'#alert_new{ position:fixed;top:100px;right:50px; animation: slidein 3s; -webkit-animation: slidein 3s; z-index:50;}',	//新着レスアラート位置とアニメ設定
			'.addNewRes:nth-last-child(1){ background:' + config.newColor + ';}',		//新着レス(#fef)
			'.addNewRes:not(:first-child):not(:nth-last-child(1)){ background:' + config.oldColor + ';}',	//既読レス(#DDD)
			//ボタンデザイン
			'#moveForm button,#moveForm input[value="書き込む"],#moveForm .oekaki_load{background: -webkit-linear-gradient(top,#BFD9FF, #3DDDFF 50%,#0080FF 50%,#0099FF);background: -moz-linear-gradient(top,#BFD9FF, #3DDDFF 50%,#0080FF 50%,#0099FF);color: #FFF;border-radius: 4px;border: 1px solid #0099CC;text-shadow: 0px 0px 3px rgba(0,0,0,0.5);}',
		].join('');

		//上級者向け設定ここまで--------------------------------------------


		//固定CSS(投稿欄デザインなど)
		if(config.moveFormFlg){
			main.formCSS = [
				'#moveForm[name="normal"]{width:800px;height:230px;padding-top:5px;}',
				'#moveForm[name="small"]{ height:25px;padding-top:3px;}',
				'#moveForm[name="small"] *:not(button):not(#threadname),#moveForm[name="small"] #clearbutton{visibility:hidden;}',
				'#threadname{ display:block; width:380px; white-space: nowrap; }',//投稿欄のスレタイトル
				'#moveForm[name="normal"] #threadname{ width:670px; }',
				'#threadname:not(:hover){ overflow: hidden; text-overflow: ellipsis;}',
				'textarea{ height:150px; width:99.5%; resize: none;}',
				'#moveForm button{ width:25px; height:22px; float: left; margin-left:3px; font-size:small;}', //投稿欄のボタン全般
				'#viewbutton{ position:absolute;right:36px; }',
				'#custombutton{ position:absolute;right:66px; }',
				'#closebutton{ position:absolute;right:5px; }',
				'#clearbutton{ position:absolute; right:10px; bottom:5px; width:77px!important; height:24px!important;font-size: -moz-use-system-font;}',
				'input[value="書き込む"]{ position:absolute; right:100px; bottom:5px; width:77px; height:24px;font-size: -moz-use-system-font;}',
				'#moveForm > form{ height:202px; padding:2px; margin-top: 3px;margin-bottom: 0; background:lightcyan; border-top:1px solid blueviolet!important;}',//投稿form
				'.oekaki_load{ position:absolute;bottom:5px;right:200px;width:110px;height:24px; }',	//お絵描きボタン
				'#moveForm > form > H3{ margin-top:5px;}',	//お絵描きヘッダ
				'img[src="' + srcData + '"]{ width:15px; }',
				//スライドアニメ設定
				'@keyframes slidein {',
					'from { right: calc(20% - 50px); }',
					'to { right: 50px; }',
				'}',
				'@-webkit-keyframes slidein {',
					'from { right: calc(20% - 50px); }',
					'to { right: 50px; }',
				'}',
			].join('');
		}


		//逆順
		if(config.reverseFlg){
			main.reverseCSS = 'dl.thread,dl.addNewRes{ display: flex; flex-direction: column-reverse;}';
		}

		//コンテキストメニュー
		if(config.menuFlg){
			document.body.setAttribute("contextmenu","customMenu");
			main.menuObj = document.createElement('menu');
			main.menuObj.type = "context";
			main.menuObj.id = "customMenu";

			window.addEventListener('contextmenu', main.handler,false);

			window.addEventListener('beforeunload', function(){
				window.removeEventListener("contextmenu", main.handler,false);
				window.removeEventListener("beforeunload", arguments.callee,false);
			}, false);

			if(textArea) main.addRightMenu('menuItem1','pattern1','これにレス','chrome://branding/content/icon16.png');
			if(textArea) main.addRightMenu('menuItem2','pattern2','引用付レス','chrome://branding/content/icon16.png');
			main.addRightMenu('menuItem3','pattern2','レスコピー','chrome://branding/content/icon16.png');
		}


		//メイン処理スタート
		if(urlCheck){
			if(scFlg) setTimeout(main.makeDB, 2000);
			else main.makeDB();
		}else{
			main.getRes(url);
		}

		//cha2.net用遅延
		setTimeout(main.setFormData, 2000);

	},
	delAllPopup: function(){
		var delPop = document.getElementsByClassName('popup');
		for(var d=0,e=delPop.length;d < e;d++){
			if(!delPop[d])continue;
			delPop[d].parentNode.removeChild(delPop[d]);
		}
	},
	//事前にDBに編集済みレス内容格納
	makeDB:	function(res,addedFlg){
		if(addedFlg){
			//ポップアップ除去
			main.delAllPopup();
			main.popupArr = [];
		}
		var resTxt = firstHTML;
		if(res) resTxt = res.responseText;

		var ResAll = resTxt.replace(/.*?<dt>/,"<dt>").split("</dl>")[0].split("</DL>")[0].split(/<dt>/);

		var strTxt = "";

		for(var i=0, x=ResAll.length; i < x; i++) {
			var strAll = "<dt>" + ResAll[i];
			var strDT = strAll.replace(/(.*?)<dd(>| ).*/i,"$1");
			var strDD = strAll.replace(/.*?(<dd(>| ).*)/i,"$1");
			var resNum = 0;
			var resName = "";
			var resMail = "空白";
			var resTime = "";
			var resType = "";
			var resID = "";

			strTxt ="";

			//header---------------

			var strTmp = strDT;
			var resNameClass = "bbs_res_name";


			//レス番
			if(strDT.match(/<dt.*?(<a.*?>)?>(\d+).*?((:|：).*)/)){
				resNum = parseInt(RegExp.$2);
				strTmp = RegExp.$3;

				if(!Number.isFinite(resNum)		//数字じゃない
				|| (addedFlg && resNum  == 1)){		//新着はレス1を除外
					continue;
				}

				strTxt += '<dt id="dt_' + resNum + '" class=bbs_res_header>'
					+ '<a id=a_' + resNum + ' class=bbs_res_number href="' + document.URL.replace(/#res_[0-9]+$/g,"") + '#res_' + resNum + '">' + resNum + '</a> ';
			}else continue;

			//名前・メール欄(通常)
			if(strTmp.match(/<a href\=\"mailto:(.*?)\"\><b>(.*?)<\/b><\/a>(.*)/i)){
				resName = RegExp.$2;
				resMail = RegExp.$1;
				var tmp = RegExp.$3;
				if(strTmp.match(/mailto:sage"/)) resNameClass += "_sage";
				else if(strTmp.match(/mailto:sagete"/)) resNameClass += "_sagete";
				else if(strTmp.match(/mailto:agete"/)) resNameClass += "_agete";
				else resNameClass += "_age";
				strTmp = tmp;

			//名前・メール欄(空欄)
			}else if(strTmp.match(/<font color=.*?><b>(.*?)<\/b><\/font>(.*)/)){
				resName = RegExp.$1;
				strTmp = RegExp.$2;

				resNameClass += "_space";
			}


			//名前がアンカー
			resName = resName.replace(/^((&gt;(&gt;)?|\uFF1E(\uFF1E)?|>(>)?)?([0-9]+)(-[0-9]+)?$)/i,'<a href="">$1</a>');
			resName = main.anchorMake(resName,resNum)

			strTxt += '<span class=' + resNameClass + '><b>' + resName + '</b></span> <span class=bbs_res_mail>[' + resMail + ']</span>';


			//時刻・ID
			if(strTmp.match(/(.*?)(ID|HOST):(([0-9a-zA-Z\+\/\-\.]+|\?{3})\*?)(.*)/)){
				resTime = RegExp.$1;
				resType = RegExp.$2;
				resID = RegExp.$3;
				strTmp = RegExp.$5;
				var lastChar = "";
				var accessName = "";

				
				if(resID.match(/(?:[a-zA-Z\d\.\+/]{8}|\?{3})(.)| (.)(?=$| )/)) lastChar = RegExp.$1;


				if(config.accessView && main.accessDB[lastChar] && resType != 'HOST') accessName = ' (' + main.accessDB[lastChar] + ')';

				if(!main.idDB[resID]) main.idDB[resID] = [resNum];
				else if(main.idDB[resID].indexOf(resNum) < 0) main.idDB[resID].push(resNum);

				strTxt += '<span class=bbs_res_time>' + resTime + '</span><span class=id_text><b>' + resType + '</b>:' + resID + '</span>' + accessName;
			}
			strTxt += strTmp;


			//body-----------------

			var strTmp = strDD;
			var resNameClass = "bbs_res_body";

			if(strTmp.match(/<dd>(.*?)<br><br>( *| *<\/dd>)?$/m)){
				var strTmp = RegExp.$1;
			}

			//AA
			if (config.aaFontFlg && strTmp.match(/(?:　{4}|(?: 　){2}|[─￣＿╂-]{4}|＼)/i)) {
				resNameClass += " bbs_res_aabody";
			}

			//URL(ttpテキストをリンク化)
			strTmp = strTmp.replace(/(ttps?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)(?:(?!>).)*?(<| $)(?!\/)/gi,'<a href="h$1">$1</a>$2');


			//aタグの新規タブ
			strTmp = strTmp.replace(/target="_blank" ?/ig,"").replace(/<a(.*?>)/gi,'<a target="_blank" ' + '$1');

			//アンカーをAタグにする(＞＞1 など)
			strTmp = strTmp.replace(/(^|<br>|\n|<a .*?>)((&gt;(&gt;)?|\uFF1E(\uFF1E)?|>(>)?)([0-9]+)(-[0-9]+)?)/ig,'$1<a href="">$2</a>')

			//アンカー
			strTmp = main.anchorMake(strTmp,resNum);


			//省略URL指定を元に戻す
			strTmp =   strTmp.replace(/href=("|')(\/.*?)("|')/g,'href="' + location.protocol + "//" + host + '$2"') ;

			//クッション除去
			strTmp = main.delCushion(strTmp);

			var errorDel = 'if(this.src.match(/^http/)){var pre=this.previousSibling;if(pre && pre.tagName && pre.tagName.match(/canvas/i)){pre.parentNode.removeChild(pre);}this.parentNode.removeChild(this);}';

			//画像
			if(config.thumbFlg){

				strTmp = strTmp.replace(/<a (?:(?!<a ).)*?href="(http(?:(?!").)*?\.(gif|jpeg|jpg|png|bmp))"/gi,
					'<img data-original="$1" src="' + srcData + '" style="min-width:5px;min-height:5px;" class="bbs_img" onerror="' + errorDel + '">'
					+'<a href="$1" ');

			}

			//動画のサムネ
			if(config.thumbFlg){
				//youtube
				strTmp = strTmp.replace(/(<a .*?href="https?:\/\/)[a-zA-Z0-9\.]*(youtube\.com|(youtu|y2u)\.be)\/(watch\?v=)?([0-9a-zA-Z\-_]{11})/ig,
				'<img data-original="https://img.youtube.com/vi/$5/mqdefault.jpg" src="' + srcData + '" style="min-width:5px;min-height:5px;" class="bbs_img" onerror="' + errorDel + '">$1www.youtube.com/watch?v=$5');

				//niconico動画nico.ms
				strTmp = strTmp.replace(/(<a .*?href="http:\/\/www\.nicovideo\.jp\/watch\/)sm(\d+)/ig,
				'<img data-original="http://tn-skr.smilevideo.jp/smile?i=$2" src="' + srcData + '" style="min-width:5px;min-height:5px;" class="bbs_img" onerror="' + errorDel + '">$1$2');
			
			}

			//ID参照
			strTmp = strTmp.replace(/(ID:)([0-9a-zA-Z\+\/\.]+)/i,'<span id=$2 class="id_text">$1$2</span>');


			strTxt += '<dd id="dd_' + resNum + '" class="' + resNameClass + '">' + strTmp + "<br><br></dd>";

			//NG登録
			var NGLengh = config.NGWord.length;
			if(NGLengh > 0){
				var notagTxt = strTxt.replace(/<br>/ig,"\n");

				for(var j=0; j < NGLengh; j++) {
					if(notagTxt.match(config.NGWord[j])) {
						main.ngDB.push(resNum);
						break;
					}
				}
			}
			//文字非表示
			var DelLengh = config.DeleteWord.length;
			if(DelLengh > 0){
				for(var dl=0; dl < DelLengh; dl++) {
					var regDel = config.DeleteWord[dl];
					if(typeof(regDel) == "string"){
						regDel = regDel.replace(/^\/(.*)\/$/,"$1");
						var delWord = '('+ regDel.replace(/(\(|\)|\^|\+|\-|\*|\/|\.|\[|\]|\?|\|)/ig,"\\\$1") + ')';
						regDel = new RegExp(delWord,'gi');
					}else{
						regDel = regDel.toString().slice(1).slice(0,-1)
						var delWord = '('+ regDel + ')';
						regDel = new RegExp(delWord,'gi');
					}

					strTxt = strTxt.replace(regDel,'<b class="deleteWord">$1</b>')
				}
			}

			main.lastRes = resNum;

			main.resDB[resNum] = '<dl id="res_' + resNum + '" class="bbs_res_One">' + strTxt + '</dl>';
		}//for文ここまで


		//DB最終修正-----------

		//発言数
		for(var key in main.idDB){
			var idDBLength = main.idDB[key].length;
			for(var a=0; idDBLength > a; a++){
				var num = main.idDB[key][a];
				var txtTmp = "";
				if(config.redmonkey != 0 && idDBLength >= config.redmonkey) txtTmp = " bbs_redmonkey";
				main.resDB[num] = main.resDB[num].replace(/<span class=(id_text)>(.*?:.*?<\/span>)/,
					'<span id=' + key + ' class="$1' + txtTmp + '">$2</span><span class="says_ID:' + key + '">[' + (a+1) + '/<span class="sayMax:' + key + '">' + idDBLength + '</span>]</span>');
				if(addedFlg){
					main.resDB[num] = main.resDB[num].replace(/(.*\/<span class=\"sayMax:.*?\">)\d+(<\/span>]<\/span>)/,'$1' + idDBLength + '$2');
				}
			}
			if(addedFlg){
				var says = document.getElementsByClassName('sayMax:' + key);
				for(var b=0,c=says.length;c > b;b++){
					says[b].innerHTML = idDBLength;
				}
			}
		}

		//anchor総数集計後に追加
		for(var key in main.anchorDB){
			var strRes = main.resDB[key];

			if(!strRes)continue;

			var anchorLength = main.anchorDB[key].length;
			var resColorClass = "";

			if(anchorLength >= config.redAnchored) resColorClass = " redAnchored"
			else if(anchorLength > 0) resColorClass = " anchored"

			main.resDB[key] = strRes.replace(/(.*?<a id=a_(.*?) class=)(bbs_res_number .*?)(href.*)/,'$1"bbs_res_number' + resColorClass + '" anchor="' + main.anchorDB[key] + '" $4');

			if(addedFlg){
				var ancObj = document.getElementById('a_'+key);
				if(!ancObj) continue;
				ancObj.setAttribute('anchor',main.anchorDB[key]);
//				if(!ancObj.hasAttribute('anchor')) main.popupStart(ancObj.parentNode,'res_anchor','res');	//アンカーマウスオーバー
				if(!ancObj.hasAttribute('anchor')) alert("")
				ancObj.className = 'bbs_res_number' + resColorClass;
			}
		}

		main.addHTML(addedFlg);
	},
	//htmlに追加
	addHTML: function(addedFlg){
		var oldRes = 0;
		var nextRes = 0;
		if(addedFlg){
			nextRes = addedFlg;
			oldRes = nextRes -1;
		}

		var dtParent = document.getElementsByTagName('dt')[0].parentNode;
		var strHTML = dtParent.innerHTML;
		var strResALL = "";

		main.getKidoku();	//既読チェック

		var kidokuNum = main.kidokuEnd;

		//新着差分
		if(addedFlg){
			var obj = document.createElement('div');
			obj.id = "alert_new";
			obj.className = "message_alert";
			
			var sabun = main.lastRes - oldRes;
			if(sabun == 0){
				obj.innerHTML = ('新着はありません。');
			}else if(sabun > 0){
				for(var n=nextRes; n <= main.lastRes; n++) {
					strResALL += main.ngCheck(n);
				}
				strResALL = strHTML.replace(/<dt.*/,"") + strResALL;
				obj.innerHTML = ('新着あり！更新しました。[' + sabun + '件]');

			}else{
				sabun = false;
				obj.innerHTML = ('error:現在表示中のレス番「' + oldRes + '」よりも、<br>取得した新レス番「' + main.lastRes + '」の方が小さいです。');
			}

			document.body.appendChild(obj);
			setTimeout(function(){ var tmp=document.getElementById("alert_new");if(tmp)document.body.removeChild(tmp); },10000);

			if(sabun <= 0) return;

			//追加
			var addObj = document.createElement("dl");
			addObj.className = "addNewRes";
			addObj.innerHTML = strResALL;
			threadObj.appendChild(addObj);

			main.gotoRess(oldRes);	//新着までスクロール
		//全レスURL
		}else if(urlCheck){
			var keys = Object.keys(main.resDB);
			var min = keys[1];
			if(!main.kidokuStart) kidokuNum = 0;
			else if(main.kidokuStart != min) kidokuNum = min;

			for(var key in main.resDB){
				if(main.kidokuStart == key) strResALL +=  '</dl><dl class=addNewRes>';

				strResALL += main.ngCheck(key);

				if(key == main.kidokuEnd) strResALL +=  '</dl><dl class=addNewRes>';
			}

			main.kidokuStart = 2;
			main.kidokuEnd = main.lastRes;
		//部分URL
		}else{

			var resArray = {};
			strHTML.replace(/.*<dt.*?(<a.*?|\n.*?)?>(\d+)(<\/a>| (名前)?:| (名前)?：).*\n?/mig,function(){
				if(arguments[2] && Number.isFinite(parseInt(arguments[2]))) resArray[parseInt(arguments[2])] = arguments[0];
			});

			var keys = Object.keys(resArray);
			var keyLeng = keys.length;
			var min = keys[1];	//2レス目
			var max = keys[keyLeng - 1];//最後
			var start = main.kidokuStart;	//既読start
			var end = main.kidokuEnd;	//既読end

			if(keyLeng == 1) min = max;

			min = parseInt(min);
			max = parseInt(max);

			//レスごとに既読条件を記録するとデータが肥大化するためすべては網羅はしない
			if(max < start || min > end){}						//範囲が被らない
			else if(min<=start && end<=max){}					//start～endが被る
			else if(min<=start && start<=max && max<=end) end=max;			//start～MAXが被る
			else if(start<=min && min<=end && end<=max) start=min;			//MIN～endが被る
			else if(start<=min && max<=end){start=min;end=max;}			//MIN～MAXが被る(何もしない)
//GM_log('確認用パターン:min「'+min+'」max「'+max+'」start「'+start+'」end「'+end+'」'); return;


			if(min == keys[1] && main.kidokuStart) kidokuNum = max;
			else kidokuNum = min;


			var tmpStart = main.kidokuStart;
			if(tmpStart == 2) tmpStart = min;


			if(main.kidokuStart > min || !main.kidokuStart) main.kidokuStart = min;
			if(main.kidokuEnd < max || !main.kidokuEnd) main.kidokuEnd = max;


			for(var key in resArray){
				if(key == tmpStart) strResALL +=  '</dl><dl class=addNewRes>';

				strResALL += main.ngCheck(key);

				if(key == main.kidokuEnd) strResALL +=  '</dl><dl class=addNewRes>';
			}

		}


		main.setKidoku();	//既読保存
		if(!addedFlg) dtParent.innerHTML = '<dl class=addNewRes>' + strResALL  + '</dl>';	//初回


		//画像サムネ
		if(config.thumbFlg){
			var imgAll = document.getElementsByClassName('bbs_img');
			for(var pic=0,imgLength=imgAll.length;imgLength > pic;pic++){
				var picObj = imgAll[pic];
				if(main.isInDisplay(picObj)) main.changeSrc(picObj);
			}
		}

		var targerObj = document;
		if(addedFlg){
			var newAll = document.getElementsByClassName('addNewRes');
			targerObj = newAll[newAll.length -1];
		}
		main.popupStart(targerObj,"id_text","id");	//idマウスオーバー
		main.popupStart(targerObj,'res_anchor','res');	//アンカーマウスオーバー
		main.popupStart(targerObj,'res_abon','abon');	//あぼーん
		main.popupStart(targerObj,'anchored','res');	//被アンカー
		main.popupStart(targerObj,'redAnchored','res');	//被アンカー真っ赤


		if(addedFlg) return;	//新着はここまで


		//書き込みフォーム
		var formObj = document.getElementsByTagName("form");

		var formLength = formObj.length;
		for(var f=0;formLength > f;f++){
			if(!formObj[f].hasAttribute("method") || !formObj[f].getAttribute("method").match(/^post$/i)) continue;

			formObj = formObj[f];

			//iframe作成
			main.makeFrame(formObj);

			//form作成
			if(config.moveFormFlg) main.makeForm(formObj);

			break;
		}
		main.addNextButton();	//次スレ候補

		if(config.thumbFlg) main.loadImg();	//画像遅延ロード

		main.addStyle(main.css,'defaultCSS');
		if(config.moveFormFlg) main.addStyle(main.formCSS,'formCSS');
		if(config.reverseFlg) main.addStyle(main.reverseCSS,'reverseCSS');

		if(startRes)  kidokuNum = startRes;
		else if(endRes) kidokuNum = endRes;

		main.gotoRess(kidokuNum);	//既読ジャンプ
	},
	//レスジャンプ
	gotoRess: function(num){
		if(num == 0) num++;
		var resObj = document.getElementById("res_" + num);
		if(!resObj) return;

		var toJump = resObj.offsetTop;
		if(config.reverseFlg) toJump = toJump - window.innerHeight || 0;

		document.documentElement.scrollTop = toJump;					//したらば等
		if(document.documentElement.scrollTop == 0) document.body.scrollTop = toJump;	//2ch.net等
	},
	//既読情報
	getKidoku: function(){
		main.kidoku = GM_getValue("kidoku");
		if(!main.kidoku) main.kidoku = {};
		else main.kidoku = JSON.parse(main.kidoku);

		main.kidokuStart = 0;
		main.kidokuEnd  = 0;

		var kidokuArray = main.kidoku[url];
		if(!kidokuArray) return;

if(kidokuArray.length == 2) kidokuArray.unshift('0');	//既読最初のレス番追加対応
		main.kidokuStart = parseInt(kidokuArray[0]);
		main.kidokuEnd = parseInt(kidokuArray[1]);

		//履歴情報削除
		main.KidokuRireki();
	},
	setKidoku: function(){""
		main.kidoku[url] = [main.kidokuStart,main.kidokuEnd,main.getTime()];
		GM_setValue("kidoku",JSON.stringify(main.kidoku));


	},
	KidokuRireki: function(){
		var delInterval = 1;				//1日毎
		var today = main.getTime();
		var lastDelTime = main.kidoku['lastDelTime'] = main.kidoku['lastDelTime'] || today;	//最終アクセス

		if(main.getDiff(today,lastDelTime) < delInterval) return; 

		for(var key in main.kidoku){
			if(key == 'lastDelTime') continue;

			var accessDay = main.kidoku[key][1];
			if(main.getDiff(today,accessDay) < config.delKidoku) continue;
			delete main.kidoku[key]; 
		}
		main.kidoku['lastDelTime'] = today;
	},
	getTime: function(){
		if(main.today) return main.today;
		
		var date = new Date();
		var year = date.getFullYear().toString();
		var month = (date.getMonth() + 1).toString();
		if(month < 10) month = "0" + month;
		var day = date.getDate().toString();
		if(day < 10) day = "0" + day;
		main.today = year + '-' + month + '-' + day;
		return main.today;
	},
	getDiff: function(today, lastday){
		var newDay = new Date(today);
		var oldDay = new Date(lastday);

		var mSec = newDay.getTime() - oldDay.getTime();		//ミリ秒計算
		var diff = Math.floor(mSec / (1000 * 60 * 60 *24));	//日付に戻す
		return diff;
	},
	//クッション除去
	delCushion: function(strTmp){
		var resultTxt = strTmp;

		var delUrls = resultTxt.match(/(h?ttps?):\/\/((www\d?\.|)(ime|nun).(nu|st)\/\??|jump.2ch.net\/\?|pinktower.com\/\??|2ch.io\/|.*l.moapi.net\/|t\.2nn\.jp\/|.*\/bbs\/link\.cgi\?URL=|fast.io\/)+/ig);

		if(!delUrls) return strTmp;

		for(var del=0,delLength=delUrls.length;delLength > del;del++){
			var matchTxt = delUrls[del];	//クッション部分
			var indexF = resultTxt.indexOf(matchTxt);	//マッチ先頭
			var tmpTxt = resultTxt.slice(0,indexF);

			if(!tmpTxt.match(/href="$/i)) continue;

			var tmpNext = resultTxt.slice(indexF);
			var indexL = tmpNext.indexOf('"');		//URLの最後
			var tmpUrl = tmpNext.slice(0,indexL);

			tmpUrl = tmpUrl.replace(matchTxt,tmpUrl.match(/^https?:\/\//)[0])
			tmpNext = tmpNext.slice(indexL);

			tmpTxt += main.decURI(tmpUrl) + tmpNext;
			resultTxt = tmpTxt;
		}
		return resultTxt;
	},
	//画像遅延ロード
	loadImg: function(){
		document.addEventListener('scroll',function(){
			var img = document.querySelectorAll('img[data-original]');
			var imgLength = img.length
			if(!imgLength){
				document.removeEventListener('scroll', arguments.callee,false);
				return;
			}
			for(var ele=0;imgLength > ele;ele++){
				var objEle = img[ele];

				if(!main.isInDisplay(objEle))continue;

				main.changeSrc(objEle);
			}
			window.addEventListener('beforeunload', function(){
				document.removeEventListener("scroll", arguments.callee,false);
				window.removeEventListener("beforeunload", arguments.callee,false);
			}, false);
		},false);
	},
	//画像src変更
	changeSrc: function(obj){
		var origin = obj.getAttribute("data-original");
		if(obj.src == origin) return;

		obj.src = origin;

		if(!config.mosaicFlg) return;	//以下モザイク処理

		obj.style.visibility = 'hidden';
		obj.onload = function() {
			this.removeEventListener("load", arguments.callee,false);
			main.toMosaic(this);
			this.style.visibility = 'visible';
		};
	},
	//モザイク
	toMosaic: function(obj){
		var imgW = obj.width;
		var imgH = obj.height;

		var canvasObj = document.createElement('canvas');
		canvasObj.width = imgW;
		canvasObj.height = imgH;

		var ctx = canvasObj.getContext('2d');
		ctx.mozImageSmoothingEnabled = false;	//firefox
		ctx.webkitImageSmoothingEnabled = false;//chrome

		var mosaicW = imgW * config.mosaicSize;
		var mosaicH = imgH * config.mosaicSize;
		ctx.drawImage(obj, 0, 0, mosaicW, mosaicH);
		ctx.drawImage(canvasObj, 0, 0, mosaicW, mosaicH, 0, 0, imgW, imgH);

if(!obj.parentNode) return;

		obj.parentNode.insertBefore(canvasObj, obj);
		obj.style.display = 'none';

		canvasObj.addEventListener('click', function(e) {
			canvasObj.style.display = 'none';
			obj.style.display = '';

		});
		obj.addEventListener('click', function(e) {
			canvasObj.style.display = '';
			obj.style.display = 'none';

		});
	},
	//画面内かどうか判定
	isInDisplay: function(ele) {
		var positions = ele.getBoundingClientRect();
		var flg = (ele == document.elementFromPoint(positions.left,positions.top));
		return flg;
	},
	//アンカー作成
	anchorMake: function(ancTmp,resNum){
		var strAncCommonReg = 'href="">(&gt;(&gt;)?|\uFF1E(\uFF1E)?|>(>)?)?([0-9]+)(-[0-9]+)?<\/a>';
		var ancReg =  new RegExp(strAncCommonReg,'i');

		var ancReturn = "";

		var cnt = 0;
		while(ancTmp.match(ancReg)){

			var matchLeft = RegExp.leftContext;
			var next = RegExp.rightContext;
			var mark = RegExp.$1;
			var resAnchor = RegExp.$5;
			var resAnchorEnd = RegExp.$6;
			if(resAnchorEnd && resAnchorEnd.match(/^-/)) resAnchorEnd = resAnchorEnd.slice(1)
			else resAnchorEnd = resAnchor - 1;
			var anchor = [];


			//レス指定間違いは先頭のレスだけ ex: >>175-170
			if(resAnchor >= resAnchorEnd){
				if(!main.anchorDB[resAnchor]) main.anchorDB[resAnchor] = [resNum];
				else if(main.anchorDB[resAnchor].indexOf(resNum) < 0) main.anchorDB[resAnchor].push(resNum);

				anchor.push(resAnchor);
			}

			for(var renban=resAnchor;resAnchorEnd >= renban;renban++){
				if(!main.anchorDB[renban]) main.anchorDB[renban] = [resNum];
				else if(main.anchorDB[renban].indexOf(resNum) < 0) main.anchorDB[renban].push(resNum);

				anchor.push(renban);
			}

			if(resAnchor < resAnchorEnd) resAnchorEnd = "-" + resAnchorEnd;
			else resAnchorEnd = "";

			ancReturn += matchLeft + ' id="anc_' + resAnchor + resAnchorEnd + '" class=res_anchor anchor="' + anchor 
				+ '" href="' + document.URL.replace(/#res_[0-9]+$/g,"") + '#res_' + resAnchor + '">'
				+ mark + resAnchor + resAnchorEnd + '</a>';


			//終了判定用
			ancTmp = next;	//削除するとループするので注意

			//ループした場合の保険
			cnt++;
			if(cnt > 2000) return;
		}
		ancReturn += ancTmp;
		return ancReturn;
	},
	//NGチェック
	ngCheck: function(num){
		var originTxt = main.resDB[num];

		var ngTxt = originTxt.replace(/(<dl id="res_\d+" class="bbs_res_One)">/,'$1 res_Abon_All"').replace(/(<span class=bbs_res_name.*?>.*?<dd .*?>).*?(<\/dd>)/,'$1<a id=abon_' + num + ' class=res_abon anchor=' + num + '>あぼーん</a>$2');

		for(var i=0,j=main.ngDB.length;j > i;i++){
			if(num == main.ngDB[i]) return ngTxt;
		}
		return originTxt;
	},
	//ポップアップスタート
	popupStart: function(doc,name,type,event){
		var eventType = '';
		switch(type){
			case 'id':
				eventType = config.popIDType;
				break;
			case 'res':
				eventType = config.popResType;
				break;
			case 'abon':
				eventType = config.popResAbonType;
				break;
			default: return;
		}


		//新着
		if(name == 'new'){
			var eObj = event.target;
			main.popEvent(eObj,eventType,type);
			return;
		}

		var obj = doc.getElementsByClassName(name);
		for(var c=0,d=obj.length; d > c; c++){
			var tmpObj = obj[c];

			main.popEvent(tmpObj,eventType,type);
		}
	},
	//ポップアップイベント
	popEvent: function(obj,eventType,type){
		if(eventType != "mouseover"){
			obj.addEventListener(eventType,function(e){

				main.popupMake(e,type);
			},false);
			return;
		}
		var eventA = function(e){
			e.target.removeEventListener('mouseover',eventA,false);
			e.target.timer = setTimeout(function(){

				main.popupMake(e,type);
			},700);
		};
		obj.addEventListener('mouseover',eventA,false);
		obj.addEventListener("mouseout",function(e){
			main.clearTimer(e.target);
			setTimeout(function(){
				var obj = document.getElementById("pop_id" +  e.target.id);
				if(!obj || obj && obj.style.height == 0) e.target.addEventListener('mouseover',eventA,false);
			},800);
		},false);
	},
	//ポップアップ作成
	popupMake: function(e,type){
		var masterObj = e.target;
		if(masterObj.tagName.match(/^b$/i)) masterObj = masterObj.parentNode;
		var id = masterObj.id;
		var tmpID = "pop_id" +  id;
		var nums = [];
		var abonFlg = false;

		if(masterObj.innerHTML == 'あぼーん') abonFlg = true;

		//すでに作成済み
		var popTmp;
		if(!abonFlg)popTmp = main.popupArr[tmpID];
		else popTmp = main.popupArr[tmpID.replace(/^a_/,"abon_")];	//あぼーんクリックで本来のレス表示
		if(popTmp){
			masterObj.addEventListener("mouseout",function(){
				main.setTimer(popTmp,config.popupTimeout);
			},false);
			masterObj.addEventListener("mouseover",function(){
				main.clearTimer(popTmp);
			},false);

			popTmp.removeAttribute('style');//こっちの方を先にしないとpopの高さ計算ができない
			main.popWhere(e,popTmp);
			return;
		}

		if(type.match(/^(res|abon)$/) && e.target.hasAttribute("anchor"))  nums = e.target.getAttribute("anchor").split(',');
		else if(type == "id") nums = main.idDB[id];
		else return;

		if(!nums) return;

		var popTxt = "";

		main.errorRes = [];
		for(var i=0, x=nums.length; i < x; i++) {
			var resNum = nums[i];
			if(main.resDB[resNum]){
				if(!abonFlg) popTxt += main.ngCheck(resNum);
				else popTxt += main.resDB[resNum]	//あぼーんをクリック時
				
			//レス番が現在のページにない場合などで取得できない場合、GM_xmlで取得
			}else main.errorRes.push(resNum);
		}

		if(!popTxt) return;

		var popup = document.createElement("dl");
		popup.id = tmpID;
		popup.className = "popup";
		popup.innerHTML = popTxt;
		
		var img = popup.getElementsByClassName("bbs_img");
		for(var j=0, y=img.length; j < y; j++) {
			var objTmp = img[j];
			main.changeSrc(objTmp);
		}

		main.popupStart(popup,"id_text","id");
		main.popupStart(popup,'res_anchor','res');
		main.popupStart(popup,'res_abon','abon');
		main.popupStart(popup,'anchored','res');
		main.popupStart(popup,'redAnchored','res');


		document.body.appendChild(popup);
		main.popWhere(e,popup);

		masterObj.addEventListener("mouseout",function(){
			main.setTimer(popup,config.popupTimeout);
			masterObj.removeEventListener("mouseout", arguments.callee,false);
		},false);
		masterObj.addEventListener("mouseover",function(){
			main.clearTimer(popup);
		},false);
		popup.addEventListener("mouseout",function(){
			main.setTimer(popup,config.popupTimeout);
		},false);
		popup.addEventListener("mouseover",function(){
			main.clearTimer(masterObj,tmpID);
		},false);

		main.popupArr[tmpID] = popup;

	},
	//ポップアップ位置
	popWhere: function(e,pop){
		var startW = e.clientX;
		var startH = e.clientY;
		var objW = pop.offsetWidth;
		var objH = pop.offsetHeight;

		//z-index
		var granObj = e.target.parentNode.parentNode.parentNode;
		while(!granObj.className.match(/(addNewRes|popup)/)){
			if(!granObj)return;
			granObj = granObj.parentNode;
		}

		var granZ = parseInt(granObj.style.zIndex);

		if(!granZ) granObj.style.zIndex = granZ = 1;

		pop.style.zIndex = granZ + 1;

		//画面右半分で折り返し
		if(window.innerWidth / 2 < startW) startW = startW - objW;
		//画面上から3/4で折り返し
		if(window.innerHeight * (3 / 4) < startH) startH = startH - objH;

		var posArray = main.antiextrusion(pop,startW + 15,startH)

		pop.style.left = posArray['x'] + "px";
		pop.style.top = posArray['y'] + "px";
	},
	//タイマーセット
	setTimer: function(obj,time) {
		if(!obj.timer) {
			obj.timer = setTimeout(function(){main.hidePop(obj);}, time);
		}
	},
	//タイマークリア
	clearTimer: function(obj,popId) {
		if(obj.timer) {
			clearTimeout(obj.timer);
			obj.timer = null;
		}

		if(!popId) return;

		var popObj = document.getElementById(popId);
		if(popObj && popObj.timer) {
			clearTimeout(popObj.timer);
			popObj.timer = null;
		}
	},
	//ポップアップ非表示
	hidePop: function(obj){
		obj.scrollLeft = 0;
		obj.scrollTop = 0;
		obj.style.display = "none";

	},
	//レス取得
	getRes: function(tmpUrl){
		GM_xmlhttpRequest({
			method: 'GET',
			overrideMimeType: "text/plain; charset=" + document.characterSet,
			url: tmpUrl,
			onload: function(res){
				if(res.finalUrl.match(/\/(\d+)n?-$/)) main.makeDB(res,parseInt(RegExp.$1)+1);	//新着レス
				else main.makeDB(res);	//全レス
			},
		});
	},
	//動的移動オブジェクト
	makeMoveObj: function(obj){
		document.onmousedown = function(){
			for(var key in main.status){
				if(main.status[key])return false;
			}
		};

		obj.addEventListener('mousedown',main.moveStart,false);
	},
	moveStart: function(e){
		var obj = e.target;

		if(!obj.tagName.match(/^div$/i)) return;
		else if(obj.className != 'movebox') obj = obj.parentNode;

		main.status[obj.id] = true;

		window.addEventListener('mousemove',function(e){
			main.moveMain(obj,e);
			if(!main.status[obj.id]) window.removeEventListener("mousemove", arguments.callee,false);
		},false);

		document.addEventListener('mouseup',function(){
			main.status[obj.id] = false;
			document.removeEventListener('mouseup',arguments.callee,false);
		},false);
	},
	moveMain: function(obj,e){
		var tmpObj = obj;
		var stat = main.status[tmpObj.id];
		if(!stat)return;

		var saX = 0;	//最初にマウスクリックした位置からオブジェクトの左まで
		var saY = 0;


		if(stat != true){
			saX = stat['saX'];
			saY = stat['saY'];
		}else{
			if(!Array.isArray(stat)) main.status[tmpObj.id] = [];
			main.status[tmpObj.id]['saX'] = saX = e.clientX - tmpObj.offsetLeft;
			main.status[tmpObj.id]['saY'] = saY = e.clientY - tmpObj.offsetTop;

		}

		var posArray = main.antiextrusion(tmpObj,e.clientX - saX,e.clientY - saY);

		tmpObj.style.left =  posArray['x'] + "px";
		tmpObj.style.top =  posArray['y'] + "px";
	},
	//windowはみ出し防止用位置補正
	antiextrusion: function(obj,checkX,checkY){
		var posArray = {};
		var objW = obj.offsetWidth;
		var objH = obj.offsetHeight;

		if(checkX < 0)checkX = 0;	//左側はみ出対策
		if(checkY < 0)checkY = 0;	//上側
		if(window.innerWidth < checkX + objW) checkX = window.innerWidth - objW -20;	//右側はみ出対策
		if(window.innerHeight < checkY + objH)checkY = window.innerHeight - objH;	//下側

		posArray['x'] = checkX;
		posArray['y'] = checkY;

		return posArray;
	},
	//コメント欄初期位置
	resetWindow: function(obj){
		obj.style.right = config.commentR + 'px';
		obj.style.bottom = config.commentB + 'px';
		obj.style.left = "";//クリア
		obj.style.top = "";
	},
	//右クリック拡張
	addRightMenu: function(id,className,name,icon){

		if(!main.count) main.count = 1;		//イベントハンドラの重複防止用

		//メニューアイテム
		var itemObj = document.createElement('menuitem');
		itemObj.setAttribute("id",id);
		itemObj.setAttribute("class",className);
		itemObj.setAttribute("name",name);
		if(icon) itemObj.setAttribute("icon",icon);	//アイコン画像

		
		//追加
		main.menuObj.appendChild(itemObj);
		document.body.appendChild(main.menuObj);

	},
	//イベントハンドラ-------------------------------
	handler: function(e){

		var targetID = e.target.id;

		main.count++;
		var thisNum = main.count;
		var items = main.menuObj.getElementsByTagName("menuitem");

		var text = window.getSelection().toString();
		for(var i=0,j=items.length;i<j;i++){
			var item = items[i];
			var pattern = item.className;

			//通常時
			if(text == ''){
				if(!targetID.match(/^a_\d+/)){
					item.removeAttribute('label');
					if(i < j)continue;
					else return;
				}
				item.setAttribute('label', item.getAttribute("name"));

			//テキスト選択時
			}else{
				if(pattern == "pattern1") item.setAttribute('label', item.getAttribute("name"));
				else item.removeAttribute('label');
			}

			main.addClick(targetID,text,item,thisNum);
		}
		return true;
	},
	//ループ処理させるとaddEventListenerで発火する頃にはループが終わってしまい、addEventListener内のobjが一番最後のものしか発火しなくなるので関数にして外に出した
	addClick: function(targetID,text,obj,num){
		obj.addEventListener("click",function(){
			obj.removeEventListener("click", arguments.callee,false);
			if(num != main.count) return true;

			main.selectMenu(targetID,text,obj.id);
		},false);
	},
	//右クリックメイン-------------------------------------
	selectMenu: function(targetID,text,type){
		var resTxt = "";
		if(host.match("machi.to")) textArea = document.getElementsByTagName("textarea")[0];

		//通常時
		if(text == ""){
			var resNum = targetID.replace(/a_/,"");
			var resCopy = main.resDB[resNum].replace(/(<br>|<dd .*?>)/ig,"\n> ").replace(/<.*?>/g,"").replace(/\[\d+\/\d+\]( \(.*?\))?/,"").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&nbsp;/g," ").replace(/&copy;/g,"c");

			//これにレス
			if(type == 'menuItem1') resTxt = '>>' + resNum + "\n";
			//引用付レス
			else if(type=='menuItem2') resTxt = '>>' + resCopy + "\n";
			//レスコピー
			else if(type == 'menuItem3'){
				resTxt = '>>' + resCopy + "\n";
				GM_setClipboard(resTxt);
				return;
			}

		//テキスト選択時
		}else{
			resTxt = ('> ' + text).replace(/\r\r\n/g,"<br>> ").replace(/\[\d+\/\d+\]( \(.*?\))?/,"") + "\n";
		}

		if(textArea) textArea.value += resTxt;
		if(main.moveForm) main.moveForm.setAttribute("name","normal");
	},
	//フォーム初期値
	setFormData: function(){
		//名前欄
		if(config.nameran != "初期化停止"){
			var name = document.getElementsByName("FROM");
			if(name.length == 0) name = document.getElementsByName("NAME");

			if(name.length > 0) name[0].value = config.nameran;
		}

		//メール欄
		if(config.mailran != "初期化停止"){
			var mail = document.getElementsByName("MAIL");
			if(mail.length == 0) mail = document.getElementsByName("mail");

			if(mail.length > 0) mail[0].value = config.mailran;
		}

		//コメント欄
		if(config.commentran != "初期化停止"){
			if(textArea) textArea.value = config.commentran;
	//		if(textArea) textArea.firstChild.nodeValue = config.commentran;
		}

	},
	//新着レス差分取得
	getNewRes: function(){
		var tmpUrl = url;

		if(host.match(/(2ch.(net|sc)|jbbs.shitaraba.net|camani.on.arena.ne.jp|bbspink.com)$/)) tmpUrl += main.lastRes + 'n-';
		else if(host.match(/(cha2.org|cha2.net|machi.to)/)) tmpUrl += main.lastRes + '-';
		else return;

		main.getRes(tmpUrl);
	},
	makeFrame: function(formObj){
		//div要素
		var moveFrame = document.createElement("div");
		moveFrame.id = 'moveFrame';
		moveFrame.className = 'movebox';
		document.body.appendChild(moveFrame);

		moveFrame.style.right = "100px";
		moveFrame.style.bottom = "300px";

		main.makeMoveObj(moveFrame);

		//frame
		var frame = document.createElement("iframe");
		frame.src = 'about:blank';
		frame.name = 'bbs_frame';
		frame.sandbox = "allow-same-origin allow-forms";
		moveFrame.appendChild(frame);
		formObj.target = frame.name;


		//書き込むボタン
		var button = formObj.getElementsByTagName("input");
		var buttonNum = null;

		for(var i=0,j=button.length;i<j;i++){
			if(button[i].value=="書き込む"){
				buttonNum = i;
				break;
			}
		}

		if(buttonNum != null){
			 button = button[buttonNum];
			 button.addEventListener('mousedown',function(e){
				var objDown = e.target;
				objDown.removeEventListener('mousedown', arguments.callee,false);

				frame.addEventListener('load',function(e){
					var objLoad = e.target;
					if(objLoad.contentDocument.body.innerHTML.match(/(成功|書きこみが終わりました|書きこみが終りました|しばらくお待ち下さい)/)){;
						objLoad.removeEventListener('load', arguments.callee,true);
						objLoad.contentDocument.body.innerHTML = "";
						moveFrame.style.visibility = "hidden";
						moveFrame.removeChild(objLoad);
						main.makeFrame(formObj);

						main.setFormData();
						main.getNewRes();
						return;
					}else{
						moveFrame.style.visibility = "visible";
					}
				
				},true);
			},false);
		}
	},
	makeForm: function(formObj){
		var parentDiv = formObj.parentNode
		//div要素
		main.moveForm = document.createElement("div");
		main.moveForm.id = 'moveForm';
		main.moveForm.setAttribute('name',config.formSize);
		main.moveForm.className = 'movebox';
		main.moveForm.innerHTML = '<button id=checknewbutton title="新着チェック" style="">A</button>'
			+ '<button id=nextbutton title="次スレ候補">Å</button>'
			+ '<button id=custombutton title="設定">?</button>'
			+ '<button id=viewbutton title="サイズ切り替え">□</button>'
			+ '<button id=closebutton title="閉じる">×</button>'
			+ '<button id=clearbutton>初期化</button>'
			+ '<div id=threadname>' + document.title + '</div>';
		parentDiv.appendChild(main.moveForm);

		//新着チェックボタン
		var checknewbutton = document.getElementById("checknewbutton");
		var onEventCheck = function(e){
			if(window.confirm('新着レスを確認・取得しますか？')) main.getNewRes();
		};
		checknewbutton.addEventListener('click',onEventCheck,false);

		//次スレ候補ボタン
		var nextbutton = document.getElementById("nextbutton");
		main.addNextButton(nextbutton);

		//設定ボタン
		var custombutton = document.getElementById("custombutton");
		var openConfig = function(){
			if(GM_option) GM_option.open(strHeader,setHTML);
		}
		custombutton.addEventListener('click',openConfig,false);

		//拡大最小ボタン
		var viewbutton = document.getElementById("viewbutton");
		var onEventView = function(e){
			main.resizeForm(viewbutton);
		};
		viewbutton.addEventListener('click',onEventView,false);
		//form用moveboxをダブルクリックで拡大最小
		var onEventMovebox = function(e){
			if(!e.target.tagName.match(/^div$/i)) return;
			main.resizeForm(viewbutton);
		};
		parentDiv.addEventListener('dblclick',onEventMovebox,false);


		//クローズボタン(閉じるわけではなく初期の形に戻す)
		var closebutton = document.getElementById("closebutton");
		var onEventClose = function(e){
			var p=this.parentNode;
			var v=document.getElementById("viewbutton");
			var obj = e.target.parentNode;

			main.resetWindow(obj);
			p.setAttribute("name","small");
			v.innerHTML = '□';
			
		};
		closebutton.addEventListener('click',onEventClose,false);


		//初期化ボタン
		var clearbutton = document.getElementById("clearbutton");
		clearbutton.addEventListener('click',main.setFormData,false);


		main.resetWindow(main.moveForm);

		main.makeMoveObj(main.moveForm);
		main.moveForm.appendChild(formObj);

	},
	addNextButton: function(nextbutton){
		if(!nextbutton){
			threadObj.insertAdjacentHTML('afterend','<div id="threadListBox"><button id="nextCheck">次スレ候補確認</button></div><br>');
			nextbutton = document.getElementById("nextCheck");
		}
		var nextCheck = function(){
			if(window.confirm('次スレ候補を確認しますか？')) main.getThreadList();
			main.gotoRess(main.lastRes);
		};
		nextbutton.addEventListener('click',nextCheck,false);
	},

	//次スレ候補
	getThreadList: function(){
		var tmpUrl = '';
		if(host.match(/shitaraba/)) tmpUrl = document.URL.replace(/(.*?\/bbs\/)read(_archive)?(\.[a-zA-z]+\/.*?\/\d+\/).*$/,'$1subject$3');
		else tmpUrl = document.URL.replace(/(.*?)\/(test|bbs)\/read\.[a-zA-z]+(\/.*?\/).*$/,'$1$3subback.html');

		var box = document.getElementById('threadListBox');
		if(main.threadListFlg) box.removeChild(document.getElementById('threadList'));

		box.insertAdjacentHTML('beforeend','<iframe id="threadList" sandbox="allow-same-origin allow-popups" frameborder="0" width="100%" src="'+tmpUrl+'"></iframe>');
		document.getElementById('threadList').addEventListener('load',function(e){
			main.makeThreadList(e.target.contentDocument);
		},true);

	},
	makeThreadList: function(doc){
		doc.body.removeAttribute('bgcolor');
		var strList = doc.body.innerHTML.match(/<a href(?:(?!<a ).)*?\d+\/l50".*?<\/a>/g);
		var strReg = '「.*?」|「.*?」|【.*?】|\\[.*?\\]|［.*?］|『.*?』|\\(.*?\\)|（.*?）|\\<.*?\\>|＜.*?＞|c2ch.net|&copy\;2ch.net';
		var oldReg = new RegExp('(' + strReg + ')','g');
		var newReg = new RegExp('(' + strReg + '|\\d+: )','g');
		var threadNum = url.replace(/.*\/(\d+)\/?$/,'$1')
		var threadNumReg = new RegExp(threadNum + '.*');
		var oldTitle = document.title.replace(oldReg,'').replace(threadNumReg,'');
		var oldCheck = oldTitle.replace(/(.*[0-9０-９]).*$/i,'$1').replace(/[0-9０-９]+$/,'');
		var strTxt = '';

		var oldNum = oldTitle.replace(/2ch.net/,'').match(/([0-9０-９]+)/g);
		oldNum = main.matchToNum(oldNum);

		for(var i=0,j=strList.length;i<j;i++){
			var newTitle = strList[i].replace(newReg,'');
			var newCheck = newTitle.replace(/(.*[0-9０-９]).*$/i,'$1').replace(/[0-9０-９]+$/,'');
			if(!newCheck.match(oldCheck)) continue;

			var newNum = newTitle.replace(/2ch.net/,'').match(/([0-9０-９]+)/g);
			var newNum = main.matchToNum(newNum);

			if(newNum >= oldNum)strTxt += strList[i].replace(/\/l50"/,'/" target="_blank"') + '<br>';
		}

		if(strTxt=="") strTxt = '次スレ候補見つからず。(簡易検索のため検索ミスの可能性あり)';
		doc.body.innerHTML = strTxt;
		main.threadListFlg = true;
	},
	matchToNum: function(num){
		if(num) num = parseInt(num[num.length-1]);
		else num = 0;
		if(!num) num = 0;
		return num;
	},
	resizeForm: function(obj){
		var p=obj.parentNode;
		var name = p.getAttribute("name");
		if(name=="normal"){
			obj.innerHTML = '□';
			p.setAttribute("name","small");
		}else{
			obj.innerHTML = '＿';
			p.setAttribute("name","normal");

			var posArray = main.antiextrusion(p,p.offsetLeft,p.offsetTop);

			p.style.left =  posArray['x'] + "px";
			p.style.top =  posArray['y'] + "px";
		}
	},
	//URLデコード
	decURI: function(str){

		var charCode = "";
		if (str.match("%")) {
			try {
				charCode = GetEscapeCodeType(str);
				if ( charCode == "UTF8" ) {
					str = UnescapeUTF8(str);
				}else if ( charCode == "EUCJP" ) {
					str = UnescapeEUCJP(str);
				}else if ( charCode == "SJIS" ) {
					str = UnescapeSJIS(str);
				}else if ( charCode == "Unicode" ) {
					str = unescape(str);
				}
				
				return str;
				
			}catch(e){
				//throw(e);
				GM_log("S2V_URL-DECODE:" + e);
			}
		}else{
			return str;
		}

	//throw new Error();
	},
	//css追加・置き換え
	addStyle: function(css,id){
		var head = document.head;
		if(!head) return;

		var cssObj = document.getElementById(id);
		if(cssObj) head.removeChild(cssObj);

		cssObj = document.createElement('style');
		cssObj.id = id;
		cssObj.innerHTML = css;
		head.appendChild(cssObj);
	},
}









function ecl(){
try{

//============================引用開始===================================

	//
	// Escape Codec Library: ecl.js (Ver.041208)
	//
	// Copyright (C) http://nurucom-archives.hp.infoseek.co.jp/digital/
	//

	EscapeSJIS=function(str){
	    return str.replace(/[^*+.-9A-Z_a-z-]/g,function(s){
	        var c=s.charCodeAt(0),m;
	        return c<128?(c<16?"%0":"%")+c.toString(16).toUpperCase():65376<c&&c<65440?"%"+(c-65216).toString(16).toUpperCase():(c=JCT11280.indexOf(s))<0?"%81E":"%"+((m=((c<8272?c:(c=JCT11280.lastIndexOf(s)))-(c%=188))/188)<31?m+129:m+193).toString(16).toUpperCase()+(64<(c+=c<63?64:65)&&c<91||95==c||96<c&&c<123?String.fromCharCode(c):"%"+c.toString(16).toUpperCase())
	    })
	};

	UnescapeSJIS=function(str){
	    return str.replace(/%(8[1-9A-F]|[9E][0-9A-F]|F[0-9A-C])(%[4-689A-F][0-9A-F]|%7[0-9A-E]|[@-~])|%([0-7][0-9A-F]|A[1-9A-F]|[B-D][0-9A-F])/ig,function(s){
	        var c=parseInt(s.substring(1,3),16),l=s.length;
	        return 3==l?String.fromCharCode(c<160?c:c+65216):JCT11280.charAt((c<160?c-129:c-193)*188+(4==l?s.charCodeAt(3)-64:(c=parseInt(s.substring(4),16))<127?c-64:c-65))
	    })
	};

	EscapeEUCJP=function(str){
	    return str.replace(/[^*+.-9A-Z_a-z-]/g,function(s){
	        var c=s.charCodeAt(0);
	        return (c<128?(c<16?"%0":"%")+c.toString(16):65376<c&&c<65440?"%8E%"+(c-65216).toString(16):(c=JCT8836.indexOf(s))<0?"%A1%A6":"%"+((c-(c%=94))/94+161).toString(16)+"%"+(c+161).toString(16)).toUpperCase()
	    })
	};

	UnescapeEUCJP=function(str){
	    return str.replace(/(%A[1-9A-F]|%[B-E][0-9A-F]|%F[0-9A-E]){2}|%8E%(A[1-9A-F]|[B-D][0-9A-F])|%[0-7][0-9A-F]/ig,function(s){
	        var c=parseInt(s.substring(1),16);
	        return c<161?String.fromCharCode(c<128?c:parseInt(s.substring(4),16)+65216):JCT8836.charAt((c-161)*94+parseInt(s.substring(4),16)-161)
	    })
	};

	EscapeJIS7=function(str){
	    var u=String.fromCharCode,ri=u(92,120,48,48,45,92,120,55,70),rj=u(65377,45,65439,93,43),
	    H=function(c){
	        return 41<c&&c<58&&44!=c||64<c&&c<91||95==c||96<c&&c<123?u(c):"%"+c.toString(16).toUpperCase()
	    },
	    I=function(s){
	        var c=s.charCodeAt(0);
	        return (c<16?"%0":"%")+c.toString(16).toUpperCase()
	    },
	    rI=new RegExp;rI.compile("[^*+.-9A-Z_a-z-]","g");
	    return ("g"+str+"g").replace(RegExp("["+ri+"]+","g"),function(s){
	        return "%1B%28B"+s.replace(rI,I)
	    }).replace(RegExp("["+rj,"g"),function(s){
	        var c,i=0,t="%1B%28I";while(c=s.charCodeAt(i++))t+=H(c-65344);return t
	    }).replace(RegExp("[^"+ri+rj,"g"),function(s){
	        var a,c,i=0,t="%1B%24B";while(a=s.charAt(i++))t+=(c=JCT8836.indexOf(a))<0?"%21%26":H((c-(c%=94))/94+33)+H(c+33);return t
	    }).slice(8,-1)
	};

	UnescapeJIS7=function(str){
	    var i=0,p,q,s="",u=String.fromCharCode,
	    P=("%28B"+str.replace(/%49/g,"I").replace(/%1B%24%4[02]|%1B%24@/ig,"%1B%24B")).split(/%1B/i),
	    I=function(s){
	        return u(parseInt(s.substring(1),16))
	    },
	    J=function(s){
	        return u((3==s.length?parseInt(s.substring(1),16):s.charCodeAt(0))+65344)
	    },
	    K=function(s){
	        var l=s.length;
	        return JCT8836.charAt(4<l?(parseInt(s.substring(1),16)-33)*94+parseInt(s.substring(4),16)-33:2<l?(37==(l=s.charCodeAt(0))?(parseInt(s.substring(1,3),16)-33)*94+s.charCodeAt(3):(l-33)*94+parseInt(s.substring(2),16))-33:(s.charCodeAt(0)-33)*94+s.charCodeAt(1)-33)
	    },
	    rI=new RegExp,rJ=new RegExp,rK=new RegExp;
	    rI.compile("%[0-7][0-9A-F]","ig");rJ.compile("(%2[1-9A-F]|%[3-5][0-9A-F])|[!-_]","ig");
	    rK.compile("(%2[1-9A-F]|%[3-6][0-9A-F]|%7[0-9A-E]){2}|(%2[1-9A-F]|%[3-6][0-9A-F]|%7[0-9A-E])[!-~]|[!-~](%2[1-9A-F]|%[3-6][0-9A-F]|%7[0-9A-E])|[!-~]{2}","ig");
	    while(p=P[i++])s+="%24B"==(q=p.substring(0,4))?p.substring(4).replace(rK,K):"%28I"==q?p.substring(4).replace(rJ,J):p.replace(rI,I).substring(2);
	    return s
	};

	EscapeJIS8=function(str){
	    var u=String.fromCharCode,r=u(92,120,48,48,45,92,120,55,70,65377,45,65439,93,43),
	    H=function(c){
	        return 41<c&&c<58&&44!=c||64<c&&c<91||95==c||96<c&&c<123?u(c):"%"+c.toString(16).toUpperCase()
	    },
	    I=function(s){
	        var c=s.charCodeAt(0);
	        return (c<16?"%0":"%")+(c<128?c:c-65216).toString(16).toUpperCase()
	    },
	    rI=new RegExp;rI.compile("[^*+.-9A-Z_a-z-]","g");
	    return ("g"+str+"g").replace(RegExp("["+r,"g"),function(s){
	        return "%1B%28B"+s.replace(rI,I)
	    }).replace(RegExp("[^"+r,"g"),function(s){
	        var a,c,i=0,t="%1B%24B";while(a=s.charAt(i++))t+=(c=JCT8836.indexOf(a))<0?"%21%26":H((c-(c%=94))/94+33)+H(c+33);return t
	    }).slice(8,-1)
	};

	UnescapeJIS8=function(str){
	    var i=0,p,s="",
	    P=("%28B"+str.replace(/%1B%24%4[02]|%1B%24@/ig,"%1B%24B")).split(/%1B/i),
	    I=function(s){
	        var c=parseInt(s.substring(1),16);
	        return String.fromCharCode(c<128?c:c+65216)
	    },
	    K=function(s){
	        var l=s.length;
	        return JCT8836.charAt(4<l?(parseInt(s.substring(1),16)-33)*94+parseInt(s.substring(4),16)-33:2<l?(37==(l=s.charCodeAt(0))?(parseInt(s.substring(1,3),16)-33)*94+s.charCodeAt(3):(l-33)*94+parseInt(s.substring(2),16))-33:(s.charCodeAt(0)-33)*94+s.charCodeAt(1)-33)
	    },
	    rI=new RegExp,rK=new RegExp;
	    rI.compile("%([0-7][0-9A-F]|A[1-9A-F]|[B-D][0-9A-F])","ig");
	    rK.compile("(%2[1-9A-F]|%[3-6][0-9A-F]|%7[0-9A-E]){2}|(%2[1-9A-F]|%[3-6][0-9A-F]|%7[0-9A-E])[!-~]|[!-~](%2[1-9A-F]|%[3-6][0-9A-F]|%7[0-9A-E])|[!-~]{2}","ig");
	    while(p=P[i++])s+="%24B"==p.substring(0,4)?p.substring(4).replace(rK,K):p.replace(rI,I).substring(2);
	    return s
	};

	EscapeUnicode=function(str){
	    return str.replace(/[^*+.-9A-Z_a-z-]/g,function(s){
	        var c=s.charCodeAt(0);
	        return (c<16?"%0":c<256?"%":c<4096?"%u0":"%u")+c.toString(16).toUpperCase()
	    })
	};

	UnescapeUnicode=function(str){
	    return str.replace(/%u[0-9A-F]{4}|%[0-9A-F]{2}/ig,function(s){
	        return String.fromCharCode("0x"+s.substring(s.length/3))
	    })
	};

	EscapeUTF7=function(str){
	    var B="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),
	    E=function(s){
	        var c=s.charCodeAt(0);
	        return B[c>>10]+B[c>>4&63]+B[(c&15)<<2|(c=s.charCodeAt(1))>>14]+(0<=c?B[c>>8&63]+B[c>>2&63]+B[(c&3)<<4|(c=s.charCodeAt(2))>>12]+(0<=c?B[c>>6&63]+B[c&63]:""):"")
	    },
	    re=new RegExp;re.compile("[^+]{1,3}","g");
	    return (str+"g").replace(/[^*+.-9A-Z_a-z-]+[*+.-9A-Z_a-z-]|[+]/g,function(s){
	        if("+"==s)return "+-";
	        var l=s.length-1,w=s.charAt(l);
	        return "+"+s.substring(0,l).replace(re,E)+("+"==w?"-+-":"*"==w||"."==w||"_"==w?w:"-"+w)
	    }).slice(0,-1)
	};

	UnescapeUTF7=function(str){
	    var i=0,B={};
	    while(i<64)B["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(i)]=i++;
	    return str.replace(RegExp("[+][+/-9A-Za-z]*-?","g"),function(s){
	        if("+-"==s)return "+";
	        var b=B[s.charAt(1)],c,i=1,t="";
	        while(0<=b){
	            if((c=i&7)<6)c=c<3?b<<10|B[s.charAt(++i)]<<4|(b=B[s.charAt(++i)])>>2:(b&3)<<14|B[s.charAt(++i)]<<8|B[s.charAt(++i)]<<2|(b=B[s.charAt(++i)])>>4;
	            else{c=(b&15)<<12|B[s.charAt(++i)]<<6|B[s.charAt(++i)];b=B[s.charAt(++i)]}
	            if(c)t+=String.fromCharCode(c)
	        }
	        return t
	    })
	};

	EscapeUTF8=function(str){
	    return str.replace(/[^*+.-9A-Z_a-z-]/g,function(s){
	        var c=s.charCodeAt(0);
	        return (c<16?"%0"+c.toString(16):c<128?"%"+c.toString(16):c<2048?"%"+(c>>6|192).toString(16)+"%"+(c&63|128).toString(16):"%"+(c>>12|224).toString(16)+"%"+(c>>6&63|128).toString(16)+"%"+(c&63|128).toString(16)).toUpperCase()
	    })
	};

	UnescapeUTF8=function(str){
	    return str.replace(/%(E(0%[AB]|[1-CEF]%[89AB]|D%[89])[0-9A-F]|C[2-9A-F]|D[0-9A-F])%[89AB][0-9A-F]|%[0-7][0-9A-F]/ig,function(s){
	        var c=parseInt(s.substring(1),16);
	        return String.fromCharCode(c<128?c:c<224?(c&31)<<6|parseInt(s.substring(4),16)&63:((c&15)<<6|parseInt(s.substring(4),16)&63)<<6|parseInt(s.substring(7),16)&63)
	    })
	};

	EscapeUTF16LE=function(str){
	    var H=function(c){
	        return 41<c&&c<58&&44!=c||64<c&&c<91||95==c||96<c&&c<123?String.fromCharCode(c):(c<16?"%0":"%")+c.toString(16).toUpperCase()
	    };
	    return str.replace(/[^ ]| /g,function(s){
	        var c=s.charCodeAt(0);return H(c&255)+H(c>>8)
	    })
	};

	UnescapeUTF16LE=function(str){
	    var u=String.fromCharCode,b=u(92,120,48,48,45,92,120,70,70);
	    return str.replace(/^%FF%FE/i,"").replace(RegExp("%[0-9A-F]{2}%[0-9A-F]{2}|%[0-9A-F]{2}["+b+"]|["+b+"]%[0-9A-F]{2}|["+b+"]{2}","ig"),function(s){
	        var l=s.length;
	        return u(4<l?"0x"+s.substring(4,6)+s.substring(1,3):2<l?37==(l=s.charCodeAt(0))?parseInt(s.substring(1,3),16)|s.charCodeAt(3)<<8:l|parseInt(s.substring(2),16)<<8:s.charCodeAt(0)|s.charCodeAt(1)<<8)
	    })
	};

	GetEscapeCodeType=function(str){
	    if(/%u[0-9A-F]{4}/i.test(str))return "Unicode";
	    if(/%([0-9A-DF][0-9A-F]%[8A]0%|E0%80|[0-7][0-9A-F]|C[01])%[8A]0|%00|%[7F]F/i.test(str))return "UTF16LE";
	    if(/%E[0-9A-F]%[8A]0%[8A]0|%[CD][0-9A-F]%[8A]0/i.test(str))return "UTF8";
	    if(/%F[DE]/i.test(str))return /%8[0-9A-D]|%9[0-9A-F]|%A0/i.test(str)?"UTF16LE":"EUCJP";
	    if(/%1B/i.test(str))return /%[A-D][0-9A-F]/i.test(str)?"JIS8":"JIS7";
	    var S=str.substring(0,6143).replace(/%[0-9A-F]{2}|[^ ]| /ig,function(s){
	        return s.length<3?"40":s.substring(1)
	    }),c,C,i=0,T;
	    while(0<=(c=parseInt(S.substring(i,i+=2),16))&&i<4092)if(128<=c){
	        if((C=parseInt(S.substring(i,i+2),16))<128)i+=2;
	        else if(194<=c&&c<240&&C<192){
	            if(c<224){T="UTF8";i+=2;continue}
	            if(2==parseInt(S.charAt(i+2),16)>>2){T="UTF8";i+=4;continue}
	        }
	        if(142==c&&161<=C&&C<224){if(!T)T="EUCJP";if("EUCJP"==T)continue}
	        if(c<161)return "SJIS";
	        if(c<224&&!T)
	            if((164==c&&C<244||165==c&&C<247)&&161<=C)i+=2;
	            else T=224<=C?"EUCJP":"SJIS";
	        else T="EUCJP"
	    }
	    return T?T:"EUCJP"
	};

	JCT11280=Function('var a="zKV33~jZ4zN=~ji36XazM93y!{~k2y!o~k0ZlW6zN?3Wz3W?{EKzK[33[`y|;-~j^YOTz$!~kNy|L1$353~jV3zKk3~k-4P4zK_2+~jY4y!xYHR~jlz$_~jk4z$e3X5He<0y!wy|X3[:~l|VU[F3VZ056Hy!nz/m1XD61+1XY1E1=1y|bzKiz!H034zKj~mEz#c5ZA3-3X$1~mBz$$3~lyz#,4YN5~mEz#{ZKZ3V%7Y}!J3X-YEX_J(3~mAz =V;kE0/y|F3y!}~m>z/U~mI~j_2+~mA~jp2;~m@~k32;~m>V}2u~mEX#2x~mBy+x2242(~mBy,;2242(~may->2&XkG2;~mIy-_2&NXd2;~mGz,{4<6:.:B*B:XC4>6:.>B*BBXSA+A:X]E&E<~r#z+625z s2+zN=`HXI@YMXIAXZYUM8X4K/:Q!Z&33 3YWX[~mB`{zKt4z (zV/z 3zRw2%Wd39]S11z$PAXH5Xb;ZQWU1ZgWP%3~o@{Dgl#gd}T){Uo{y5_d{e@}C(} WU9|cB{w}bzvV|)[} H|zT}d||0~{]Q|(l{|x{iv{dw}(5}[Z|kuZ }cq{{y|ij}.I{idbof%cu^d}Rj^y|-M{ESYGYfYsZslS`?ZdYO__gLYRZ&fvb4oKfhSf^d<Yeasc1f&a=hnYG{QY{D`Bsa|u,}Dl|_Q{C%xK|Aq}C>|c#ryW=}eY{L+`)][YF_Ub^h4}[X|?r|u_ex}TL@YR]j{SrXgo*|Gv|rK}B#mu{R1}hs|dP{C7|^Qt3|@P{YVV |8&}#D}ef{e/{Rl|>Hni}R1{Z#{D[}CQlQ||E}[s{SG_+i8eplY[=[|ec[$YXn#`hcm}YR|{Ci(_[ql|?8p3]-}^t{wy}4la&pc|3e{Rp{LqiJ],] `kc(]@chYnrM`O^,ZLYhZB]ywyfGY~aex!_Qww{a!|)*lHrM{N+n&YYj~Z b c#e_[hZSon|rOt`}hBXa^i{lh|<0||r{KJ{kni)|x,|0auY{D!^Sce{w;|@S|cA}Xn{C1h${E]Z-XgZ*XPbp]^_qbH^e[`YM|a||+=]!Lc}]vdBc=j-YSZD]YmyYLYKZ9Z>Xcczc2{Yh}9Fc#Z.l{}(D{G{{mRhC|L3b#|xK[Bepj#ut`H[,{E9Yr}1b{[e]{ZFk7[ZYbZ0XL]}Ye[(`d}c!|*y`Dg=b;gR]Hm=hJho}R-[n}9;{N![7k_{UbmN]rf#pTe[x8}!Qcs_rs[m`|>N}^V})7{^r|/E}),}HH{OYe2{Skx)e<_.cj.cjoMhc^d}0uYZd!^J_@g,[[[?{i@][|3S}Yl3|!1|eZ|5IYw|1D}e7|Cv{OHbnx-`wvb[6[4} =g+k:{C:}ed{S]|2M]-}WZ|/q{LF|dYu^}Gs^c{Z=}h>|/i|{W]:|ip{N:|zt|S<{DH[p_tvD{N<[8Axo{X4a.^o^X>Yfa59`#ZBYgY~_t^9`jZHZn`>G[oajZ;X,i)Z.^~YJe ZiZF^{][[#Zt^|]Fjx]&_5dddW]P0C[-]}]d|y {C_jUql] |OpaA[Z{lp|rz}:Mu#]_Yf6{Ep?f5`$[6^D][^u[$[6^.Z8]]ePc2U/=]K^_+^M{q*|9tYuZ,s(dS{i=|bNbB{uG}0jZOa:[-]dYtu3]:]<{DJ_SZIqr_`l=Yt`gkTnXb3d@kiq0a`Z{|!B|}e}Ww{Sp,^Z|0>_Z}36|]A|-t}lt{R6pi|v8hPu#{C>YOZHYmg/Z4nicK[}hF_Bg|YRZ7c|crkzYZY}_iXcZ.|)U|L5{R~qi^Uga@Y[xb}&qdbd6h5|Btw[}c<{Ds53[Y7]?Z<|e0{L[ZK]mXKZ#Z2^tavf0`PE[OSOaP`4gi`qjdYMgys/?[nc,}EEb,eL]g[n{E_b/vcvgb.{kcwi`~v%|0:|iK{Jh_vf5lb}KL|(oi=LrzhhY_^@`zgf[~g)[J_0fk_V{T)}I_{D&_/d9W/|MU[)f$xW}?$xr4<{Lb{y4}&u{XJ|cm{Iu{jQ}CMkD{CX|7A}G~{kt)nB|d5|<-}WJ}@||d@|Iy}Ts|iL|/^|no|0;}L6{Pm]7}$zf:|r2}?C_k{R(}-w|`G{Gy[g]bVje=_0|PT{^Y^yjtT[[[l!Ye_`ZN]@[n_)j3nEgMa]YtYpZy].d-Y_cjb~Y~[nc~sCi3|zg}B0}do{O^{|$`_|D{}U&|0+{J3|8*]iayx{a{xJ_9|,c{Ee]QXlYb]$[%YMc*]w[aafe]aVYi[fZEii[xq2YQZHg]Y~h#|Y:thre^@^|_F^CbTbG_1^qf7{L-`VFx Zr|@EZ;gkZ@slgko`[e}T:{Cu^pddZ_`yav^Ea+[#ZBbSbO`elQfLui}.F|txYcbQ`XehcGe~fc^RlV{D_0ZAej[l&jShxG[ipB_=u:eU}3e8[=j|{D(}dO{Do[BYUZ0/]AYE]ALYhZcYlYP/^-^{Yt_1_-;YT`P4BZG=IOZ&]H[e]YYd[9^F[1YdZxZ?Z{Z<]Ba2[5Yb[0Z4l?]d_;_)a?YGEYiYv`_XmZs4ZjY^Zb]6gqGaX^9Y}dXZr[g|]Y}K aFZp^k^F]M`^{O1Ys]ZCgCv4|E>}8eb7}l`{L5[Z_faQ|c2}Fj}hw^#|Ng|B||w2|Sh{v+[G}aB|MY}A{|8o}X~{E8paZ:]i^Njq]new)`-Z>haounWhN}c#{DfZ|fK]KqGZ=:u|fqoqcv}2ssm}.r{]{nIfV{JW)[K|,Z{Uxc|]l_KdCb%]cfobya3`p}G^|LZiSC]U|(X|kBlVg[kNo({O:g:|-N|qT}9?{MBiL}Sq{`P|3a|u.{Uaq:{_o|^S}jX{Fob0`;|#y_@[V[K|cw[<_ }KU|0F}d3|et{Q7{LuZttsmf^kYZ`Af`}$x}U`|Ww}d]| >}K,r&|XI|*e{C/a-bmr1fId4[;b>tQ_:]hk{b-pMge]gfpo.|(w[jgV{EC1Z,YhaY^q,_G[c_g[J0YX]`[h^hYK^_Yib,` {i6vf@YM^hdOKZZn(jgZ>bzSDc^Z%[[o9[2=/YHZ(_/Gu_`*|8z{DUZxYt^vuvZjhi^lc&gUd4|<UiA`z]$b/Z?l}YI^jaHxe|;F}l${sQ}5g}hA|e4}?o{ih}Uz{C)jPe4]H^J[Eg[|AMZMlc}:,{iz}#*|gc{Iq|/:|zK{l&}#u|myd{{M&v~nV};L|(g|I]ogddb0xsd7^V})$uQ{HzazsgxtsO^l}F>ZB]r|{7{j@cU^{{CbiYoHlng]f+nQ[bkTn/}<-d9q {KXadZYo+n|l[|lc}V2{[a{S4Zam~Za^`{HH{xx_SvF|ak=c^[v^7_rYT`ld@]:_ub%[$[m](Shu}G2{E.ZU_L_R{tz`vj(f?^}hswz}GdZ}{S:h`aD|?W|`dgG|if{a8|J1{N,}-Ao3{H#{mfsP|[ bzn+}_Q{MT{u4kHcj_q`eZj[8o0jy{p7}C|[}l){MuYY{|Ff!Ykn3{rT|m,^R|,R}$~Ykgx{P!]>iXh6[l[/}Jgcg{JYZ.^qYfYIZl[gZ#Xj[Pc7YyZD^+Yt;4;`e8YyZVbQ7YzZxXja.7SYl[s]2^/Ha$[6ZGYrb%XiYdf2]H]kZkZ*ZQ[ZYS^HZXcCc%Z|[(bVZ]]:OJQ_DZCg<[,]%Zaa [g{C00HY[c%[ChyZ,Z_`PbXa+eh`^&jPi0a[ggvhlekL]w{Yp^v}[e{~;k%a&k^|nR_z_Qng}[E}*Wq:{k^{FJZpXRhmh3^p>de^=_7`|ZbaAZtdhZ?n4ZL]u`9ZNc3g%[6b=e.ZVfC[ZZ^^^hD{E(9c(kyZ=bb|Sq{k`|vmr>izlH[u|e`}49}Y%}FT{[z{Rk}Bz{TCc/lMiAqkf(m$hDc;qooi[}^o:c^|Qm}a_{mrZ(pA`,}<2sY| adf_%|}`}Y5U;}/4|D>|$X{jw{C<|F.hK|*A{MRZ8Zsm?imZm_?brYWZrYx`yVZc3a@f?aK^ojEd {bN}/3ZH]/$YZhm^&j 9|(S|b]mF}UI{q&aM]LcrZ5^.|[j`T_V_Gak}9J[ ZCZD|^h{N9{~&[6Zd{}B}2O|cv]K}3s}Uy|l,fihW{EG`j_QOp~Z$F^zexS`dcISfhZBXP|.vn|_HYQ|)9|cr]<`&Z6]m_(ZhPcSg>`Z]5`~1`0Xcb4k1{O!bz|CN_T{LR|a/gFcD|j<{Z._[f)mPc:1`WtIaT1cgYkZOaVZOYFrEe[}T$}Ch}mk{K-^@]fH{Hdi`c*Z&|Kt{if[C{Q;{xYB`dYIX:ZB[}]*[{{p9|4GYRh2ao{DS|V+[zd$`F[ZXKadb*A] Ys]Maif~a/Z2bmclb8{Jro_rz|x9cHojbZ{GzZx_)]:{wAayeDlx}<=`g{H1{l#}9i|)=|lP{Qq}.({La|!Y{i2EZfp=c*}Cc{EDvVB|;g}2t{W4av^Bn=]ri,|y?|3+}T*ckZ*{Ffr5e%|sB{lx^0]eZb]9[SgAjS_D|uHZx]dive[c.YPkcq/}db{EQh&hQ|eg}G!ljil|BO]X{Qr_GkGl~YiYWu=c3eb}29v3|D|}4i||.{Mv})V{SP1{FX}CZW6{cm|vO{pS|e#}A~|1i}81|Mw}es|5[}3w{C`h9aL]o{}p[G`>i%a1Z@`Ln2bD[$_h`}ZOjhdTrH{[j_:k~kv[Sdu]CtL}41{I |[[{]Zp$]XjxjHt_eThoa#h>sSt8|gK|TVi[Y{t=}Bs|b7Zpr%{gt|Yo{CS[/{iteva|cf^hgn}($_c^wmb^Wm+|55jrbF|{9^ q6{C&c+ZKdJkq_xOYqZYSYXYl`8]-cxZAq/b%b*_Vsa[/Ybjac/OaGZ4fza|a)gY{P?| I|Y |,pi1n7}9bm9ad|=d{aV|2@[(}B`d&|Uz}B}{`q|/H|!JkM{FU|CB|.{}Az}#P|lk}K{|2rk7{^8^?`/|k>|Ka{Sq}Gz}io{DxZh[yK_#}9<{TRdgc]`~Z>JYmYJ]|`!ZKZ]gUcx|^E[rZCd`f9oQ[NcD_$ZlZ;Zr}mX|=!|$6ZPZYtIo%fj}CpcN|B,{VDw~gb}@hZg`Q{LcmA[(bo`<|@$|o1|Ss}9Z_}tC|G`{F/|9nd}i=}V-{L8aaeST]daRbujh^xlpq8|}zs4bj[S`J|]?G{P#{rD{]I`OlH{Hm]VYuSYUbRc*6[j`8]pZ[bt_/^Jc*[<Z?YE|Xb|?_Z^Vcas]h{t9|Uwd)_(=0^6Zb{Nc} E[qZAeX[a]P^|_J>e8`W^j_Y}R{{Jp__]Ee#e:iWb9q_wKbujrbR}CY`,{mJ}gz{Q^{t~N|? gSga`V_||:#mi}3t|/I`X{N*|ct|2g{km}gi|{={jC}F;|E}{ZZjYf*frmu}8Tdroi{T[|+~}HG{cJ}DM{Lp{Ctd&}$hi3|FZ| m}Kr|38}^c|m_|Tr{Qv|36}?Up>|;S{DV{k_as}BK{P}}9p|t`jR{sAm4{D=b4pWa[}Xi{EjwEkI}3S|E?u=X0{jf} S|NM|JC{qo^3cm]-|JUx/{Cj{s>{Crt[UXuv|D~|j|d{YXZR}Aq}0r}(_{pJfi_z}0b|-vi)Z mFe,{f4|q`b{}^Z{HM{rbeHZ|^x_o|XM|L%|uFXm}@C_{{Hhp%a7|0p[Xp+^K}9U{bP}: tT}B|}+$|b2|[^|~h{FAby[`{}xgygrt~h1[li`c4vz|,7p~b(|mviN}^pg[{N/|g3|^0c,gE|f%|7N{q[|tc|TKA{LU}I@|AZp(}G-sz{F |qZ{}F|f-}RGn6{Z]_5})B}UJ{FFb2]4ZI@v=k,]t_Dg5Bj]Z-]L]vrpdvdGlk|gF}G]|IW}Y0[G| /bo|Te^,_B}#n^^{QHYI[?hxg{[`]D^IYRYTb&kJ[cri[g_9]Ud~^_]<p@_e_XdNm-^/|5)|h_{J;{kacVopf!q;asqd}n)|.m|bf{QW|U)}b+{tL|w``N|to{t ZO|T]jF}CB|0Q{e5Zw|k |We}5:{HO{tPwf_uajjBfX}-V_C_{{r~gg|Ude;s+}KNXH}! `K}eW{Upwbk%ogaW}9EYN}YY|&v|SL{C3[5s.]Y]I]u{M6{pYZ`^,`ZbCYR[1mNg>rsk0Ym[jrE]RYiZTr*YJ{Ge|%-lf|y(`=[t}E6{k!|3)}Zk} ][G{E~cF{u3U.rJ|a9p#o#ZE|?|{sYc#vv{E=|LC}cu{N8`/`3`9rt[4|He{cq|iSYxY`}V |(Q|t4{C?]k_Vlvk)BZ^r<{CL}#h}R+[<|i=}X|{KAo]|W<`K{NW|Zx}#;|fe{IMr<|K~tJ_x}AyLZ?{GvbLnRgN}X&{H7|x~}Jm{]-| GpNu0}.ok>|c4{PYisrDZ|fwh9|hfo@{H~XSbO]Odv]%`N]b1Y]]|eIZ}_-ZA]aj,>eFn+j[aQ_+]h[J_m_g]%_wf.`%k1e#Z?{CvYu_B^|gk`Xfh^M3`afGZ-Z|[m{L}|k3cp[it ^>YUi~d>{T*}YJ{Q5{Jxa$hg|%4`}|LAgvb }G}{P=|<;Ux{_skR{cV|-*|s-{Mp|XP|$G|_J}c6cM{_=_D|*9^$ec{V;|4S{qO|w_|.7}d0|/D}e}|0G{Dq]Kdp{}dfDi>}B%{Gd|nl}lf{C-{y}|ANZr}#={T~|-(}c&{pI|ft{lsVP}){|@u}!W|bcmB{d?|iW|:dxj{PSkO|Hl]Li:}VYk@|2={fnWt{M3`cZ6|)}|Xj}BYa?vo{e4|L7|B7{L7|1W|lvYO}W8nJ|$Vih|{T{d*_1|:-n2dblk``fT{Ky|-%}m!|Xy|-a{Pz}[l{kFjz|iH}9N{WE{x,|jz}R {P|{D)c=nX|Kq|si}Ge{sh|[X{RF{t`|jsr*fYf,rK|/9}$}}Nf{y!1|<Std}4Wez{W${Fd_/^O[ooqaw_z[L`Nbv[;l7V[ii3_PeM}.h^viqYjZ*j1}+3{bt{DR[;UG}3Og,rS{JO{qw{d<_zbAh<R[1_r`iZTbv^^a}c{iEgQZ<exZFg.^Rb+`Uj{a+{z<[~r!]`[[|rZYR|?F|qppp]L|-d|}K}YZUM|=Y|ktm*}F]{D;g{uI|7kg^}%?Z%ca{N[_<q4xC]i|PqZC]n}.bDrnh0Wq{tr|OMn6tM|!6|T`{O`|>!]ji+]_bTeU}Tq|ds}n|{Gm{z,f)}&s{DPYJ`%{CGd5v4tvb*hUh~bf]z`jajiFqAii]bfy^U{Or|m+{I)cS|.9k:e3`^|xN}@Dnlis`B|Qo{`W|>||kA}Y}{ERYuYx`%[exd`]|OyiHtb}HofUYbFo![5|+]gD{NIZR|Go}.T{rh^4]S|C9_}xO^i`vfQ}C)bK{TL}cQ|79iu}9a];sj{P.o!f[Y]pM``Jda^Wc9ZarteBZClxtM{LW}l9|a.mU}KX}4@{I+f1}37|8u}9c|v${xGlz}jP{Dd1}e:}31}%3X$|22i<v+r@~mf{sN{C67G97855F4YL5}8f{DT|xy{sO{DXB334@55J1)4.G9A#JDYtXTYM4, YQD9;XbXm9SX]IB^4UN=Xn<5(;(F3YW@XkH-X_VM[DYM:5XP!T&Y`6|,^{IS-*D.H>:LXjYQ0I3XhAF:9:(==.F*3F1189K/7163D,:@|e2{LS36D4hq{Lw/84443@4.933:0307::6D7}&l{Mx657;89;,K5678H&93D(H<&<>0B90X^I;}Ag1{P%3A+>><975}[S{PZE453?4|T2{Q+5187;>447:81{C=hL6{Me^:=7ii{R=.=F<81;48?|h8}Uh{SE|,VxL{ST,7?9Y_5Xk3A#:$%YSYdXeKXOD8+TXh7(@>(YdXYHXl9J6X_5IXaL0N?3YK7Xh!1?XgYz9YEXhXaYPXhC3X`-YLY_XfVf[EGXZ5L8BXL9YHX]SYTXjLXdJ: YcXbQXg1PX]Yx4|Jr{Ys4.8YU+XIY`0N,<H%-H;:0@,74/:8546I=9177154870UC]d<C3HXl7ALYzXFXWP<<?E!88E5@03YYXJ?YJ@6YxX-YdXhYG|9o{`iXjY_>YVXe>AYFX[/(I@0841?):-B=14337:8=|14{c&93788|di{cW-0>0<097/A;N{FqYpugAFT%X/Yo3Yn,#=XlCYHYNX[Xk3YN:YRT4?)-YH%A5XlYF3C1=NWyY}>:74-C673<69545v {iT85YED=64=.F4..9878/D4378?48B3:7:7/1VX[f4{D,{l<5E75{dAbRB-8-@+;DBF/$ZfW8S<4YhXA.(5@*11YV8./S95C/0R-A4AXQYI7?68167B95HA1*<M3?1/@;/=54XbYP36}lc{qzSS38:19?,/39193574/66878Yw1X-87E6=;964X`T734:>86>1/=0;(I-1::7ALYGXhF+Xk[@W%TYbX7)KXdYEXi,H-XhYMRXfYK?XgXj.9HX_SX]YL1XmYJ>Y}WwIXiI-3-GXcYyXUYJ$X`Vs[7;XnYEZ;XF! 3;%8;PXX(N3Y[)Xi1YE&/ :;74YQ6X`33C;-(>Xm0(TYF/!YGXg8 9L5P01YPXO-5%C|qd{{/K/E6,=0144:361:955;6443@?B7*7:F89&F35YaX-CYf,XiFYRXE_e{}sF 0*7XRYPYfXa5YXXY8Xf8Y~XmA[9VjYj*#YMXIYOXk,HHX40YxYMXU8OXe;YFXLYuPXP?EB[QV0CXfY{:9XV[FWE0D6X^YVP*$4%OXiYQ(|xp|%c3{}V`1>Y`XH00:8/M6XhQ1:;3414|TE|&o@1*=81G8<3}6<|(f6>>>5-5:8;093B^3U*+*^*UT30XgYU&7*O1953)5@E78--F7YF*B&0:%P68W9Zn5974J9::3}Vk|-,C)=)1AJ4+<3YGXfY[XQXmT1M-XcYTYZXCYZXEYXXMYN,17>XIG*SaS|/eYJXbI?XdNZ+WRYP<F:R PXf;0Xg`$|1GX9YdXjLYxWX!ZIXGYaXNYm6X9YMX?9EXmZ&XZ#XQ>YeXRXfAY[4 ;0X!Zz0XdN$XhYL XIY^XGNXUYS/1YFXhYk.TXn4DXjB{jg|4DEX]:XcZMW=A.+QYL<LKXc[vV$+&PX*Z3XMYIXUQ:ZvW< YSXFZ,XBYeXMM)?Xa XiZ4/EXcP3%}&-|6~:1(-+YT$@XIYRBC<}&,|7aJ6}bp|8)K1|Xg|8C}[T|8Q.89;-964I38361<=/;883651467<7:>?1:.}le|:Z=39;1Y^)?:J=?XfLXbXi=Q0YVYOXaXiLXmJXO5?.SFXiCYW}-;|=u&D-X`N0X^,YzYRXO(QX_YW9`I|>hZ:N&X)DQXP@YH#XmNXi$YWX^=!G6YbYdX>XjY|XlX^XdYkX>YnXUXPYF)FXT[EVTMYmYJXmYSXmNXi#GXmT3X8HOX[ZiXN]IU2>8YdX1YbX<YfWuZ8XSXcZU%0;1XnXkZ_WTG,XZYX5YSX Yp 05G?XcYW(IXg6K/XlYP4XnI @XnO1W4Zp-9C@%QDYX+OYeX9>--YSXkD.YR%Q/Yo YUX].Xi<HYEZ2WdCE6YMXa7F)=,D>-@9/8@5=?7164;35387?N<618=6>7D+C50<6B03J0{Hj|N9$D,9I-,.KB3}m |NzE0::/81YqXjMXl7YG; [.W=Z0X4XQY]:MXiR,XgM?9$9>:?E;YE77VS[Y564760391?14941:0=:8B:;/1DXjFA-564=0B3XlH1+D85:0Q!B#:-6&N/:9<-R3/7Xn<*3J4.H:+334B.=>30H.;3833/76464665755:/83H6633:=;.>5645}&E|Y)?1/YG-,93&N3AE@5 <L1-G/8A0D858/30>8<549=@B8] V0[uVQYlXeD(P#ID&7T&7;Xi0;7T-$YE)E=1:E1GR):--0YI7=E<}n9|aT6783A>D7&4YG7=391W;Zx<5+>F#J39}o/|cc;6=A050EQXg8A1-}D-|d^5548083563695D?-.YOXd37I$@LYLWeYlX<Yd+YR A$;3-4YQ-9XmA0!9/XLY_YT(=5XdDI>YJ5XP1ZAW{9>X_6R(XhYO65&J%DA)C-!B:97#A9;@?F;&;(9=11/=657/H,<8}bz|j^5446>.L+&Y^8Xb6?(CYOXb*YF(8X`FYR(XPYVXmPQ%&DD(XmZXW??YOXZXfCYJ79,O)XnYF7K0!QXmXi4IYFRXS,6<%-:YO(+:-3Q!1E1:W,Zo}Am|n~;3580534*?3Zc4=9334361693:30C<6/717:<1/;>59&:4}6!|rS36=1?75<8}[B|s809983579I.A.>84758=108564741H*9E{L{|u%YQ<%6XfH.YUXe4YL@,>N}Tv|ve*G0X)Z;/)3@A74(4P&A1X:YVH97;,754*A66:1 D739E3553545558E4?-?K17/770843XAYf838A7K%N!YW4.$T19Z`WJ*0XdYJXTYOXNZ 1XaN1A+I&Xi.Xk3Z3GB&5%WhZ1+5#Y[X<4YMXhQYoQXVXbYQ8XSYUX4YXBXWDMG0WxZA[8V+Z8X;D],Va$%YeX?FXfX[XeYf<X:Z[WsYz8X_Y]%XmQ(!7BXIZFX]&YE3F$(1XgYgYE& +[+W!<YMYFXc;+PXCYI9YrWxGXY9DY[!GXiI7::)OC;*$.>N*HA@{C|}&k=:<TB83X`3YL+G4XiK]i}(fYK<=5$.FYE%4*5*H*6XkCYL=*6Xi6!Yi1KXR4YHXbC8Xj,B9ZbWx/XbYON#5B}Ue}+QKXnF1&YV5XmYQ0!*3IXBYb71?1B75XmF;0B976;H/RXU:YZX;BG-NXj;XjI>A#D3B636N;,*%<D:0;YRXY973H5)-4FXOYf0:0;/7759774;7;:/855:543L43<?6=E,.A4:C=L)%4YV!1(YE/4YF+ F3%;S;&JC:%/?YEXJ4GXf/YS-EXEYW,9;E}X$}547EXiK=51-?71C%?57;5>463553Zg90;6447?<>4:9.7538XgN{|!}9K/E&3-:D+YE1)YE/3;37/:05}n<}:UX8Yj4Yt864@JYK..G=.(A Q3%6K>3(P3#AYE$-6H/456*C=.XHY[#S.<780191;057C)=6HXj?955B:K1 E>-B/9,;5.!L?:0>/.@//:;7833YZ56<4:YE=/:7Z_WGC%3I6>XkC*&NA16X=Yz2$X:Y^&J48<99k8}CyB-61<18K946YO4{|N}E)YIB9K0L>4=46<1K0+R;6-=1883:478;4,S+3YJX`GJXh.Yp+Xm6MXcYpX(>7Yo,/:X=Z;Xi0YTYHXjYmXiXj;*;I-8S6N#XgY}.3XfYGO3C/$XjL$*NYX,1 6;YH&<XkK9C#I74.>}Hd`A748X[T450[n75<4439:18A107>|ET}Rf<1;14876/Yb983E<5.YNXd4149>,S=/4E/<306443G/06}0&}UkYSXFYF=44=-5095=88;63844,9E6644{PL}WA8:>)7+>763>>0/B3A545CCnT}Xm|dv}Xq1L/YNXk/H8;;.R63351YY747@15YE4J8;46;.38.>4A369.=-83,;Ye3?:3@YE.4-+N353;/;@(X[YYD>@/05-I*@.:551741Yf5>6A443<3535;.58/86=D4753442$635D1>0359NQ @73:3:>><Xn?;43C14 ?Y|X611YG1&<+,4<*,YLXl<1/AIXjF*N89A4Z576K1XbJ5YF.ZOWN.YGXO/YQ01:4G38Xl1;KI0YFXB=R<7;D/,/4>;$I,YGXm94@O35Yz66695385.>:6A#5}W7n^4336:4157597434433<3|XA}m`>=D>:4A.337370?-6Q96{`E|4A}C`|Qs{Mk|J+~r>|o,wHv>Vw}!c{H!|Gb|*Ca5}J||,U{t+{CN[!M65YXOY_*B,Y[Z9XaX[QYJYLXPYuZ%XcZ8LY[SYPYKZM<LMYG9OYqSQYM~[e{UJXmQYyZM_)>YjN1~[f3{aXFY|Yk:48YdH^NZ0|T){jVFYTZNFY^YTYN~[h{nPYMYn3I]`EYUYsYIZEYJ7Yw)YnXPQYH+Z.ZAZY]^Z1Y`YSZFZyGYHXLYG 8Yd#4~[i|+)YH9D?Y^F~Y7|-eYxZ^WHYdYfZQ~[j|3>~[k|3oYmYqY^XYYO=Z*4[]Z/OYLXhZ1YLZIXgYIHYEYK,<Y`YEXIGZI[3YOYcB4SZ!YHZ*&Y{Xi3~[l|JSY`Zz?Z,~[m|O=Yi>??XnYWXmYS617YVYIHZ(Z4[~L4/=~[n|Yu{P)|];YOHHZ}~[o33|a>~[r|aE]DH~[s|e$Zz~[t|kZFY~XhYXZB[`Y}~[u|{SZ&OYkYQYuZ2Zf8D~[v}% ~[w3},Q[X]+YGYeYPIS~[y}4aZ!YN^!6PZ*~[z}?E~[{3}CnZ=~[}}EdDZz/9A3(3S<,YR8.D=*XgYPYcXN3Z5 4)~[~}JW=$Yu.XX~] }KDX`PXdZ4XfYpTJLY[F5]X~[2Yp}U+DZJ::<446[m@~]#3}]1~]%}^LZwZQ5Z`/OT<Yh^ -~]&}jx[ ~m<z!%2+~ly4VY-~o>}p62yz!%2+Xf2+~ly4VY-zQ`z (=] 2z~o2",C={" ":0,"!":1},c=34,i=2,p,s=[],u=String.fromCharCode,t=u(12539);while(++c<127)C[u(c)]=c^39&&c^92?i++:0;i=0;while(0<=(c=C[a.charAt(i++)]))if(16==c)if((c=C[a.charAt(i++)])<87){if(86==c)c=1879;while(c--)s.push(u(++p))}else s.push(s.join("").substr(8272,360));else if(c<86)s.push(u(p+=c<51?c-16:(c-55)*92+C[a.charAt(i++)]));else if((c=((c-86)*92+C[a.charAt(i++)])*92+C[a.charAt(i++)])<49152)s.push(u(p=c<40960?c:c|57344));else{c&=511;while(c--)s.push(t);p=12539}return s.join("")')();

	JCT8836=JCT11280.substring(0,8836);

//============================引用ここまで===================================

}catch(e){
	GM_log("AKiller_ecl:" + e);
}


}//-------------ecl()ここまで--------------------




//設定メニュー機能 -----------------------------------------------
var menu = {
	//入力チェック関数
	numCheckFunc: function numCheck(t){
		t.value = t.value.replace(/[^0-9\.]+/gi,"").replace(/\.(.*?\.)/gi,"$1");
	},
	nullCheckFunc: function nullCheck(t){
		if(t.value == '') t.value = 0;
	},
	mosaicSizeCheckFunc: function mosaicSizeCheck(t){
		var v = t.value;
		if(v > 1) v = 1;
		else if(0.05 > v) v = 0.05;
		t.value = v;
	},
	showToggleFunc: function showToggle(c,k){
		var t = document.getElementById('cfgTable');
		if(!c) t.setAttribute(k,'');
		else t.removeAttribute(k);
	},
	loadedFirstFunc: function loadedFirst() {
		var st = function(){
			var chArr= ['moveForm','thumb','mosaic','aaFont'];
			chArr.forEach(function(catName){
				var obj = document.getElementById(catName + 'Flg');
				if(obj) showToggle(obj.checked,catName + 'Kids');
			});
		};
		setTimeout(st,300);
		setTimeout(function(){
			var rBtn = document.getElementById('resetConfig');
			rBtn.addEventListener('click',function(){
				setTimeout(st,100);
			},false);
		},400);
	},
	changeCatFunc: function changeCat(id){
		var t = document.getElementById('cfgTable');
		t.setAttribute('cateFlg',id);
	},
	userConfig: function(){
		var options = GM_option.get();


		var delTrash = function(checkArray){
			var retArray=[];
			for(var i=0,j=checkArray.length;i<j;i++){
				if(checkArray[i].match(/^( +|)$/)) continue;
				retArray.push(checkArray[i]);
			}
			return retArray;
		};

		config.nameran =  options['nameran'];
		config.mailran = options['mailran'];
		config.commentran = options['commentran'];
		config.moveFormFlg = options['moveFormFlg'];
		config.commentR = options['commentR'];
		config.commentB = options['commentB'];
		config.formSize = options['formSize'];

		config.redmonkey = options['redmonkey'];
		config.anchored = options['anchored'];
		config.redAnchored = options['redAnchored'];
		config.accessView = options['accessView'];

		config.NGWord = options['NGWord'].split('\n');
		config.NGWord = delTrash(config.NGWord);
		config.abonShowFlg = options['abonShowFlg'];
		if(config.abonShowFlg == 'true') config.abonShowFlg = true;
		else config.abonShowFlg = false;
		config.DeleteWord = options['DeleteWord'].split('\n');
		config.DeleteWord = delTrash(config.DeleteWord);
		config.reverseFlg = options['reverseFlg'];

		config.popIDType = options['popIDType'];
		config.popResType = options['popResType'];
		config.popResAbonType = options['popResAbonType'];
		config.popupTimeout = options['popupTimeout'];

		config.menuFlg = options['menuFlg'];
		config.delKidoku = options['delKidoku'];

		config.thumbFlg = options['thumbFlg'];
		config.thumbnailSize = options['thumbnailSize'];
		config.mosaicFlg = options['mosaicFlg'];
		config.mosaicSize = options['mosaicSize'];

		config.bgColor = options['bgColor'];
		config.newColor = options['newColor'];
		config.oldColor = options['oldColor'];
		config.dtBg = options['dtBg'];
		config.mailColor = options['mailColor'];
		config.timeColor = options['timeColor'];
		config.dtColor = options['dtColor'];
		config.ddBg = options['ddBg'];
		config.ddColor = options['ddColor'];
		config.popBg = options['popBg'];
		config.aaFontFlg = options['aaFontFlg'];
		config.aaFontSize = options['aaFontSize'];
		config.aaFont = options['aaFont'].split('\n');
		config.aaFont = delTrash(config.aaFont);

		main.initSet();

	},
	msgArray: {
		'save':'保存しますか？(リロードします)',
		'reset':'前回のセーブデータを読み込みますか？(この変更はセーブするまで保存されません)',
		'clear':'セーブデータを消去しますか？(リロードします)',
	},
}


//head
var strHeader = [
	'<style id ="cfgCSS" type="text/css">',
	'#cfgTable{ border: solid #ccc 1px; border-spacing:0; border-radius:6px 6px 0 0; -webkit-border-radius:6px 6px 0 0; box-shadow: 0 1px 1px #ccc; -webkit-box-shadow: 0 1px 1px #ccc; }',
	'#cfgTable .cfgKids tr:hover:not(.category):not(.tableLabel){ transition: all 0.1s ease-in-out; background:#fbf8e9; -webkit-transition: all 0.1s ease-in-out; }',
	'#cfgTable .cfgKids th, #cfgTable .cfgKids td{ border-left: 1px solid #ccc; border-top: 1px solid #ccc; vertical-align: top; white-space: nowrap; padding: 3px; }',
	'#cfgTable .cfgKids tr:first-child{ color: #151; background: #E3F6E7;}',
	'#cfgTable .category{ color: #151; background:#cfc;}',
	'#cfgTitle, #cfgTable thead th:first-child, #cfgTable .cfgKids td:first-child ,#catForm .tableLabel th:first-child{ border-left: none;}',
	'#cfgTable thead tr:first-child th:first-child{ border-top: none; color: #151; border-bottom: 3px solid #036; background: #A0D0A0; padding: 6px; }',
	'#cfgTable label{ padding:1px 5px 2px 5px; }',
	'#cfgTable label:hover{ background:#ada; }',
	'.inputSix{width:50px;}',
	'TEXTAREA{min-height:70px;min-width:500px;}',
	'.categoryMenu{ background:lightgray; display:inline-block; border:1px solid  gray; padding: 2px 5px 2px 5px; font-size: smaller;}',
	'.categoryMenu:hover{ background: lightpink; }',

	'#cfgTable[cateFlg="cat1"] #cat1,',
	'#cfgTable[cateFlg="cat2"] #cat2,',
	'#cfgTable[cateFlg="cat3"] #cat3,',
	'#cfgTable[cateFlg="cat4"] #cat4,',
	'#cfgTable[cateFlg="cat5"] #cat5,',
	'#cfgTable[cateFlg="cat6"] #cat6,',
	'#cfgTable[cateFlg="cat7"] #cat7{',
		' background: lightsalmon;',
	'}',

	'#cfgTable:not([cateFlg="cat1"]) #catForm,',
	'#cfgTable:not([cateFlg="cat2"]) #catTitle,',
	'#cfgTable:not([cateFlg="cat3"]) #catRes,',
	'#cfgTable:not([cateFlg="cat4"]) #catPop,',
	'#cfgTable:not([cateFlg="cat5"]) #catThumb,',
	'#cfgTable:not([cateFlg="cat6"]) #catDesign,',
	'#cfgTable:not([cateFlg="cat7"]) #catMenu{',
		'display:none;',
	'}',

	'#cfgTable[moveFormKids] .moveFormKids{display:none;}',
	'#cfgTable[thumbKids] .thumbKids,#cfgTable[thumbKids] .mosaicKids{display:none;}',
	'#cfgTable[mosaicKids] .mosaicKids{display:none;}',
	'#cfgTable[aaFontKids] .aaFontKids{display:none;}',
	'</style>',
	'<script>',
	'window.onload = loadedFirst();',
	menu.loadedFirstFunc.toString(),
	menu.numCheckFunc.toString(),
	menu.nullCheckFunc.toString(),
	menu.mosaicSizeCheckFunc.toString(),
	menu.showToggleFunc.toString(),
	menu.changeCatFunc.toString(),
	'</script>',
].join('');
//body
var setHTML = [
'<table id="cfgTable" align="center" cateFlg="cat1">',
 '<thead>',
 '<tr>',
  '<th id="cfgTitle" colspan=2>Simple2chViewer</th>',
 '</tr>',
 '<tr id="categoryAll">',
  '<td colspan=2>',
   '<span id="cat1" class="categoryMenu" onclick="changeCat(this.id)">投稿フォーム</span>',
   '<span id="cat2" class="categoryMenu" onclick="changeCat(this.id)">レスタイトル関連</span>',
   '<span id="cat3" class="categoryMenu" onclick="changeCat(this.id)">レス内容(タイトル含む)</span>',
   '<span id="cat4" class="categoryMenu" onclick="changeCat(this.id)">ポップアップ関連</span>',
   '<span id="cat5" class="categoryMenu" onclick="changeCat(this.id)">画像のサムネ関係</span>',
   '<span id="cat6" class="categoryMenu" onclick="changeCat(this.id)">外観変更</span>',
   '<span id="cat7" class="categoryMenu" onclick="changeCat(this.id)">その他</span>',
  '</td>',
 '</tr>',
 '</thead>',
 '<tbody>',

 '<tr id="catForm"><td colspan=2><table class="cfgKids" style="width:100%;">',
 '<tr class="tableLabel">',
  '<th>Settings</th><th>Select</th>',
 '</tr>',
 '<tr class="category">',
  '<th colspan=2 align="center">投稿フォーム</th>',
 '</tr>',
 '<tr title="「初期化停止」指定でcookieに保存されたデータ使用">',
  '<td>名前欄初期値</td>',
  '<td><input type="text" name="nameran" value="' + config.nameran + '" /></td>',
 '</tr>',
 '<tr title="「初期化停止」指定でcookieに保存されたデータ使用">',
  '<td>メール欄初期値</td>',
  '<td><input type="text" name="mailran" value="' + config.mailran + '" /></td>',
 '</tr>',
 '<tr title="「初期化停止」指定でcookieに保存されたデータ使用">',
  '<td>コメント欄初期値</td>',
  '<td>',
   '<textarea name="commentran">' + config.commentran + '</textarea>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>投稿フォームを可動式化</td>',
  '<td>',
   '<input type="checkbox" id="moveFormFlg" name="moveFormFlg" onChange="showToggle(this.checked,\'moveFormKids\')" checked />',
   '<label for="moveFormFlg">投稿フォームを画面に追随させます(新着チェック機能含む)</label>',
  '</td>',
 '</tr>',
 '<tr class="moveFormKids" title="コメント欄を可変にする場合の初期位置">',
  '<td>┣コメント欄初期位置</td>',
  '<td>',
   '右から <input type="text" name="commentR" class="inputSix" value="' + config.commentR + '" onChange="numCheck(this);" onkeyup="numCheck(this);" onblur="nullCheck(this)" />px 下から <input type="text" name="commentB" class="inputSix" value="' + config.commentB + '" onChange="numCheck(this);" onkeyup="numCheck(this);" onblur="nullCheck(this)" />px',
  '</td>',
 '</tr>',
 '<tr class="moveFormKids" title="コメント欄を可変にする場合の初期状態\rnomal:開いた状態  small:閉じた状態">',
  '<td>┗投稿フォームの初期状態</td>',
  '<td>',
   '<input type="radio" id="formSmall" name="formSize" value="small" checked />',
   '<label for="formSmall">small</label>',
   '<input type="radio" id="formNormal" name="formSize" value="normal" />',
   '<label for="formNormal">normal</label>',
  '</td>',
 '</tr>',
 '</table></td></tr>',

 '<tr id="catTitle"><td colspan=2><table class="cfgKids" style="width:100%;">',
 '<tr class="tableLabel">',
  '<th>Settings</th><th>Select</th>',
 '</tr>',
 '<tr class="category">',
  '<th colspan=2 align="center">レスタイトル関連</th>',
 '</tr>',
 '<tr>',
  '<td>真っ赤発言ID</td>',
  '<td>初期：5回以上。0で無効<input type="text" name="redmonkey" class="inputSix" value="' + config.redmonkey + '" onChange="numCheck(this);" onkeyup="numCheck(this);" onblur="nullCheck(this)" /></td>',
 '</tr>',
 '<tr>',
  '<td>被アンカーレス番号</td>',
  '<td>初期：被アンカー1件以上<input type="text" name="anchored" class="inputSix" value="' + config.anchored + '" onChange="numCheck(this);" onkeyup="numCheck(this);" onblur="nullCheck(this)" /></td>',
 '</tr>',
 '<tr>',
  '<td>真っ赤レス番号</td>',
  '<td>初期：被アンカー3回以上。0で無効<input type="text" name="redAnchored" class="inputSix" value="' + config.redAnchored + '" onChange="numCheck(this);" onkeyup="numCheck(this);" onblur="nullCheck(this)" /></td>',
 '</tr>',
 '<tr title="わかる場合のみ">',
  '<td>書き込み端末表示</td>',
  '<td>',
   '<input type="checkbox" id="accessView" name="accessView" checked />',
   '<label for="accessView">IDの右側に追加(例 ID:XXXXXXXX[9/9] (携帯))</label>',
  '</td>',
 '</tr>',
 '</table></td></tr>',

 '<tr id="catRes"><td colspan=2><table class="cfgKids" style="width:100%;">',
 '<tr class="tableLabel">',
  '<th>Settings</th><th>Select</th>',
 '</tr>',
 '<tr class="category">',
  '<th colspan=2 align="center">レス内容(タイトル含む)</th>',
 '</tr>',
 '<tr title="あぼーん機能。複数の場合は改行。\r正規表現も可(※ただし指定をミスると表示がおかしくなるので注意)">',
  '<td>NGワード登録<br>(ID指定も可能)</td>',
  '<td>',
   '<textarea name="NGWord">/ttps?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+\.exe(\\n|<| )/\r逝ってよし\r</textarea>',
  '</td>',
 '</tr>',
 '<tr title="あぼーんレス自体を非表示">',
  '<td>あぼーん表示方法</td>',
  '<td>',
   '<input type="radio" id="abonShowFlgShow" name="abonShowFlg" value="true" checked />',
   '<label for="abonShowFlgShow">表示(レス本文をあぼーん)</label>',
   '<input type="radio" id="abonShowFlgHide" name="abonShowFlg" value="false" />',
   '<label for="abonShowFlgHide">非表示(透明あぼーん)</label>',
  '</td>',
 '</tr>',
 '<tr title="複数の場合は改行。\r正規表現も可(※ただし指定をミスると表示がおかしくなるので注意)">',
  '<td>文字消去</td>',
  '<td>',
   '<textarea name="DeleteWord">/転載禁止\\\(.{5}\\\)/\r転載禁止(´・ω・｀)\r</textarea>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>レスの並び順を逆にする</td>',
  '<td>',
   '<input type="checkbox" id="reverseFlg" name="reverseFlg" />',
   '<label for="reverseFlg">最新レスから降順</label>',
  '</td>',
 '</tr>',
 '</table></td></tr>',

 '<tr id="catPop"><td colspan=2><table class="cfgKids" style="width:100%;">',
 '<tr class="tableLabel">',
  '<th>Settings</th><th>Select</th>',
 '</tr>',
 '<tr class="category">',
  '<th colspan=2 align="center">ポップアップ関連</th>',
 '</tr>',
 '<tr>',
  '<td>IDポップアップ方式</td>',
  '<td>',
   '<input type="radio" id="popIDTypeClick" name="popIDType" value="click" checked />',
   '<label for="popIDTypeClick">クリック</label>',
   '<input type="radio" id="popIDTypeMouseover" name="popIDType" value="mouseover" />',
   '<label for="popIDTypeMouseover">マウスオーバー</label>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>レスポップアップ方式</td>',
  '<td>',
   '<input type="radio" id="popResTypeClick" name="popResType" value="click" />',
   '<label for="popResTypeClick">クリック</label>',
   '<input type="radio" id="popResTypeMouseover" name="popResType" value="mouseover" checked />',
   '<label for="popResTypeMouseover">マウスオーバー</label>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>あぼーんポップアップ方式</td>',
  '<td>',
   '<input type="radio" id="popResAbonTypeClick" name="popResAbonType" value="click" checked />',
   '<label for="popResAbonTypeClick">クリック</label>',
   '<input type="radio" id="popResAbonTypeMouseover" name="popResAbonType" value="mouseover" />',
   '<label for="popResAbonTypeMouseover">マウスオーバー</label>',
  '</td>',
 '</tr>',
 '<tr title="マウスがポップアップを離れてから消えるまでの時間。\r時間内に再びマウスオーバーするとカウントリセット">',
  '<td>ポップアップ非表示ディレイ</td>',
  '<td><input type="text" name="popupTimeout" class="inputSix" value="' + config.popupTimeout + '" onChange="numCheck(this);" onkeyup="numCheck(this);" onblur="nullCheck(this)" />ミリ秒(1000で1秒)</td>',
 '</tr>',
 '</table></td></tr>',

 '<tr id="catMenu"><td colspan=2><table class="cfgKids" style="width:100%;">',
 '<tr class="tableLabel">',
  '<th>Settings</th><th>Select</th>',
 '</tr>',
 '<tr class="category">',
  '<th colspan=2 align="center">右クリック拡張</th>',
 '</tr>',
 '<tr>',
  '<td>レスコピー機能</td>',
  '<td>',
   '<input type="checkbox" id="menuFlg" name="menuFlg" checked />',
   '<label for="menuFlg">右クリックメニューにレスコピー機能などを追加する</label>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>既読履歴削除</td>',
  '<td><input type="text" name="delKidoku" class="inputSix" value="' + config.delKidoku + '" onChange="numCheck(this);" onkeyup="numCheck(this);" onblur="nullCheck(this)" />日以上古い履歴削除</td>',
 '</tr>',

 '</table></td></tr>',

 '<tr id="catThumb"><td colspan=2><table class="cfgKids" style="width:100%;">',
 '<tr class="tableLabel">',
  '<th>Settings</th><th>Select</th>',
 '</tr>',
 '<tr class="category">',
  '<th colspan=2 align="center">画像のサムネ関係</th>',
 '</tr>',
 '<tr>',
  '<td>画像のサムネ表示</td>',
  '<td>',
   '<input type="checkbox" id="thumbFlg" name="thumbFlg" onChange="showToggle(this.checked,\'thumbKids\')" checked />',
   '<label for="thumbFlg">画像URLの場合サムネ画像を追加する</label>',
  '</td>',
 '</tr>',
 '<tr class="thumbKids">',
  '<td>┣記号サムネサイズ(横幅)</td>',
  '<td><input type="text" name="thumbnailSize" value="' + config.thumbnailSize + '" onChange="numCheck(this);" onkeyup="numCheck(this);" />px</td>',
 '</tr>',
 '<tr class="thumbKids" title="クリックで元の画像に戻る。再度クリックでまたモザイクになる。">',
  '<td>┗サムネモザイク</td>',
  '<td>',
   '<input type="checkbox" id="mosaicFlg" name="mosaicFlg" onChange="showToggle(this.checked,\'mosaicKids\')" checked />',
   '<label for="mosaicFlg">サムネにモザイクをかける</label>',
  '</td>',
 '</tr>',
 '<tr class="mosaicKids" title="1に近づくほど細かくなっていく">',
  '<td>　┗モザイクのブロックサイズ</td>',
  '<td>範囲(0.05～1.0)<input type="text" name="mosaicSize" class="inputSix" value="' + config.mosaicSize + '" onChange="numCheck(this);" onkeyup="numCheck(this);" onblur="mosaicSizeCheck(this);" /></td>',
 '</tr>',
 '</table></td></tr>',

 '<tr id="catDesign"><td colspan=2><table class="cfgKids" style="width:100%;">',
 '<tr class="tableLabel">',
  '<th>Settings</th><th>Select</th>',
 '</tr>',
 '<tr class="category">',
  '<th colspan=2 align="center">外観変更</th>',
 '</tr>',
 '<tr title="RGB指定など。例：#CCFFFF">',
  '<td>背景色</td>',
  '<td><input type="text" name="bgColor" value="' + config.bgColor + '" /></td>',
 '</tr>',
 '<tr title="noneで透過">',
  '<td>新着背景</td>',
  '<td><input type="text" name="newColor" value="' + config.newColor + '" /></td>',
 '</tr>',
 '<tr title="noneで透過">',
  '<td>既読背景</td>',
  '<td><input type="text" name="oldColor" value="' + config.oldColor + '" /></td>',
 '</tr>',
 '<tr title="RGB指定など。例：#CCFFFF">',
  '<td>レスタイトル背景</td>',
  '<td><input type="text" name="dtBg" value="' + config.dtBg + '" /></td>',
 '</tr>',
 '<tr title="RGB指定など。例：#CCFFFF">',
  '<td>メール文字色</td>',
  '<td><input type="text" name="mailColor" value="' + config.mailColor + '" /></td>',
 '</tr>',
 '<tr title="RGB指定など。例：#CCFFFF">',
  '<td>投稿時間文字色</td>',
  '<td><input type="text" name="timeColor" value="' + config.timeColor + '" /></td>',
 '</tr>',
 '<tr title="RGB指定など。例：#CCFFFF">',
  '<td>投稿数・投稿端末 文字色</td>',
  '<td><input type="text" name="dtColor" value="' + config.dtColor + '" /></td>',
 '</tr>',
 '<tr title="RGB指定など。例：#CCFFFF">',
  '<td>レス本文背景</td>',
  '<td><input type="text" name="ddBg" value="' + config.ddBg + '" /></td>',
 '</tr>',
 '<tr title="RGB指定など。例：#CCFFFF">',
  '<td>レス本文 文字色</td>',
  '<td><input type="text" name="ddColor" value="' + config.ddColor + '" /></td>',
 '</tr>',
 '<tr title="RGB指定など。例：#CCFFFF">',
  '<td>ポップアップ背景</td>',
  '<td><input type="text" name="popBg" value="' + config.popBg + '" /></td>',
 '</tr>',
 '<tr>',
  '<td>AA用フォント</td>',
  '<td>',
   '<input type="checkbox" id="aaFontFlg" name="aaFontFlg" onChange="showToggle(this.checked,\'aaFontKids\')" checked />',
   '<label for="aaFontFlg">アスキーアートのフォントを指定する</label>',
  '</td>',
 '</tr>',
 '<tr class="aaFontKids" title="1に近づくほど細かくなっていく">',
  '<td>┣AAフォントサイズ</td>',
  '<td><input type="text" name="aaFontSize" class="inputSix" value="' + config.aaFontSize + '" onChange="numCheck(this);" onkeyup="numCheck(this);" onblur="nullCheck(this)" /></td>',
 '</tr>',
 '<tr class="aaFontKids">',
  '<td>┗AAフォント</td>',
  '<td>',
   '複数指定した場合、上から順に対応フォントがあるか確認していきます。<br><textarea name="aaFont">MS-PGothic\rＭＳ Ｐゴシック\rIPAMonaPGothic\rMona</textarea>',
  '</td>',
 '</tr>',
 '</table></td></tr>',

 '</tbody>',
'</table>',
].join('');


main.menuStartFlg = true;	//設定メニュー開始完了フラグ

//設定メニュー起動部分
window.addEventListener('GM_option_loaded',menu.userConfig,false);
GM_option.open(strHeader,setHTML,menu.msgArray);

//メニュー追加
GM_registerMenuCommand('Open GM_option',function(){
	GM_option.open(strHeader,setHTML,menu.msgArray);
});

window.addEventListener('beforeunload', function() {
	window.removeEventListener("beforeunload", arguments.callee,false);
	window.removeEventListener('GM_option_loaded',menu.userConfig,false);
	config = strHeader = setHTML = strHeader = null;
},false);



//設定メニュー機能 ここまで---------------------------------






if(!main.menuStartFlg) main.initSet();	//メニュー機能がない時の通常実行


//念のためメモリリーク対策
window.addEventListener('beforeunload', function(){
	window.removeEventListener("beforeunload",arguments.callee,false);
	menu = main = config = initSet = threadObj = textarea = null;
	ecl = null;
	document.body.innerHTML = firstHTML;
}, false);


})();