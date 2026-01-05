// ==UserScript==
// @id             Affiliate_killer
// @name           Affiliate killer
// @version        4.55
// @namespace      https://greasyfork.org/scripts/456
// @homepageURL    https://greasyfork.org/scripts/456
// @license        https://creativecommons.org/licenses/by-nc/2.1/jp/
// @author         noi
// @description    No more Affiliate Link! Plz Original URL!
// @run-at         document-end
// @include        http*
// @exclude        *images-amazon.com/*
// @exclude        *google.*tbm=isch*
// @exclude        *google.*blank.html
// @grant          GM_log
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/456/Affiliate%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/456/Affiliate%20killer.meta.js
// ==/UserScript==


///////////////////////////////////////////////////////
// The original script is below:                     //
// アフィリエイト殺し for greasemonkey               //
// http://d.hatena.ne.jp/deraw/20060902/1157143806   //
// and A Killer Mod                                  //
// http://www7b.biglobe.ne.jp/~yamj/                 //
// and ecl.js drk                                    //
// http://www.drk7.jp/                               //
// http://www.drk7.jp/pub/js/ecl_test/ecl_new.js     //
// http://nurucom-archives.hp.infoseek.co.jp/digital //
///////////////////////////////////////////////////////


//No more affiliate cookie!
/////////////////////////////////////////////////////
//Access for expand URL                            //
//http://www.getlinkinfo.com/                      //
//and Next do it when can't get URL                //
//http://araishi.com/redirect-check/               //
//and Next                                         //
//http://x-1.jp/                                   //
/////////////////////////////////////////////////////


/* Not support Scriptish */


/************************************************************************
前書き

自分用のスクリプトですが、知人から欲しいという要望があったので公開。
勉強がてら追加してったので正直美しくないです。
このスクリプトの利用は各自の自己責任でお願いします。
当スクリプトを利用したことにより被ったあらゆる損害に対して免責とさせていただきます。

I made this script for myself.
and uploaded it, since my acquaintance wanted it.
Add to Original Script too much ,the source code is dirty.

Please use this script on each one of responsibility. 

IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER PARTY.


アフィの修正取りこぼしの報告も受け付けています。
→体調が良ければ直します。
まだ実験段階のためブラウザごとフリーズする場合もあるかもしれないので報告ください。
→体調がｒｙ

このソースは基本的に改変、再配布自由です。
「ecl.js」の引用部分は作者のdrkさんに問い合わせてください。
また、配布する場合は引用元として当方の名前を入れてくれるだけでOKです。
とはいえ悪質だったり詐欺などの用途での改変は当然NGです。

注意点はファイル保存の際、文字エンコードはUTF-8で保存してください。(文字化け回避)

*************************************************************************
[機能option]
1.keyboard shortcut keys
CTRL + SHIFT : toggle "original-link" visible.
CTRL + ALT : toggle "redirect-histroy" visible.
CTRL + ALT + SHIFT :toggle "original-link" and "redirect-histroy" visible.


[URL list]
"added":script added URL.no many redirect.(修正したURL。リダイレクトが多くない)
"beforeadded":script added URL.Many redirect.(修正したURL。沢山転送された最後のURL)
"killed":affiliate URL or tiny URL.(修正する前のアフィリエイトリンクや短縮URL)
"before":Expanded URL,before redirect finalURL("beforeadded").("beforeadded"の直前のURL)

If redirect finalURL("beforeadded") is login page,sometimes can't access address for buy the item.
Plz Use "before".
(もしリダイレクト最後のURL"beforeadded"がログイン画面の場合、商品ページに遷移できないので
リダイレクトの最後から1個手前のURLである"before"を表示してアクセスしてください)
*************************************************************************

[対応状況]

[cookie]
amazon
apple
Dlsite
DMM
rakuten
など


[リダイレクト系]
amazon
anonym.to
bestgate
bloglovin(mouseoverでリンク修正)
click.dtiserv2.com
価格.com
facebook
flog
など


[アフィリエイト専門系]
a5.tuhan
a8.net
accesstrade
a-c-engine
adf.ly(一部)
adlantis
af-mark
ameba
fc2
googleAd
istockphoto
Janet
jsky
Kauli
linkshare
linksynergy(linkshare?)
liveads.jp
mediaplex.com
moshimo.com
pixel.everesttech.net
shinobi.jp
track.affiliate-b.com
trafficgate.net
tr.webantenna.info(trafficgate?)
valuecommerce
makeshop
など

[RSS]
rss.rssad.jp
rdsig
など

[ショップ系]
7netshopping
amazon
aliexpress
AppleStore(aos.prf.hn)
itunes
ark-pc
askul
askulcorporation
bookwalker
carview(trafficgate)
dena
docomo
dominos
ebay
gearbest
lenovo
pixiv
rakuten
yahoo
tracking.yourguide
など

[同人系]
アキバイン
d-drop
dd-Style
デジケット
DLげっちゅ
Dlsite
DMM
ぎゅっと(gyutto.com、gyut.to)
メロンブックス
サーパラ(surpara.com
など

[スマホ]
app-adforce
i-mobile.co.jp
など

[海外]
affiliate future
Affiliate jlist
Affiliate Window
buy.com
cdJapan
clixgalore
Commission Junction
DGM PRO
esellerate
MoreNiche
Online Media Group
paid on results
secure.strawberrynet
shareasale
Tradedoubler
webgains
Zanox
など

[トラッカー系]
google ユニバーサルアナリティクス(utm_source、utm_campaign、utm_medium、utm_content)
google search
google+(暫定)
など

[クッション]
2ch(ime.nu、ime.st、jump.2ch.net、pinktower.com、2ch.io、l.moapi.net、t.2nn.jp、machi.to、fast.io)
nun.nu
l.moapi.net
READ2CH
Rちゃんねる
yeng.web.fc2.com
など

[アフィリエイト系トラッカー]
adclr
Linksynergy
mgstage.com
netmng
trafficgate
textad
xaid
など

[短縮URL]
aliexpress
bit.ly
bitly.com
j.mp
goo.gl
is.gd
v.gd
urx.nu
urx2.nu
inf.to
tiny.cc
tinyurl.com
tinyly.net
num.to
mcaf.ee
mzl.la
wk.tk
p.tl
y.ahoo.it
ow.ly
u.to
Tinyarro.ws
snipurl.com
go.ascii.jp
ux.nu
x5.to
c23.biz
9oo.jp
miffy.me
hec.su
t.co
fb.me
amzn.to
youtu.be
y2u.be
r10.to (a.r10.to)
s.nikkei.com
t.asahi.com
nico.ms
sdrv.ms
1drv.ms
gigaz.in
g.co
tr.im
cli.gs
short.ie
kl.am
idek.net
budurl.com
hex.io
eweri.com
twurl.cc
tweetburner.com
urlgator.com
tweak.tk
moourl.com
a.gd
tighturl.com
3.ly
x.vu
ul.lc
nazr.in
3step.me
xtw.me
my-tiny.com
mijikaku.jp
snurl.com
ift.tt
dlvr.it
buff.ly
msm.to
su.ms-x.biz
fc2.to
ustre.am
k4wu.com
htn.to
adop.jp
hrp.asia
1stepup.com
amba.to
wp.me
www.shortenurl.tk
eng.mg
w.mul.asia
zpr.io
ask.fm
jump.cx
www.fiverr.com
5.tvasahi.jp
fav.me
gdzl.la
db.tt
spr.ly
appsto.re
u111u.info
shrsl.com
など

他

*************************************************************************
前提条件

○必須
・クッキー(cookie)の削除、および定期的な削除

・ポイントサイトなど当スクリプトを動作させたくないサイトを設定する
例）アドオンのGreaseMonkeyでTポイントサイトの除外を設定する場合
 スクリプト管理画面からAffiliate_Killerの設定をクリックし
 excludeに除外したいサイトのURLを指定する(正規表現は使えない)
http://tmall.tsite.jp/*
https://tmall.tsite.jp/*
http://tsite.jp/*
https://tsite.jp/*
など(最後のアスタリスク(*)を忘れずに)


○以下は必須ではないけどやった方がいい


1、基本的にadblock系アドオンやDISCONNECTなどと併用推奨(定番)
大体のアフィリエイトはこれで抹殺されます。
日本語のフィルターを適当に購読しましょう。
誤爆(関係ないものまで非表示)もあるので注意

2、PeerBlockなどの通信フィルタリングソフト(初心者向き)
ipを遮断するため表示されなくなりスッキリ(ただしたまに関係ないのも遮断するので注意)
忍者adMaxのような広告が表示されるだけで報酬が発生する仕組みがあるので導入推奨

導入方法など：脱Google＠wikiのPeerBlock解説ページ
http://www4.atwiki.jp/nogoogle/pages/19.html

3、cookie管理アドオンの導入(中級者～上級者向け)
デフォルトをdenied(拒否)にしておいて、ログインが必要なサイトなどで
1stパーティ(そのサイトが発行するcookie)のみ許可するのが良いですが、サイトによっては
完全に許可(他のサイトで発行されたcookieも読み込み許可)しなくてはいけなかったりするので注意。

4、可能ならRedirectを制御できるアドオンなどと併用推奨(やや上級者向け)
リダイレクトをブロックして転送先URLを表示してくれるのでアフィリエイトリンクを修正します。
何故このアドオンかというと他のリダイレクトブロック系アドオンではスルーしてしまうような
metaタグやhttpリクエストなどのリダイレクトもブロック可能だからです。
要設定。(↓の方で簡易解説あります)

※文字化け問題が発生するページあり(403エラーなど)
これは海外のアドオンのため日本語のエンコード・デコードに失敗しているせい。
問題となっているURLへのリダイレクトを許可すると正しいURLへ飛びますが、
アフィリエイトリンクへの許可にならないよう考えて許可しましょう

5、可能ならReferrer Control系アドオンと併用推奨(やや上級者向け)
ツイッターやブログURLなどを登録し、リファラなどを元に報酬を払うアフィリエイトがある模様
※こちらも文字化け問題が発生する可能性あり

※各アドオンはしっかり設定しないと画像が表示されない、ファイルがダウンロードできない、
トップページに飛ばされてしまうなどの問題が発生します。




○こだわりたい方用
下記サイトで色々とどうぞ

脱Google＠wiki
http://www4.atwiki.jp/nogoogle/


*************************************************************************

以下のURLをリファラを変更してしまうと正常動作しないサイトの例

・googleアカウント(確かyoutubeかアンドロイドマーケット)
accounts.google.com

・ニコニコ動画系
com.nicovideo.jp
nicoblomaga.jp

・pixiv
www.pixiv.net

・vectorのフリーソフトダウンロードなど
ftp.vector.co.jp
my.vector.co.jp

・ソフマップ
point.sofmap.com

・ソフトバンク系(多分プロバイダや電話料金系)
web-meisai.softbanktelecom.co.jp
webmeisai.jp

・ウェブ魚拓
megalodon.jp

・ちず丸
map.chizumaru.com

・solvemediaキャプチャの画像
api.solvemedia.com

※上記以外でも表示されない・ダウンロードされない・変なエラーが出るなど
問題が発生するサイトはちらほらとあります。

*************************************************************************/

/**更新履歴**************************************************************

02/12/2019 - v4.55 fix:微修正
11/25/2018 - v4.54 fix:dmmのhttps
11/24/2018 - v4.53 fix:記述ミス修正
10/24/2018 - v4.52 fix:実行タイミングを明記。少しだけ処理軽減など
09/27/2018 - v4.51 fix:Tampermonkeyにてheadが取得できなかったので修正
08/11/2018 - v4.50 fix:amazonのバグの修正
07/07/2018 - v4.49 fix:いつの間にか機能しなくなったショートカット機能修正
09/08/2017 - v4.48 fix:いくつかのバグ修正
01/31/2017 - v4.47 fix:base64
01/27/2017 - v4.46 add:base64仮対応
01/19/2017 - v4.45 add:転送履歴を可能な限り表示する機能を暫定復活、リダイレクトサイトwww.sexyvideos.co追加
01/18/2017 - v4.44 add:outgoing.prod.mozaws.net
01/17/2017 - v4.43 fix:v4.42
01/14/2017 - v4.42 fix:remove ref
01/12/2017 - v4.41 fix:v4.40
01/10/2017 - v4.40 add:affiliate url
10/26/2016 - v4.39 fix:URL展開の変更
10/10/2016 - v4.38 fix:クッション除去修正・追加
10/08/2016 - v4.37 add:掲示板で指摘があったものの中で可能なだけ追加
08/07/2016 - v4.36 fix:フラグ管理ミスの修正および一部エラー回避
07/23/2016 - v4.35 add:aliexpress
07/20/2016 - v4.34 add:mgstage.com
07/14/2016 - v4.33 fix:dmm除去ミス修正
07/13/2016 - v4.32 add:リダイレクトclick.dtiserv2.com
07/12/2016 - v4.31 fix:dmm(www.dmm.co.jp/digital/videoa/)他
07/12/2016 - v4.30 add:dmm(dlsoft.dmm.co.jpなど)
01/28/2016 - v4.29 add:アフリエイトサイト追加、URLエンコード変更
01/28/2016 - v4.28 add:アフリエイトサイト追加
01/28/2016 - v4.28 fix:フラグ管理修正
01/24/2016 - v4.27 fix:フラグ管理修正、試験的に入れていたトラッカー除去機能の対象をgoogle検索のみに変更
01/21/2016 - v4.26 fix:getlinkinfoの展開修正、他多数
11/05/2015 - v4.25 del:coneco閉鎖につき削除
11/05/2015 - v4.25 add:amazonの別パターン追加
06/16/2015 - v4.24 fix:googleのcookie
06/16/2015 - v4.23 fix:areaタグのバグ修正、amazonのcookie他
04/30/2015 - v4.22 fix:展開履歴の削除インターバルを正確に変更
04/14/2015 - v4.21 fix:起動の修正
04/12/2015 - v4.20 fix:短縮URL展開の修正
04/08/2015 - v4.19 fix:短縮URL展開の一部修正
04/06/2015 - v4.18 fix:observer部分の修正
04/06/2015 - v4.18 del:aguse削除、展開URLのセキュアチェック部分削除
03/27/2015 - v4.17 fix:2chクッションの修正ミス
03/27/2015 - v4.16 fix:v4.15で一部取りこぼしが発生していたので修正
03/18/2015 - v4.15 fix:高速化
02/18/2015 - v4.14 add:2ch.io
02/18/2015 - v4.14 fix:一部のamazonのURLに対応しきれていなかったバグの修正
01/26/2015 - v4.13 add:展開URLを記憶するように変更(記憶データ肥大化防止のため3日ごとに全クリア)
12/31/2014 - v4.13 add:adult.bloglovin
11/10/2014 - v4.12 fix:amazonの削除しすぎていたcookieの除外
11/02/2014 - v4.11 add:google+ 暫定(パラメータ全消去)、短縮gdzl.laとfav.me追加
11/02/2014 - v4.11 fix:短縮URLのバグ
09/28/2014 - v4.10 fix:サイト側のキーボードショートカット機能を消さないように変更
09/28/2014 - v4.10 add:短縮URL(jump.cx ow.ly)
09/28/2014 - v4.09 fix:https://addons.mozilla.org/ でレビューが表示できない不具合修正
09/21/2014 - v4.08 fix:変更監視部分の不具合修正
09/20/2014 - v4.07 not support Scriptish
09/03/2014 - v4.00 fix:処理の無駄を減らして高速化
08/30/2014 - v3.28 add:セキュリティ機能の確認ダイアログ追加(http://app.webinspector.com) ←初期値は、危険なURL警告:ON、未スキャンURL:OFF
08/30/2014 - v3.28 fix:実験的に追加してたセキュリティチェック(www.aguse.jp)にON・OFF機能を付け忘れてたので修正(初期値off)
08/30/2014 - v3.27 fix:継ぎ足し要素の多すぎるサイトでフリーズする現象の修正
06/12/2014 - v3.0  add:すべての要素をチェックするように変更。他色々
06/07/2014 - v2.11 add:googleトラッカー除去
03/23/2014 - v2.0  add:AmazonのスマートフォンURLに対応
03/22/2014 - v1.9  fix:GoogleImage検索は除外。onclick除去を修正したリンクのみ適応するように変更。
03/14/2014 - v1.0  release

*************************************************************************/

/****************************************************
備忘録

// @exclude        *google.*tbm=isch*
// @exclude        *google.*blank.html
・GoogleImage検索でうまく動かないので@excludeに追加。*tbm=isch*はGoogleImage検索用。blankはiframe内
  クリックで起動するスクリプト(jsaction)で、iframe内に要素を入れ込んでいる様子
  F5リロードするとiframe内をコピーした要素の方(iframeじゃなくなる)に切り替わるなど色々挙動が複雑すぎて把握できない
→リンク修正しちゃうとgoogleのスクリプトによる動的切り替えができなくなってリンク先が違うものになって面倒なのでexclude

・デコードエラーはどうやらEUC-JPやShift-JISの文字列が来ると発生する模様？
→ecl.js(Escape Codec Library)をお借りすることに
→requireから埋め込みに変更(GreasyForkでrequire使うと色々と面倒なため)

・amazonで商品のプレビュー画像でz-indexが999なので同じく999指定してある[killer]が表示される
→スクリプトのz-indexは1に変更

・amazonのセッションについて
  amazonはsessionでログインとカートを管理してるようで、
  セッションIDを指定するcookieのsession-id(gest?)かubid-acbjp(login?)どちらか1つでも削除するとログアウト
  sessionで片っ端から他サイトで見たamazon商品の閲覧履歴をため込む
  ログインと同時に色々なセッションをマージしてると思われる
  ubid-acbjpはログインセッション(各ユーザー固定)
→問題なのはアフィリンクやastoreやAWS経由で直接カートに突っ込むと
  現在のsessionにアフィsessionをマージしているように見える。アフィ情報の入ったセッションになってる可能性あり
  さらにログイン中だとこのセッションがamazonのサーバ側で一定期間保存されてしまう？
  sessionIDは999-9999999-9999999の数字3桁7桁7桁
  ネットの情報ではこのアフィリエイトの効果は24時間有効というけどcookieをみると1週間有効

・海外製アドオンのためかNoRedirectがブロックすると日本語が文字化けを起こす模様(楽天などで確認)
→アフィリエイトリンクじゃない場合はリダイレクトを許可すると問題は解消する

・ブログパーツの埋め込み型スクリプトの対応

・@updateURLを削除(greasyforkで勝手に消されるのと、インストールしたときのURLをアドオンが保持しているようなので更新可能)

・javascriptで取得できるdocument.cookieは制約が多いらしく、ファーストクッキーのみだったり
  httponly属性だったら取得できなかったりする。addonなら全部取得できるらしい

・formのactionなどでアフィリエイトID仕込んでくるサイトもあるの把握しているけど普段使うサイトには全然ないので対応保留

*************************************************************************/


//=============プログラム開始===========================================================
(function() {
//GM_deleteValue('expDB');

	//user config(変更可能)-------------------------------------------------
	const usrExpandURL = '';	//短縮URLの追加 (add expandURL)
					//example 'domain1|domain2|domain3|' (domain1 is http://domain1/shortID)
					//example2 'bit.ly|goo.gl|www.shortenurl.tk|' (don't insert space.don't forget Vertical bar(|).)
	const clearInterval = 30;	//指定日数より古い展開履歴を削除(clear-interval:days)
	//user config end-------------------------------------------------


	//共通変数&定数-----------------------------------------------------------------

	const getinfoURL = "http://www.getlinkinfo.com/info?link=";					//暫定メイン
	const araishiURL = "http://araishi.com/redirect-check/?submit=&url=";				//補助
	const x1URL      = "http://x-1.jp/c.php?u=";							//補助(展開失敗して延々とリダイレクトするサイト側の不備あるので必ず最後)

	//[killer]共通スタイル
	const zIndex = 1;	//z-index
	const strStyle = 'max-height:20px;max-width:80px;height:auto;width:auto;background:rgba(255,0,0,0.2);margin:0!important;padding:0!important;z-index:' + zIndex + ';text-indent:0;';

	//短縮URL展開
	const regTiny = new RegExp('^https?:\/\/(1drv.ms|1stepup.com|3.ly|3step.me|5.tvasahi.jp|9ch.net|9oo.jp|'
		+ 'ad.afad(.jpadop)?.jp|a.gd|amba.to|amzn.to|(a.)?r10.to|appsto.re|ask.fm\/a|'
		+ 'bit.ly|bitly.com|budurl.com|buff.ly|click.j-a-net.jp|cli.gs|c23.biz|db.tt|dlvr.it|eng.mg|eweri.com|'
		+ 'fav.me|fb.me|fc2.to|g.co|gdzl.la|gigaz.in|go.ascii.jp|goo.gl|'
		+ 'hec.su|hex.io|hrp.asia|htn.to|idek.net|ift.tt|is.gd|inf.to|j.mp|jump.cx|k4wu.com|kl.am|'
		+ 'mcaf.ee|miffy.me|mijikaku.jp|moourl.com|msm.to|my-tiny.com|mzl.la|nazr.in|nico.ms|num.to|'
		+ 'ow.ly|pixiv.me|p.tl|shrsl.com|snipurl.com|sdrv.ms|short.ie|s.nikkei.com|spr.ly|su.ms-x.biz|'
		+ 't.asahi.com|t.co|tighturl.com|tiny.cc|tinyurl.com|tinyly.net|tr.im|tweak.tk|tweetburner.com|twurl.cc|'
		+ 'u111u.info|ul.lc|urx.nu|urx2.nu|urlgator.com|ustre.am|u.to|ux.nu|v.gd|wk.tk|w.mul.asia|wp.me|www.fiverr.com|www.shortenurl.tk|'
		+ 'x5.to|xn--.{3}.ws|xtw.me|x.vu|y.ahoo.it|zpr.io|'
		//RSS
		+ 'rss.rssad.jp|' 
		//user settings
		+ usrExpandURL
		+ 'snurl.com)\/.');

	//強制追加フラグ
	const absAddFlg = true;

	//表示設定
	var hideOriginLinkFlg = userCfg("hideOriginLink");

	var expDB = {};		//URL展開履歴
	var nameDB = {};	//削除用クッキー情報DB
	var cookieDB = {};	//取得したクッキーDB
	clearDB();		//expDB取得 & URL展開履歴削除

	//※注意 同じクッキー名で別ドメイン・別ホストの場合最初の要素(区別用の適当な名前)を別にする
	//sample	makeDB("区別用の適当な名前","cookie名","domain名","host名","path"); ←domain or host must be ""

	//amazonのsession-idとubid-acbjpはログイン情報っぽいので削除不可
	//amazonのat-acbjpとsess-at-acbjpは購入時必要なので削除不可
	makeDB("amazon","UserPref",".amazon.co.jp","","/");	//アフィ確定
	makeDB("apple","a",".apple.com","","/");		//アフィ関連
	makeDB("dlsite","DL_PTAFID",".dlsite.com","","/");	//アフィ確定
	makeDB("dmm","uid","","ad.dmm.com","/");		//アフィ関連
	makeDB("dmm","_clicks","","ad.dmm.com","/");		//アフィ関連
	makeDB("dmm","Aff_A",".affiliate.dmm.com","","/");	//アフィ関連
	makeDB("dmm","deai_xid",".dmm.co.jp","","/");		//アフィ関連
	makeDB("dmm","CAKEPHP","","ip.affiliate.dmm.com","/");	//アフィ?
	makeDB("dmm","Aff_A",".affiliate.dmm.com","","/");	//アフィ?
	makeDB("dmm","Aff_B",".affiliate.dmm.com","","/");	//アフィ?
	makeDB("rakuten","tg_af_histid",".pt.afl.rakuten.co.jp","","/");	//アフィ確定
    makeDB("rakuten","tg_af_histid",".rakuten.co.jp","","/");	//アフィ確定
	makeDB("rakuten","afl-u",".affiliate.rakuten.co.jp","","/");	//アフィ関連


//httponly属性のせいで取得できない？addonにすればComponents.classesで取得できそう
//	makeDB("a8.net","A8_SHARED",".a8.net","","/");
//	makeDB("a8.net","A8FLYID_N1","","rpx.a8.net","/");


	var href = "";		//チェック中のURL
	var strUrl = "";	//修正したURL
	var locUrl = location.href;	//現在のURL

	//処理開始-----------------------------------------------------------------

	//トラッキング除去(主にgoogle対策)
	remTrack(document);

	//文字エンコード用の関数読み込み
	ecl();



    //amazonURLリロード
    if(location.href.match(/^https?:\/\/(www.)?amazon.*(\?|&)tag=/)){
        history.pushState(null, null, setParams(location.href,["tag","adid","AssociateTag","creative","linkCode","linkId","ref-refURL","SubscriptionId"],"del"));
        return;
    }

	//メイン処理===============================================================================================
	function main(pattern,node){
try{
		if(Object.prototype.toString.call(node).slice(8, -1).match(/(Text|Comment)/)) return;



		switch(pattern){
			case "first":
				break;

			case "mutation_chg":
				if(!node)return;
				if(node.href)multi(node);
				break;

			case "mutation_attr":
				if(node.href) multi(node);
				break;

			case "expand":
				multi(node);
				return;

			default: return;
		}



		//変数宣言--------------------------
		var allLinks;		//チェックするすべての要素の配列


		allLinks = node.getElementsByTagName("*");

}catch(e){
	switch( e.name ){
		case 'TypeError':
//			GM_log("AKiller_INIT-TypeError:" + e);
	        default:
			GM_log("AKiller_INIT:" + e);
	}

	return;	//node内にタグ要素が無ければ終了
}





try{

		for (var i = 0; i < allLinks.length; i++){

			var obj = allLinks[i];
			var lastFlg = null;
			if(obj.hasAttribute("Akill_check") && obj.getAttribute("Akill_check")) lastFlg = obj.getAttribute("Akill_check");
			if(pattern == "mutation_attr" && lastFlg && lastFlg.match(/_checked$/) && !lastFlg.match(/Loading$/)){
				obj.setAttribute("Akill_check",lastFlg.replace('_checked',''));
			}

			multi(obj);

		}//main for文ここまで
}catch(e){
//	throw(e);
	GM_log("AKiller_main:" + e);
}

		node = allLinks = null;
	}//mainここまで


	function multi(obj){

		//hrefを含まないリンクは除外
		if(Object.prototype.toString.call(obj).slice(8, -1).match(/(Text|Comment)/)
		  || !obj.hasAttribute("href")
		  || obj.href == undefined
		  || obj.href == "" || !obj.href.match(/^http/)
		  || obj.href.match("megalodon.")
		  || ( obj.hasAttribute("Akill_check") && obj.getAttribute("Akill_check").match(/(killed|before|^Loading|_checked$)/) )
		  || obj.href == obj.getAttribute('Akill_URL')		//linkify系併用時のループ防止
		  || !obj.tagName
		){
			return;
		}

		obj.timer = window.setTimeout(function(){mainCheck(obj);},0.1);
	}


	//URLチェック=============================================================================================
	function mainCheck(objSet){

//if(Object.prototype.toString.call(expDB[href][0]).slice(8, -1).match(/undefined/i))return;
//GM_log("AKiller_mainチェック"+Object.prototype.toString.call(expDB[href][0]).slice(8, -1));

try{


		var obj;
		if(objSet) obj = objSet;
		else return;

		href = obj.href;


		//一度展開してあった場合DBから取得
		if(!obj.hasAttribute('Akill_URL') && expDB[href]
		  && Object.prototype.toString.call(expDB[href][0]).slice(8, -1).match(/string/i) && expDB[href][0].match(/^http/)){
			getExpDB(obj,href);
		}


		//短縮URLで展開したURLがあったら
		if(obj.hasAttribute("Akill_check") && obj.getAttribute("Akill_check").match(/^Done$/)){

			var beforeUrl;
			strUrl = obj.getAttribute('Akill_URL');


			if(obj.hasAttribute("akill_BeforeURL")){ beforeUrl = obj.getAttribute("akill_BeforeURL");}


			//展開による文字化け対応
			if(beforeUrl && beforeUrl.match("&amp;") && !href.match("&amp;")) beforeUrl = beforeUrl.replace(/&amp;/g,"&");

			setLink(obj);

/*
			//短縮URLで複数回リダイレクトした場合、ログインチェック画面の前のURLも表示(商品ページに飛べない場合があるため)
			if(beforeUrl && beforeUrl != href && beforeUrl != strUrl){
				var setHist = function(hisObj){

					//originURL:obj addedURL:obj.nextSibling
					var histArray = beforeUrl.split("|||||");

try{

					for(var bu=0;bu < histArray.length;bu++){
						strUrl = histArray[bu];
						setLink(hisObj,absAddFlg);

						//1つ次の要素に変更
						hisObj = hisObj.nextSibling;
						//originURL:obj.previousSibling beforeURL:obj addedURL:obj.nextSibling
						var setHistAttr = function(target,hNum){
							target.innerHTML = "[BeforeURL" + hNum + "]"

							target.setAttribute("Akill_check","before");
							target.setAttribute("style","display:none;visibility:hidden;");
						}
						if(bu>0) setHistAttr(hisObj.previousSibling,bu);
						setHistAttr(hisObj,bu + 1);

						if(Object.prototype.toString.call(hisObj.nextSibling).slice(8, -1).match(/(Text|Comment)/)) break;
					}


}catch(e){

GM_log("AKiller_既存展開失敗:" + e);
return;
}
				};
				setHist(obj);
                
			}
           */

          
			//短縮URLで複数回リダイレクトした場合、ログインチェック画面の前のURLも表示(商品ページに飛べない場合があるため)
			if(beforeUrl && beforeUrl != href && beforeUrl != strUrl && obj.getAttribute("Akill_check").match("Done")){
				//originURL:obj addedURL:obj.nextSibling
				var histArray = beforeUrl.split("|||||");
                var histTxt = "";

				for(var bu=0;bu < histArray.length;bu++){
                    var chTxt = "added_before"
                    if(bu == histArray.length -1) chTxt = "before";
					histTxt += '<a href="' + histArray[bu] + '" Akill_check="' + chTxt + '" style="display:none;visibility:hidden;" >[BeforeURL' + bu + ']</a>';
				}
                obj.setAttribute("Akill_check","killed_checked")
                obj.insertAdjacentHTML('afterend', histTxt); 
                return;
                
			}
			//href = obj.href;
		}

		strUrl = decURI(href);

		var host = href.match(/^https?:\/\/.*?\//)[0];


}catch(e){

GM_log("AKiller_urlCheck_Error:"+e);
}



try{



		//事前修正===================================================================================

        var params,dataDB;

		//twitter上の短縮
		if(location.host.match(/twitter.com/) && !obj.hasAttribute("akill_check")
		&& obj.hasAttribute("data-expanded-url") && href != obj.getAttribute("data-expanded-url")){
			strUrl = obj.getAttribute("data-expanded-url");
			setLink(obj);
			return;
		}

//https://t.co/redirect?url=http%3A%2F%2Fjin115.com%2Farchives%2F52075170.html&sig=7bc1a427bf2264e135e799a089981672b65ec594
		//t.coリダイレクト
		if(href.match(/^https?:\/\/t.co\/redirect\?url=http/)){
			strUrl = getRedirectUrl(href,"url");
			setLink(obj);
			return;
		}


		//短縮URL展開
		if(href.match(regTiny) && !href.match(/http.*https?:\/\//)){
			getUrl("expand","GET",obj);
			return;
		}


		//youtube展開
		if(href.match(/^https?:\/\/(youtu.be|y2u.be)\/./)){
			var movieId = href.replace(/^https?:\/\/(youtu.be|y2u.be)\//,"").replace("?","&");
			strUrl = "https://www.youtube.com/watch?v=" + movieId;
		}

//http://tinyarrows.com/preview.php?page=http%3A%2F%2Fwww.nwlab.com%2F&count=290
		//短縮URL展開
		if(href.match(/tinyarrows.com\/preview.php.*(\?|&)page=http/)){
			strUrl = getRedirectUrl(href,"page");

//http://adop.jp/wait_redirect.html?url_redirect=http%3A%2F%2Fthejyouhounow.seesaa.net%2Farticle%2F250092136.html%3F1328212322&id=1301&type=0
		//短縮adop.jp
		}else if(href.match(/adop.jp\/wait_redirect.*(\?|&)url_redirect=/)){
			strUrl = getRedirectUrl(href,"url_redirect");


		//短縮linkis
		}else if(host.match(/https?:\/\/(ln.is|linkis.com)\//)){

			if(host.match(/\/ln.is\//)){
				strUrl = href.replace(/\/ln.is\//,"/linkis.com/");
				obj.setAttribute('Akill_URL',strUrl);
			}

			getUrl("linkis","GET",obj);
			return;
		}


		//m.google.com
		if(host.match(/https?:\/\/m.google./)){
			strUrl = href.replace(/\?.*/,"");
			setLink(obj);
			return;
		}

		//base64暫定(aHR0c = http)
		if(href.match(/(\/|=)(aHR0c[a-zA-z0-9]+={0,2})($|\/|\?|&|-?-?;?)/)
		&& !href.match(/cm_cr_dp_(abuse_)?voteyn/))	//amazon評価＆違反報告は除外
		{

			var decTxt = "";
try{
			decTxt = window.atob(RegExp.$2);
}catch(e){
}
			if(decTxt.match(/^https?:\/\/./)){
				strUrl = decTxt;
				setLink(obj);
				return;
			}
		}


		//bloglovin用
		if(href.match(/^https?:\/\/(www|adult).bloglovin.com.*(\/blogs?\/|blog=)/) && obj.tagName.match(/^(a|A)$/)){

			var tmp ="",blogID ="",postID ="";

//https://www.bloglovin.com/blog/ブログID
//http://www.bloglovin.com/viewer?blog=ブログID
			//パラメータのurlに修正---------------------------------
			if( href.match(/^https?:\/\/(www|adult).bloglovin.com.*\/blogs?\/(post|[0-9]|.*-[0-9])/)){
				tmp = href.replace(/.*\/blogs?\//,"");

				blogID = tmp.replace(/\/.*$/,"").replace(/\/.*$/,"").replace(/.*-/,"");

//https://www.bloglovin.com/blogs/-ブログID/2015-02-01-7zdownload-ポストID
				if(href.match(/\/blogs\//)) postID = "&post=" + href.replace(/.*-/,"");

//https://www.bloglovin.com/blog/post/ブログID/ポストID
//http://www.bloglovin.com/viewer?blog=ブログID&post=ポストID
				//ポスト指定もあった場合
				if(blogID == "post"){
					blogID = tmp.replace(/post\//,"").replace(/\/.*$/,"");
					postID = "&post=" + tmp.replace("post/" + blogID + "/","").replace(/\/.*$/,"");
				}

				obj.setAttribute('Akill_URL',"http://www.bloglovin.com/viewer?blog="+ blogID + postID);
			}

			getUrl("bloglovin","GET",obj);
			return;
		}


//http://itrack2.valuecommerce.ne.jp/cgi-bin/2507165/vc_entry.pl?ITRACK_INFO=088226016302392627140602095214&COOKIE_PATH=/cgi-bin/2507165/&COOKIE_DOMAIN=.valuecommerce.ne.jp&VIEW_URL=http%3A%2F%2Fwww.takashimaya.co.jp%2Fshopping%2Ffood%2F0400000115%2F&REFERRER=aHR0cDovL2NrLmpwLmFwLnZhbHVlY29tbWVyY2UuY29tLw&COOKIE_EXPIRES=Fri,%2001%20Aug%202014%2009:52:14%20GMT&va=2392627&vs=3091344&vp=882260163
//http://www.daimaru-matsuzakaya.jp/vcentry/?ITRACK_INFO=088226017702266773140602095722&COOKIE_PATH=/&COOKIE_DOMAIN=www.daimaru-matsuzakaya.jp&VIEW_URL=http%3A%2F%2Fwww.daimaru-matsuzakaya.jp%2F&REFERRER=aHR0cDovL2FkLmpwLmFwLnZhbHVlY29tbWVyY2UuY29tLw&COOKIE_EXPIRES=Fri,%2001%20Aug%202014%2009:57:22%20GMT&vs=3091344&vp=882260177&va=2266773
		//valuecommerce========================================
		//domainが多岐にわたるので事前に修正
		if(href.match(/(\?|&)VIEW_URL=http/)){
			strUrl = getRedirectUrl(href,"VIEW_URL");
		}

//http://anonym.to/?
//http://www.anonym.to/?
		//anonym.to==========================================
		if(href.match(/^https?:\/\/(www.)?anonym.to\/\?/)){
			strUrl = href.replace(/^https?:\/\/(www.)?anonym.to\/\?/,"");

		//bestgate==========================================
		}else if(location.href.match(/^https?:\/\/www.bestgate.net/)){
//http://www.bestgate.net/hop_auction.php?url=http%3A%2F%2Fpage13.auctions.yahoo.co.jp%2Fjp%2Fauction%2Fr112484393&type=at
			//bestgateにあるヤフオクリンク修正
			if(href.match(/(\?|&)url=http/)){
				strUrl = getRedirectUrl(href,"url");
			}

//http://click.dtiserv2.com/Direct/9006999-6-167676/moviepages/071216-206/index.html
		//click.dtiserv2.com
		}else if(host.match(/^https?:\/\/click.dtiserv2.com\//)){
			getUrl("expand","GET",obj);
			return

//http://l.facebook.com/l.php?u=リダイレクトURL&h=-AQGihBRZ&enc=AZMU0R7z01C_T_ISMpmAMHLyRpW7Wqjdb8Im3TPkOb9Y8XJ3xZJd6mtcIqMzeFiq1f4wvvhbuXdx9TfoAqt46mqa0pAWAa2JjNbYHbfZ2PMnPIKvV-QYbQbi1-VS-2ZSWGBrEzEqijhEL2QJNxT9sHVY&s=1
		//facebookリダイレクト除去
		}else if(href.match("facebook.com/l.php?u=")){
			strUrl = getRedirectUrl(href,"u");

//http://t.umblr.com/redirect?z=http%3A%2F%2Fbit.ly%2F
		//tumblerリダイレクト
		}else if(href.match("t.umblr.com/redirect?")){
			strUrl = getRedirectUrl(href,"z");

//http://c.kakaku.com/forwarder/forward.aspx?ShopCD=3904&PrdKey=K0000616989&Url=http%3A%2F%2Fkakaku%2Ecom%2Fjump%2Faf%2F0051%2Foutside%5F30993%2Ehtml&Hash=3f6d5b0c9f3989d76acd2e1697ada044
		//価格コムのURLを事前に修正
		}else if(host.match("kakaku.com/")){
			if(href.match(/(\?|\&)Url=http/)){
				strUrl = getRedirectUrl(href,"Url");

			}else if(href.match(/(\?|\&)url=http/)){
				strUrl = getRedirectUrl(href,"url");

//http://kakaku.com/ksearch/redirect.asp?u=http%3A%2F%2Fhb%2Eafl%2Erakuten%2Eco%2Ejp%2Fhgc%2Fg00pukw1%2E4f3hl703%2Eg00pukw1%2E4f3hme41%2F%5FRTkcom10000111%3Fpc%3Dhttp%253A%252F%252Fitem%2Erakuten%2Eco%2Ejp%252Fjism%252F4953103168619%2D42%2D4479%2Dn%252F%26amp%3Bm%3Dhttp%253A%252F%252Fm%2Erakuten%2Eco%2Ejp%252Fjism%252Fi%252F10177711%252F&h=81bdf420e29289c4c563172c6ba7eccd
			}else if(href.match(/(redirect|rd_kused.asp)/) && href.match(/(\?|\&)u=http/)){
				strUrl = getRedirectUrl(href,"u");
			}

            //アフィパラメーター
            strUrl = setParams(strUrl,["lid"],"del");

			setLink(obj)
			return
		}else{
		}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


		//リンク修正開始-----------------------------------------------------------

		//アフィリエイト関連(アフィリエイト専門系)-----------------------------------------------------------


//http://a5.tuhan.ne.jp/r.php?site=coneco&ec=1715&pagetype=coneco&sku=4549210020560&cat=01011010&price=59886&op=category_name%3D%2583%2566%2583%2558%2583%254E%2583%2567%2583%2562%2583%2576%2583%2570%2583%255C%2583%2552%2583%2593%26item_id%3D1130829060%26ta%3D20%26item_name%3DFMVD0502NP%2BESPRIMO%2BD551%252FGX%2BSP%2528Celeron%2BG1610%252F2GB%252F500GB%252FDVD%252FWin7%2BPro%2529&url=http%3A%2F%2Fwww.coneco.net%2Fgoshop.asp%3Fm_id%3Dea2fafcdb4251e13f7c9172f0d089e98%26com_id%3D1130829060%26shop_id%3D1715%26c_id%3D01011010%26goshop%3D1%26ta%3D20
		//a5.tuhan ==============================================================================
		if(href.match(/a5.tuhan.ne.jp.*(\?|&)url=http/)){
			strUrl = getRedirectUrl(href,"url");

//http://px.a8.net/svt/ejp?a8mat=10FZ8L+9U8XPU+5WS+C28PV&a8ejpredirect=http%3A%2F%2Fitem.rakuten.co.jp%2Ftv-ya%2商品%2F
		//a8.net=========================================================================================
		}else if(host.match(".a8.net")){
			if(href.match("a8ejpredirect")){
				strUrl = getRedirectUrl(href,"a8ejpredirect");

//http://www.a8.net/cgi-bin/redirect?ar=http%3a%2f%2fwww.a8.net%2fas%2fas_promo%2f&a8=gXUI7X-RfAkcnoEcnoU6sRs0XM1RfoURBo4RNolLmpjEY3Bxx
			}else if(href.match(/redirect\?ar=/)){
				strUrl = getRedirectUrl(href,"ar");

//http://px.a8.net/svt/ejp?a8mat=10BM2M+7QMVW2+MZI+15UZJL
//修正http://px.a8.net/svt/ejp?a8mat=++MZI+15UZJL
			}else if(href.match(/a8mat=.*\+/)){
//				strUrl = href.replace(/a8mat=.*?\+.*?\+/,"a8mat=?++");
				getUrl("expand","GET",obj,3);
				return;
			}

		//accesstrade==========================================================================
		}else if(host.match("accesstrade.net/")){

//http://www.accesstrade.net/at/c.html?rk=英数字&url=http%3A%2F%2Fwww.サイト.html%3Fsort%3D5d%26page%3D1
			if(strUrl.match(/(\?|&)url=http/)){
				strUrl = getRedirectUrl(href,"url");

//http://is.accesstrade.net/cgi-bin/isatV2/AccessTradeP/entryV2.cgi?rk=01004s1s007xy1&nid=g1355613504&rurl=http%3A%2F%2Fwww.accesstrade.ne.jp%2F&media=http%3A%2F%2Fh.accesstrade.net%2F&atss=01004s1s007xy1-3de5b4e75a5ef7f5a8caa975196efb9a
			}else if(href.match(/(\?|&)rurl=http/)){
				strUrl = getRedirectUrl(href,"rurl");
			}else{
				getUrl("expand","GET",obj);
				return;
			}

		//www.a-c-engine.com
		}else if(host.match(/www.a-c-engine.com/)){
			strUrl = getUrl("expand","GET",obj);
			return;

//http://ad.aspm.jp/cl/click_asp.
		}else if(host.match(/ad.aspm.jp/)){
			strUrl = getUrl("expand","GET",obj);
			return;

//http://adf.ly/数字/http://
		//adf.ly====================================================================
		}else if(href.match(/adf.ly\/\d+\/./)){
			if(href.match(/adf.ly\/\d+\/http/)){
				strUrl = href.replace(/.*adf.ly.*http/,"http");
			}else {
				strUrl = href.replace(/.*adf.ly\/\d+\//,"http://");
			}

//http://click.adlantis.jp/ad/click?aid=NzQ2MDcw%250A&at=2&cid=NTAwNDY%253D%250A&conv_id=NDQxNDY%253D%250A&url=http%253A%252F%252Fadf.shinobi.jp%252Fr%252F72b87d467739fce5e46f7177eb014e37%253Futm_source%253Dadmcmpny%2526utm_medium%253Dbanner%2526utm_campaign%253D72890&zid=mYt9U98u5Bc79OQYsdPtXw%3D%3D
		//adlantis==============================================================================
		}else if(href.match(/adlantis.jp.*(\?|&)url=http/)){
			strUrl = getRedirectUrl(href,"url");

		//af-mark=================
		}else if(host.match(/www.af-mark/)){
			getUrl("expand","GET",obj,2);
			return;

//http://click.affiliate.ameba.jp/affiliate.do?affiliateId=27389922
		//ameba==============================================================================
		}else if(href.match(/affiliate.ameba.jp.*(\?|&)affiliateId=/)){
			getUrl("expand","GET",obj);
			return;

		//fc2==================================================================================
		}else if(href.match("blog.fc2.com/goods/")){
			strUrl = href.replace(/(blog\.fc2\.com\/goods\/\w+\/).+$/i, "$1");

//https://www.gamefeat.net/webapi/v1/reportClick?ad_id=1802&site_id=760
		//gamefeat===========================================================================
		}else if(host.match("gamefeat.net")){
			getUrl("expand","GET",obj);
			return;

//http://www.google.co.jp/aclk?sa=l&ai=CscvKshs4U-e6JMHAlAXf74G4BK-Lq5cEv72pjHHHvvOyvgEIBBABKAVQ0tL2oANgicvBhOwToAGZis3bA8gBB6kCxOgqt9HjRD6qBCVP0NYfuJc3xTwD_YPY33CG2FOeBMEPRY4tchOkmx_9saBJpN8wwAUFoAYmgAfP9bIkkAcB4BKqgKnV-7C6z58B&sig=AOD64_1ERLIr2li_OU5jev_gF23LyMkuAw&ctype=5&rct=j&q=%E3%82%AD%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%89%E3%81%AE%E9%AB%98%E3%81%95&ved=0CCsQwg8&adurl=http://product.rakuten.co.jp/product/-/9ed6c7ead94e3d087fa4f88896cd725c/%3Fsc2id%3Dgmc_211213_9ed6c7ead94e3d087fa4f88896cd725c%26scid%3Ds_kwa_pla&cad=rja
		//googleAd==================================================================================
		}else if(host.match(/https?:\/\/(www.)?google(ads)?./)){
			if(href.match(/.*\/interstitial.*(\?|$)url=h/)) return;

			if(href.match(/(\?|&)adurl=http/)){
				strUrl = getRedirectUrl(href,"adurl");
				strUrl = strUrl.replace(/\?adid=.*$/,"");

//https://www.google.co.jp/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&docid=P5Srr3ocO7LUlM&tbnid=dwrfHg15I_WHmM:&ved=0CAEQjxw&url=http%3A%2F%2Fwww.amazon.co.jp%2FT-mart%25E6%2597%25A5%25E6%259C%25AC-%25E3%2582%25AD%25E3%2583%25BC%25E3%2583%259C%25E3%2583%25BC%25E3%2583%2589%25E3%2582%25B9%25E3%2582%25BF%25E3%2583%25B3%25E3%2583%2589-%25E9%25AB%2598%25E3%2581%2595%25E8%25AA%25BF%25E7%25AF%2580%25E4%25BB%2598%25E3%2581%258D-%25E6%25A5%25BD%25E5%2599%25A8-%25E3%2582%25B7%25E3%2583%25B3%25E3%2582%25BB%25E3%2582%25B5%25E3%2582%25A4%25E3%2582%25B6%25E3%2583%25BC%25E4%25B8%25A6%25E8%25A1%258C%25E8%25BC%25B8%25E5%2585%25A5%25E5%2593%2581%2Fdp%2FB00HV8GIPU&ei=VC84U-u_CYTVkAWI3IDgDw&psig=AFQjCNEwf895lq12uQpb-yS7nneXGbr8aQ&ust=1396277458397147
			}else if(href.match(/(\?|&)url=http/)){
				strUrl = getRedirectUrl(href,"url");

			//google image
			}else if(href.match(/google\..*imgrefurl=http/)){
				strUrl = getRedirectUrl(href,"imgrefurl");

			}else if(href.match(/aclk\?/)){
			    getUrl("expand","GET",obj);
    			return;
            }

//http://refer.istockphoto.com/ta.php?lc=076750041038004651&atid=124071%7CBannerID%3D124071%7CReferralMethod%3DBanner&url=http%3A%2F%2Fnihongo.istockphoto.com
		//istockphoto=======================================================================================
		}else if(href.match(/.istockphoto..*(\?|\&)url=http/)){
			strUrl = getRedirectUrl(href,"url");

//http://ls.j-a-net.jp/?a=36882&d=494714&url=http%3A%2F%2Fwww%2E10keiya%2Ecom%2Fitem%2F5083%2Ehtml
		//Janet ==============================================================================
		}else if(href.match(/.j-a-net.jp.*(\?|\&)url=http/)){
			strUrl = getRedirectUrl(href,"url");

//http://www2.jp.jskypro.com/affiliate/click.php?uid=3168&did=208724
		}else if(host.match("jskypro.com")){
			getUrl("expand","GET",obj);
			return;

//http://affiliates.jskyservices.com/scripts/click.php?a_aid=50179d7c1f314&a_bid=569789f5&desturl=http%3A%2F%2Fmy.tokyo-hot.com%2Fdetail%2Fid%2F20098.html
		//JSKY(接続できないので未確認)========================================================
		}else if(href.match(/affiliates.jskyservices.com.*(\?|\&)desturl=http/)){
			strUrl = getRedirectUrl(href,"desturl");

//http://clk.kau.li/?dat=CBL9XwBfbF7yua-GPwxErsGTvRp75RNx0zI8g0dwtu6b1GtHV3lKEI6AyXDjh-rlP-FCCmsdf777XWpl9BR61UDSYNhKCKKPS4jNe_L2puIPz__Q0WPH58muaVeFBiHTz5O8hgtVmNg9N1oXi0eRuaSHd12oYC8NhJNz6CQM2eN1nsyAecNxpg&rurl=http%3A%2F%2Fanicobin.ldblog.jp%2F&url=http%3A%2F%2Fanicobin.ldblog.jp%2Farchives%2F39788443.html&rd=http%3A%2F%2Fdaikoku.ebis.ne.jp%2Ftr_set.php%3Fargument%3DtKnnLCT6%26ai%3Da53a298bd5b584
		//Kauli============================================================================================
		}else if(href.match(/.kau.li.*(\?|\&)rd=http/)){
			strUrl = getRedirectUrl(href,"rd");

		//http://kt-joker.com/movie_3404196194_unm96.php?adwares=A9999999&id=N0000087&from=
		}else if(host.match(/(jskyservices|kt-joker|oooo9|peepfox).com/)){
			if(href.match(/(\?|&)url=h/)){
				strUrl = getRedirectUrl(href,"url");
			}else{
				strUrl = setParams(href,["id","adwares","from"],"del");
			}

//http://www.linkshare.ne.jp/scland/mgm/?id=gzfSX9*DI5k
		//linkshare================================================================================================
		}else if(href.match(/.linkshare..*(\?|\&)id=/)){
			strUrl = setParams(href,["id"],"del");

//http://www.sofmap.com/buy/lsurl_entry.aspx?lstid=U4AfXeaTNq4-l7EnG4eSREjOnqPlmXjqpw&lsurl=http%3A%2F%2Fwww.sofmap.com%2F
//http://amanaimages.com/lsgate?lstid=pM6b0jdQgVM-Y9ibFgTe6Zv1N0oD2nYuMA&lsurl=http%3A%2F%2Famanaimages.com%2Flp%2Fcreative%2Fafpl130225.html%3Frtm%3Dad_ls%26waad%3DJGpD1ReZ
//http://www.necdirect.jp/redir/ndentryls.asp?lstid=CBTtYXMkwwI-TaKj1VZm5Y78w0wJpYbXYg&lsurl=http%3A%2F%2Fwww.necdirect.jp%2Fshop%2Fnote%2Flavie%2Fsh%2Findex.html
		//linkshare?(多岐のドメイン)============================================================================================
		}else if(href.match(/(\?|\&)lsurl=http/ && /(\?|\&)lstid=/)){
				strUrl = getRedirectUrl(href,"lsurl");

		//linksynergy linkshareらしい ==============================================================================
		}else if(host.match(/.linksynergy./)){

			if(href.match(/RD_PARM1=/)){
				strUrl = decURI(getRedirectUrl(href,"RD_PARM1"));

//http://click.linksynergy.com/link?id=123456789&offerid=300091.2&type=3&murl=http%3A%2F%2Fwww.bestbuy.com%2Fsite%2Fcanon-eos-60d-dslr-camera-with-18-135mm-is-lens-black%2F1221963.p%3Fid%3D1218237703503%26skuId%3D1221963%26cmp%3DRMX%26ky%3D2dN2vg9ikE823Sb2cqFFchnSnf6JkvQna
			}else if(href.match(/(\?|\&)murl=http/)){
				strUrl = decURI(getRedirectUrl(href,"murl"));

			}else if(href.match(/(\?|\&)subid=http/)){
				strUrl = decURI(getRedirectUrl(href,"subid"));
			}else{
				getUrl("expand","GET",obj);
				return;
			}

//https://www2.liveads.jp/widgets_src/cc.php?c=vs%3D2439871%26amp%3Bvp%3D876489954%26amp%3Bvcptn%3Dfeb92ec1_2_106001%26amp%3Bvc_url%3Dhttp%253A%252F%252F
		//liveads.jp==================================================================================
		}else if(href.match(/www2.liveads.jp.*vc_url/)){
			strUrl = href.replace(/&amp;/g, "&");
			strUrl = getRedirectUrl(strUrl,"vc_url");

//http://altfarm.mediaplex.com/ad/ck/10591-62045-26616-588?ACD=XQu4C3KR0Oc-QSMuOOkWxZkxzlLa6Riubw&DURL=http%3A%2F%2Falienware.jp%2F
//http://adfarm.mediaplex.com/ad/ck/10591-173392-30165-0?ACD=10591173392301650&!mpro=http://lt.dell.com/lt/lt.aspx?CID=21501&LID=4996848&DGC=LS&DGSeg=DHS&ACD=GSAXENiMcvI-CV438pQz9B3coGmNm0VKeg&DURL=http%3A%2F%2Fwww.dell.com%2Fjp%2Fp%2Fdeals%23!dlpgid%3Dmobility-laptop-deals

		//mediaplex.com(検索するとウィルスがどうのとか出てくるリダイレクトサイト)=========================================
		}else if(href.match(/.mediaplex.com.*(\?|\&)DURL=http/)){
			strUrl = getRedirectUrl(href,"DURL");

//http://mineo.jp/lp/lp_10.html?cid=DBNA000NANAAFEAFB00000027150601
		}else if(host.match(/mineo.jp/)){
			strUrl = setParams(href,["cid"],"del");

//http://c.af.moshimo.com/af/c/click?a_id=420859&p_id=170&pc_id=185&pl_id=4062&url=http://www.amazon.co.jp/dp/B000MGBPNI
		//もしもアフィリエイト==============================================================================
		}else if(href.match(/.moshimo.com.*(\?|\&)url=/)){
			strUrl = getRedirectUrl(href,"url");

//http://pixel.everesttech.net/2127/cq?ev_sid=3&ev_ln=&ev_crx=47568359292&ev_mt=&ev_n=g&ev_ltx=pla:602973&ev_plx=602973-MT&ev_ptid=138541425612&ev_mid=6578989&ev_cty=JP&ev_lan=ja&ev_dvc=c&ev_dvm=&url=http%3A%2F%2Fwww%2Efelissimo%2Eco%2Ejp%2Fhaco%2Fv34%2Fcfm%2Fproducts%5Fdetail001%2Ecfm%3FGCD%3D602973%26bid%3D12257%26xid%3Dp_lso_fc_PLA
		//pixel.everesttech.net
		}else if(href.match(/pixel.everesttech.net.*(\?|\&)url=/)){
			strUrl = getRedirectUrl(href,"url");

//http://refer.ccbill.com/cgi-bin/clicks.cgi?CA=930223-0000&PA=2574586&HTML=http://www2.g-queen.com/index2.html
		//refer.ccbill.com
		}else if(host.match(/refer.ccbill.com/)){
			if(href.match(/HTML/)){
				strUrl = getRedirectUrl(href,"HTML");
			}else if(href.match(/clicks/)){
				getUrl("expand","GET",obj);
				return;
			}


//http://www2.sbs-ad.com/track/traffic.php?c=22068-1-102&b=10202779&u=http%3A%2F%2Fwww.xxx-av.com%2Fhome.html
		}else if(host.match(/sbs-ad.com/)){
			if(href.match(/(\?|\&)u=/)){
				strUrl = getRedirectUrl(href,"u");
			}else if(href.match(/traffic/)){
				getUrl("expand","GET",obj);
				return;
			}


//http://intr.shinobi.jp/LandingHandler?nm=46095&commercial_id=2
		//忍者admax紹介================================================================================
		}else if(href.match("shinobi.jp/LandingHandler")){
			strUrl = href.replace(/\?.*$/,"");

//http://英数字.qqc.co/url/http://
		//trafficgate==============================================================================
		}else if(strUrl.match(/.qqc.co\/url\/http/)){
			strUrl = href.replace(/.*.qqc.co\/url\/http/,"http");

//https://track.affiliate-b.com/visit.php?guid=ON&a=R75062-w256343j&p=t409868V
		//track.affiliate-b.com==============================================================
		}else if(host.match(/track.affiliate-b.com/)){
			getUrl("expand","GET",obj);
			return;

		//trafficgate==============================================================================
		}else if(strUrl.match("trafficgate.net")){

//http://ad2.trafficgate.net/t/r/18/702/44662/0/-/https://shop.elecom.co.jp/Store/Product.aspx?JanCd=4953103062849
			if(href.match("/-/http")){
				strUrl = href.replace(/.*\/-\/http/,"http");

//http://ad2.trafficgate.net/t/r/1/45/175962_199702/0/TSTOXPz14TNbPnh19Y2tV_oDFr6RLlN
			}else{
				getUrl("expand","GET",obj);
				return;
			}

		//trafficgateのwebantenna(gaが広告主情報)==============================================================================
//http://tr.webantenna.info/rd?waad=vOAmxCtv&ga=WAylLT-1
		}else if(href.match(/tr.webantenna.info.*(\?|&)ga=/)){
			//何故かパラメータごと消すとエラーが出るので数値だけ削除
			strUrl = setParams(href,["ga"],"");
			setLink(obj);
			return;

//http://ck.jp.ap.valuecommerce.com/servlet/referral?sid=13940&pid=877084383&vc_url=http://www.dospara.co.jp/5shopping/detail_parts.php?ic=80552&waad=vx2bADUp
//http://atq.ck.valuecommerce.com/servlet/atq/referral?sid=2219441&pid=877510753&vcptn=auct/p/lvqz8ovHd60uhKFgupcFng--&vc_url=http%3A%2F%2Fpage3.auctions.yahoo.co.jp%2Fjp%2Fauction%2Fc424445646
		//valuecommerce ==============================================================================
		}else if(href.match("valuecommerce.")){

			if(href.match(/(\?|&)vc_url/)){
				strUrl = getRedirectUrl(href,"vc_url");

//http://ck.jp.ap.valuecommerce.com/servlet/referral?va=2266773&sid=3091344&pid=882260177&vcid=bGmU_AHjllv84Mt-fZ4weDItjcOmmGcAFaJssucpwdz9kF75jqBDmQ&vcpub=0.621401729893042
			//valuecommerce======================================================================
			//vc_urlの指定がないものはpid(ユーザーID？)とofferid(商店ID？)によってオリジナルリンクへ飛ぶ模様
			}else{

				getUrl("expand","GET",obj,2);
				return;
//				strUrl = setParams(href,["va","vcid","vcpub"],"");
			}


//http://aff.makeshop.jp/redirect.html?service_id=1&shop_id=yutapro&media_id=KCH&url=www.yutapro.net%2Fshopdetail%2F016003000007%2F
		//makeshop ==============================================================================
		}else if(host.match(/^http:\/\/aff.makeshop.jp/)){
			strUrl = 'http://' + getRedirectUrl(href,"url");

//http://r.advg.jp/
		//makeshop ==============================================================================
		}else if(host.match(/advg.jp/)){
			getUrl("expand","GET",obj,2);
			return;

//outgoing.prod.mozaws.net
		}else if(href.match(/^https?:\/\/outgoing.prod.mozaws.net\/.*?\/(https?%3A\/\/.*$)/)){
			strUrl = RegExp.$1.replace("%3A//",'://');

//http://whi.linguette.net/519T154
		}else if(href.match(/https?:\/\/(\w+).((linguette|natadecoco).net|(choucreme|crostol).com)\/(\d{3}.\d{3}\/?)/)){
			strUrl = href.replace(RegExp.$5,"");

		}else{

		}

		//RSS-------------------------------------------------------------------
		//基本的には対応しない(「RSS広告削除社」などすでに広告削除してくれるサービスがあるため)


//http://psrd.yahoo.co.jp/PAGE=P/LOC=PRD/R=1/O=P/MID=store-wax/TBID=/SIG=1243tval6/EXP=1206101243/*-http%3A//rd.store.yahoo.co.jp/wax/fu-esa-10ce.html
		//yahooのRSS？==============================================================================
		if(href.match(/.yahoo..*\*\-http/)){
				strUrl = decURI(href.replace(/.*\/\*\-http/,"http"));

//http://rdsig.yahoo.co.jp/rss/l/headlines/prod/zdn_pc/RV=1/RU=aHR0cDovL2hlYWRsaW5lcy55YWhvby5jby5qcC9obD9hPTIwMTQxMjI2LTAwMDAwMDY5LXpkbl9wYy1wcm9k
		}else if(href.match(/.yahoo..*\/rss\//)){
				getUrl("expand","GET",obj);
				return;

		//その他::::::::::::::::::::::::::::::::::::::::::::::::

		}else{
		}



		//サイト別----------------------------------------------------------------

		//Shop系::::::::::::::::::::::::::::::::::::::::::::::::::::::::

		//7netshopping========================================================================
//http://www.7netshopping.jp/relay/affiliate/entranceProcess.do?url=http%3A%2F%2Fwww.7netshopping.jp%2Fbooks%2Fdetail%2F-%2Fisbn%2F9784088798349&affid=1231517777783348&site=0&link=6
		if(href.match(/7netshopping..*(\?|&)url=http/)){
			strUrl = getRedirectUrl(href,"url");

		//amazon==============================================================================
		}else if(href.match(/^https?:\/\/(www.|affiliate.)?amazon.(jp|co.jp|com|ca|com.br|com.mx|co.uk|de|fr|it|es|cn|in|com.au)\/./)){


			if(href.match(/%26tag%3D/)) href = strUrl;

//http://www.amazon.co.jp/gp/product/images/4048919377/ref=dp_otherviews_z_0?ie=UTF8&img=0&s=books
			//商品画像の切り替えURLだったら除外
			if(href.match(/(\/gp\/product\/images\/|\/ask\/questions\/)/)){
				//何もしない

			//アマゾンのリダイレクト除去
			}else if(href.match(/(\/|sl)redirect.*=/i) ){

//https://www.amazon.co.jp/gp/slredirect/picassoRedirect.html/ref=sspa_dk_detail_0?ie=UTF8&adId=A3MVUJ952SPOS9&qualifier=1539854521&id=2875222140936219&widgetName=sp_detail&url=%2Fdp%2FB076HH9Z5J%2Fref%3Dsspa_dk_detail_0%3Fpsc%3D1%26pd_rd_i%3DB076HH9Z5J%26pf_rd_m%3DAN1VRQENFRJN5%26pf_rd_p%3D35261a28-eed5-46a8-9369-308fa0c478f8%26pf_rd_r%3DMBQ2DRTD21JC6PA45Y6G%26pd_rd_wg%3DbvWAI%26pf_rd_s%3Ddesktop-dp-sims%26pf_rd_t%3D40701%26pd_rd_w%3DAas4z%26pf_rd_i%3Ddesktop-dp-sims%26pd_rd_r%3D452c763a-d2b7-11e8-9ead-972dad541d9c
                if(href.match(/.*\/slredirect\/.*(&|\?)url=.*/)){
                    strUrl = getRedirectUrl(href,"url");

//http://www.amazon.co.jp/gp/redirect.html/ref=amb_link_68694429_2?ie=UTF8&location=http%3A%2F%2Fwww.amazon.co.jp%2Fgp%2Fhelp%2Fcustomer%2Fdisplay.html%3FnodeId%3D200505800&token=0AE1DFACC954F91986074504F57C1362C85FB6E8&pf_rd_m=AN1VRQENFRJN5&pf_rd_s=merchandised-search-left-2&pf_rd_r=0PW7G1RFAKKV592CEXCJ&pf_rd_t=101&pf_rd_p=157968649&pf_rd_i=2799399051
                }else if(href.match(/(\?|\&)location=http/)){
					strUrl = getRedirectUrl(href,"location");

//http://www.amazon.co.jp/exec/obidos/redirect?tag=bestgate-22&path=http%3A%2F%2Fwww.amazon.co.jp%2Fgp%2Foffer-listing%2FB00CL7LC3O%2F%3Fcondition%3Dnew
				}else if(href.match(/(\&|\?)path=http/)){
					strUrl = getRedirectUrl(href,"path");

//http://www.amazon.co.jp/exec/obidos/redirect?link_code=ur2&camp=247&tag=naritanetmap-22&creative=1211&path=external-search%3Fsearch-type=ss%26keyword=%25E3%2583%25AA%25E3%2582%25B9%25E3%2583%2588%25E3%2583%25A9%25E6%2592%2583%25E9%2580%2580%25EF%25BC%25A1%25EF%25BC%25A2%25EF%25BC%25A3%25E3%2580%2580%26index=books-jp
//http://www.amazon.co.jp/exec/obidos/redirect?link_code=ur2&camp=247&tag=naritanetmap-22&creative=1211&path=external-search?search-type=ss&keyword=%E3%83%AA%E3%82%B9%E3%83%88%E3%83%A9%E6%92%83%E9%80%80%EF%BC%A1%EF%BC%A2%EF%BC%A3%E3%80%80&index=books-jp
				}else if(href.match(/(\?|\&)path=/)){
					strUrl = href.replace(/(.*)redirect\?.*$/i,'$1' + getRedirectUrl(href,"path"));
				}

//http://www.amazon.co.jp//ref=as_sl_pd_tf_lc?tag=a8-affi-62498-22&camp=1&creative=1&linkCode=ur1&ref-refURL=http%3A%2F%2Frcm-jp.amazon.co.jp%2F
			//rcm-jp.amazon(アマゾンのURLの後に//が来るパターンはトップページへのリンクだけ？)
			}else if(href.match(/amazon.(jp|co.jp|com|ca|com.br|com.mx|co.uk|de|fr|it|es|cn|in|com.au)\/\//) && !href.match(/(ASIN|product|dp)/)){
				strUrl = href.replace(/(.*.amazon..*?\/)\/(.*$)/i,"$1");


//正しいアドレスhttp://www.amazon.co.jp/gp/aw/d/B003YU3XUM
//http://www.amazon.co.jp/gp/aw/rd.html?uid=アフィIDらしきもの&at=アフィIDらしきもの&a=B003YU3XUM&url=%2Fgp%2Faw%2Fd.html&lc=msn
			//スマホ用アドレス(暫定対応)
			}else if(href.match(/\/gp\/aw\//)){
				strUrl = setParams(href,["uid","at"],"del");

				//修正
				strUrl=strUrl.replace(/(\/gp\/aw\/d\/)(.*?)(\/|\?).*$/i, "$1" + "$2/");

				//商品説明のリンクで必要なパラメータまで消すので補てん
				if(!strUrl.match("dsc=") && href.match("dsc=")){
					params = createParamArray(href);	//パラメータ格納
					strUrl = strUrl + "?dsc=" + params["dsc"];
				}
				//詳細説明のリンクで必要なパラメータまで消すので補てん
				if(!strUrl.match("pd=") && href.match("pd=")){
					params = createParamArray(href);	//パラメータ格納
					strUrl = strUrl + "?pd=" + params["pd"];
				}

//http://www.amazon.co.jp/G246%E3%82%B7%E3%83%AA%E3%83%BC%E3%82%BA-24%E5%9E%8B%E3%83%AF%E3%82%A4%E3%83%89%E6%B6%B2%E6%99%B6%E3%83%A2%E3%83%8B%E3%82%BF%E3%83%BC-1920%C3%971080-%E5%85%A5%E5%8A%9B%E7%AB%AF%E5%AD%90%E3%83%9F%E3%83%8BD-Sub15%E3%83%94%E3%83%B3%E3%83%BBDVI-D%E2%80%BBHDCP%E5%AF%BE%E5%BF%9C%E3%83%BBHDMI-G246HLABID/dp/B00ADGM1A8%3FSubscriptionId%3D0571BBGTQZ5YYPEDSY02%26tag%3Dkakaku-pc-pcother-22%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB00ADGM1A8%26me%3dAN1VRQENFRJN5
			//通常の商品URL
			}else {

				//修正
				//strUrl=href.replace(/(amazon\.(jp|co.jp|com|ca|com.br|com.mx|co.uk|de|fr|it|es|cn|in|com.au))\/(.*\/)?(ASIN|product|dp)(\/.*?)(\/|\?).*$/i, "$1/" + "dp" + "$5/");

				//商品IDの前にTOCなど入るURLもある(ex:amazon.co.jp/dp/toc/商品ID)
				//product-descriptionが入る場合もあるがどちらも消さない



				//年齢確認のリダイレクトは無視
				//http://www.amazon.co.jp/gp/product/cero-black-curtain-redirect.html?ie=UTF8&redirectUrl=%2Fgp%2Fproduct%2F商品ID
				if(href.match(/\&redirectUrl=%2F/)) return;


				var amaUrl = href.split("/");
				var amaTmp = amaUrl[0] + "/" + amaUrl[1] + "/" + amaUrl[2] + "/";
				strUrl = amaTmp;

try{
                var id;
 				//ama=2がドメインのところ
				for(var ama=3;ama<amaUrl.length;ama++){
					//GM_log(amaUrl[ama]);

					if(amaUrl[ama].match(/^(ASIN|asin|product|dp)$/)){
						//商品IDなら
						if(amaUrl[ama+1].length == 10 || amaUrl[ama+1].match(/(\?|%3f)/i)){

							//GM_log(amaUrl[ama+1]);
							id = decURI(amaUrl[ama+1]).replace(/\?.*$/,"");
							if(!id) id = getRedirectUrl(href,"ASIN");

							strUrl += "dp/" + id;

						//商品IDじゃない
						}else if(amaUrl[ama+2]){
							//GM_log(amaUrl[ama+1]);
							strUrl += "dp/" + amaUrl[ama+1] + "/" + amaUrl[ama+2].replace(/\?.*$/,"") + "/";

						}

						break;

					//https://affiliate.amazon.co.jp/gp/associates/network/build-links/individual/get-html.html?ie=UTF8&asin=B009OAGO84&marketplace=amazon&quicklinks=1&subflow=sp_
					}else if(amaUrl[ama].match(/get-html\.html/)){
						id = amaUrl[ama].replace(/.*?(asin|product)=(.*)/i,"$2").replace(/(.*?)&.*/,"$1");
						strUrl = strUrl.replace(/affiliate/,"www") + "dp/" + id;
						break;
					}

					if(amaUrl[ama].match(/^b\?.*node=/) && ama != 3){
						strUrl = href.replace(amaUrl[ama-1]+"/","");
					}
				}
}catch(e){
GM_log("AKiller_amazon_Error:"+e);
}

				if(amaTmp == strUrl){ strUrl = href; }


			}//通常ここまで


			//残ったアフィリエイトパラメータ削除("bbn"は必要なので除外)
			if(strUrl.match(/(\?|\&).*?=./)){
				dataDB = ["tag","adid","AssociateTag","creative","linkCode","linkId","ref-refURL","SubscriptionId"];

				params = createParamArray(strUrl);	//パラメータ格納
				for(var key in params){
					if(key.match("pf_rd_")){ dataDB.push(key); };
				}

				strUrl = setParams(strUrl,dataDB,"del");
			}

			//リファラ削除(amazonのページだと表示が重くなるので、行動追跡されるけど除外)
			if(strUrl.match("/ref=") && !location.href.match(/https?:\/\/(www.)?amazon./)){
				var amaRef = strUrl.split("?")[0].match(/\/ref=.*/);
				strUrl = strUrl.replace(amaRef,"/");
			}

			//URL修正
			if(strUrl.match("amazon.jp")){
				strUrl = strUrl.replace(/amazon.jp/,"amazon.co.jp");
			}

			//消し過ぎたパラメータ復活
			if(href.match(/(\?|&)m=/) && !strUrl.match(/(\?|&)m=/)){
				 params = createParamArray(href);	//パラメータ格納
				 var q = "?m=";
				 if(strUrl.match(/\?/)) q = "&m=";
				 strUrl = strUrl + q + params["m"];
			}

		//http://www.aliexpress.com/item/In-Ear-Earphone-IE80-Hifi-Headset-IE-80-In-Ear-headphones-Auricular-with-retail-box-Fast/32383318705.html?shortkey=ymiAvuuM&addresstype=600
		}else if(host.match(/^https?:\/\/.*?.aliexpress.com/)){
			strUrl = setParams(href,["shortkey","addresstype"],"del");

		}else if(host.match(/^https?:\/\/s.aliexpress.com/)){
			getUrl("expand","GET",obj);
			return;

		//appbankstore=============================================================
//http://www.appbankstore.jp/link.php?url=
		}else if(href.match(/http:\/\/www.appbankstore.jp\/link.php\?url=/)){
			strUrl =  'http://www.appbankstore.jp' + getRedirectUrl(href,"url");

		//AppleStore==============================================================================
		}else if(host.match("aos.prf.hn")){
//デコードhttp://aos.prf.hn/click/camref:10ld4j/pubref:Orbotix Sphero/destination:http://store.apple.com/jp/product/HD162LL/A/orbotix-sphero-20-ロボティックボール?fnode=43
//デコードhttp://aos.prf.hn/click/camref:10ldan/pubref:Iphone 5s Case/destination:http://store.apple.com/jp/product/MF041FE/A/iphone-5s-case-ブラウン?fnode=47
			strUrl = setParams(strUrl,["fnode"],"del");
			strUrl = strUrl.replace(/.*destination:/,"");

//http://store.apple.com/us/browse/home/specialdeals/mac/macbook_pro?afid=p231%7Ccamref%3AikL5&cid=AOS-US-AFF-PHG
		//AppleStoreその2==============================================================================
		}else if(href.match(/store.apple.com.*(\?|&)afid=/)){
			strUrl = setParams(href,["afid","cid"],"del");

//https://itunes.apple.com/jp/app/camera+/id329670577?mt=8&uo=4&at=11lc2w
//https://widgets.itunes.apple.com/widget.html?c=jp&brc=FFFFFF&blc=FFFFFF&trc=FFFFFF&tlc=FFFFFF&d=&t=&m=music&e=album&w=250&h=300&ids=660107804&wt=discovery&partnerId=&affiliate_id=&at=11lc2w&ct=
		//itunes(パラメータatがアフィリエイトID。uoはついでに削除)==============================================================================
		}else if(href.match(/itunes.apple.com.*\?.*=/)){
			strUrl = setParams(href,["at","uo","aId","ct"],"del");


//http://www.ark-pc.co.jp/i/20104755/?cid=kakaku
		//ark-pcのトラッカー==============================================================================
		}else if(href.match(/ark-pc.co.jp.*(\?|&)cid=/)){
			strUrl = href.replace(/(\?|&)cid=.*$/,"");

//正しいhttp://www.askul.co.jp/p/商品ID/
//http://www.askul.co.jp/stn?mode=affiliate&tool=215&frameURL=/p/商品ID/&sc_e=cp_a_as_vc_ps_a_p_kakaku
		//askul==============================================================================
		}else if(href.match(/www.askul.co.jp.*\/p\//)){
			strUrl = href.replace(/(www.askul.co.jp)\/.*(\/p\/)(.*\/).*$/i,"$1$2$3");

//http://askulcorporation.tt.omtrdc.net/m2/askulcorporation/ubox/page?mbox=Lohaco_pc_yshppoint_redirect&mboxDefault=http%3A%2F%2Flohaco.jp%2Fevent%2Fbonus_winter%2F%3Fbk%3Dy%26sc_e%3Dj_as_ya_pc_n_pc
//http://askulcorporation.tt.omtrdc.net/m2/askulcorporation/ubox/page?mbox=Lohaco_pc_yshppoint_redirect&mboxDefault=http://lohaco.jp/event/bonus_winter/?bk=y
		//askulcorporation==============================================================================
		}else if(href.match(/askulcorporation.*(\?|&)mboxDefault/)){
			strUrl = getRedirectUrl(href,"mboxDefault");
			strUrl = href.replace(/(\?|\&)bk=.*$/,'');

//http://bookwalker.jp/series/492/?adpcnt=7qM_Wzs
		//bookwalker========================================================================
		}else if(href.match(/bookwalker.jp.*(\?|&)adpcnt=/)){
			strUrl = setParams(href,["adpcnt"],"del");

//http://bicycle.kaigai-tuhan.com/rd.php?url=https%3A%2F%
		//bicycle.kaigai-tuhan.com==============================================================
		}else if(href.match(/bicycle.kaigai-tuhan.com.*(\?|&)url=http/)){
			strUrl = getRedirectUrl(href,"url");

		//carview(trafficgate)===============================================================
		}else if(href.match(/.carview.co.jp\/.*(\?|\&)dest=/)){
//http://www.carview.co.jp/link/outbound.asp?orgpoint=mk%5Feditersblog%5Fmypage02&dest=http%3A%2F%2Fminkara%2Ecarview%2Eco%2Ejp%2Fuserid%2F285744%2Fblog%2F
			if(href.match(/(\?|\&)dest=http/)){
			strUrl = getRedirectUrl(href,"dest");

//https://kaitori.carview.co.jp/route.aspx?src=cv_minkara_20140501_kijinaka50040_0450_01_assess_032&dest=/service/assess/lp/032/
			}else if(href.match(/route.aspx/)){
				strUrl = "https://kaitori.carview.co.jp" + getRedirectUrl(href,"dest");
			}

//http://www.dena-ec.com/item/167425291?aff_id=ckk
		//dena==============================================================================
		}else if(href.match(/dena-ec.com.*(\?|\&)aff_id=/)){
			strUrl = setParams(href,["aff_id"],"del");

//https://www.mydocomo.com/onlineshop/products/smart_phone/SO02F.html?cid=OLS_PRD_SO02F_from_kdc_PRD_SO02F
		//docomo==============================================================================
		}else if(href.match(/mydocomo.com.*.html\?/)){
			strUrl = setParams(href,["cid"],"del");

//http://www.dominos.jp/affiliate/lsdlp.php?siteID=2xz7U9Rg3UU-EQa7KfIyfr1jMEoV07nNfw
		//dominos==============================================================================
		}else if(href.match(/dominos.jp.*(\?|\&)siteID=/)){
			strUrl = setParams(href,["siteID"],"del");

//http://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&pub=5575046443&toolid=10001&campid=5337310214&customid=&mpre=http%3A%2F%2Fwww.ebay.com%2Fitm%2FBULK-WHOLESALE-ARACHNOPHOBIA-ALUMINIUM-METAL-CASE-COVER-BUMPER-FOR-IPHONE-5-%2F111042804375%3Fpt%3DUK_MobilePhones_MobilePhonesCasesPouches%26var%3D%26hash%3Ditem19daaaba97
		//ebay===============================================================================
		}else if(href.match(/.ebay.com.*\?/)){

			if(href.match("mpre=http")){
				strUrl = getRedirectUrl(href,"mpre");

//http://rover.ebay.com/rover/1/711-53200-19255-0/1?icep_ff3=2&pub=5575128834&toolid=10001&campid=5337706690&customid=A846&icep_item=261466346649&ipn=psmain&icep_vectorid=229466&kwid=902099&mtid=824&kw=lg
			}else if(href.match(/icep_item=/)){
				strUrl = 'http://www.ebay.com/itm/' + getRedirectUrl(href,"icep_item");

//http://www.ebay.com/rpp/verabradley/vera-bradley-on-ebay/?customid=wKpbcDqpEeOGLorIgZYqDQ1xf4_s7wk3_0_0_0&pub=5574652453&afepn=5337259887&campid=5337259887&_trksid=p2050601.m1256&_ipg=192&_trkparms=%26clkid%3D2130385891313813204&afepn=5337259887
			}else{
				strUrl = setParams(href,["customid","_trksid"],"del");
			}

//http://www.gearbest.com/graphics-tablets/pp_364944.html?lkid=11042271
		//ebay===============================================================================
		}else if(href.match(/.gearbest.com.*\?/)){
			strUrl = setParams(href,["lkid"],"del");

//http://www.ksdenki.com/ec/commodity/00000000/4905524811384&vcptn=DPF-C70A%20W/
		//ks電気の不要で不明なパラメータ削除==============================================================================
		}else if(href.match(/(\?|\&)vcptn/)){
			strUrl = setParams(href,["vcptn"],"del");

//http://shopap.lenovo.com/SEUILibrary/controller/e/jpweb/LenovoPortal/ja_JP/catalog.workflow:item.detail?GroupID=460&Code=0B47190&category-id=3FB2CEB78A0F49D18148731559AF4603&hide_menu_area=yes&cid=jp:affiliate:iVOuRL&&cid=jp:615300&
//正しいhttp://shopap.lenovo.com/jp/itemdetails/0B47190/460/3FB2CEB78A0F49D18148731559AF4603
		//lenovo===============================================================================
		//code:商品ID、category-id:商品カテゴリー、GroupID:不明(460固定？)
		}else if(href.match(/https?:\/\/shopap.lenovo.com.*(\?|\&)Code=/)){
			params = createParamArray(href);	//パラメータ格納

			strUrl = "http://shopap.lenovo.com/jp/itemdetails/" + params["Code"] + "/" + params["GroupID"] + "/" + (params["category-id"]||"");

//http://lohaco.jp/product/2690832/?sc_e=a_as_vc_ps_a_kakaku
//http://lohaco.jp/lksearch/?categoryLl=&categoryL=&categoryM=&categoryS=&searchWord=%E6%8E%83%E9%99%A4%E6%A9%9F&andOr=&itemExpl=0&resultType=&resultCount=&itemSpec=&sortDir=&sc_e=l_dt_ya_se_c_pc_58000000000_458653&ioneid=SI_692255038__1&sissr=1
		//lohaco==============================================================================
		}else if(href.match(/lohaco.jp.*(\?|\&)sc_e=/)){
			strUrl = setParams(href,["sc_e","ioneid","gclid"],"del");

		//niconico
		}else if(href.match(/http:\/\/rd.nicovideo.jp\/cc/)){
			if(href.match("nicotop_seiga")){
				strUrl = "http://seiga.nicovideo.jp/seiga/" + href.replace(/.*nicotop_seiga\//,"");
			}else if(href.match("cc_video_id=")){
				strUrl = "http://www.nicovideo.jp/watch/" + getRedirectUrl(href,"cc_video_id");
			}else if(href.match("cc_article_id=")){
				strUrl = "http://ch.nicovideo.jp/article/ar" + getRedirectUrl(href,"cc_article_id");
			}


//http://www.nissen.co.jp/sho_item/regular/6400/6400_12861.asp?book=6400&cat=other003/
		//ニッセンの不要で不明なパラメータ削除==============================================================================
		}else if(href.match(/nissen.co.jp.*\?/)){
			strUrl = href.replace(/.asp.*$/,".asp");

//http://www.e-nls.com/access_prod.php?agency_id=af739546-o08&pcode=7713
		//nls===============================================================================
		}else if(href.match(/e-nls.com.*(\?|\&)agency_id/)){
			params = createParamArray(href);	//パラメータ格納
			strUrl = setParams(href,["agency_id"],"del");

//http://comic.pixiv.net/works/59?ads=tx-w59
		//pixiv=============================================================================
		}else if(href.match(/pixiv.net.*(\?|\&)ads=/)){
			strUrl = setParams(href,["ads"],"del");

//http://pt.afl.rakuten.co.jp/c/数字/_RTvrgj数字?url=http%3A%2F%2Fitem.rakuten.co.jp%2Fサイト名とか
		//楽天==============================================================================
		}else if(href.match(/rakuten.co(.jp|m)/)){

			//iasアフィ
			if(href.match(/ias.rakuten.co/)){
				getUrl("expand","GET",obj,2);
				return;
			}

//http://item.rakuten.co.jp/jet-pc/4300_15/--hybrid--http://item.rakuten.co.jp/jet-pc/4300_15/&subid=&type=10&tmpid=11045
			//楽天のリダイレクト除去
			if(strUrl.match("--hybrid--http")){
				strUrl = strUrl.replace(/.*--hybrid--http/,"http").replace(/(\?|\&)subid=.*$/,'');
			}

			//アフィリエイト除去
			if(href.match(/pt.afl.rakuten.co.*(\?|\&)url=http/)){
				strUrl = getRedirectUrl(href,"url");

			}else if(href.match(/hb.afl.rakuten.co.*(\?|\&)pc=http/)){
				strUrl = getRedirectUrl(href,"pc");
			}

//http://rd.rakuten.co.jp/a/?R2=http://ranking.rakuten.co.jp/daily/gender=female/?scid=s_kwa_dsa&lsid=000006
			if(href.match(/rd.rakuten.co.*(\?|\&)R2=http/)){
				strUrl = getRedirectUrl(href,"R2");
			}

//http://ecustom.listing.rakuten.co.jp/rms/sd/ecustom/mall?cl=FFB82E&nm=アフィサイトタイトル&bk=アフィサイトURL&hd=&aid=アフィID&sg=&g=ジャンル&v=2&p=0&s=2&sub=0&min=&max=&f=A&sw=検索ワード&nw=
			//誰かのショッピングモール
			if(strUrl.match(/(\?|\&)(\?|\&)(nm|bk|aid)=/)){
				strUrl = setParams(strUrl,["nm","bk","aid"],"del");
			}

//http://affiliate.rakuten.com/deeplink?id=xxxxxxxxxxx&mid=36342&murl=http%3A%2F%2Fwww.rakuten.com%2Fprod
			//rakuten.comのアフィリエイト(linkshare)
			if(href.match(/(\?|\&)murl=http/)){
				strUrl = getRedirectUrl(href,"murl");
			}

//http://hb.afl.rakuten.co.jp/hsc/0c7031f6.2eb3cef8.0c7031f5.c8f60840/
			if(strUrl.match(/hb.afl.rakuten.co.jp/)){
				getUrl("expand","GET",obj);
				return;
			}

//http://ecustom.listing.rakuten.co.jp/rms/sd/ecustom/mall?cl=ABA063&nm=WEBマーケティングブログ&bk=web-marketing.zako.org/&hd=web-marketing.zako.org/images/logo.gif&aid=03fec45a.d28a5cec&sg=0&sub=0&s=0&v=2&sw=ハリナックス ステープラー&f=A&nw=ノート タック GETPLUS&g=215783&min=&max=&p=1
			//おそらくパラメータのscidはトラッカーでsc2idがアフィIDと思われるのでまとめて削除
			//gはグループ？
			if(strUrl.match(/\?/)){ strUrl = setParams(strUrl,["scid","sc2id","cad","nm","bk","hd","cl","aid","iasid"],"del"); }


//http://affiliate.suruga-ya.jp/modules/af/af_jump.php?user_id=227&goods_url=http%3A%2F%2Fwww.suruga-ya.jp%2Fgame.html
		//駿河屋==============================================================================
		}else if(href.match(/suruga-ya..*(\?|\&)goods_url=http/)){
			strUrl = getRedirectUrl(href,"goods_url");

		//ツクモのトラッカー==============================================================================
		}else if(href.match(/tsukumo.co.jp.*(\?|\&)cid=/)){
			strUrl = href.replace(/(\?|\&)cid=.*$/,"");

//http://lx03.www.tsutaya.co.jp/affiliate/index.pl?aspKind=004&retUrl=http://shop.tsutaya.co.jp/game/product/4521329189819/
		//ツタヤのトラッカー==============================================================================
		}else if(href.match(/tsutaya.co.jp\/affiliate.*(\?|\&)retUrl=/)){
			strUrl = getRedirectUrl(href,"retUrl");

		//yahoo=============================================================================================
		}else if(href.match(".yahoo.")){

			//ヤフオク外部リンク除外
			if(href.match('/bouncer?')) return;


//http://rd.listing.yahoo.co.jp/o/shop/FOR=S1i43IwqjlY6D7pQe57uxmGLnstXXQo1xbvXhyeuVhgpSb9J7jjgtHs1.cDrqA--;/aclk;_ylt=A3JvdlJIaDFTX34AMlOkKdhE;_ylu=X3oDMTRkZTBza3F0BE9WTANOBFIDMQRhZGdyaWQDOTI1MTE5NDAxMwRjb3N0A29aLllOSHhLaFd2awRjcnR2aWQDMzA1NzM2NTc2NTMEZ2NsbnRpZANleHRlcm5hbC15ai1wYXJ0bmVyLWczLWFkLTAwMDA0MARvbW0DZQRzZWMDb3YtdG9wBHNwYWNlaWQDMTE1NTAxNzEyNA--?sa=l&ai=CbBULSGgxU8-OLNHB-QOe8IC4Br3T8t4EzYnri3KbnsnhUAgAEAEgiq3GGygCUOOCuL35_____wFgicvBhOwToAG7jvPZA8gBAakCobEkFGAGRT6qBCBP0PlWubvcavx2c1oHxugF_cK0CWlnZeNXj4yL7OLhyKoGAIAHrfGMJpAHAQ&sig=zOu8r1I75B6If2Q8VWzjkkTKFV4_a1yaiXW_2MQWxJ4geCFv5_y7/**http://www.yodobashi.com/ec/category/index.html%3Fword%3DHD598%26yad1%3De%26yad3%3Dhd598%26yad4%3D30573657653%26xfr%3Dyad%26utm_source%3Dyahoo%26utm_medium%3Dcpc%26utm_term%3DHD598
			//yahoo広告 スポンサードサーチ
			if(href.match(/\*\*http/)){
				strUrl = strUrl.replace(/.*\/\*\*http(.*$)/i,'http$1' );
			}

//http://rd.yahoo.co.jp/shopping/adwords/evt=71758/0bc80r6/*http://rd.yahoo.co.jp/shp/listing/ad/evt=86270/evj=0bc80r6/?http://store.shopping.yahoo.co.jp/eastnoboru/y00119.html
			//yahoo広告(ヤフオクのカレンダー追加が文字化けのため調整中。
			//アフィIDが含まれるかもわからないので一時凍結)→/ad/のURLのみに変更で様子見
			if(href.match(/\/(adwords|ad)\/.*\?http/)){
				strUrl = href.replace(/.*\/\?http/,"http");
			}

//http://ard.yahoo.co.jp/SIG=159riqdlj/M=300839622.301691697.303279450.312101179/D=jp_auc_sjp/S=2084231756:SQB/_ylt=A7dPeB51J4VTtSoAerBM2jp8/Y=jp/EXP=1401242517/L=mQR8z7dPe_IFrZpbUytdIwJHdvB8IlOFJ3UACIjt/B=OsbWALdPhAs-/J=1401235317631220/SIG=12469dh71/A=301897421/R=0/*http://8190.co.jp/rd/rd.php?aid=yau_south_140526_3
//http://ard.yahoo.co.jp/SIG=159f1c93q/M=300842054.301694579.303279426.312441763/D=jp_auc_dir/S=2084000003:YSP/Y=jp/EXP=1401243943/L=7v8Go7dPF9kFrZpbUytdIwAjdvB8IlOFLQcABB.a/B=DVX9ALdPhAs-/J=1401236743377411/SIG=11j2mllb9/A=301897373/R=0/*http://card.yahoo.co.jp/campaign/
			//yahoo広告
			if(href.match(/\/\*http/)){
				strUrl = strUrl.replace(/.*\/\*http/,"http");
			}

//http://rd.ane.yahoo.co.jp/rd?ep=Zu8M71vT9mdngAGwggXc7XSnf9kuszvHyFc5TZbjl2TngsfCpch0pxpjcag_g.93uqTr2ZyM1ZNOlxs2LxSkPO1NdV.l3tpu9e6mhYL8G9wqOKRxhOJW4xj3XQKKxQvtqyqtUJKeifRur24Svte1UnOJ_0KWk0JT8NNDyGpvrdMGYw--&a=hY1Vje8_xD5MDIo7Jw--&s=FSi8Pp49lQ--&t=DpEYQJl6yQAvrid1soQ834am&C=9&D=1&I=&RI=b819b94c4e16443476c39e842f1bc244&S=124a3ff80a84&as=1&f=1&ff=0&fq_d=1,1,1,0&fq_m=3,3,3,0&fq_w=1,1,1,0&g=4&lp=http%3a//promotionalads.yahoo.co.jp/ads/listing04/%3fo=JP1000&maf=0&mid=0&o=9&p=9&qfid=&r=0&rfm=&sfid=0&skwid=0&F=0&tlid=0&u=detail.chiebukuro.yahoo.co.jp/qa/question_detail/
			//yahoo広告 Yahoo!ディスプレイアドネットワーク（YDN）
			if(href.match(/lp=http/)){
				strUrl = getRedirectUrl(href,"lp");
			}

//http://openuser.auctions.yahoo.co.jp/jp/show/auctions?userID=出品ユーザーID&u=アフィID
			//yahooオークションのアフィトラッカーらしきもの
			if(href.match(/auctions.yahoo..*(\?|\&)u=/)){
				strUrl = setParams(href,["u"],"del");
			}

			if(strUrl.match(/rd.listing.yahoo.co.jp/)){
				strUrl = getUrl("expand","GET",obj);
				return;
			}


/*必須のため除去不可。コメントアウト
//http://navi.auctions.yahoo.co.jp/jp/config/remember?aID=185394159&.crumb=g//sIm7P2rd&.done=http://auctions.search.yahoo.co.jp/search?ei=UTF-8&p=roventa&auccat=0&tab_ex=commerce&ei=UTF-8
			//yahooのセキュリティ用のトラッカーというかリファラみたいなもの(個人情報確認のログインで必須のため除去不可)
			//.doneというパラメータはリファラ的なものと思われる
			if(href.match(/done=http/)){
				strUrl = href.replace(/\&.done=http.*$/,"");
			}
*/


//http://www.yodobashi.com/ec/category/index.html?word=HD598&yad1=e&yad3=hd598&yad4=30573657653&xfr=yad
//http://www.yodobashi.com/ec/product/100000001001705391?kad1=1&xfr=kad
		//ヨドバシ==============================================================================
		}else if(href.match(/yodobashi.com.*ad1/)){
			dataDB = ["xfr"];

			params = createParamArray(strUrl);	//パラメータ格納
			for(key in params){
				if(key.match(/^.ad\d/)){ dataDB.push(key); };
			}
			strUrl = setParams(strUrl,dataDB,"del");


//http://tracking.yourguide.co.jp/in/ya-575042/http://shopping.yourguide.co.jp/word/HD598/
		//tracking.yourguide==============================================================================
		}else if(href.match(/tracking.yourguide.co.jp.*\/http/)){
			strUrl = href.replace(/.*http/,"http");

		}else{

		}





		//同人系::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//http://www.akibain.com/afbc.php?afid=アフィリエイトID(数字)&url=d6/
//http://www.akibain.com/affiliate.php?afbid=商品ID&type=0&link=1&dir=1&afid=2
		//アキバイン========================================================================
		if(href.match(/akibain.com.*(\?|\&)afid=/)){
			strUrl = setParams(href,["afid"],"del");

//http://www.akibain.com/afb.php?afbid=商品ID&type=4&link=0&dir=1(←カテゴリ)&afid=アフィリエイトID(数字)
//正しいURLhttp://www.akibain.com/d1(←カテゴリ)/?cls=cntdtl&cid=商品ID
			if(href.match(/(\?|\&)afbid=/ && /(\?|\&)dir=/)){
				params = createParamArray(href);	//パラメータ格納
				strUrl = "http://www.akibain.com/d" + params["dir"] + "/?cls=cntdtl&cid=" + params["afbid"];
			}

//http://www.digiket.com/index/_data/AFID=dldoujin/
//http://www.digiket.com/work/show/_data/ID=ITM0099465/AFID=dldoujin/
			if(href.match(/AFID=/)){
				strUrl = href.replace(/AFID=.*\//,"");
			}


//http://www.d-drops.com/?af_cd=AF12696
		//d-drop(閉鎖→再開？)========================================================================
		}else if(href.match(/d-drops.com.*(\?|\&)af_cd=/)){
			strUrl = setParams(href,["af_cd"],"del");

//http://www.dd-style.com/index.php?ad=2041
		//dd-Style========================================================================
		}else if(href.match(/dd-style.com.*(\?|\&)ad=/)){
			strUrl = href.replace(/(\?|\&)ad=.*$/,"");

		//デジケット========================================================================
		}else if(host.match("digiket.com")){
//http://www.digiket.com/p/aflink/_data/AFID=dldoujin/?URL=http%3A%2F%2Fwww.digiket.com%2Fcommon%2Faffiliate%2F
			if(href.match(/(\?|\&)URL=http/)){
				strUrl = getRedirectUrl(href,"URL");
			}

//http://www.digiket.com/work/show/_data/ID=ITM0092020/AFID=k1040041/
			if(href.match(/\/AFID=/)){
				strUrl = href.replace(/\AFID=.*?\//,"");
			}


		//DLげっちゅ========================================================================
		}else if(href.match(/getchu.com.*af/)){
			//念のため先にアフィID消去
			if(href.match(/(\?|\&)aff=/)){
				strUrl = getRedirectUrl(href,"aff");
			}

//http://order.getchu.com/r.php?aff=001560-01-00&t=2&gcd=D0025474
//正しいURLhttp://dl.getchu.com/index.php?action=gd&gcd=D0028859
			if(href.match(/(\?|\&)gcd=/)){
				params = createParamArray(href);	//パラメータ格納
				strUrl = "http://dl.getchu.com/index.php?action=gd&gcd=" + params["gcd"];
			}

//正しいURLhttp://dl.getchu.com/index.php?action=mStatic&tno=StgPLog_NEW
//デコードURLhttp://order.getchu.com/r.php?aff=&url=http://dl.getchu.com/index.php?action=mStatic&tno=StgPLog_NEW+
//http://order.getchu.com/r.php?aff=000010-02-00&url=http%3A%2F%2Fdl.getchu.com%2Findex.php%3Faction%3DmStatic%26tno%3DStgPLog_NEW+
			//URLリダイレクトの場合
			if(href.match(/(\?|\&)url=http/)){
				strUrl = getRedirectUrl(href,"url");

				//不要な最後の+を削除
				if(strUrl.match(/\+$/)){
					strUrl = strUrl.slice(0,-1);
				}
			}

//http://image.getchu.com/api/geturl.phtml/id/769002/af/601/aftype/1/sid/851/url/soft.phtml-/?id=769002
//正しいURLhttp://www.getchu.com/soft.phtml?id=769002
			if(href.match(/\/af\// && /\/aftype\// && /\/sid\//)){
				strUrl = href.replace(/\/af\/.*?\//,"/");
				strUrl = strUrl.replace(/\/aftype\/.*?\//,"/");
				strUrl = strUrl.replace(/\/sid\/.*?\//,"/");
				
				strUrl = "http://www.getchu.com/" + strUrl.replace(/.*\/url\/(.*?)-\//i,"$1");
			}


		//Dlsite==============================================================================
		}else if(href.match(/.dlsite.com.*(\/|%2F)dlaf(\/|%2F)/)){

//正しいURL http://www.dlsite.com/maniax(←ジャンル)/work/=/product_id/RJ番号/
//http://www.dlsite.com/home/dlaf/=/aid/アフィID/url/http://www.dlsite.com/maniax/work/=/product_id/RJ番号.html/?medium=blog&program=on_sale&source=blogparts_v_ranking
//http://www.dlsite.com/maniax/work/=/product_id/RJ番号/?medium=blog&program=on_sale&source=blogparts_RankingParts&unique_op=af
			//商品ページへのジャンプクッションを削除
			if(href.match("/url/http")){
				strUrl = decURI(strUrl.replace(/.*\/url\/http/,"http")).replace(/.html.*$/,"/");

//正しいURL http://www.dlsite.com/maniax/work/=/product_id/RJ番号/
//http://www.dlsite.com/maniax/dlaf/=/link/work/aid/アフィID/id/RJ番号.html
//http://maniax.dlsite.com/dlaf/=/link/work/aid/アフィID/id/RJ番号.html
			//商品ページ
			}else if(href.match(/id\/(R|B|V)J/) ){
				strUrl=href.replace(/.html.*$/,"/").replace(/aid\/.*?\/id/,'=/product_id').replace(/\/dlaf\/=\/link/,'');

//正しいURLhttp://www.dlsite.com/maniax/circle/profile/=/maker_id/RG番号.html
//http://www.dlsite.com/maniax/dlaf/=/link/profile/aid/アフィID/maker/RG番号.html
			//出版グループ
			}else if(href.match(/maker\/(R|B)G/)){
				strUrl=href.replace(/dlaf\/.*?\/maker/,'circle/profile/=/maker_id');

//http://www.dlsite.com/home/dlaf/=/aid/アフィID/link/top.html
//http://www.dlsite.com/maniax/dlaf/=/aid/アフィID/year/2014/month/5/day/31/link/news.html
//こうするとアフィリエイト消せるhttp://www.dlsite.com/maniax/dlaf/=/year/2014/month/5/day/31/link/news.html
//dlaf/=/ありでサイトに行くとトラッカーパラメータが付いちゃうけど肝心のアフィリエイトID無いのでおそらく無害
//正しいURLhttp://www.dlsite.com/maniax/new/=/year/2014/mon/5/day/31/
			//その他
			}else if(href.match("/aid/")){
				strUrl = href.replace(/\/aid\/.*?\//,"/");
			}

			setLink(obj);
			//CSS修正
			dlsiteCSS(obj)

		//Dlsite残り===========================================================================
		}else if(host.match(/^https?:\/\/www.dlsite.com/)){
			if(href.match(/\/\?/)){
				strUrl=href.replace(/\/\?.*$/,"/");
				setLink(obj);
				dlsiteCSS(obj)
			}


		//DMM==============================================================================
		}else if(host.match(/.dmm.co(m|.jp)/)){


			if(href.match("/affi_id=")){
				strUrl = href.replace(/(.*?\/)affi_id=.*?($|\/(.*$))/,"$1$3");

//http://dlsoft.dmm.co.jp/detail/商品ID/ab=3c65Bc7XJ9//fnscar-001(アフィID)
//http://www.dmm.co.jp/netgame_s/ゲームID/danmitsu-036(アフィID)
//http://www.dmm.co.jp/digital/videoa/-/list/=/article=maker/id=動画番号/affiliate-990
			}else if(href.match(/^https?:\/\/dlsoft.dmm./) || href.match(/\/netgame_s\//)){
                strUrl = href.replace(/(.*?\/(detail|netgame_s)\/.*?\/).*/,"$1");

//http://ad.dmm.com/ad/p/r?_site=2287&_article=3472&_link=32470&_image=32512&_lurl=http://www.dmm.co.jp/mono/pcgame/-/detail/=/cid=746apc10797/?/tag=1
			}else if(href.match(/(\?|\&)_lurl=/)){
				strUrl=decURI(href.replace(/.*_lurl=/,""));

//http://www.dmm.co.jp/ppm/=/_jloff=1/123d-006
//http://www.dmm.co.jp/digital/doujin/=/_jloff=1/doujin-001
//http://www.dmm.com/rental/-/detail/=/cid=000_384/_jloff=1/
//http://www.dmm.com/digital/video/mondo/moroyama_porori/index_html/=/ch_navi=/jloff-001
			}else if(href.match(/(_jloff=|jloff-)/)){
				strUrl=href.replace(/\/(_jloff|jloff-)=.*$/i,'/');

//http://www.dmm.co.jp/dc/doujin/-/list/=/article=maker/id=商品IDらしき/アフィリエイトID
//http://www.dmm.co.jp/mono/book/-/detail/=/cid=商品IDらしき/アフィリエイトID
//http://www.dmm.co.jp/mono/book/-/detail/=/cid=商品IDらしき/sort=英文字/page=数字/アフィリエイトID
			}else if(href.match(/\/c?id=.*\//)){

				var dmmParams = href.replace(/.*\/c?id=.*?\/(.*$)/i,"$1").split("/");	//パラメータ(複数)
				var dmmAffi = "";		//アフィID

				//アフィリエイトIDかどうかURLを「/」で区切って調べる()
				for(var j=0; j < dmmParams.length; j++) {
					if(!dmmParams[j].match("=") 
					&& !dmmParams[j].match(/^#/) && !dmmParams[j].match(/^\?/)){	//ページ内ショートカットリンクなどは除外
						dmmAffi = dmmParams[j];
						if(dmmAffi != "") break;
					}
				}

				//アフィID削除
				if(dmmAffi != ""){	//「レビューを見る」などのショートカット除外

					strUrl = href.replace("/" + dmmAffi,'');

				}

//http://www.dmm.co.jp/lp/game/walkure/index02_html/=/navi=none/nijisoku-001
			}else if(href.match(/\/\=\//)){
				var tmpArray;
				strUrl = href;

				tmpArray = href.replace(/.*\/\=\//,"");
				tmpArray = tmpArray.split("/");

				if(tmpArray.length == 0) return;

				for(var dm=0;dm<tmpArray.length;dm++){
					if(!tmpArray[dm].match(/\=/)){ strUrl = strUrl.replace(tmpArray[dm],""); }
				}
				if(strUrl == href) return;

			//dmmスマホ
			}else if(host.match(/sp.dmm.co.jp/)){
//http://sp.dmm.co.jp/mono/detail/index/shop/dvd/cid/h_139doks304/momo1210-003
				if(href.match(/\/cid\//)){
					strUrl = href.replace(/(.*\/cid\/.*?\/).*/,"$1");

//http://sp.dmm.co.jp/lp/freegame/p05/nijisoku-001
				}else if(href.match(/freegame\/p/)){
					strUrl = href.replace(/(.*\/freegame\/.*?\/).*/,"$1");
				}
			}

			//http://www.dmm.co.jp/digital/videoa/アフィ名-990
			if(!href.match(/c?id=/) && strUrl.match(/-99\d/)){
				strUrl = strUrl.replace(/(.*\/)[a-zA-Z0-9]+-99\d/,'$1');
			}

            if(strUrl.match(/^(https?\:\/\/book.dmm.co.jp\/detail\/.*?)\/.*/)){
               strUrl = RegExp.$1;
            }

			//残るパラメータ削除
			strUrl = setParams(strUrl,["af","tag"],"del");

		//ぎゅっと==============================================================================
		}else if(href.match(/gyutto.com.*\/af-/)){


//gyutto.com/book/af-1299/b-61/aftype-2/(←最後のスラッシュが無いURLもあるので注意)
			if(href.match(/aftype.*\//)){
				strUrl = href.replace(/\/af-.*aftype.*?\//,"/");

//http://gyutto.com/cart/af-9256/aftype-1?action=add&id=104409&item_price_id=152819
//正しいURLhttp://gyutto.com/cart/?action=add&id=104409&item_price_id=152819
			}else if(href.match(/(\?|\&)id=/ && /(\?|\&)item_price_id/)){
				strUrl = href.replace(/af-.*\?/,"?");

//http://gyutto.com/af-9878(←アフィリエイトID)/search/search_list.php?prePage=&action=sort&genre_id=20687&mode=search&sub_category_id=16&search_item_search_id=&set_category_flag=1&stype=new
			}else if(href.match(/\/af-.*?\//) && !href.match("aftype")){
				strUrl = href.replace(/\/af-.*?\//,"/");

			}else{
				strUrl = href.replace(/\/af-.*$/,"");
			}


//http://gyut.to/category.phtml?afid=767-T&item=115684
//修正http://gyut.to/item115684
//その後飛ぶhttp://gyutto.com/i/item115684
		//ぎゅっと==============================================================================
		}else if(host.match("gyut.to")){
			if(href.match(/(\?|\&)afid=/ && /(\?|\&)item=/)){
				params = createParamArray(href);	//パラメータ格納
				strUrl = "http://gyutto.com/i/item" + params["item"];
			}


//http://www.melonbooks.com/index.php?main_page=affi_go&affi_url=http%3A%2F%2Fwww.melonbooks.com%2Findex.php%3Fmain_page%3Dindex%26age%3D1%26category%3D0&affi_id=doujin
		//メロンブックス==============================================================================
		}else if(host.match("melonbooks.com")){
			if(href.match(/(\?|\&)affi_url=/)){
				strUrl = getRedirectUrl(href,"affi_url");
			}
//http://www.melonbooks.com/index.php?main_page=product_info&products_id=IT0000159969#.U4nnw1FQJUM.twitter
			if(href.match("#.")){
				strUrl = href.replace(/#\..*$/,"");
			}

//http://market.surpara.com/go/?IID=商品ID&AFID=アフィリエイトID
//http://market.surpara.com/go/?AFID=アフィリエイトID&IID=商品ID
		//サーパラ==============================================================================
		}else if(href.match(/surpara.com.*(\?|\&)AFID/)){
			strUrl = setParams(href,["AFID"],"del");

		//その他::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		}else{
		}


		//スマホ関連(無駄かもしれないけど余分なパラメータ削除)-----------------------------------------

//http://appdriver.jp/s/smart-c/click?digest=ff3e42b83eea658736cade80fd6c0a7faaf447484fcdad0d00acf253a2a4c23d&campaign_id=17571&identifier=2w4olVtC
		//app-adforce====================================================================
		if(href.match("appdriver.jp/s/")){
			strUrl = setParams(strUrl,["identifier"],"del");

//http://spnet33.i-mobile.co.jp/ad_link.ashx?pid=26079&asid=184265&advid=837756&ctid=2&vh=9eee599e712138198a3a1ea8b5f134f6
		//アイモバイルi-mobile.co.jp=======================================================
		}else if(href.match(/^https?:\/\/spnet.*.i-mobile.*(\?|\&)pid=/)){
			getUrl("expand","GET",obj);
			return;

//http://javhighquality.blog.fc2.com/blog-entry-18139.html?sp
		}else if(href.match(/javhighquality.blog.fc2.com\/.*html\?(all|sp)/)){
			strUrl = href.replace(/\?(all|sp)/,"");

		//その他:::::::::::::::::::::::::::::::::::::::::::::::::::::
		}else{
		}


		//海外アフィサイト関連(無駄かもしれないけど余分なパラメータ削除)-----------------------------------------

//http://scripts.affiliatefuture.com/AFClick.asp?affiliateID=306800&merchantID=6286&programmeID=17357&mediaID=141595&tracking=Ebsetphotos.com&url=
//http://scripts.affiliatefuture.com/AFClick.asp?merchantID=99999999&programmeID=17357&mediaID=999999999&tracking=
		//affiliate future(海外)=================================================================
		//programmeIDは残す
		if(href.match(/affiliatefuture.com.*(\?|\&)affiliateID=/)){
			if(href.match(/(\?|&)url=http/)){
				strUrl = getRedirectUrl(href,"url");
				setLink(obj);
				return;
			}

//				strUrl = setParams(href,["merchantID","mediaID"],"99999999");
			strUrl = setParams(strUrl,["tracking"],"");
			strUrl = setParams(strUrl,["url"],"del");


//http://affiliates.jlist.com/click/4721?url=http://www.jlist.com/product/PRE3657
		//Affiliate jlist(海外系)==============================================================================
		}else if(host.match("affiliates.jlist.com")){
			if(href.match(/(\?|\&)url=http/)){
				strUrl = getRedirectUrl(href,"url");
			}

//http://www.awin1.com/cread.php?awinmid=5618&awinaffid=!!!id!!!&clickref=&p=http%3A%2F%2Fwww.okadirect.com%2Foutlet%2F 
		//Affiliate Window(海外系)==============================================================================
		}else if(host.match("awin1.com")){
			if(href.match(/(\?|\&)p=http/)){
				strUrl = getRedirectUrl(href,"p");

//https://www.awin1.com/awclick.php?mid=1074&id=176917
			}else if(href.match(/(\?|\&)id=/)){
				strUrl = setParams(href,["id"],"del");
			}

//http://affiliate.buy.com/deeplink?id= & mid = & murl =
		//buy.com(linkshare)=====================================================================
		}else if(href.match(/.buy.com.*(\?|\&)murl=http/)){
			strUrl = getRedirectUrl(href,"murl");

//http://www.cdjapan.co.jp/aff/click.cgi/PytJTGW7Lok/4759/A013611/goods%2Fgoods_detail.html?KEY=NEOGDS-106499
//正しいhttp://www.cdjapan.co.jp/product/NEOGDS-106499
		//cdJapan(海外)==========================================================================
		}else if(href.match(/www.cdjapan.co.jp\/aff\//)){
			params = createParamArray(href);	//パラメータ格納

			if(params["KEY"] != ""){
				strUrl = href.replace(/\/aff\/.*/,"/product/") + params["KEY"];
			}

//http://www.cdjapan.co.jp/cgi-bin/affclick.cgi?KEY=&to=http%3A%2F%2Fwww.cdjapan.co.jp%2Fdetailview.html&click=59cTi%2FH.dYDAsTAqe1uaTO5Pa8WB&is_neolog=0
		//cdJapan(海外)==========================================================================
		}else if(href.match(/www.cdjapan.co.jp\/cgi-bin\/affclick.cgi.*(\?|\&)to=http/)){
			strUrl = getRedirectUrl(href,"to");

//http://www.clixgalore.com/PSale.aspx?BID=33228&AfID=181601&AdID=4685&LP=www.winemakerschoice.com.au
		//clixgalore(海外系アフィ)===============================================================
		}else if(href.match(/clixgalore.com.*(\?|\&)LP=[a-zA-Z]/)){
			strUrl = getRedirectUrl(href,"LP");
			if(!strUrl.match(/^http/)){
				strUrl = "http://" + strUrl;
			}

//http://www.jdoqocy.com/click-7474779-10676026?url=http%3A%2F%2Fwww.disneystore.com%2Ftransfer%2F224510%2Ftees-tops-shirts-clothes-country-bear-jamboree-attraction-poster-tee-for-adults-limited-availability%2Fmp%
//http://www.tkqlhce.com/click-7474779-10676026?url=http%3A%2F%2Fwww.disneystore.com%2Ftransfer%2F224510%2Ftees-tops-shirts-clothes-country-bear-jamboree-attraction-poster-tee-for-adults-limited-availability%2Fmp%2F1356296%2F1000228%2F%3FCMP%3DAFL-AffLSGen%26att%3DLSGenAffl&cjsku=7505055880490M
		//Commission Junction(海外)==============================================================
		//リダイレクト後に気休め程度に修正
		}else if(href.match(/(jdoqocy.com | tkqlhce.com)/)){
			if(href.match(/(\?|\&)url=http/)){
				strUrl = getRedirectUrl(href,"url");

//http://www.jdoqocy.com/click-7474779-10676026
			}else{
				strUrl = href.replace(/\/click-.*?-/,"/click-0-");
			}

//http://cj.dotomi.com/pb115gv32L/v16/KKMNMOQJ/J/J/J/J?w=d%3C%3Cq22y%3A%2F%2F555.smxzxl7.lxv%3AH9%2Flurlt-9-AACDCEG9%3C%3CP%3Cq22y%3A%2F%2F555.smxzxl7.lxv%2F%3C
		//Commission Junction(海外)==============================================================
		}else if(href.match(/dotomi.com.*\?/)){
			if(href.match(/rurl=http/)) strUrl = getRedirectUrl(href,"rurl");
			else strUrl = href.replace(/\?.*$/,"");


//http://www.s2d6.com/x/?x=c&z=s&v=736781&t=http%3A%2F%2Fitunes.apple.com%2Fau%2Falbum%2Fborn-this-way-bonus-track%2Fid438662372%3Fuo%3D4%26partnerId%3D1002
		//DGM PRO===========================================================================
		}else if(href.match(/s2d6.com\/x\//)){
			if(href.match(/(\?|&)t=http/)){
				strUrl = getRedirectUrl(href,"t");
			}

		//esellerate(海外系)====================================================================================
		//共通に統合

//http://track.moreniche.com/hit.php?w=245362&s=256
		//MoreNiche(海外系)====================================================================================
		}else if(href.match(/track.moreniche.com.*(\?|\&)w=/)){
			strUrl = setParams(href,["w"],"del");

//http://track.omguk.com/?AID=573874&MID=519512&PID=11285&CID=4148223&CRID=62355&WID=50210
		//Online Media Group(海外)=======================================================================
		//AIDがアフィPIDがページでどちらも消せない。飛んだあとのページを修正して対応
		//CRIDは画像URLっぽい
		}else if(href.match(/track.omg(uk|2|.*).com.*WID=/)){
			strUrl = setParams(href,["MID","CID","WID"],"del");

//http://www.mydeal.com.my/travel/?a_aid=1234567891
		//Online Media Group(海外)=======================================================================
		}else if(href.match(/mydeal.com.my.*(\?|\&)a_aid=/)){
			strUrl = setParams(href,["a_aid"],"del");


//http://www.paidonresults.net/c/37645/1/876/0
		//paid on results(海外)==================================================================
		}else if(href.match(/paidonresults.net\/c\//)){
			strUrl = href.replace(/(paidonresults.net\/c\/).*?\//,"$1" + "9999999999/");

//http://secure.strawberrynet.com/cjPage.aspx?url=http%3A//us.strawberrynet.com/new-customer/
		//secure.strawberrynet?海外なのでよくわかんないけどCommission Junctionから飛んだ
		}else if(href.match(/secure.strawberrynet.com.*(\?|\&)url=http/)){
			strUrl = getRedirectUrl(href,"url");

//https://www.shareasale.com/r.cfm?u=841156&b=234786&m=27601&afftrack=&urllink=www%2Eticketfly%2Ecom%
		//shareasale(海外)=============================================================
		//urllinkの指定がないものもあったけど、修正不可能だった(パラメータuとmを自分の物に差し替えれば行けるみたい)
		//b=本来のURL、u=アフィリエイトID、m=アフィリエイトIDと紐づいている何かの数値
		}else if(href.match(/shareasale.com.*(\?|\&)urllink=/)){
			strUrl = getRedirectUrl(href,"urllink");

			if(strUrl != ""){
				if(strUrl.match(/^http/)){
//					setLink(obj);
				}else{
					strUrl = "http://" + strUrl;
				}
			}

//http://clkuk.tradedoubler.com/click?p=21874&a=2212750&g=21225632&epi=bdpcsdbpcuk2712
		//Tradedoubler(海外系)===============================================================
		}else if(host.match(/tradedoubler.com\//)){
			//pとaは必須。gがアフィっぽい
			if(href.match("g=")){
				strUrl = setParams(href,["g","epi"],"del");
			}

//http://solutions.tradedoubler.com/redirect/expedia/?td_program_id=21874&AFFCID=expe.uk.001.000.2212750.0&cuid=e61021eaf3ce284c164782552a09e100&AFFLID=&url=http%3A%2F%2Fwww.expedia.co.uk
			if(href.match(/(\?|\&)url=http/)){
				strUrl = getRedirectUrl(href,"url");
			}

//http://track.webgains.com/click.html?wgprogramid=5586&wgcampaignid=%5E%5E%5Ecampaign_id%5E%5E%5E&wgtarget=http://track.webgains.com/click.html?wgcampaignid=%5E%5E%5Ecampaign_id%5E%5E%5E&wgprogramid=5586&wgtarget=http://www.identitydirect.co.uk/my-special-christmas-adventure-big.html?mid=13064&utm_source=webgains&utm_medium=affiliate&utm_campaign=13064
		//webgains(海外)====================================================================
		}else if(href.match(/track.webgains.com.*(\?|\&)wgtarget=http/)){
			strUrl = getRedirectUrl(href,"wgtarget");

//http://ad.zanox.com/ppc/?12621111C1452709100T&ULP=http%3A%リダイレクト先
		//Zanox(海外)===============================================================
		}else if(href.match(/ad.zanox.com.*(\?|\&)ULP=http/)){
			strUrl = getRedirectUrl(href,"ULP");

//http://1006-ant.conversive.nl/in/?c_id=1006&n_id=40&l_id=0&a_id=21771&aff_id=153289&aff_x=444671%3A%3A153289%3A%3A%3A%3A%3A%3A1408947807&pu=http%3A%2F%2Fwww.bobshop.nl%2Fnl%2Fpersoonlijke-verzorging%2Fvoor-hem%2Fscheerapparaten%2Fphilips%2Frq1175-sensotouch-scheerapparaat%2Fp45611%253Fref%253Dconversive&ant_sid=MF5zMGd2NTZoZnFsbzY2NDd1ZjFmc2ZvaWlidTQyZHA1bw%3D%3D
		//Zanox(海外)===============================================================
		}else if(href.match(/ant.conversive.nl.*(\?|\&)aff_.*=/)){
			if(href.match(/(\?|&)pu=http/)){ strUrl = getRedirectUrl(href,"pu");
			}else{
				strUrl = setParams(href,["aff_id=","aff_x"],"del");
			}

//http://r.refinedads.com/bs-mapping.php?v=z1&aid=3814&oid=1031&zanpid=1916947465651987456&userid=1021583&url=http%3A%2F%2Fwww3.base.de%2Fads%3Frt%3D8%26et%3D16%26i%3D63027%26se%3Dp%26cs%3D5044%26ev%3D[MEDIACODE]%26userid%3D1021583
		//Zanox(海外)===============================================================
		}else if(href.match(/refinedads.com.*(\?|\&)url=http/)){
			strUrl = getRedirectUrl(href,"url");

		}else{

		}




		//共通トラッカー系(トラッカー専門系)---------------------------------------------------------------------

		//行動分析系::::::::::::::::::::::::::::::::::::::::::::::::

//http://www.suruga-ya.jp/database/107100001000.html?utm_source=coneco&utm_medium=CPC&utm_campaign=kakaku_new&i4c=190&i4a=5
//http://www.caravan-yu.com/shop/g/g4905524811384/?utm_source=kakaku.com&utm_medium=priceComparison&utm_campaign=kakaku.com
//http://p.tl/6bXQ?utm_content=bufferd0045
		//google ユニバーサルアナリティクス
		//utm_source,,utm_campaign,utm_medium,utm_content
		if(href.match(/(\?|\&)utm_/)){
			if(href.match(/utm_[a-z]/)){
				strUrl = href.replace(/(\?|\&)utm_.*$/,"");
			}

		}else if(host.match(/track.xmax.jp/)){
			getUrl("expand","GET",obj);
		
		}else if(href.match(/.*(\/ref\/\d+\/affiliate_banner_id\/\d+)/)){
			strUrl = href.replace(RegExp.$1,'');

		}


		//クッション::::::::::::::::::::::::::::::::::::::::::::::::::::


		//2ch==============================================================================
		if(href.match(/((www\d?\.|)(ime|nun).(nu|st)\/\??|jbbs\.shitaraba\.net\/.*\?url=|jump.2ch.net\/\?|n2ch.net\/x\?u=|pinktower.com\/|2ch.io\/|l.moapi.net\/|t.2nn.jp\/|.*\/bbs\/link\.cgi\?URL=|fast.io\/)/i)){
			strUrl=decURI(href.replace(/(h?ttps?):\/\/((www\d?\.|)(ime|nun).(nu|st)\/\??|jbbs\.shitaraba\.net\/.*\?url=|jump.2ch.net\/\?|n2ch.net\/x\?u=|(www.)?pinktower.com\/\??|2ch.io\/|.*l.moapi.net\/|t\.2nn\.jp\/|.*\/bbs\/link\.cgi\?URL=|fast.io\/)+/ig,"$1://").replace(/(h?ttps?:\/\/)+(h?ttps?)/img,"$2"));


//http://route5.org/?q=http://www.kincho.co.jp/wnew/200903/liquid_cordless/index.html
		//READ2CH
		}else if(href.match(/route5.org\/\?q=/)){
			strUrl = getRedirectUrl(href,"q");

//http://bubjs.com/http://www.4gamer.net/games/106/G010649/20140305012/
		//Rちゃんねる==============================================================================
		}else if(href.match(/bubjs.com\/http/)){
			strUrl = href.replace(/https?:\/\/bubjs.com\/http/,"http");

//http://r2jav.com/download-links/http://www.datafile.com/d/TVRVek5UWXpORGsF9/enkou55_113314.part1.rar
		}else if(href.match(/download-links\/http/)){
			strUrl = href.replace(/.*\/download-links\/http/,"http");

//http://www.sexyvideos.co/go?a%3A
		}else if(href.match(/\/(go|out)\?a(%3A|:)/)){
			getUrl("expand","GET",obj);
			return;

//http://yeng.web.fc2.com/jump.html?url=http%3A%2F%2Fdetail.chiebukuro.yahoo.co.jp%2Fqa%2Fquestion_detail%2Fq1329427188
//http://chien.sytes.net/jump.html?url=http%3A%2F%2Fdetail.chiebukuro.yahoo.co.jp%2Fqa%2Fquestion_detail%2Fq13139039453
		}else if(href.match(/\/jump.(html|php)\?url=http/)){
			strUrl = decURI(href.replace(/.*(\?|&)url=http/,"http"));
		}


		//アフィリエイト系トラッカー::::::::::::::::::::::::::::::::::::::::::::::::
		//※ショップ系独自のトラッカーなどはショップ別に追加

//http://adclr.jp/c/qojdmuij?pc_maist_buyer=2581&_cvpoint=811&_xuid=xuidx4677b0cf38x31c
		//adclr=============================================================================
		if(href.match(/adclr.jp.*\?/)){
			strUrl = href.replace(/\?.*$/,"");

//http://www.flog.jp/w.php/http://www.nicovideo.jp/watch/sm番号?top_flog&num=3
		//flog
		}else if(href.match("www.flog.jp/w.php/http")){
			strUrl = href.replace(/.*\/w.php\//,"").replace(/\?.*$/,"");

//http://www.mgstage.com/~アフィID/ppv/video/動画番号/
//http://www.mgstage.com/product/product_detail/動画番号/
//http://www.mgstage.com/ppv/video/動画番号/?aff=アフィID
//動画番号は「ローマ字-数字」形式？
		//mgstage.com
		}else if(href.match("www.mgstage.com")){
			strUrl = href.replace(/\?aff=.*/,'');
			if(href.match("/~")) strUrl = href.replace(/\~.*?\/video\//,'product/product_detail/');

//http://dms.netmng.com/si/CM/Tracking/TrackRedirect.aspx?siclientid=2520&redirecturl=http%3A%2F%2Fpt.afl.rakuten.co.jp%2Fc%2F001134ce.0fc3b133%2F_RTvrgj10000063%3Furl%3Dhttp%3A%2F%2Fitem.rakuten.co.jp%2Fdtc%2F4960999964164%2F&SICustTransType=9854&transactionamount=18&x1=2683&x2=01802080&x3=1130627295&x4=&jscript=0
//http://dms.netmng.com/si/CM/Tracking/TrackRedirect.aspx?siclientid=2520&redirecturl=http://www.amazon.co.jp/dp/B0019DPHVO/ref=asc_df_B0019DPHVO953949/?tag=coneco-ce-22&creative=9311&creativeASIN=B0019DPHVO&linkCode=asn&me=AN1VRQENFRJN5&SICustTransType=9854&transactionamount=52.6&x1=2828&x2=01109999&x3=1090909212&x4=8f001b2487cda54cc46496c3308668c1&jscript=0
		//netmng==============================================================================
		}else if(href.match(/dms.netmng.com.*(\?|&)redirecturl=http/)){
				strUrl = getRedirectUrl(href,"redirecturl");

//http://textad.net:10001/cgi-bin/redir.cgi?uid=10473&bid=2&from=video&site=http://www.2ica.net/%E6%96%99%E9%87%91/
		//textad
		}else if(href.match(/textad.net.*(\?|&)site=http/)){
			strUrl = getRedirectUrl(href,"site");

		//zigsow
		}else if(href.match(/zigsow.jp.*(\\\?|&)site=/)){
			getUrl("expand","GET",obj);
			return;

		//その他::::::::::::::::::::::::::::::::::::::::::::::::

		}else{
		}





		//最終修正(パラメータ削除系)=========================================================================
		if(strUrl.match(/\?.*=/)){
			//wapr,xadid 広告経由後にオリジナルURLの後につくらしい(trafficgate?)
			//LSID Commission Junction(海外系)の残り？
			//_xuid xaid追跡パラメータ削除
			//waad 実験的に削除
			//"banner_id","s_kwcid"onamae.comなどのパラメータ
			//"agencyid","advid"affinetのパラメータ
			strUrl = setParams(strUrl,["a_aid","a_bid","advid","affiliate_id","affiliate_type","affid","affuid","afid","AFID","agencyid",
				"_bdadid","banner_id","bannerid","dmai","fbclid","jaehuid","LSID",
				"partnerid","partnerId","s_kwcid","vos","waad","wapr","adcd","xadid","_xuid","sc_e"],"del");

			//ad_codeは広告の精度をあげるらしいので削除
			strUrl = setParams(strUrl,["ad_code","AD_CODE"],"del");

		}
			

//http://dms.netmng.com/si/cm/tracking/clickredirect.aspx?sitrackingid=565231550&siclientid=7722&siadtrackid=31891032366&sinetwork=s&simobile=&sidevice=c
//http://track.searchignite.com/si/cm/tracking/clickredirect.aspx?sitrackingid=696296406&siclientid=9992&siadtrackid=42697278684&sinetwork=s&simobile=&sidevice=c
		//パラメータsitrackingid以降除去(実験的実装)==============================================================================
		if(href.match("sitrackingid")){
			params = createParamArray(href);	//パラメータ格納
			strUrl = href.replace(/(.*sitrackingid).*$/i,'$1=') + params["sitrackingid"];
		}


//http://ad.c-ats.jp/ad/p/r?_site=67&_article=74&_link=93&_image=93
//http://ad.maist.jp/ad/p/r?_site=10165&_loc=10450&_campaign=663&_article=5777&_link=34346&_image=35521&_deliver=1
//http://ad.dmm.com/ad/p/r?_site=9999999&_article=1052&_link=転送先のURL指定用の数字&_image=不明な数字
//http://app-adforce.jp/ad/p/r?_site=9364&_article=56674&_link=1731290&_image=1731291&suid=eae08ff6d51e68e81788caa37cd7eb80435272c7aa68bf6432373904dffe967c&sad=324379238
//最小構成(_linkが必要な場合もある？)http://app-adforce.jp/ad/p/r?_article=56674&_image=1731291
		//DMM系か？_siteを消すと怒られる場合があるのでありえない大きい数字指定。_articleがURL指定=================
		//残すパラメータ："_article","_site"
		//対策されたようで存在しない数値だとエラーに。よって対応不可


		//最終修正ここまで===========================================================================

		setLink(obj);
}catch(e){
	GM_log("AKiller_mainCheck_Error:"+e);
}

		clearTimeout(obj.timer);
		objSet = obj = null;
	}//mainCheckここまで




	//==================================mainの共通ファンクション===============================================

	//URLを変更＆オリジナルURL追加
	function setLink(obj,absFlg){
try{

		//if(absFlg) obj.setAttribute("Akill_check","added_before")

		if(Object.prototype.toString.call(obj).slice(8, -1).match(/(Text|Comment)/)
		//checkedでももう一度確認する
		|| (obj.hasAttribute("Akill_check") && obj.getAttribute("Akill_check").match(/(before|Loading|killed$)/))
		|| (!absFlg && obj.innerHTML == '[Killer]')
		) return;

		//ページ遷移を消しすぎてたら復元
		if(href.match("#") && !strUrl.match("#") && !href.match(/#.*(\?|&)/)){
			strUrl = strUrl + href.replace(/.*(#.*$)/i,"$1");
		}

		//特殊文字の修正
		if(!strUrl.match(/\.css\?/)) strUrl = strUrl.replace(/amp;/gi,"");

		//何もしない
		  //ループ防止用
		if(decURI(decURI(href)) == strUrl || decURI(href) == strUrl || href == strUrl
		  //ページスクロール系は除外
		  || href.slice(-1) == "#"
		  //strUrlがおかしい数値
		  || strUrl == "" || strUrl == "http://" || href == strUrl
		){

			//これ以上修正できない場合完了フラグを立てる
			if(decURI(obj.href) == strUrl){

				var flag = '';
				if(obj.hasAttribute("Akill_check")){
					flag = obj.getAttribute("Akill_check");
				}
				if(!flag.match('_checked'))obj.setAttribute("Akill_check",flag.replace(/_checking/igm,'') + "_checked");
			}
			
			//何もしない
			return;
		}


		//"?"を消し過ぎた場合最初の&を?に戻す
		if(strUrl.match("&") && !strUrl.match(/\?/)){
			strUrl = strUrl.replace(/(.*?)&(.*=.*$)/i,"$1?$2");
		}



		//AREAタグの場合引き継ぎ必須？
		var setCoords = "";
		if(obj.hasAttribute("coords")){ setCoords = obj.getAttribute("coords") }

		//imgタグがあった場合
		var strHW = "";
		var picArray = [];
		var objPic = "";
		if(obj.innerHTML.match(/(<img |<IMG )/)){

			//solty designのAmazon Modern Rankingに対応
			//元のリンクに高さと幅の設定があった場合変数にセットして後で復元
			if(obj.hasAttribute("style")){
				if(obj.getAttribute("style").match("height:")){	
					strHW = "height:" + obj.getAttribute("style").replace(/.*height:(.*?)\;.*$/i,"$1") + ";"
				}
				if(obj.getAttribute("style").match("width:")){	
					strHW += "width:" + obj.getAttribute("style").replace(/.*width:(.*?)\;.*$/i,"$1") + ";"
				}
			}

			//noscriptタグ内にimgタグがあった場合このままだと何故かtextとして追加されるのでオブジェクトとしてimgを追加しなおす
			if(obj.innerHTML.match(/<noscript/)){

				var beforeNoscript = obj.getElementsByTagName("noscript")[0];
				var objImg = beforeNoscript.getElementsByTagName("img");
				if(beforeNoscript && objImg && objImg.length > 0){
					for(var ii = 0;ii < objImg.length;ii++){
						objPic = document.createElement("img");
						objPic.src = objImg[ii].getAttribute("src");
						objPic.alt = objImg[ii].getAttribute("alt");
						objPic.style = objImg[ii].getAttribute("style");
						picArray.push(objPic);
						beforeNoscript.removeChild(objImg[ii]);	//削除後、後でobjPicを追加
					}
				}
				beforeNoscript = objImg = null;

			}

			//画像遅延ロードを無効化
			var imgTmp = obj.getElementsByTagName("img");
			if(imgTmp){
				var typeSrc = ["data-original","data-src"];
				typeSrc.forEach(function(srcName){
					for(var imm=0;imm < imgTmp.length;imm++){
						if(imgTmp[imm].hasAttribute(srcName))imgTmp[imm].src = imgTmp[imm].getAttribute(srcName);
					}
				});
			}

		}

		//修正したリンク内に元のタグ内の要素を残す(imgなど)
		var strTxt = obj.innerHTML;


		//元のリンクの後に修正したリンクを追加
		var domLink = document.createElement(obj.tagName);
		domLink.href = strUrl;
		domLink.rel = "noreferrer";
		domLink.innerHTML = strTxt;

		//属性の継承
		var attr = obj.attributes;
		var attrCheck = ["^class$","^style$","^id$","^data-","^target$"];

		for(var at = 0;at < attr.length;at++){
			attrCheck.forEach(function(attrData){
				var regAttr = new RegExp(attrData,"i");
				if(attr[at].name.match(regAttr)) domLink.setAttribute(attr[at].name, attr[at].value);
			});

		}

		if(setCoords != ""){
			domLink.setAttribute("coords",setCoords);
			//AREAタグの場合、修正したリンクが最初の子ノードじゃないといけない
			obj.parentNode.insertBefore(domLink, obj);
		}else if(obj.nextSibling) obj.parentNode.insertBefore(domLink, obj.nextSibling);
		else obj.parentNode.appendChild(domLink);

/*
		//旧設定(noscriptタグ内だと要素ではなく文章になるので廃止予定の様子見)
		var setTxt = '<' + obj.tagName
			+ ' coords="' + setCoords + '"'
			+ ' href="' + strUrl + '"' 
			+ ' rel="noreferrer"'
			+ '>' + strTxt + '</' + obj.tagName + '>';
		obj.insertAdjacentHTML('afterend', setTxt); 
*/

		//元のリンクがaタグじゃなかった場合、aタグにしてノード修正
		if(!obj.tagName.match(/^a$/i)){
			var oldNode = obj;

			var newNode = document.createElement('a');
			newNode.href = oldNode.href;
			newNode.innerHTML = oldNode.innerHTML;

			oldNode.parentNode.replaceChild( newNode, oldNode );
			newNode = null;
		}

		//ヤフオクはクラス名削除
		if(location.host.match(/auctions.search.yahoo.co.jp/)) obj.removeAttribute("class");

		var beforeCheck = obj.getAttribute("Akill_check");

		//修正直前に修正済みという判定用フラグ追加
		if(!obj.hasAttribute("Akill_check")){
			obj.setAttribute("Akill_check","original_killed");	//最初のリンク
		}else{
			obj.setAttribute("Akill_check","killed");
		}
		//(※※注意！！！！！この間に処理を挟まない！！！！※※※)
		obj.innerHTML = '[Killer]';
		//(※※注意！！！！！この間に処理を挟まない！！！！※※※)
		//修正直後に追加済みという判定用フラグ追加
  		domLink.setAttribute("Akill_check","added_checking");
//		if(beforeCheck && beforeCheck.match(/added_before/)) domLink.setAttribute("Akill_check",beforeCheck);
//		else domLink.setAttribute("Akill_check","added_checking");

  
		//google image
		if(location.host.match(/google\./) && location.href.match(/tbm=isch/) && obj.hasAttribute("jsaction")){
			domLink.setAttribute("jsaction","str.hc;mousedown:str.hmd;mouseover:str.hmov;mouseout:str.hmou")
		}



		//AREAタグまたは要素内にimgタグがあった場合
		if(setCoords != ""
		  || domLink.innerHTML.match(/(<img |<IMG )/)){

			//元のリンクにCSS付加
			obj.setAttribute("style", strStyle + 'position:absolute;');

			//元のリンクにstyleで高さと幅の指定があった場合は上書き
			if(strHW != "") domLink.setAttribute("style", strHW);

			//noscriptタグ内にimgタグがあった場合の後処理
			if(objPic){
				var afterNoscript = domLink.getElementsByTagName("noscript")[0];
				for(var pp=0;pp < picArray.length;pp++){
					afterNoscript.appendChild(picArray[pp]);
				}
				afterNoscript = null;
			}

		//それ以外
		}else{
			//元のリンクにCSS付加
			obj.setAttribute("style", strStyle + 'position:relative;');
		}

		var chk = '';
		if(domLink.hasAttribute("Akill_check")) chk = domLink.getAttribute("Akill_check");


		if(chk && !chk.match(/(_checked|killed|before)$/)) multi(domLink);


}catch(e){
//	throw(e);
	GM_log("AKiller_setLink:" + e);
}
//		throw new Error();

		obj = objPic = domLink = null;

	}//setLinkここまで


	//Dlsiteのリンク修正用CSS
	function dlsiteCSS(obj){
		if(href != strUrl){

			//CSS付加
			obj.setAttribute("style", 'height:auto;width:auto;float:left;position:absolute;z-index:' + zIndex + ';background:rgba(255,0,0,0.2);margin:0!important;padding:0!important;');
			//画像埋め込みタイプ以外にCSS付加
			if(!obj.nextSibling.innerHTML.match("src=")){
				obj.nextSibling.setAttribute("style", "margin-left:55px;");
			}
		}
		obj = null;
	}




	//===============================================================================================

	//パラメータ削除
	function setParams(url,name,flag){
	try{
		if(!name || name.length == 0 && !url.match(/\?/)){ return url; }

		var tmpUrl = url;

		for(var k=0; k < name.length; k++){
			var params = createParamArray(tmpUrl);	//パラメータ格納

			if(!(name[k] in params)){ continue; }

			var tmpReg;

			//全部削除("?param=data" > "")
			if(flag == "del"){
				tmpReg = new RegExp("(\\?|&)" + name[k] + "=" + params[name[k]],'g');
				tmpUrl = tmpUrl.replace(tmpReg,"");

			//パラメータの数値変更((?param=999999))。""指定で数値だけ削除(?param=)
			}else{
				tmpReg = new RegExp(name[k] + "=" + params[name[k]]);
				tmpUrl = tmpUrl.replace(tmpReg,name[k] + "=" + flag);
			}

			//"?"を消し過ぎた場合最初の&を?に戻す
			if(tmpUrl.match("&") && !tmpUrl.match(/\?/)){
				tmpUrl = tmpUrl.replace(/(.*?)&(.*=.*$)/i,"$1?$2");
			}

		}//for文ここまで

		return tmpUrl;

	}catch(e){
		GM_log("AKiller_setParams:"+url + e);
		return tmpUrl;
	}
	}


	//Googleトラッカー除去==================================================================

	function remTrack(node){

		if(Object.prototype.toString.call(node).slice(8, -1).match(/(Text|Comment)/)
		|| ( !location.href.match(/^https\:\/\/www\.google\..*?\/search\?.*/) && !location.href.match(/^https?:\/\/shopping.yahoo.*/) )
		) return;

	try{
		if(Object.prototype.toString.call(node).slice(8, -1) != "HTMLDocument" && node.hasAttribute('onmousedown')){
			node.removeAttribute('onmousedown'); return;
		}



		var resultLinks = document.evaluate('.//a[@onmousedown]', node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

		for (var l = 0; l < resultLinks.snapshotLength; l++){
			var oldLink = resultLinks.snapshotItem(l);	//検索結果のURL(Original URL)

			if (oldLink.hasAttribute('onmousedown')) {
				oldLink.removeAttribute('onmousedown');
			}
		}

	}catch(e){
		GM_log("AKiller_remTrack_Error:" + e);
	}
		node = null;
	}


	//url取得
	function getUrl(pattern,type,obj,skip){

		var chkFlg = '';
		if(obj.hasAttribute("Akill_check")) chkFlg = obj.getAttribute("Akill_check");
		if(chkFlg.match(/(Loading|killed|^Done)/)) return;

		var url = obj.href;

		if(obj.hasAttribute('Akill_URL') && obj.getAttribute('Akill_URL').match(/^http/)){
			url = obj.getAttribute('Akill_URL');
		}

		//GM_xmlhttpRequestが非同期のため、その対応
		if(!expDB[url] && !url.match(/(getlinkinfo.com|araishi.com)/)){ 
			expDB[url] = ['',isToday()]

		}else if(expDB[url] && !url.match(/http.*http/)){

			checkTimer(obj,url);
			obj = null;
			return;
		}

		if(pattern == "expand" && !url.match(/(getlinkinfo.com|araishi.com|x-1.jp|^https?:\/\/bit\.ly.*\+$)/)){
			if(!skip || skip == 2) url = getinfoURL + encodeURIComponent(url);
			else if(skip == 3) url = araishiURL + encodeURIComponent(url);
			else if(skip == 5) url = x1URL + encodeURIComponent(url);
		}

		obj.setAttribute("Akill_check","Loading");//スタートフラグセット

		//url修正ここまで---------------------------------------

		GM_xmlhttpRequest({
			method: type,
			url: url,
			onload: function (res) {

				var resTxt = res.responseText;
				var expWEB = "";

				if(type == "GET"){
					if(pattern == "expand"){
						var tmp,startUrl,finalUrl,beforeUrl,redirectNum;
						beforeUrl = '';

						//最初のURL展開
						if(url.match(/getlinkinfo.com/)){
if(obj.getAttribute("AKill_ExpWEB") == "araishi"){
return;
}

							resTxt = resTxt.replace(/[\r\n]/mg," ").replace(/.*(link-redirections.*?\<\/dd\>).*/i,'$1');

							expWEB = "getlink";
							startUrl = decURI(url.replace(getinfoURL,""));
							var strGet = '<li><a href="(http.*?)"';
							var regGetAll = new RegExp(strGet,"g");
							var regGet = new RegExp(strGet,"i");
							tmp = resTxt.match(regGetAll);	//リダイレクト経路すべてのURL配列

							if(tmp){
								redirectNum = tmp.length;
								finalUrl = tmp[redirectNum-1].replace(regGet,"$1");	//最後の要素

								//リダイレクト最後の直前のURLを保存する
								if(redirectNum > 1){
									for(var gli=1;gli < tmp.length - 1;gli++){
										beforeUrl += '|||||' + tmp[gli].replace(regGet,"$1");
									};

									obj.setAttribute("akill_BeforeURL", beforeUrl);
								}

							//何らかの原因でリダイレクト先に行けなかった場合
							}else{ finalUrl = url;}

						//次の展開がミスった場合
						}else if(url.match(/araishi.com/)){
							expWEB = "araishi";
							startUrl = decURI(url.replace(araishiURL,""));
							var strAraishi = '<td>(http.*?)<\/td>';
							var regAraishiAll = new RegExp(strAraishi,"g");
							var regAraishi = new RegExp(strAraishi,"i");
							tmp = resTxt.match(regAraishiAll);

							if(tmp){
								redirectNum = tmp.length;
								finalUrl = tmp[redirectNum-1].replace(regAraishi,"$1");	//最後の要素

								if(redirectNum > 1){
									for(var ara=0;ara < tmp.length - 1;ara++){
										beforeUrl += '|||||' + tmp[ara].replace(regAraishi,"$1");
									};
									obj.setAttribute("akill_BeforeURL", beforeUrl);
								}
							//何らかの原因でリダイレクト先に行けなかった場合
							}else{ finalUrl = url;}


						//次の展開がミスった場合
						}else if(url.match(/^http:\/\/x-1.jp\//)){

							expWEB = "x1.jp";
							startUrl = decURI(url.replace(x1URL,""));
							var strx1 = '<tr><th>経路\\d<\/th><td>(http.*?)<\/td><\/tr>';
							var regx1All = new RegExp(strx1,"g");
							var regx1 = new RegExp(strx1,"i");
							tmp = resTxt.match(regx1All);

							if(tmp){
								redirectNum = tmp.length;
								finalUrl = tmp[redirectNum-1].replace(regx1,"$1");	//最後の要素

								if(redirectNum > 1){
									for(var x1j=1;x1j < tmp.length - 1;x1j++){
										beforeUrl += '|||||' + tmp[x1j].replace(regx1,"$1");
									};
									obj.setAttribute("akill_BeforeURL", beforeUrl);
								}
							//何らかの原因でリダイレクト先に行けなかった場合
							}else{ finalUrl = url;}

						//bit.lyの展開
						}else if(url.match(/^https?:\/\/bit.ly.*\+$/)){
							expWEB = "bit.ly";
							var info = resTxt.match(/var info = ({.*?})\;/);
							if(!info){obj = null;return;}
							info = JSON.parse(info[1]);	//連想配列
							startUrl = url.slice(0,-1);
							finalUrl = info["long_url"];

						//すべての展開がミスった
						}else{
							expWEB = "error";
							GM_log("AKiller_expand_ALLError")
							obj = null;
							return;
						}

						obj.setAttribute("AKill_ExpWEB",expWEB);	//最後に展開に使用したサービス

						//何らかの原因でリダイレクト先に行けなかった場合
						var regTmp;
						if(finalUrl) regTmp = new RegExp(finalUrl + "$");
						if(!finalUrl || finalUrl && (url.match(regTmp) || url == finalUrl || decURI(startUrl) == finalUrl)){

							if(url.match(/getlinkinfo.com/)){
								obj.setAttribute('Akill_URL',araishiURL + encodeURIComponent(startUrl));
							}else if(url.match(/araishi.com/)){
								obj.setAttribute('Akill_URL',x1URL + encodeURIComponent(startUrl));
							}else if(url.match(/^http:\/\/x-1.jp/)){
								//何故かbit.lyだけ展開できない場合があるのでbit.lyの公式展開サービス利用
								if(url.match(/bit.ly/)){
									obj.setAttribute('Akill_URL',decURI(startUrl) + "+");
								}else{

									obj.setAttribute('akill_check',"_checked");
									obj.setAttribute('AKill_ExpWEB',"リダイレクト解除失敗");
									return;
								}
							}else return;

							obj.setAttribute("Akill_check","");//スタートフラグセット

							getUrl("expand","GET",obj);
							return;
						}

						//展開ミス
						var txtTmp = '^(' + getinfoURL + '|' + araishiURL + '|' + x1URL + ')';
						txtTmp = txtTmp.replace(/\?/g,'\\?');

						regTmp = new RegExp(txtTmp);

						if(finalUrl.match(regTmp)) return;
						if(finalUrl.match("x-1.jp")) return;

						//展開成功
						obj.setAttribute('Akill_URL',finalUrl);
						obj.setAttribute('Akill_check','Done');

						if(beforeUrl && !beforeUrl.match(/^\|\|\|\|\|/)) beforeUrl = "|||||" + beforeUrl;

						setDB(startUrl,finalUrl + beforeUrl);
						multi(obj);
						checkTimer(obj,startUrl);
						obj = null;
						return;
					}


					//短縮linkis
					if(pattern == "linkis"){

						var regLinkis = new RegExp('longUrl: "(http.*?)"');
						var setUrl = resTxt.match(regLinkis);
						if(setUrl) setUrl = setUrl[1];
						else{ GM_log("AKill_linkis_Error"); obj = null;return;}

						obj.setAttribute('Akill_URL',setUrl);
						obj.setAttribute('Akill_check','Done');
						var tmpUrl = url.replace(/\/ln.is\//,"/linkis.com/");

						setDB(tmpUrl,setUrl);
						multi(obj);
						obj = null;
						return;
					}



					//bloglovin埋め込み用
					if(obj.innerHTML.match("killer")){ obj = null;return; }	//ループ防止

//サンプル<iframe frameborder="0" src="http://url/" class="bl-viewer">
					var strOrigin = resTxt.match(/<iframe frameborder="0" src="(.*?)" class="bl-viewer">/)[1];

					obj.insertAdjacentHTML('afterend', '<a' + ' Akill_check=added href="' + strOrigin + '" rel="noreferrer">' + obj.innerHTML + '</a>');
					obj.innerHTML = "[killer]";
					obj.setAttribute("style",strStyle);

					setDB(url,strOrigin);

					//一個前のURLが重複修正してたら不要な要素削除
					if(obj.parentNode.firstChild.getAttribute("Akill_check") == "killed"){
						obj.parentNode.removeChild(obj);
					}else{
						obj.setAttribute("Akill_check","killed");
					}

				}else if(type == "HEAD"){
				}

				obj = null;
				res = null;
			}
		});
	}





	//短縮URLの重複分
	function checkTimer(obj,url,num){
		if(!num) num = 1;
		if(num>15){
			obj.setAttribute("Akill_check","chkTimeout");//フラグセット
//			expDB[url] = null;
			return;
		}

		var timer = 1000 * (num - 1);

		setTimeout( function() {
try{
			if(getExpDB(obj,url,num)) main("expand",obj);
			obj = null;
			return;

}catch(e){
	GM_log("AKiller_checkTimer_Error:"+e)
}
		}, timer );
	}


	//DBに登録とsetvalue
	function setDB(url,data){
		if(!expDB[url]) expDB[url] = [];
		expDB[url][0] = data;
		expDB[url][1] = isToday();

		GM_setValue("expDB",JSON.stringify(expDB));
	}


	//展開済URLをDBから取得
	function getExpDB(obj,url,num){
try{
		var tmpUrl = expDB[url];
		if(tmpUrl)tmpUrl = tmpUrl[0];

		if(!tmpUrl || tmpUrl == ""){
			if(num){
				num++;
				checkTimer(obj,url,num);
			}
			return false;
		}

		var urlArray,tmpBeforeUrl;


		//複数の要素
		if(tmpUrl.match(/\|\|\|\|\|/)){
			urlArray = tmpUrl.split("|||||");

			if(urlArray.length > 1){
				tmpBeforeUrl = tmpUrl.replace(urlArray[0] + '|||||','');
			}
			tmpUrl = urlArray[0];

			obj.setAttribute("akill_BeforeURL",tmpBeforeUrl)
		}

		obj.setAttribute('Akill_URL',tmpUrl);
		obj.setAttribute('Akill_check','Done');
		//multi(obj);

		return true;

}catch(e){
	GM_log("AKiller_getExpDB_Error:"+e);

	return false;
}
	}


	//DBクリア
	function clearDB(){
		if(GM_getValue("expDB")) expDB = JSON.parse(GM_getValue("expDB"));
		else return;

		var today = isToday()

		for(var key in expDB){
try{
			var accessDay = expDB[key][1];
			if(getDiff(today,accessDay) < clearInterval) continue;
}catch(e){}

			delete expDB[key];

			GM_setValue("expDB",JSON.stringify(expDB));
		}

	}
	function isToday(){

		var date = new Date();
		var year = date.getFullYear().toString();
		var month = (date.getMonth() + 1).toString();
		if(month < 10) month = "0" + month;
		var day = date.getDate().toString();
		if(day < 10) day = "0" + day;

		return year + '-' + month + '-' + day;
	}
	function getDiff(today, lastday) {
		var newDay = new Date(today);
		var oldDay = new Date(lastday);

		var mSec = newDay.getTime() - oldDay.getTime();		//ミリ秒計算
		var diff = Math.floor(mSec / (1000 * 60 * 60 *24));	//日付に戻す
		return diff;
	}

	//クッキー削除
	function removeCookie(){
		if(!document.cookie || document.cookie.length <= 0){
			GM_log("AKiller_httponly? Can't get Cookie.");
			return;
		}


		//どうせcookie仕込まれるので有効期限切れで消すようにはせず、値を空文字に変更する
		for(var site in nameDB){
			for(var cookieName in nameDB[site]){
				if(!getCookie(site,cookieName)) continue;

				if(Object.keys(cookieDB).length > 0 && cookieName in cookieDB){
					setCookie(site,cookieName);
				}
			}
		}
	}

	//クッキーの値を取得
	function getCookie(site,cookieName){
		var tmpUrl = "";
		if(nameDB[site][cookieName]["domain"] != ""){ tmpUrl = nameDB[site][cookieName]["domain"];
		}else{ tmpUrl = nameDB[site][cookieName]["host"]; }

		if(!location.href.match(tmpUrl)) return false;

		var tmpDB = {};
		tmpDB = document.cookie.split("; ");

		for(var key in tmpDB){
			var name = tmpDB[key].replace(/(.*?)=.*$/i,"$1");	//クッキー名
			var data = tmpDB[key].replace(/.*?=(.*$)/i,"$1");	//クッキー値
			cookieDB[name] = data;
		}
		return true;
	}

	//クッキーの値をセット
	function setCookie(site,cookieName){
		if(!document.cookie || document.cookie.length <= 0){ return; }
		var domain="",host="",data="";

		if(nameDB[site][cookieName]["domain"] != ""){
			domain = " domain=" + nameDB[site][cookieName]["domain"] + ";";
			if(!location.href.match(nameDB[site][cookieName]["domain"])){ return; }
		}else{
			host = " host=" + nameDB[site][cookieName]["host"] + ";";
			if(!location.href.match(nameDB[site][cookieName]["host"])){ return; }
		}

		document.cookie = cookieName + "=" + data + ";" + domain + host + " path=" + nameDB[site][cookieName]["path"] + ";";

	}

	//クッキー情報DB作成
	function makeDB(site,cookieName,domain,host,path){
		var check = domain || host;
		if(!location.host.match(check)) return;

		if(!nameDB[site]){ nameDB[site] = {}; }
		if(!nameDB[site][cookieName]){ nameDB[site][cookieName] = {}; }
		nameDB[site][cookieName]["domain"] = domain;
		nameDB[site][cookieName]["host"] = host;
		nameDB[site][cookieName]["path"] = path;

	}



	//URLデコード
	function decURI(str){

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
				GM_log("AKiller_URL-DECODE:" + e);
			}
		}else{
			return str;
		}

	//throw new Error();
	}

	//キー入力で要素非表示
	function keydownHide(){

		//post messageでiframeにまたがる要素にも対応-----------------------------------------

		//メッセージ送信
		function sendMessage(msg){
			var target;

			//親window
			if(window==parent){
				target = window.frames;
				//複数のiframeに送信
				for(var m=0; m < target.length; m++){
					target[m].postMessage(msg,"*");
				}
			//iframe内
			}else{
				target = (parent.postMessage ? parent : (parent.document.postMessage ? parent.document : undefined));
				target.postMessage(msg,"*");
			}
		}

		//メッセージ受信
		function receiveMessage(e){
//alert(e.origin);
//alert(e.data);

try{
			if(e.data.match(/^show_added/)){
				document.body.setAttribute("ToT_hide","show_added");
			}else if(e.data.match(/^show_ALL/)){
				document.body.setAttribute("ToT_hide","show_ALL");
			}else if(e.data.match(/^show_before$/)){
				document.body.setAttribute("ToT_hide","show_before");
			}else if(e.data.match(/^ak_show$/)){
				document.body.setAttribute("ToT_hide",false);
			}

}catch(e){
}
		}
		window.addEventListener('message', receiveMessage, false);
		//post messageここまで-----------------------------------------------------


		//キー入力で要素非表示----------------------------------------------------
		var keyCheck = [];

		window.addEventListener("keydown",keyDown,false);
		window.addEventListener("keyup",keyUp,false);



		function keyDown(evt){
			if (evt){
				var kc = evt.key;
			}

			if(kc != "Shift" && kc != "Control" && kc != "Alt"){ return; } //ログ解析で、入力内容を漏洩しないように除外


			switch(kc){
				case "Shift"://shift
					keyCheck[16] = true;
					break;
				case "Control"://ctrl
					keyCheck[17] = true;
					break;
				case "Alt"://alt
					keyCheck[18] = true;
					break;
				default:
					break;
			}

			actionKey();
		};

		function keyUp(evt){
            var kc;
			if (evt){
				kc = evt.key;
			}else{
				kc = event.key;
			}

			if(kc != "Shift" && kc != "Control" && kc != "Alt"){ return; } //ログ解析で、入力内容を漏洩しないように除外


			switch(kc){
				case "Shift"://shift
					keyCheck[16] = false;
					if(!keyCheck[18]){document.body.setAttribute("ToT_hide",false);}
					sendMessage('ak_show');
					break;
				case "Control"://ctrl
					keyCheck[17] = false;
					document.body.setAttribute("ToT_hide",false);
					sendMessage('ak_show');
					break;
				case "Alt"://alt
					keyCheck[18] = false;
					if(!keyCheck[16]){document.body.setAttribute("ToT_hide",false);}
					sendMessage('ak_show');
					break;
				default:
					break;
			}

			actionKey();

		};//キー入力で要素非表示ここまで----------------------------------------------------

		function actionKey(){
			//CTRL ALT show beforeURL & addedURL & added_before
			if(keyCheck[17] && keyCheck[18]){
				//GM_log("AKiller_ctrl+alt同時押し");
				document.body.setAttribute("ToT_hide","show_before");
				sendMessage('show_before');
			}

			//SHIFT CTRL show only addedURL
			if(keyCheck[16] && keyCheck[17]){
				//GM_log("AKiller_shift+ctrl同時押し");
				document.body.setAttribute("ToT_hide","show_added");
				sendMessage('show_added');
			}

			//CTRL ALT SHIFT show only beforeURL & addedURL
			if(keyCheck[16] && keyCheck[17] && keyCheck[18]){
				//GM_log("AKiller_shift+ctrl+alt同時押し");
				document.body.setAttribute("ToT_hide","show_ALL");
				sendMessage('show_ALL');
			}
		}

		//追加した監視の削除
		var onEventUnloadKey = function(){
			window.removeEventListener('message', receiveMessage, false);
			window.removeEventListener("keydown",keyDown,false);
			window.removeEventListener("keyup",keyUp,false);

			window.removeEventListener("beforeunload", onEventUnloadKey,false);
		};
		window.addEventListener('beforeunload',onEventUnloadKey, false);
	}

//======================================================================================


	function userCfg(name){
		//ユーザ設定から読み込み(Load user's settings)
		var strText = GM_getValue(name);

		if(strText == "hide"){
			GM_registerMenuCommand("show all [killer] -now hide all-", showCfg);

		}else if(strText == "show"){
			GM_registerMenuCommand("show a [killer] only original -now show all-", oneCfg);

	//	}else if(strText == "one"){
		}else{
			GM_registerMenuCommand("hide all [killer](It's troubled,when correction mistook.) -now only one-", hideCfg);

			if(strText != "one"){
				strText = "one";
				GM_setValue( name, strText);
	//延々とリロードする場合があるので無効
	//			window.document.location.reload();
			}
		}
		return strText;
	}
	function showCfg(){
		GM_setValue( "hideOriginLink", "show");
		window.document.location.reload();
	}
	function hideCfg(){
		GM_setValue( "hideOriginLink", "hide");
		window.document.location.reload();
	}
	function oneCfg(){
		GM_setValue( "hideOriginLink", "one");
		window.document.location.reload();
	}

	//パラメータ取得
	function createParamArray(url){
	try{
		var params = {};

		var tmp = url.replace(/.*?\?/,"");
		var tmpAry = tmp.replace("?","&").split("&");

		for(var prm=0;prm<tmpAry.length;prm++){
			if(!tmpAry[prm].match("=")){  continue; }

	//		params[tmpAry[prm].split("=")[0]] = tmpAry[prm].split("=")[1];
			params[tmpAry[prm].split("=")[0]] = tmpAry[prm].replace(/.*?=/,"");
		}
		return params;

	}catch(e){
		GM_log("AKiller_Error_createParamArray:"+e);
	}

	}

	function getRedirectUrl(url, paramName){
	try{
	    var params = createParamArray(url);
	    var redirectUrl = decURI(params[paramName]);
	    return redirectUrl;
	}catch(e){
		GM_log("AKiller_Error_getRedirectUrl:"+e);
	}
	}


	/*****************************css追加*************************
	要素説明(akill_check)
	<a>tag
	added:追加したURL。複数リダイレクトじゃない
	added_before:追加したURL。複数リダイレクトされてきた場合
	before:複数リダイレクトの最後から一個前のURL(デフォルトは非表示)
	killed:修正前の元のURL

	<body>tag
	show_added:CTRL SHIFT @show added & added_before  @hide before & killed
	show_before:CTRL ALT @show before & added & added_before@hide killed
	show_ALL:全部押し @show ALL
	***************************************************************/
	var cssTxt,cssCommon;

	cssCommon = 'A[akill_check*="killed"]{ color:rgb(26,13,171)!important; text-shadow:1px 1px 0 rgb(255,255,255);}'
		+ 'A[akill_check*="killed"]:hover{ color: rgba(26,13,171,0.3)!important; text-shadow:1px 1px 0 rgba(255,255,255,0.5)!important; }'
		;//ここまで


	//killer全部表示
	if(hideOriginLinkFlg == "show"){
			//非表示
		cssTxt = 'BODY[ToT_hide="show_added"] A[akill_check*="killed"],'
			+ 'BODY[ToT_hide="show_before"] A[akill_check*="killed"]{ display:none!important; visibility:hidden!important; }'
			//表示
			+ 'BODY[ToT_hide="show_before"] A[akill_check*="before"],'
			+ 'BODY[ToT_hide="show_ALL"] A[akill_check*="before"]{ display:inline!important; visibility:visible!important; }'
			;//ここまで
	//全部消す
	}else if(hideOriginLinkFlg == "hide"){
			//非表示
		cssTxt = 'A[akill_check*="killed"]{ display:none!important; visibility:hidden!important; }'
			//表示
			+ 'BODY[ToT_hide="show_before"] A[akill_check*="before"],'
			+ 'BODY[ToT_hide="show_added"] A[akill_check*="killed"],'
			+ 'BODY[ToT_hide="show_ALL"] A[akill_check*="killed"],'
			+ 'BODY[ToT_hide="show_ALL"] A[akill_check*="before"]{ display:inline!important; visibility:visible!important; }'
			;//ここまで

	//[kill]を最初だけ表示する設定の場合
	}else if(hideOriginLinkFlg == "one"){
			//非表示
		cssTxt = 'BODY[ToT_hide="show_added"] A[akill_check*="killed"],'
			+ 'BODY[ToT_hide="show_before"] A[akill_check*="killed"]{ display:none!important; visibility:hidden!important; }'
			//表示
			+ 'BODY[ToT_hide="show_before"] A[akill_check*="before"],'
			+ 'BODY[ToT_hide="show_ALL"] A[akill_check*="before"]{ display:inline!important; visibility:visible!important; }'
			;//ここまで
	}

	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = cssCommon + cssTxt;


	//headerに追加------------------------------------------------
	function addHeader(obj) {
try{
		var head = document.head  ;

		head.appendChild(obj);

}catch(e){
    GM_log("affiliatekiller ヘッダ:"+e);
    //alert("affiliatekiller ヘッダ:"+e);
}
	}
	addHeader(style);




//==============================================================
//GreaseForkがrequireの審査必要なのでいっそのこと埋め込みました。
//require (c)http://www.drk7.jp/pub/js/ecl_test/ecl_new.js
//==============================================================
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

	//要素の変更監視
	var watcher = {
	status: false,	//監視状態
	start: function(){
		if(watcher.status) return;
		else watcher.status = true;

		watcher.observer.observe(watcher.target, watcher.config);

        //タブフォーカスが外れたら停止
        var onBlur;
        window.addEventListener("blur",onBlur = function(){
            window.removeEventListener("blur", onBlur,false);
            watcher.rest();
        });

		//5分以上は監視停止し、mousemoveなど操作すると監視再開
		watcher.timer = setTimeout(function(){ watcher.rest(); },(5 * 60000));
	},
	init: function(){
		main("first",document);

		watcher.observer = new MutationObserver(function(mutations){

		    mutations.forEach(function(mutation) {
	try{

			//共通
			var target = mutation.target;	//変更されたノード
			//mutation.type			//変更タイプ

			var oType = Object.prototype.toString.call(target).slice(8, -1);

			if(target.innerHTML == "[Killer]")return;

			switch (mutation.type) {

			case 'attributes' : // 属性が変更された
			//mutation.attributeName; // 属性の名前
			//mutation.attributeNamespace; // 属性の名前空間
			//mutation.oldValue; // 変更前の属性値(attributeOldValueが設定されてる場合)


//				if(oType == "HTMLAnchorElement" || !(target.tagName.match(/^body$/i) && target.parentNode.parent)){
//				if(oType == "HTMLAnchorElement"){
				if(mutation.attributeName == href) return;
					main("mutation_attr",target);
//				}


			case 'childList' : // 子ノードが変更された
			//mutation.target;	// 子ノードが変更された親
			//mutation.addedNodes; // 追加されたノードのリスト
			//mutation.removedNodes; // 削除されたノードのリスト
			//mutation.previousSibling; // 変更されたノードの前
			//mutation.nextSibling; // 変更されたノードの次


				if(mutation.addedNodes.length <= 0) return; //削除された場合は除外

				//ページ遷移をせずにURL変更するようなサイト対策
				if(locUrl != location.href){
					main("mutation_chg",target);
					locUrl = location.href;
					return;
				}

				if(location.host.match("google")) remTrack(target);	//インスタント検索対策

/*
				if(oType.match(/HTMLAnchorElement/)){
					multi("mutation_chg",target);
					return;
				}
				if(oType.match(/HTMLBodyElement/)){
					main("mutation_chg",target);
					return;
				}
*/

				for(var mu = 0; mutation.addedNodes.length > mu ; mu++){
					var objMu = mutation.addedNodes[mu];
					oType = Object.prototype.toString.call(objMu).slice(8, -1);

//					if(oType.match(/Text/i) && objMu.innerHTML && objMu.innerHTML.match("href")){
					if(objMu.innerHTML && objMu.innerHTML.match("href")){
						window.setTimeout( function() { main("mutation_chg",target); },500);
						continue;
					}
					if(oType.match(/Text|HTMLBRElement|Comment/i))continue;

					window.setTimeout( function() { main("mutation_chg",objMu); },500);
				}
			}//switch

	}catch(e){
		GM_log("AKiller_mutation_Error:"+e);

		return;
	}
		    });
		});

//		watcher.target = document.links;		//監視対象
		watcher.target = document.body;			//監視対象
//		watcher.attrArray = ['href'];	//フィルタ
		//watcher.config = { childList: true ,subtree: true ,attributes:true,  attributeFilter: watcher.attrArray};
		watcher.config = { childList: true ,subtree: true ,attributes:true};
		watcher.start();

//		clearTimeout(document.timer);

	},
	stop: function(){
		if(!watcher.status) return;
		watcher.observer.disconnect();
		watcher.observer = null;
		watcher.status = false;
	},
	rest: function(){
		watcher.stop();
		clearTimeout(watcher.timer);

        var onFocusCheck;
        window.addEventListener("focus",onFocusCheck = function(){
             window.removeEventListener("focus", onFocusCheck,false);
             //watcher.init();
            watcher.start();
        });
/*
		var onEventMove;
		window.addEventListener('mousemove',onEventMove = function(e){
			window.removeEventListener("mousemove", onEventMove,false);
			watcher.init();
		},false);
		var onEventDown;
		window.addEventListener('mousedown',onEventDown = function(e){
			window.removeEventListener("mousedown", onEventDown,false);
			watcher.init();
		},false);
		var onEventUp;
		window.addEventListener('mouseup',onEventUp = function(e){
			window.removeEventListener("mouseup", onEventUp,false);
			watcher.init();
		},false);
*/

	}};



	//実行
	keydownHide();
	removeCookie();

/*
	//読み込み完了後に実行
	window.addEventListener("load", function() {
		document.timer = setTimeout(watcher.init,500);	//linkify系を有効にしてるとsetTimeoutで0秒でもいいのでディレイ入れないと修正できない模様
//watcher.init();
	}, false);
*/
document.timer = setTimeout(watcher.init,500);	//linkify系を有効にしてるとsetTimeoutで0秒でもいいのでディレイ入れないと修正できない模様


	//継ぎ足し要素対応
	//For AutoPagerize
	var onEventAutoPagerize;
	document.addEventListener('AutoPagerize_DOMNodeInserted',onEventAutoPagerize = function(e){
		var node = e.target;
		remTrack(node);
	}, false);
	//For AutoPager
	var onEventAutoPager;
	document.addEventListener('AutoPagerAfterInsert', onEventAutoPager = function(e){
		var node = e.target;
		remTrack(node);
	}, false);
	//For AutoPatchWork
	var onEventAutoPatchWork;
	document.addEventListener('AutoPatchWork.DOMNodeInserted', onEventAutoPatchWork = function(e){
		var node = e.target;
		remTrack(node);
	}, false);

/*
	//追加した監視の削除
	var onEventUnload = function(){
		watcher.stop();
		
		watcher = main = mainCheck = setLink = ecl = expDB = nameDB = cookieDB = null;

		document.removeEventListener("AutoPagerize_DOMNodeInserted", onEventAutoPagerize,false);
		document.removeEventListener("AutoPagerAfterInsert", onEventAutoPager,false);
		document.removeEventListener("AutoPatchWork.DOMNodeInserted", onEventAutoPatchWork,false);

		window.removeEventListener("beforeunload", onEventUnload,false);
	};
	window.addEventListener('beforeunload',onEventUnload, false);
*/

})();
