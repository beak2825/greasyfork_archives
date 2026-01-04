// ==UserScript==
// @name         なろうタグ付けスクリプト
// @namespace    https://greasyfork.org/users/135410
// @version      0.1
// @description  なろうの小説や作者にタグを付ける
// @match        http://yomou.syosetu.com/*
// @match        http://ncode.syosetu.com/*
// @match        http://syosetu.com/*
// @match        http://mypage.syosetu.com/*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/31197/%E3%81%AA%E3%82%8D%E3%81%86%E3%82%BF%E3%82%B0%E4%BB%98%E3%81%91%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/31197/%E3%81%AA%E3%82%8D%E3%81%86%E3%82%BF%E3%82%B0%E4%BB%98%E3%81%91%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(function() {
	"use strict";
	//[非表示]を選択したとき 0:タイトル含め全て消す 1:あらすじ、キーワード等のみを消す
	var HIDDEN_TYPE = 1;
	//タグの表示 0:折りたたまない 1:折りたたむ
	var DISPLAY_TYPE = 1;
	//選択肢のテキスト 0:文字 1:記号
	var TEXT_TYPE = 0;

	var style = document.createElement('style');
	style.type = "text/css";
	document.getElementsByTagName('head')[0].appendChild(style);
	var stylesheet = style.sheet;

	//クラスselectedの要素の文字を変更する
	stylesheet.insertRule("a.selected{font-weight:bold;}", stylesheet.cssRules.length);
	stylesheet.insertRule("a.selected:link{color:#ff0000;}", stylesheet.cssRules.length);
	stylesheet.insertRule("#novel_contents a.selected:link{color:#ff0000;}", stylesheet.cssRules.length);
	//クラスhiddenの要素を非表示にする
	stylesheet.insertRule("div.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule("table.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule("li.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule("a.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule("span.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule(".hidden{display:none;}", stylesheet.cssRules.length);
	//作者用タグの要素をインラインにする
	stylesheet.insertRule("div.my_writer {display:inline;}", stylesheet.cssRules.length);

	//個別に不要な部分を消す
	//[未設定] を非表示にする
	//stylesheet.insertRule("body div.my_favorite > a:nth-child(1){display:none;}", stylesheet.cssRules.length);
	//[お気に入り] を非表示にする
	//stylesheet.insertRule("body div.my_favorite > a:nth-child(2){display:none;}", stylesheet.cssRules.length);
	//[後で読む] を非表示にする
	//stylesheet.insertRule("body div.my_favorite > a:nth-child(3){display:none;}", stylesheet.cssRules.length);
	//[読まない] を非表示にする
	//stylesheet.insertRule("body div.my_favorite > a:nth-child(4){display:none;}", stylesheet.cssRules.length);
	//[非表示] を非表示にする
	//stylesheet.insertRule("body div.my_favorite > a:nth-child(5){display:none;}", stylesheet.cssRules.length);

	//表示する選択肢のテキスト
	//0:未設定 1:お気に入り 2:後で読む 3:読まない 4:非表示
	//0:－     1:☆         2:◯       3:△       4:×
	var text = ["[未設定]","[お気に入り]","[後で読む]","[読まない]","[非表示]"];
	var text2 = ["[－]","[☆]","[◯]","[△]","[×]"];
	//title属性用
	var text3 = ["[未設定]","[お気に入り]","[後で読む]","[読まない]","[非表示]"];

	//作者用タグのテキスト
	var text4 = ["[－]","[×]"];
	//作者用タグのtitle属性
	var text5 = ["[未設定]","[非表示]"];

	function setText(){
		if(TEXT_TYPE){
			text = text2;
		}
	}
	var currentUrl = window.location.href;

	//ページの場所 1:ユーザーページ 2:小説ページ 3:ランキングBEST5 4:ランキングリスト 5:検索ページ 6:なろうトップ 7:読もうトップ 8:小説Pickup! 9:未感想・未評価作品一覧
	//10:閲覧履歴 11:マイページトップ 12:マイページ 作品一覧 13:マイページ ブックマーク 14:マイページ 評価をつけた作品一覧 15:マイページ レビューをした作品一覧
	function getLocation(){
		//1:ユーザーページ
		if(currentUrl.match(/^http:\/\/syosetu\.com\/favnovelmain\/(isnotice)?list.*/)||(currentUrl.match(/^http:\/\/syosetu\.com\/user\/top\/?/))){
			return 1;
		}
		//2:小説ページ
		else if(currentUrl.match(/^http:\/\/ncode\.syosetu\.com\/n.+/)){
			return 2;
		}
		//3:ランキングBEST5
		else if(currentUrl.match(/^http:\/\/yomou\.syosetu\.com\/rank\/.*top.*/)){
			return 3;
		}
		//4:ランキングリスト
		else if(currentUrl.match(/^http:\/\/yomou\.syosetu\.com\/rank\/.*list.*/)){
			return 4;
		}
		//5:検索画面
		else if(currentUrl.match(/^http:\/\/yomou\.syosetu\.com\/search\.php.*/)){
			return 5;
		}
		//6:トップ
		else if(currentUrl.match(/^http:\/\/syosetu\.com\/?$/)){
			return 6;
		}
		//7:読もうトップ
		else if(currentUrl.match(/^http:\/\/yomou\.syosetu\.com\/?$/)){
			return 7;
		}
		//8:小説PickUp！
		else if(currentUrl.match(/^http:\/\/syosetu\.com\/pickup\/list.*/)){
			return 8;
		}
		//9:未感想・未評価作品一覧
		else if(currentUrl.match(/^http:\/\/yomou\.syosetu\.com\/nolist.*/)){
			return 9;
		}
		//10:履歴リスト
		else if(currentUrl.match(/^http:\/\/yomou\.syosetu\.com\/rireki\/list\/?$/)){
			return 10;
		}
		//11:マイページ トップ
		else if(currentUrl.match(/^http:\/\/mypage\.syosetu\.com\/\d+/)||currentUrl.match(/^http:\/\/mypage\.syosetu\.com\/mypage\/top\/userid\/\d+/)){
			return 11;
		}
		//12:マイページ 作品一覧
		else if(currentUrl.match(/^http:\/\/mypage\.syosetu\.com\/mypage\/novellist\/userid\/.*/)){
			return 12;
		}
		//13:マイページ ブックマーク
		else if(currentUrl.match(/^http:\/\/mypage\.syosetu\.com\/mypagefavnovelmain\/list\/userid\/.*/)){
			return 13;
		}
		//14:マイページ 評価
		else if(currentUrl.match(/^http:\/\/mypage\.syosetu\.com\/mypagenovelhyoka\/list\/userid\/.*/)){
			return 14;
		}
		//15:マイページ レビュー
		else if(currentUrl.match(/^http:\/\/mypage\.syosetu\.com\/mypage\/reviewlist\/userid\/.*/)){
			return 15;
		}
		else{
			return -1;
		}
	}

	function makeMyWriter(n){

		var myWriter = document.createElement("div");
		myWriter.classList.add('my_writer');
		var elements = [];
		var textnode = [];
		for(var i = 0; i < 2;i++){
			elements[i] = document.createElement("a");
			elements[i].setAttribute('href','javascript:void(0)');
			elements[i].setAttribute('title',text5[i]);
			textnode[i]= document.createTextNode(text4[i]);
			elements[i].appendChild(textnode[i]);
			myWriter.appendChild(elements[i]);

			//タグのテキストにselectedクラスを追加
			if(i==n){
				elements[i].classList.add("selected");
			}
			else{
				//非表示にする要素にhiddenクラスを追加
				if(DISPLAY_TYPE){
					elements[i].classList.add("hidden");
				}
			}
			elements[i].addEventListener('click',function(evt){
				var node = evt.target;
				onclickWriterTag(node);
			}, false);
		}
		if(DISPLAY_TYPE){
			myWriter.classList.add("closed");
		}
		return myWriter;

	}

	//小説にタグを設定する
	function setNovelTag(ncode,n){
		if(n!==0){
			GM_setValue(ncode,n);
		}
		else{
			GM_deleteValue(ncode);
		}
	}

	//小説のタグを取得する
	function getNovelTag(ncode){
		var n = GM_getValue(ncode,0);
		return n;
	}
	//作者にタグを設定する
	function setWriterTag(userId,n){
		if(n!==0){
			GM_setValue(userId,5);
		}
		else{
			GM_deleteValue(userId);
		}
	}

	//作者のタグを取得する
	function getWriterTag(userId){
		var n = GM_getValue(userId,0);
		if(n>0){
			n = 1;
		}
		return n;
	}
	//createTagの前に実行する
	function beforeCreateTag(){
		var element;
		var writer;
		var mypage;
		var userId;
		var myWriter;
		switch(website){
			case 1:
				//1:ユーザーページ
				addLink();
				stylesheet.insertRule(".my_favorite{padding:5px;}", stylesheet.cssRules.length);
				stylesheet.insertRule("td.info2{padding-top:0px;padding-bottom:2px;}", stylesheet.cssRules.length);
				stylesheet.insertRule("td.info{padding-top:0px;padding-bottom:2px;}", stylesheet.cssRules.length);
				stylesheet.insertRule(".favnovel td.title{padding-bottom:0px;}", stylesheet.cssRules.length);
				break;
			case 2:
				//2:小説ページ用
				stylesheet.insertRule("#novel_header div.my_favorite  a{line-height:25px;padding: 0px 5px;color: #666666;font-weight:bold;display:block;border:1px solid #cccccc;background-color:#eeeeee;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novel_header div.my_favorite  a.hidden{display:none;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novel_header div.my_favorite  a.selected:link{color:#ff0000; display:block  !important;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novel_header > .my_container {width:100px;position:fixed;top:95px;right:12px;}", stylesheet.cssRules.length);
				if(TEXT_TYPE){
					stylesheet.insertRule("#novel_header div.my_container{width:80px ;text-align: center;}", stylesheet.cssRules.length);
				}
				var headerMyFavorite = makeMyFavorite(getNovelTag(currentUrl.match(/(n\d+[a-z]+)/)[1]));
				var myContainer = document.getElementsByClassName("my_container")[0];
				if(!myContainer){
					myContainer = document.createElement('div');
					myContainer.setAttribute('class','my_container');
					myContainer.appendChild(headerMyFavorite);
				}
				else{
					myContainer.insertBefore(headerMyFavorite,myContainer.lastElementChild);
				}
				document.getElementById("novel_header").appendChild(myContainer);

				writer = document.getElementsByClassName("novel_writername")[0];

				if(writer){
					if(writer.firstElementChild){
						mypage = writer.firstElementChild.getAttribute('href');
						if(mypage){
							userId = mypage.match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
							myWriter = makeMyWriter(getWriterTag(userId));
							writer.appendChild(myWriter);
						}
					}
				}
				else{
					writer = document.getElementsByClassName("contents1")[0];
					if(writer){
						if(writer.children[1]){
							mypage = writer.children[1].getAttribute('href');
							if(mypage){
								userId = mypage.match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
								myWriter = makeMyWriter(getWriterTag(userId));
								writer.insertBefore(myWriter,writer.children[1].nextElementSibling);
							}
						}
					}

				}
				break;
			case 3:
				//3:ランキングBEST5
				stylesheet.insertRule(".ranking_top5box li{margin-bottom:3px;}", stylesheet.cssRules.length);
				//ランキングBEST100～300
				stylesheet.insertRule(".rankmain_box .ranking_list{margin-bottom:10px;}", stylesheet.cssRules.length);
				//ジャンル別BEST5のページは途中で改行されるのでフォントサイズを変える
				if(currentUrl.match(/^http:\/\/yomou\.syosetu\.com\/rank\/genretop\/?/)){
					stylesheet.insertRule("div.my_favorite > a{font-size:90%;}", stylesheet.cssRules.length);
				}
				break;
			case 4:
				//4:ランキングリスト
				stylesheet.insertRule(".rankmain_box .ranking_list{margin-bottom:10px;}", stylesheet.cssRules.length);
				stylesheet.insertRule(".rankmain_box .ranking_list .rank_h{margin-bottom:0px;}", stylesheet.cssRules.length);
				stylesheet.insertRule(".rankmain_box .ranking_list table{margin-top:0px;}", stylesheet.cssRules.length);
				break;
			case 5:
				//5:検索ページ
				stylesheet.insertRule(".searchkekka_box{margin:10px 0px 10px 0px;}", stylesheet.cssRules.length);
				stylesheet.insertRule(".novel_h{margin-bottom:0px;}", stylesheet.cssRules.length);

				//1ページ目が全部非表示で埋まると次ページをAutopagerizeが読み込まないことがある(?)ので空の要素を追加して回避する
				if(!HIDDEN_TYPE){
					element = document.createElement("div");
					element.setAttribute('class','searchkekka_box');
					element.setAttribute('style','margin:0px 0px;');
					var searchdate_box = document.getElementsByClassName('searchdate_box')[1];
					searchdate_box.parentNode.insertBefore(element,searchdate_box.previousElementSibling);
				}
				break;
			case 6:
				//6:なろうトップページ
				stylesheet.insertRule("#main div.main_box:nth-of-type(3) > .in_box > br{display:none;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#main div.main_box:nth-of-type(5) > .in_box > br{display:none;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#main div.main_box:nth-of-type(7) > .in_box > br{display:none;}", stylesheet.cssRules.length);

				var item;
				var items = document.evaluate('.//div[@id="main"]/div[@class="main_box"]/div[@class="in_box"]/a[contains(@href, "http://ncode.syosetu.com/n")]',document,null,7,null);
				var parentItem;
				var div;
				var targetNode;
				var str;
				var ncode;
				for(var i=0;i<items.snapshotLength;i++){
					item = items.snapshotItem(i);
					str = item.getAttribute('href').match(/^http:\/\/ncode\.syosetu\.com\/(n\d+[a-z]+)/);
					if(str){
						ncode = str[1];
						parentItem = item.parentNode;
						div = document.createElement('div');
						div.setAttribute('class','bundled');
						targetNode = item.previousSibling;
						div.appendChild(targetNode);
						targetNode = item;
						div.appendChild(targetNode);
						parentItem.appendChild(div);
					}
				}
				break;
			case 7:
				//7:読もうトップ用
				stylesheet.insertRule(".list_p div.my_favorite > a{display:initial;background-color:transparent;}", stylesheet.cssRules.length);
				stylesheet.insertRule(".list_p div.my_favorite > a.hidden{display:none;}", stylesheet.cssRules.length);
				stylesheet.insertRule(".list_p > li.hidden{display:none;}", stylesheet.cssRules.length);
				break;
			case 8:
				//8:Pickup!ページ用
				stylesheet.insertRule(".trackback_list > .trackback_listdiv:last-child{padding:0px 10px 10px 10px;}", stylesheet.cssRules.length);
				if(!HIDDEN_TYPE){
					element = document.createElement("div");
					element.setAttribute('class','trackback_list');
					element.setAttribute('style','border:none;margin:0px 0px;');
					var naviall_c = document.getElementsByClassName('naviall_c')[1];
					naviall_c.parentNode.insertBefore(element,naviall_c);
				}
				break;
			case 9:
				//9:未感想・未評価作品一覧用
				stylesheet.insertRule(".no_list .no_list_head{margin-bottom:0px;}", stylesheet.cssRules.length);
				if(!HIDDEN_TYPE){
					element = document.createElement("div");
					element.setAttribute('class','no_list clearfix');
					element.setAttribute('style','border:none;margin:0px;padding:0px;');
					var in_box = document.getElementsByClassName('in_box')[0];
					in_box.appendChild(element);
				}
				break;
			case 11:
				//11:マイページ トップ
				stylesheet.insertRule("#novellist_top td.title .my_favorite a{font-weight:normal;font-size:100%;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novellist_top td.title .my_favorite a.selected{font-weight:bold;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novellist_top td.title .my_favorite a.selected:link{color:#ff0000;}", stylesheet.cssRules.length);

				writer = document.getElementById('anotheruser_info');
				userId = currentUrl.match(/(\d+)/)[1];
				myWriter = makeMyWriter(getWriterTag(userId));
				writer.lastElementChild.firstElementChild.insertBefore(myWriter,writer.lastElementChild.firstElementChild.firstElementChild);
				break;
			case 12:
				//12:マイページ 作品
				stylesheet.insertRule(".my_favorite{padding:5px;background-color:#ffffff;}", stylesheet.cssRules.length);
				stylesheet.insertRule(".my_favorite{background-color:#ffffff;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novellist > ul > ul {padding:0px;margin:0px}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novellist > ul {padding-bottom:0px;}", stylesheet.cssRules.length);

				writer = document.getElementById('anotheruser_info');
				userId = currentUrl.match(/(\d+)/)[1];
				myWriter = makeMyWriter(getWriterTag(userId));
				writer.lastElementChild.firstElementChild.insertBefore(myWriter,writer.lastElementChild.firstElementChild.firstElementChild);
				break;
			case 13:
				//13:マイページ ブックマーク
				stylesheet.insertRule(".my_favorite{padding:5px;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novellist > ul > ul {padding:0px;margin:0px}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novellist > ul {padding-bottom:0px;}", stylesheet.cssRules.length);
				break;
			case 14:
				//14:マイページ 評価
				stylesheet.insertRule(".my_favorite{padding:5px;background-color:#ffffff;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novelpointlist .date{padding-top:0px;border:none;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novelpointlist li.title{border:none;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novelpointlist li.title{border-bottom:1px solid #ccccdd;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novelpointlist>ul{border:1px solid #ccccdd;}", stylesheet.cssRules.length);
				stylesheet.insertRule(".my_favorite{background-color:#ffffff;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novelpointlist > ul > ul {padding:0px;margin:0px}", stylesheet.cssRules.length);
				break;
			case 15:
				//15:マイページ レビュー
				stylesheet.insertRule(".my_favorite{padding:5px;background-color:#ffffff;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novelreviewlist .date{border:none;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novelreviewlist li.title{border:none;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novelreviewlist li.review_title{border:none;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novelreviewlist li.review_title{border-bottom:1px solid #ccccdd;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novelreviewlist>ul{border:1px solid #ccccdd;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#novelreviewlist li.hidden{display:none;}", stylesheet.cssRules.length);
				break;
			default:
				break;
		}
	}

	//タグ付け機能を追加する
	function createTag(node){
		var item = "";
		var items= "";
		//URLごとに小説情報の要素を探す
		if(website==1){
			if(currentUrl.match(/^http:\/\/syosetu\.com\/favnovelmain.*/)){
				items = document.evaluate('.//a[contains(@href, "http://ncode.syosetu.com/n")]',node,null,7,null);
			}
		}
		else if(website==2){
			items = document.evaluate('.//div[@id="recommend"]/div/a[contains(@href, "http://ncode.syosetu.com/n")]',node,null,7,null);
			document.body.removeEventListener('AutoPagerize_DOMNodeInserted',func, false);
		}
		else if(website==6){
			items = document.evaluate('.//div[@class="bundled"]/a[contains(@href, "http://ncode.syosetu.com/n")]',node,null,7,null);
		}
		else if(website==10){
			items = document.evaluate('.//a[@class="tl"]',node,null,7,null);
		}
		else if(website==11){
			items = document.evaluate('.//div[@class="novellist_toptable"]/table/tbody/tr/td/a[contains(@href, "http://ncode.syosetu.com/n")]',node,null,7,null);
		}
		else{
			items = document.evaluate('.//a[contains(@href, "http://ncode.syosetu.com/n")]',node,null,7,null);
		}

		//ページ内のすべての小説情報を処理
		for(var i=0;i<items.snapshotLength;i++){
			item = items.snapshotItem(i);
			var str = item.getAttribute('href').match(/^http:\/\/ncode\.syosetu\.com\/(n\d+[a-z]+)\/$/);
			var ncode;
			if(str){
				ncode = str[1];
				var myFavorite;
				var div;
				var ul;
				var targetNode;
				var j;
				var n = getNovelTag(ncode);
				var hiddenTarget;
				var writer;
				var mypage;
				var userId;
				var myWriter;

				//非表示にする要素を指定、myFavoriteを追加
				switch(website){
					case 1:
						//1:ユーザーページ
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode.parentNode.parentNode.parentNode;
						}
						else{
							hiddenTarget = item.parentNode.parentNode.parentNode.lastElementChild.firstElementChild.firstElementChild;
						}
						for(j=0;j<item.parentNode.parentNode.children.length-1;j++)
							item.parentNode.parentNode.children[j].rowSpan='3';
						myFavorite = makeMyFavorite(n);
						item.parentNode.parentNode.parentNode.insertBefore(myFavorite,item.parentNode.parentNode.parentNode.lastElementChild);

						break;
					case 2:
						//2:小説ページ
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode;
						}
						else{
							div = document.createElement('div');
							while(item.parentNode.children[1]){
								targetNode = item.parentNode.children[1];
								div.appendChild(targetNode);
							}
							item.parentNode.appendChild(div);
							hiddenTarget = item.parentNode.lastElementChild;
						}

						myFavorite = makeMyFavorite(n);
						item.parentNode.insertBefore(myFavorite, item.nextSibling);
						break;
					case 3:
						//3:ランキングBEST5
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode;
						}
						else{
							hiddenTarget = "";
						}

						myFavorite = makeMyFavorite(n);
						item.parentNode.appendChild(myFavorite);

						writer = item.nextElementSibling.nextElementSibling;
						mypage = writer.firstElementChild.getAttribute('href');
						userId = mypage.match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
						myWriter = makeMyWriter(getWriterTag(userId));
						writer.insertBefore(myWriter,writer.childNodes[2]);
						break;
					case 4:
						//4:ランキングリスト
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode.parentNode;
						}
						else{
							div = document.createElement('div');
							while(item.parentNode.parentNode.lastElementChild.firstElementChild.children[1]){
								targetNode = item.parentNode.parentNode.lastElementChild.firstElementChild.children[1];
								div.appendChild(targetNode);
							}
							item.parentNode.parentNode.lastElementChild.firstElementChild.appendChild(div);
							hiddenTarget = item.parentNode.parentNode.lastElementChild.firstElementChild.lastElementChild;
						}

						myFavorite = makeMyFavorite(n);
						item.parentNode.insertBefore(myFavorite, item.nextSibling);

						writer = item.parentNode.parentNode.lastElementChild.firstElementChild.firstElementChild.firstElementChild;
						mypage = writer.lastElementChild.getAttribute('href');
						userId = mypage.match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
						myWriter = makeMyWriter(getWriterTag(userId));
						writer.appendChild(myWriter);

						break;
					case 5:
						//5:検索画面
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode.parentNode;
						}
						else{
							hiddenTarget = item.parentNode.parentNode.lastElementChild;
						}

						myFavorite = makeMyFavorite(n);
						item.parentNode.insertBefore(myFavorite, item.nextSibling);

						writer = item.parentNode.parentNode.children[1];
						mypage = writer.getAttribute('href');
						userId = mypage.match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
						myWriter = makeMyWriter(getWriterTag(userId));
						writer.parentNode.insertBefore(myWriter,writer.nextSibling);
						break;
					case 6:
						//6:トップ
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode;
						}
						else{
							hiddenTarget = "";
						}
						myFavorite = makeMyFavorite(n);
						item.parentNode.appendChild(myFavorite);
						break;
					case 7:
						//7:読もうトップ
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode;
						}
						else{
							hiddenTarget = item.lastElementChild;
						}

						myFavorite = makeMyFavorite(n);
						item.appendChild(myFavorite);
						break;
					case 8:
						//8:小説PickUp！
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode.parentNode;
						}
						else{
							hiddenTarget = item.parentNode.parentNode.lastElementChild;
						}

						myFavorite = makeMyFavorite(n);
						item.parentNode.parentNode.insertBefore(myFavorite,item.parentNode.parentNode.lastElementChild);
						stylesheet.insertRule(".my_favorite{padding-left:10px;}", stylesheet.cssRules.length);

						writer = item.parentNode.children[1];
						mypage = writer.getAttribute('href');
						userId = mypage.match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
						myWriter = makeMyWriter(getWriterTag(userId));
						writer.parentNode.insertBefore(myWriter,writer.nextSibling);
						break;
					case 9:
						//9:未感想・未評価作品一覧
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode.parentNode;
						}
						else{
							div = document.createElement('div');
							while(item.parentNode.parentNode.children[1]){
								targetNode = item.parentNode.parentNode.children[1];
								div.appendChild(targetNode);
							}
							item.parentNode.appendChild(div);
							hiddenTarget = item.parentNode.lastElementChild;
						}
						myFavorite = makeMyFavorite(n);
						item.parentNode.insertBefore(myFavorite,item.parentNode.lastElementChild);

						writer = item.parentNode.children[3];
						mypage = writer.getAttribute('href');
						userId = mypage.match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
						myWriter = makeMyWriter(getWriterTag(userId));
						writer.parentNode.insertBefore(myWriter,writer.nextSibling);
						break;
					case 10:
						//10:履歴
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode;
						}
						else{
							hiddenTarget = item.parentNode.lastElementChild;
						}
						myFavorite = makeMyFavorite(n);
						item.parentNode.insertBefore(myFavorite,item.parentNode.lastElementChild);
						break;
					case 11:
						//11:マイページ トップ
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode.parentNode.parentNode.parentNode.parentNode;
						}
						else{
							hiddenTarget = item.parentNode.parentNode.parentNode.lastElementChild;
						}
						myFavorite = makeMyFavorite(n);
						item.parentNode.appendChild(myFavorite);
						break;
					case 12:
						//12:マイページ 作品
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode.parentNode;
						}
						else{
							ul = document.createElement('ul');
							while(item.parentNode.parentNode.children[1]){
								targetNode = item.parentNode.parentNode.children[1];
								ul.appendChild(targetNode);
							}
							item.parentNode.parentNode.appendChild(ul);
							hiddenTarget = item.parentNode.parentNode.lastElementChild;
						}
						myFavorite = makeMyFavorite(n);
						item.parentNode.parentNode.insertBefore(myFavorite,item.parentNode.parentNode.firstElementChild.nextElementSibling);
						break;
					case 13:
						//13:マイページ ブックマーク
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode.parentNode;
						}
						else{
							ul = document.createElement('ul');
							while(item.parentNode.parentNode.children[2]){
								targetNode = item.parentNode.parentNode.children[2];
								ul.appendChild(targetNode);
							}
							item.parentNode.parentNode.appendChild(ul);
							hiddenTarget = item.parentNode.parentNode.lastElementChild;
						}
						myFavorite = makeMyFavorite(n);
						item.parentNode.parentNode.insertBefore(myFavorite,item.parentNode.parentNode.firstElementChild.nextElementSibling);

						writer = item.parentNode.parentNode.children[2].firstElementChild;
						if(writer){
							mypage = writer.getAttribute('href');
							userId = mypage.match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
							myWriter = makeMyWriter(getWriterTag(userId));
							writer.parentNode.appendChild(myWriter);
						}
						break;
					case 14:
						//14:マイページ 評価
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode.parentNode;
						}
						else{
							ul = document.createElement('ul');
							while(item.parentNode.parentNode.children[1]){
								targetNode = item.parentNode.parentNode.children[1];
								ul.appendChild(targetNode);
							}
							item.parentNode.parentNode.appendChild(ul);
							hiddenTarget = item.parentNode.parentNode.lastElementChild;
						}
						myFavorite = makeMyFavorite(n);
						item.parentNode.parentNode.insertBefore(myFavorite,item.parentNode.parentNode.firstElementChild.nextElementSibling);
						break;
					case 15:
						//15:マイページ レビュー
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode.parentNode;
						}
						else{
							hiddenTarget = item.parentNode.parentNode.lastElementChild;
						}
						myFavorite = makeMyFavorite(n);
						item.parentNode.parentNode.insertBefore(myFavorite,item.parentNode.parentNode.children[1].nextElementSibling);
						break;
					default:
						hiddenTarget = "";
						item = "";
						break;
				}

				if(hiddenTarget!==""){
					var m = getWriterTag(userId);
					if(!n){
						if(m==1){
							hiddenTarget.classList.add("hidden");
						}
					}
					else if(n==4){
						hiddenTarget.classList.add("hidden");
					}
				}
			}
		}
	}

	function findByWriterTag(node){

		var myWriter = node;
		var userId;
		var ncode;
		var elements = myWriter.children;
		var hiddenTarget = "";

		//Nコードを取得、非表示にする要素を指定
		switch(website){
			case 1:
				//1:ユーザーページ
				break;
			case 2:
				//2:小説ページ
				if(currentUrl.match(/^http:\/\/ncode\.syosetu\.com\/n\d+[a-z]+\/?$/)){
					userId = myWriter.parentNode.firstElementChild.getAttribute('href').match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
				}
				else{
					userId = myWriter.parentNode.children[1].getAttribute('href').match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
				}
				break;
			case 3:
				//3:ランキングBEST5
				userId = myWriter.parentNode.firstElementChild.getAttribute('href').match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
				ncode = myWriter.parentNode.parentNode.children[1].getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myWriter.parentNode.parentNode;
				}
				else{
					hiddenTarget = "";
				}
				break;
			case 4:
				//4:ランキングリスト
				userId = myWriter.parentNode.children[1].getAttribute('href').match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
				ncode = myWriter.parentNode.parentNode.firstElementChild.firstElementChild.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myWriter.parentNode.parentNode.parentNode.parentNode.parentNode;
				}
				else{
					hiddenTarget = myWriter.parentNode.parentNode.parentNode.lastElementChild;
				}
				break;
			case 5:
				//5:検索画面
				userId = myWriter.parentNode.children[1].getAttribute('href').match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
				ncode = myWriter.parentNode.firstElementChild.firstElementChild.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myWriter.parentNode;
				}
				else{
					hiddenTarget = myWriter.parentNode.lastElementChild;
				}
				break;
			case 6:
				//6:なろうトップ
				break;
			case 7:
				//7:読もうトップページ
				break;
			case 8:
				//8:小説Pickup!ページ
				userId = myWriter.parentNode.children[1].getAttribute('href').match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
				ncode = myWriter.parentNode.firstElementChild.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myWriter.parentNode.parentNode;
				}
				else{
					hiddenTarget = myWriter.parentNode.parentNode.lastElementChild;
				}
				break;
			case 9:
				//9:未感想・未評価作品一覧ページ
				userId = myWriter.parentNode.children[3].getAttribute('href').match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
				ncode = myWriter.parentNode.firstElementChild.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myWriter.parentNode.parentNode;
				}
				else{
					hiddenTarget = myWriter.parentNode.lastElementChild;
				}
				break;
			case 10:
				//10:履歴
				break;
			case 11:
				//11:マイページ トップ
				userId = currentUrl.match(/(\d+)/)[1];
				break;
			case 12:
				//マイページ 12:作品
				userId = currentUrl.match(/(\d+)/)[1];
				break;
			case 13:
				//13:マイページ ブックマーク
				userId = myWriter.parentNode.firstElementChild.getAttribute('href').match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
				ncode = myWriter.parentNode.parentNode.firstElementChild.firstElementChild.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myWriter.parentNode.parentNode;
				}
				else{
					hiddenTarget = myWriter.parentNode.parentNode.lastElementChild;
				}
				break;
			case 14:
				//マイページ 14:評価
				break;
			case 15:
				//15:マイページ レビュー
				break;
			default:
				break;
		}

		return {"ncode":ncode,"userId":userId,"hiddenTarget":hiddenTarget};
	}

	function onclickWriterTag(node){
		var data = findByWriterTag(node.parentNode);

		var myWriter = node.parentNode;
		var userId = data.userId;
		var ncode = data.ncode;
		var elements = myWriter.children;
		var hiddenTarget = data.hiddenTarget;

		var n;
		if(node.title==text5[0]){
			n = 0;
		}
		else if(node.title==text5[1]){
			n = 1;
		}

		var i;
		if(myWriter.classList.contains('closed')){
			if(hiddenTarget!==""){
				hiddenTarget.classList.remove("hidden");
			}
			for(i=0;i<2;i++){
				elements[i].classList.remove("hidden");
				elements[i].classList.remove("selected");
			}
			elements[getWriterTag(userId)].classList.add("selected");
			myWriter.classList.remove("closed");
		}
		else{
			var items;
			switch(website){
				case 1:
					//1:ユーザーページ
					break;
				case 2:
					//2:小説ページ
					items = document.evaluate('//*[contains(@href,"http://mypage.syosetu.com/'+userId+'")]/parent::node()/div[contains(@class,"my_writer")]',document,null,7,null);
					break;
				case 3:
					//3:ランキングBEST5
					items = document.evaluate('//*[contains(@href,"http://mypage.syosetu.com/'+userId+'")]/parent::node()/div[contains(@class,"my_writer")]',document,null,7,null);
					break;
				case 4:
					//4:ランキングリスト
					items = document.evaluate('//*[contains(@href,"http://mypage.syosetu.com/'+userId+'")]/parent::node()/div[contains(@class,"my_writer")]',document,null,7,null);
					break;
				case 5:
					//5:検索画面
					items = document.evaluate('//*[contains(@href,"http://mypage.syosetu.com/'+userId+'")]/parent::node()/div[contains(@class,"my_writer")]',document,null,7,null);
					break;
				case 6:
					//6:なろうトップ
					break;
				case 7:
					//7:読もうトップページ
					break;
				case 8:
					//8:小説Pickup!ページ
					items = document.evaluate('//*[contains(@href,"http://mypage.syosetu.com/'+userId+'")]/parent::node()/div[contains(@class,"my_writer")]',document,null,7,null);
					break;
				case 9:
					//9:未感想・未評価作品一覧ページ
					items = document.evaluate('//*[contains(@href,"http://mypage.syosetu.com/'+userId+'")]/parent::node()/div[contains(@class,"my_writer")]',document,null,7,null);
					break;
				case 10:
					//10:履歴
					break;
				case 11:
					//11:マイページ トップ
					updateMyWriter(myWriter,n);
					break;
				case 12:
					//マイページ 12:作品
					updateMyWriter(myWriter,n);
					break;
				case 13:
					//13:マイページ ブックマーク
					items = document.evaluate('//*[contains(@href,"http://mypage.syosetu.com/'+userId+'")]/parent::node()/div[contains(@class,"my_writer")]',document,null,7,null);
					break;
				case 14:
					//マイページ 14:評価
					break;
				case 15:
					//15:マイページ レビュー
					break;
				default:
					break;
			}
			for(i=0;i<items.snapshotLength;i++){
				updateMyWriter(items.snapshotItem(i),n);
			}
			myWriter.classList.add("closed");
		}
	}

	function updateMyWriter(node,authorTag){
		var data = findByWriterTag(node);

		var myWriter = node;
		var userId = data.userId;
		var ncode = data.ncode;
		var elements = myWriter.children;
		var hiddenTarget = data.hiddenTarget;

		var i = 0;
		var novelTag = getNovelTag(ncode);
		//クリックされたときに要素のクラスを変える
		if(!DISPLAY_TYPE){
			if(hiddenTarget!==""){
				if(!novelTag){
					if(authorTag==1){
						hiddenTarget.classList.add("hidden");
					}
					else{
						hiddenTarget.classList.remove("hidden");
					}
				}
				else if(novelTag==4){
					hiddenTarget.classList.add("hidden");
				}
				else{
					hiddenTarget.classList.remove("hidden");
				}
			}
			for(i=0;i<2;i++){
				elements[i].classList.remove("selected");
			}
			setWriterTag(userId,authorTag);
			elements[authorTag].classList.add("selected");
		}
		else{
			if(hiddenTarget!==""){
				if(!novelTag){
					if(authorTag==1){
						hiddenTarget.classList.add("hidden");
					}
					else{
						hiddenTarget.classList.remove("hidden");
					}
				}
				else if(novelTag==4){
					hiddenTarget.classList.add("hidden");
				}
				else{
					hiddenTarget.classList.remove("hidden");
				}
			}
			for(i=0;i<2;i++){
				elements[i].classList.remove("selected");
				elements[i].classList.add("hidden");
			}
			setWriterTag(userId,authorTag);
			elements[authorTag].classList.add("selected");
			elements[authorTag].classList.remove("hidden");
			myWriter.classList.add("closed");
		}
	}

	function findByNovelTag(node){
		var myFavorite = node;
		var ncode;
		var elements = myFavorite.children;
		var hiddenTarget;
		var userId;
		var writer;

		//Nコードを取得、非表示にする要素を指定
		switch(website){
			case 1:
				//1:ユーザーページ
				ncode = myFavorite.parentNode.firstElementChild.lastElementChild.firstElementChild.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode.parentNode;
				}
				else{
					hiddenTarget = myFavorite.parentNode.lastElementChild.firstElementChild.firstElementChild;
				}
				break;
			case 2:
				//2:小説ページ
				if(myFavorite.parentNode.parentNode.getAttribute('id')=='novel_header'){
					ncode = window.location.href.match(/\/(n\d+[a-z]+)/)[1];
					hiddenTarget = "";
				}
				else{
					ncode = myFavorite.parentNode.firstElementChild.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
					if(!HIDDEN_TYPE){
						hiddenTarget = myFavorite.parentNode;
					}
					else{
						hiddenTarget = myFavorite.parentNode.lastElementChild;
					}
				}
				break;
			case 3:
				//3:ランキングBEST5
				ncode = myFavorite.parentNode.children[1].getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				userId = myFavorite.previousElementSibling.firstElementChild.getAttribute('href').match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];

				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode;
				}
				else{
					hiddenTarget = "";
				}
				break;
			case 4:
				//4:ランキングリスト
				ncode = myFavorite.previousElementSibling.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				userId = myFavorite.parentNode.parentNode.lastElementChild.firstElementChild.firstElementChild.firstElementChild.children[1].getAttribute('href').match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode.parentNode;
				}
				else{
					hiddenTarget = myFavorite.parentNode.parentNode.lastElementChild.firstElementChild.lastElementChild;
				}
				break;
			case 5:
				//5:検索画面
				ncode = myFavorite.previousElementSibling.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				userId = myFavorite.parentNode.parentNode.children[1].getAttribute('href').match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode.parentNode;
				}
				else{
					hiddenTarget = myFavorite.parentNode.parentNode.lastElementChild;
				}
				break;
			case 6:
				//6:なろうトップ
				ncode = myFavorite.parentNode.children[0].getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode;
				}
				else{
					hiddenTarget = "";
				}
				break;
			case 7:
				//7:読もうトップページ
				ncode = myFavorite.parentNode.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode.parentNode;
				}
				else{
					hiddenTarget = myFavorite.parentNode.children[1];
				}
				break;
			case 8:
				//8:小説Pickup!ページ
				ncode = myFavorite.parentNode.firstElementChild.firstElementChild.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				userId = myFavorite.parentNode.firstElementChild.children[1].getAttribute('href').match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode;
				}
				else{
					hiddenTarget = myFavorite.parentNode.lastElementChild;
				}
				break;
			case 9:
				//9:未感想・未評価作品一覧ページ
				ncode = myFavorite.parentNode.firstElementChild.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				userId = myFavorite.parentNode.children[3].getAttribute('href').match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode.parentNode;
				}
				else{
					hiddenTarget = myFavorite.parentNode.lastElementChild;
				}
				break;
			case 10:
				//10:履歴
				ncode = myFavorite.parentNode.firstElementChild.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode;
				}
				else{
					hiddenTarget = myFavorite.parentNode.lastElementChild;
				}
				break;
			case 11:
				//11:マイページ トップ
				ncode = myFavorite.parentNode.firstElementChild.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode.parentNode.parentNode.parentNode.parentNode;
				}
				else{
					hiddenTarget = myFavorite.parentNode.parentNode.parentNode.lastElementChild;
				}
				break;
			case 12:
			case 14:
				//マイページ 12:作品 14:評価
				ncode = myFavorite.parentNode.firstElementChild.firstElementChild.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode;
				}
				else{
					hiddenTarget = myFavorite.parentNode.lastElementChild;
				}
				break;
			case 13:
				//13:マイページ ブックマーク
				ncode = myFavorite.parentNode.firstElementChild.firstElementChild.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				writer = myFavorite.parentNode.children[2].firstElementChild;
				if(writer){
					userId = writer.getAttribute('href').match(/^http:\/\/mypage\.syosetu\.com\/(\d+)/)[1];
				}
				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode;
				}
				else{
					hiddenTarget = myFavorite.parentNode.lastElementChild;
				}
				break;
			case 15:
				//15:マイページ レビュー
				ncode = myFavorite.parentNode.children[1].firstElementChild.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];
				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode;
				}
				else{
					hiddenTarget = myFavorite.parentNode.lastElementChild;
				}
				break;
			default:
				break;
		}
		return {"ncode":ncode,"userId":userId,"hiddenTarget":hiddenTarget};
	}

	function onclickNovelTag(node){
		var data = findByNovelTag(node.parentNode);

		var myFavorite = node.parentNode;
		var ncode = data.ncode;
		var elements = myFavorite.children;
		var hiddenTarget = data.hiddenTarget;
		var userId = data.userId;

		var n;
		if(node.title==text3[0]){
			n = 0;
		}
		else if(node.title==text3[1]){
			n = 1;
		}
		else if(node.title==text3[2]){
			n = 2;
		}
		else if(node.title==text3[3]){
			n = 3;
		}
		else if(node.title==text3[4]){
			n = 4;
		}
		var i;
		if(myFavorite.classList.contains('closed')){
			if(hiddenTarget!==""){
				hiddenTarget.classList.remove("hidden");
			}
			for(i=0;i<5;i++){
				elements[i].classList.remove("hidden");
				elements[i].classList.remove("selected");
			}
			elements[getNovelTag(ncode)].classList.add("selected");
			myFavorite.classList.remove("closed");
		}
		else{
			var items;
			switch(website){
				case 3:
					//3:ランキングBEST5
					items = document.evaluate('//*[contains(@href,"http://ncode.syosetu.com/'+ncode+'")]/parent::node()/div[contains(@class,"my_favorite")]',document,null,7,null);
					break;
				default:
					updateMyFavorite(myFavorite,n);
					break;
			}
			for(i=0;i<items.snapshotLength;i++){
				updateMyFavorite(items.snapshotItem(i),n);
			}
			myFavorite.classList.add("closed");
		}
	}

	function updateMyFavorite(node,novelTag){
		var data = findByNovelTag(node);

		var myFavorite = node;
		var ncode = data.ncode;
		var elements = myFavorite.children;
		var hiddenTarget = data.hiddenTarget;
		var userId = data.userId;

		var i = 0;
		//クリックされたときに要素のクラスを変える
		if(!DISPLAY_TYPE){
			if(hiddenTarget!==""){
				if(!novelTag){
					if(getWriterTag(userId)==1){
						hiddenTarget.classList.add("hidden");
					}
					else{
						hiddenTarget.classList.remove("hidden");
					}
				}
				else if(novelTag==4){
					hiddenTarget.classList.add("hidden");
				}
				else{
					hiddenTarget.classList.remove("hidden");
				}
			}
			for(i=0;i<5;i++){
				elements[i].classList.remove("selected");
			}
			setNovelTag(ncode,novelTag);
			elements[novelTag].classList.add("selected");
		}
		else{
			if(hiddenTarget!==""){
				if(!novelTag){
					if(getWriterTag(userId)==1){
						hiddenTarget.classList.add("hidden");
					}
					else{
						hiddenTarget.classList.remove("hidden");
					}
				}
				else if(novelTag==4){
					hiddenTarget.classList.add("hidden");
				}
				else{
					hiddenTarget.classList.remove("hidden");
				}
			}
			for(i=0;i<5;i++){
				elements[i].classList.remove("selected");
				elements[i].classList.add("hidden");
			}
			setNovelTag(ncode,novelTag);
			elements[novelTag].classList.add("selected");
			elements[novelTag].classList.remove("hidden");
			myFavorite.classList.add("closed");
		}
	}

	//クラスmy_favoriteとその中身を作成
	function makeMyFavorite(n){

		var myFavorite = document.createElement("div");
		myFavorite.classList.add('my_favorite');
		var elements = [];
		var textnode = [];

		for(var i = 0; i < 5;i++){
			elements[i] = document.createElement("a");
			elements[i].setAttribute('href','javascript:void(0)');
			elements[i].setAttribute('title',text3[i]);
			textnode[i]= document.createTextNode(text[i]);
			elements[i].appendChild(textnode[i]);
			myFavorite.appendChild(elements[i]);

			//タグのテキストにselectedクラスを追加
			if(i==n){
				elements[i].classList.add("selected");
			}
			else{
				//非表示にする要素にhiddenクラスを追加
				if(DISPLAY_TYPE){
					elements[i].classList.add("hidden");
				}
			}
			elements[i].addEventListener('click',function(evt){
				var node = evt.target;
				onclickNovelTag(node);
			}, false);
		}
		if(DISPLAY_TYPE){
			myFavorite.classList.add("closed");
		}
		return myFavorite;
	}

	//マイページのブックマークページを取得する
	function getBookmarkpage(nowcategory,n){
		var items;
		var item;

		GM_xmlhttpRequest({
			method: 'GET',
			url: "http://syosetu.com/favnovelmain/list/",
			onload: function(response) {

				var range = document.createRange();
				range.setStartAfter(document.body);
				var xhr_frag = range.createContextualFragment(response.responseText);
				var xhr_doc = document.implementation.createDocument(null, 'html', null);
				xhr_doc.adoptNode(xhr_frag);
				xhr_doc.documentElement.appendChild(xhr_frag);
				items = xhr_doc.evaluate("//*[@id='sub']/*[@class='category_box']/*/*", xhr_doc, null, 7, null);

				var category = [];
				for (var i = 0; i < items.snapshotLength; i++){
					item = items.snapshotItem(i);
					var d = item.getAttribute('href').match(/nowcategory=(\d+)/);
					var num = item.textContent.match(/\((\d+)\)$/);
					if(d){
						category[parseInt(d[1],10)] = Math.ceil(parseInt(num[1],10)/50);
					}
				}
				var t;
				if(!nowcategory){
					nowcategory=1;
					t = category.length-1;
				}
				else{
					t=1;
				}

				var urlList = [];
				for(var j = nowcategory;j<nowcategory+t;j++){
					for(var k = 1;k < category[j]+1;k++){
						urlList[urlList.length] = "http://syosetu.com/favnovelmain/list/index.php?nowcategory="+ j +"&order=newlist&p=" + k;
					}
				}
				regBookmark(urlList,n);
			}
		});
	}

	//ブックーマークのNコードを抽出して登録する
	function regBookmark(urlList,n){
		var i = 0;
		function loop() {
			var targetUrl;
			var items;
			var item;
			var ncode;
			targetUrl = urlList[i];
			GM_xmlhttpRequest({
				method: 'GET',
				url: targetUrl,
				onload: function(response) {
					var range = document.createRange();
					range.setStartAfter(document.body);
					var xhr_frag = range.createContextualFragment(response.responseText);
					var xhr_doc = document.implementation.createDocument(null, 'html', null);
					xhr_doc.adoptNode(xhr_frag);
					xhr_doc.documentElement.appendChild(xhr_frag);
					items = xhr_doc.evaluate("//*[@class='fn_name']", xhr_doc, null, 7, null);

					for (var j = 0; j < items.snapshotLength; j++){
						item = items.snapshotItem(j);
						ncode = item.parentNode.firstElementChild.getAttribute('href').match(/\/(n\d+[a-z]+)/)[1];

						//設定済みNコードをスキップ
						if(n<5){
							if(!getNovelTag(ncode)){
								setNovelTag(ncode,n);
							}
						}
						//タグを上書き
						else{
							setNovelTag(ncode,n-10);
						}
					}
				}
			});
			i++;
			var id = setTimeout(loop,100);
			if(i>=urlList.length){
				clearTimeout(id);
			}
		}
		if(urlList.length){
			loop();
		}
	}
	//保存したデータをすべて削除する
	function deleteAll(){
		var keys = GM_listValues();
		for (var i=0, key=null; key=keys[i]; i++) {
			GM_deleteValue(key);
		}
	}

	//マイページに各種リンクを追加
	function addLink(){

		var element = [];
		var textnode = [];
		var targetNode = document.getElementById('header');

		stylesheet.insertRule("#header .myMenu{padding:5px;}", stylesheet.cssRules.length);
		var div = document.createElement("div");
		div.classList.add("myMenu");

		//ブックマークを取得
		element[0] = document.createElement("a");
		element[0].setAttribute('href','javascript:void(0)');
		textnode[0]= document.createTextNode('[ブックマークを取得]');
		element[0].appendChild(textnode[0]);
		div.appendChild(element[0]);
		element[0].addEventListener('click',function(){
			var category = window.prompt("取得するブックマークのカテゴリ番号を入力\n0:全て 1～10:カテゴリ1～10");
			category = parseInt(category,10);
			switch(category){
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
				case 9:
				case 10:
					var n = window.prompt("数字を入力(1～4,11～14)\n\タグ設定済みNコードはスキップして登録\n1:お気に入り 2:後で読む 3:読まない 4:非表示\n\nタグを上書きして登録\n11:お気に入り 12:後で読む 13:読まない 14:非表示");
					n = parseInt(n,10);
					switch(n){
						case 1:
						case 2:
						case 3:
						case 4:
						case 11:
						case 12:
						case 13:
						case 14:
							getBookmarkpage(category,n);
							break;
						default:
							break;
					}
					break;
				default:
					break;
			}
		}, false);

		//保存データを削除
		element[1] = document.createElement("a");
		element[1].setAttribute('href','javascript:void(0)');
		textnode[1] = document.createTextNode('[保存データを削除]');
		element[1].appendChild(textnode[1]);
		div.appendChild(element[1]);
		element[1].addEventListener('click',function(){
			var d = window.prompt("保存データを削除します\n1:お気に入り 2:後で読む 3:読まない 4:非表示 5:作者(非表示) 99:全て");
			d = parseInt(d,10);
			switch(d){
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
					deleteTag(d);
					break;
				case 99:
					deleteAll();
					break;
				default:
					break;
			}
		}, false);

		//登録済みNコードを表示
		element[2] = document.createElement("a");
		element[2].setAttribute('href','javascript:void(0)');
		textnode[2]= document.createTextNode('[Nコードを表示]');
		element[2].appendChild(textnode[2]);
		div.appendChild(element[2]);

		element[2].addEventListener('click',function(){
			showNCode();
		}, false);

		//Nコードを登録
		element[3] = document.createElement("a");
		element[3].setAttribute('href','javascript:void(0)');
		textnode[3]= document.createTextNode('[Nコードを登録]');
		element[3].appendChild(textnode[3]);
		div.appendChild(element[3]);

		element[3].addEventListener('click',function(){
			var n = window.prompt("数字を入力(1～4,11～14)\n\タグ設定済みNコードはスキップして登録\n1:お気に入り 2:後で読む 3:読まない 4:非表示\n\nタグを上書きして登録\n11:お気に入り 12:後で読む 13:読まない 14:非表示", "");
			n = parseInt(n,10);
			switch(n){
				case 1:
				case 2:
				case 3:
				case 4:
				case 11:
				case 12:
				case 13:
				case 14:
					var str = window.prompt("NコードまたはURLを貼り付け(複数可)", "");
					regNCode(str,n);
					break;
				default:
					break;
			}
		}, false);

		targetNode.appendChild(div);
	}

	//文字列からNコードを抜き出して登録する
	function regNCode(inputStr,n){
		var str = inputStr.match(/(n\d+[a-z]+)/gi);
		if(str){
			var ncodeList = Array.from(new Set(str));
			var ncode;

			for(var i=0;i<ncodeList.length;i++){
				ncode =  ncodeList[i].toLowerCase();

				//設定済みNコードをスキップ
				if(n<5){
					if(!getNovelTag(ncode)){
						setNovelTag(ncode,n);
					}
				}
				//タグを上書き
				else{
					setNovelTag(ncode,n-10);
				}
			}
		}
	}

	//登録済みNコードの一覧を表示
	function showNCode(){
		var keys = GM_listValues();
		var win = window.open();
		var t=0;
		var c = [0,0,0,0,0];
		for(var i=1;i<5;i++){
			switch(i){
				case 1:
					win.document.write('----------[お気に入り]----------' + '<br>');
					break;
				case 2:
					win.document.write('----------[後で読む]----------' + '<br>');
					break;
				case 3:
					win.document.write('----------[読まない]----------' + '<br>');
					break;
				case 4:
					win.document.write('----------[非表示]----------' + '<br>');
					break;
				default:
					break;
			}
			for (var j=0, key=null; key=keys[j]; j++) {
				if(getNovelTag(key)==i){
					win.document.write('<a href="http://ncode.syosetu.com/'+key+'" target="_blank">'+key +'</a>'+ '<br>');
					c[i]++;
					t++;
				}
			}
		}
		win.document.write('-----[お気に入り]:'+c[1]+' [後で読む]:'+c[2]+' [読まない]:'+c[3]+' [非表示]:'+c[4]+' 総数:'+t+'-----' + '<br>');
		win.document.write('----------[作者(非表示)]----------' + '<br>');
		for (var j=0, key=null; key=keys[j]; j++) {
			if(getNovelTag(key)==5){
				win.document.write('<a href="http://mypage.syosetu.com/'+key+'" target="_blank">'+key +'</a>'+ '<br>');
				c[0]++;
			}
		}
		win.document.write('-----[作者(非表示)]:'+c[0]+'-----' + '<br>');

		win.document.close();
	}

	//指定したタグのNコードを削除する
	function deleteTag(n){
		var keys = GM_listValues();

		for (var i=0, key=null; key=keys[i]; i++) {
			var tag = getNovelTag(key);
			if(tag==n){
				GM_deleteValue(key);
			}
		}
	}

	var website = getLocation();
	setText();
	beforeCreateTag();
	var func;
	if(website>0){
		document.body.addEventListener('AutoPagerize_DOMNodeInserted',func=function(evt){
			var node = evt.target;
			createTag(node);
		}, false);
		createTag(document);
	}
})();