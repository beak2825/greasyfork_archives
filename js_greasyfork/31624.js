// ==UserScript==
// @name         カクヨムタグ付けスクリプト
// @namespace    https://greasyfork.org/users/135410
// @version      0.1
// @description  カクヨムの小説や作者にタグを付ける
// @match        https://kakuyomu.jp/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/31624/%E3%82%AB%E3%82%AF%E3%83%A8%E3%83%A0%E3%82%BF%E3%82%B0%E4%BB%98%E3%81%91%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/31624/%E3%82%AB%E3%82%AF%E3%83%A8%E3%83%A0%E3%82%BF%E3%82%B0%E4%BB%98%E3%81%91%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
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
	stylesheet.insertRule("#content a.selected:link{color:#ff0000;}", stylesheet.cssRules.length);
	stylesheet.insertRule("#container a.selected:link{color:#ff0000;}", stylesheet.cssRules.length);

	stylesheet.insertRule("#container div.my_favorite a:link{font-size:13px;}", stylesheet.cssRules.length);

	stylesheet.insertRule(".my_container .my_favorite.closed{opacity:0.7;}", stylesheet.cssRules.length);
	stylesheet.insertRule(".isPC .widget-workTitle .widget-workTitle-title .my_favorite a.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule(".isPC .widget-workTitle .widget-workTitle-title .my_author a.hidden{display:none;}", stylesheet.cssRules.length);

	//クラスhiddenの要素を非表示にする
	stylesheet.insertRule("div.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule("table.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule("li.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule("a.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule("span.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule(".hidden{display:none;}", stylesheet.cssRules.length);

	//作者用タグの要素をインラインにする
	stylesheet.insertRule("div.my_author {display:inline;}", stylesheet.cssRules.length);

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

	//ページの場所 1:カクヨム全般 2:特集 3:小説トップ 4:小説ページ
	function getLocation(){
		if(currentUrl.match(/^https:\/\/kakuyomu\.jp/)){
			//2:特集
			if(currentUrl.match(/features/)){
				return 2;
			}
			//3:小説トップ
			else if(currentUrl.match(/^https:\/\/kakuyomu\.jp\/works\/\d+\/?(#.+)?$/)){
				return 3;
			}
			//4:小説ページ
			else if(currentUrl.match(/^https:\/\/kakuyomu\.jp\/works\/\d+\/episodes\/\d+(#p\d+)?$/)){
				return 4;
			}
			//5:アンテナ
			else if(currentUrl.match(/my\/antenna\/works/)||currentUrl.match(/reading_histories/)){
				return 5;
			}
			//1:カクヨム全般
			else{
				return 1;
			}
		}
		else{
			return -1;
		}
	}

	function makeMyAuthor(n){

		var myAuthor = document.createElement("div");
		myAuthor.classList.add('my_author');
		var elements = [];
		var textnode = [];
		for(var i = 0; i < 2;i++){
			elements[i] = document.createElement("a");
			elements[i].setAttribute('href','javascript:void(0)');
			elements[i].setAttribute('title',text5[i]);
			textnode[i]= document.createTextNode(text4[i]);
			elements[i].appendChild(textnode[i]);
			myAuthor.appendChild(elements[i]);

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
				onclickAuthorTag(node);
			}, false);
		}
		if(DISPLAY_TYPE){
			myAuthor.classList.add("closed");
		}
		return myAuthor;

	}

	//小説にタグを設定する
	function setNovelTag(novelId,n){
		var datalist = JSON.parse(localStorage.getItem("kw_"+novelId));
		if(n>0){
			if(!datalist){
				datalist={};
				datalist = {"tag": n};
			}
			else{
				datalist.tag = n;

			}
			localStorage.setItem("kw_"+novelId,JSON.stringify(datalist));
		}
		else{
			if(datalist.page===undefined){
				localStorage.removeItem("kw_"+novelId);
			}
			else{
				localStorage.setItem("kw_"+novelId,JSON.stringify(datalist));
			}
		}
	}

	//小説のタグを取得する
	function getNovelTag(novelId){
		var datalist = JSON.parse(localStorage.getItem("kw_"+novelId));
		var n;
		if(!datalist){
			n= 0;
		}
		else{
			n = datalist.tag;
		}
		return n;
	}
	//作者にタグを設定する
	function setAuthorTag(authorId,n){
		if(!n){
			localStorage.removeItem("ka_"+authorId);
		}
		else{
			localStorage.setItem("ka_"+authorId,JSON.stringify(n));
		}
	}

	//作者のタグを取得する
	function getAuthorTag(authorId){
		var datalist = JSON.parse(localStorage.getItem("ka_"+authorId));
		var n;
		if(!datalist){
			n= 0;
		}
		else{
			n = datalist;
		}
		return n;
	}
	//createTagを呼ぶ前に一度だけ実行する
	function beforeCreateTag(){
		var element;
		var authorId;
		var novelId;
		var myAuthor;
		var items;
		var item;
		var str;
		var n;
		var headerMyFavorite;
		var myContainer;

		switch(website){
			case 1:
				if(currentUrl.match(/contests/)){
					text = text2;
				}
				break;
			case 2:
				//2:
				stylesheet.insertRule("#page-features-feature.isPC .work-information{margin-left:auto;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#page-features-feature.isPC .work-review{margin-right:30px;}", stylesheet.cssRules.length);
				break;
			case 3:
				stylesheet.insertRule("#globalHeader-pc div.my_favorite a{line-height:25px;padding: 0px 5px;color: #666666;font-weight:bold;display:block;border:1px solid #cccccc;background-color:#eeeeee;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#globalHeader-pc div.my_favorite a.hidden{display:none;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#globalHeader-pc div.my_favorite a.selected:link{color:#ff0000; display:block  !important;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#globalHeader-pc div.my_container {width:92px;position:absolute;right:0px;}", stylesheet.cssRules.length);
				if(TEXT_TYPE){
					stylesheet.insertRule("#globalHeader-pc div.my_container{width:80px ;text-align: center;}", stylesheet.cssRules.length);
				}
				item = document.evaluate('.//span[@id="workAuthor-activityName"]/a[contains(@href, "/users")]',document,null,9,null).singleNodeValue;
				authorId = item.getAttribute('href').match(/users\/([0-9a-zA-Z_\-]+)$/)[1];
				novelId = currentUrl.match(/^https:\/\/kakuyomu\.jp\/works\/(\d+)/)[1];

				n = getNovelTag(novelId);
				myAuthor = makeMyAuthor(getAuthorTag(authorId));
				item.parentNode.appendChild(myAuthor);

				headerMyFavorite = makeMyFavorite(n);
				myContainer = document.getElementsByClassName("my_container")[0];
				if(!myContainer){
					myContainer = document.createElement('div');
					myContainer.setAttribute('class','my_container');
					myContainer.appendChild(headerMyFavorite);
				}
				else{
					myContainer.insertBefore(headerMyFavorite,myContainer.lastElementChild);
				}
				document.getElementById("globalHeader-pc").appendChild(myContainer);
				break;
			case 4:
				stylesheet.insertRule("#worksEpisodesEpisodeHeader div.my_favorite a{line-height:25px;padding: 0px 5px;color: #666666;font-weight:bold;display:block;border:1px solid #cccccc;background-color:#eeeeee;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#worksEpisodesEpisodeHeader div.my_favorite a.hidden{display:none;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#worksEpisodesEpisodeHeader div.my_favorite a.selected:link{color:#ff0000; display:block  !important;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#worksEpisodesEpisodeHeader div.my_container {width:92px;position:absolute;right:0px;}", stylesheet.cssRules.length);
				if(TEXT_TYPE){
					stylesheet.insertRule("#worksEpisodesEpisodeHeader div.my_container{width:80px ;text-align: center;}", stylesheet.cssRules.length);
				}
				var request;
				request = new XMLHttpRequest();
				request.open("GET", currentUrl.match(/^(https:\/\/kakuyomu\.jp\/works\/\d+)/)[1], true);
				request.responseType = "document";
				request.send(null);
				request.onreadystatechange = function() {
					if (request.readyState == 4 && request.status == 200) {

						item = request.response.evaluate('//span[@id="workAuthor-activityName"]/a[contains(@href, "/users")]',request.response,null,9,null).singleNodeValue;
						authorId = item.getAttribute('href').match(/users\/([0-9a-zA-Z_\-]+)$/)[1];
						novelId = currentUrl.match(/^https:\/\/kakuyomu\.jp\/works\/(\d+)/)[1];

						n = getNovelTag(novelId);

						sessionStorage.setItem("authorId",authorId);
						headerMyFavorite = makeMyFavorite(n);
						myContainer = document.getElementsByClassName("my_container")[0];
						if(!myContainer){
							myContainer = document.createElement('div');
							myContainer.setAttribute('class','my_container');
							myContainer.appendChild(headerMyFavorite);
						}
						else{
							myContainer.insertBefore(headerMyFavorite,myContainer.lastElementChild);
						}
						document.getElementById("worksEpisodesEpisodeHeader").appendChild(myContainer);
					}
				};
				var func2;
				var b = document.evaluate('//button[@id="sidebar-button"]',document,null,9,null).singleNodeValue;
				b.addEventListener('click',func2=function(evt){
					setTimeout(function(){
						var node = evt.target;
						item = document.evaluate('//header[@class="contentAside-sectionHeader"]/h4/a[contains(@href, "/users")]',document,null,9,null).singleNodeValue;
						authorId = item.getAttribute('href').match(/users\/([0-9a-zA-Z_\-]+)$/)[1];
						myAuthor = makeMyAuthor(getAuthorTag(authorId));
						item.parentNode.appendChild(myAuthor);
						updateHeader(document);
						b.removeEventListener('click', func2, false);
					}, 500);
				}, false);
				break;
			case 5:
				items = document.evaluate('.//*[contains(@class,"-title")]/span[contains(@class, "-author")]/a[contains(@href, "/users")]',document,null,7,null);
				createTag(document,items);
				break;
			default:
				break;
		}
	}
	//createTagを呼ぶ関数
	function callCreateTag(node){
		var element;
		var authorId;
		var myAuthor;
		var items;
		var item;
		var str;

		switch(website){
			case 1:
				//1:小説トップ
				items = document.evaluate('.//*[contains(@class,"-title")]/span[contains(@class, "-author")]/a[contains(@href, "/users")]',node,null,7,null);
				createTag(node,items);
				break;
			case 2:
				//2:
				items = document.evaluate('.//div[@class="work-information"]/p[@class="work-author"]/a[contains(@href, "/users")]',node,null,7,null);
				createTag(node,items);
				break;
			case 3:
				items = document.evaluate('.//*[contains(@class,"-title")]/span[contains(@class, "-author")]/a[contains(@href, "/users")]',node,null,7,null);
				createTag(node,items);
				break;
			case 4:
				updateHeader(node);
				break;
			case 5:
				items = document.evaluate('.//a[@class="widget-antennaList-workInfo"]',node,null,7,null);
				createTag(node,items);
				break;
			default:
				break;
		}
	}
	function findTarget(item){
		var str = ["widget-workTitle-workColor","widget-workBox","widget-top-recentReview","recentReviews-item","widget-work","widget-workTitle","work","widget-workCard","textualReviews-item","selectedWorkReview","widget-antennaList-item"];
		for(var i=0;i<6;i++){
			item = item.parentNode;
			for(var j=0;j<str.length;j++){
				if(item.classList.contains(str[j])){
					return item;
				}
			}
		}
		return "";
	}
	//タグ付け機能を追加する
	function createTag(node,items){
		var item = "";
		var str;
		//ページ内のすべての小説情報を処理
		for(var i=0;i<items.snapshotLength;i++){
			item = items.snapshotItem(i);
			str = item.getAttribute('href').match(/users\/([0-9a-zA-Z_\-]+)$/);
			if(!str){
				str = item.getAttribute('href').match(/works\/(\d+)$/);
			}
			var authorId;
			var novelId;
			if(str){
				authorId = str[1];
				if(website==1){
					novelId = item.parentNode.parentNode.firstElementChild.getAttribute('href').match(/works\/(\d+)$/)[1];
				}
				else if(website==2){
					novelId = item.parentNode.previousElementSibling.firstElementChild.getAttribute('href').match(/works\/(\d+)$/)[1];
				}
				else if(website==3){
					novelId = item.parentNode.parentNode.firstElementChild.getAttribute('href').match(/works\/(\d+)$/)[1];
				}
				else if(website==5){
					if(item.getAttribute('href').match(/works\/(\d+)$/)){
						authorId = "";
						novelId = str[1];
					}
					else{
						novelId = item.parentNode.parentNode.firstElementChild.getAttribute('href').match(/works\/(\d+)$/)[1];
					}
				}

				var myFavorite;
				var div;
				var ul;
				var targetNode;
				var j;
				var n;
				var hiddenTarget = [];
				var myAuthor;

				//非表示にする要素を指定、myFavoriteを追加
				switch(website){
					case 1:
						//1:小説トップ
						if(!HIDDEN_TYPE){
							hiddenTarget[0] = findTarget(item);
						}
						else{
							hiddenTarget[0] = item.parentNode.parentNode.nextElementSibling;
							if(!item.parentNode.parentNode.parentNode.classList.contains("widget-workTitle")&&!item.parentNode.parentNode.parentNode.classList.contains("widget-workCard")){
								hiddenTarget[1] = item.parentNode.parentNode.parentNode.previousElementSibling;
							}
							hiddenTarget[2] = hiddenTarget[0].nextElementSibling;
						}
						n = getNovelTag(novelId);
						myFavorite = makeMyFavorite(n);
						myAuthor = makeMyAuthor(getAuthorTag(authorId));
						item.parentNode.appendChild(myAuthor);
						item.parentNode.parentNode.appendChild(myFavorite);
						break;
					case 2:
						//2:
						if(!HIDDEN_TYPE){
							hiddenTarget[0] = findTarget(item);
						}
						else{
							hiddenTarget[0] = item.parentNode.parentNode.previousElementSibling;
							hiddenTarget[1] = item.parentNode.nextElementSibling;
							hiddenTarget[2] = item.parentNode.nextElementSibling.nextElementSibling;
						}
						n = getNovelTag(novelId);
						myFavorite = makeMyFavorite(n);
						myAuthor = makeMyAuthor(getAuthorTag(authorId));
						item.parentNode.appendChild(myAuthor);
						item.parentNode.parentNode.insertBefore(myFavorite,item.parentNode.nextElementSibling);
						break;
					case 3:
						//3:小説トップ
						if(!HIDDEN_TYPE){
							hiddenTarget[0] = findTarget(item);
						}
						else{
							hiddenTarget[0] = item.parentNode.parentNode.nextElementSibling;
							if(!item.parentNode.parentNode.parentNode.classList.contains("widget-workTitle")&&!item.parentNode.parentNode.parentNode.classList.contains("widget-workCard")){
								hiddenTarget[1] = item.parentNode.parentNode.parentNode.previousElementSibling;
							}
							hiddenTarget[2] = hiddenTarget[0].nextElementSibling;
						}
						n = getNovelTag(novelId);
						myFavorite = makeMyFavorite(n);
						myAuthor = makeMyAuthor(getAuthorTag(authorId));
						item.parentNode.appendChild(myAuthor);
						item.parentNode.parentNode.appendChild(myFavorite);
						break;
					case 5:
						//1:小説トップ
						if(authorId !== ""){
							if(!HIDDEN_TYPE){
								hiddenTarget[0] = findTarget(item);
							}
							else{
								hiddenTarget[0] = item.parentNode.parentNode.nextElementSibling;
								if(!item.parentNode.parentNode.parentNode.classList.contains("widget-workTitle")&&!item.parentNode.parentNode.parentNode.classList.contains("widget-workCard")){
									hiddenTarget[1] = item.parentNode.parentNode.parentNode.previousElementSibling;
								}
								hiddenTarget[2] = hiddenTarget[0].nextElementSibling;
							}
							n = getNovelTag(novelId);
							myFavorite = makeMyFavorite(n);
							myAuthor = makeMyAuthor(getAuthorTag(authorId));
							item.parentNode.appendChild(myAuthor);
							item.parentNode.parentNode.appendChild(myFavorite);
						}
						else{
							if(!HIDDEN_TYPE){
								hiddenTarget[0] = findTarget(item);
							}
							else{
								hiddenTarget[0] = item.parentNode.lastElementChild;
								hiddenTarget[1] = item.lastElementChild.lastElementChild;
								hiddenTarget[2] = item.lastElementChild.lastElementChild.previousElementSibling;
							}
							n = getNovelTag(novelId);
							myFavorite = makeMyFavorite(n);
							item.lastElementChild.insertBefore(myFavorite,item.lastElementChild.firstElementChild.nextElementSibling);
						}
						break;
					default:
						hiddenTarget[0] = "";
						item = "";
						break;
				}

				if(hiddenTarget[0]!==""){
					var m = getAuthorTag(authorId);
					if(!n){
						if(m==1){
							editClass(hiddenTarget,'add');
						}
					}
					else if(n==4){
						editClass(hiddenTarget,'add');
					}
				}
			}
		}
	}

	function editClass(hiddenTarget,str){
		var i;
		if(hiddenTarget[0]){
			if(str=='add'){
				for(i=0;i<hiddenTarget.length;i++){
					if(hiddenTarget[i]){
						hiddenTarget[i].classList.add("hidden");
					}
				}
			}
			else if(str=='remove'){
				for(i=0;i<hiddenTarget.length;i++){
					if(hiddenTarget[i]){
						hiddenTarget[i].classList.remove("hidden");
					}
				}
			}
		}
	}

	function findByAuthorTag(node){

		var myAuthor = node;
		var authorId;
		var novelId;
		var elements = myAuthor.children;
		var hiddenTarget = [];
		var str;

		//作者、小説IDを取得、非表示にする要素を指定
		switch(website){
			case 1:
				//1:小説トップ
				str = myAuthor.parentNode.firstElementChild.getAttribute('href').match(/users\/([0-9a-zA-Z_\-]+)$/);
				authorId = str[1];
				str = myAuthor.parentNode.parentNode.firstElementChild.getAttribute('href').match(/works\/(\d+)$/);
				novelId = str[1];
				if(!HIDDEN_TYPE){
					hiddenTarget[0] = findTarget(myAuthor);
				}
				else{
					hiddenTarget[0] = myAuthor.parentNode.parentNode.nextElementSibling;
					if(!myAuthor.parentNode.parentNode.parentNode.classList.contains("widget-workTitle")&&!myAuthor.parentNode.parentNode.parentNode.classList.contains("widget-workCard")){
						hiddenTarget[1] = myAuthor.parentNode.parentNode.parentNode.previousElementSibling;
					}
					hiddenTarget[2] = hiddenTarget[0].nextElementSibling;
				}
				break;
			case 2:
				//2:小説トップ
				str = myAuthor.parentNode.firstElementChild.getAttribute('href').match(/users\/([0-9a-zA-Z_\-]+)$/);
				authorId = str[1];
				str = myAuthor.parentNode.previousElementSibling.firstElementChild.getAttribute('href').match(/works\/(\d+)$/);
				novelId = str[1];
				if(!HIDDEN_TYPE){
					hiddenTarget[0] = findTarget(myAuthor);
				}
				else{
					hiddenTarget[0] = myAuthor.parentNode.parentNode.previousElementSibling;
					hiddenTarget[1] = myAuthor.parentNode.nextElementSibling.nextElementSibling;
					hiddenTarget[2] = myAuthor.parentNode.nextElementSibling.nextElementSibling.nextElementSibling;
				}
				break;
			case 3:
				//1:小説トップ
				if(myAuthor.parentNode.classList.contains('widget-workCatchphrase-author')){
					str = myAuthor.parentNode.firstElementChild.getAttribute('href').match(/users\/([0-9a-zA-Z_\-]+)$/);
					authorId = str[1];
					str = myAuthor.parentNode.parentNode.firstElementChild.getAttribute('href').match(/works\/(\d+)$/);
					novelId = str[1];
					if(!HIDDEN_TYPE){
						hiddenTarget[0] = findTarget(myAuthor);
					}
					else{
						hiddenTarget[0] = myAuthor.parentNode.parentNode.nextElementSibling;
						if(!myAuthor.parentNode.parentNode.parentNode.classList.contains("widget-workTitle")&&!myAuthor.parentNode.parentNode.parentNode.classList.contains("widget-workCard")){
							hiddenTarget[1] = myAuthor.parentNode.parentNode.parentNode.previousElementSibling;
						}
						hiddenTarget[2] = hiddenTarget[0].nextElementSibling;
					}
				}
				else{
					str = myAuthor.parentNode.firstElementChild.getAttribute('href').match(/users\/([0-9a-zA-Z_\-]+)$/);
					authorId = str[1];
					novelId = currentUrl.match(/^https:\/\/kakuyomu\.jp\/works\/(\d+)/)[1];
					hiddenTarget[0] = "";
				}
				break;
			case 4:
				str = myAuthor.previousElementSibling.getAttribute('href').match(/users\/([0-9a-zA-Z_\-]+)$/);
				authorId = str[1];
				novelId = currentUrl.match(/^https:\/\/kakuyomu\.jp\/works\/(\d+)/)[1];
				hiddenTarget[0] = "";
				break;
			case 5:
				//1:小説トップ
				str = myAuthor.parentNode.firstElementChild.getAttribute('href').match(/users\/([0-9a-zA-Z_\-]+)$/);
				authorId = str[1];
				str = myAuthor.parentNode.parentNode.firstElementChild.getAttribute('href').match(/works\/(\d+)$/);
				novelId = str[1];
				if(!HIDDEN_TYPE){
					hiddenTarget[0] = findTarget(myAuthor);
				}
				else{
					hiddenTarget[0] = myAuthor.parentNode.parentNode.nextElementSibling;
					if(!myAuthor.parentNode.parentNode.parentNode.classList.contains("widget-workTitle")&&!myAuthor.parentNode.parentNode.parentNode.classList.contains("widget-workCard")){
						hiddenTarget[1] = myAuthor.parentNode.parentNode.parentNode.previousElementSibling;
					}
					hiddenTarget[2] = hiddenTarget[0].nextElementSibling;
				}
				break;
			default:
				break;
		}
		return {"novelId":novelId,"authorId":authorId,"hiddenTarget":hiddenTarget};
	}

	function onclickAuthorTag(node){
		var data = findByAuthorTag(node.parentNode);

		var myAuthor = node.parentNode;
		var elements = myAuthor.children;
		var novelId = data.novelId;
		var hiddenTarget = data.hiddenTarget;
		var authorId = data.authorId;


		var n;
		if(node.title==text5[0]){
			n = 0;
		}
		else if(node.title==text5[1]){
			n = 1;
		}

		var i;
		if(myAuthor.classList.contains('closed')){
			if(hiddenTarget[0]!==""){
				editClass(hiddenTarget,'remove');
			}
			for(i=0;i<2;i++){
				elements[i].classList.remove("hidden");
				elements[i].classList.remove("selected");
			}
			elements[getAuthorTag(authorId)].classList.add("selected");
			myAuthor.classList.remove("closed");
		}
		else{
			var items;
			switch(website){
				case 1:
					items = document.evaluate('//*[contains(@href,"/users/'+authorId+'")]/parent::node()/div[contains(@class,"my_author")]',document,null,7,null);
					break;
				case 2:
					items = document.evaluate('//*[contains(@href,"/users/'+authorId+'")]/parent::node()/div[contains(@class,"my_author")]',document,null,7,null);
					break;
				case 3:
					items = document.evaluate('//*[contains(@href,"/users/'+authorId+'")]/parent::node()/div[contains(@class,"my_author")]',document,null,7,null);
					break;
				case 4:
					updateMyAuthor(myAuthor,n);
					break;
				case 5:
					items = document.evaluate('//*[contains(@href,"/users/'+authorId+'")]/parent::node()/div[contains(@class,"my_author")]',document,null,7,null);
					break;
				default:
					break;
			}
			for(i=0;i<items.snapshotLength;i++){
				updateMyAuthor(items.snapshotItem(i),n);
			}
			myAuthor.classList.add("closed");
		}
	}

	function updateMyAuthor(node,authorTag){

		var data = findByAuthorTag(node);
		var myAuthor = node;
		var authorId = data.authorId;
		var novelId = data.novelId;
		var elements = myAuthor.children;
		var hiddenTarget = data.hiddenTarget;

		var i = 0;
		var novelTag = getNovelTag(novelId);
		//クリックされたときに要素のクラスを変える
		if(!DISPLAY_TYPE){
			if(hiddenTarget[0]!==""){
				if(!novelTag){
					if(authorTag==1){
						editClass(hiddenTarget,'add');
					}
					else{
						editClass(hiddenTarget,'remove');
					}
				}
				else if(novelTag==4){
					editClass(hiddenTarget,'add');
				}
				else{
					editClass(hiddenTarget,'remove');
				}
			}
			for(i=0;i<2;i++){
				elements[i].classList.remove("selected");
			}
			setAuthorTag(authorId,authorTag);
			elements[authorTag].classList.add("selected");
		}
		else{
			if(hiddenTarget[0]!==""){
				if(!novelTag){
					if(authorTag==1){
						editClass(hiddenTarget,'add');
					}
					else{
						editClass(hiddenTarget,'remove');
					}
				}
				else if(novelTag==4){
					editClass(hiddenTarget,'add');
				}
				else{
					editClass(hiddenTarget,'remove');
				}
			}
			for(i=0;i<2;i++){
				elements[i].classList.remove("selected");
				elements[i].classList.add("hidden");
			}
			setAuthorTag(authorId,authorTag);
			elements[authorTag].classList.add("selected");
			elements[authorTag].classList.remove("hidden");
			myAuthor.classList.add("closed");
		}
	}

	function findByNovelTag(node){

		var myFavorite = node;
		var novelId;
		var elements = myFavorite.children;
		var hiddenTarget = [];
		var authorId;
		var str;
		var item;
		//作者、小説IDを取得、非表示にする要素を指定
		switch(website){
			case 1:
				//1:小説トップ
				str = myFavorite.parentNode.firstElementChild.getAttribute('href').match(/works\/(\d+)$/);
				novelId = str[1];
				str = myFavorite.previousElementSibling.firstElementChild.getAttribute('href').match(/users\/([0-9a-zA-Z_\-]+)$/);
				authorId = str[1];
				if(!HIDDEN_TYPE){
					hiddenTarget[0] = findTarget(myFavorite);
				}
				else{
					hiddenTarget[0] = myFavorite.parentNode.nextElementSibling;
					if(!myFavorite.parentNode.parentNode.classList.contains("widget-workTitle")&&!myFavorite.parentNode.parentNode.classList.contains("widget-workCard")){
						hiddenTarget[1] = myFavorite.parentNode.parentNode.previousElementSibling;
					}
					hiddenTarget[2] = hiddenTarget[0].nextElementSibling;
				}
				break;
			case 2:
				//1:小説トップ
				str = myFavorite.previousElementSibling.previousElementSibling.firstElementChild.getAttribute('href').match(/works\/(\d+)$/);
				novelId = str[1];
				str = myFavorite.previousElementSibling.firstElementChild.getAttribute('href').match(/users\/([0-9a-zA-Z_\-]+)$/);
				authorId = str[1];
				if(!HIDDEN_TYPE){
					hiddenTarget[0] = findTarget(myFavorite);
				}
				else{
					hiddenTarget[0] = myFavorite.parentNode.previousElementSibling;
					hiddenTarget[1] = myFavorite.nextElementSibling.nextElementSibling;
					hiddenTarget[2] = myFavorite.nextElementSibling.nextElementSibling.nextElementSibling;
				}
				break;
			case 3:
				//1:小説トップ
				if(myFavorite.parentNode.classList.contains('widget-workCatchphrase-title')){
					str = myFavorite.parentNode.firstElementChild.getAttribute('href').match(/works\/(\d+)$/);
					novelId = str[1];
					str = myFavorite.previousElementSibling.firstElementChild.getAttribute('href').match(/users\/([0-9a-zA-Z_\-]+)$/);
					authorId = str[1];
					if(!HIDDEN_TYPE){
						hiddenTarget[0] = findTarget(myFavorite);
					}
					else{
						hiddenTarget[0] = myFavorite.parentNode.nextElementSibling;
						if(!myFavorite.parentNode.parentNode.classList.contains("widget-workTitle")&&!myFavorite.parentNode.parentNode.classList.contains("widget-workCard")){
							hiddenTarget[1] = myFavorite.parentNode.parentNode.previousElementSibling;
						}
						hiddenTarget[2] = hiddenTarget[0].nextElementSibling;
					}
				}
				else{
					item = document.evaluate('//span[contains(@id,"workAuthor-activityName")]/a[contains(@href, "/users")]',document,null,9,null).singleNodeValue;
					authorId = item.getAttribute('href').match(/users\/([0-9a-zA-Z_\-]+)$/)[1];
					novelId = currentUrl.match(/^https:\/\/kakuyomu\.jp\/works\/(\d+)/)[1];
					hiddenTarget[0] = "";
				}
				break;
			case 4:
				authorId = sessionStorage.getItem("authorId");
				novelId = currentUrl.match(/^https:\/\/kakuyomu\.jp\/works\/(\d+)/)[1];
				hiddenTarget[0] = "";
				break;
			case 5:
				//1:小説トップ
				if(myFavorite.parentNode.parentNode.parentNode.parentNode.id=="pickupWorks-workList"){
					str = myFavorite.parentNode.firstElementChild.getAttribute('href').match(/works\/(\d+)$/);
					novelId = str[1];
					str = myFavorite.previousElementSibling.firstElementChild.getAttribute('href').match(/users\/([0-9a-zA-Z_\-]+)$/);
					authorId = str[1];
					if(!HIDDEN_TYPE){
						hiddenTarget[0] = findTarget(myFavorite);
					}
					else{
						hiddenTarget[0] = myFavorite.parentNode.nextElementSibling;
						if(!myFavorite.parentNode.parentNode.classList.contains("widget-workTitle")&&!myFavorite.parentNode.parentNode.classList.contains("widget-workCard")){
							hiddenTarget[1] = myFavorite.parentNode.parentNode.previousElementSibling;
						}
						hiddenTarget[2] = hiddenTarget[0].nextElementSibling;
					}
				}
				else{
					str = myFavorite.parentNode.parentNode.getAttribute('href').match(/works\/(\d+)$/);
					novelId = str[1];
					if(!HIDDEN_TYPE){
						hiddenTarget[0] = findTarget(myFavorite);
					}
					else{
						hiddenTarget[0] = myFavorite.parentNode.parentNode.parentNode.lastElementChild;
						hiddenTarget[1] = myFavorite.parentNode.lastElementChild;
						hiddenTarget[2] = myFavorite.parentNode.lastElementChild.previousElementSibling;
					}
				}
				break;
			default:
				break;
		}
		return {"novelId":novelId,"authorId":authorId,"hiddenTarget":hiddenTarget};
	}

	function onclickNovelTag(node){
		var data = findByNovelTag(node.parentNode);

		var myFavorite = node.parentNode;
		var novelId = data.novelId;
		var elements = myFavorite.children;
		var hiddenTarget = data.hiddenTarget;
		var authorId = data.authorId;

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
			if(hiddenTarget[0]!==""){
				editClass(hiddenTarget,'remove');
			}
			for(i=0;i<5;i++){
				elements[i].classList.remove("hidden");
				elements[i].classList.remove("selected");
			}
			elements[getNovelTag(novelId)].classList.add("selected");
			myFavorite.classList.remove("closed");
		}
		else{
			var items;
			switch(website){
				case 1:
					items = document.evaluate('//*[contains(@href,"/works/'+novelId+'")]/parent::node()/div[contains(@class,"my_favorite")]',document,null,7,null);
					break;
				case 2:
					items = document.evaluate('//*[contains(@href,"/works/'+novelId+'")]/parent::node()/parent::node()/div[contains(@class,"my_favorite")]',document,null,7,null);
					break;
				case 3:
					updateMyFavorite(myFavorite,n);
					items = document.evaluate('//*[contains(@href,"/works/'+novelId+'")]/parent::node()/div[contains(@class,"my_favorite")]',document,null,7,null);
					break;
				case 4:
					updateMyFavorite(myFavorite,n);
					break;
				case 5:
					items = document.evaluate('//*[contains(@href,"/works/'+novelId+'")]/parent::node()/div[contains(@class,"my_favorite")]',document,null,7,null);
					if(items){
						for(i=0;i<items.snapshotLength;i++){
							updateMyFavorite(items.snapshotItem(i),n);
						}
					}
					items = document.evaluate('//*[contains(@href,"/works/'+novelId+'")]/div[contains(@class,"widget-antennaList-workInfoDetail")]/div[contains(@class,"my_favorite")]',document,null,7,null);
					break;
				default:
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
		var novelId = data.novelId;
		var elements = myFavorite.children;
		var hiddenTarget = data.hiddenTarget;
		var authorId = data.authorId;

		var i = 0;
		//クリックされたときに要素のクラスを変える
		if(!DISPLAY_TYPE){
			if(hiddenTarget[0]!==""){
				if(!novelTag){
					if(getAuthorTag(authorId)==1){
						editClass(hiddenTarget,'add');
					}
					else{
						editClass(hiddenTarget,'remove');
					}
				}
				else if(novelTag==4){
					editClass(hiddenTarget,'add');
				}
				else{
					editClass(hiddenTarget,'remove');
				}
			}
			for(i=0;i<5;i++){
				elements[i].classList.remove("selected");
			}
			setNovelTag(novelId,novelTag);
			elements[novelTag].classList.add("selected");
		}
		else{
			if(hiddenTarget[0]!==""){
				if(!novelTag){
					if(getAuthorTag(authorId)==1){
						editClass(hiddenTarget,'add');
					}
					else{
						editClass(hiddenTarget,'remove');
					}
				}
				else if(novelTag==4){
					editClass(hiddenTarget,'add');
				}
				else{
					editClass(hiddenTarget,'remove');
				}
			}
			for(i=0;i<5;i++){
				elements[i].classList.remove("selected");
				elements[i].classList.add("hidden");
			}
			setNovelTag(novelId,novelTag);
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
	function getBookmarkpage(n){
		var item;
		var target = document.evaluate('//li[@class="widget-antennaWorksSelector-settings"]/a[contains(@href,"/users/")]',document,null,9,null).singleNodeValue.getAttribute('href');
		var request = new XMLHttpRequest();
		request.open("GET", "https://kakuyomu.jp"+target, true);
		request.responseType = "document";
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				item = request.response.getElementsByClassName("user-following-count")[0];

				var count = item.textContent.match(/(\d+)/);
				var num = Math.ceil(parseInt(count[1],10)/60);

				var urlList = [];
				for(var i = 0;i<num;i++){
					var p = i+1;
					urlList[i] = "https://kakuyomu.jp" + target + "?page=" + p;
				}
				regBookmark(urlList,n);
			}
		};
		request.send(null);
	}

	//ブックーマークを登録する
	function regBookmark(urlList,n){
		var i = 0;
		function loop() {
			var request = new XMLHttpRequest();
			var targetUrl;
			var items;
			var item;
			var authorId;
			var novelId;
			var str;
			targetUrl = urlList[i];

			request.open("GET", targetUrl, true);
			request.responseType = "document";
			request.onreadystatechange = function() {
				if (request.readyState == 4 && request.status == 200) {

					items = request.response.evaluate('.//h4[@class="widget-workCatchphrase-title"]',request.response,null,7,null);
					for (var j = 0; j < items.snapshotLength; j++){
						item = items.snapshotItem(j);
						str = item.firstElementChild.getAttribute('href').match(/works\/(\d+)/);
						novelId = str[1];
						//設定済みをスキップ
						if(n<5){
							if(!getNovelTag(novelId)){
								setNovelTag(novelId,n);
							}
						}
						//タグを上書き
						else{
							setNovelTag(novelId,n-10);
						}
					}
				}
			};
			request.send(null);

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
		localStorage.clear();
	}

	//指定したタグのデータを削除する
	function deleteTag(n){
		var datalist;
		var keyName;
		if(n<4){
			console.log(localStorage.length);
			for (var i=localStorage.length-1; i>=0; i--) {
				keyName = localStorage.key(i);
				console.log(i+" "+keyName);
				if(keyName.match(/kw_\d+/)){
					datalist =  JSON.parse(localStorage.getItem(keyName));
					if(datalist.tag==n){
						localStorage.removeItem(keyName);
					}
				}
			}
		}
		else{
			for (var j=0; j<localStorage.length; j++) {
				keyName = localStorage.key(j);
				if(keyName.match(/ka_[0-9a-zA-Z_\-]+/)){
					datalist =  JSON.parse(localStorage.getItem(keyName));
					if(datalist==1){
						localStorage.removeItem(keyName);
					}
				}
			}
		}
	}

	//マイページに各種リンクを追加
	function addLink(){

		var element = [];
		var textnode = [];
		var targetNode = document.getElementById('container');

		stylesheet.insertRule(".myMenu{padding:5px;}", stylesheet.cssRules.length);
		var div = document.createElement("div");
		div.classList.add("myMenu");

		//お気に入りを取得
		element[0] = document.createElement("a");
		element[0].setAttribute('href','javascript:void(0)');
		textnode[0]= document.createTextNode('[お気に入りを取得]');
		element[0].appendChild(textnode[0]);
		div.appendChild(element[0]);
		element[0].addEventListener('click',function(){
			var n = window.prompt("数字を入力(1～4,11～14)\n\タグ設定済みはスキップして登録\n1:お気に入り 2:後で読む 3:読まない 4:非表示\n\nタグを上書きして登録\n11:お気に入り 12:後で読む 13:読まない 14:非表示");
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
					getBookmarkpage(n);
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

		//登録済みデータを表示
		element[2] = document.createElement("a");
		element[2].setAttribute('href','javascript:void(0)');
		textnode[2]= document.createTextNode('[登録済みデータを表示]');
		element[2].appendChild(textnode[2]);
		div.appendChild(element[2]);

		element[2].addEventListener('click',function(){
			showNovelId();
		}, false);

		//URLから登録
		element[3] = document.createElement("a");
		element[3].setAttribute('href','javascript:void(0)');
		textnode[3]= document.createTextNode('[URLから登録]');
		element[3].appendChild(textnode[3]);
		div.appendChild(element[3]);

		element[3].addEventListener('click',function(){
			var n = window.prompt("数字を入力(1～4,11～14)\n\タグ設定済みURLはスキップして登録\n1:お気に入り 2:後で読む 3:読まない 4:非表示\n\nタグを上書きして登録\n11:お気に入り 12:後で読む 13:読まない 14:非表示", "");
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
					var str = window.prompt("URLを貼り付け(複数可)", "");
					regNovelId(str,n);
					break;
				default:
					break;
			}
		}, false);

		targetNode.insertBefore(div,targetNode.firstElementChild);
	}

	//文字列からURLを抜き出して登録する
	function regNovelId(inputStr,n){
		var str = inputStr.match(/(https:\/\/kakuyomu\.jp\/works\/\d+)/gi);
		if(str){
			var urlList = Array.from(new Set(str));
			var novelId;
			var url;
			for(var i=0;i<urlList.length;i++){
				url =  urlList[i].match(/https:\/\/kakuyomu\.jp\/works\/(\d+)/);
				novelId = url[1];
				//設定済みをスキップ
				if(n<5){
					if(!getNovelTag(novelId)){
						setNovelTag(novelId,n);
					}
				}
				//タグを上書き
				else{
					setNovelTag(novelId,n-10);
				}
			}
		}
	}

	//登録済みデータを表示
	function showNovelId(){
		var win = window.open();
		var t=0;
		var c = [0,0,0,0,0,0];
		var keyName;
		var datalist;
		for(var i=1;i<6;i++){
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
					win.document.write('----------[未設定]----------' + '<br>');
					break;
			}
			for (var j=0; j<localStorage.length; j++) {
				keyName = localStorage.key(j);
				if(keyName.match(/kw_\d+/)){
					datalist =  JSON.parse(localStorage.getItem(keyName));
					keyName = keyName.match(/kw_(\d+)/)[1];
					var novelTag = i;
					if(i==5){
						novelTag = 0;
					}
					if(datalist.tag==novelTag){
						win.document.write('<a href="https://kakuyomu.jp/works/'+keyName+'" target="_blank">'+keyName +'</a>'+ '<br>');
						c[novelTag]++;
						t++;
					}
				}
			}
		}
		win.document.write('-----[お気に入り]:'+c[1]+' [後で読む]:'+c[2]+' [読まない]:'+c[3]+' [非表示]:'+c[4]+' [未設定]:'+c[0]+' 総数:'+t+'-----' + '<br>');
		win.document.write('----------[作者(非表示)]----------' + '<br>');
		for (var k=0; k<localStorage.length; k++) {
			keyName = localStorage.key(k);
			if(keyName.match(/ka_[0-9a-zA-Z_\-]+/)){
				datalist =  JSON.parse(localStorage.getItem(keyName));
				keyName = keyName.match(/ka_([0-9a-zA-Z_\-]+)/)[1];
				if(datalist==1){
					win.document.write('<a href="https://kakuyomu.jp/users/'+keyName+'" target="_blank">'+keyName +'</a>'+ '<br>');
					c[5]++;
				}
			}
		}
		win.document.write('-----[作者(非表示)]:'+c[5]+'-----' + '<br>');

		win.document.close();

	}
	function updateHeader(node){
		var items = document.evaluate('.//header[@id="contentMain-header"]/p[contains(@class,"widget-episodeTitle")]',node,null,7,null);
		var item;
		var episodeTitle;
		if(items.snapshotLength>0){
			item = items.snapshotItem(items.snapshotLength-1);
			episodeTitle = item.textContent;
		}

		items = document.evaluate('//a[@class="autopagerize_link"]',node,null,7,null);
		var url;
		if(items.snapshotLength>0){
			item = items.snapshotItem(items.snapshotLength-1);
			url= item.getAttribute('href');
		}
		else{
			url = currentUrl;
		}
		item = document.evaluate('//div[@id="worksEpisodesEpisodeHeader-inner"]/div[@class="float-left"]/*/*[@class="current_page"]',document,null,9,null).singleNodeValue;

		if(!item){
			var currentPage = document.createElement("li");
			currentPage.classList.add('current_page');
			var element = document.createElement("a");
			element.textContent = episodeTitle;
			currentPage.appendChild(element);

			element.setAttribute('href',url);

			item = document.evaluate('//div[@id="worksEpisodesEpisodeHeader-inner"]/div[@class="float-left"]',document,null,9,null).singleNodeValue;
			var empty = document.createElement("li");
			item.lastElementChild.appendChild(empty);
			item.lastElementChild.appendChild(currentPage);

		}
		else{
			item.lastElementChild.textContent = episodeTitle;
			item.lastElementChild.setAttribute('href',url);
		}

		items = document.evaluate('//section[@id="contentAside-episodeInfo"]//li[contains(@class,"widget-toc-episode")]',document,null,7,null);
		var text;
		for(var i=0;i<items.snapshotLength;i++){
			item = items.snapshotItem(i);
			text = item.firstElementChild.firstElementChild.textContent;
			if(text==episodeTitle){
				item.classList.add("isHighlighted");
			}
			else{
				item.classList.remove("isHighlighted");
			}
		}
	}

	var website = getLocation();
	setText();
	if(currentUrl.match(/^https:\/\/kakuyomu\.jp\/my\/antenna\/works/)||currentUrl.match(/^https:\/\/kakuyomu\.jp\/my\/antenna\/reading_histories/)){
		addLink();
	}
	var func;
	if(website>0){
		beforeCreateTag();
		document.body.addEventListener('AutoPagerize_DOMNodeInserted',func=function(evt){
			var node = evt.target;
			callCreateTag(node);
		}, false);
		callCreateTag(document);
	}
})();