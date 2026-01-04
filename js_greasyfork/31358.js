// ==UserScript==
// @name         アルファポリスタグ付けスクリプト
// @namespace    https://greasyfork.org/users/135410
// @version      0.1
// @description  アルファポリスの小説や作者にタグを付ける
// @match        https://www.alphapolis.co.jp/novel/*
// @match        https://www.alphapolis.co.jp/
// @match        https://www.alphapolis.co.jp/prize/
// @match        https://www.alphapolis.co.jp/author/detail/*
// @match        https://www.alphapolis.co.jp/mypage/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/31358/%E3%82%A2%E3%83%AB%E3%83%95%E3%82%A1%E3%83%9D%E3%83%AA%E3%82%B9%E3%82%BF%E3%82%B0%E4%BB%98%E3%81%91%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/31358/%E3%82%A2%E3%83%AB%E3%83%95%E3%82%A1%E3%83%9D%E3%83%AA%E3%82%B9%E3%82%BF%E3%82%B0%E4%BB%98%E3%81%91%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
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

	//クラスselected_tagの要素の文字を変更する
	stylesheet.insertRule("a.selected_tag{font-weight:bold;}", stylesheet.cssRules.length);
	stylesheet.insertRule("a.selected_tag:link{color:#ff0000;}", stylesheet.cssRules.length);
	//クラスhiddenの要素を非表示にする
	stylesheet.insertRule("div.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule("table.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule("li.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule("a.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule("span.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule(".hidden{display:none;}", stylesheet.cssRules.length);

	stylesheet.insertRule("#main div.hidden{display:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule("#main-content li.hidden{display:none;}", stylesheet.cssRules.length);

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

	//ページの場所 1:小説トップ 2:ランキング 3:小説ページ
	function getLocation(){
		//1:小説総合トップ
		if(currentUrl.match(/^https:\/\/www\.alphapolis\.co\.jp\/novel\/$/)){
			return 1;
		}
		//2:ランキング、検索
		else if(currentUrl.match(/^https:\/\/www\.alphapolis\.co\.jp\/novel\/(index|ranking|rental|alphapolis_author|prize_winner)/)||currentUrl.match(/^https:\/\/www\.alphapolis\.co\.jp\/prize/)||currentUrl.match(/^https:\/\/www\.alphapolis\.co\.jp\/author\/detail/)||currentUrl.match(/^https:\/\/www\.alphapolis\.co\.jp\/novel\/(\d+)\/(\d+)\/similar/)||currentUrl.match(/^https:\/\/www\.alphapolis\.co\.jp\/mypage\/favorite(?!.*(official_manga|manga|blog|user))/)){
			return 2;
		}
		//3:小説ページ
		else if(currentUrl.match(/^https:\/\/www\.alphapolis\.co\.jp\/novel\/\d+\/\d+/)){
			return 3;
		}
		//3:総合トップページ
		else if(currentUrl.match(/^https:\/\/www\.alphapolis\.co\.jp\/?$/)){
			return 4;
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

			//タグのテキストにselected_tagクラスを追加
			if(i==n){
				elements[i].classList.add("selected_tag");
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
	function setNovelTag(authorId,novelId,n){
		var datalist = JSON.parse(localStorage.getItem("ap_"+authorId));
		if(!datalist){
			datalist={};
			datalist = {"authorTag": 0,"novel":{[novelId]: {"novelTag": n}}};
		}
		else{
			if(!datalist.novel[novelId]){
				datalist.novel[novelId] = {"novelTag": n};
			}
			else{
				datalist.novel[novelId].novelTag = n;
			}
		}
		localStorage.setItem("ap_"+authorId,JSON.stringify(datalist));

	}

	//小説のタグを取得する
	function getNovelTag(authorId,novelId){
		var datalist = JSON.parse(localStorage.getItem("ap_"+authorId));
		var n;
		if(!datalist){
			n= 0;
		}
		else{
			if(!datalist.novel[novelId]){
				n = 0;
			}
			else {
				n = datalist.novel[novelId].novelTag;
			}
		}
		return n;
	}
	//作者にタグを設定する
	function setAuthorTag(authorId,n){
		var datalist = JSON.parse(localStorage.getItem("ap_"+authorId));
		if(!datalist){
			datalist={};
			datalist = {"authorTag": n,"novel": {}};
		}
		else{
			datalist.authorTag = n;
		}
		localStorage.setItem("ap_"+authorId,JSON.stringify(datalist));
	}

	//作者のタグを取得する
	function getAuthorTag(authorId){
		var datalist = JSON.parse(localStorage.getItem("ap_"+authorId));
		var n;
		if(!datalist){
			n= 0;
		}
		else{
			n = datalist.authorTag;
		}
		return n;
	}
	//createTagの前に実行する
	function beforeCreateTag(){
		var element;
		var authorId;
		var myAuthor;
		var items;
		var item;
		var str;
		switch(website){
			case 1:
				//1:小説総合トップ

				break;
			case 2:
				//2:ランキング、検索
				stylesheet.insertRule("div.my_favorite  a{font-size:80%;}", stylesheet.cssRules.length);
				stylesheet.insertRule(".content-main .author{justify-content:left;}", stylesheet.cssRules.length);
				stylesheet.insertRule(".content-main .author .book-info {margin-left: auto;}", stylesheet.cssRules.length);
				break;
			case 3:
				//3:小説ページ
				stylesheet.insertRule("#navbar div.my_favorite  a{line-height: 25px ; padding: 0px 5px;color: #666666;font-weight:bold;display:block;border:1px solid #cccccc;background-color:#eeeeee;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#navbar div.my_favorite  a.hidden{display:none;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#navbar div.my_favorite  a.selected_tag:link{color:#ff0000; display:block  !important;}", stylesheet.cssRules.length);
				stylesheet.insertRule("#navbar .my_container {width:85px;position:fixed;top:99px;right:0px;}", stylesheet.cssRules.length);
				if(TEXT_TYPE){
					stylesheet.insertRule("#navbar div.my_container{width:80px ;text-align: center;}", stylesheet.cssRules.length);
				}
				str = currentUrl.match(/\/novel\/(\d+)\/(\d+)/);

				var headerMyFavorite = makeMyFavorite(getNovelTag(str[1],str[2]));
				var myContainer = document.getElementsByClassName("my_container")[0];
				if(!myContainer){
					myContainer = document.createElement('div');
					myContainer.setAttribute('class','my_container');
					myContainer.appendChild(headerMyFavorite);
				}
				else{
					myContainer.insertBefore(headerMyFavorite,myContainer.lastElementChild);
				}
				document.getElementById("navbar").appendChild(myContainer);

				myAuthor = makeMyAuthor(getAuthorTag(str[1]));

				items = document.evaluate('.//div[@class="content-main"]/div[@class="author"]//a[contains(@href, "/author/detail/")]',document,null,7,null);


				if(items.snapshotLength){
					item = items.snapshotItem(0);
				}
				else{
					items = document.evaluate('.//div[@class="novel-header section"]/h2[@class="author"]/a[contains(@href, "/author/detail/")]',document,null,7,null);
					item = items.snapshotItem(0);
				}
				item.parentNode.insertBefore(myAuthor,item.nextElementSibling);
				break;
			case 4:
				//4:総合トップページ
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
		//1:小説総合トップ
		if(website==1){
			items = document.evaluate('.//div[@class="title"]/a[contains(@href, "/novel")]',node,null,7,null);
		}
		//2:ランキング、検索
		else if(website==2){
			items = document.evaluate('.//div[@class="content-title"]/h2[@class="title"]/a',node,null,7,null);
		}
		//3:小説ページ
		else if(website==3){
			items = document.evaluate('.//div[@class="item"]/h3[@class="title"]/a[contains(@href, "/novel")]',node,null,7,null);
		}
		//4:総合トップページ
		else if(website==4){
			items = document.evaluate('.//div[@class="title"]/a',node,null,7,null);
		}

		//ページ内のすべての小説情報を処理
		for(var i=0;i<items.snapshotLength;i++){
			item = items.snapshotItem(i);
			var str = item.getAttribute('href').match(/novel\/(\d+)\/(\d+)\/?$/);
			var authorId;
			var novelId;
			if(str){
				authorId = str[1];
				novelId = str[2];
			}
			else{
				if(website==4||website==2){
					str = item.getAttribute('href');
					novelId = str;
				}
			}
			if(str){
				var myFavorite;
				var div;
				var ul;
				var targetNode;
				var j;
				var n;
				var hiddenTarget = "";
				var myAuthor;

				//非表示にする要素を指定、myFavoriteを追加
				switch(website){
					case 1:
						//1:1:小説総合トップ
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode.parentNode.parentNode;
						}
						else{
							if(!item.parentNode.parentNode.children[3])
								hiddenTarget = "";
							else{
								hiddenTarget = item.parentNode.parentNode.children[3];
							}
						}
						n = getNovelTag(authorId,novelId);
						myFavorite = makeMyFavorite(n);
						item.parentNode.appendChild(myFavorite);
						myAuthor = makeMyAuthor(getAuthorTag(authorId));
						item.parentNode.nextElementSibling.firstElementChild.appendChild(myAuthor);
						break;
					case 2:
						//2:ランキング、検索
						str = item.parentNode.parentNode.nextElementSibling.firstElementChild.getAttribute('href').match(/\/author\/detail\/(\d+)\/?$/);
						if(str){
							authorId = str[1];
							if(!HIDDEN_TYPE){
								hiddenTarget = item.parentNode.parentNode.parentNode.parentNode;
							}
							else{
								div = document.createElement('div');
								while(item.parentNode.parentNode.parentNode.children[2]){
									targetNode = item.parentNode.parentNode.parentNode.children[2];
									div.appendChild(targetNode);
								}
								item.parentNode.parentNode.parentNode.appendChild(div);
								hiddenTarget = item.parentNode.parentNode.parentNode.lastElementChild;
							}
							n = getNovelTag(authorId,novelId);
							myFavorite = makeMyFavorite(n);
							item.parentNode.appendChild(myFavorite);
							myAuthor = makeMyAuthor(getAuthorTag(authorId));
							item.parentNode.parentNode.nextElementSibling.insertBefore(myAuthor,item.parentNode.parentNode.nextElementSibling.firstElementChild.nextElementSibling);
						}
						break;
					case 3:
						//3:小説ページ
						if(!HIDDEN_TYPE){
							hiddenTarget = item.parentNode.parentNode.parentNode;
						}
						else{
							hiddenTarget = item.parentNode.parentNode.lastElementChild;
						}
						text=text2;
						n = getNovelTag(authorId,novelId);
						myFavorite = makeMyFavorite(n);
						item.parentNode.appendChild(myFavorite);
						myAuthor = makeMyAuthor(getAuthorTag(authorId));
						item.parentNode.nextElementSibling.appendChild(myAuthor);
						break;
					case 4:
						//4:総合トップページ
						str = item.parentNode.nextElementSibling.firstElementChild.firstElementChild.getAttribute('href').match(/\/author\/detail\/(\d+)\/?$/);
						if(str){
							authorId = str[1];
							if(!HIDDEN_TYPE){
								hiddenTarget = item.parentNode.parentNode.parentNode;
							}
							else{
								if(!item.parentNode.parentNode.children[2])
									hiddenTarget = "";
								else{
									hiddenTarget = item.parentNode.parentNode.children[2];
								}
							}
							n = getNovelTag(authorId,novelId);
							myFavorite = makeMyFavorite(n);
							item.parentNode.appendChild(myFavorite);
							myAuthor = makeMyAuthor(getAuthorTag(authorId));
							item.parentNode.nextElementSibling.firstElementChild.appendChild(myAuthor);
						}
						break;
					default:
						hiddenTarget = "";
						item = "";
						break;
				}

				if(hiddenTarget!==""){
					var m = getAuthorTag(authorId);
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

	function findByAuthorTag(node){

		var myAuthor = node;
		var authorId;
		var novelId;
		var elements = myAuthor.children;
		var hiddenTarget = "";
		var str;

		//作者、小説IDを取得、非表示にする要素を指定
		switch(website){
			case 1:
				//1:小説総合トップ
				str = myAuthor.parentNode.parentNode.parentNode.children[1].firstElementChild.getAttribute('href').match(/novel\/(\d+)\/(\d+)/);
				authorId = str[1];
				novelId = str[2];
				if(!HIDDEN_TYPE){
					hiddenTarget = myAuthor.parentNode.parentNode.parentNode.parentNode;
				}
				else{
					if(!myAuthor.parentNode.parentNode.parentNode.children[3])
						hiddenTarget = "";
					else{
						hiddenTarget = myAuthor.parentNode.parentNode.parentNode.children[3];
					}
				}
				break;
			case 2:
				//2:ランキング、検索
				str = myAuthor.parentNode.previousElementSibling.firstElementChild.firstElementChild.getAttribute('href').match(/novel\/(\d+)\/(\d+)/);
				authorId = myAuthor.previousElementSibling.getAttribute('href').match(/author\/detail\/(\d+)/)[1];
				if(str){
					novelId = str[2];
				}
				else{
					novelId = myAuthor.parentNode.previousElementSibling.firstElementChild.firstElementChild.getAttribute('href');
				}
				if(!HIDDEN_TYPE){
					hiddenTarget = myAuthor.parentNode.parentNode.parentNode;
				}
				else{
					hiddenTarget = myAuthor.parentNode.parentNode.lastElementChild;
				}
				break;
			case 3:
				//3:小説ページ
				if(myAuthor.parentNode.parentNode.parentNode.getAttribute("class")=='content-main'){
					str = currentUrl.match(/novel\/(\d+)\/(\d+)/);
					authorId = str[1];
					novelId = str[2];
					hiddenTarget = "";
				}
				else if(myAuthor.parentNode.parentNode.getAttribute("class")=='novel-header section'){
					str = currentUrl.match(/novel\/(\d+)\/(\d+)/);
					authorId = str[1];
					novelId = str[2];
					hiddenTarget = "";
				}
				else{
					str = myAuthor.parentNode.previousElementSibling.firstElementChild.getAttribute('href').match(/novel\/(\d+)\/(\d+)/);
					authorId = str[1];
					novelId = str[2];
					if(!HIDDEN_TYPE){
						hiddenTarget = myAuthor.parentNode.parentNode;
					}
					else{
						hiddenTarget = myAuthor.parentNode.parentNode.lastElementChild;
					}
				}
				break;
			case 4:
				//4:総合トップページ
				str = myAuthor.parentNode.parentNode.previousElementSibling.firstElementChild.getAttribute('href').match(/novel\/(\d+)\/(\d+)/);
				authorId = myAuthor.parentNode.firstElementChild.getAttribute('href').match(/author\/detail\/(\d+)/)[1];
				if(str){
					novelId = str[2];
				}
				else{
					novelId = myAuthor.parentNode.parentNode.previousElementSibling.firstElementChild.getAttribute('href');
				}
				if(!HIDDEN_TYPE){
					hiddenTarget = myAuthor.parentNode.parentNode.parentNode.parentNode;
				}
				else{
					if(!myAuthor.parentNode.parentNode.parentNode.children[2])
						hiddenTarget = "";
					else{
						hiddenTarget = myAuthor.parentNode.parentNode.parentNode.children[2];
					}
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
			if(hiddenTarget!==""){
				hiddenTarget.classList.remove("hidden");
			}
			for(i=0;i<2;i++){
				elements[i].classList.remove("hidden");
				elements[i].classList.remove("selected_tag");
			}
			elements[getAuthorTag(authorId)].classList.add("selected_tag");
			myAuthor.classList.remove("closed");
		}
		else{
			var items;
			items = document.evaluate('//*[contains(@href,"/author/detail/'+authorId+'")]/parent::node()/div[contains(@class,"my_author")]',document,null,7,null);
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
		var novelTag = getNovelTag(authorId,novelId);
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
				elements[i].classList.remove("selected_tag");
			}
			setAuthorTag(authorId,authorTag);
			elements[authorTag].classList.add("selected_tag");
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
				elements[i].classList.remove("selected_tag");
				elements[i].classList.add("hidden");
			}
			setAuthorTag(authorId,authorTag);
			elements[authorTag].classList.add("selected_tag");
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
				//1:小説総合トップ
				str = myFavorite.parentNode.firstElementChild.getAttribute('href').match(/novel\/(\d+)\/(\d+)/);
				authorId = str[1];
				novelId = str[2];
				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode.parentNode.parentNode;
				}
				else{
					if(!myFavorite.parentNode.parentNode.children[3])
						hiddenTarget = "";
					else{
						hiddenTarget = myFavorite.parentNode.parentNode.children[3];
					}
				}
				break;
			case 2:
				//2:ランキング、検索
				str = myFavorite.previousElementSibling.getAttribute('href').match(/novel\/(\d+)\/(\d+)/);
				authorId = myFavorite.parentNode.parentNode.nextElementSibling.firstElementChild.getAttribute('href').match(/author\/detail\/(\d+)/)[1];
				if(str){
					novelId = str[2];
				}
				else{
					novelId = myFavorite.previousElementSibling.getAttribute('href');
				}
				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode.parentNode.parentNode.parentNode;
				}
				else{
					hiddenTarget = myFavorite.parentNode.parentNode.parentNode.lastElementChild;
				}
				break;
			case 3:
				//3:小説ページ
				if(myFavorite.parentNode.parentNode.getAttribute("id")=='navbar'){
					str = currentUrl.match(/novel\/(\d+)\/(\d+)/);
					authorId = str[1];
					novelId = str[2];
					hiddenTarget = "";
				}
				else{
					str = myFavorite.previousElementSibling.getAttribute('href').match(/novel\/(\d+)\/(\d+)/);
					authorId = str[1];
					novelId = str[2];
					if(!HIDDEN_TYPE){
						hiddenTarget = myFavorite.parentNode.parentNode;
					}
					else{
						hiddenTarget = myFavorite.parentNode.parentNode.lastElementChild;
					}
				}
				break;
			case 4:
				//4:総合トップページ
				authorId = myFavorite.parentNode.nextElementSibling.firstElementChild.firstElementChild.getAttribute('href').match(/author\/detail\/(\d+)/)[1];
				str = myFavorite.previousElementSibling.getAttribute('href').match(/novel\/(\d+)\/(\d+)/);
				if(str){
					novelId = str[2];
				}
				else{
					novelId = myFavorite.previousElementSibling.getAttribute('href');
				}
				if(!HIDDEN_TYPE){
					hiddenTarget = myFavorite.parentNode.parentNode.parentNode;
				}
				else{
					if(!myFavorite.parentNode.parentNode.children[2])
						hiddenTarget = "";
					else{
						hiddenTarget = myFavorite.parentNode.parentNode.children[2];
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
			if(hiddenTarget!==""){
				hiddenTarget.classList.remove("hidden");
			}
			for(i=0;i<5;i++){
				elements[i].classList.remove("hidden");
				elements[i].classList.remove("selected_tag");
			}
			elements[getNovelTag(authorId,novelId)].classList.add("selected_tag");
			myFavorite.classList.remove("closed");

		}
		else{
			var items;
			switch(website){
				case 1:
					items = document.evaluate('//*[contains(@href,"/novel/'+authorId+'/'+novelId+'")]/parent::node()/div[contains(@class,"my_favorite")]',document,null,7,null);
					break;
				case 2:
					updateMyFavorite(myFavorite,n);
					items = document.evaluate('//*[contains(@href,"/novel/'+authorId+'/'+novelId+'")]/parent::node()/div[contains(@class,"my_favorite")]',document,null,7,null);
					break;
				case 3:
					updateMyFavorite(myFavorite,n);
					items = document.evaluate('//*[contains(@href,"/novel/'+authorId+'/'+novelId+'")]/parent::node()/div[contains(@class,"my_favorite")]',document,null,7,null);
					break;
				case 4:
					updateMyFavorite(myFavorite,n);
					items = document.evaluate('//*[contains(@href,"/novel/'+authorId+'/'+novelId+'")]/parent::node()/div[contains(@class,"my_favorite")]',document,null,7,null);
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
			if(hiddenTarget!==""){
				if(!novelTag){
					if(getAuthorTag(authorId)==1){
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
				elements[i].classList.remove("selected_tag");
			}
			setNovelTag(authorId,novelId,novelTag);
			elements[novelTag].classList.add("selected_tag");
		}
		else{
			if(hiddenTarget!==""){
				if(!novelTag){
					if(getAuthorTag(authorId)==1){
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
				elements[i].classList.remove("selected_tag");
				elements[i].classList.add("hidden");
			}
			setNovelTag(authorId,novelId,novelTag);
			elements[novelTag].classList.add("selected_tag");
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

			//タグのテキストにselected_tagクラスを追加
			if(i==n){
				elements[i].classList.add("selected_tag");
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
	function getBookmarkpage(readStatus,n){

		var targetUrl;
		switch(readStatus){
			case 0:
				targetUrl = "https://www.alphapolis.co.jp/mypage/favorite/index/novel";
				break;
			case 1:
				targetUrl = "https://www.alphapolis.co.jp/mypage/favorite/index/novel/keep";
				break;
			case 2:
				targetUrl = "https://www.alphapolis.co.jp/mypage/favorite/index/novel/want";
				break;
			case 3:
				targetUrl = "https://www.alphapolis.co.jp/mypage/favorite/index/novel/reading";
				break;
			case 4:
				targetUrl = "https://www.alphapolis.co.jp/mypage/favorite/index/novel/finish";
				break;
			default:
				break;

		}
		var item;
		var request = new XMLHttpRequest();
		request.open("GET", targetUrl, true);
		request.responseType = "document";
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				item = request.response.getElementsByClassName("count")[0];

				var count = item.textContent.match(/(\d+)/);
				var num = Math.ceil(parseInt(count[1],10)/40);

				var urlList = [];
				for(var i = 0;i<num;i++){
					var p = i+1;
					urlList[i] = targetUrl + "?page=" + p;
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

					items = request.response.evaluate('.//div[@class="content-title"]/h2[@class="title"]/a',request.response,null,7,null);
					for (var j = 0; j < items.snapshotLength; j++){
						item = items.snapshotItem(j);
						str = item.getAttribute('href').match(/novel\/(\d+)\/(\d+)/);
						if(str){
							authorId = str[1];
							novelId = str[2];
						}
						else{
							novelId = item.getAttribute('href');
							authorId = item.parentNode.parentNode.nextElementSibling.firstElementChild.getAttribute('href').match(/author\/detail\/(\d+)/)[1];
						}

						//設定済みをスキップ
						if(n<5){
							if(!getNovelTag(authorId,novelId)){
								setNovelTag(authorId,novelId,n);
							}
						}
						//タグを上書き
						else{
							setNovelTag(authorId,novelId,n-10);
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

	//マイページに各種リンクを追加
	function addLink(){

		var element = [];
		var textnode = [];
		var targetNode = document.getElementById('header');

		stylesheet.insertRule("#header .myMenu{padding:5px;}", stylesheet.cssRules.length);
		var div = document.createElement("div");
		div.classList.add("myMenu");

		//お気に入りを取得
		element[0] = document.createElement("a");
		element[0].setAttribute('href','javascript:void(0)');
		textnode[0]= document.createTextNode('[お気に入りを取得]');
		element[0].appendChild(textnode[0]);
		div.appendChild(element[0]);
		element[0].addEventListener('click',function(){
			var category = window.prompt("取得するお気に入り\n0:全て 1:キープする 2:読みたい 3:今読んでいる 4:読み終わった");
			category = parseInt(category,10);
			switch(category){
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
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
			var d = window.prompt("保存データを削除します\n99:全て");
			d = parseInt(d,10);
			switch(d){
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

		targetNode.appendChild(div);
	}

	//文字列からURLを抜き出して登録する
	function regNovelId(inputStr,n){
		var str = inputStr.match(/(https:\/\/www\.alphapolis\.co\.jp\/novel\/\d+\/\d+)/gi);
		if(str){
			var urlList = Array.from(new Set(str));
			var novelId;
			var authorId;
			var url;
			for(var i=0;i<urlList.length;i++){
				url =  urlList[i].match(/https:\/\/www\.alphapolis\.co\.jp\/novel\/(\d+)\/(\d+)/);
				authorId = url[1];
				novelId = url[2];
				//設定済みをスキップ
				if(n<5){
					if(!getNovelTag(authorId,novelId)){
						setNovelTag(authorId,novelId,n);
					}
				}
				//タグを上書き
				else{
					setNovelTag(authorId,novelId,n-10);
				}
			}
		}
	}

	//登録済みデータを表示
	function showNovelId(){
		var win = window.open();
		var t=0;
		var c = [0,0,0,0,0];
		var keyName;
		var datalist;
		var author;
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
			for (var j=0; j<localStorage.length; j++) {
				keyName = localStorage.key(j);
				if(keyName.match(/^ap_\d+$/)){
					datalist =  JSON.parse(localStorage.getItem(keyName));
					author = keyName.match(/^ap_(\d+)$/)[1];
					for(var prop in datalist.novel){
						if(datalist.novel[prop].novelTag==i){
							if(datalist.novel[prop]){
								if(prop.match(/^http/)){
									win.document.write('<a href="'+prop+'" target="_blank">'+prop +'</a>'+ ' ');
								}
								else{
									win.document.write('<a href="https://www.alphapolis.co.jp/novel/'+author+'/'+prop+'" target="_blank">'+prop +'</a>'+ ' ');
								}
								win.document.write('作者:<a href="https://www.alphapolis.co.jp/author/detail/'+author+'" target="_blank">'+author +'</a>'+ '<br>');
								c[i]++;
								t++;
							}
						}
					}
				}
			}
		}
		win.document.write('-----[お気に入り]:'+c[1]+' [後で読む]:'+c[2]+' [読まない]:'+c[3]+' [非表示]:'+c[4]+' 総数:'+t+'-----' + '<br>');
		win.document.write('----------[作者(非表示)]----------' + '<br>');
		for (var k=0; k<localStorage.length; k++) {
			keyName = localStorage.key(k);
			if(keyName.match(/^ap_\d+$/)){
				datalist =  JSON.parse(localStorage.getItem(keyName));
				author = keyName.match(/^ap_(\d+)$/)[1];
				if(datalist.authorTag==1){
					win.document.write('<a href="https://www.alphapolis.co.jp/author/detail/'+author+'" target="_blank">'+author +'</a>'+ '<br>');
					c[0]++;
				}
			}
		}
		win.document.write('-----[作者(非表示)]:'+c[0]+'-----' + '<br>');

		win.document.close();

	}

	var website = getLocation();
	setText();
	beforeCreateTag();
	if(currentUrl.match(/^https:\/\/www\.alphapolis\.co\.jp\/mypage/)){
		addLink();
	}
	var func;
	if(website>0){
		document.body.addEventListener('AutoPagerize_DOMNodeInserted',func=function(evt){
			var node = evt.target;
			createTag(node);
		}, false);
		createTag(document);
	}
})();