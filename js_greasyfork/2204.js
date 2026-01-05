// ==UserScript==
// @id             Yahoo!Japan_AuctionSearch
// @name           Yahoo!Japan Auction「タイトルと商品説明」検索復元script
// @version        1.13
// @copyright      Noi & Noisys & NoiSystem & NoiProject
// @license        https://creativecommons.org/licenses/by-nc-sa/3.0/
// @author         noi
// @description    Yahoo!Japanの検索オプション「タイトルと商品説明」を復活させる
// @include        http://auctions.search.yahoo.co.jp/search*
// @include        http://auctions.yahoo.co.jp/search*
// @include        https://auctions.yahoo.co.jp/search*
// @include        http://category.auctions.yahoo.co.jp/list/*
// @include        https://auctions.yahoo.co.jp/category/list/*
// @namespace      https://greasyfork.org/scripts/2204
// @homepageURL    https://greasyfork.org/scripts/2204
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/2204/Yahoo%21Japan%20Auction%E3%80%8C%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%81%A8%E5%95%86%E5%93%81%E8%AA%AC%E6%98%8E%E3%80%8D%E6%A4%9C%E7%B4%A2%E5%BE%A9%E5%85%83script.user.js
// @updateURL https://update.greasyfork.org/scripts/2204/Yahoo%21Japan%20Auction%E3%80%8C%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%81%A8%E5%95%86%E5%93%81%E8%AA%AC%E6%98%8E%E3%80%8D%E6%A4%9C%E7%B4%A2%E5%BE%A9%E5%85%83script.meta.js
// ==/UserScript==
/*=====================================================================================================================
**************************************************************
*************** Caution!  [Yahoo!Japan] Only.*****************
**************************************************************


このスクリプトはヤフオクがかつて表示していた「タイトルと商品説明」を復活させるためのスクリプトです。
オークションの検索ページの左側にあるオプションにチェックボックスが復活します。

このスクリプトに関して、すべてにおいて自己責任にてご使用下さい。

※なお、万が一Yahoo!Japanより公開停止要請があった場合、即公開中止いたしますのでご了承下さい。 
その場合、ご利用を中止してください。

※2014年09月の変更により、「タイトルと商品説明」と「あいまい検索」は排他になりました。
両方有効にしても表示上は「タイトルと商品説明」となります。(両方効いているのか、表示通りなのかは不明)

=====================================================================================================================*/

/********************************************************************************************************************
更新履歴

2017/11/30 - v1.13 fix:仕様変更対応
2016/09/11 - v1.12 fix:include URL
2016/03/04 - v1.11 add:「コンビニ受け取り」追加
2014/09/07 - v1.10 fix:yahooの仕様変更に対応(選択制の旧スタイルに戻す)
2014/06/13 - v1.9 del:@updateURL
2014/06/12 - v1.8 add:@homepageURL
2014/06/07 - v1.7 change: namespace & updateURL
2014/05/05 - v1.6 add:include URL (http://category.auctions.yahoo.co.jp)
2013/02/12 - v1.5 fix:yahooのレイアウトの変更に対応。多少の変更に左右されないように修正
2013/01/29 - v1.4 add:check update
2013/01/18 - v1.3 add:aimai search and fix(「あいまい検索」追加とチェックボタン連動機能追加)
2013/01/07 - v1.2 change:simplified source code(プログラムソースの簡素化)
2012/12/02 - v1.1 fix:(ページによって追記場所がずれるため修正)
2012/11/29 - v1.0 release 

********************************************************************************************************************

備忘録
・「タイトルと商品説明」で検索すると、URLの引数に「?f=0x4」付く
  ただし、だからといって単純に「?f=0x4」だけ追記しても表示が変わらないので他にもファクターがあると思われる?
  「タイトル」検索に戻す場合は「?f=0x2」もしくは(ヤフオク仕様変更により)削除でも可
  「あいまい検索」は「?ngram=1」
  「新着」は「new=1」
  「送料無料」は「pstagefree=1」
  「値下げ交渉」は「offer=1」
  http://auctions.search.yahoo.co.jp/search?ei=UTF-8&p=「検索文字列」&auccat=「カテゴリーID」
  http://category.auctions.yahoo.co.jp/list/「カテゴリーID」/

タイトルと商品説明	'<li><input type="checkbox" name="f" id="ni03" class="cb" value="0x4"><label for="ni03">タイトルと商品説明</label></li>';
あいまい検索		'<li><input type="checkbox" name="ngram" id="ni04" class="cb" value="1"><label for="ni04">あいまい検索</label></li>';
コンビニ受け取り	&shipping=111


・以下廃止
  https://www.userscripts.org/scripts/show/153206
  https://userscripts.org/scripts/source/153206.user.js
・@updateURLを削除(インストールしたときのサイトURLをアドオンが保持しているので更新可能な模様)

********************************************************************************************************************/

(function(){

	//変数・定数---------------------------------------------------------------------------------
	//共通
	var href = window.location.search;			//現在のURL
	var objId = document.getElementById('S_Items');		//オプション欄
	var objTarget = objId.getElementsByTagName('ul')[0];	//追加する場所
	var hiddenElm = "";					//検索オプションをつけるとhiddenで追加される要素

	var objUL = document.createElement('ul');		//大本の入れ物
	objUL.id = "YJAS_DATA";

//alert(objId.innerHTML);	//テスト用
//alert(objTarget.innerHTML);	//テスト用

	//関数----------------------------------------------------------------------------------------
	//yahooの使いづらい部分削除
	objTarget.innerHTML = "";

	//「新着」
	addHtml("ni00","new=1","新着");

	//「送料無料」
	addHtml("ni01","pstagefree=1","送料無料");

	//「値下げ交渉」
	addHtml("ni02","offer=1","値下げ交渉");

	//「コンビニ受け取り」
	addHtml("ni03","shipping=111","コンビニ受け取り");

	//「タイトルと商品説明」
	addHtml("ni04","f=0x4","タイトルと商品説明");

	//「あいまい検索」
	addHtml("ni05","ngram=1","あいまい検索");



	//「絞り込む」ボタン
	objUL.insertAdjacentHTML("beforeend", '<input type="button" class="b" value="絞り込む" />');

	//「絞り込む」ボタンのクリックイベントを監視
	objUL.getElementsByClassName("b")[0].addEventListener('click', function(){change()}, true);

	//オブジェクト追加
	objTarget.appendChild(objUL);

	//解除ボタン
	var reset = objTarget.parentNode.parentNode.getElementsByClassName("dvCancel")[0];
	var urlTmp = href.replace(/&(new=1|pstagefree=1|offer=1|f=0x4|ngram=1)/g,"");
	if(!reset && href != urlTmp){
		var objTmp = objTarget.parentNode.parentNode.getElementsByClassName("t cf")[0];	//解除ボタンのタイトルバーの見た目変更
		objTmp.setAttribute("class","t cf exChecked");					//クラス変更でCSSが適応される
		objTmp.insertAdjacentHTML("beforeend", '<div class="dvCancel"><></div>');
		reset = objTarget.parentNode.parentNode.getElementsByClassName("dvCancel")[0];
	}
	if(reset) reset.innerHTML = '<a href="' + urlTmp + '">解除</a>'

	//HTMLタグ生成
	function addHtml(id,param,txt){
		var strChecked = "";
		var regCheck = new RegExp('(\\?|&)' + param);

		var objLI = document.createElement('li');		//チェックボックスボックスの入れ物
		var objBox = document.createElement('input');		//チェックボックス

		//オプションが有効だったらチェックボックスにチェックを入れる
		if(window.location.search.match(regCheck)) strChecked = " checked";


		var html = '<li><input type="checkbox" id="' + id + '"'
			+ strChecked
			+ ' class="cb" value="&' + param + '">'
			+ '<label for="' + id + '">' + txt
			+ '</label></li>'
		;//ここまで

			objUL.insertAdjacentHTML("beforeend", html);

	}


	//検索オプション変更
	function change(){
		var data = document.getElementById("YJAS_DATA");
		var newUrl = href;

		var objInputs = data.getElementsByTagName("input");
		for(var i=0; i < objInputs.length;i++){
			if(objInputs[i].type != "checkbox") continue;
			if(objInputs[i].checked){ if(!href.match(objInputs[i].value)) newUrl += objInputs[i].value;
			}else{ newUrl = newUrl.replace(objInputs[i].value,"");}
		}

		if(href != newUrl) location.href = newUrl;
	}



})();
//=====================================================================================================================
