// ==UserScript==
// @id             Thumbnail_on_Twitter
// @name           Thumbnail_on_Twitter
// @version        3.15
// @namespace      https://greasyfork.org/scripts/2584
// @homepageURL    https://greasyfork.org/scripts/2584
// @license        https://creativecommons.org/licenses/by-nc-sa/3.0/
// @author         noi
// @description    Add thumbnail @twitter web site
// @include        https://twitter.com/*
// @run-at         document-end
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_log
// @grant          GM_registerMenuCommand
// @grant          GM_deleteValue
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/2584/Thumbnail_on_Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/2584/Thumbnail_on_Twitter.meta.js
// ==/UserScript==

//==============================================================
//GreaseForkがrequireの審査必要なのでいっそのこと埋め込みました。
//Copyright: JoeSimmons & Sizzlemctwizzle & IzzySoft 
//require (c)https://greasyfork.org/scripts/1884-gm-config
//==============================================================

//==============================================================
//フリー音源
//Copyright: cajo (freesound.org)
//(c)https://www.freesound.org/people/cajo/sounds/34207/
//==============================================================

//==============================================================
//Flikr用ソースコード参照
//Copyright:NeoCat
//http://d.hatena.ne.jp/NeoCat/20091228/1262015896
//==============================================================

//==============================================================
//サムネURL参照
//http://blog.irons.jp/2009/12/23/twitter_thumb_url/
//他
//==============================================================


/**************************************************************

WEB版ツイッターで画像のサムネ表示を追加します。
(Add thumbnail @twitter)


Work on GreaseMonkey v2.2
Not support Scriptish


[概要(about)]
gif動画なのに動かなかったり、ちゃんとした拡張子で保存できなかったり、
 (gif movie not work?) (Can't save correct file extension?)
という問題を解消します。多分・・・
(This script solves problems!...Maybe...)

[対応サイト(support)]
droplr
flickr(一部サイズ変更に対応せず)
imageshack(yfrog)
twitpic(shutdown)
twitter(公式official pic.twitter.com)
twitter(公式official p.twimg.com)
twitter(公式official pbs.twimg.com)
vimeo
vine
youtube

[sslが古いので表示できない。ssl更新待ち]
img.ly

[set referrer]
※アドオン "RefControl" 例: サイトを追加 → サイト="imgur.com" カスタム="imgur.com"
※addon "RefControl" : example: add site → site="imgur.com" custom="imgur.com"
imgur
instagram
pixiv


[CSP(content security policy)を無効化(disable CSP)すれば使える※ただし無効化するとセキュリティレベルが下がります]
https://twittercommunity.com/t/blocking-mixed-content-with-content-security-policy/26375
※サポート対象外(not support becouse only http protocol)
※to use (about:config → security.csp.enable → false) but secure-down.
hatena
instagram movie(https : SSL error)
Mobypicture(https : SSL error)
携帯百景movapic
Ow.ly(https : SSL error)
photozou(httpsで一部取得不可)
tumblr(httpsで一部取得不可)
twipple
pixiv(一部取得不可：アバター画像がなくR-18しか投稿履歴に表示されない場合)


[サポート対象外(not support)]
・flickr(staticflickr)の一部サイズ指定非対応
URL"http://flickr.com/photo.gne?id={id}"で元のURLを取得できずにyahooのloginを求められるため
画像のサイズ指定ができません。


更新履歴
07/19/2015 - v3.15 fix:pbs.twimg.comの仕様変更に対応(検索画面で1枚画像のmax-width指定項目追加)
06/25/2015 - v3.14 fix:pbs.twimg.comの複数枚に対応
04/09/2015 - v3.13 add:twitter公式の外部動画関連URLに対応
02/04/2015 - v3.12 fix:pic.twitterで投稿者が凍結されている場合、数秒間ブラウザが固まる現象の修正
11/16/2014 - v3.11 fix:scroll制御方法変更
11/13/2014 - v3.10 fix:3.08のバグ
11/12/2014 - v3.09 fix:わかりにくい解説を少し改良
11/12/2014 - v3.08 fix:bugfix for google chrome
11/11/2014 - v3.07 fix:セーブデータがない場合スクリプトが動作しなかった不具合の修正
11/10/2014 - v3.06 add:動画プレイヤーのループ再生と自動再生機能を追加。vimeo追加
11/10/2014 - v3.06 fix:pic.twitter及びpbs.twimg.comの画像取得範囲の絞り込み。ツイート投稿に画像URLを書くと無限改行するバグ修正。
11/02/2014 - v3.05 fix:twitterのCSP(content security policy)に対応(対応不可能なものもあり)
09/27/2014 - v3.04 fix:一部pixivで表示できなかったパターンの修正
09/27/2014 - v3.03 fix:更新通知音の修正。一部表示されなかったp.twimg.comおよびpixivの修正。
09/21/2014 - v3.02 fix:仕様変更などの影響で動かなくなっていたtumblrやvineなどの修正
09/20/2014 - v3.01 del:not support Scriptish
09/18/2014 - v3.00 del:DOMNodeInserted & DOMAttrModified → add:MutationObserver
09/12/2014 - v2.36 fix:tumblr複数画像に対応
09/11/2014 - v2.35 fix:pixivに暫定対応2。仕様的に完璧に対応は不可なのでとりあえず完了。
09/10/2014 - v2.34 add:pixivに暫定対応。漫画の場合は漫画だとわかる画像にしてあるのでpixivページで見てください。
09/10/2014 - v2.34 add:コンフィグ画面の利便性向上(コンフィグ画面外クリックで閉じる機能。他微調整)
08/28/2014 - v2.33 fix:サムネクリックで小窓が出るように修正。中クリックで画像URLへ
08/28/2014 - v2.32 fix:一部サムネURLの仕様でgif動画が動かなかったものを動くように変更(ただしオリジナルGIF動画を縮小表示してるだけなので少し重い)
08/28/2014 - v2.31 fix:twitter公式不具合修正
08/24/2014 - v2.30 add:youtube
08/24/2014 - v2.29 fix:vineの動画削除済みURLはdead linkと表示するように変更
08/24/2014 - v2.28 add:vine
08/24/2014 - v2.27 add:twitter3とinstagramが動画URLだった場合、動画playerを追加するリンクを実装(thumb設定がonの時のみ)
08/22/2014 - v2.26 fix:サムネがはみ出るのでサイズ調整
08/21/2014 - v2.25 add:タイムラインと画像のみのページにも対応
08/19/2014 - v2.24 fix:uploaded to other script.sorry...
08/18/2014 - v2.23 fix:flickrのオリジナル画像が最大サイズじゃなかった場合表示できなかった不具合修正。v2.21の不具合修正
08/18/2014 - v2.22 fix:v2.21の不具合修正
08/15/2014 - v2.21 fix:twitter公式pic.twitter.comの複数画像に対応
08/15/2014 - v2.20 fix:twitter公式pbs.twimg.comで一部表示できなくなっていた不具合修正
08/14/2014 - v2.19 add:tumblrに対応。携帯百景movapicのuserIDが入ってくるURLにも対応。
08/14/2014 - v2.18 add:flickrに対応。設定画面起動アイコンをクリックで閉じる機能。ESC押したら設定画面閉じる機能追加
08/05/2014 - v2.17 fix:i.instagramに対応
08/05/2014 - v2.16 fix:instagramで一部表示できなかったサムネに対応
08/05/2014 - v2.15 fix:通知音設定の不具合修正。chromeでのエラー修正。他
08/02/2014 - v2.14 fix:2.13の修正
07/31/2014 - v2.13 fix:サムネ取得失敗時に拡張子がpngかどうかも試してみるように変更
07/20/2014 - v2.12 add:更新通知音
07/19/2014 - v2.11 add:簡易短縮URL展開 Expand URL(http://t.co/)
07/19/2014 - v2.10 fix:参照箇所をtitleからdata-expanded-urlに変更。読み込み失敗した画像のリロード時間をランダム変数に変更
07/11/2014 - v2.9 fix:サムネ画像の読み込み失敗でdeadlinkとなる不具合にリロード処理追加
07/06/2014 - v2.8 fix:設定画面を開いたままブラウザサイズを変更した時に最適な配置になるように変更
06/30/2014 - v2.7 add:画像がリンク切れだったらdead linkとお知らせする機能。一括でON・OFF設定する機能
06/29/2014 - v2.6 add:拡張子が画像系のURLにサムネ追加、imgurにサイズM追加
06/27/2014 - v2.5 fix:add twitter(公式official pbs.twimg.com)と、pic.twitter.comのサムネのピンボケ修正
06/27/2014 - v2.4 fix:文字修正＆v2.2で追加した処理の位置ミスの修正
06/27/2014 - v2.3 fix:指摘してもらったバグの修正とか
06/26/2014 - v2.2 add:twitterが追加するサムネの表示設定追加
06/26/2014 - v2.1 fix:GreaseMonkeyでユーザー設定を取得できなかったバグ修正
06/25/2014 - v2.0 fix:大幅な構造変更と軽微なバグ修正
06/23/2014 - v1.5 fix:無駄な処理の整理
06/22/2014 - v1.4 add:imgur、携帯百景movapic、hatena、Ow.ly、Mobypicture
06/21/2014 - v1.3 add:droplr、pic.twitter.com、img.ly、photozou、p.twimg.com、twipple、yfrog
06/19/2014 - v1.2 fix:表示切り替えなどで無限に増えていくのを修正
06/18/2014 - v1.1 add:instagram
06/18/2014 - v1.0 release

***************************************************************

備忘録

・facebook(短縮URLあり)
指定方法は2種類
https://fbcdn-sphotos-h-a.akamaihd.net/hphotos-ak-snc7/画像ID_n.jpg
https://scontent-a.xx.fbcdn.net/hphotos-xpa1/t1.0-9/q71/画像ID_o.jpg

サイズ 	アルファベット
オリジナル	o
960px		b または n または o
180px		a または q または x
130px		s
75px		t

https://scontent-a.xx.fbcdn.net/hphotos-xpa1/t1.0-9/q71/s640x640/画像ID_o.jpg
サイズ 	書き方
64px 	s64x64
80px 	s80x80
120px 	s120x120
320px 	s320x320
480px 	s480x480
640px 	s640x640
720px 	s720x720

facebookの短縮URLは2種類？
http://fb.me/
http://fb.com/



********************閉鎖？ not found website******************************************
pic.im （ドキュメント）サービス終了？
picplz閉鎖？
BigCanvas PhotoShare閉鎖？

Lockerz（旧Plixi, その前は TweetPhoto）画像サービス終了？全部ador.comのトップページに飛ぶので詳細不明

brightkite 終了確定

**************************************************************/

/**************************追加予定****************************************************************************

現状動けばいいや状態なので処理の簡略化
突貫工事で追加した部分の処理で共通部分を短縮する

可能ならTwitgoo


動画のvideoタグにフルスクリーンボタン追加

ニコニコ動画の短縮URLを動画に変更
→httpのため混在でブロックされて表示できないので頓挫中
//http://nico.ms/動画ID
//動画埋め込み<script type="text/javascript" src="http://ext.nicovideo.jp/thumb_watch/動画ID"></script>
//srcのURLにプレイヤーサイズ指定  ?w=340&h=285
//動画情報http://ext.nicovideo.jp/thumb/
サムネ画像じゃないけど無理やり取得
http://tn-skr.smilevideo.jp/smile?i=動画番号の数字の部分
http://tn-skr1.smilevideo.jp/smile?i=動画番号の数字の部分
tn-skr1←数字なくても取得可能な模様


動画の拡張子の場合動画プレーヤーを埋め込み

facebookの対応

******************************************************************************************************/



(function() {

	//ifame内除外
	if(location.href.match(/^https?:\/\/twitter.com\/i\/cards\//)){ return; }

/*
	//ブラウザ判定(userAgent)
	var browser = window.navigator.userAgent.toLowerCase();
	if (browser.match('chrome')) browser = 'chrome';
	else if(browser.match('gecko')) browser = 'firefox';
	else browser = null;
*/


	//定数----------------------------------------------------------------
	const picExt = ["gif","jpg","jpeg","png","bmp"];
	const strIcon = '<img name=imgBtn id=imgBtn type=button style=max-width:12px;display:inline-block; '
		+ 'src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAABOSURBVChTjZG5DQAwCANJhs1QWZZgCSQUxHMNLs6NWSyQsq4GgY8Gx9Yb8EUjlcFfKGXgC60MrDCSAQpjGeuMZJuxlf3epfw/JpXjB4keFPsQEoUOdacAAAAASUVORK5CYII= '
		+ '>';
	const audio = new Audio("https://www.freesound.org/data/previews/34/34207_229898-lq.mp3");	//更新通知音声

	const defScroll = window.onscroll;	//デフォルトのスクロール関数を退避

	//グローバル変数セット------------------------------------------------
	var name ="";			//サービス名
	var fileType = "";		//拡張子
	var href,src;
	var scrollY;				//現在のスクロールの高さ

	var cfgData = {};		//ユーザー設定画面の初期値
	var localDB = {};		//初期値(ローカルストレージに保存されるデータと同じ形式のデータベース)
	var titleDB = {};		//タイトルDB(サーバーの名称)
	var optionDB = {};		//サムネサイズ選択肢DB
	var expDB = {};			//URL展開履歴

	//localStorageに格納されているデータを直接確認(localDBと同じもの)
	var strDB = null;
	var tmpDB = null;
	strDB = localStorage.getItem("configthumbnailsize");
	if(!strDB) strDB = GM_getValue("configthumbnailsize");
	if(strDB) tmpDB = JSON.parse(strDB);

	var flickrSrcDB ={};	//flickr専用
	var pixivSrcDB ={};	//pixiv専用
	var twitter1DB ={};	//pic.twitter複数画像専用
	var tumblrDB ={};	//tumblr複数画像専用

	var insertWhere = "afterend";	//サムネと保存リンクの追加位置指定

	//プログラム起動------------------------------------------------
try{
	//DB作成
	makeDB();

	//ユーザー設定画面初期値作成
	makeInitData();

	//ユーザーコンフィグ画面作成
	userCfg();

	fixer();

	//main起動------------------------------------------------
	main(document);
	startObserver();

}catch(e){
	throw(e);
}




	//要素の変更監視
	function startObserver(){
		var observer = new MutationObserver(function(mutations){
		    mutations.forEach(function(mutation) {
			
			switch (mutation.type) {

			case 'attributes' : // 属性が変更された
			//mutation.target; // 属性を持つ要素
			//mutation.attributeName; // 属性の名前
			//mutation.attributeNamespace; // 属性の名前空間
			//mutation.oldValue; // 変更前の属性値


				mainCheck(mutation.target);

				break;


			case 'childList' : // 子ノードが変更された
			//mutation.target; // 子ノードの親
			//mutation.addedNodes; // 追加されたノードのリスト
			//mutation.removedNodes; // 削除されたノードのリスト
			//mutation.previousSibling; // 変更されたノードの前
			//mutation.nextSibling; // 変更されたノードの次

try{
				if(mutation.addedNodes.length <= 0 			//削除された場合は除外
				|| mutation.target.className.match(/typeahead-items/)	//検索のポップアップ
				|| mutation.target.id == "tweet-box-global") return;	//ツイートに画像URL貼り付けを無視


				var oType = Object.prototype.toString.call(mutation.target).slice(8, -1);


/*
				if(oType.match(/HTMLAnchorElement/)){
					mainCheck(mutation.target);
					return;
				}
				if(oType.match(/HTMLBodyElement/)){
					main(mutation.target);
					return;
				}
				//検索後このクラスが更新される
				if(mutation.target.className.match(/AppContent wrapper wrapper-search/)){
					main(mutation.target);
					return;
				}
*/

				for(var mu=0;mu < mutation.addedNodes.length; mu++){
					var objMu = mutation.addedNodes[mu];
					otype = Object.prototype.toString.call(objMu).slice(8, -1);


					if(otype.match(/(Text|Comment)/)) continue;

					if(oType.match(/HTMLAnchorElement/)) mainCheck(objMu);
					else main(objMu);


					//chime(検索やタイムラインの更新 "new-tweets-bar js-new-tweets-bar " 、ユーザーページの更新 "Grid")
					chime(objMu);
				}

				break;


}catch(e){
		GM_log("ToT_mutation_Error:"+e);
		return;
}

			}
		    });
		});

		var target = document;
		var attrArray = ['href'];
		var config = { childList: true ,subtree: true ,attributes:true, attributeFilter: attrArray };
		observer.observe(target, config);

		//追加した監視の削除
		window.addEventListener('beforeunload', function(){
			observer.disconnect();
			window.removeEventListener("beforeunload", arguments.callee);
		}, false);
	}





	//***************************************************
	//DB入力
	function makeDB(){

		name = "";
		var label = "";
		var def = "";		//空文字""を指定する場合注意


		//共通設定1------------------------------------
		localDB["flgDefPic"] = false;	//twitterの画像表示する場合true
		localDB["alertnotice"] = false;
		localDB["expandFlg"] = true;

		//共通設定2------------------------------------
		localDB["autoPlay"] = false;
		localDB["loopFlag"] = false;
		localDB["imgSize"] = '350px';

		optionDB['imgSize'] = {};
		optionDB['imgSize']["100%"] = "100%";
		optionDB['imgSize']["350px"] = "350px";
		optionDB['imgSize']["200px"] = "200px";
		optionDB['imgSize']["150px"] = "150px";

		//---------------------------------------------
		name = "AllThumbsAndLinks";
		label = "すべてのサムネとリンク(All Thumbs & Links)";
		def = true;

		makeServerDB(name,label,def);	//固定

		//---------------------------------------------
		name = "droplr";
		label = "";
		def = "custom";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["+"] = "full:original";
		optionDB[name]["custom"] = "thumb:100x100(gif move)";	//このスクリプト専用で標準にはないオプション
		optionDB[name]["-"] = "thumb:100x100(gif stop)";

		//---------------------------------------------
		name = "flickr";
		label = "flickr";
		def = "q";
//sq:75x75、q:100x100、t:100x75、s:240x180、n:320x240、m:500x375、指定なし(none):500x500、z:640x480、c:800x600、l:1024x768、b:1024x1024、o:origin

		makeServerDB(name,label,def);	//固定
		optionDB[name]["o"] = "o:original";
		optionDB[name]["b"] = "b:1024x1024";
		optionDB[name]["l"] = "l:1024x768";
		optionDB[name]["c"] = "c:800x600";
		optionDB[name]["z"] = "z:640x480";
		optionDB[name]["m"] = "m:500x375";
		optionDB[name]["n"] = "n:320x240";
		optionDB[name]["s"] = "s:240x180";
		optionDB[name]["q"] = "q:100x100";
		optionDB[name]["t"] = "t:100x75";
		optionDB[name]["sq"] = "sq:75x75";


		//---------------------------------------------
		name = "hatena";
		label = "はてなフォトライフf.hatena";
		def = "_120";

		makeServerDB(name,label,def);	//固定
		optionDB[name][""] = "original";
		optionDB[name]["_120"] = "_120:120x77";
		optionDB[name]["_m"] = "_m:60x39";

		//---------------------------------------------
		name = "imageshack";
		label = "imageshack";
		def = "150x100q90";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["full"] = "full:original";
		optionDB[name]["640x480"] = "640x480";
		optionDB[name]["250x250"] = "250x250";
		optionDB[name]["150x100q90"] = "150x100";

		//---------------------------------------------
		name = "imgly";
		label = "img.ly";
		def = "thumb";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["full"] = "full:original";
		optionDB[name]["large"] = "large:550x620";
		optionDB[name]["medium"] = "medium:320x240";
		optionDB[name]["thumb"] = "thumb:150x150";
		optionDB[name]["mini"] = "mini:75x75";

		//---------------------------------------------
		name = "imgur";
		label = "";
		def = "m";

		makeServerDB(name,label,def);	//固定
		optionDB[name][""] = "original";
		optionDB[name]["l"] = "l:640x480";
		optionDB[name]["m"] = "m:320x200";
		optionDB[name]["s"] = "s:90x90";

		//---------------------------------------------
		name = "instagram";
		label = "";
		def = "t";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["l"] = "large:612x612";
		optionDB[name]["m"] = "medium:306x306";
		optionDB[name]["t"] = "thumbnail:150x150";

		//---------------------------------------------
		name = "Mobypicture";
		label = "";
		def = "thumbnail";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["original"] = "original:original?";
		optionDB[name]["full"] = "full:original?";
		optionDB[name]["large"] = "large:original?";
		optionDB[name]["medium"] = "medium";
		optionDB[name]["small"] = "thumbnail:500x400";
		optionDB[name]["thumbnail"] = "thumbnail:100x100";
		optionDB[name]["square"] = "thumbnail:90x90";

		//---------------------------------------------
		name = "movapic";
		label = "携帯百景movapic";
		def = "t";

		makeServerDB(name,label,def);	//固定
//		optionDB[name]["l"] = "large:612x612";	//removed this options?
		optionDB[name]["m"] = "medium:306x306";
		optionDB[name]["t"] = "thumbnail:150x150";

		//---------------------------------------------
		name = "Owly";
		label = "Ow.ly";
		def = "thumb";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["original"] = "original";
		optionDB[name]["normal"] = "normal";
		optionDB[name]["thumb"] = "thumb:100x100";

		//---------------------------------------------
		name = "photozou";
		label = "フォト蔵photozou";
		def = "thumb";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["img"] = "img:original";
		optionDB[name]["thumb"] = "thumb:120x120";

		//---------------------------------------------
		name = "pixiv";
		label = "pixiv";
		def = "s";

		makeServerDB(name,label,def);	//固定
		optionDB[name][""] = "original";
		optionDB[name]["m"] = "m:450x600";
		optionDB[name]["s"] = "s:120x150";
		optionDB[name]["128x128"] = "128x128";	//上記3つとはurl＆拡張子が違う
		optionDB[name]["64x64"] = "64x64";	//上記3つとはurl＆拡張子が違う

//128x128、150x150、600x600、1200x1200を確認。他の指定があるかは不明
		//---------------------------------------------
		name = "pixiv2";
		label = "pixiv(2):(other URL)";
		def = "150x150";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["1200x1200"] = "1200x1200:original";
		optionDB[name]["600x600"] = "600x600";
		optionDB[name]["150x150"] = "150x150";
		optionDB[name]["128x128"] = "128x128";

		//---------------------------------------------
		name = "tumblr";
		label = "tumblr";
		def = "100";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["1280"] = "1280:1280x1280";
		optionDB[name]["500"] = "500:500x500";
		optionDB[name]["400"] = "400:400x400";
		optionDB[name]["250"] = "250:250x250";
		optionDB[name]["100"] = "100:100x100";
		optionDB[name]["75sq"] = "75sq:75x75";

		//---------------------------------------------
		name = "twipple";
		label = "ついっぷるtwipple";
		def = "thumb";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["orig"] = "orig:original";
		optionDB[name]["large"] = "large:350x480";
		optionDB[name]["thumb"] = "thumb:160x120";

		//---------------------------------------------
		name = "twitpic";
		label = "";
		def = "thumb";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["full"] = "full:original";
		optionDB[name]["large"] = "large:600x800";
		optionDB[name]["thumb"] = "thumb:150x150";
		optionDB[name]["mini"] = "mini:75x75";

		//---------------------------------------------
		name = "twitter1";
		label = "twitter official(1):pic.twitter";
		def = "small";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["orig"] = "orig:Original";
		optionDB[name]["large"] = "large:Original?";
		optionDB[name]["medium"] = "medium:600x450";
		optionDB[name]["small"] = "small:340x244";
		optionDB[name]["thumb"] = "thumb:150x150";	//twitterの仕様で、指定サイズよりはみ出た部分は勝手にカットされる

		//---------------------------------------------
		name = "twitter2";
		label = "twitter official(2):p.twimg";
		def = "small";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["orig"] = "orig:Original";
		optionDB[name]["large"] = "large:Original?";
		optionDB[name]["medium"] = "medium:600x450";
		optionDB[name]["small"] = "small:340x244";
		optionDB[name]["thumb"] = "thumb:150x150";

		//---------------------------------------------
		name = "twitter3";
		label = "twitter official(3):pbs.twimg.com";
		def = "small";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["orig"] = "orig:Original";
		optionDB[name]["large"] = "large:Original?";
		optionDB[name]["medium"] = "medium:600x450";
		optionDB[name]["small"] = "small:340x244";
		optionDB[name]["thumb"] = "thumb:150x150";

		//---------------------------------------------
		name = "twitter4";
		label = "twitter official(4):ext_tw_video";
		def = "small";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["orig"] = "orig:Original";
		optionDB[name]["large"] = "large:Original?";
		optionDB[name]["medium"] = "medium:600x450";
		optionDB[name]["small"] = "small:340x244";
		optionDB[name]["thumb"] = "thumb:150x150";

		//---------------------------------------------
		name = "vimeo";
		label = "";
		def = "thumbnail_small";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["thumbnail_small"] = "small 100x75";
		optionDB[name]["thumbnail_medium"] = "medium 200x150";
		optionDB[name]["thumbnail_large"] = "large 640";

		//---------------------------------------------
		name = "vine";
		label = "";
		def = "150";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["150"] = "thumb:150x150";
		optionDB[name]["510"] = "original";

		//---------------------------------------------
/*
		name = "yfrog";
		label = "";
		def = "small";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["medium"] = "medium:640x480";
		optionDB[name]["iphone"] = "iphone:480x360";
		optionDB[name]["small"] = "small:125x90";
*/

		//---------------------------------------------
		name = "youtube";
		label = "";
		def = "mqdefault";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["mqdefault"] = "default:320×180";
		optionDB[name]["0"] = "0:480x360";
//		optionDB[name]["2"] = "2:120x90";	//表示できない動画もある

//highres hd1080 hd720 large medium small
		//---------------------------------------------
		name = "youtubeQuality";
		label = "youtubeQuality";
		def = "highres";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["small"] = "small";
		optionDB[name]["medium"] = "medium";
		optionDB[name]["large"] = "large";
		optionDB[name]["hd720"] = "hd720";
		optionDB[name]["hd1080"] = "hd1080";
		optionDB[name]["highres"] = "highres:most high";

		//---------------------------------------------
		name = "otherPic";
		label = "その他の画像URL(Other ImageURL)";
		def = "thumb";

		makeServerDB(name,label,def);	//固定
		optionDB[name]["origin"] = "origin:original";
		optionDB[name]["thumb"] = "thumb:100x100";

	}
	//***************************************************


	//main==========================================================================================
	function main(node){
try{

		if(Object.prototype.toString.call(node).slice(8, -1).match(/(Text|Comment)/)) return;

		var allLinks = document.evaluate('.//a', node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

		for (var i = 0; i < allLinks.snapshotLength; i++){
			var objLink = allLinks.snapshotItem(i);
			mainCheck(objLink);
		}//for文ここまで


}catch(e){
	GM_log("ToT_main_Error:"+e);
}

	}//mainここまで====================================================================================

	//mainCHeck====================================================================================
	function mainCheck(objLink){
try{

		//短縮URLを簡易的に展開
		if(localDB["expandFlg"] && objLink.hasAttribute("href") && !objLink.hasAttribute("akill_check")
		&& !objLink.hasAttribute("ToT_expanded") ){
			var tmpUrl = objLink.href;

			//展開
			if(objLink.hasAttribute("data-expanded-url") && objLink.getAttribute("data-expanded-url").match(/^http/)){
				tmpUrl = objLink.getAttribute("data-expanded-url");

			}else if(objLink.hasAttribute("data-resolved-url-large") && objLink.getAttribute("data-resolved-url-large").match(/^http/)){
				tmpUrl = objLink.getAttribute("data-resolved-url-large");

			//t.coリンクでテキストが展開URLだったら
			}else if(objLink.innerHTML.match(/[a-zA-Z0-9]..*\//) && objLink.href.match(/https?:\/\/t.co\//)){
				tmpUrl = "http://" + objLink.innerHTML;
				if(objLink.title && objLink.innerHTML.match(/…/)) tmpUrl = objLink.title;
			}

			if(objLink.href != tmpUrl){
				objLink.href = tmpUrl;
				objLink.rel = "noreferrer";
				objLink.setAttribute("ToT_expanded","done");
			}
		}

		//サムネ追加対象以外は除外
		if(!objLink.hasAttribute("class")
		  ||!objLink.getAttribute("class").match(/twitter-timeline-link/)
		  || objLink.getAttribute("class").match(/media-thumbnail/)
		  //hrefを含まないリンクは除外
		  || !objLink.hasAttribute("href") || objLink.href == ""
		  || objLink.getAttribute("data-expanded-url") == ""
		  //サムネURL展開中も除外
		  || objLink.hasAttribute("ToT_URL") && objLink.getAttribute("ToT_URL").match(/^NowLoading:.*/)
		  //サムネ追加済みは除外
		  || objLink.hasAttribute("ToT_Link") && objLink.getAttribute("ToT_Link") == "added"
		  || objLink.hasAttribute("ToT_Thumb") && objLink.getAttribute("ToT_Thumb") == "added"
		  //Affiliate_Killerの非表示リンク部分対応
		  || objLink.hasAttribute("akill_check") && objLink.getAttribute("akill_check").match(/killed/)
		  ){
			return;
		}

		href = objLink.href;

		//URL展開して取得したURLがセットされていたら
		if(objLink.hasAttribute("ToT_URL") && objLink.getAttribute("ToT_URL").match(/^http/)){
			href = objLink.getAttribute("ToT_URL");
			expDB[objLink.href] = href;
		}else if(expDB[objLink.href] && expDB[objLink.href].match(/^http/)){
			href = expDB[objLink.href];
		}

		src = href;

		insertWhere = "afterend";




//投稿URL：http://d.pr/i/<photo_id>
//元画像：http://d.pr/<photo_id>
//元画像：http://d.pr/i/<photo_id>+
//元画像：http://d.pr/i/<photo_id>+#.jpg
//サムネ：http://d.pr/i/<photo_id>-
//サムネにするとgifは動かなくなる
//マイナス-:100x100|プラス+:ORIGIN
		//Droplr----------------------------------------------------------------------
		if(href.match(/^https?:\/\/d.pr\/i\/.*$/) && !href.match(/^https?:\/\/d.pr\/i\/.*?\//)){
			name = "droplr";
			var picID = href.replace(/.*d.pr\/i\//,"");
			commonUrl = href.replace(/^https?/,"https");

			if(href.slice(-1) == "-" || href.slice(-1) == "+"){
				commonUrl = commonUrl.slice(0,-1);
			}
			src = commonUrl + localDB[name +"Size"];
			if(localDB[name +"Size"] == "custom") src = commonUrl + "+";
			href = commonUrl + "+";

			setLink(objLink,name);
			setThumb(objLink,name);


//短縮URL：http://flic.kr/p/英数字(上記画像ID数値のBase58エンコード)
		//Flickr短縮URLの展開----------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/flic.kr\/(p|s)\/.*/) && !href.match(/^https?:\/\/flic.kr\/(p|s)\/.*?\/.*/)){
			expandUrl('HEAD',objLink);


//元のURL:http://www.flickr.com/photos/ユーザー名/画像ID数値/ 
//サムネhttps://yy(ファームID).staticflickr.com/サーバーID/画像ID数値_ランダム数値(ハッシュ？)_t.jpg
//画像https://yy2.staticflickr.com/3844/画像ID数値_ランダム数値_h.jpg
//画像http://farm4.static.flickr.com/3342/3488883246_aa472bc65f_s.jpg
//sq:75x75、q:100x100、t:100x75、s:240x180、n:320x240、m:500x375、z:640x480、c:800x600、l:1024x768、b:1024x1024、o:origin
		//Flickr画像URLを展開する----------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/(www.|m.)?flickr.com\/(#\/)?photos\/.*?\/.*\//)){
			name = "flickr";
			var size = localDB[name +"Size"];

			//Flickr携帯URLならURL修正
			if(href.match(/^https?:\/\/m.flickr.com\/(#\/)?photos\/.*?\/.*\//)){
				href = href.replace(/\/\/m./,"//").replace(/\/#\//,"/");
			}

			//サムネ一覧ページにアクセスする用URL
			var tmpUrl = href.replace(/^https?/,"https").replace(/^(https?:\/\/(www.)?flickr.com\/photos\/.*?\/.*?\/).*/i,"$1") 
				+ "sizes/" + size + "/";

			//何故かサムネ一覧にあるサムネサイズ指定と画像URLのサムネサイズ指定部分が違うので修正
			size = flickrSize(size);

			objLink.setAttribute("ToT_URL",tmpUrl,size);
			expandUrl('GET',objLink,size);

		//Flickr画像URL------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/.*static.?flickr.com\/.*?\//)
		//元URL取得失敗はスルーして画像拡張子の処理の方に回す
		&& objLink.hasAttribute("ToT_URL") && !objLink.getAttribute("ToT_URL").match(/^Error/)){
			name = "flickr";
			//元から画像URLで投稿されていた場合、一度元のURLに戻す必要がある(画像URLのランダム数値を取得するため)
			if(Object.keys(flickrSrcDB).length == 0){
				var tempUrl = "https://flickr.com/photo.gne?id=" + href.replace(/.*\/(.*?)_.*?(_[a-zA-Z])?..*/i,"$1");
				objLink.setAttribute("ToT_URL",tempUrl);
				expandUrl('HEAD',objLink);
				return;

			//画像URLを展開した場合
			}else{
				href = href.replace(/^https?/,"https");
				src = 	flickrSrcDB[objLink.href];

//同じURLで再度取得しないように消さない方がいい？
//				delete flickrSrcDB[objLink.href];

				setLink(objLink,name);
				setThumb(objLink,name);

			}

//ページ: http://f.hatena.ne.jp/<user-id>/YYYYMMDD<image-id>
//サムネイル画像:http://img.f.hatena.ne.jp/images/fotolife/<user-idの1文字目>/<user-id>/YYYYMMDD/YYYYMMDD<image-id>_<size>.jpg
//_m:60x39 _120:120x77  無印:original
		//はてなフォトライフf.hatena----------------------------------------------------
		}else if(href.match(/^https?:\/\/f.hatena.ne.jp\/.*?\/.*$/) && !href.match(/^https?:\/\/f.hatena.ne.jp\/.*?\/.*?\//)){
			name = "hatena";
			//注意：httpsは使えない
			var commonUrl = "http://img.f.hatena.ne.jp/images/fotolife/";
			var userId = href.replace(/.*f.hatena.ne.jp\/(.*?)\/.*$/i,"$1");	//ユーザーID
			var strTemp = href.replace(/.*f.hatena.ne.jp\/.*?\//,"");		//yyyymmdd画像ID
			var strTime = strTemp.slice(0,8);					//yyyymmdd

			if(strTemp != "" && !strTemp.match("fototime")){
				src = commonUrl + userId.slice(0,1) + "/" + userId + "/" + strTime + "/" + strTemp + localDB[name +"Size"] + ".jpg";
				href = commonUrl + userId.slice(0,1) + "/" + userId + "/" + strTime + "/" + strTemp + ".jpg";

				setLink(objLink,name);
				setThumb(objLink,name);
			}


//http://imageshack.com/i/paaJZJGKj
		//imageshack(yfrog)--------------------------------------------------------------------------
		}else if(href.match(/^http:\/\/imageshack.com\/i\/.*/)){
			name = "imageshack";
			expandUrl('GET',objLink);
			return;


//修正前 http://img199.imageshack.us/img数字1/数字2/ファイル名.gif
//修正前 http://imageshack.com/a/img数字1/数字2/ファイル名.gif
//修正前 http://imagizer.imageshack.us/scaled/landing/数字1/ファイル名.jpg
//画像   http://imagizer.imageshack.us/v2/サイズ/数字1/ファイル名.jpg
//サムネサイズは任意で大きさ変えられる。(例：150x100q90 250x250 400x600 1900x1900)
//150x100q90 250x250 640x480 full
//gifのサムネは動かない
		//imageshack(yfrog)画像--------------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/.*?imageshack.(com|us)\/.*$/)){
			name = "imageshack";
			var commonUrl = "https://imagizer.imageshack.us/v2/";
			var number;
			var fileName = href.replace(/.*\//,"");

			if(href.match(/\/img\d+\//)){
				number  = href.match(/\/img(\d+)\//)[1];
			}else{
				number  = href.replace("/" + fileName,"").replace(/.*\//,"");
			}

			src = commonUrl + localDB[name +"Size"] + "/" + number + "/" + fileName;
			href =  commonUrl + "full/" + number + "/" + fileName;

			setLink(objLink,name);
			setThumb(objLink,name);


//http://yfrog.com/画像ID
//http://yfrog.com/画像ID:medium
//small:125x90、iphone:480x360、medium:640x480
//サムネはサイズ指定の代わりに画像IDの直後に「.th.jpg」を追加。(ただしgifは動かない)
//URLはimgshackに変更される
		//yfrog(imageshack)--------------------------------------------------------------------------
		}else if(href.match(/^http:\/\/yfrog.com\/.*$/)  && !href.match(/^http:\/\/yfrog.com\/.*?\/.*$/)){
			name = "yfrog";
			var commonUrl = href.replace(/^https?/,"http").replace(/(.*?:.*):.*/,"$1");

			objLink.setAttribute("ToT_URL",commonUrl + ":medium");

			expandUrl('GET',objLink);

			return;

/*
			src = commonUrl + ":" + localDB[name +"Size"];
			href =  commonUrl + ":medium";

			setLink(objLink,name);
			setThumb(objLink,name);
*/


//投稿URL：http://img.ly/<photo_id>
//元画像：http://img.ly/show/full/<photo_id>
//mini75x75|thumb150x150|medium320x240|large550x620|full
		//img.ly----------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/img.ly\/.*$/) && !href.match(/^https?:\/\/img.ly\/.*?\//)){
			name = "imgly";
			var picID = href.replace(/.*img.ly\//,"");
			var commonUrl = "https://img.ly/show/";

			objLink.setAttribute("ToT_URL",commonUrl + "full/" + picID);

			expandUrl('HEAD',objLink);
/*
			src = commonUrl + localDB[name +"Size"] + "/" + picID;
			href = commonUrl + "full/" + picID;

			setLink(objLink,name);
			setThumb(objLink,name);
*/

//http://img.ly/system/uploads/数字3桁/数字3桁/数字3桁/サイズ_ファイル名.jpg
//http://img.ly/system/uploads/数字3桁/数字3桁/数字3桁/サイズ_ファイル名.jpg
//http://img.ly/system/uploads/数字3桁/数字3桁/数字3桁/サイズ_ファイル名.jpg.英数字.英数字.jpg
//サムネの拡張子はjpg、オリジナルは元の拡張子
		//img.ly画像URL-----------------------------------------------------------------
		}else if(href.match(/https?:\/\/img.ly\/system\/uploads/)){
			name = "imgly";
			var commonUrl = href.replace(/^https?/,"https").replace(/(.*\/).*/,"$1");
			var fileName = href.replace(/.*?_/,"").replace(/(.*?\..*?)\..*/,"$1");
			var size = href.replace(/.*\//,"").replace(/_.*/,"");

			src = commonUrl + localDB[name +"Size"] + "_" + fileName;
			if(size == "full") src = src.replace(/\.png/,".jpg");
			href = commonUrl + "full_" + fileName;

			setLink(objLink,name);
			setThumb(objLink,name);


//http://i.imgur.com/画像id
//ページ: http://imgur.com/<image-id>
//ページ: http://imgur.com/<image-id>.拡張子
//サムネイル画像: http://i.imgur.com/<image-id><size>.拡張子
//s(サムネ、gif動かない90x90) m(サムネ、gif動かない320x200) l(サムネ、gif動かない640x480)  "無印"(オリジナル、gif動く) 
		//imgur--------------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/(i.)?imgur.com\/.*$/) && !href.match(/^https?:\/\/(i.)?imgur.com\/.*?\//)){
			name = "imgur";
			var commonUrl = href.replace(/^https?/,"https").replace("/imgur.com","/i.imgur.com");

			fileType = "";	//拡張子
			fileType = href.replace(/.*imgur.com\/.*\.(.*$)/i,"$1");

			//拡張子なし
			if(fileType == href){
				expandUrl('GET',objLink);
				return;
			//拡張子あり
			}else{
				src = commonUrl;
				if(!fileType.match(/gif/i)) src = commonUrl.replace("." + fileType, localDB[name +"Size"] + "." + fileType);
				href = commonUrl;
			}

			setLink(objLink,name);
			setThumb(objLink,name);

//http://instagr.am/p/UKCy2XOfD5/
//http://instagram.com/p/oMk34hmjwj/
//http://instagram.com/p/rN9lU5hEB4/?modal=true
//http://instagram.com/p/oMk34hmjwj/media?size=t
//sizeパラメータ t(thumbnail:150x150)、m(medium:306x306)、l(large:612x612)
		//instagram----------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/(i.)?(i|I)nstagr(am.com|.am)\/p\/.*?\//) && !href.match(/^https?:\/\/instagr(am.com|.am)\/p\/.*?\/.*\//)){
			name = "instagram";
			var commonUrl = href.replace(/^https?/,"https").replace("instagr.am","instagram.com").replace(/\/\?.*$/,"/");

			src = commonUrl + "media?size=" + localDB[name +"Size"];
			href = commonUrl + "media?size=l";

			objLink.setAttribute("ToT_URL",commonUrl);
			expandUrl('GET',objLink);	//動画チェック

			setLink(objLink,name);
			setThumb(objLink,name);

//ページ: http://moby.to/<image-id>
//サムネイル画像: http://moby.to/<image-id>:<size>
//“square”90x90“thumbnail”100x100, “small”500x400,  “medium” ,"large" ,"full","original"
		//Mobypicture （ドキュメント）-------------------------------------------------
		}else if(href.match(/^https?:\/\/moby.to\/.*$/) && !href.match(/^https?:\/\/moby.to\/.*?\/.*$/)){
			name = "Mobypicture";

			src = href + ":" + localDB[name +"Size"];
			href = href + ":original";

			setLink(objLink,name);
			setThumb(objLink,name);


//http://movapic.com/UserID/pic/PageID）
		//携帯百景movapic(ユーザーIDを含んだURL)展開----------------------------------------------
		}else if(href.match(/^https?:\/\/movapic.com\/.*?\/pic\/.*$/) && !href.match(/^https?:\/\/movapic.com\/.*?\/pic\/.*?\/.*$/)){
			name = "movapic";
			expandUrl('GET',objLink);

//ページ: http://movapic.com/pic/<image-id>
//サムネイル画像: http://image.movapic.com/pic/<size>_<image-id>.jpeg
//<size>: t(サムネ80x60)s(small320x240)m(オリジナル？)
		//携帯百景movapic--------------------------------------------------------------
		}else if(href.match(/^https?:\/\/movapic.com\/pic\/.*$/) && !href.match(/^https?:\/\/movapic.com\/pic\/.*?\/.*$/)
			|| href.match(/^https?:\/\/image.movapic.com\/pic\/.*$/)){

			name = "movapic";
			var commonUrl = "http://image.movapic.com/pic/";
			var picID;

			//サムネURL
			if(href.match(/^https?:\/\/image.movapic.com/)){
				picID = href.replace(/.*pic\/.*?_(.*?)\..*/i,"$1");
			}else{
				picID = href.replace(/.*pic\//,"");
			}


			src = commonUrl + localDB[name +"Size"] + "_" + picID + ".jpeg";
			href = commonUrl + "m_" + picID + ".jpeg";

			setLink(objLink,name);
			setThumb(objLink,name);


//ページ: http://ow.ly/i/<image-id>
//サムネイル画像:  http://static.ow.ly/photos/サイズ/<image-id>.jpg
//'thumb'(100x100)/'normal'/'original'
		//Ow.ly------------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/ow.ly\/i\/.*$/) && !href.match(/^https?:\/\/ow.ly\/i\/.*?\/.*$/)){
			name = "Owly";
			var picID = href.replace(/.*\/i\//,"");
			var commonUrl = "http://static.ow.ly/photos/";

			src = commonUrl + localDB[name +"Size"] + "/" + picID + ".jpg";
			href = commonUrl + "original/" + picID + ".jpg";

			setLink(objLink,name);
			setThumb(objLink,name);

//投稿URL: http://photozou.jp/photo/show/＜User ID＞/画像ID
//画像URL: http://photozou.jp/p/サイズ/画像ID
// thumb、img
		//フォト蔵----------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/photozou.jp\/photo\/show\/.*?\/.*$/) && !href.match(/^https?:\/\/photozou.jp\/photo\/show\/.*?\/.*?\//)){
			name = "photozou";
			var picID = href.replace(/.*\/show\/.*?\//,"");
			var commonUrl = "https://photozou.jp/p/";

			objLink.setAttribute("ToT_URL",commonUrl + "img/" + picID);

			src = commonUrl + localDB[name +"Size"] + "/" + picID;
			href = commonUrl + "img/" + picID;

			setLink(objLink,name);
			setThumb(objLink,name);


//サムネ     http://kura数字.photozou.jp/pub/数字/数字/photo/数字_thumbnail.jpg
//サムネ     https://art数字.photozou.jp/pub/数字/数字/photo/数字_thumbnail.v数字.jpg
//オリジナル http://kura数字.photozou.jp/pub/数字/数字/photo/数字.jpg
//オリジナル https://art数字.photozou.jp/pub/数字/数字/photo/数字.v数字.jpg
//.v数字 は無くてもいい
		//フォト蔵画像------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/.*?\.photozou.jp\/pub\/.*?\/.*?\/photo\/.*$/) && !href.match(/^https?:\/\/.*?\.photozou.jp\/pub\/.*?\/.*?\/photo\/.*?\//)){
			name = "photozou";
			var commonUrl = href.replace(/_thumbnail\./,".");
			var number = commonUrl.replace(/.*\//,"").replace(/(.*?)\..*/,"$1");

			src = commonUrl.replace(number,number + "_thumbnail");
			href = commonUrl;

			setLink(objLink,name);
			setThumb(objLink,name);


//http://www.pixiv.net/member_illust.php?illust_id=画像ID&mode=medium
//m:450x600 s:120x150 128x128:128x128 64x64:64x64
//他にもhttp://i数字.pixiv.net/img数字/img/ユーザー/mobile/画像ID_480mw.jpgのようなモバイル用の指定もある
		//pixiv----------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/www.pixiv.net\/member_illust.*illust_id=.*$/)){
			name = "pixiv";
			expandUrl('GET',objLink,localDB[name +"Size"]);

//http://i数字1.pixiv.net/img数字2/img/ユーザ名/画像ID.png
		//pixiv展開後---------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/i\d+.pixiv.net\/img\d+\/img\/.*/)){
			name = "pixiv";

			//元から画像URLで投稿されていた場合、一度元のURLに戻す必要がある(画像URLのランダム数値を取得するため)
			if(!pixivSrcDB[objLink.href]){
				var picID = href.replace(/.*pixiv.net\/img\d+\/img\/.*?\//,"").replace(/(_.*?)?\..*/,"");
				var tempUrl = "http://www.pixiv.net/member_illust.php?mode=medium&illust_id=" + picID;
				objLink.setAttribute("ToT_URL",tempUrl);

				expandUrl('GET',objLink,localDB[name +"Size"]);
				return;

			//画像URLを展開した場合
			}else{
				src = 	pixivSrcDB[objLink.href];

				if(src.match(/error.jpg\?dummy=ddddd/)) href = objLink.href;

				setLink(objLink,name);
				setThumb(objLink,name);

			}

//http://img数字2.pixiv.net/img/ユーザ名/画像ID_m.jpg
		//pixivの画像直リンク----------------------------------------------------------------
		}else if(href.match(/^https?:\/\/img\d+.pixiv.net\/img\/.*/)){
			if(objLink.hasAttribute("id") && objLink.id.match(/ToT_/)) return;

			name = "pixiv";
			var picID = href.replace(/.*pixiv.net\/img\/.*?\//,"").replace(/(_.*?)?\..*/,"");
			var tempUrl = "http://www.pixiv.net/member_illust.php?mode=medium&illust_id=" + picID;
			objLink.setAttribute("ToT_URL",tempUrl);

			expandUrl('GET',objLink,localDB[name +"Size"]);
			return;



//http://i2.pixiv.net/c/600x600/img-master/img/2014/09/27/16/33/28/46211445_p0_master1200.jpg
//http://i1.pixiv.net/c/150x150/img-master/img/2014/09/22/23/00/29/46130708_square1200.jpg
//64x64、128x128、150x150、600x600、1200x1200を確認。他の指定があるかは不明
//master1200、square1200は形指定。マスターは元のまま、スクエアは四角
//p0はページ数の指定。漫画の場合がほとんどだけど、稀に1枚でもp0という指定の画像がある
		//pixiv2(他のURL)
		}else if(href.match(/^https?:\/\/i\d+.pixiv.net\/c\/\d+x\d+\/img-master\/img\/.*/)){
			name = "pixiv2";
			var size = localDB[name +"Size"];

			//元から直リンクの場合
			if(!pixivSrcDB[objLink.href]){
				src = href.replace(/\d+x\d+/,size);
				href = href.replace(/\d+x\d+/,"1200x1200");

			//画像展開の場合
			}else{
				src = 	pixivSrcDB[objLink.href].replace(/\d+x\d+/,size);
				if(src.match(/error.jpg\?dummy=ddddd/)) href = objLink.href;
				else href = src.replace(/\d+x\d+/,"1200x1200");
			}

			setLink(objLink,name);
			setThumb(objLink,name);


//http://tmblr.co/ZLYNzr1OJpp6R
//http://www.tumblr.com/xdo3zozjgf
//展開http://kiitakashi.tumblr.com/post/94821626267/1
		//tumblr短縮URL展開----------------------------------------------------------------------
		}else if(href.match(/^http:\/\/(www.)?tu?mblr.com?\/[a-zA-Z0-9].*$/)){
			name = "tumblr";
			expandUrl('HEAD',objLink);


//http://hisuix.tumblr.com/post/94823180344/dig-image-these-shacks-seen-sept-14-1945
		//tumblr画像URL取得--------------------------------------------------------------------------
		}else if(href.match(/^http:\/\/[\w\-]+.tumblr.com\/post\/[0-9]+.*$/)){
			name = "tumblr";
			tumblrDB[objLink.href] = [];
			expandUrl('GET',objLink);

//http://38.media.tumblr.com/1fc196798f1148541be4b24ea4f5fe68/tumblr_n91535WAqE1qz7j5oo1_1280.jpg
//http://media.tumblr.com/7c6a92c146926e253ddc17bb646354b5/tumblr_inline_nbzxp9p0cq1sfqkxz.jpg
//最大サイズ(ない場合もある):1280,500px:500, 400px:400, 250px:250, 100px:100, 75px:75sq
//URL展開処理で最大サイズを取得してきているはず
		//tumblr画像URL--------------------------------------------------------------------------
		}else if(href.match(/^http:\/\/(\d+.)?media.tumblr.com\/.*?\/tumblr_.*/)){

			if(tumblrDB[objLink.href] && tumblrDB[objLink.href] == ""){return;}

			name = "tumblr";

			function setTumblr(num){
				var size = parseInt(href.replace(/^http:\/\/\d+.media.tumblr.com\/.*?\/tumblr_.*?_(\d+)..*/,"$1"));
				var strSize = "_" + size +".";
				src = href;

				//サムネサイズにオリジナルのサイズ以上の指定は無効(オリジナルサイズのまま)、それ以下のみ設定
				if(parseInt(localDB[name +"Size"]) < size){
					src = href.replace(strSize,"_" + localDB[name +"Size"] + ".");
				}

//				src = src.replace(/https?/,"https");
//				href = href.replace(/https?/,"https");

				setLink(objLink,name,num);
				setThumb(objLink,name,num);
			}

			//複数画像の場合
			if(objLink.href != href && tumblrDB[objLink.href] != ""){

				for(var tu=tumblrDB[objLink.href].length -1;tu >= 0;tu--){
//				for(var tu=0;tu < tumblrDB[objLink.href].length;tu++){
					href = tumblrDB[objLink.href][tu];
					setTumblr(tu);
				}
				return;	//複数URLはここで終了
			}

			setTumblr();


//投稿URL: http://p.twipple.jp/画像ID
//旧・画像URL: http://p.twipple.jp/show/サイズ/画像ID
//画像URL: http://p.twpl.jp/show/サイズ/画像ID
//thumb、large、orig
		//ついっぷる---------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/p.twipple.jp\/.*$/) && !href.match(/^https?:\/\/p.twipple.jp\/.*?\//)){
			name = "twipple";
			var picID = href.replace(/.*twipple.jp\//,"");
			var commonUrl = "http://p.twpl.jp/show/";

			src = commonUrl + localDB[name +"Size"] + "/" + picID;
			href = commonUrl + "orig/" + picID;

			setLink(objLink,name);
			setThumb(objLink,name);

//ページ: http://twitgoo.com/<image-id>
//サムネイル画像: http://twitgoo.com/show/<size>/<image-id>
//サムネイル画像: http://twitgoo.com/<image-id>/<size>
//飛ばされる画像http://i60.twitgoo.com/画像IDじゃない文字列.jpg
//実際の画像http://i60.tinypic.com/画像IDじゃない文字列.jpg
//サムネ画像http://i60.tinypic.com/画像IDじゃない文字列_th.jpg
//“thumb”110x160, “img”オリジナル
//“mini”thumbと変わらない？
/*				//Twitgoo
		//tinypicに直さないと表示されない。しかし最初からtinypicで指定してもサムネ表示できない
		}else if(href.match(/^https?:\/\/twitgoo.com\/.*$/) && !href.match(/^https?:\/\/twitgoo.com\/.*?\//)){
			src = href + "/thumb";
			href = href + "/img";

			setLink(objLink,name);
			setThumb(objLink,name);

			//twitgooのURLをtinypicにする
//					window.setTimeout( function() {renameTwitgoo(node)}, 5000 );

*/

//http://twitpic.com/画像ID
//https://twitpic.com/show/thumb/画像ID.jpg
//mini:75x75、thumb:150x150、large:600x800、full:768x1024
		//twitpic------------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/twitpic.com\//)  && !href.match(/^https?:\/\/twitpic.com\/.*?\//)){
			name = "twitpic";
			var picID = href.replace(/.*twitpic.com\//,"");
			var commonUrl = "https://twitpic.com/show/";

			src = commonUrl + localDB[name +"Size"] + "/" + picID + ".jpg";
			href =  commonUrl + "full/" + picID + ".jpg";
//			src = href;

			setLink(objLink,name);
			setThumb(objLink,name);




		//twitter公式1-------------------------------------------------------------------
		//フラグ関係はtwitter1に依存
		}else if(href.match(/^https?:\/\/pic.twitter.com\/.*$/)){
			if(twitter1DB[objLink.href] && twitter1DB[objLink.href] == ""){return;}

			name = "twitter1";
			twitter1DB[objLink.href] = [];
			expandUrl('GET',objLink);


//投稿URL(何故か表示されない): http://p.twimg.com/画像ID.jpg:サイズ
//https://p.twimg.com/As2fObICEAAXRT-.jpg
//画像URL: http://pbs.twimg.com/media/画像ID.jpg:サイズ
//thumb、small、medium、large(またはorig)
		//twitter公式2-------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/p.twimg.com\/[\w]+/)  && !href.match(/^https?:\/\/p.twimg.com\/.*?\//)){
			name = "twitter2";
			var commonUrl = href.replace(/^https?/,"https").replace("p.twimg.com","pbs.twimg.com/media").replace(/#.*$/,"").replace(/(.*\/.*):.*$/i,"$1");
			var ext = extCheck(href) || "jpg";

			commonUrl = commonUrl.replace("." + ext,"");

			src = commonUrl + "." + ext + ":" + localDB[name +"Size"];
			href =  commonUrl + "." + ext + ":large";

			setLink(objLink,name);
			setThumb(objLink,name);

//http://pbs.twimg.com/media/BrHiRU5CMAE_yv-.png#twimg
		//twitter公式3
		}else if(href.match(/^https?:\/\/pbs.twimg.com\/media\/.*$/)){
			name = "twitter3";

			function setTwit(num){
				var commonUrl = href.replace(/^https?/,"https").replace(/#.*$/,"").replace(/(.*\/.*):.*$/i,"$1");

				src = commonUrl + ":" + localDB[name +"Size"];
				href = commonUrl + ":large";

				setLink(objLink,name,num);
				setThumb(objLink,name,num);
			}

			//twitter1で展開したURL
			if(objLink.href != href){
				name = "twitter1";
				//複数URLだったら
				if(twitter1DB[objLink.href] && twitter1DB[objLink.href] != ""){
					for(t=twitter1DB[objLink.href].length -1;t >= 0;t--){
						href = twitter1DB[objLink.href][t];
						setTwit(t);
					}
					return;	//複数URLはここで終了
				}
			}

			//通常
			setTwit();

//http://twitter.com/luv5mj/status/503242246607491072/photo/1
		//twitter公式3-------------------------------------------------------------------
		//フラグ関係はtwitter3に依存
		}else if(href.match(/^https?:\/\/twitter.com\/.*status.*photo.*$/)){
			name = "twitter3";
			expandUrl('GET',objLink);

		//twitter公式3動画のサムネ-------------------------------------------------------------
		//フラグ関係はtwitter3に依存
		}else if(href.match(/^https?:\/\/pbs.twimg.com\/tweet_video_thumb.*?/)){
			name = "twitter3";

			src = href + ":" + localDB[name +"Size"];
			href = href + ":large";

			setLink(objLink,name);
			setThumb(objLink,name);

//http://pbs.twimg.com/ext_tw_video_thumb/585373708685946881/pu/img/_3cfKxGsysdIuxJX.jpg
		//twitter公式4 外部動画のサムネ-------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/pbs.twimg.com\/ext_tw_video_thumb\/.*$/)){
			name = "twitter4";

			function setTwit(num){
				var commonUrl = href.replace(/^https?/,"https").replace(/#.*$/,"").replace(/(.*\/.*):.*$/i,"$1");

				src = commonUrl + ":" + localDB[name +"Size"];
				href = commonUrl + ":large";

				setLink(objLink,name,num);
				setThumb(objLink,name,num);
			}

			//通常
			setTwit();

//http://video.twimg.com/ext_tw_video/585373708685946881/pu/vid/720x720/crlTijKmwHmpls6I.mp4
		//twitter公式4 外部動画-------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/video.twimg.com\/ext_tw_video\/.*$/)){
			var ext = extCheck(href);
			var tmpUrl = href.replace(/^https?/,"https")
			if(!ext) addMovie(name,objLink,tmpUrl,tmpUrl);

//https://vimeo.com/動画ID
//サムネ取得api https://vimeo.com/api/v2/video/動画ID.json
		//vimeo-----------------------------------------------------------
		}else if(href.match(/^https?:\/\/vimeo.com\/\d+/)){
			name = "vimeo";
			href = href.replace(/https?/,"https");
			var vimeoApi = href.replace(/(.*vimeo.com)\/(\d+)/,"$1/api/v2/video/$2.json");

			objLink.setAttribute("ToT_URL",vimeoApi);
			expandUrl('GET',objLink);

//thumbnail_small 100x75 thumbnail_medium 200x150 thumbnail_large 640
		//vimeoサムネ-----------------------------------------------------------
		}else if(href.match(/^https?:\/\/i.vimeocdn.com\/video\/\d+/)){
			name = "vimeo";

			setLink(objLink,name);
			setThumb(objLink,name);

		//vine-------------------------------------------------------------
		}else if(href.match(/^https?:\/\/vine\.co\/v\/./)){
			name = "vine";
			expandUrl('GET',objLink);

		//vineサムネ-----------------------------------------------------------
		}else if(href.match(/^https?:\/\/.*vine.co\/.*thumbs\/./)){
			name = "vine";

			setLink(objLink,name);
			setThumb(objLink,name);

			var img = document.getElementById("ToT_Thumb:"+href).getElementsByTagName("img")[0];

			img.setAttribute("style","max-width:" + localDB[name +"Size"] + "px;");



//http://youtu.be/動画Id
//https://www.youtube.com/watch?feature=player_embedded&v=動画Id
//https://www.youtube.com/watch?v=動画Id
//サムネhttps://img.youtube.com/vi/動画Id/size.jpg
//size: mqdefault – 320×180 , 0 – 480×360 , 1 – 120×90 , 2 – 120×90 , 3 – 120×90
//sizeはmqdefault0と2はデフォルトで使用されるサムネ。1は別の画像、3はさらに別の画像

		//youtube--------------------------------------------------------------------------
		}else if(href.match(/^https?:\/\/(www|m).youtube.com\/watch.*(\?|&)v=./) || href.match(/^https?:\/\/(youtu.be|y2u.be)\/./)){
			var movieId;
			name = "youtube";
			var commonUrl = "https://img.youtube.com/vi/";
			var movieUrl = "https://www.youtube.com/v/";

			if(href.match(/^https?:\/\/(youtu.be|y2u.be)/)){
				//短縮URLを簡易的に展開
				if(localDB["expandFlg"]){
					movieId = href.replace(/^https?:\/\/(youtu.be|y2u.be)\//,"");
					href = "https://www.youtube.com/watch?v=" + movieId;
//					objLink.setAttribute("data-expanded-url",href);
					objLink.setAttribute("href",href);
				}
			}else{
				movieId = href.replace(/.*(\?|&)v=/,"");
			}

			movieId = movieId.replace(/(\?|&).*/,"").replace(/#.*/,"").replace(/\/$/,"");
			src = commonUrl + movieId + "/" + localDB[name +"Size"] + ".jpg";
			href =  commonUrl  + movieId + "/0.jpg";

			setLink(objLink,name);
			setThumb(objLink,name);

			var youtubeParams = "&playlist=" + movieId + "&autohide=1";

			var tmpUrl = movieUrl + movieId + '?vq=' + localDB["youtubeQualitySize"] + youtubeParams;
			addMovie(name,objLink,href,tmpUrl);

		//その他-------------------------------------------------------------------------
		}else{
			//拡張子ありのURLのサムネだけ追加-------------------------------------
			var comma = href.slice(-5).indexOf(".");
			fileType = "";		//拡張子

			if(comma > -1 && comma < 2){
				//その他の画像URLのサムネ追加
				name = "otherPic";
				if(localDB[name + "Thumb"]){
					fileType = href.replace(/.*\./,"");

					//画像の拡張子だったらサムネ追加
					picExt.forEach(function(x){
						if(x == fileType){ setThumb(objLink,name); }
					});
				}
				//動画の拡張子だったら・・・
			}
		}//チェック部分ここまで===============================================================================

}catch(e){
	GM_log("ToT_mainCheck_Error:"+e);
}
	}//mainCheckここまで====================================================================================


		//保存用のリンク追加----------------------------------------------------------------------------------
		function setLink(objLink,name,num){
try{
			var regCheck = new RegExp('id="ToT_Link:' + href.replace(/\?/,"\\?") + '"');

			//ユーザー設定で追加しないなら終了
			if(localDB["AllThumbsAndLinksLink"] == false || localDB[name +"Link"] == false
			//一度追加済み
			|| objLink.parentNode.innerHTML.match(regCheck)
			){
				return;
			}

			var className = '';

			if(name == "twitgoo"){
				var className = 'twitgooText';
			}

			var ele = document.createElement("div");

			var strLinkText = '<a id="ToT_Link:' + href + '" class="' + className + '" target="_blank" href="' + href + '" >'
				+'<img src=\'chrome://browser/skin/tabbrowser/loading.png\'>now loading'


				//リンク切れ確認用imgタグ
				+ '<img src="' + src + '" onError="'
				//画像読み込み失敗
				+ 'this.parentNode.innerHTML=\'' + strIcon
				+ '<a href=' + href + '>dead link</a>\'}" '
				+ 'onload= "this.innerHTML=\'\';this.parentNode.innerHTML=\'' + strIcon + 'Save Image As...\';"'
				+ 'Style="max-width:0px;max-height:0px;"></a><br>';


			//サムネを追加しない場合改行追加
			if(localDB["AllThumbsAndLinksThumb"] == false || localDB[name + "Thumb"] == false){
				//複数画像指定じゃない。または複数画像指定の1枚目だったら改行追加
				if(!num || num && num == 0){objLink.innerHTML = "<br>" + objLink.innerHTML; strLinkText = "<br>" + strLinkText;}
			}

			objLink.insertAdjacentHTML(insertWhere, strLinkText);

			objLink.setAttribute("ToT_Link","added");
			objLink.removeAttribute("ToT_URL");
}catch(e){
	GM_log("ToT_setLink_Error:"+e);
}
		}//リンク追加ここまで



		//サムネ追加----------------------------------------------------------------------------------
		function setThumb(objLink,name,num){
try{
			var regCheck = new RegExp('id="ToT_Thumb:' + href.replace(/\?/,"\\?") + '"');

			//ユーザー設定で追加しないなら終了
			if(localDB["AllThumbsAndLinksThumb"] == false || localDB[name +"Thumb"] == false
			//一度追加済み
			|| objLink.parentNode.innerHTML.match(regCheck)
			){
				return;
			}


			var strMW = "510";	//max-width
			var className = "", resolvedUrl = "";

			//画像クリックで出るポップアップウィンドウ内
			if(objLink.parentNode.parentNode.parentNode.className.match(/simple-tweet/)){
				strMW = "400";
			}

			//imgurのgifを動かすための対応
			if(name == "imgur" && fileType.match(/gif/i)){
				var imgurSize = localDB[name +"Size"];
				if(imgurSize == "s") strMW = "90";
				if(imgurSize == "m") strMW = "320";

			//droplrのgifを動かすための対応
			}else if(name = "droplr" && localDB[name +"Size"] == "custom"){
				strMW = "100";
			//サムネのピンボケ対策などサイズ指定
			}else if(name == "otherPic" && localDB[name + "Size"] == "thumb"){
				strMW = "150";
			}

			//サムネクリックで小窓が出るようにクラス名変更
			if(objLink.className){
				//ツイート個別ページ
				if(location.href.match(/\/status\//)){
					className =  ' class="media media-thumbnail twitter-timeline-link is-preview"';
				//検索ページ
				}else if(location.href.match(/twitter.com\/search\?/)){
					className =  ' class="media media-thumbnail twitter-timeline-link media-forward is-preview"';
				}else{
					className =  ' class="TwitterPhoto-link media-thumbnail twitter-timeline-link"';
				}
			}
			//画像表示のためにリファラ追加
//			if(name == "pixiv") objLink.setAttribute("rel","http://pixiv.net");
			objLink.setAttribute("rel",href);

			var strThumbText = '<a id="ToT_Thumb:' + href + '"' + className + resolvedUrl + ' href="' + href + '" data-resolved-url-large="' + href
				+ '" Style="padding-right:5px;" ToT_Thumb=added onclick="return false;" >'
				+ '<img src="' + src + '"  Style="max-width:' + strMW + 'px;" '

				//onerror----------------------------------------------------------
				+'onerror="'
				//読み込み失敗ならdead link
					//サイズを変更(img.ly)
				+	'if(this.src.match(/(mini|thumb|medium)_/) && !this.src.match(/(large|full)_/)){'
				+		'this.src = this.src.replace(/\\/(mini|thumb|medium)_/,\'/large_\');'
				+		'return;'
				+	'}'
					//twitter
				+	'if(!this.src.match(/pbs.twimg.com.*:(large)$/)){'
				+		'this.parentNode.href = this.parentNode.href.replace(/(.*pbs.twimg.com.*):.*/,\'$1:large\');'
				+		'this.src = this.src.replace(/(.*pbs.twimg.com.*):.*/,\'$1:large\');'
				+		'return;'
				+	'}'
				+	'var url = \'' +href+ '\';this.parentNode.style=\'font-size:12px\';'
				+	'this.parentNode.insertAdjacentHTML(\'afterend\','
				+	'\'' + strIcon + '<a href=' + href + ' style=\\\'font-size:12px;\\\'>dead link</a>\''
				+	');'
				+	'this.setAttribute(\'onerror\',\'\');'
				+ '" '
				+ '></a>';


			//複数画像の時の改行
			if(num || num == 0){
				if(num == 0){ strThumbText = "<br>" + strThumbText; objLink.innerHTML = "<br>" + objLink.innerHTML; }
			//通常
			}else{
				 strThumbText = "<br>" + strThumbText + "<br>"
				//元のリンクも改行
				objLink.innerHTML = "<br>" + objLink.innerHTML;
			}



try{

			//ユーザーのツイートページだった場合のサムネ
			if(!location.href.match(/https?:\/\/twitter.com\/search\?/) 
			&& objLink.parentNode.parentNode  && objLink.parentNode.parentNode.className == "TwitterPhoto-container"){
				if(objLink.innerHTML.match(/<img/i)){
					//class"TwitterPhoto-link media-thumbnail twitter-timeline-link"の中に入れる
					insertWhere = "afterbegin";
					objLink.innerHTML = "";

					//一個上の要素のcssが邪魔なのでclass名変更
					objLink.parentNode.className = "ToT_changed:" + objLink.parentNode.className;

				}
			}


			//追加
			objLink.insertAdjacentHTML(insertWhere, strThumbText);
			objLink.setAttribute("ToT_Thumb","added");

			//削除
			if(objLink.className=="media media-thumbnail twitter-timeline-link is-preview")objLink.innerHTML ="";
			delDef(objLink);
}catch(e){
	GM_log("ToT_timeline_Error:" + e);
}

			objLink.removeAttribute("ToT_URL");
}catch(e){
	GM_log("ToT_setThumb_Error:"+e);
}

		}//サムネ追加ここまで







//ユーザー設定画面(userconfig)-------------------------------------------------------------
function userCfg(){




//==============================================================
//GreaseForkがrequireの審査必要なのでいっそのこと埋め込みました。
//Copyright: JoeSimmons & Sizzlemctwizzle & IzzySoft 
//require (c)https://greasyfork.org/scripts/1884-gm-config
//v1.2.57
//==============================================================

//============================引用開始===================================

var GM_config = {
 storage: 'GM_config',
 init: function() {
        // loop through GM_config.init() arguments
	for(var i=0,l=arguments.length,arg; i<l; ++i) {
		arg=arguments[i];
		switch(typeof arg) {
            case 'object': for(var j in arg) { // could be a callback functions or settings object
							switch(j) {
							case "open": GM_config.onOpen=arg[j]; delete arg[j]; break; // called when frame is gone
							case "close": GM_config.onClose=arg[j]; delete arg[j]; break; // called when settings have been saved
							case "save": GM_config.onSave=arg[j]; delete arg[j]; break; // store the settings objects
							default: var settings = arg;
							}
			} break;
            case 'function': GM_config.onOpen = arg; break; // passing a bare function is set to open
                        // could be custom CSS or the title string
			case 'string': if(arg.indexOf('{') !== -1 && arg.indexOf('}') !== -1) var css = arg;
				else GM_config.title = arg;
				break;
		}
	}
	if(!GM_config.title) GM_config.title = 'Settings - Anonymous Script'; // if title wasn't passed through init()

	// give the script a unique saving ID for non-firefox browsers
	GM_config.storage = GM_config.title.replace(/\W+/g, "").toLowerCase();

	var stored = GM_config.read(); // read the stored settings
	GM_config.passed_values = {};
	for(var i in settings) {
		GM_config.doSettingValue(settings, stored, i, null, false);
		if(settings[i].kids) for(var kid in settings[i].kids) GM_config.doSettingValue(settings, stored, kid, i, true);
	}
	GM_config.values = GM_config.passed_values;
	GM_config.settings = settings;
	if (css) GM_config.css.stylish = css;
 },
 open: function() {
 if(document.evaluate("//iframe[@id='GM_config']",document,null,9,null).singleNodeValue) return;
	// Create frame
	document.body.appendChild((GM_config.frame=GM_config.create('iframe',{id:'GM_config', style:'position: fixed; top: 0; left: 0; opacity: 0; display: none; z-index: 999999; width: 75%; height: 75%; max-height: 95%; max-width: 95%; border:3px ridge #000000; overflow: auto;'})));
        GM_config.frame.src = 'about:blank'; // In WebKit src cant be set until it is added to the page
	GM_config.frame.addEventListener('load', function() {
		var obj = GM_config, doc = this.contentDocument, frameBody = doc.getElementsByTagName('body')[0], create=obj.create, settings=obj.settings, anch, secNo;
		obj.frame.contentDocument.getElementsByTagName('head')[0].appendChild(create('style',{type:'text/css',textContent:obj.css.basic + "\n\n" + obj.css.stylish}));

		// Add header and title
		frameBody.appendChild(create('div', {id:'header',className:'config_header block center', innerHTML:obj.title}));

		// Append elements
		anch = frameBody; // define frame body
		secNo = 0; // anchor to append elements
		for(var i in settings) {
			var type, field = settings[i], value = obj.values[i], section = (field.section ? field.section : ["Main Options"]),
				headerExists = doc.evaluate(".//div[@class='section_header_holder' and starts-with(@id, 'section_')]", frameBody, null, 9, null).singleNodeValue;

			if(typeof field.section !== "undefined" || headerExists === null) {
				anch = frameBody.appendChild(create('div', {className:'section_header_holder', id:'section_'+secNo, kids:new Array(
				  create('a', {className:'section_header center', href:"javascript:void(0);", id:'c_section_kids_'+secNo, textContent:section[0], onclick:function(){GM_config.toggle(this.id.substring(2));}}),
				  create('div', {id:'section_kids_'+secNo, className:'section_kids', style:obj.getValue('section_kids_'+secNo, "")==""?"":"display: none;"})
				)}));
				if(section[1]) anch.appendChild(create('p', {className:'section_desc center',innerHTML:section[1]}));
				secNo++;
			}
			anch.childNodes[1].appendChild(GM_config.addToFrame(field, i, false));
		}

		// Add save and close buttons
		frameBody.appendChild(obj.create('div', {id:'buttons_holder', kids:new Array(
			obj.create('button',{id:'saveBtn',textContent:'Save',title:'Save options and close window',className:'saveclose_buttons',onclick:function(){GM_config.close(true)}}),
			obj.create('button',{id:'cancelBtn', textContent:'Cancel',title:'Close window',className:'saveclose_buttons',onclick:function(){GM_config.close(false)}}),
			obj.create('div', {className:'reset_holder block', kids:new Array(
				obj.create('a',{id:'resetLink',textContent:'Restore to default',href:'#',title:'Restore settings to default configuration',className:'reset',onclick:obj.reset})
		)}))}));

		obj.center(); // Show and center it
//無効化disabled
//		window.addEventListener('resize', obj.center, false); // Center it on resize
		if (obj.onOpen) obj.onOpen(); // Call the open() callback function
		
		// Close frame on window close
		window.addEventListener('beforeunload', function(){GM_config.remove(this);}, false);
	}, false);
 },
 close: function(save) {
	if(save) {
		var type, fields = GM_config.settings, typewhite=/radio|text|hidden|password|checkbox/;
		for(f in fields) {
			var field = GM_config.frame.contentDocument.getElementById('field_'+f), kids=fields[f].kids;
			if(typewhite.test(field.type)) type=field.type;
				else type=field.tagName.toLowerCase();
			GM_config.doSave(f, field, type);
			if(kids) for(var kid in kids) {
			var field = GM_config.frame.contentDocument.getElementById('field_'+kid);
			if(typewhite.test(field.type)) type=field.type;
				else type=field.tagName.toLowerCase();
			GM_config.doSave(kid, field, type, f);
			}
		}
                if(GM_config.onSave) GM_config.onSave(); // Call the save() callback function
                GM_config.save();
	}
	if(GM_config.frame) GM_config.remove(GM_config.frame);
	delete GM_config.frame;
        if(GM_config.onClose) GM_config.onClose(); //  Call the close() callback function
 },
 set: function(name,val) {
	GM_config.values[name] = val;
 },
 get: function(name) {
	return GM_config.values[name];
 },
 isGM: (typeof window.opera === "undefined" && typeof window.chrome === "undefined" && typeof GM_info === "object" && typeof GM_registerMenuCommand === "function"),
 log: function(str) {

	if(this.isGM) return GM_log(str);
		else if(window.opera) return window.opera.postError(str);
		else return console.log(str);

 },
 getValue : function(name, d) {
	var r, def = (typeof d !== "undefined" ? d : "");
	switch(this.isGM === true) {
		case true: r = GM_getValue(name, def); break;
		case false: r = localStorage.getItem(name) || def; break;
	}
	return r;
},
 setValue : function(name, value) {
	switch(this.isGM === true) {
		case true: GM_setValue(name, value); break;
		case false: localStorage.setItem(name, value); break;
	}
 },
  deleteValue : function(name) {
	switch(this.isGM === true) {
		case true: GM_deleteValue(name); break;
		case false: localStorage.removeItem(name); break;
	}
},
 save: function(store, obj) {
    try {
		var val = JSON.stringify(obj || GM_config.values);
		GM_config.setValue((store||GM_config.storage),val);
    } catch(e) {
		GM_config.log("GM_config failed to save settings!\n" + e);
    }
 },
 read: function(store) {
	var val = GM_config.getValue((store || GM_config.storage), '{}');
	switch(typeof val) {
		case "string": var rval = JSON.parse(val); break;
		case "object": var rval = val; break;
		default: var rval = {};
	}
    return rval;
 },
 reset: function(e) {
	e.preventDefault();
	var type, obj = GM_config, fields = obj.settings;
	for(f in fields) {
		var field = obj.frame.contentDocument.getElementById('field_'+f), kids=fields[f].kids;
		if(field.type=='radio'||field.type=='text'||field.type=='checkbox') type=field.type;
		else type=field.tagName.toLowerCase();
		GM_config.doReset(field, type, null, f, null, false);
		if(kids) for(var kid in kids) {
			var field = GM_config.frame.contentDocument.getElementById('field_'+kid);
			if(field.type=='radio'||field.type=='text'||field.type=='checkbox') type=field.type;
				else type=field.tagName.toLowerCase();
			GM_config.doReset(field, type, f, kid, true);
		}
	}
 },
 addToFrame : function(field, i, k) {
	var elem, obj = this, anch = this.frame, value = obj.values[i], Options = field.options, label = field.label, create=obj.create, isKid = (k !== null && k === true);
		switch(field.type) {
				case 'textarea':
					elem = create(isKid ? "span" : "div", {title:field.title||'', kids:new Array(
						create('span', {textContent:label, className:'field_label'}),
						create('textarea', {id:'field_'+i,innerHTML:value, cols:(field.cols?field.cols:20), rows:(field.rows?field.rows:2)})
					), className: 'config_var'});
					break;
				case 'radio':
					var boxes = new Array();
					for (var j = 0,len = Options.length; j<len; j++) {
						boxes.push(create('span', {textContent:Options[j]}));
						boxes.push(create('input', {value:Options[j], type:'radio', name:i, checked:Options[j]==value?true:false}));
					}
					elem = create(isKid ? "span" : "div", {title:field.title||'', kids:new Array(
						create('span', {textContent:label, className:'field_label'}),
						create('span', {id:'field_'+i, kids:boxes})
					), className: 'config_var'});
					break;
				case 'select':
					var options = [];
					if(typeof Options === "object" && typeof Options.push !== "function") for(var j in Options) options.push(create('option',{textContent:Options[j],value:j,selected:(j==value)}));
						else options.push(create("option", {textContent:"Error - \"options\" needs to be a JSON object.", value:"error", selected:"selected"}));
					elem = create(isKid ? "span" : "div", {title:field.title||'', kids:new Array(
						create('span', {textContent:label, className:'field_label'}),
						create('select',{id:'field_'+i, kids:options})
					), className: 'config_var'});
					break;
				case 'checkbox':
					elem = create(isKid ? "span" : "div", {title:field.title||'', kids:new Array(
						create('label', {textContent:label, className:'field_label', "for":'field_'+i}),
						create('input', {id:'field_'+i, type:'checkbox', value:value, checked:value})
					), className: 'config_var'});
					break;
				case 'button':
				var tmp;
					elem = create(isKid ? "span" : "div", {kids:new Array(
						(tmp=create('input', {id:'field_'+i, type:'button', value:label, size:(field.size?field.size:25), title:field.title||''}))
					), className: 'config_var'});
					if(field.script) obj.addEvent(tmp, 'click', field.script);
					break;
				case 'hidden':
					elem = create(isKid ? "span" : "div", {title:field.title||'', kids:new Array(
						create('input', {id:'field_'+i, type:'hidden', value:value})
					), className: 'config_var'});
					break;
				case 'password':
					elem = create(isKid ? "span" : "div", {title:field.title||'', kids:new Array(
						create('span', {textContent:label, className:'field_label'}),
						create('input', {id:'field_'+i, type:'password', value:value, size:(field.size?field.size:25)})
					), className: 'config_var'});
					break;
				default:
					elem = create(isKid ? "span" : "div", {title:field.title||'', kids:new Array(
						create('span', {textContent:label, className:'field_label'}),
						create('input', {id:'field_'+i, type:'text', value:value, size:(field.size?field.size:25)})
					), className: 'config_var'});
			}
	if(field.kids) {
		var kids=field.kids;
		for(var kid in kids) elem.appendChild(obj.addToFrame(kids[kid], kid, true));
	}
return elem;
},
 doSave : function(f, field, type, oldf) {
 var isNum=/^[\d\.]+$/, set = oldf ? GM_config.settings[oldf]["kids"] : GM_config.settings;
 switch(type) {
				case 'text':
					GM_config.values[f] = ((set[f].type=='text') ? field.value : ((isNum.test(field.value) && ",int,float".indexOf(","+set[f].type)!=-1) ? parseFloat(field.value) : false));
					if(set[f]===false) {
						alert('Invalid type for field: '+f+'\nPlease use type: '+set[f].type);
						return;
					}
					break;
				case 'hidden': case 'password':
					GM_config.values[f] = field.value.toString();
					break;
				case 'textarea':
					GM_config.values[f] = field.value;
					break;
				case 'checkbox':
					GM_config.values[f] = field.checked;
					break;
				case 'select':
					GM_config.values[f] = field.options[field.selectedIndex].value;
					break;
				case 'span':
					var radios = field.getElementsByTagName('input');
					if(radios.length>0) for(var i=radios.length-1; i>=0; i--) {
						if(radios[i].checked) GM_config.values[f] = radios[i].value;
					}
					break;
			}
 },
 doSettingValue : function(settings, stored, i, oldi, k) {
		var set = k!=null && k==true && oldi!=null ? settings[oldi]["kids"][i] : settings[i];
			if(",save,open,close".indexOf(","+i) == -1) {
            // The code below translates to:
            // if a setting was passed to init but wasn't stored then 
            //      if a default value wasn't passed through init() then use null
            //      else use the default value passed through init()
            // 		else use the stored value
            try {
            var value = (stored[i]==undefined ? (set["default"]==undefined ? null : set["default"]) : stored[i]);
			} catch(e) {
			var value = (stored[i]=="undefined" ? (set["default"]=="undefined" ? null : set["default"]) : stored[i]);
			}
            
            // If the value isn't stored and no default was passed through init()
            // try to predict a default value based on the type
            if (value === null) {
                switch(set["type"]) {
                    case 'radio': case 'select':
                        value = set.options[0]; break;
                    case 'checkbox':
                        value = false; break;
                    case 'int': case 'float':
                        value = 0; break;
                    default:
					value = (typeof stored[i]=="function") ? stored[i] : "";
                }
			}
			
			}
	GM_config.passed_values[i] = value;
 },
 doReset : function(field, type, oldf, f, k) {
 var isKid = k!=null && k==true, obj=GM_config,
	 set = isKid ? obj.settings[oldf]["kids"][f] : obj.settings[f];
 switch(type) {
			case 'text':
				field.value = set['default'] || '';
				break;
			case 'hidden': case 'password':
				field.value = set['default'] || '';
				break;
			case 'textarea':
				field.value = set['default'] || '';
				break;
			case 'checkbox':
				field.checked = set['default'] || false;
				break;
			case 'select':
				if(set['default']) {
					for(var i=field.options.length-1; i>=0; i--)
					if(field.options[i].value==set['default']) field.selectedIndex=i;
				}
				else field.selectedIndex=0;
				break;
			case 'span':
				var radios = field.getElementsByTagName('input');
				if(radios.length>0) for(var i=radios.length-1; i>=0; i--) {
					if(radios[i].value==set['default']) {
						radios[i].checked=true;
					}
				}
				break;
		}
 },
 values: {},
 settings: {},
 css: {
	 basic: 'body {background:#FFFFFF;}\n' +
	 '.indent40 {margin-left:40%;}\n' +
	 '* {font-family: arial, tahoma, sans-serif, myriad pro;}\n' +
	 '.field_label {font-weight:bold; font-size:12px; margin-right:6px;}\n' +
	 '.block {display:block;}\n' +
	 '.saveclose_buttons {\n' +
	 'margin:16px 10px 10px 10px;\n' +
	 'padding:2px 12px 2px 12px;\n' +
	 '}\n' +
	 '.reset, #buttons_holder, .reset a {text-align:right; color:#000000;}\n' +
	 '.config_header {font-size:20pt; margin:0;}\n' +
	 '.config_desc, .section_desc, .reset {font-size:9pt;}\n' +
	 '.center {text-align:center;}\n' +
	 '.section_header_holder {margin-top:8px;}\n' +
	 '.config_var {margin:0 0 4px 0; display:block;}\n' +
	 '.config_var {font-size: 13px !important;}\n' +
	 '.section_header {font-size:13pt; background:#414141; color:#FFFFFF; border:1px solid #000000; margin:0;}\n' +
	 '.section_desc {font-size:9pt; background:#EFEFEF; color:#575757; border:1px solid #CCCCCC; margin:0 0 6px 0;}\n' +
	 'input[type="radio"] {margin-right:8px;}',
	 stylish: ''
 },
 create: function(a,b) {
	var ret=window.document.createElement(a);
	if(b) for(var prop in b) {
		if(prop.indexOf('on')==0) ret.addEventListener(prop.substring(2),b[prop],false);
		else if(prop=="kids" && (prop=b[prop])) for(var i=0; i<prop.length; i++) ret.appendChild(prop[i]);
		else if(",style,accesskey,id,name,src,href,for".indexOf(","+prop.toLowerCase())!=-1) ret.setAttribute(prop, b[prop]);
		else ret[prop]=b[prop];
	}
	return ret;
 },
 center: function() {
	var node = GM_config.frame, style = node.style, beforeOpacity = style.opacity;
	if(style.display=='none') style.opacity='0';
	style.display = '';
	style.top = Math.floor((window.innerHeight/2)-(node.offsetHeight/2)) + 'px';
	style.left = Math.floor((window.innerWidth/2)-(node.offsetWidth/2)) + 'px';
	style.opacity = '1';
 },
 run: function() {
    var script=GM_config.getAttribute('script');
    if(script && typeof script=='string' && script!='') {
      func = new Function(script);
      window.setTimeout(func, 0);
    }
 },
 addEvent: function(el, ev, scr) {
	if(el) el.addEventListener(ev, function() {
		typeof scr === 'function' ? window.setTimeout(scr, 0) : eval(scr)
	}, false);
},
 remove: function(el) {
	if(el && el.parentNode) el.parentNode.removeChild(el);
},
 toggle : function(e) {
	var node=GM_config.frame.contentDocument.getElementById(e);
	node.style.display=(node.style.display!='none')?'none':'';
	GM_config.setValue(e, node.style.display);
 },
};



//============================引用ここまで===================================


//ユーザー設定(User's settings)-------------------------------------------------------------------------------------

	var ToT_Layer={};	//設定画面の背景レイヤー

	//背景レイヤー
	var cssLayer = 'position:fixed; top:0px; left:0px; width:100%; height:100%; background-color:black; z-index:5000; opacity:0.7;';
	document.body.appendChild((ToT_Layer.frame=window.document.createElement('iframe',{id:'ToT_Layer', style:cssLayer , })));
        ToT_Layer.frame.src = 'about:blank';
	ToT_Layer.frame.addEventListener('load', makeLayer);
	
	//背景レイヤー作成
	function makeLayer(){
		//背景レイヤーのbody
		var objLayer = this.contentDocument.body;
		objLayer.setAttribute("style",'width:100%; height:100%; overflow:hidden;');
		objLayer.addEventListener('click', cfgSwitch.close,false);
		objLayer.addEventListener('beforeunload', function(){
			objLayer.removeEventListener('click', cfgSwitch.close,false);
			objLayer.removeEventListener("beforeunload", arguments.callee);
		}, false);

		//設定ボタンクリックで設定画面を呼び出す(Open Config Window,when click the Config Button)
		var setBtn = document.getElementById("setBtn");
		if(setBtn != undefined){
			setBtn.addEventListener('click', cfgSwitch.select, true);
		}

		ToT_Layer.frame.removeEventListener("load", makeLayer);
	}


	//設定画面の開く閉じる切り替え
	var cfgSwitch = {
		init:function(){
			if(window.parent) var document = window.parent.document;
		},
		select:function(){
			cfgSwitch.init();
			if(document.evaluate("//iframe[@id='GM_config']",document,null,9,null).singleNodeValue){
				cfgSwitch.close();
			}else{
				cfgSwitch.open();
			}
		},
		open:function(){
			cfgSwitch.init();
			GM_config.open();
			ToT_Layer.frame.setAttribute("style",cssLayer);
			scrollY = document.documentElement.scrollTop || document.body.scrollTop;
//			window.addEventListener('scroll', noscroll,false);
			noscroll(true);
		},
		save:function(){
			cfgSwitch.init();
			GM_config.save();
			ToT_Layer.frame.setAttribute("style",'display:none;');
//			window.removeEventListener('scroll', noscroll,false);
			noscroll(false);
			scrollY = null;
		},
		close:function(){
			cfgSwitch.init();
			GM_config.close();
			ToT_Layer.frame.setAttribute("style",'display:none;');
//			window.removeEventListener('scroll', noscroll,false);
			noscroll(false);
			scrollY = null;
		}
	};


	//設定画面(Config Window)
	GM_config.init('Config - Thumbnail size' /* Script title */,
	/* Settings object */
	//initを連装配列に変更
	cfgData,
	{
	open: function() {
		cfgOpen();
	}
	});//設定画面(Config Window)ここまで



	function cfgOpen(){

		//config window
		var cfg_Window = document.getElementById("GM_config");
		var cfg_doc = cfg_Window.contentDocument;
		var cfg_body = cfg_doc.body;

		//save & cancel
		var cfg_save = cfg_doc.getElementById("saveBtn");//セーブボタン
		var cfg_cancel = cfg_doc.getElementById("cancelBtn");//キャンセルボタン


		//設定画面を閉じる
		cfg_save.addEventListener('mousedown', function(){
			cfgSwitch.save();
			cfg_save.removeEventListener('mousedown', arguments.callee);
		},false);
		//設定画面を閉じる
		cfg_cancel.addEventListener('mousedown', function(){
			cfgSwitch.close();
			cfg_cancel.removeEventListener('mousedown', arguments.callee);
		},false);


		//GM_config window style
		cfg_Window.removeAttribute("style");
		var cssBody = '#GM_config{position:fixed;top:40px;left:20px;z-index:999999;width:calc(100% - 40px);height:calc(100% - 60px);border:3px ridge #000000; overflow: auto;}'
		+	'@media screen and (min-width: 900px){ #GM_config{left:5%!important;width:89%!important;} }';//ここまで
		addStyle(document,cssBody);

		//youtubeQualityの設定-----------------
		var cfg_youtubeQL = cfg_doc.getElementById("field_youtubeQualityLink");
		var cfg_youtubeQT = cfg_doc.getElementById("field_youtubeQualityThumb");

		cfg_youtubeQT.parentNode.insertAdjacentHTML('afterend', "<label style=background:lightgray; class=field_label>youtubecenterなどの設定を優先します。"
			+ "<br>\"Addons(ex:youtubecenter)\" settings is high Priority,<br>more than this.</label>");

		//youtubeQualityの設定で2つ非表示
		cfg_youtubeQL.parentNode.setAttribute("style","display:none;");
		cfg_youtubeQT.parentNode.setAttribute("style","display:none;");
		//youtubeQualityの設定ここまで-----------------


		//ESCで閉じる
		cfgClose(document.body);
		cfgClose(cfg_body);


		//説明書き
		var cfg_exSect = cfg_Window.contentDocument.getElementById("c_section_kids_0");
		var cfg_importantPoint = cfg_Window.contentDocument.getElementById("field_ImportantPoint");

	        cfg_exSect.setAttribute("style", "display:block;");
	        cfg_importantPoint.setAttribute("style", "border:none;resize: none;height:150px;width:100%;disabled:;");
		cfg_importantPoint.setAttribute("readonly", "");


		//各サムネ設定の配置指定--------------------------------------------------

		//共通
		var cssCommon = '#saveBtn,#cancelBtn,.reset_holder.block{ position:fixed; right:10px; bottom:20px;display: inline-block!important;}'
				+ '#saveBtn{right:100px;}'
				+ '.reset_holder.block{bottom:8px;}'
				+ '#buttons_holder{height:80px;}'
				//ヘッダ
				+ '.section_header{background:rgb(200,230,250)!important;color:black!important;'
				+ 	'border-right:none;border-top:none; border-left:2px solid rgb(130,180,250);border-bottom:2px solid rgb(130,180,250);'
				+ '}'
				+ '.section_header.center:not(#c_section_kids_0){ display:block;width:350px;text-align:left; -moz-text-decoration-line: none!important;}'
				+ '.section_header_holder:not(#section_0){ height:100px;width:350px; background:rgb(230,280,250); }';

		//解像度低い場合2列表示(幅800以上1200未満を目安。800未満は1列のまま)
		var css800 = '@media screen and (min-width: 770px) and (max-width: 1149px){'
				+ '.section_header_holder:nth-child(2n+3){ margin:10px 0 0 20px; }'
				+ '.section_header_holder:nth-child(2n+4){ position:relative;left:400px; margin-top:-100px;}'
				+ '}';//ここまで

		//解像度高い場合3列表示(幅1200以上1600未満を目安)
		var css1280 = '@media screen and (min-width: 1150px) and (max-width: 1499px){'
				+ '.section_header_holder:nth-child(3n+3){ margin:10px 0 0 20px; margin-top:20px;}'
				+ '.section_header_holder:nth-child(3n+4){ position:absolute;left:400px; margin-top:-100px;}'
				+ '.section_header_holder:nth-child(3n+5){ position:absolute;;left:770px; margin-top:-100px;}'
				+ '}';//ここまで

		//解像度高い場合4列表示(解像度の幅1600以上を目安。configウィンドウは1500)
		var css1600 = '@media screen and (min-width: 1500px){'
				+ '.section_header_holder:nth-child(4n+3){ margin:10px 0 0 20px; margin-top:20px;}'
				+ '.section_header_holder:nth-child(4n+4){ position:absolute;left:400px; margin-top:-100px;}'
				+ '.section_header_holder:nth-child(4n+5){ position:absolute;;left:770px; margin-top:-100px;}'
				+ '.section_header_holder:nth-child(4n+6){ position:absolute;;left:1140px; margin-top:-100px;}'
				+ '}';//ここまで


		addStyle(cfg_Window.contentDocument,cssCommon);
		addStyle(cfg_Window.contentDocument,css800);
		addStyle(cfg_Window.contentDocument,css1280);
		addStyle(cfg_Window.contentDocument,css1600);

	}//cfgOpenここまで



	//ESC押したら設定画面閉じる
	function cfgClose(doc){
try{
		doc.onkeydown = function(evt){

			if (evt){
				var kc = evt.keyCode;
			}else{
				var kc = event.keyCode;
			}
//GM_log(kc);
			if(kc!=27) return;
			cfgSwitch.close();
		}

}catch(e){
	GM_log("ToT_escClose:"+e);
}
	}//cfgCloseここまで




	var setPos = "margin:18px -15px 0 15px;";	//設定ボタンの位置調整

	//ログイン時の設定ボタン(Twitterのアイコンがログインしてるかどうかで位置が変わる)
	var twitBtn = document.getElementsByClassName("Icon Icon--bird bird-topbar-etched")[0];
	if(twitBtn == undefined){
		setPos = "margin:18px 0 0 15px;";
		//ログアウト時の設定ボタン
		twitBtn = document.getElementsByClassName("home")[0];
		twitBtn.getElementsByTagName("a")[0].setAttribute("style","padding:0 10px 0 0 !important;");
	}else{
		twitBtn.setAttribute("style","margin-right:20px!important;");
	}

	//設定ボタン追加
	if(twitBtn != undefined && twitBtn.getAttribute("ToT") != "set"){
		twitBtn.insertAdjacentHTML('afterend','<li id=ToT_Button style="display:inline-block;"><img name="setBtn" id="setBtn" type="button" '
			 + 'src="data:image/gif;base64,R0lGODlhCwALAIABAACZ/////yH5BAEAAAEALAAAAAALAAsAAAIaBHKha6j5TmrRIdqmkTLu7HHWVmlMZ5XLWgAAOw==" '
			 + 'title="Config - Thumbnail size" style="' + setPos + '"></li>');

		twitBtn.setAttribute("ToT","set") ;
	}




	//スクロール禁止
	function noscroll(flg){
//		if(!document.getElementById("GM_config")){ return;}	//chrome対応(暫定)
//		window.scrollTo(0, scrollY);

		if(flg) window.onscroll = function () { window.scrollTo(0, scrollY); };
		else window.onscroll = defScroll;
	}



	//GreaseMonkeyとScriptishのオプション追加(add Option)
	GM_registerMenuCommand("Config - Thumbnail size", cfgSwitch.select);




/*	//もしlocalstorageにユーザー設定があったらlocalDBにセット
	if(tmpDB != null){
		localDB = {};
		localDB = tmpDB;
	//greasemonkeyはプロファイルフォルダに独自DBを作成していて、内容を見るにはMySQLなどが必須
	}else if(GM_config.get("twitter2Thumb") != undefined && GM_config.get("twitter2Thumb") != null){
*/

	var checkDB = function(data){
		if(GM_config.get(data) == undefined || GM_config.get(data) == null) return;
		localDB[data] = GM_config.get(data) ;
	};

	for(name in titleDB){
		checkDB(name + "Link");
		checkDB(name + "Thumb");
		checkDB(name + "Size");
	}
	checkDB("flgDefPic");
	checkDB("alertnotice");
	checkDB("expandFlg");
	checkDB("autoPlay");
	checkDB("loopFlag");
	checkDB("imgSize");


	//旧設定引き継ぎ対応
	var convert = function(oldData,newData){
		if(tmpDB != null && tmpDB[oldData] != undefined && tmpDB[oldData] != null){
			var tmp = tmpDB[oldData];

			GM_config.set(newData,tmp);
			delete(GM_config.values[oldData]);
			GM_config.save();

			localDB[newData] = tmp;
		}
	};
	convert("alertnoticeLink","alertnotice");
	convert("AllThumbsAndLinksSize","expandFlg");


}//userCfgここまで



//ユーザー関数=====================================================================================
function renameTwitgoo(document){

	//リンクの修正
	var twitgooLinks = document.getElementsByClassName("twitgooText");

	for (i = 0; i < twitgooLinks.length; i++){

		if(twitgooLinks[i].href.match("twitgoo.com")){
			twitgooLinks[i].href = twitgooLinks[i].href.replace("twitgoo","tinypic");
		}
	}

	//サムネの修正
	var twitgooPics = document.getElementsByClassName("twitgooPhoto");

	for (i = 0; i < twitgooPics.length; i++){
	}
}


//サーバーDB作成
function makeServerDB(name,label,def){


	//localDBに初期値をセット
	localDB[name + "Link"] = true;
	localDB[name + "Thumb"] = true;
	localDB[name + "Size"] = def;

	//タイトルDB作成
	if(label == ""){label = name;}
	titleDB[name] = label;

	//サムネサイズDBのひな形作成
	if(name != "AllThumbsAndLinks") optionDB[name] = {};

}//サーバーDB作成ここまで


//コンフィグ画面の初期値設定
function makeInitData(){

	//メインタイトルのラベル欄--------------------------------------------------
	cfgData["ImportantPoint"] = {};
	cfgData["ImportantPoint"]["section"] = ['注意点 important point',"　"];
	cfgData["ImportantPoint"]["type"] = "textarea";
	cfgData["ImportantPoint"]["default"] = 
		   '1,「名前を付けてリンク先を保存」でオリジナルサイズで保存できます。(「名前を付けて画像を保存」だとサムネ保存)\r\n'
		 + '  "Save Link As..." can save Original size. ("Save Image As..." save Thumbnail)\r\n'
		 + '2,大きいサイズにするとはみ出るので最大510pxにしています。\r\n'
		 + '  max-width 510px,because Large-Thumbnail overflows the frame. \r\n'
		 + '3,サイズ数値は大体の目安です。The size is approximate value \r\n'
		 + '4,この解説を読み終わったらタイトルバーをクリックしてSAVEすると非表示にできます。 \r\n'
		 + '  If finished reading, clicked title bar and saved, it can do undisplayed next-time.  \r\n';
//alert(JSON.stringify(optionDB["droplr"]));



	//配列に登録
	var commonSet = function(name,title,label,type,opt,def){
		cfgData[name] = {};
		if(title)   cfgData[name]["section"] = title;
		if(label)   cfgData[name]["label"] = label;
		if(type)    cfgData[name]["type"] = type;
		if(opt)     cfgData[name]["options"] = opt;
		if(def != null) cfgData[name]["default"] = def;
		else alert("ToT_default_Error:" + name);
	}

	//共通設定1
	commonSet("flgDefPic",['共通設定1 common settings 1'],'twitter側のサムネを表示 Show Thumbs by twitter',"checkbox",null,false);
	commonSet("alertnotice",null,'通知音を鳴らす(pray alert sound)',"checkbox",null,false);
	commonSet("expandFlg",null,'短縮URL展開 Expand URL(t.co)',"checkbox",null,true);

	//共通設定2
	commonSet("autoPlay",['共通設定2 common settings 2'],'自動再生 autoplay',"checkbox",null,true);
	commonSet("loopFlag",null,'ループ再生 loop play',"checkbox",null,false);
	commonSet("imgSize",null,'検索結果の画像サイズ Search Results Image size',"select",optionDB['imgSize'],localDB["imgSize"]);


	//サービス設定欄初期値作成
	var initSet = function(name){
		var tmpLabel = [titleDB[name]];

		//リンク--------------------------------------------------
		if(name != "otherPic"){
			commonSet(name + "Link",tmpLabel,'保存用リンク追加 Add Save Link',"checkbox",null,true);
			tmpLabel = null;
		}

		//サムネ--------------------------------------------------
		commonSet(name + "Thumb",tmpLabel,'サムネ追加 Add Thumb',"checkbox",null,true);
		tmpLabel = null;

		//サムネサイズ--------------------------------------------------

		if(name != "AllThumbsAndLinks"){
			commonSet(name + "Size",tmpLabel,'サイズ変更 size of thumb',"select",optionDB[name],localDB[name + "Size"]);
		}

	};

	//サービス名ごとに作成
	for(var key in titleDB){
		initSet(key);
	}

}//コンフィグ画面の初期値設定ここまで



//CSSを追加------------------------------------------------
function addStyle(document,css) {
	var head = document.getElementsByTagName('head')[0];
	if (!head) { return };

	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}


//新着通知
function chime(node){
	if(!localDB["alertnotice"]) return;
try{
	if(node.className && node.className.match(/^(new-tweets-bar js-new-tweets-bar |Grid)$/)){
		audio.play();
	}
}catch(e){
	GM_log("ToT_chime_Error:"+e);
}
}

//url展開
function expandUrl(type,obj,size){
	var url = obj.href;

	if(obj.hasAttribute("ToT_URL") && obj.getAttribute("ToT_URL").match(/^http/)){
		url = obj.getAttribute("ToT_URL");
		obj.setAttribute("ToT_URL","NowLoading:" + url);
	}

	//GM_xmlhttpRequestが非同期のため、その対応
	if(expDB[url]){ return;
	}else{ expDB[url] = "loading"; }

if(url.match(/.*(\/photo\/[0-9])$/)) url = url.replace(RegExp.$1,"");

	GM_xmlhttpRequest({
		method: type,
		url: url,
		onload: function (res) {


		//短縮URLの展開用
		if(type == "HEAD"){
try{
			var setFinalUrl = res.finalUrl;

			//Flickr短縮URL
			if(url.match(/^https?:\/\/flic.kr\/(p|s)\/.*/)){
//GM_log(setFinalUrl);
				obj.setAttribute("data-expanded-url",setFinalUrl.replace(/\?.*/,""));

			//Fickr画像URLから元のURL取得
			}else if(url.match(/^https:\/\/flickr.com\/photo.gne\?id=/)){
				//何故かURLが取得できずにyahooにログインを求められるパターンがあるので元URLが取得できない
				if(setFinalUrl.match(/^https?:\/\/login.yahoo.com\/config\/login/)){
					obj.setAttribute("ToT_URL","Error:" + url);
				}else{
					obj.setAttribute("ToT_URL",setFinalUrl.replace(/\?.*/,""));
				}

			//tumblr短縮URL
			}else if(url.match(/^https?:\/\/(www.)?tu?mblr.com?\/[a-zA-Z0-9].*$/)){
				obj.setAttribute("data-expanded-url",setFinalUrl.replace(/#.*/,""));

			}

			if(setFinalUrl.match(/^http:\/\//)) setFinalUrl = setFinalUrl.replace(/http/,"https");

			if(setFinalUrl.match(/img.ly/)){
				obj.setAttribute("ToT_URL",setFinalUrl);
			}else{
				obj.setAttribute("data-expanded-url",setFinalUrl);
			}


			//メインに戻す
			obj.removeAttribute("ToT_expanded");
			mainCheck(obj);
			return;
}catch(e){
	GM_log("ToT_xmlHEAD_Error:"+e);
}
		//画像URLの取得用
		}else if(type == "GET"){
try{


			//yfrog(imageshack)
			if(res.finalUrl.match(/imageshack/)){
				obj.setAttribute("ToT_URL",res.finalUrl);

				//メインに戻す
				obj.removeAttribute("ToT_expanded");
				mainCheck(obj);
				return;
			}


			var resTxt = res.responseText;

			//twitter1
			if(!obj.hasAttribute("ToT_URL") && url.match(/^https?:\/\/pic.twitter.com/)){
				obj.setAttribute("ToT_URL",resTxt.replace(/.*\;URL\=(http.*?)\"\>.*/i,"$1"));
				expandUrl('GET',obj);
				return;
			}

			//最初からこのURLの場合と↑でtwitter1の展開した後さらに展開して画像URL取得の場合がある
			if(url.match(/^https?:\/\/twitter.com.*\/(photo|video)\//) || resTxt.match(/<div class="multi-photos photos-(\d+)">/)){

				var strTmp;

				if(!resTxt.match(/js-original-tweet/)) return;

				resTxt = resTxt.replace(/\r\n|\r|\n/g, "");	//改行削除
				resTxt = resTxt.replace(/.*?js-original-tweet/, "").replace(/inline-reply-tweetbox swift.*/,"");



				//動画埋め込みの場合
				if(resTxt.match(/<source video-src="http.*"/)){
					name = "twitter3";
					var strTmp = resTxt.match(/<img src="(https?:\/\/pbs.twimg.com\/tweet_video_thumb.*?)"/)[1];
					var movieUrl = resTxt.match(/<source video-src="(https?:\/\/pbs.twimg.com\/tweet_video.*?)"/)[1];

					obj.setAttribute("ToT_URL",strTmp);
					mainCheck(obj);

					addMovie(name,obj,strTmp + "media?size=l",movieUrl);
					
					return;

				}

				//外部サイトの動画(を取得してtwitterの鯖に保存してる模様)
				if(resTxt.match(/data-src="(\/i\/cards.*?)"/)){
					var moveiFrame = 'https://' + location.host + RegExp.$1;
					obj.setAttribute("ToT_URL",moveiFrame);
					expandUrl('GET',obj);
					return;
				}


				var num = resTxt.match(/<div class="multi-photos photos-(\d+)">/);

				if(num){ num = num[1]}	//複数枚なら
				else num = 0;

				var array = resTxt.match(/src="(https?:\/\/pbs.twimg.com\/media.*?)"/g);
				var reg = new RegExp('src="(.*)"$');
				strTmp =array[0].replace(reg,"$1");

				//複数画像対応
				if(array.length>1){

					twitter1DB[obj.href] = [];
					for(t=0;t < num;t++){
						twitter1DB[obj.href].push(array[t].replace(reg,"$1")); 
					}
				}

				obj.setAttribute("ToT_URL",strTmp);
				mainCheck(obj);
				return;
			}

			//外部サイトの動画続き
			if(url.match(/https:\/\/twitter.com\/i\/cards\//)){
				name = "twitter3";
				var strTmp = 'https' + resTxt.match(/&quot;posterImageUrl&quot;:&quot;https?(.*?pbs.twimg.com.*?ext_tw_video_thumb.*?)&quot;/)[1].replace(/\\\//g,"/");
				var movieUrl = 'https' + resTxt.match(/&quot;source&quot;:&quot;https?(.*?)&quot;/)[1];
				obj.setAttribute("ToT_URL",strTmp);
				mainCheck(obj);

				addMovie(name,obj,strTmp + "media?size=l",movieUrl);
				
				return;

			}


			//Flickr(メイン関数→サムネ入手後→オリジナル入手→メイン関数へ)
			if(obj.hasAttribute("ToT_URL") && url.match(/^https?:\/\/(www.)?flickr.com\/photos\//)){

				//サムネ側のURL
				if(size || size == ""){

					var tmpReg = new RegExp('<img src="(https?:\/\/.*?static.?flickr.*?' + size + '..*)">');
					var tmpUrl = resTxt.match(tmpReg);
					if(!tmpUrl) return;

					flickrSrcDB[obj.href] = tmpUrl[1];
					

					//オリジナルサイズを取得へ
					obj.setAttribute("ToT_URL",url.replace(/\/sizes\/.*/,"\/sizes/o/"));
					expandUrl('GET',obj);
					return;

				//オリジナルサイズ側のURL
				}else if(url.match(/\/sizes\/o\//)){
					var tsize = "o";
					//オリジナルサイズがoじゃなかったら変更
					if(!res.finalUrl.match(/sizes\/o\/?$/)){
						tsize = res.finalUrl.replace(/.*sizes\/(.*?)\/$/i,"$1");
						tsize = flickrSize(tsize);
					}

					var reg = new RegExp('<img src="(https?:\/\/.*?static.?flickr.*?' + tsize + '..*?)">');

					obj.setAttribute("ToT_URL",resTxt.match(reg)[1]);
					mainCheck(obj);
					return;
				}
			}

			//imageshack
			if(url.match(/^https?:\/\/.*imageshack./)){
				obj.setAttribute("ToT_URL",resTxt.match(/<meta property="og:image" content="(https?:\/\/.*imageshack.*?)"\/>/)[1]);
				
				mainCheck(obj);
				return;
			}


			//imgur画像URL
			if(url.match(/^https?:\/\/.*imgur.com/)){
				obj.setAttribute("ToT_URL",resTxt.match(/<link rel="image_src" href="(https?:\/\/i.imgur.com\/.*?)"\/>/)[1]);
				
				mainCheck(obj);
				return;
			}

			//instagram動画チェック
			if(url.match(/^https?:\/\/(i.)?(i|I)nstagr(am.com|.am)\/p\/.*?\//) && !url.match(/^https?:\/\/instagr(am.com|.am)\/p\/.*?\/.*\//)){
				name = "instagram";
				//動画URLだったら埋め込む
				if(resTxt.match(/<meta property="og:video" content="http/)){
					var movieUrl = resTxt.match(/<meta property="og:video" content="(http.*?)"/)[1];

					addMovie(name,obj,url,movieUrl);
					return;
				}
			}

			//携帯百景movapic
			if(url.match(/^https?:\/\/movapic.com\/.*?\/pic\/.*$/)){
				obj.setAttribute("ToT_URL",resTxt.match(/<img class="image" src="(https?:\/\/image.movapic.com\/pic\/.*?..*?)"\/>/)[1]);
				mainCheck(obj);
				return;
			}

			//pixiv
			if(url.match(/^https?:\/\/www.pixiv.net\/member.*illust_id=.*$/)){
try{

				if(resTxt.match(/この作品は削除されています/)){
					var tmpTxt = "http://i1.pixiv.net/img11/img/error.jpg?dummy=ddddd";
					pixivSrcDB[obj.href] = tmpTxt;
					obj.setAttribute("ToT_URL",tmpTxt);
					mainCheck(obj);
					return;
				}

				var name = "pixiv";
				var picID = url.replace(/.*(\?|&)illust_id=/,"").replace(/&.*/,"");
				var srcUrl = "";
				var defaultUrl,commonURL1,commonURL2,mangacheck,ugoira;

				//うごイラかどうかのチェック
				var regUgo = new RegExp('type=ugoira');
				ugoira = resTxt.match(regUgo);

				//2度目の展開の場合前回の引き継ぎデータ取得
				if(obj.hasAttribute("ToT_pixiv")){
					var tmp = obj.getAttribute("ToT_pixiv").split(",");
					commonURL2 = tmp[0];
					mangacheck = tmp[1];
				}


				//拡張子取得
				var getFType = function(){
					var regFType = new RegExp(picID +'_(s|m|p0_master1200)(\\..*?)"');
					var tmpTxt = resTxt.match(regFType);
					if(tmpTxt) return tmpTxt[2];
					else return false;
				};

				var fType = getFType();								//拡張子
				if(!fType){ GM_log("ToT_pixivFType_Error"); fType = ".jpg";}			//取得エラー(仮にjpgとして処理続行)


				//defaultUrlの取得-------------------------------------------

				//下の補足。/(?:(?!moji).)*?retsu/ の意味は、mojiを含まないで次のretsuにヒットするという意味
				var regDef = new RegExp('<img src=\"(http:\/\/i\\d+\.pixiv.net\/img\\d+\/(img|profile)(?:(?!\").)*?' + picID + '.*?)\"');
				defaultUrl = resTxt.match(/<img src=\"(http:\/\/i.*?profile.*?)\"/);	//アバター画像
				if(!defaultUrl) defaultUrl = resTxt.match(regDef);			//基本となる画像(アバター取得失敗した場合)

				//2度目の展開(作者ページ)
				if(url.match(/member\.php/) && !defaultUrl){
					regDef = new RegExp('<img src=\"(http:\/\/i\\d+\.pixiv.net\/img\\d+\/(img|profile).*?\/.*?\/)(?:(?!\").)*?\"');
					defaultUrl = resTxt.match(regDef);
					if(defaultUrl){
						defaultUrl[1] = defaultUrl[1].replace(/\/profile\//,"/img/") + picID + fType;
					}
				}

				if(defaultUrl) defaultUrl = defaultUrl[1];

				//漫画かどうかのチェック用
				if(!mangacheck){
					var regOrg = new RegExp('pixiv.tracking.URL.*?illust_id=' + picID + '.*?type=manga');
					mangacheck = resTxt.match(regOrg);
				}

				//共通URLその2
				if(!commonURL2){
					var regCommon2 = new RegExp('content="(http(?:(?!\").)*?' + picID +'_s\\..*?)"');
					commonURL2 = resTxt.match(regCommon2);						//共通URLその2(そのほかのサイズ用)
					if(commonURL2){ commonURL2 = commonURL2[1];

					//_p0_master1200というURLパターンの場合
					}else{
						regCommon2 = new RegExp('<img src="(http(?:(?!\").)*?' + picID +'_p0_(master|square)1200\\..*?)"');
						commonURL2 = resTxt.match(regCommon2);
						if(commonURL2){
							commonURL2 = commonURL2[1].replace(/_square1200/,"_master1200");
							obj.setAttribute("ToT_URL",commonURL2);
							mainCheck(obj);
							return;

						}else{ GM_log("ToT_pixivCommon2取得エラー:" + resTxt); return; }
					}
				}


				//取得失敗時作者ページから必要情報取得する
				if(!defaultUrl && !ugoira){

					//作者ページにすでにいってたら終了
					if(url.match(/member\.php/)){ GM_log("ToT_pixiv基本画像取得失敗"); return;}

					//作者のページに行って他の画像URLを探す
					var memberId = resTxt.match(/<a href="(member.php\?id=\d+)">/)[1];
					if(!memberId){ GM_log("ToT_pixivmember_Error"); return;}

					//作者ページセット(少し加工)
					var tmpUrl = "http://www.pixiv.net/" + memberId + "&illust_id=" + picID;
					obj.setAttribute("ToT_URL",tmpUrl);

					//引き継ぎデータ
					var pixivTxt = commonURL2;
					if(mangacheck) pixivTxt += ",manga";
					obj.setAttribute("ToT_pixiv",pixivTxt);

					expandUrl('GET',obj,localDB[name +"Size"]);

					return;
				}

				//defaultUrlの取得ここまで----------------------------------


				var mainSrvId = defaultUrl.match(/http:\/\/i(\d+)\./)[1];			//ドメインサーバ
				var imgSrvId = defaultUrl.match(/pixiv.net\/img(\d+)\//)[1];			//画像サーバ(画像フォルダ)

				commonURL1 = defaultUrl.replace(/\/profile\//,"/img/").replace(/(\/img\/.*?\/).*/,"$1") + picID;
														//共通URLその1(オリジナル,mサイズ用)


				var orgUrl = commonURL1 + fType;						//オリジナル画像URL


				//サムネ用でURLが違う。拡張子もjpgに変換されてる
				if(size == "s") srcUrl = commonURL2;							//sサイズ
				else{
					//拡張子→jpg
					picExt.forEach(function(x){
						var regTmp = new RegExp('.' + x +'$');
						if(commonURL2.match(regTmp)){ commonURL2 =  commonURL2.replace(regTmp,".jpg");}
					});

					if(size == "128x128") srcUrl = commonURL2.replace("_s.","_128x128.");		//128x128
					else if(size == "64x64") srcUrl = commonURL2.replace("_s.","_64x64.");		//64x64
				}

				//オリジナル用URL
				if(size == "") srcUrl = orgUrl;							//オリジナル
				if(size == "m" || mangacheck && size == "") srcUrl = commonURL1 + "_m" + fType;	//mサイズ、または漫画だと最大サイズがないのでmに変更

				//漫画だとオリジナルURLはページ数つけないとダメなのでmサイズに変更
				if(mangacheck) orgUrl = commonURL1 + "_m" + fType;

//http://i1.pixiv.net/img-inf/img/2014/09/22/23/00/29/46130708_s.jpg
//http://i2.pixiv.net/c/600x600/img-master/img/2014/09/27/16/33/28/46211445_p0_master1200.jpg
				//うごイラだった場合
				if(ugoira && commonURL2){
					srcUrl = commonURL2.replace(/img-inf\/img/,"c/600x600/img-master/img").replace(/_s/,"_master1200");
					orgUrl = srcUrl;
				}


				if(srcUrl) pixivSrcDB[obj.href] = srcUrl;	//DBにsrcを登録
				else{ GM_log("ToT_pixiv_srcUrl取得エラー");return; }

				obj.setAttribute("ToT_URL",orgUrl);
				mainCheck(obj);
				return;
}catch(e){
	GM_log("ToT_pixiv_Error:"+e)
}
			}

			//tumblr
			if(url.match(/^http:\/\/[\w\-]+.tumblr.com\/post\/[0-9]+.*$/)){
				var tmpUrl = "";

				var array = resTxt.match(/<meta property="og:image" content="(http:\/\/(\d+.)?media.tumblr.com\/.*?)"/g);
				var reg = new RegExp('<meta property="og:image" content="(.*?)"$');


				//取得失敗したら片っ端からmedia.tumblrの画像URL取得(画像サイズはそのまま)
				if(!array){
					array = resTxt.match(/"(http:\/\/(\d+.)?media.tumblr.com\/.*?)"/g);
					reg = new RegExp('"(.*?)"$');
				}


				if(!array){ GM_log("ToT_tumblr:画像取得エラー");  return;}


				for(var tu = 0;tu < array.length; tu++){
//				for(var tu = array.length-1;tu >= 0; tu--){

					if(!array[tu].match(/avatar/i)){
						tmpUrl = array[tu].replace(reg,"$1");
						tumblrDB[obj.href].push(tmpUrl); 
					}
				}


				if(tmpUrl == "") return;

				obj.setAttribute("ToT_URL",tmpUrl);
				mainCheck(obj);
				return;
			}

			//vimeo
			if(url.match(/https?:\/\/vimeo.com/)){
				var name = "vimeo";
				var objVimeo =  JSON.parse(resTxt)[0];
				var thumbUrl = objVimeo[localDB[name +"Size"]];

				obj.setAttribute("ToT_URL",thumbUrl);
				mainCheck(obj);

				var tmpUrl = url.replace(/.*api\/v2\/video\//,"https://player.vimeo.com/video/").replace(/.json$/,"");
				addMovie(name,obj,url,tmpUrl);

				return;
			}

			//vine
			if(url.match(/^https?:\/\/vine.co\/v\/./)){

				var name = "vine";
try{
				var tmpUrl = resTxt.match(/<meta property="twitter:image.src" content="(http.*?)\?versionId=/)[1];
				var movieUrl = resTxt.match(/<meta property="twitter:player:stream" content="(http.*?)\?versionId=/)[1];

}catch(e){
	//動画削除済み
	obj.insertAdjacentHTML('afterend', strIcon + '<a target="_blank" style=font-size:12px; href=' + url + '>dead link</a>');
	return;
}

				obj.setAttribute("ToT_URL",tmpUrl);
				mainCheck(obj);

				addMovie(name,obj,tmpUrl,movieUrl);
			}
}catch(e){
	GM_log("ToT_xmlGET_Error:"+e);
}
		}//GETここまで
		}//onloadここまで
	});

}



//ムービー追加
function addMovie(name,obj,img,url){
try{

	if(!name || !obj || !img || !url){ GM_log("ToT_addmovie：引数エラー"); return; }

	var regCheck = new RegExp('id="ToT_addMovie:' + url.replace(/\?/,"\\?") + '"');

	//サムネ追加設定
	if(localDB["AllThumbsAndLinksThumb"] == false || localDB[name +"Thumb"] == false
	 || obj.hasAttribute('akill_check') && obj.getAttribute('akill_check').match(/killed/)
	|| obj.hasAttribute('ToT_addedMovieLink')
	//一度追加済み
	|| obj.parentNode.innerHTML.match(regCheck)
	){
		return;
	}

	var movie;
	var srcTxt = "";
	var movieHeight = 350;

	var tmpUrl = url.replace(/\?.*/,"");
	var objID = 'ToT_playerObj:' + tmpUrl;
	var playerID = 'ToT_video:' + tmpUrl;
	var addButton = 'ToT_addMovie:' + tmpUrl;
	var movieControl = 'ToT_movieControl:' + tmpUrl;
	var loopControl = "";

	var movieParams = "";
	if(!url.match(/\?/)) movieParams = "?";
	if(localDB["autoPlay"]) movieParams += "&autoplay=1";
	if(localDB["loopFlag"]) movieParams += "&loop=1";


	//youtube
	if(name.match(/youtube/)){

		var youtubeID = url.replace(/.*(v=|embed\/)/,"").replace(/\?.*/,"");

		var text = '<object style="display:none;" id="' + objID + '">'
		+'<embed src="' + url + movieParams + '" type="application/x-shockwave-flash" width="450" height="300" allowfullscreen="true"></embed></object>';
		obj.insertAdjacentHTML("afterend", text);


	//iframeの読込先指定(srcはURLから、srcdocは直接ソースから)
	//vimeo
	}else if(name.match(/(vimeo)/)){
		srcTxt = 'src=' + url + movieParams + ' frameborder=0 allowfullscreen ';

	//その他
	}else{
		var tmpLoop,tmpAuto = "";
		var tmpChanger = "loop";
		if(localDB["loopFlag"]){
			tmpLoop = "loop";
			tmpChanger = "once";
		}
		if(localDB["autoPlay"]) tmpAuto = "autoplay";

		srcTxt = 'srcdoc=\\\''
			+'<video id=' + playerID + ' class=ToT_video controls ' + tmpLoop + " " + tmpAuto + ' poster=' + img + ' width=400 height=300>'
			+'<source src=' + url + '>not support video tag</video>'
			+'\\\' '
		;//ここまで

		//ループ再生切り替え
		loopControl = '<a id="' + movieControl + '" onclick="'
		+'var obj = ToT_frame.document.getElementById(\'' + playerID + '\');'
		+	'if(!obj){ alert(obj);return; }'
		+	'if(obj.hasAttribute(\'loop\')){ obj.removeAttribute(\'loop\'); this.innerHTML=\'' + strIcon + 'loop\''
		+	'}else{ obj.setAttribute(\'loop\',\'\'); this.innerHTML=\'' + strIcon + 'once\'}'
		+'" style="display:none;">' + strIcon + tmpChanger +'</a><br>'
	}


	//追加テキスト
	movie = '<a id="' + addButton + '" onclick="'
		+'function addFrame(o){'
		+	'var p = document.getElementById(\'' + objID + '\');'
		//youtube
		+	'if(p){p.removeAttribute(\'style\');'
		//その他
		+	'}else{'
		+		'var txt=\'<iframe sandbox=\\\'allow-scripts allow-same-origin\\\'  name=ToT_frame seamless width=450 height=' + movieHeight + ' '
		+		srcTxt
		+		'></iframe>\';'
		+		'o.insertAdjacentHTML(\'afterend\',txt);'
		+	'}'

		+	'var b = document.getElementById(\'' + movieControl + '\'); if(b){ b.removeAttribute(\'style\');}'
		+	'o.parentNode.removeChild(o);'
		+	'o.innerHTML = \'\';'	//youtube追加でリンクが残るので追加
		+'}'
		+'addFrame(this);return false;"  >' + strIcon + 'add movie</a>';


	obj.setAttribute('ToT_addedMovieLink', "added");
	obj.insertAdjacentHTML('afterend', movie);
	if(loopControl != "") obj.insertAdjacentHTML('afterend', loopControl);
	delDef(obj);



}catch(e){
GM_log("ToT_addMovie:"+ e);
}
}



//twitter側の追加サムネ削除
function delDef(obj){
	if(localDB["flgDefPic"]) return;	//twitterが追加するサムネを表示する場合は削除しない

	//2個上の要素(コメント1個分)
	var content = obj.parentNode.parentNode;

	var expand = content.getElementsByClassName("expanded-content js-tweet-details-dropdown");	//下の入れ子(ない場合もある)
	var photo = content.getElementsByClassName("card2 js-media-container");				//twitter側画像展開
	var card = content.getElementsByClassName("cards-base cards-multimedia");			//twitter側画像展開その2
	var user = content.getElementsByClassName("TwitterPhoto js-media-container");			//twitter側画像(@タイムライン)
	var multi = content.getElementsByClassName("TwitterMultiPhoto js-media-container");		//twitter側複数画像(@タイムライン)
//	var thumb = content.getElementsByClassName("Amedia media-thumbnail twitter-timeline-link media-forward is-preview");	//twitter側サムネ画像)
	//要素削除
	var delPic = function(objTmp){
		var obj = objTmp[0];
		if(obj) obj.parentNode.removeChild(obj);
	};
	delPic(expand);
	delPic(photo);
	delPic(card);
	delPic(user);
	delPic(multi);
//	delPic(thumb);

	var view = content.getElementsByClassName("details with-icn js-details");			//画像を表示するリンク
	if(view[0]){ view[0].className="ToTChanged_details with-icn js-details"; }
}


function extCheck(url){
	var tmp = "";
	//画像の拡張子だったらその拡張子のまま
	picExt.forEach(function(x){
		if(url.match(x)){tmp = x;}
	});

	if(tmp != ""){ return tmp;}
	return false;
}


//flickrのサイズ修正
function flickrSize(size){
	if(size == "sq"){ size = "_s";
	}else if(size == "s"){ size = "_m";
	}else if(size == "m"){ size = "";
	}else if(size == "l"){ size = "_b";
	}else{ size = "_" + size;
	}
	return size;
}

function fixer(){
	var fixCSS = [
		'.media.media-thumbnail.twitter-timeline-link.media-forward.is-preview{ max-height: none; }',
		'OL > LI > DIV > DIV > DIV > DIV > A > DIV > IMG{ margin:0!important; max-width:' + localDB['imgSize'] + '!important;}',
	].join('');
	
	addStyle(document,fixCSS);
}


//ユーザー関数ここまで============================================================================


})();