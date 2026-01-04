// ==UserScript==
// @name                Twitter(旧:𝕏)のインプレッション小遣い稼ぎ野郎どもをdisplay:none;するやつ
// @name:ja             Twitter(旧:𝕏)のインプレッション小遣い稼ぎ野郎どもをdisplay:none;するやつ
// @name:en             Hide the Twitter (formerly: 𝕏) impression-earning scammers with "display:none;"
// @name:zh-CN          使用 "display:none;" 隐藏 Twitter（曾用名: 𝕏）的印象收益骗子。
// @name:zh-TW          使用 "display:none;" 隱藏 Twitter（曾用名: 𝕏）的印象詐騙者。
// @namespace           https://github.com/hi2ma-bu4
// @version             2.1.5
// @description         Twitterのインプレゾンビを非表示にしたりブロック・通報するツールです。
// @description:ja      Twitterのインプレゾンビを非表示にしたりブロック・通報するツールです。
// @description:en      A tool to hide, block, and report spam on Twitter.
// @description:zh-CN   用于隐藏、阻止和报告 Twitter 上的垃圾邮件的工具。
// @description:zh-TW   用於隱藏、封鎖和報告 Twitter 上的垃圾郵件的工具。
// @author              tromtub(snows)
// @license             LGPL-2.1
// @match               *://twitter.com/*
// @match               *://x.com/*
// @match               *://tweetdeck.twitter.com/*
// @icon                data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB7ElEQVR4Ae1XMZLCMAwUdw0ldJQ8ATpKnkBJByUd8ALyA/gBdJTQUtHS8QT4AaRM5ctmThmfogQ75CYNmhGTbGJr45Vk0yAiQzXaF9VsHwIZAofDgYwxqo9GI/K16/X6cqyxvdVqmdvtZh6PhwmCIHXcw7vdrpFj8ny9XhsYxhe8lwWHw2EycLFYpNh0Ok2w8/nsFHy1WrkE1wnAN5tNMkGv10ux3W6XIab5fD5P3ovldCGrP2Ap4LiW8uRJAcIwe1wpArYU0FJimhQgxaQ9cqX4BZYCgSVmS8HBfRP1JQEsY1xKGSmAcTC+l0QrIWDraicVMBBA4O1265ScpQnAMbkMwphjub1HAI7EkxoDK7n0/gQQGATsCmDMo+z++Hf8E5CjPZ9PiqKIZrMZhWFIl8slxcbjMTWbTTqdTuRrXoz5i2WXRIL+WxWw2+Uml13rnJUT4K9E9nMFaF3SxiojoO1u2rJzl4z3/+oIcHBMLiUp2rDe3ozg+BIYtNee87KjGzLGndPx7JD/0K7xog2Gl30ymaSY1jm9CPhsrXnnBK1zOhHgCWWtF7l2TtA6p3S1E+73exoMBrRcLul4PJKL3e93arfbSUeMA1O/36eYPHU6nWQu7pyaqRlfZnezV05anhSN34va7PPXrHYCP+VaTG3LBV1KAAAAAElFTkSuQmCC
// @supportURL          https://github.com/hi2ma-bu4/X_impression_hide
// @supportURL          https://greasyfork.org/ja/scripts/484303
// @compatible          chrome
// @compatible          edge
// @compatible          opera chromium製なので動くと仮定(It's made with chromium so I assume it works)
// @compatible          firefox
// @compatible          kiwi
// @compatible          safari 確実に動く事は保証しません(I can't guarantee that it will work)
// @grant               GM.addStyle
// @grant               GM.setValue
// @grant               GM.getValue
// @grant               GM.deleteValue
// @grant               GM.registerMenuCommand
// @run-at              document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/484303/Twitter%28%E6%97%A7%3A%F0%9D%95%8F%29%E3%81%AE%E3%82%A4%E3%83%B3%E3%83%97%E3%83%AC%E3%83%83%E3%82%B7%E3%83%A7%E3%83%B3%E5%B0%8F%E9%81%A3%E3%81%84%E7%A8%BC%E3%81%8E%E9%87%8E%E9%83%8E%E3%81%A9%E3%82%82%E3%82%92display%3Anone%3B%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/484303/Twitter%28%E6%97%A7%3A%F0%9D%95%8F%29%E3%81%AE%E3%82%A4%E3%83%B3%E3%83%97%E3%83%AC%E3%83%83%E3%82%B7%E3%83%A7%E3%83%B3%E5%B0%8F%E9%81%A3%E3%81%84%E7%A8%BC%E3%81%8E%E9%87%8E%E9%83%8E%E3%81%A9%E3%82%82%E3%82%92display%3Anone%3B%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

/*
Twitter(旧:𝕏)のインプレッション小遣い稼ぎ野郎どもをdisplay:none;するやつ

略して、

インプレゾンビをnoneするやつ

*/
/*
コピー・改変してもいいけど、
「tromtub(snows)」は変えないでね。

*/
/* todo
・URLフィルター作成
・プロフィールメッセージフィルター作成
・画像リンク取得などを高速に
・gifをブロック

・検知率を上げる
    ・あやしい日本語の検知(多分自分の実力じゃ無理)
    ・フィルターをもっと有能に
・誤検知を減らす(今はまだいい？)
・クイックミュートボタンを作成
・whitelist_filterの実装
    ・名前
・他人の引用ツイートテキストフィルターを作成
・menuのresize:both;を左下に
・menuをもっと見やすく(たすけて)
・正規表現などの最適化
・軽量化
*/

(function () {
	("use strict");

	const PRO_NAME = "X_impression_hide";
	const VERSION = "v2.1.5";

	// スマホ判定
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

	// ここから設定
	const DEBUG = true;

	// ==========================================================================================
	// 設定初期値(定数)
	// ==========================================================================================
	const BLACK_TEXT_REG = `!# 行頭が"!#"だとコメント

!# プロフィールメッセージを異常に推してる人
((初|はじ)めまして|こんにち[はわ]|こんばん[はわ]|やっほ|[き気]になった|良かったら).*?ぷろふ
ぷろふ.*?の(確認|チェック|check)
(follow|フォロー).*?の(確認|チェック|check)
(^(連絡|絡み)|[→⇒➡]).*(よろ|おねがいします|返事)

!# chatGPTのエラーメッセージを取り敢えず対処
^申し訳ありません.*?(過激な表現や性的な内容|不適切なコンテンツや言葉).*?他の(質問や話題|トピックで質問)があれば.*?。$

!# 謎投資話
観察.*?毎日.*?銘柄.*?[万萬]円
(偶然|指摘|ブロガー|トレーダー?|毎日|金融).*?(株|投資|銘柄|アドバイス).*?[万萬][円元]
毎日.*?相場.*?予測.*?株式
相場.*?85%

!# chatGPT構文
ですね!.+(です|ね)[!。]$
されましたね!.+(です|ね)[!。]$
でしょう.+かもしれません.+(です|ね)[!。]$

!# 翻訳ってこと？！
^ハハハ、.+ます。?
^ああ、.+です。?
それは.+ますね。.+ですか\\?

!# 文章名指し
この情報を共有していただきありがとうございます
これはどういう意味ですか

!# 陰謀的単語
人口地震

!# 炎上商法
炎上覚悟で
!# 大切なことを?言います|断言します|何度も言いますが|勘違いしてい?る人が多いですが

!# タイ語のハッシュタグを含む場合
#[\\u0E00-\\u0F7F]+

!# アラビア語の単語を含む場合
[\\u0600-\\u07FF]{4,}

!# 中国語のなんかよく見るやつ
^想上课的私信主人
^太阳射不进来的地方
^挂空就是舒服，接点地气
^总说我下面水太多
^在这个炮火连天的夜晚
^只进入身体不进入生活
^生活太多伪装，只能在推上面卸下伪装
^生活枯燥无味，一个人的夜晚总想找个
^我每天都有好好的穿衣服.*俘获
^人不可能每一步都正确，我不想回头看，也不想批判当时的自己
^如果你连试着的胆量也没有，你也就配不上拥有性福
^我希望以后可以不用再送我回家，而是我们一起回我们的家
^勇敢一点我们在.*就有故事
^只要你主动一点点我们就会有机会.*线下
`;
	// --------------------------------------------------
	const BLACK_FULL_TEXT_REG = `!# 行頭が"!#"だとコメント

!# 謎投資話
@[a-z0-9_]{3,30}.*?(先生|観察|発見).*?(助け|共有)
(金融|借金|最近興味).*?@[a-z0-9_]{3,30}.*?(金融|投資|アドバイス|株|[万萬][円元])
`;
	// --------------------------------------------------
	const WHITE_TEXT_REG = `!# 同上

!# 例としてMisskey構文に対応してみる
^:[a-z0-9\-_]:$

!# 緊急性の高い単語を除外
!# ゾンビも使ってくるので除外ユーザー(Excluded users)を併用推奨
!# (災害・防災アカウントidをフィルターに追記した為コメントアウト)
!# 
!# 地震|余震|マグニチュード|火災|災害|津波|波浪|台風|震度
!# jQuake

`;
	// --------------------------------------------------
	/*
        const BLACK_RT_TEXT_REG = `!# 同上
    
    !# 英語の動画宣伝RTの構文
    (vid|video).*free
    free.*(vid|video)
    `;
    */
	// --------------------------------------------------
	const BLACK_NAME_REG = `!# 同上

!# アラビア語のみで構成
^([\\u0600-\\u07FF ]|\\p{P}|\\p{S})+$

!# ヒンディー語のみで構成
^([\\u0900-\\u097F ]|\\p{P}|\\p{S})+$

!# エロ垢抹消
ぷろふ.*(確認|ちぇっく|check)
おふぱこ

!# 謎投資話
NFT|投資

!# 中国語のなんかよく見るやつ
反差
私信领福利
同城
可约
`;
	// --------------------------------------------------
	const EXCLUDED_USERS = `!# 同上

!# 例として製作者のidを指定
@hi2ma_bu4

!# 災害(緊急)情報発信者を除外
!# 表記抜けや、誤字はGithubのIssuesにご報告下さい。
@UN_NERV
@EN_NERV
@EqAlarm
@saigai_sokuho
@MLIT_JAPAN
@CAO_BOUSAI
@JMA_bousai
@JMA_kishou
@JCG_koho
@meti_NIPPON
@ModJapan_saigai
@Kanboukansen
@NPA_saigaiKOHO
@MPD_bousai
@JapanSafeTravel
@JSCE_Saigai
@nhk_seikatsu
@TBC_saigai
@ats_saigai
@tokyo_bousai
@yokohama_saigai
@yamaguchiSaigai
@y_minami_saigai
@w_city_saigai
@sakai_saigai
@Saigai_ishikawa
@saigai01
@HiroshimaBousai
@etajima_bousai
@chibaken_saigai
@aichi_bousai
@kawasaki_bousai
@EhimeBousai
@Gunma_bousai
@nodasi_saigai
@IshiSaigai
@kfb_saigai
@KagoshimaSaigai
@kouchi_bousai
@NTTWestOfficial
@rikudennw
@denjiren
@denjiren_saigai
@mlit_chokoku
@JREast_official

!# サイバーセキュリティ
@cas_nisc
@nisc_forecast

!# TV
@news24ntv

!# 交通情報
@shutoko_traffic
@nexco_kanto
@e_nexco_touhoku
@JAL_flight_info
@JRE_Super_Exp
@odakyuline_info
`;
	// TODO: プロフィールメッセージフィルター機能を作る
	// Bimbo
	// --------------------------------------------------
	const ALLOW_LANG = "ja|en|es|zh|ko|pt|qme|qam|und";
	// --------------------------------------------------
	const SUB_DEFINITION_SUB = `!# 同上

!# それっぽいのをまとめとく
((season|シーズン).{0,2}(\\d{1,2}|[IVX]{1,5})|サブ|ファースト|セカンド|サード|新・?|ファイナル|(\\d{1,4}|[一二三四五六七八九十百千万壱弐参肆伍陸漆捌玖拾陌阡萬廿丗卅世]+)代目|sub|first|1st|second|2nd|third|3rd|fourth|4th|new|final)
`;
	// --------------------------------------------------
	const PLAT_FORM_BLACK_REG = `!# 同上

!# 例:
!# Twitter for Android
!# Twitter for iPhone
!# Twitter Web App

!# 広告などの投稿元
Twitter for Advertisers
`;

	// ==========================================================================================
	// 要素命名用 定数
	// ==========================================================================================
	const EX_MENU_ID = PRO_NAME + "_menu";
	/**
	 * 独自利用id,class名定義
	 * @readonly
	 * @enum {string}
	 */
	const ELEM_NAME_DICT = {
		PARENT_CLASS: PRO_NAME + "_parent",
		CHECK_CLASS: PRO_NAME + "_check",
		HIDE_CLASS: PRO_NAME + "_none",
		LOG_CLASS: PRO_NAME + "_log",
		HIDE_TITLE_CLASS: PRO_NAME + "_title",
		HIDE_TITLE_SHOW_CLASS: PRO_NAME + "_title_show",
		HIDE_TITLE_BUBBLE_CLASS: PRO_NAME + "_title_bubble",
		MORE_TWEET_CLASS: PRO_NAME + "_moreTweet",
		VERIFY_CLASS: PRO_NAME + "_verify",
		PC_FLAG_CLASS: PRO_NAME + "_pc",
		MOBILE_FLAG_CLASS: PRO_NAME + "_mobile",
		EX_MENU_ID: EX_MENU_ID,
		EX_MENU_OPEN_CLASS: EX_MENU_ID + "_open",
		EX_MENU_ITEM_BASE_ID: EX_MENU_ID + "_item_",
		EX_MENU_ITEM_ERROR_CLASS: EX_MENU_ID + "_err",
		// Userscripts対応(ゴリ押し)
		EX_MENU_OPEN_BUTTON: EX_MENU_ID + "_openBtn",
		// OldTweetDeck対応(ゴリ押し)
		USE_TWEET_DECK_CLASS: PRO_NAME + "_tweetDeck",
	};

	// ==========================================================================================
	// css初期値(定数)
	// ==========================================================================================
	const BASE_CSS = /* css */ `
#${EX_MENU_ID} {
    display: none;
    position: fixed;
    color: #111;
    top: 0;
    right: 0;
    z-index: 2000;
}
/* 積み防止 */
#${EX_MENU_ID}.${ELEM_NAME_DICT.EX_MENU_OPEN_CLASS} {
    display: block !important;
    visibility: visible !important;
}

#${EX_MENU_ID} > div {
    position: relative;
    overflow-y: scroll;
    overscroll-behavior: contain;
    width: 50vh;
    min-width: 200px;
    max-width: 90vw;
    height: 50vh;
    min-height: 200px;
    max-height: 90vh;
    resize: both;
    border: solid #000 2px;
    background: #fafafaee;
}

#${ELEM_NAME_DICT.EX_MENU_ITEM_BASE_ID}__btns {
    position: sticky;
    right: 0;
    bottom: 0;
    text-align: right;
}

/* ツイート非表示 */
.${ELEM_NAME_DICT.HIDE_CLASS}:has(.${ELEM_NAME_DICT.LOG_CLASS} input[type=checkbox]:not(:checked)) > div:not(.${ELEM_NAME_DICT.LOG_CLASS}),
.${ELEM_NAME_DICT.HIDE_CLASS}:not(:has(.${ELEM_NAME_DICT.LOG_CLASS})) > div:not(.${ELEM_NAME_DICT.LOG_CLASS}) {
    display: none;
}

body:not(.${ELEM_NAME_DICT.USE_TWEET_DECK_CLASS}) .${ELEM_NAME_DICT.HIDE_CLASS}:has(.${ELEM_NAME_DICT.LOG_CLASS}):not(:has(article)) {
    display: none;
}

/* 検出内容の表示設定 */
.${ELEM_NAME_DICT.PARENT_CLASS} .${ELEM_NAME_DICT.HIDE_CLASS} {
    background: #aaaa;
}

/* 以下非表示後の表示内容設定 */
.${ELEM_NAME_DICT.LOG_CLASS} {
    display: flex;
    justify-content: space-between;
}

.${ELEM_NAME_DICT.HIDE_TITLE_CLASS} {
	position: relative;
	display: inline-block;
	cursor: help;
}

.${ELEM_NAME_DICT.HIDE_TITLE_BUBBLE_CLASS} {
	position: absolute;
	background-color: rgba(0, 0, 0, 0.85);
	color: #fff;
	padding: 0.3em 0.5em;
	border-radius: 6px;
	font-size: 0.8em;
	white-space: nowrap;
	word-break: keep-all;
	overflow-wrap: break-word;
	z-index: 100;
	bottom: 125%;
	left: 50%;
	transform: translateX(-50%);
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.2s;
	max-width: 90vw;
}

.${ELEM_NAME_DICT.HIDE_TITLE_CLASS}.${ELEM_NAME_DICT.HIDE_TITLE_SHOW_CLASS} .${ELEM_NAME_DICT.HIDE_TITLE_BUBBLE_CLASS} {
	opacity: 1;
	pointer-events: auto;
}

.${ELEM_NAME_DICT.LOG_CLASS} > span > a {
	color: rgb(29, 155, 240);
	margin-left: 0.25em;
	text-decoration: underline;
}

.${ELEM_NAME_DICT.LOG_CLASS} input[type=checkbox] {
    display: none;
}
.${ELEM_NAME_DICT.LOG_CLASS} label {
    cursor: pointer;
}
.${ELEM_NAME_DICT.LOG_CLASS} label:hover {
    text-decoration: underline;
}

.${ELEM_NAME_DICT.LOG_CLASS} input[type=button] {
    cursor: pointer;
    background-color: rgba(0,0,0,0);
    border: white 2px outset;
}
.${ELEM_NAME_DICT.LOG_CLASS} input[type=button]:hover {
    background-color: rgba(29, 155, 240, .5);
}

.${ELEM_NAME_DICT.VERIFY_CLASS} {
    max-width: 20px;
    max-height: 20px;
    color: rgb(29, 155, 240);
    fill: currentcolor;
    user-select: none;
    height: 1.25em;
    display: inline-block;
    vertical-align: middle;
}

/* メニュー表示設定 */
#${EX_MENU_ID}.${ELEM_NAME_DICT.MOBILE_FLAG_CLASS} {
    font-size: 0.8em;
}
#${EX_MENU_ID} textarea {
    width: 95%;
    resize: vertical;
    height: 8em;
    max-height: 25em;
    tab-size: 4;
    white-space: pre;
    font-size: 0.89em;
}
#${EX_MENU_ID} input[type=text] {
    width: 95%;
}

#${EX_MENU_ID} input[type=text],
#${EX_MENU_ID} input[type=number],
#${EX_MENU_ID} textarea,
#${EX_MENU_ID} select {
    border: 1px solid #ccc;
}

#${EX_MENU_ID} input[type=button] {
    background-color: #ffffffaa;
	border: 1px solid #ccc;
	border-radius: 4px;
	color: #111133;
	cursor: pointer;
	margin: 0;
	padding: 0.08em 0.2em;
	transition: background 0.2s;
}
#${EX_MENU_ID} input[type=button]:hover {
    background-color: rgba(29, 155, 240, .5);
}

#${EX_MENU_ID} input[type=checkbox] + label::after {
    content: "Invalid";
}
#${EX_MENU_ID} input[type=checkbox]:checked + label::after {
    content: "Validity";
}
#${EX_MENU_ID}[lang=ja] input[type=checkbox] + label::after {
    content: "無効";
}
#${EX_MENU_ID}[lang=ja] input[type=checkbox]:checked + label::after {
    content: "有効";
}

#${EX_MENU_ID} summary {
    cursor: pointer;
}

#${EX_MENU_ID} details {
    margin-top: 1em;
}

.${ELEM_NAME_DICT.EX_MENU_ITEM_BASE_ID}_name {
    font-size: 1.3em;
    margin-bottom: 3px;
    margin-left: 2px;
}
.${ELEM_NAME_DICT.EX_MENU_ITEM_BASE_ID}_name + p {
    font-size: .8em;
    margin: 0 4px;
}

.${ELEM_NAME_DICT.EX_MENU_ITEM_ERROR_CLASS} {
    color: red;
    margin: 0;
}

#${ELEM_NAME_DICT.EX_MENU_OPEN_BUTTON} {
    background: transparent;
    font-weight: bold;
    position: fixed;
    width: 10em;
    height: 2em;
    top: 0;
    right: 0;
}

/* iPad 第1~3世代（画面横）*/
@media (max-device-width: 1024px) and (orientation: landscape) {
    #${ELEM_NAME_DICT.EX_MENU_OPEN_BUTTON} {
        width: 20em;
        height: 4em;
    }
}
/* iPad 第4世代*/
@media screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) {
    #${ELEM_NAME_DICT.EX_MENU_OPEN_BUTTON} {
        width: 20em;
        height: 4em;
    }
}

`;
	// --------------------------------------------------
	const CUSTOM_CSS = /* css */ ``;

	// ==========================================================================================
	// 内部使用他(定数)
	// ==========================================================================================
	/**
	 * メニューform分類
	 * @readonly
	 * @enum {string}
	 */
	const MENU_INPUT_TYPE = {
		text: "text",
		num: "number",
		check: "checkbox",
		textarea: "textarea",
		select: "select",
		btn: "button",
	};
	/**
	 * メニュー分類グループ分類
	 * @readonly
	 * @enum {string}
	 */
	const MENU_GROUP_TYPE = {
		basic: "basic",
		internalRef : "internalRef",
		advanced: "advanced",
		tweetDeck: "tweetDeck",
		debug: "debug",
	};
	// --------------------------------------------------
	// 非表示id

	/**
	 * メッセージフィルターの非表示id
	 * @readonly
	 * @enum {number}
	 */
	const FILTED_HIDDEN_ID = {
		processed: -2,
		evaluated: -1,
		newEntry: 0,
		commentFilterDetection: 1,
		commentEmojiOnly: 2,
		textDuplication: 3,
		highUsage: 4,
		selfCitation: 5,
		nameFilterDetection: 6,
		nameEmojiOnly: 7,
		verifyRtBlock: 8,
		symbolUsage: 9,
		detectedElsewhere: 10,
		authenticatedAccount: 11,
		unauthorizedLanguage: 12,
		selfCitationSub: 13,
		contributtonCount: 14,
		rtContributtonCount: 15,
		rtSharingSeries: 16,
		fullCommentFilterDetection: 17,
		platformFilterDetection: 18,
	};

	// --------------------------------------------------
	// データ保存用 定数
	const SETTING_SAVE_KEY = PRO_NAME + "_json";
	const BLACK_MEMORY_KEY = PRO_NAME + "_blackMemory";

	// --------------------------------------------------
	// 許可URL (ページ)
	const ALLOW_PAGE_SET = new Set(["home", "search"]);
	// 許可URL (ステータス)
	const ALLOW_STATUS_SET = new Set(["status", "tweetdeck"]);

	// --------------------------------------------------
	// 翻訳key
	const MENU_LANG_KEY = "menu_";
	const MENU_LANG_KEY_NAME = "_name";
	const MENU_LANG_KEY_EXPLANATION = "_explanation";

	// --------------------------------------------------
	/**
	 * 翻訳データ
	 * @readonly
	 * @constant {Object.<string, Object.<string, string>>} LANGUAGE_DICT
	 */
	const LANGUAGE_DICT = {
		ja: {
			// 日本語
			menu_warn: /* html */ `
<small>現在のバージョン: ${VERSION}</small><br>
<small style="color:#d00">変更の保存をした場合、ページを更新してください。</small><br>
<small>使い方の説明は<a href="https://github.com/hi2ma-bu4/X_impression_hide" target="_blank" rel="noopener noreferrer">こちら</a>から</small>`,
			menu_internalRef: "追加参照機能",
			menu_advanced: "高度な設定",
			menu_tweetDeck: "OldTweetDeck",
			menu_debug: "デバッグ",
			menu_error: "上記の設定内容の実行に失敗しました",
			save: "保存",
			close: "閉じる",
			filter: "フィルター",
			similarity: "類似度",
			usageCount: "使用回数",
			viewOriginalTweet: "元Tweetを見る",
			sureReset: "本当にリセットを実行しますか？",

			// setting menu
			menu_visibleLog_name: "非表示ログを表示",
			menu_visibleLog_explanation: `非表示にしたログを画面から消します。
画面が平和になりますが、投稿を非表示にされた理由・元投稿が確認出来なくなります。`,
			menu_visibleVerifyLog_name: "非表示ログに認証マーク表示",
			menu_visibleVerifyLog_explanation: `非表示にしたログの名前の後ろに認証マークを追加します。
企業バッジでも青バッジで表示されます。`,
			menu_blackTextReg_name: "禁止する表現",
			menu_blackTextReg_explanation: `非表示にするテキストを指定します。
メンション・ハッシュタグ・シンボルタグ・URLなどのリンク、絵文字は判定に含まれません。
記述方法は正規表現(/の間部分)で記述します。
(半角カタカナ、カタカナはひらがなに自動変換されます)
(全角英数字は半角英数字に、改行文字は半角スペースに自動変換されます)`,
			menu_blackFullTextReg_name: "禁止する表現[拡張]",
			menu_blackFullTextReg_explanation: `非表示にするテキストを指定します。
メンション・ハッシュタグ・シンボルタグ・URLなどのリンク、絵文字を判定に含みます。
指定方法などは[禁止する表現]と同じです。`,
			menu_whiteTextReg_name: "許可する表現",
			menu_whiteTextReg_explanation: `許可するテキストを指定します。
一致する投稿は非表示の対象になりません。
指定方法などは[禁止する表現]と同じです。`,
			menu_blackRtTextReg_name: "禁止するRT表現",
			menu_blackRtTextReg_explanation: `非表示にするRT元テキストを指定します。
指定方法などは[禁止する表現]と同じです。`,
			menu_blackNameReg_name: "禁止する名前",
			menu_blackNameReg_explanation: `非表示にするユーザー名を指定します。
指定方法などは[禁止する表現]と同じです。`,
			menu_excludedUsers_name: "除外ユーザー",
			menu_excludedUsers_explanation: `指定されたユーザーidは検知の対象になりません。
指定方法はユーザーidを改行で区切って記述するだけです。
idは完全一致のみ有効です。`,
			menu_allowLang_name: "許可する言語",
			menu_allowLang_explanation: `許可する言語を指定します。
記述方法は正規表現(/の間部分)で記述します。`,
			menu_oneselfRetweetBlock_name: "自身の引用禁止",
			menu_oneselfRetweetBlock_explanation: `自身を引用ツイートする投稿を非表示にします。`,
			menu_oneselfSubRetweetBlock_name: "サブ垢での自身の引用禁止",
			menu_oneselfSubRetweetBlock_explanation: `サブ垢での自身を引用ツイートする投稿を非表示にします。
ユーザー名から[サブ,2nd]などを除外しての一致検索です。`,
			menu_subDefinitionReg_name: "サブ垢定義用表現",
			menu_subDefinitionReg_explanation: `[サブ垢での自身の引用禁止]での除外文字を指定します。
1行ずつ評価していく為同時評価が必要な場合は「(aaa|bbb)」を使用して下さい。
指定方法などは[禁止する表現]と同じです。`,
			menu_emojiOnryBlock_name: "絵文字投稿禁止",
			menu_emojiOnryBlock_explanation: `絵文字のみで構成された投稿を非表示にします。`,
			menu_emojiOnryNameBlock_name: "絵文字ユーザー名禁止",
			menu_emojiOnryNameBlock_explanation: `絵文字のみで構成されたユーザー名を非表示にします。`,
			menu_verifyBlock_name: "認証アカウント禁止",
			menu_verifyBlock_explanation: `認証済アカウントを無差別に非表示にします。`,
			menu_verifyRtBlock_name: "認証RT禁止",
			menu_verifyRtBlock_explanation: `認証済アカウント投稿に対する引用RTを非表示にします。`,
			menu_verifyOnryFilter_name: "認証アカウントのみ判定",
			menu_verifyOnryFilter_explanation: `認証済アカウントのみを検知の対象にします。
通常アカウントや認証マークの無いアカウントはブロックされなくなります。`,
			menu_formalityCare_name: "認証公式アカウントを保護",
			menu_formalityCare_explanation: `公式アカウントを検知の対象から除外します。
(公式とは青いバッジ以外を指します)`,
			menu_visibleBlockButton_name: "クイックブロック表示",
			menu_visibleBlockButton_explanation: `1クリックでブロックできるボタンを表示します。
検出された投稿にしか表示されません。`,
			menu_visibleReportButton_name: "クイック通報表示",
			menu_visibleReportButton_explanation: `1クリックで通報できるボタンを表示します。
検出された投稿にしか表示されません。
(初期値はスパム報告です)`,
			menu_maxHashtagCount_name: "ハッシュタグの上限数",
			menu_maxHashtagCount_explanation: `1つの投稿内でのハッシュタグの使用上限数を指定します。`,
			menu_maxSymboltagCount_name: "シンボルタグの上限数",
			menu_maxSymboltagCount_explanation: `1つの投稿内でのシンボルタグの使用上限数を指定します。
※シンボルタグとは「$TWTR」のような#を$に置き換えた株を表す表現`,
			menu_maxContributtonCount_name: "ツリー返信上限数",
			menu_maxContributtonCount_explanation: `1つの投稿ツリーでの返信上限数を指定します。
値は許可のラインです。(例: 1で2投稿以上は非表示)
0を指定するとこの設定は無効化されます。`,
			menu_maxRtCount_name: "1人によるRT上限数",
			menu_maxRtCount_explanation: `1つの投稿ツリーでの1ユーザーの引用RT返信上限数を指定します。
値は[ツリー返信上限数]と同じ指定方法です。`,
			menu_maxSameRtCount_name: "同一RT上限数",
			menu_maxSameRtCount_explanation: `1つの投稿ツリーでの複数人からの同じユーザーに対する引用RT返信上限数を指定します。
値は[ツリー返信上限数]と同じ指定方法です。`,
			menu_msgResemblance_name: "文章類似度許可ライン",
			menu_msgResemblance_explanation: `コピペ文章かを判別する為の基準値を指定します。`,
			menu_maxSaveTextSize_name: "比較される最大テキストサイズ",
			menu_maxSaveTextSize_explanation: `コピペ投稿の文章比較の最大文字数を指定します。
値を大きくするほど誤検知率は減り、検知率も減ります。
(投稿の文字数が最大値以下の場合、この値は使用されません)`,
			menu_minSaveTextSize_name: "一時保存・比較される最小テキストサイズ",
			menu_minSaveTextSize_explanation: `比較用文章の最小文字数を指定します。
値が大きくするほど誤検知率は減り、検知率も減ります。
([比較される最大テキストサイズ]より大きい場合、比較処理は実行されません)`,
			menu_maxSaveLogSize_name: "一時保存される投稿の最大数",
			menu_maxSaveLogSize_explanation: `比較用文章の保持数を指定します。
値が小さいほど処理は軽くなりますが、検知率が減ります。`,
			menu_language_name: "言語",
			menu_language_explanation: `表示言語を設定します。`,
			menu_useTwitterInternalData_name: "Twitter内部データ使用",
			menu_useTwitterInternalData_explanation: `ユーザーと同じ画面(DOM)からのデータ取得ではなく、
内部で使用されているオブジェクトを処理に流用します。
<span style="color: #f00">Twitterのアップデートで動作しなくなる可能性があります。</span>
取得に失敗した場合既存の取得方法が代替で使用されます。
OldTweetDeckでは無効です。`,
			menu_platformBlackReg_name: "禁止するプラットフォーム",
			menu_platformBlackReg_explanation: `「Twitter Web App」などの投稿環境で判定します。
指定方法などは[禁止する表現]と同じです。
[Twitter内部データ使用]が無効の場合、動作しません。`,
			menu_customCss_name: "ページ適用css設定",
			menu_customCss_explanation: `ページへ適用するcssを指定します。`,
			menu_bodyObsTimeout_name: "ページ更新検知用処理待機時間(ms)",
			menu_bodyObsTimeout_explanation: `ページ更新を検知する際の検知の更新間隔を指定します。
値が大きいほど処理が軽くなりますが、非表示にする初速が落ちる可能性あります。`,
			menu_blackMemory_name: "検知対象の記憶",
			menu_blackMemory_explanation: `検出された対象を記憶します。
ページを更新などしても過去に検知した対象を素早く非表示に出来ます。
<span style="color: #f00">※この機能はbeta版です！！
誤検知されたアカウントが非表示のままになります。
[除外ユーザー]と併用して使用して下さい。</span>`,
			menu_autoBlock_name: "【非推奨】自動ブロック",
			menu_autoBlock_explanation: `検出された対象を自動でブロックします。
<span style="color: #f00">※この機能はbeta版です！！
誤検知でも戸惑いなくブロックされます。</span>`,
			menu_useRegModeDotAll_name: "dotAllモードの利用",
			menu_useRegModeDotAll_explanation: `内部で使用する正規表現でdotAllモードを使用可能にします。
<span style="color: #f00">この機能を無効にした場合、正規表現を記述するフィルターで改行を明示的に指定する必要があります。
変更を行う前に、その影響について理解して変更して下さい。</span>(ES9)`,
			menu_resetSetting_name: "設定のリセット",
			menu_resetSetting_explanation: `設定項目をリセットします。
(ページがリロードされます)
<span style="color: #f00">実行すると設定は復元出来ません！！！</span>`,
			menu_resetBlackMemory_name: "検知済idのリセット",
			menu_resetBlackMemory_explanation: `検知済idをリセットします。
(ページがリロードされます)
<span style="color: #f00">実行するとこれまで検知・非表示にされたユーザーが再度表示される可能性が高くなります！
[検知対象の記憶]を使用している状況で以前より処理が重いと感じた場合、リセットすると処理が軽くなる可能性があります。</span>`,
			menu_enableOldTweetDeckMode_name: "OldTweetDeck対応",
			menu_enableOldTweetDeckMode_explanation: `負荷軽減の為に分離
<span style="color: #f00">※この機能はbeta版です！！
動作の安定性を保証出来ません。</span>`,
			menu_autoLoadJQuery_name: "jQuery自動読み込み",
			menu_autoLoadJQuery_explanation: `OldTweetDeckではなぜかjQueryが使用されているのにjQueryが読み込まれていない為、
jQueryが読み込まれていない場合にjQueryを読み込む機能です。`,
			menu_debug_viewSettingMenu_name: "起動時設定自動表示",
			menu_debug_viewSettingMenu_explanation: `設定画面を自動で開く`,
			menu_debug_visibleCardDebugButton_name: "クイックデバッグ表示",
			menu_debug_visibleCardDebugButton_explanation: `1クリックでコンソールに該当MsgDataを出力できるボタンを表示します。
検出された投稿にしか表示されません。
<span style="font-size: 0.7em">検出された投稿は軽量化のためMsgDataを破棄するのでこの参照が最後の記録</span>`,
			menu_debug_viewBlacklist_name: "blacklist表示",
			menu_debug_viewBlacklist_explanation: `現在のblacklist_idをconsoleに出力する。`,
			menu_debug_viewMsgDB_name: "MsgDB表示",
			menu_debug_viewMsgDB_explanation: `現在のMsgDBをconsoleに出力する。`,
			menu_debug_reInit_name: "init再実行",
			menu_debug_reInit_explanation: `強制的にDOM設定を再設定する。
[ページ更新検知用処理待機時間(ms)]が仕事を放棄した際に使用。`,

			//hideComment
			detectedElsewhere: "他で検出済",
			authenticatedAccount: "認証垢",
			verifyRtBlock: "認証RT垢",
			unauthorizedLanguage: "非許可言語",
			contributtonCount: "連投",
			rtContributtonCount: "RT連投",
			rtSharingSeries: "RT共有連投",
			filterDetection: "フィルター検出",
			emojiOnly: "絵文字のみ",
			textDuplication: "文章の複製",
			highUsage: "#多量使用",
			symbolUsage: "$多量使用",
			selfCitation: "自身の引用",
			selfCitationSub: "自身を引用?",
			platformFilterDetection: "投稿元規制",
			recursiveDetection: "再帰的検出",
		},
		en: {
			// 英語
			menu_warn: /* html */ `
<small>Current version: ${VERSION}</small><br>
<small style="color:#d00">If you have saved the changes, please refresh the page.</small><br>
<small>You can find the usage instructions <a href="https://github.com/hi2ma-bu4/X_impression_hide" target="_blank" rel="noopener noreferrer">here</a></small>`,
			menu_internalRef: "Additional Reference",
			menu_advanced: "Advanced settings",
			menu_tweetDeck: "OldTweetDeck",
			menu_debug: "Debug",
			menu_error: "Failed to execute the above settings",
			save: "Save",
			close: "Close",
			filter: "Filter",
			similarity: "Similarity",
			usageCount: "UsageCount",
			viewOriginalTweet: "View original Tweet",
			sureReset: "Are you sure you want to execute the reset?",

			// setting menu
			menu_visibleLog_name: "Show hidden logs",
			menu_visibleLog_explanation: `It will remove the hidden logs from the screen.
The screen will be peaceful, but the reasons for hiding the posts and the original posts will no longer be visible.`,
			menu_visibleVerifyLog_name: "Certification mark displayed on hidden log",
			menu_visibleVerifyLog_explanation: `Adds a certification mark after the name of the hidden log.
Corporate badges are also displayed as blue badges.`,
			menu_blackTextReg_name: "Prohibited expressions",
			menu_blackTextReg_explanation: `Specify the text to hide.
Mentions, hashtags, symbol tags, URLs, and emojis are excluded from the evaluation.
The description should be written using regular expressions (between the / characters).
Half-width katakana and katakana will be automatically converted to hiragana.
Full-width alphanumeric characters will be converted to half-width,
 and line breaks will be converted to spaces automatically.`,
 			menu_blackFullTextReg_name: "Prohibited expressions[Plus]",
			menu_blackFullTextReg_explanation: `Specify the text to hide.
Mentions, hashtags, symbol tags, URLs, and emojis are included in the evaluation.
The specification method is the same as [Prohibited expressions].`,
			menu_whiteTextReg_name: "Expressions allowed",
			menu_whiteTextReg_explanation: `Specify the text to allow.
Matching posts will not be hidden.
The specification method is the same as [Prohibited expressions].`,
			menu_blackRtTextReg_name: "Prohibited RT expressions",
			menu_blackRtTextReg_explanation: `Specify the RT source text to hide.
The specification method is the same as [Prohibited expressions].`,
			menu_blackNameReg_name: "Prohibited name",
			menu_blackNameReg_explanation: `Specify the username to hide.
The specification method is the same as [Prohibited expressions].`,
			menu_excludedUsers_name: "Excluded users",
			menu_excludedUsers_explanation: `The specified user ID will not be detected.
To specify, simply write the user IDs separated by line breaks.
Only exact matches are valid for id.`,
			menu_allowLang_name: "Allowed languages",
			menu_allowLang_explanation: `Specify the allowed languages.
The description should be written using regular expressions (between the / characters).`,
			menu_oneselfRetweetBlock_name: "Prohibition of self-quotation",
			menu_oneselfRetweetBlock_explanation: `It hides posts that quote oneself.`,
			menu_oneselfSubRetweetBlock_name: "Prohibition of quoting yourself in sub-text",
			menu_oneselfSubRetweetBlock_explanation: `It hides posts that quote oneself.`,
			menu_subDefinitionReg_name: "Expression for sub-scale definition",
			menu_subDefinitionReg_explanation: `Specify the excluded characters for [Prohibit quoting yourself in sub-text].
If you need simultaneous evaluation, use "(aaa|bbb)" as each line is evaluated one by one.
The specification method is the same as [Prohibited expressions].`,
			menu_emojiOnryBlock_name: "No emoji posting",
			menu_emojiOnryBlock_explanation: `Hide posts composed only of emojis.`,
			menu_emojiOnryNameBlock_name: "Prohibit emoji usernames",
			menu_emojiOnryNameBlock_explanation: `Hide usernames composed only of emojis.`,
			menu_verifyBlock_name: "Prohibition of authenticated accounts",
			menu_verifyBlock_explanation: `It indiscriminately hides authenticated accounts.`,
			menu_verifyRtBlock_name: "Authentication RT prohibited",
			menu_verifyRtBlock_explanation: `Hide quoted RTs for authenticated account posts.`,
			menu_verifyOnryFilter_name: "Authenticate accounts only",
			menu_verifyOnryFilter_explanation: `It detects only authenticated accounts.
Regular accounts and accounts without verification badges will no longer be blocked.`,
			menu_formalityCare_name: "Protect your authenticated official account",
			menu_formalityCare_explanation: `Exclude official accounts from detection.
(Official means anything other than the blue badge)`,
			menu_visibleBlockButton_name: "Quick block button display",
			menu_visibleBlockButton_explanation: `Displays a button that allows you to block with one click.
It will only appear on detected posts.`,
			menu_visibleReportButton_name: "Quick report button display",
			menu_visibleReportButton_explanation: `Displays a button that allows you to report with one click.
It will only appear on detected posts.
(Initial value is spam report)`,
			menu_maxHashtagCount_name: "Maximum number of hashtags",
			menu_maxHashtagCount_explanation: `It specifies the maximum number of hashtags allowed in a single post.`,
			menu_maxSymboltagCount_name: "Maximum number of symboltags",
			menu_maxSymboltagCount_explanation: `It specifies the maximum number of symboltags allowed in a single post.
*Symbol tag is an expression that represents a stock by replacing # with $, such as "$TWTR"`,
			menu_maxContributtonCount_name: "Maximum number of tree replies",
			menu_maxContributtonCount_explanation: `Specify the maximum number of replies in one post tree.
The value is the line of permission. (Example: 1 hides 2 or more posts)
Specifying 0 disables this setting.`,
			menu_maxRtCount_name: "Maximum number of RTs by one person",
			menu_maxRtCount_explanation: `Specify the maximum number of quote RT replies for one user in one post tree.
The value is specified in the same way as [Maximum number of tree replies].`,
			menu_maxSameRtCount_name: "Maximum number of same RTs",
			menu_maxSameRtCount_explanation: `Specify the maximum number of quote RT replies to the same user from multiple people in one post tree.
The value is specified in the same way as [Maximum number of tree replies].`,
			menu_msgResemblance_name: "Text similarity threshold",
			menu_msgResemblance_explanation: `It specifies the threshold value for determining whether a text is a copied and pasted text.`,
			menu_maxSaveTextSize_name: "Maximum text size for comparison",
			menu_maxSaveTextSize_explanation: `It specifies the maximum number of characters for text comparison in copied and pasted posts.
Increasing the value reduces the false positive rate but also reduces the detection rate.
(This value is not used if the post's character count is below the maximum value.)`,
			menu_minSaveTextSize_name: "The minimum text size that is temporarily saved and compared",
			menu_minSaveTextSize_explanation: `This specifies the minimum number of characters for the comparison text.
Increasing the value reduces the false detection rate as well as the detection rate.
If it is larger than the [Maximum text size for comparison], the comparison process will not be executed.`,
			menu_maxSaveLogSize_name: "The maximum number of posts that are temporarily saved",
			menu_maxSaveLogSize_explanation: `This specifies the number of comparison texts to be retained.
A smaller value reduces the processing load but also decreases the detection rate.`,
			menu_language_name: "Language",
			menu_language_explanation: `Set the display language.`,
			menu_useTwitterInternalData_name: "Use of Twitter internal data",
			menu_useTwitterInternalData_explanation: `Instead of retrieving data from the same screen (DOM) as the user, this feature reuses internal objects used by Twitter.
<span style="color: #f00">This may stop working if Twitter updates their platform.</span>
If data retrieval fails, the existing method will be used as a fallback.
This is not supported on OldTweetDeck.`,
			menu_platformBlackReg_name: "Disallowed platforms",
			menu_platformBlackReg_explanation: `Posts are identified based on the source client, like "Twitter Web App".
The specification method is the same as [Prohibited expressions].
Does not work if [Use of Twitter internal data] is disabled.`,
			menu_customCss_name: "Page-specific CSS settings",
			menu_customCss_explanation: `Specify the CSS to apply to the page.`,
			menu_bodyObsTimeout_name: "Processing wait time (in milliseconds) for page update detection",
			menu_bodyObsTimeout_explanation: `This specifies the interval for detecting page updates.
A larger value reduces the processing load but may potentially delay the initial speed of hiding.`,
			menu_blackMemory_name: "Memory of detection target",
			menu_blackMemory_explanation: `Remembers detected objects.
Even if you refresh the page, you can quickly hide objects detected in the past.
<span style="color: #f00">*This feature is in beta version! !
Falsely detected accounts remain hidden.
Please use it in conjunction with [Excluded User]. </span>`,
			menu_autoBlock_name: "[Not recommended] Automatic block",
			menu_autoBlock_explanation: `Automatically block detected targets.
<span style="color: #f00">*This feature is in beta version! !
Even false positives are blocked without hesitation.</span>`,
			menu_useRegModeDotAll_name: "Using dotAll mode",
			menu_useRegModeDotAll_explanation: `Enables the use of dotAll mode in regular expressions used internally.  
<span style="color: #f00">If this feature is disabled, you will need to explicitly specify line breaks in filters that use regular expressions.  
Please make sure you understand the implications before making changes.</span> (ES9)`,
			menu_resetSetting_name: "Reset settings",
			menu_resetSetting_explanation: `Reset the settings.
(The page will be reloaded.)
<span style="color: #f00">Once executed, the settings cannot be restored!!!</span>`,
			menu_resetBlackMemory_name: "Reset detected ID",
			menu_resetBlackMemory_explanation: `Reset detected ID.
(The page will be reloaded.)
<span style="color: #f00">If you run it, there is a high possibility that users who have been detected/hidden will be displayed again!
If you feel that the processing is slower than before when using [Remember detection targets], resetting it may make the processing faster. </span>`,
			menu_enableOldTweetDeckMode_name: "OldTweetDeck compatible",
			menu_enableOldTweetDeckMode_explanation: `Separated to reduce load
<span style="color: #f00">*This feature is in beta version! !
We cannot guarantee the stability of operation.</span>`,
			menu_autoLoadJQuery_name: "jQuery Autoload",
			menu_autoLoadJQuery_explanation: `For some reason, jQuery is used in OldTweetDeck but is not loaded, so this function loads jQuery when jQuery is not loaded.`,
			menu_debug_viewSettingMenu_name: "Automatic display of settings at startup",
			menu_debug_viewSettingMenu_explanation: `Automatically open the settings screen`,
			menu_debug_viewBlacklist_name: "Blacklist display",
			menu_debug_viewBlacklist_explanation: `Output current blacklist_id to console.`,
			menu_debug_viewMsgDB_name: "MsgDB display",
			menu_debug_viewMsgDB_explanation: `Output current MsgDB to console.`,
			menu_debug_reInit_name: "init rerun",
			menu_debug_reInit_explanation: `Force DOM settings to be reset.
Used when [Processing wait time (in milliseconds) for page update detection] is abandoned.`,

			//hideComment
			detectedElsewhere: "DetectedElsewhere",
			authenticatedAccount: "AuthenticatedAccount",
			verifyRtBlock: "AuthenticationRtPlaque",
			unauthorizedLanguage: "UnauthorizedLanguage: ",
			contributtonCount: "doubleTexting",
			rtContributtonCount: "rtDoubleTexting",
			rtSharingSeries: "rtSharingSeries",
			filterDetection: "FilterDetection",
			emojiOnly: "EmojiOnly",
			textDuplication: "TextDuplication",
			highUsage: "#HighUsage",
			symbolUsage: "$HighUsage",
			selfCitation: "SelfCitation",
			selfCitationSub: "selfCitationSub",
			platformFilterDetection: "PlatformRestriction",
			recursiveDetection: "RecursiveDetection",
		},
	};

	/**
	 * メニューのセレクトボックス内容
	 * @readonly
	 * @constant {Object.<string, string>} SETTING_LANG_SELECT
	 */
	const SETTING_LANG_SELECT = {
		ja: "日本語(ja)",
		en: "English(en)",
	};

	// --------------------------------------------------

	/**
	 * 標準参照Query一覧
	 * @enum {string}
	 */
	const _BASIC_QUERY_DICT = {
		OBS_QUERY: "section > div > div:has(article)",
		RE_QUERY: `div:has(div > div > article):not(.${ELEM_NAME_DICT.CHECK_CLASS})`,
		NAME_SPACE_QUERY: `[data-testid="User-Name"]`,
		NAME_QUERY: `:not(span) > span > span`,
		ID_QUERY: "div > span:not(:has(span))",
		VERIFY_QUERY: `svg:not(:has([fill^="#"]))`,
		VERIFY_FORMALITY_QUERY: `svg:has([fill^="#"])`,
		TEXT_DIV_QUERY: "div[lang]",
		IMAGE_QUERY: `a img, [data-testid="videoComponent"] video`,
		MENU_BUTTON_QUERY: "[aria-haspopup=menu][role=button]:has(svg)",
		MENU_DISP_QUERY: "[role=group] [role=menu]",
	};
	if (isMobile) {
		_BASIC_QUERY_DICT.MENU_DISP_QUERY = "#layers [role=menu] [role=group]";
	}

	/**
	 * OldTweetDeck参照Query一覧
	 * @enum {string}
	 */
	const _OLD_TWEET_DECK_QUERY_DICT = {
		OBS_QUERY: "body .js-app-columns:has(section)",
		RE_QUERY: `article:has(div > div > header):not(.${ELEM_NAME_DICT.CHECK_CLASS})`,
		NAME_SPACE_QUERY: "header",
		NAME_QUERY: ".fullname",
		ID_QUERY: ".username",
		TEXT_DIV_QUERY: ".tweet-text",
	};

	/**
	 * 参照Query一覧
	 * @enum {string}
	 */
	const EX_QUERY_DICT = new Proxy(_BASIC_QUERY_DICT, {
		get(target, prop, receiver) {
			if (useOldTweetDeck) {
				let ret = _OLD_TWEET_DECK_QUERY_DICT[prop];
				if (ret) return ret;
			}
			return target[prop];
		},
		set(target, prop, value, receiver) {
			console.warn(`Cannot assign to read-only property: ${prop}`);
			return false;
		},
	});

	/**
	 * 標準参照Queryリスト一覧
	 * @enum {Array<string|[string,number]>}
	 */
	const _BASIC_QUERY_LIST_DICT = {
		BLOCK_QUERY_LIST: [`${_BASIC_QUERY_DICT.MENU_DISP_QUERY} div[role=menuitem]:has(path[d^="M12 3.75c"])`, "[role=alertdialog] [role=group] [role=button] div"],
		// 3行目は場合によっては消す
		REPORT_QUERY_LIST: [`${_BASIC_QUERY_DICT.MENU_DISP_QUERY} div[role=menuitem]:has(path[d^="M3 2h18"])`, ["[role=radiogroup] label", 5], "[role=group]:has([role=radiogroup]) [role=button]:not(:has(svg))", ["[role=group] [role=button]:not(:has(svg))", 1], ["__wait__", 1000], ["[role=group] [role=button]:not(:has(svg))", 1]],
	};

	/**
	 * OldTweetDeck参照Queryリスト一覧
	 * @enum {Array<string|[string,number]>}
	 */
	const _OLD_TWEET_DECK_QUERY_LIST_DICT = {};

	/**
	 * 参照Queryリスト一覧
	 * @enum {Array<string|[string,number]>}
	 */
	const EX_QUERY_LIST_DICT = new Proxy(_BASIC_QUERY_LIST_DICT, {
		get(target, prop, receiver) {
			if (useOldTweetDeck) {
				let ret = _OLD_TWEET_DECK_QUERY_LIST_DICT[prop];
				if (ret) return ret;
			}
			return target[prop];
		},
		set(target, prop, value, receiver) {
			console.warn(`Cannot assign to read-only property: ${prop}`);
			return false;
		},
	});

	const VERIFY_SVG = `
    <svg class="${ELEM_NAME_DICT.VERIFY_CLASS}" viewBox="0 0 22 22" role="img" data-testid="icon-verified">
        <g>
            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z">
            </path>
        </g>
    </svg>
`;

	// --------------------------------------------------
	/**
	 * 設定リスト内容定義
	 * @typedef {Object} SettingItem
	 * @property {boolean|string|number} [initData] - 設定項目の初期データ
	 * @property {boolean|string|number} [data] - 設定項目データ
	 * @property {MENU_INPUT_TYPE} input - 設定項目の入力タイプ
	 * @property {MENU_GROUP_TYPE} group - 所属グループ
	 * @property {string} [value] - `MENU_INPUT_TYPE`が`btn`の場合のvalue
	 * @property {number} [min] - `MENU_INPUT_TYPE`が`num`の場合の最小値
	 * @property {number} [max] - `MENU_INPUT_TYPE`が`num`の場合の最小値
	 * @property {number} [step] - `MENU_INPUT_TYPE`が`num`の場合の増分値
	 * @property {string} [select] - `MENU_INPUT_TYPE`が`select`の場合のoptions
	 * @property {boolean} [isError] - 【自動設定】エラーが設定項目に含まれる場合true
	 * @property {RegExp[]} [regexp_list] - 【自動設定】regRestorationで使用
	 * @property {RegExp} [regexp] - 【自動設定】1項目regで使用
	 */

	/**
	 * 設定リスト
	 * @type {Object.<string, SettingItem>}
	 */
	const SETTING_LIST = {
		visibleLog: {
			initData: true,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.basic,
		},
		visibleVerifyLog: {
			initData: true,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.basic,
		},
		blackTextReg: {
			initData: BLACK_TEXT_REG,
			input: MENU_INPUT_TYPE.textarea,
			group: MENU_GROUP_TYPE.basic,
		},
		blackFullTextReg: {
			initData: BLACK_FULL_TEXT_REG,
			input: MENU_INPUT_TYPE.textarea,
			group: MENU_GROUP_TYPE.basic,
		},
		whiteTextReg: {
			initData: WHITE_TEXT_REG,
			input: MENU_INPUT_TYPE.textarea,
			group: MENU_GROUP_TYPE.basic,
		},
		// blackRtTextReg: {
		// 	initData: BLACK_RT_TEXT_REG,
		// 	input: MENU_INPUT_TYPE.textarea,
		// 	group: MENU_GROUP_TYPE.basic,
		// },
		blackNameReg: {
			initData: BLACK_NAME_REG,
			input: MENU_INPUT_TYPE.textarea,
			group: MENU_GROUP_TYPE.basic,
		},
		excludedUsers: {
			initData: EXCLUDED_USERS,
			input: MENU_INPUT_TYPE.textarea,
			group: MENU_GROUP_TYPE.basic,
		},
		allowLang: {
			initData: ALLOW_LANG,
			input: MENU_INPUT_TYPE.text,
			group: MENU_GROUP_TYPE.basic,
			regexp: /.*/,
		},
		oneselfRetweetBlock: {
			initData: true,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.basic,
		},
		oneselfSubRetweetBlock: {
			initData: true,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.basic,
		},
		subDefinitionReg: {
			initData: SUB_DEFINITION_SUB,
			input: MENU_INPUT_TYPE.textarea,
			group: MENU_GROUP_TYPE.basic,
		},
		emojiOnryBlock: {
			initData: true,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.basic,
		},
		emojiOnryNameBlock: {
			initData: true,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.basic,
		},
		verifyBlock: {
			initData: false,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.basic,
		},
		verifyRtBlock: {
			initData: false,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.basic,
		},
		verifyOnryFilter: {
			initData: false,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.basic,
		},
		formalityCare: {
			initData: true,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.basic,
		},
		visibleBlockButton: {
			initData: true,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.basic,
		},
		visibleReportButton: {
			initData: true,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.basic,
		},
		maxHashtagCount: {
			initData: 6,
			input: MENU_INPUT_TYPE.num,
			group: MENU_GROUP_TYPE.basic,
			min: 1,
			step: 1,
		},
		maxSymboltagCount: {
			initData: 1,
			input: MENU_INPUT_TYPE.num,
			group: MENU_GROUP_TYPE.basic,
			min: 1,
			step: 1,
		},
		maxContributtonCount: {
			initData: 2,
			input: MENU_INPUT_TYPE.num,
			group: MENU_GROUP_TYPE.basic,
			min: 0,
			step: 1,
		},
		maxRtCount: {
			initData: 1,
			input: MENU_INPUT_TYPE.num,
			group: MENU_GROUP_TYPE.basic,
			min: 0,
			step: 1,
		},
		maxSameRtCount: {
			initData: 1,
			input: MENU_INPUT_TYPE.num,
			group: MENU_GROUP_TYPE.basic,
			min: 0,
			step: 1,
		},
		msgResemblance: {
			initData: 0.85,
			input: MENU_INPUT_TYPE.num,
			group: MENU_GROUP_TYPE.basic,
			min: 0,
			max: 1,
			step: 0.01,
		},
		maxSaveTextSize: {
			initData: 100,
			input: MENU_INPUT_TYPE.num,
			group: MENU_GROUP_TYPE.basic,
			min: 0,
			step: 1,
		},
		minSaveTextSize: {
			initData: 8,
			input: MENU_INPUT_TYPE.num,
			group: MENU_GROUP_TYPE.basic,
			min: 0,
			step: 1,
		},
		maxSaveLogSize: {
			initData: 200,
			input: MENU_INPUT_TYPE.num,
			group: MENU_GROUP_TYPE.basic,
			min: 1,
			step: 1,
		},
		language: {
			initData: "ja",
			input: MENU_INPUT_TYPE.select,
			group: MENU_GROUP_TYPE.basic,
			select: SETTING_LANG_SELECT,
		},
		// -------------------------
		useTwitterInternalData: {
			initData: true,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.internalRef,
		},
		platformBlackReg: {
			initData: PLAT_FORM_BLACK_REG,
			input: MENU_INPUT_TYPE.textarea,
			group: MENU_GROUP_TYPE.internalRef,
		},
		// -------------------------
		customCss: {
			initData: CUSTOM_CSS,
			input: MENU_INPUT_TYPE.textarea,
			group: MENU_GROUP_TYPE.advanced,
		},
		bodyObsTimeout: {
			initData: 3000,
			input: MENU_INPUT_TYPE.num,
			group: MENU_GROUP_TYPE.advanced,
			min: 100,
			step: 1,
		},
		blackMemory: {
			initData: false,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.advanced,
		},
		autoBlock: {
			initData: false, // trueにしてはいけない(戒め)
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.advanced,
		},
		useRegModeDotAll: {
			initData: true,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.advanced,
		},
		resetSetting: {
			input: MENU_INPUT_TYPE.btn,
			group: MENU_GROUP_TYPE.advanced,
			value: "Reset",
		},
		resetBlackMemory: {
			input: MENU_INPUT_TYPE.btn,
			group: MENU_GROUP_TYPE.advanced,
			value: "Reset",
		},
		// -------------------------
		enableOldTweetDeckMode: {
			initData: false,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.tweetDeck,
		},
		autoLoadJQuery: {
			initData: true,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.tweetDeck,
		},
		// -------------------------
		debug_viewSettingMenu: {
			initData: false,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.debug,
		},
		debug_visibleCardDebugButton: {
			initData: false,
			input: MENU_INPUT_TYPE.check,
			group: MENU_GROUP_TYPE.debug,
		},
		debug_viewBlacklist: {
			input: MENU_INPUT_TYPE.btn,
			group: MENU_GROUP_TYPE.debug,
			value: "Output",
		},
		debug_viewMsgDB: {
			input: MENU_INPUT_TYPE.btn,
			group: MENU_GROUP_TYPE.debug,
			value: "Output",
		},
		debug_reInit: {
			input: MENU_INPUT_TYPE.btn,
			group: MENU_GROUP_TYPE.debug,
			value: "Retry",
		},
	};

	// 元データ保存
	for (let key in SETTING_LIST) {
		if (SETTING_LIST[key].initData !== undefined) {
			SETTING_LIST[key].data = SETTING_LIST[key].initData;
		}
	}

	// --------------------------------------------------

	/** @type {Object.<string, string> | null} */
	let lang_dict = null;

	/** @type {HTMLElement} */
	let parentDOM = null;
	/** @type {MutationObserver} */
	let parent_observer = null;
	/** @type {string} */
	let oldUrl = location.href;
	/** @type {string} */
	let parent_id = null;
	/** @type {HTMLElement} */
	let exMenuDOM = null;

	/** @type {MessageData[]} */
	const msgDB = [];
	/** @type {Set<string>} */
	const msgDB_id = new Set();
	/** @type {Set<string>} */
	const blacklist_id = new Set();
	/** @type {Set<string>} */
	const excludedUsersSet = new Set();

	// 類似文字列検索使用フラグ
	let levenshteinDistanceUseFlag = true;
	let internalDataRefFlag = true;
	// ページ読み込み停止フラグ
	let stopFlag = false;

	/**
	 * 正規表現で以下を使用するか
	 * @enum {boolean}
	 */
	const useRegModeList = {
		i: true, // ES1 : 大文字・小文字を区別しない
		m: true, // ES3 : 複数行モード	(^ や $ が各行の先頭/末尾にマッチ)
		u: true, // ES6 : Unicodeモード	(サロゲートペアを正しく処理)
		s: true, // ES9 : dotAllモード	(. が改行 \n にもマッチするようになる)
	};
	let useRegMode = "";

	// OldTweetDeck関連
	let isPageOldTweetDeck = false;
	let useOldTweetDeck = false;

	// ページ変更確認に使用
	let body_isReservation = false;
	let body_isWait = false;
	// もっと見るを軽量で観測する為に使用
	let existMoreTweet = false;

	// --------------------------------------------------
	const spaceRegList = [
		/[ 　\t]/gu,
		/[\u00A0\u00AD\u034F\u061C]/gu,
		/[\u115F\u1160\u17B4\u17B5\u180E]/gu,
		// \u200Dが合成時に消失したため部分対処
		/[\u2000-\u200C\u200E-\u200F\u202F\u205F\u2060-\u2064\u206A-\u206F\u2800]/gu,
		/[\u3000\u3164]/gu,
		/[\uFEFF\uFFA0]/gu,
		/[\u{1D159}\u{1D173}-\u{1D17A}]/gu,
	];
	const normalizeRegList = [
		[/[ア-ヺ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60)],
		[/[”“″‶〝‟]/gu, '"'],
		[/[’‘′´‛‵＇]/gu, "'"],
	];
	const reRegExpReg = /\\x([0-9a-fA-F]{2})|\\u([0-9a-fA-F]{4})|\\u\{([0-9a-fA-F]{1,6})\}/g;
	const CrLfReg = /[\r\n]/gu;
	const spaceReg = / /g;

	const tweetUrlImgReg = /^https?:\/\/pbs\.twimg\.com\/media\//;
	const tweetUrlVideoReg = /^https?:\/\/video\.twimg\.com\/tweet_video\//;

	// ==========================================================================================
	// メッセージデータ保存 クラス
	// ==========================================================================================
	
	/**
	 * リンクデータ
	 */
	class LinkData {
		/**
		 * リンクデータ保存
		 * @param {string} href 
		 * @param {string} value 
		 */
		constructor(href, value) {
			this.href = href;
			this.value = value;
		}
	}

	/**
	 * メッセージデータ
	 */
	class MessageData {
		/**
		 * メッセージデータ保存
		 * @param {string} url
		 * @param {HTMLElement} card
		 */
		constructor(url, card) {
			this.base_url = url;
			/** @type {HTMLElement} */
			this.card = card;
			this.verify = false;
			this.formality = false;
			/**
			 * LinkDataを入れるオブジェクト
			 * @type {{mention: LinkData[], hashtag: LinkData[], symboltag: LinkData[], url: LinkData[]}}
			 */
			this.has_link_dict = {
				mention:[],
				hashtag:[],
				symboltag: [],
				url:[],
			}
			this.attach_img = false;
			this.attach_file_list = [];
			/** @type {MessageData | null} */
			this.reTweet = null;
			/** @type {MessageData | null} */
			this.parentTweet = null;
			/** @type {HTMLElement | null} */
			this.menuDOM = null;

			this._nsOneLoadFlag = false;
			this._notTextDiv = false;
		}

		/**
		 * カードデータ取得
		 * @returns {Promise<undefined> | false}
		 */
		cardDataGet() {
			const article = this._getArticle();
			if (!article) {
				return false;
			}

			let nameSpace_div = article.querySelectorAll(EX_QUERY_DICT.NAME_SPACE_QUERY);
			nameSpace_div.forEach((div) => {
				// 2回目以降はリツイート
				if (this._nsOneLoadFlag) {
					this._addReTweet();
				}

				if (internalDataRefFlag) {
					try {
						const toolbar = this.card.querySelector(`div[id][aria-label][role="group"]`);
						const pr_list = Object.getOwnPropertyNames(toolbar);
						const pr_name = pr_list.find((input)=>input.includes('__reactProps$'));
						const data = toolbar[pr_name];
						this.internalData = data?.children[1]?.props?.retweetWithCommentLink?.state?.quotedStatus;
					} catch (e){
						console.warn(`内部データ取得失敗`);
					}
				}

				// ユーザー名(id)取得
				let name_span = div.querySelector(EX_QUERY_DICT.NAME_QUERY);
				if (this._nsOneLoadFlag) {
					this.reTweet._setName(name_span?.innerText);
				} else {
					this._setName(name_span?.innerText);
					// フルネーム取得
					if (this.internalData){
						this.fullName = this.internalData.user.name;
					}
				}

				// id取得(ついでに認証マーク判定)
				let id_span = div.querySelectorAll(EX_QUERY_DICT.ID_QUERY);
				id_span.forEach((span) => {
					let fc = span.querySelector(EX_QUERY_DICT.VERIFY_FORMALITY_QUERY);
					if (fc != null) {
						if (this._nsOneLoadFlag) {
							this.reTweet.formality = true;
						} else {
							this.formality = true;
						}
					}
					fc = span.querySelector(EX_QUERY_DICT.VERIFY_QUERY);
					if (fc != null) {
						if (this._nsOneLoadFlag) {
							this.reTweet.verify = true;
						} else {
							this.verify = true;
						}
					} else {
						let tmp = span.innerText.trim();
						if (tmp.startsWith("@")) {
							if (this._nsOneLoadFlag) {
								this.reTweet.id = tmp;
							} else {
								this.id = tmp;
							}
						}
					}
				});

				this._nsOneLoadFlag = true;
			});

			// 投稿時間取得
			let time_elem = article.querySelector("time");
			if (!time_elem) {
				return false;
			}
			if (!this._setDate(time_elem.dateTime)) return false;

			const pro = [
				// 画像添付確認
				this._imgCheck(article),
				// メニュー取得(...のこと)
				this._getMenu(article),
			];

			this._text_divs = article.querySelectorAll(EX_QUERY_DICT.TEXT_DIV_QUERY);
			let text_div = this._text_divs?.[0];

			let fullStr = "";
			let str = "";
			let emojiLst = [];
			if (text_div) {
				let tmp;
				text_div.childNodes.forEach((elem) => {
					if (useOldTweetDeck) {
						if (elem.nodeType === Node.TEXT_NODE) {
							tmp = elem.nodeValue;
							str += tmp;
							fullStr += tmp;
						} else if (elem.tagName === "IMG") {
							tmp = elem.alt;
							emojiLst.push(tmp);
							fullStr += tmp;
						}
					} else {
						switch (elem.tagName) {
							case "SPAN":
								tmp = elem.innerText;
								str += tmp;
								fullStr += tmp;
								break;
							case "DIV":
								let a = elem.querySelector(`a[href]`);
								tmp = a?.innerText;
								if (!tmp || !tmp.length || !a.href.startsWith("http")){
									break;
								}
								const hld = this.has_link_dict;
								const ld = new LinkData(a.href, tmp);
								switch (tmp.slice(0, 1)) {
									case "@": // メンション
										hld.mention.push(ld);
										break;
									case "#": // ハッシュタグ
										hld.hashtag.push(ld);
										break;
									case "$": // シンボルタグ
										hld.symboltag.push(ld);
										break;
									default:
										hld.url.push(ld);
								}
								fullStr += ld.value;
								break;
							case "IMG":
								tmp = elem.alt;
								emojiLst.push(tmp);
								fullStr += tmp;
								break;
						}
					}
				});
			} else {
				this._notTextDiv = true;
			}

			this._setFullMessage(fullStr);
			this._setMessage(str);
			this.emoji = emojiLst;

			return Promise.all(pro);
		}

		/**
		 * 処理対象か判定/取得
		 * @returns {HTMLElement}
		 */
		_getArticle() {
			let article;
			if (useOldTweetDeck) {
				article = this.card;
			} else {
				article = this.card.firstChild?.firstChild?.firstChild;
			}
			if (article?.tagName != "ARTICLE") {
				return null;
			}
			return article;
		}

		/**
		 * ReTweetである場合
		 * @returns {MessageData}
		 */
		_addReTweet() {
			const md = new MessageData(this.base_url, null);
			this.reTweet = md;
			md.parentTweet = this;
			return md;
		}

		/**
		 * 名前設定
		 * @param {string} name
		 * @returns {undefined}
		 */
		_setName(name = "") {
			this.name = name;
			this.cleanName = normalize(name).replace(CrLfReg, " ");
		}

		/**
		 * メッセージ設定
		 * @param {string} message
		 * @returns {undefined}
		 */
		_setMessage(message = "") {
			this.message = message;
			this.cleanMessage = normalize(message);
			this.message_len = this.cleanMessage.length;
		}
		
		/**
		 * メッセージ設定
		 * @param {string} full_message
		 * @returns {undefined}
		 */
		_setFullMessage(full_message = "") {
			this.fullMessage = full_message;
			this.cleanFullMessage = normalize(full_message);
			this.full_message_len = this.cleanFullMessage.length;
		}

		/**
		 * 日時データ設定
		 * @param {string} date
		 * @returns {boolean}
		 */
		_setDate(date) {
			try {
				this.dateTime = new Date(date);
			} catch (e) {
				console.error(e);
				return false;
			}
			if (this.dateTime.toString() == "Invalid Date") {
				log("日付変換失敗");
				return false;
			}
			this.time_value = this.dateTime.getTime();
			return true;
		}

		/**
		 * 画像添付確認
		 * @param {HTMLElement} article
		 * @returns {Promise<undefined>}
		 */
		_imgCheck(article) {
			const this_ = this;
			return new Promise((resolve) => {
				setTimeout(() => {
					let attach_img = article.querySelectorAll(EX_QUERY_DICT.IMAGE_QUERY);
					//console.log(attach_img)
					if (attach_img) {
						for (let img of attach_img) {
							const src = img.src;
							if (tweetUrlImgReg.test(src)) {
								// 画像
								this_.attach_img = true;
								this_.attach_file_list.push(src);
							} else if (tweetUrlVideoReg.test(src)) {
								// 動画(Gif含む)
								this_.attach_img = true;
								this_.attach_file_list.push(src);
							}
						}
					}
					resolve();
				}, 1000);
			});
		}

		/**
		 * メニュー取得
		 * @param {HTMLElement} article
		 * @returns {Promise<undefined>}
		 */
		_getMenu(article) {
			const this_ = this;
			return new Promise((resolve) => {
				setTimeout(() => {
					let menuDOMs = article.querySelectorAll(EX_QUERY_DICT.MENU_BUTTON_QUERY);
					if (menuDOMs.length >= 3) {
						this_.menuDOM = menuDOMs[0];
					}
					resolve();
				}, 1000);
			});
		}
	}

	// ==========================================================================================
	// 汎用 便利関数
	// ==========================================================================================
	/**
	 * ログを判別しやすく
	 * @param {string} str
	 * @returns {undefined}
	 */
	function log(str) {
		if (DEBUG) {
			console.log(`[${PRO_NAME}]`, str);
		}
	}

	/**
	 * DOMが設置されるまで待機
	 * @param {string} selectorTxt
	 * @param {Function} actionFunction
	 * @param {boolean} [bWaitOnce=true]
	 * @param {string} [actionFunction]
	 * @returns {undefined}
	 */
	function waitForKeyElements(
		selectorTxt, //クエリセレクター
		actionFunction, //実行関数
		bWaitOnce = true, //要素が見つかっても検索を続ける
		iframeName = null //iframeの中の要素の場合はiframeのidを書く
	) {
		var targetNodes, btargetsFound;
		var iframeDocument = document;
		if (iframeName !== null) {
			let iframeElem = document.getElementById(iframeName);

			if (!iframeElem) {
				doRetry();
				return;
			}
			iframeDocument = iframeElem.contentDocument || iframeElem.contentWindow.document;
		}
		targetNodes = iframeDocument.querySelectorAll(selectorTxt);

		if (targetNodes && targetNodes.length > 0) {
			btargetsFound = true;
			targetNodes.forEach(function (element) {
				var alreadyFound = element.dataset.found == "alreadyFound" ? "alreadyFound" : false;

				if (!alreadyFound) {
					var cancelFound;
					if (iframeName !== null) {
						cancelFound = actionFunction(element, iframeDocument);
					} else {
						cancelFound = actionFunction(element);
					}
					if (cancelFound) {
						btargetsFound = false;
					} else {
						element.dataset.found = "alreadyFound";
					}
				}
			});
		} else {
			btargetsFound = false;
		}

		if (btargetsFound && bWaitOnce) {
			//終了
		} else {
			doRetry();
		}

		function doRetry() {
			setTimeout(function () {
				waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeName);
			}, 300);
		}
	}

	/**
	 * 不明な空白を半角スペースに
	 * @param {string} str
	 * @returns {string}
	 */
	function unifiedSpace(str) {
		str = str.toString();
		spaceRegList.forEach((reg) => {
			str = str.replace(reg, " ");
		});
		return str;
	}

	/**
	 * 全ての文字を共通化
	 * @param {string} str
	 * @param {boolean} [useLowerCase=true] - 小文字に統一するか
	 * @returns {string}
	 */
	function normalize(str, useLowerCase = true) {
		str = unifiedSpace(str).normalize("NFKC");
		normalizeRegList.forEach((regs) => {
			str = str.replace(...regs);
		});
		if (useLowerCase) {
			str = str.toLowerCase();
		}
		return str;
	}

	/**
	 * 困った時のレーベンシュタイン距離
	 * @param {string} str1
	 * @param {string} str2
	 * @returns {number}
	 */
	function levenshteinDistance(str1, str2) {
		let r,
			c,
			cost,
			lr = str1.length,
			lc = str2.length,
			d = [];

		for (r = 0; r <= lr; r++) {
			d[r] = [r];
		}
		for (c = 0; c <= lc; c++) {
			d[0][c] = c;
		}
		for (r = 1; r <= lr; r++) {
			for (c = 1; c <= lc; c++) {
				cost = str1.charCodeAt(r - 1) == str2.charCodeAt(c - 1) ? 0 : 1;
				d[r][c] = Math.min(d[r - 1][c] + 1, d[r][c - 1] + 1, d[r - 1][c - 1] + cost);
			}
		}
		return 1 - d[lr][lc] / Math.max(lr, lc);
	}

	/**
	 * unicodeを復元
	 * @param {string} str
	 * @returns {string}
	 */
	function reRegExpStr(str) {
		return unifiedSpace(str).replace(reRegExpReg, function (f, a, b, c) {
			let str = a ?? b ?? c ?? null;
			if (str == null) {
				return f;
			}
			return String.fromCodePoint(parseInt(str, 16));
		});
	}

	// ==========================================================================================
	// 便利関数 GM
	// ==========================================================================================

	/**
	 * GMからjsonを取得
	 * @param {string} key
	 * @returns {Promise<Object>}
	 * @async
	 */
	async function getGM_json(key) {
		let data = null;
		try {
			data = await GM.getValue(key, null);
		} catch (e) {
			console.error(e);
			return null;
		}
		if (data != null) {
			let jsonData = null;
			try {
				jsonData = JSON.parse(data);
			} catch (e) {
				console.error(e);
			}
			return jsonData;
		}
		return null;
	}

	/**
	 * GMにjsonを保存
	 * @param {string} key
	 * @param {Object} obj
	 * @returns {Promise<undefined>}
	 * @async
	 */
	async function setGM_json(key, obj) {
		try {
			await GM.setValue(key, JSON.stringify(obj));
			log(obj);
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * GMのjsonをリセット
	 * @param {string} key
	 * @param {boolean} [useConf=true] - 確認画面を強制するか
	 * @returns {undefined}
	 */
	async function resetGM_json(key, useConf = true) {
		let cf = lang_dict.sureReset;
		if (useConf && confirm(cf)) {
			try {
				await GM.deleteValue(key);
			} catch (e) {
				console.error(e);
			}
			location.reload();
		}
	}

	// ==========================================================================================
	// 便利関数
	// ==========================================================================================
	/**
	 * 正規表現リスト復元
	 * @param {string} tag
	 * @returns {undefined}
	 */
	function regRestoration(tag) {
		let setting_data = SETTING_LIST[tag];
		if (!setting_data) {
			console.warn("不明なtag:" + tag);
			return;
		}
		let spText = setting_data.data.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
		setting_data.regexp_list = [];
		spText.forEach((row) => {
			if (row.trim().length && !row.startsWith("!#")) {
				let tmpReg = reRegExpStr(normalize(row, false));
				try {
					setting_data.regexp_list.push([new RegExp(tmpReg, useRegMode), row]);
				} catch (e) {
					console.error(`[${PRO_NAME}]`, tmpReg, e);
					setting_data.isError = true;
				}
			}
		});
	}

	/**
	 * 正規表現使用モード設定
	 * @returns {undefined}
	 */
	function setRegMode(){
		useRegModeList.s = SETTING_LIST.useRegModeDotAll.data;

		let tmp = "";
		for (key in useRegModeList) {
			if (useRegModeList[key]){
				tmp += key;
			}
		}
		useRegMode = tmp;
	}

	/**
	 * メニュー項目にイベント設定
	 * @param {string} id
	 * @param {Function} callback
	 * @param {string} [type="click"]
	 * @returns {undefined}
	 */
	function setEvent(id, callback, type = "click") {
		document.getElementById(ELEM_NAME_DICT.EX_MENU_ITEM_BASE_ID + id)?.addEventListener(type, callback);
	}

	// ==========================================================================================
	// 初期設定関連
	// ==========================================================================================
	/**
	 * 初期設定(1度しか実行するな)
	 * @returns {Promise<undefined>}
	 * @async
	 */
	async function init() {
		// 親id取得
		setParentId();

		// 設定呼び出し
		log("設定読み込み...開始");
		{
			let jsonData = await getGM_json(SETTING_SAVE_KEY);
			if (jsonData != null) {
				for (let key in SETTING_LIST) {
					if (key in jsonData) {
						SETTING_LIST[key].data = jsonData[key];
					}
				}
			}
		}
		lang_dict = LANGUAGE_DICT[SETTING_LIST.language.data ?? "ja"];
		setRegMode();
		log("設定読み込み...完了");

		//検知id再取得
		if (SETTING_LIST.blackMemory.data) {
			log("検知済id読み込み...開始");
			let jsonData = await getGM_json(BLACK_MEMORY_KEY);
			if (jsonData != null) {
				for (let i = 0, li = jsonData.length; i < li; i++) {
					let id = jsonData[i];
					if (id.length > 1 && id.startsWith("@")) {
						blacklist_id.add(id);
					} else {
						log("破損id:" + id);
					}
				}
			}
			log("検知済id読み込み...完了");
		}

		// フィルター正規表現設定
		{
			// ブラック表現リスト
			regRestoration("blackTextReg");
			// ブラックフル表現リスト
			regRestoration("blackFullTextReg");
			// ホワイト表現リスト
			regRestoration("whiteTextReg");
			// ブラックRT表現リスト
			//regRestoration("blackRtTextReg");
			// ブラック名前リスト
			regRestoration("blackNameReg");
			// サブ垢定義用表現リスト
			regRestoration("subDefinitionReg");
			// プラットフォーム表現リスト
			regRestoration("platformBlackReg");

			// 除外idリスト
			let spText = SETTING_LIST.excludedUsers.data.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

			spText.forEach((row) => {
				if (row.trim().length && !row.startsWith("!#")) {
					if (!row.startsWith("@")) {
						row = "@" + row;
					}
					excludedUsersSet.add(row);
					blacklist_id.delete(row);
				}
			});

			// 投稿の言語を制限
			const allowLang = SETTING_LIST.allowLang;
			try {
				let text = allowLang.data.trim();
				if (text.length) {
					allowLang.regexp = new RegExp(text, "i");
				}
			} catch (e) {
				console.error(e);
				allowLang.isError = true;
			}
		}

		// 画面移管時対応
		const body_observer = new MutationObserver(bodyChangeEvent);
		body_observer.observe(document.body, {
			subtree: true,
			childList: true,
		});

		document.addEventListener('click', () => {
			const htsc = ELEM_NAME_DICT.HIDE_TITLE_SHOW_CLASS;
			for (elem of document.getElementsByClassName(htsc)) {
				elem.classList.remove(htsc);
			}
		});

		// カスタムcss設定
		try {
			GM.addStyle(BASE_CSS);
			GM.addStyle(SETTING_LIST.customCss.data);
		} catch (e) {
			console.error(e);
			SETTING_LIST.customCss.isError = true;
		}

		// 文章類似比較を実行するか
		if (!SETTING_LIST.maxSaveTextSize.data || SETTING_LIST.maxSaveTextSize.data < SETTING_LIST.minSaveTextSize.data) {
			levenshteinDistanceUseFlag = false;
		}
		// OldTweetDeckを使用するか
		if (SETTING_LIST.enableOldTweetDeckMode.data && isPageOldTweetDeck) {
			useOldTweetDeck = true;
			document.body.classList.add(ELEM_NAME_DICT.USE_TWEET_DECK_CLASS);
		}
		//
		if(!SETTING_LIST.useTwitterInternalData.data || useOldTweetDeck){
			internalDataRefFlag = false;
		}


		card_init();
		// 自動で設定画面を開く
		if (SETTING_LIST.debug_viewSettingMenu.data) {
			menuOpen();
		}

		if (useOldTweetDeck && SETTING_LIST.autoLoadJQuery.data && typeof $ === "undefined") {
			let script = document.createElement("script");
			script.type = "text/javascript";
			script.onload = function () {
				log("jQuery " + $.fn.jquery + " loaded successfully!");
			};
			script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
			document.head.appendChild(script);
		}
	}

	// ==========================================================================================
	// イベント関連
	// ==========================================================================================

	/**
	 * メッセージの親を取得
	 * @returns {undefined}
	 */
	function setParentId() {
		let url = oldUrl.replace(/https?:\/\/.*?\.com/, "");
		if (url.startsWith("/")) {
			let urls = url.replace(/\?/, "/").split("/");
			let uid = urls[1] ?? urls[0];
			if (ALLOW_PAGE_SET.has(uid)) {
				stopFlag = true;
				return;
			}
			const isStatusType = urls[2] ?? "";
			console.log(`isStatusType: ${isStatusType}`);
			if (!ALLOW_STATUS_SET.has(isStatusType)) {
				stopFlag = true;
				return;
			}
			isPageOldTweetDeck = isStatusType === "tweetdeck";
			if (uid) {
				uid = "@" + uid;
				log(`親投稿者: ${uid}`);
				parent_id = uid;
				stopFlag = false;
				// 気分で消しとく
				blacklist_id.delete(uid);
			}
		}
	}

	/**
	 * 画面移管対応
	 * @returns {undefined}
	 */
	function bodyChangeEvent() {
		// 更新過多で重くなるので同時実行禁止
		if (body_isWait) {
			body_isReservation = true;
			return;
		}
		body_isWait = true;
		// 反応しない場合用に一瞬待機
		setTimeout(function () {
			// URL変更時のみ
			if (oldUrl !== location.href) {
				oldUrl = location.href;
				setParentId();
			}
			if (!document.querySelector("." + ELEM_NAME_DICT.PARENT_CLASS)) {
				// class 検知
				if (parent_observer) {
					parent_observer.disconnect();
					parent_observer = null;
				}
				card_init();
			}
			body_isWait = false;
			// 一応再実行
			if (body_isReservation) {
				body_isReservation = false;
				bodyChangeEvent();
			}
		}, SETTING_LIST.bodyObsTimeout.data);
	}

	/**
	 * tabをtextareaで入力可能に
	 * @param {Object} e
	 * @returns {undefined}
	 */
	function OnTabKey(e) {
		if (e.keyCode != 9) {
			return;
		}
		e.preventDefault();

		let obj = e.target;

		// 現在のカーソルの位置と、カーソルの左右の文字列を取得
		var cursorPosition = obj.selectionStart;
		var cursorLeft = obj.value.substr(0, cursorPosition);
		var cursorRight = obj.value.substr(cursorPosition, obj.value.length);

		obj.value = cursorLeft + "\t" + cursorRight;

		// カーソルの位置を入力したタブの後ろにする
		obj.selectionEnd = cursorPosition + 1;
	}

	// ==========================================================================================
	// メニュー関連
	// ==========================================================================================
	/**
	 * メニュー初期設定(実質1度しか実行するな)
	 * @returns {undefined}
	 */
	function menu_init() {
		const w_exMenuDOM = document.createElement("div");
		const sub_details_list = {};
		for (let k in MENU_GROUP_TYPE) {
			const v = MENU_GROUP_TYPE[k];
			if (v !== MENU_GROUP_TYPE.basic) {
				const e = document.createElement("details");
				sub_details_list[v] = e;
				e.innerHTML = `<summary>${lang_dict[`menu_${v}`]}</summary>`;
			}
		}
		w_exMenuDOM.innerHTML = lang_dict.menu_warn;
		for (let key in SETTING_LIST) {
			let item = SETTING_LIST[key];
			// 入力欄作成
			let inputType = item?.input ?? "";
			let input_elem = document.createElement("input");
			input_elem.type = inputType;
			input_elem.id = ELEM_NAME_DICT.EX_MENU_ITEM_BASE_ID + key;
			let add_elem = null;
			switch (inputType) {
				case MENU_INPUT_TYPE.text:
					input_elem.value = item.data;
					break;
				case MENU_INPUT_TYPE.num:
					input_elem.value = item.data;
					if (item?.min != null) {
						input_elem.min = item.min;
					}
					if (item?.max != null) {
						input_elem.max = item.max;
					}
					if (item?.step != null) {
						input_elem.step = item.step;
					}
					break;
				case MENU_INPUT_TYPE.check:
					input_elem.checked = item?.data ?? false;
					add_elem = document.createElement("label");
					add_elem.htmlFor = input_elem.id;
					break;
				case MENU_INPUT_TYPE.btn:
					input_elem.value = item.value;
					break;
				case MENU_INPUT_TYPE.textarea:
					input_elem = document.createElement("textarea");
					input_elem.value = item.data;
					break;
				case MENU_INPUT_TYPE.select:
					input_elem = document.createElement("select");
					if (item?.select) {
						let tmp = "";
						for (let key in item.select) {
							tmp += `<option value="${key}" ${SETTING_LIST.language.data == key ? "selected" : ""}>${item.select[key]}</option>`;
						}
						input_elem.innerHTML = tmp;
					}
					break;
				default:
					console.warn("対応していない形式", item);
					continue;
			}

			// 項目を囲うdiv
			let div = document.createElement("div");
			// 名前
			const trans_name = lang_dict[MENU_LANG_KEY + key + MENU_LANG_KEY_NAME];
			if (trans_name) {
				let name_elem = document.createElement("p");
				name_elem.textContent = trans_name;
				name_elem.classList.add(ELEM_NAME_DICT.EX_MENU_ITEM_BASE_ID + "_name");
				div.appendChild(name_elem);
			} else if (trans_name == null) {
				console.warn(`翻訳情報の欠落: ${MENU_LANG_KEY + key + MENU_LANG_KEY_NAME}`);
			}
			// 説明
			const trans_explanation = lang_dict[MENU_LANG_KEY + key + MENU_LANG_KEY_EXPLANATION];
			if (trans_explanation) {
				let ex_elem = document.createElement("p");
				ex_elem.innerHTML = trans_explanation.replace(/\n/g, "<br/>");
				div.appendChild(ex_elem);
			} else if (trans_name == null) {
				console.warn(`翻訳情報の欠落: ${MENU_LANG_KEY + key + MENU_LANG_KEY_EXPLANATION}`);
			}

			div.appendChild(input_elem);
			if (add_elem) {
				div.appendChild(add_elem);
			}

			if (item.isError) {
				let errDOM = document.createElement("p");
				errDOM.classList.add(EX_MENU_ITEM_ERROR_CLASS);
				errDOM.textContent = lang_dict.menu_error;
				div.appendChild(errDOM);
			}

			if (MENU_GROUP_TYPE.basic == item.group) {
				w_exMenuDOM.appendChild(div);
			} else {
				let e = sub_details_list[item.group];
				if (e) {
					e.appendChild(div);
				} else {
					console.warn("存在しないグループ:", item.group);
				}
			}
		}
		for (let k in sub_details_list) {
			w_exMenuDOM.appendChild(sub_details_list[k]);
		}
		// 画面右下のボタン系
		{
			let div = document.createElement("div");
			div.id = ELEM_NAME_DICT.EX_MENU_ITEM_BASE_ID + "__btns";
			let btn_elem = document.createElement("input");
			btn_elem.type = "button";
			btn_elem.value = lang_dict.save;
			btn_elem.id = ELEM_NAME_DICT.EX_MENU_ITEM_BASE_ID + "__save";
			div.appendChild(btn_elem);
			btn_elem = document.createElement("input");
			btn_elem.type = "button";
			btn_elem.value = lang_dict.close;
			btn_elem.id = ELEM_NAME_DICT.EX_MENU_ITEM_BASE_ID + "__close";
			div.appendChild(btn_elem);
			w_exMenuDOM.appendChild(div);
		}
		exMenuDOM = document.createElement("div");
		exMenuDOM.id = EX_MENU_ID;
		exMenuDOM.lang = SETTING_LIST.language.data;
		if (isMobile) {
			exMenuDOM.classList.add(ELEM_NAME_DICT.MOBILE_FLAG_CLASS);
		} else {
			exMenuDOM.classList.add(ELEM_NAME_DICT.PC_FLAG_CLASS);
		}
		exMenuDOM.appendChild(w_exMenuDOM);
	}

	/**
	 * メニューを開く
	 * @returns {undefined}
	 */
	function menuOpen() {
		log("メニュー表示...開始");
		if (!exMenuDOM) {
			menu_init();
		}

		// DOM 取得
		let menu_elem = document.getElementById(EX_MENU_ID);
		if (!menu_elem) {
			// なければ複製して追加
			menu_elem = exMenuDOM.cloneNode(true);
			document.body.appendChild(menu_elem);
			setEvent("__save", menuSave);
			setEvent("__close", menuClose);

			setEvent("customCss", OnTabKey, "keydown");
			setEvent("resetSetting", menuReset);
			setEvent("resetBlackMemory", blacklistReset);
			setEvent("debug_viewBlacklist", function () {
				console.log(blacklist_id);
			});
			setEvent("debug_viewMsgDB", function () {
				console.log(msgDB_id, msgDB);
			});
			setEvent("debug_reInit", card_init);
		}
		menu_elem.classList.add(ELEM_NAME_DICT.EX_MENU_OPEN_CLASS);
		log("メニュー表示...完了");
	}

	/**
	 * メニューを閉じる
	 * @returns {undefined}
	 */
	function menuClose() {
		log("メニュー非表示");
		let menu_elem = document.getElementById(EX_MENU_ID);
		if (menu_elem) {
			menu_elem.classList.remove(ELEM_NAME_DICT.EX_MENU_OPEN_CLASS);
		}
	}

	/**
	 * 設定項目保存
	 * @returns {Promise<undefined>}
	 * @async
	 */
	async function menuSave() {
		log("設定保存...開始");
		for (let key in SETTING_LIST) {
			let item = SETTING_LIST[key];

			let elem = document.getElementById(ELEM_NAME_DICT.EX_MENU_ITEM_BASE_ID + key);
			if (elem) {
				let data = null;
				switch (item.input) {
					case MENU_INPUT_TYPE.text:
					case MENU_INPUT_TYPE.textarea:
						data = elem.value;
						break;
					case MENU_INPUT_TYPE.num:
						data = parseFloat(elem.value);
						if (item?.min != null && item.min > data) {
							data = item.min;
						}
						if (item?.max != null && item.max < data) {
							data = item.max;
						}
						break;
					case MENU_INPUT_TYPE.check:
						data = elem.checked;
						break;
					case MENU_INPUT_TYPE.select:
						for (let i = 0; i < elem.length; i++) {
							if (elem[i]?.selected) {
								data = elem[i].value;
								break;
							}
						}
						break;
					default:
						continue;
				}
				if (data == null) {
					continue;
				}
				item.data = data;
			}
		}
		let dic = {};
		for (let key in SETTING_LIST) {
			let d = SETTING_LIST[key].data;
			let _d = SETTING_LIST[key].initData;
			if (d != null && d != _d) {
				dic[key] = d;
			}
		}
		await setGM_json(SETTING_SAVE_KEY, dic);
		log("設定保存...完了");
		menuClose();
	}

	/**
	 * 設定項目リセット
	 * @returns {undefined}
	 */
	async function menuReset() {
		resetGM_json(SETTING_SAVE_KEY);
	}

	// ==========================================================================================
	// カード 関連
	// ==========================================================================================

	/**
	 * カード初期化
	 * @returns {undefined}
	 */
	function card_init() {
		log("初期化中...");

		let tmp = document.querySelector(EX_QUERY_DICT.OBS_QUERY);
		if (tmp && tmp.classList.contains(ELEM_NAME_DICT.PARENT_CLASS)) {
			console.log("MutationObserverはすでに設定されています！");
			return;
		}
		// もっと見るフラグ初期化
		existMoreTweet = false;

		// 表示待機
		waitForKeyElements(EX_QUERY_DICT.OBS_QUERY, function () {
			// (投稿リストの)親を取得
			parentDOM = document.querySelector(EX_QUERY_DICT.OBS_QUERY);
			if (parentDOM == null) {
				log(`(${EX_QUERY_DICT.OBS_QUERY})が見つけれませんでした`);
				return;
			}
			parentDOM.classList.add(ELEM_NAME_DICT.PARENT_CLASS);

			// DOM変更検知(イベント)
			parent_observer = new MutationObserver((records) => {
				records.forEach((record) => {
					let addNodes = record.addedNodes;
					if (addNodes.length) {
						addNodes.forEach((addNode) => {
							cardCheck(addNode);
						});
					}
				});
			});
			const observe_setting = {
				childList: true,
			};
			if (useOldTweetDeck) {
				observe_setting.subtree = true;
			}
			parent_observer.observe(parentDOM, observe_setting);

			// 先頭部分が取得出来ていないので再実行
			parentDOM.querySelectorAll(EX_QUERY_DICT.RE_QUERY).forEach((elem) => {
				cardCheck(elem);
			});
		});
	}

	/**
	 * 処理対象判定&処理実行(疑似的に非同期処理に)
	 * @param {HTMLElement} card_elem
	 * @returns {undefined}
	 */
	function cardCheck(card_elem) {
		if (useOldTweetDeck && !(card_elem instanceof HTMLElement)) {
			return;
		}

		// 処理は1度のみ
		const CHECK_CLASS = ELEM_NAME_DICT.CHECK_CLASS;
		if (card_elem.classList.contains(CHECK_CLASS)) {
			return;
		}
		card_elem.classList.add(CHECK_CLASS);

		// もっと見るが判定されてしまう問題をゴリ押しで対処
		if (existMoreTweet) {
			const MORE_TWEET_CLASS = ELEM_NAME_DICT.MORE_TWEET_CLASS;
			let tmp_elem = card_elem;
			for (let i = 0; i < 5; i++) {
				tmp_elem = tmp_elem.previousElementSibling;
				if (!tmp_elem) {
					break;
				}
				if (tmp_elem.classList.contains(MORE_TWEET_CLASS)) {
					card_elem.classList.add(MORE_TWEET_CLASS);
					return;
				}
			}
		} else {
			if (card_elem.querySelector("h2")) {
				existMoreTweet = true;
				card_elem.classList.add(ELEM_NAME_DICT.MORE_TWEET_CLASS);
			}
		}

		const md = new MessageData(oldUrl, card_elem);
		// 有効なデータか判定
		let getPro = md.cardDataGet();
		if (getPro === false) return;
		getPro
			.then(() => {
				let ret = commentFilter(md);
				let id;

				switch (ret[0]) {
					case FILTED_HIDDEN_ID.processed:
						// 処理済
						return;
					case FILTED_HIDDEN_ID.evaluated:
						// 取得,判定済投稿
						return;
					case FILTED_HIDDEN_ID.newEntry:
						// 問題なし
						addDB(md);
						return;
					case FILTED_HIDDEN_ID.commentFilterDetection:
						// コメントフィルターに反応
						hideComment(md, lang_dict.filterDetection, `comment_${lang_dict.filter}「/${ret[1]}/${useRegMode}」`);
						return;
					case FILTED_HIDDEN_ID.fullCommentFilterDetection:
						// フルコメントフィルターに反応
						hideComment(md, lang_dict.filterDetection, `full_comment_${lang_dict.filter}「/${ret[1]}/${useRegMode}」`);
						return;
					case FILTED_HIDDEN_ID.commentEmojiOnly:
						// 絵文字のみ(スパム)
						hideComment(md, lang_dict.emojiOnly, "comment");
						return;
					case FILTED_HIDDEN_ID.textDuplication:
						// コピペ
						hideComment(md, lang_dict.textDuplication, `${lang_dict.similarity}:${((ret[1] * 10000) | 0) / 100}%`);
						return;
					case FILTED_HIDDEN_ID.highUsage:
						// 異常なハッシュタグの使用
						hideComment(md, lang_dict.highUsage, `${lang_dict.usageCount}: ${ret[1]}`);
						return;
					case FILTED_HIDDEN_ID.selfCitation:
						// 自分自身の引用
						hideComment(md, lang_dict.selfCitation);
						return;
					case FILTED_HIDDEN_ID.nameFilterDetection:
						// 名前フィルターに反応
						hideComment(md, lang_dict.filterDetection, `name_${lang_dict.filter}「/${ret[1]}/${useRegMode}」`);
						return;
					case FILTED_HIDDEN_ID.nameEmojiOnly:
						// 名前が絵文字のみ
						hideComment(md, lang_dict.emojiOnly, "name");
						return;
					case FILTED_HIDDEN_ID.verifyRtBlock:
						// 認証済アカウントをRTするな
						hideComment(md, lang_dict.verifyRtBlock);
						return;
					case FILTED_HIDDEN_ID.symbolUsage:
						// 異常なシンボルタグの使用
						hideComment(md, lang_dict.symbolUsage, `${lang_dict.usageCount}: ${ret[1]}`);
						return;
					case FILTED_HIDDEN_ID.detectedElsewhere:
						// 他で検出済
						hideComment(md, lang_dict.detectedElsewhere);
						return;
					case FILTED_HIDDEN_ID.authenticatedAccount:
						// 認証済アカウント
						hideComment(md, lang_dict.authenticatedAccount);
						return;
					case FILTED_HIDDEN_ID.unauthorizedLanguage:
						// 投稿言語の制限
						hideComment(md, lang_dict.unauthorizedLanguage, `${ret[1]}`);
						return;
					case FILTED_HIDDEN_ID.selfCitationSub:
						// サブ垢で己をRTすんな
						hideComment(md, lang_dict.selfCitationSub, `${lang_dict.filter}「/${ret[1]}/${useRegMode}」`);
						return;
					case FILTED_HIDDEN_ID.contributtonCount:
						// 連投検出
						hideComment(md, lang_dict.contributtonCount);
						return;
					case FILTED_HIDDEN_ID.rtContributtonCount:
						// RT連投検出
						hideComment(md, lang_dict.rtContributtonCount);
						return;
					case FILTED_HIDDEN_ID.rtSharingSeries:
						// 同一ユーザーRT検出
						for (let msgData of ret[1]) {
							hideComment(msgData, lang_dict.rtSharingSeries);
						}
						return;
					case FILTED_HIDDEN_ID.platformFilterDetection:
						// プラットフォームフィルター検出
						hideComment(md, lang_dict.platformFilterDetection, `platform_${lang_dict.filter}「/${ret[1]}/${useRegMode}」`)
						return;
				}
			})
			.catch(console.warn);
	}

	// ==========================================================================================
	// フィルター
	// ==========================================================================================
	/**
	 * コメントをフィルタリング
	 * @param {MessageData} md
	 * @returns {number}
	 */
	function commentFilter(md) {
		// log(md);

		// 投稿主保護
		if (md.id == parent_id) {
			addDB(md);
			return [FILTED_HIDDEN_ID.processed];
		}
		// 除外ユーザー保護
		if (excludedUsersSet.has(md.id)) {
			addDB(md);
			return [FILTED_HIDDEN_ID.processed];
		}
		// 認証公式アカウント保護
		if (SETTING_LIST.formalityCare.data && md.formality) {
			addDB(md);
			return [FILTED_HIDDEN_ID.processed];
		}
		// blacklist_id比較
		if (blacklist_id.has(md.id)) {
			return [FILTED_HIDDEN_ID.detectedElsewhere];
		}
		// 認証済アカウント強制ブロック
		if (SETTING_LIST.verifyBlock.data && md.verify) {
			return [FILTED_HIDDEN_ID.authenticatedAccount];
		}
		// 投稿プラットフォームフィルター
		if (internalDataRefFlag && md.internalData?.source_name) {
			const source_name = normalize(md.internalData.source_name);
			for (let reg of SETTING_LIST.platformBlackReg.regexp_list) {
				if (reg[0].test(source_name)) {
					return [FILTED_HIDDEN_ID.platformFilterDetection, reg[1]];
				}
			}
		}
		// 投稿言語の制限
		if (!useOldTweetDeck) {
			for (let div of md._text_divs) {
				if (!SETTING_LIST.allowLang.regexp.test(div.lang)) {
					return [FILTED_HIDDEN_ID.unauthorizedLanguage, div.lang];
				}
			}
		}

		// 無言で無言の引用リツイートしている場合
		if (md.reTweet && md._notTextDiv) {
			// 自分自身の場合
			if (SETTING_LIST.oneselfRetweetBlock.data && md.reTweet.id == md.id) {
				return [FILTED_HIDDEN_ID.selfCitation];
			}
			// 認証済アカウントをRTするな
			if (SETTING_LIST.verifyRtBlock.data && md.reTweet.verify) {
				return [FILTED_HIDDEN_ID.verifyRtBlock];
			}
			//サブ垢判定
			if (SETTING_LIST.oneselfSubRetweetBlock) {
				for (let reg of SETTING_LIST.subDefinitionReg.regexp_list) {
					if (md.cleanName.replace(reg[0], "") == md.reTweet.cleanName.replace(reg[0], "")) {
						return [FILTED_HIDDEN_ID.selfCitationSub, reg[1]];
					}
				}
			}
		}
		const message = md.cleanMessage;
		if (SETTING_LIST.emojiOnryBlock.data && !message.replace(spaceReg, "").length && !md.attach_img) {
			return [FILTED_HIDDEN_ID.commentEmojiOnly];
		}
		if (SETTING_LIST.emojiOnryNameBlock.data && !md.name.replace(spaceReg, "")?.length) {
			md.name = md.id;
			return [FILTED_HIDDEN_ID.nameEmojiOnly];
		}

		// 引用リツイートしている場合
		if (md.reTweet && !md._notTextDiv) {
			// 自分自身の場合
			if (SETTING_LIST.oneselfRetweetBlock.data && md.reTweet.id == md.id) {
				return [FILTED_HIDDEN_ID.selfCitation];
			}
			// 認証済アカウントをRTするな
			if (SETTING_LIST.verifyRtBlock.data && md.reTweet.verify) {
				return [FILTED_HIDDEN_ID.verifyRtBlock];
			}
			//サブ垢判定
			if (SETTING_LIST.oneselfSubRetweetBlock) {
				for (let reg of SETTING_LIST.subDefinitionReg.regexp_list) {
					if (md.cleanName.replace(reg[0], "") == md.reTweet.cleanName.replace(reg[0], "")) {
						return [FILTED_HIDDEN_ID.selfCitationSub, reg[1]];
					}
				}
			}
		}

		// コメントフィルターによる検出
		for (let reg of SETTING_LIST.blackTextReg.regexp_list) {
			if (reg[0].test(message)) {
				return [FILTED_HIDDEN_ID.commentFilterDetection, reg[1]];
			}
		}
		// フルコメントフィルターによる検出
		const full_message = md.cleanFullMessage;
		for (let reg of SETTING_LIST.blackFullTextReg.regexp_list) {
			if (reg[0].test(full_message)) {
				return [FILTED_HIDDEN_ID.fullCommentFilterDetection, reg[1]];
			}
		}
		// 名前フィルターによる検出
		const username = md.cleanName;
		for (let reg of SETTING_LIST.blackNameReg.regexp_list) {
			if (reg[0].test(username)) {
				return [FILTED_HIDDEN_ID.nameFilterDetection, reg[1]];
			}
		}

		// 異常なハッシュタグの使用回数
		let hashtagCou = message.match(/#[^ ]+/g)?.length ?? 0;
		if (hashtagCou >= SETTING_LIST.maxHashtagCount.data) {
			return [FILTED_HIDDEN_ID.highUsage, hashtagCou];
		}
		// 異常なシンボルタグの使用回数
		let symboltagCou = message.match(/\$[^ ]+/g)?.length ?? 0;
		if (symboltagCou >= SETTING_LIST.maxSymboltagCount.data) {
			return [FILTED_HIDDEN_ID.symbolUsage, symboltagCou];
		}

		// 短い文字列は比較しない(誤爆対処)
		let min_sts = SETTING_LIST.minSaveTextSize.data;
		if (levenshteinDistanceUseFlag && md.message_len >= min_sts) {
			// コピぺチェック
			let max_sts = SETTING_LIST.maxSaveTextSize.data;
			let al = md.message_len;
			let am = md.time_value;
			for (let msgData of msgDB) {
				let a = message;
				let b = msgData.cleanMessage;
				let bl = msgData.message_len;
				let m = Math.min(al, bl, max_sts);
				if (m < min_sts) {
					continue;
				}
				if (m != al) {
					a = a.substring(0, m);
				}
				if (m != bl) {
					b = b.substring(0, m);
				}

				// 一度取得したツイートだった場合
				let bm = msgData.time_value;
				if (am == bm && md.id == msgData.id && md.cleanMessage == msgData.cleanMessage) {
					return [FILTED_HIDDEN_ID.evaluated];
				}

				let ld = levenshteinDistance(a, b);
				if (ld >= SETTING_LIST.msgResemblance.data) {
					if (am > bm) {
						return [FILTED_HIDDEN_ID.textDuplication, ld];
					} else {
						blacklist_id.add(msgData.id);
						break;
					}
				}
			}
		} else {
			// 比較が行われない場合の代替処理
			let am = md.time_value;
			for (let msgData of msgDB) {
				let bm = msgData.time_value;
				if (am == bm && md.id == msgData.id && md.cleanMessage == msgData.cleanMessage) {
					return [FILTED_HIDDEN_ID.evaluated];
				}
			}
		}

		let id = md.id;
		if (!useOldTweetDeck && msgDB_id.has(id)) {
			let bu = md.base_url;
			// 連投検出
			if (SETTING_LIST.maxContributtonCount.data > 0) {
				let cou = 0;
				for (let msgData of msgDB) {
					if (msgData.id == id && msgData.base_url == bu) {
						cou++;
					}
				}
				if (SETTING_LIST.maxContributtonCount.data <= cou) {
					return [FILTED_HIDDEN_ID.contributtonCount];
				}
			}
			// RT連投検出
			if (SETTING_LIST.maxRtCount.data > 0 && md.reTweet) {
				let cou = 0;
				let rtl = new Set(md.reTweet.id);
				for (let msgData of msgDB) {
					if (msgData.id == id && msgData.base_url == bu && msgData.reTweet) {
						cou++;
						rtl.add(msgData.reTweet.id);
					}
				}
				if (SETTING_LIST.maxRtCount.data <= cou) {
					// 引用先も一応抹消
					for (let rt of rtl) {
						blacklist_id.add(rt);
					}
					return [FILTED_HIDDEN_ID.rtContributtonCount];
				}
			}
			// 同一ユーザーRT検出
			if (SETTING_LIST.maxSameRtCount.data > 0 && md.reTweet) {
				let rt = md.reTweet.id;
				let cou = 0;
				let us = new Set(id);
				let usd = [md];
				for (let msgData of msgDB) {
					if (msgData.base_url == bu && msgData.reTweet?.id == rt) {
						cou++;
						if (!us.has(msgData.id)) {
							us.add(msgData.id);
							usd.push(msgData);
						}
					}
				}
				if (SETTING_LIST.maxRtCount.data <= cou) {
					// 引用先も一応抹消
					blacklist_id.add(rt);
					return [FILTED_HIDDEN_ID.rtSharingSeries, usd];
				}
			}
		}

		return [FILTED_HIDDEN_ID.newEntry];
	}

	// ==========================================================================================
	// tweet操作
	// ==========================================================================================

	/**
	 * ツイート非表示
	 * @param {MessageData} md
	 * @param {string} reason - 理由
	 * @param {boolean} [ch=true] - 2重参照回避
	 * @returns {undefined}
	 */
	function hideComment(md, reason, title="", ch = true) {
		// TLTW以外では大人しく
		if (stopFlag) {
			addDB(md);
			return;
		}
		// 認証済アカウントのみ判定
		if (SETTING_LIST.verifyOnryFilter.data && !md.verify) {
			addDB(md);
			return;
		}
		blacklist_id.add(md.id);

		// フィルターによる検出
		for (let reg of SETTING_LIST.whiteTextReg.regexp_list) {
			if (reg[0].test(md.cleanMessage)) {
				return;
			}
		}

		md.card.classList.add(ELEM_NAME_DICT.HIDE_CLASS);

		if (SETTING_LIST.visibleLog.data) {
			let div = document.createElement("div");
			div.classList.add(ELEM_NAME_DICT.LOG_CLASS);

			let bstw = lang_dict.viewOriginalTweet;

			let isVerify = "";
			if (SETTING_LIST.visibleVerifyLog.data && md.verify) {
				isVerify = VERIFY_SVG;
			}

			// フルネームが取得できたならそれを使用
			let name = md.name;
			if(md.fullName){
				name = md.fullName;
			}

			div.innerHTML = /* html */ `
<span><a href="/${md.id.slice(1)}" title="${md.id}">${name}</a> ${isVerify}</span>

<label><input type="checkbox">${bstw}</label>
`;
			{
				const titleSpan = document.createElement("span");
				titleSpan.classList.add(ELEM_NAME_DICT.HIDE_TITLE_CLASS);
				titleSpan.textContent = `[${reason}]`;
				div.firstElementChild.prepend(titleSpan);

				if(title){
					titleSpan.title = title;

					const bubble = document.createElement('div');
					bubble.classList.add(ELEM_NAME_DICT.HIDE_TITLE_BUBBLE_CLASS);
					bubble.textContent = title;
					titleSpan.appendChild(bubble);

					const parentDiv = document.getElementsByClassName(ELEM_NAME_DICT.PARENT_CLASS)[0];
					const parentDivRect = parentDiv.getBoundingClientRect()

					function toggleTooltip(titleSpan, bubble) {
						titleSpan.classList.toggle(ELEM_NAME_DICT.HIDE_TITLE_SHOW_CLASS);
				
						const bs = bubble.style;
						if (titleSpan.classList.contains(ELEM_NAME_DICT.HIDE_TITLE_SHOW_CLASS)) {
							// 画面端にはみ出ていないかチェックして位置調整
							const bubbleRect = bubble.getBoundingClientRect();
							const padding = 5;
				
							if (bubbleRect.left - parentDivRect.left < padding) {
								bs.left = `${padding}px`;
								bs.transform = "translateX(0)";
							} else if (bubbleRect.right - parentDivRect.right > parentDiv.innerWidth - padding) {
								bs.left = "auto";
								bs.right = `${padding}px`;
								bs.transform = "translateX(0)";
							} else {
								bs.left = "50%";
								bs.right = "auto";
								bs.transform = "translateX(-50%)";
							}
						} else {
							bs.left = "";
							bs.right = "";
							bs.transform = "";
						}
					}

					titleSpan.addEventListener('click', (e) => {
						e.stopPropagation();
						toggleTooltip(titleSpan, bubble);
					});
				}
			}
			if (!useOldTweetDeck){
				if (SETTING_LIST.visibleBlockButton.data) {
					const blockBtn = document.createElement("input");
					blockBtn.type = "button";
					blockBtn.value = "Block";
					div.firstElementChild.appendChild(blockBtn);
					blockBtn.addEventListener("click", function () {
						twitterMenuClicker(EX_QUERY_LIST_DICT.BLOCK_QUERY_LIST, md);
					});
				}
				if (SETTING_LIST.visibleReportButton.data) {
					const reportBtn = document.createElement("input");
					reportBtn.type = "button";
					reportBtn.value = "Report";
					div.firstElementChild.appendChild(reportBtn);
					reportBtn.addEventListener("click", function () {
						twitterMenuClicker(EX_QUERY_LIST_DICT.REPORT_QUERY_LIST, md);
					});
				}
				// デバッグ
				if (SETTING_LIST.debug_visibleCardDebugButton.data) {
					const devBtn = document.createElement("input");
					devBtn.type = "button";
					devBtn.value = "dev";
					div.firstElementChild.appendChild(devBtn);
					devBtn.addEventListener("click", function () {
						console.log(md);
					});
				}
			}
			md.card.prepend(div);
		}
		// 無駄な比較をしないように
		if (ch) {
			dbCommentBlock(md.id);

			if (!useOldTweetDeck && SETTING_LIST.autoBlock.data) {
				console.log(`自動ブロック: ${md.name}(${md.id})
理由: ${reason}`);

				twitterMenuClicker(EX_QUERY_LIST_DICT.BLOCK_QUERY_LIST, md);
			}

			// 検知済id保存
			blacklistSave();
		}
	}

	// --------------------------------------------------
	/**
	 * twitterのメニューを開くやつ
	 * @param {string[]} list
	 * @param {Object} mesData
	 * @returns {undefined}
	 */
	function twitterMenuClicker(list, mesData) {
		if (!mesData.menuDOM) {
			return;
		}
		mesData.menuDOM.click();
		blacklist_id.delete(mesData.id);
		autoClick(list);
	}

	// --------------------------------------------------
	/**
	 * 自動クリック
	 * @param {string[]} list
	 * @param {HTMLElement} [par=document.body]
	 * @param {Object} [i=0]
	 * @returns {undefined}
	 */
	function autoClick(list, par = document.body, i = 0) {
		if (list.length <= i) {
			return;
		}
		let q = list[i];
		let j = 0;
		if (Array.isArray(q)) {
			j = q[1];
			q = q[0];
		}
		if (q === "__wait__") {
			setTimeout(function () {
				autoClick(list, par, i + 1);
			}, j);
			return;
		}
		let elem = par.querySelectorAll(q)?.[j];
		// console.log(q,elem)
		if (elem) {
			elem.click();
			autoClick(list, par, i + 1);
			return;
		}
		setTimeout(function () {
			autoClick(list, par, i);
		}, 100);
	}

	// ==========================================================================================
	// msgDB操作
	// ==========================================================================================

	/**
	 * msgDBに追加
	 * @param {MessageData} md
	 * @returns {undefined}
	 */
	function addDB(md) {
		msgDB_id.add(md.id);
		/*// 短いと誤爆するため
        if (md.message_len < SETTING_LIST.minSaveTextSize.data) {
            return;
        }*/
		if (msgDB.length > SETTING_LIST.maxSaveLogSize.data) {
			msgDB.shift();
		}
		msgDB.push(md);
		log(msgDB.length);
	}

	/**
	 * 後からblacklist_idに登録された場合
	 * @param {string} id
	 * @returns {undefined}
	 */
	function dbCommentBlock(id) {
		if (msgDB_id.has(id)) {
			for (let i = msgDB.length - 1; i >= 0; i--) {
				const md = msgDB[i];
				if (md?.id == id) {
					msgDB.splice(i, 1);
					if (md.base_url == oldUrl) {
						hideComment(md, lang_dict.recursiveDetection, null, false);
					}
				}
			}
			msgDB_id.delete(id);
		}
	}

	/**
	 * 検知済id保存
	 * @returns {Promise<undefined>}
	 * @async
	 */
	async function blacklistSave() {
		if (SETTING_LIST.blackMemory.data) {
			log("検知済id保存...開始");
			await setGM_json(BLACK_MEMORY_KEY, Array.from(blacklist_id));
			log("検知済id保存...完了");
		}
	}

	/**
	 * 検知済idリセット
	 * @returns {undefined}
	 */
	function blacklistReset() {
		resetGM_json(BLACK_MEMORY_KEY);
	}

	// ==========================================================================================
	// 本体
	// ==========================================================================================
	log("起動中...");

	init();

	// メニュー表示ボタン定義
	if (GM?.registerMenuCommand && !isMobile) {
		const menu_command_id_1 = GM.registerMenuCommand(
			"Settings",
			function (event) {
				menuOpen();
			},
			{
				accessKey: "s",
				autoClose: true,
			}
		);
	} else {
		let btn = document.createElement("input");
		btn.id = EX_MENU_OPEN_BUTTON;
		btn.addEventListener("click", () => {
			menuOpen();
		});
		btn.type = "button";
		btn.value = "disp:menu";
		waitForKeyElements(`body`, (e) => {
			e.appendChild(btn);
		});
	}
})();
