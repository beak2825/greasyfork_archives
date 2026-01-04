// ==UserScript==
// @name         なろうしおりスクリプト
// @namespace    https://greasyfork.org/users/135410
// @version      0.1
// @description  なろうの小説に独自のしおり機能を追加する
// @match        http://ncode.syosetu.com/*
// @match        http://syosetu.com/favnovelmain/*
// @match        http://syosetu.com/user/top/
// @match        http://syosetu.com/favnovelmain/deleteconfirm/favncode/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/32065/%E3%81%AA%E3%82%8D%E3%81%86%E3%81%97%E3%81%8A%E3%82%8A%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/32065/%E3%81%AA%E3%82%8D%E3%81%86%E3%81%97%E3%81%8A%E3%82%8A%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(function() {
	'use strict';

	//0:独自のしおりを使う 1:最後にアクセスしたページに公式のしおりを挿む
	var AUTO_BOOKMARK = 0;

	var currentUrl = window.location.href;
	var style = document.createElement('style');
	style.type = "text/css";
	document.getElementsByTagName('head')[0].appendChild(style);
	var stylesheet = style.sheet;
	stylesheet.insertRule("#novel_header div.my_shiori a{line-height:25px;padding: 0px 5px;color: #666666;font-weight:bold;display:block;border:1px solid #cccccc;background-color:#eeeeee;}", stylesheet.cssRules.length);
	stylesheet.insertRule("#novel_header div.my_shiori a.selected{color:#ff0000; display:block  !important;}", stylesheet.cssRules.length);
	stylesheet.insertRule("#novel_header div.my_shiori a.disabled{text-decoration: line-through;}", stylesheet.cssRules.length);
	stylesheet.insertRule("#novel_header > .my_container {position:fixed;top:95px;right:12px;}", stylesheet.cssRules.length);
	stylesheet.insertRule("#novel_header div.my_shiori{position:absolute;right:0px;width:80px;text-align: center;}", stylesheet.cssRules.length);

	stylesheet.insertRule("ul#head_nav li.bookmark a:hover{background:none;}", stylesheet.cssRules.length);
	stylesheet.insertRule("ul#head_nav li:last-child{display:none;}", stylesheet.cssRules.length);

	var token;
	var ncode;
	var userId;
	var page;
	var ncode_num;

	function regString(){
		var head_nav = document.getElementById('head_nav');
		var booklist_now = document.getElementsByClassName('booklist_now')[0];
		var bookmark_now = document.getElementsByClassName('bookmark_now')[0];
		var bookmark = document.getElementsByClassName('bookmark')[0];

		var str;
		str = currentUrl.match(/^http:\/\/ncode\.syosetu\.com\/(n\d+[a-z]+)/);
		if(str){
			ncode = str[1];
		}
		else{
			str = currentUrl.match(/^http:\/\/ncode\.syosetu\.com\/novelview\/infotop\/ncode\/(n\d+[a-z]+)/);
			if(str){
				ncode = str[1];
			}
		}

		str = currentUrl.match(/^http:\/\/ncode\.syosetu\.com\/n\d+[a-z]+\/(\d+)/);
		if(str){
			page = parseInt(str[1],10);
		}
		else{
			page = 0;
		}
		var node;
		var request;
		if(booklist_now){
			if(bookmark_now){
				bookmark = makeElement('bookmark','しおり中');
				bookmark.setAttribute('style','display:none');
				bookmark = head_nav.insertBefore(bookmark,bookmark_now.nextElementSibling);
				str = bookmark_now.firstElementChild.getAttribute('href');
				if(str){
					str = str.match(/^http:\/\/syosetu\.com\/favnovelmain\/ichiupdate\/useridfavncode\/(\d+)_(\d+)\/no\/\d+\/\?token=([0-9a-z]+)/);
					token = str[3];
					ncode_num = str[2];
					userId = str[1];
				}
			}
			else if(!bookmark_now){
				bookmark_now = makeElement('bookmark_now','しおりを挿む');
				bookmark_now.setAttribute('style','display:none');
				bookmark_now = head_nav.insertBefore(bookmark_now,bookmark);
				str = booklist_now.firstElementChild.getAttribute('href').match(/http:\/\/syosetu\.com\/favnovelmain\/deleteconfirm\/favncode\/(\d+)\/no\/(\d+)/);
				if(str){
					node = document.evaluate('//*[contains(text(), "次の話")]', document, null, 9, null).singleNodeValue;
					if(node){
						request = new XMLHttpRequest();
						request.open("GET", node.getAttribute('href'), true);
						request.responseType = "document";
						request.send(null);
						request.onreadystatechange = function() {
							if (request.readyState == 4 && request.status == 200) {

								node = request.response.evaluate('//*[contains(@href, "http://syosetu.com/favnovelmain/ichiupdate/useridfavncode/")]', request.response, null, 9, null).singleNodeValue;

								str = node.getAttribute('href').match(/^http:\/\/syosetu\.com\/favnovelmain\/ichiupdate\/useridfavncode\/(\d+)_(\d+)\/no\/\d+\/\?token=([0-9a-z]+)/);
								token = str[3];
								ncode_num = str[2];
								userId = str[1];

								bookmark_now.firstElementChild.setAttribute('href',"http://syosetu.com/favnovelmain/ichiupdate/useridfavncode/"+userId+'_'+ncode+"/no/"+str[2]+"/?token="+token);

							}
						};
					}
				}
			}
		}
	}

	function addHeader(){
		if(currentUrl.match(/^http:\/\/ncode\.syosetu\.com\/n\d+[a-z]+\/(\d+)/)){
			var head_nav = document.getElementById('head_nav');

			var current_page = makeElement('current_page','現在のページ');
			current_page.firstElementChild.setAttribute('href',window.location.href);
			current_page = head_nav.insertBefore(current_page,head_nav.lastElementChild);
			current_page.setAttribute('style','display:none');

			var contents_page = makeElement('contents_page','目次');
			contents_page.firstElementChild.setAttribute('href',window.location.href.match(/^(http:\/\/ncode\.syosetu\.com\/n\d+[a-z]+\/)/)[1]);
			contents_page = head_nav.insertBefore(contents_page,current_page);
		}
	}

	//リンクを書き換え
	function updateHeader(node){
		var urls = document.getElementsByClassName('autopagerize_link');
		var n = urls.length;
		var url;
		if(n){
			url = urls[n-1].getAttribute('href');
		}

		if(url){
			page = url.match(/^http:\/\/ncode\.syosetu\.com\/n\d+[a-z]+\/(\d+)/)[1];
			var current_page = document.getElementsByClassName('current_page')[0];
			current_page.firstElementChild.setAttribute('href',url);
			current_page.setAttribute('style','display:block');
			var str;
			var booklist = document.getElementsByClassName('booklist')[0];
			var booklist_now = document.getElementsByClassName('booklist_now')[0];
			var bookmark = document.getElementsByClassName('bookmark')[0];
			var bookmark_now = document.getElementsByClassName('bookmark_now')[0];

			if(booklist){
				str = booklist.firstElementChild.getAttribute('href').match(/(^http:\/\/syosetu\.com\/favnovelmain\/add\/favncode\/\d+\/no\/)\d+(\/\?token=)([0-9a-z]+)/);
				booklist.firstElementChild.setAttribute('href',str[1]+page+str[2]+str[3]);
			}
			else if(booklist_now){
				str = booklist_now.firstElementChild.getAttribute('href').match(/(^http:\/\/syosetu\.com\/favnovelmain\/deleteconfirm\/favncode\/\d+\/no\/)\d+/);
				booklist_now.firstElementChild.setAttribute('href',str[1]+page);
				if(bookmark_now){

					bookmark_now.firstElementChild.setAttribute('href',"http://syosetu.com/favnovelmain/ichiupdate/useridfavncode/"+userId+'_'+ncode+"/no/"+page+"/?token="+token);
					bookmark.setAttribute('style','display:none');
					bookmark_now.setAttribute('style','display:block');
				}
			}
		}
	}

	function setBookmark(){
		if(userId&&ncode_num&&token&&page>0){
			var bookmark = document.getElementsByClassName('bookmark')[0];
			var bookmark_now = document.getElementsByClassName('bookmark_now')[0];
			var url = "http://syosetu.com/favnovelmain/ichiupdate/useridfavncode/"+userId+"_"+ncode_num+"/no/"+page+"/?token="+token;
			GM_xmlhttpRequest({
				method: 'GET',
				url: url,
				onload: function(response) {
					var range = document.createRange();
					range.setStartAfter(document.body);
					var xhr_frag = range.createContextualFragment(response.responseText);
					var xhr_doc = document.implementation.createDocument(null, 'html', null);
					xhr_doc.adoptNode(xhr_frag);
					xhr_doc.documentElement.appendChild(xhr_frag);
					var node = xhr_doc.evaluate("/*/*[text()='ブックマーク']", xhr_doc, null, 9, null).singleNodeValue;
					if(node){
						bookmark_now.setAttribute('style','display:none');
						bookmark.setAttribute('style','display:block');
					}
				}
			});
		}
	}
	//挿入する要素の作成
	function makeElement(elementName,text){
		var li = document.createElement("li");
		li.setAttribute('class',elementName);
		var a = document.createElement("a");
		var textnode = document.createTextNode(text);
		a.appendChild(textnode);
		li.appendChild(a);
		return li;
	}
	//しおり位置を設定する
	function setShiori(ncode,n){
		localStorage.setItem(ncode,n);
		setBookmark();
	}
	//しおり位置を取得する
	function getShiori(ncode){
		var pos = localStorage.getItem(ncode);
		if(pos!==null){
			pos = parseInt(pos,10);
		}
		return pos;
	}
	//しおり位置を削除する
	function removeShiori(ncode){
		localStorage.removeItem(ncode);
	}

	//しおり機能を追加する
	function shiori(){

		if(AUTO_BOOKMARK){
			setBookmark();
		}
		else{

			var element=[];
			var textnode =[];
			var myShiori = document.createElement("div");
			myShiori.classList.add('my_shiori');
			var shioriPage = getShiori(ncode);
			element[0] = document.createElement("a");
			element[1] = document.createElement("a");

			textnode[0] = document.createTextNode('[しおり]');
			element[0].setAttribute('href','javascript:void(0)');
			console.log(shioriPage);
			console.log(page);

			if(shioriPage>0){
				if(page==shioriPage||page==shioriPage+1){
					element[0].classList.add("selected");
					if(page>0){
						setShiori(ncode,page);
					}
					shioriPage = page;
				}
			}
			else if(shioriPage===null){
				if(page===0||page==1){
					element[0].classList.add("selected");
					if(page==1){
						setShiori(ncode,page);
					}
					shioriPage = page;
				}
			}
			else{
				element[0].classList.add("disabled");
			}
			element[0].addEventListener('click',function(evt){
				var node = evt.target;
				updateShiori(node);
			}, false);

			if(shioriPage>0){
				textnode[1] = document.createTextNode(shioriPage);
				element[1].setAttribute('href','http://ncode.syosetu.com/' + ncode + '/' + shioriPage + '/');
			}
			else if(shioriPage<0){
				textnode[1] = document.createTextNode(-shioriPage);
				element[1].setAttribute('href','http://ncode.syosetu.com/' + ncode + '/' + -shioriPage + '/');
			}
			else{
				textnode[1] = document.createTextNode('－');
				element[1].setAttribute('href','http://ncode.syosetu.com/' + ncode + '/');
			}
			for(var i=0;i<2;i++){
				element[i].appendChild(textnode[i]);
				myShiori.appendChild(element[i]);
			}
			var myContainer = document.getElementsByClassName("my_container")[0];
			if(!myContainer){
				myContainer = document.createElement('div');
				myContainer.setAttribute('class','my_container');
			}
			myContainer.appendChild(myShiori);
			document.getElementById("novel_header").appendChild(myContainer);
		}
	}

	//[しおり]をクリックした時の動作
	function updateShiori(node){
		var items = document.evaluate('//a[@class="autopagerize_link"]',node,null,7,null);
		var str;
		if(items.snapshotLength>0){
			var item = items.snapshotItem(items.snapshotLength-1);
			str= item.getAttribute('href').match(/^http:\/\/ncode\.syosetu\.com\/n\d+[a-z]+\/(\d+).*/);
		}
		else{
			str = currentUrl.match(/^http:\/\/ncode\.syosetu\.com\/n\d+[a-z]+\/(\d+).*/);
		}
		if(str){
			page = parseInt(str[1],10);
		}
		else{
			page = 0;
		}

		//しおり位置の移動を無効にする
		if(node.classList.contains('selected')){
			node.classList.add("disabled");
			node.classList.remove("selected");
			if(page>0){
				setShiori(ncode,-page);
				node.nextElementSibling.textContent = page;
				node.nextElementSibling.href = 'http://ncode.syosetu.com/' + ncode + '/' + page + '/';
			}
			else{
				setShiori(ncode,0);
				node.nextElementSibling.textContent = '－';
				node.nextElementSibling.href = 'http://ncode.syosetu.com/' + ncode + '/';
			}
		}
		//しおりの移動を有効にし、しおり位置を現在のページにする
		else{
			node.classList.remove("disabled");
			node.classList.add("selected");

			node.nextElementSibling.textContent = '';
			if(page>0){
				setShiori(ncode,page);
				node.nextElementSibling.textContent = page;
				node.nextElementSibling.href = 'http://ncode.syosetu.com/' + ncode + '/' + page + '/';
			}
			else{
				removeShiori(ncode);
				node.nextElementSibling.textContent = '－';
				node.nextElementSibling.href = 'http://ncode.syosetu.com/' + ncode + '/';
			}

		}
	}

	//しおりをAutopagerizeに合わせる
	function shioriAP(node){
		var shioriPage = getShiori(ncode);
		var myShiori = document.getElementsByClassName('my_shiori')[0];
		var items = document.evaluate('//a[@class="autopagerize_link"]',node,null,7,null);
		var str;
		if(items.snapshotLength>0){
			var item = items.snapshotItem(items.snapshotLength-1);
			str = item.getAttribute('href').match(/^http:\/\/ncode\.syosetu\.com\/n\d+[a-z]+\/(\d+).*/);

			if(str){
				page = parseInt(str[1],10);

				if(AUTO_BOOKMARK){
					setBookmark();
				}
				else{
					if(page==shioriPage||page==shioriPage+1){
						setShiori(ncode,page);
						myShiori.children[0].classList.add("selected");
						shioriPage = page;
					}
					else{
						myShiori.children[0].classList.remove("selected");
					}

					if(shioriPage>0){
						myShiori.children[0].classList.remove("disabled");
						myShiori.children[1].textContent = shioriPage;
						myShiori.children[1].href = 'http://ncode.syosetu.com/'+ ncode + '/' + shioriPage + '/';
					}
					else if(shioriPage<0){
						myShiori.children[0].classList.add("disabled");
						myShiori.children[1].textContent = -shioriPage;
						myShiori.children[1].href = 'http://ncode.syosetu.com/' + ncode + '/' + -shioriPage + '/';
					}
					else{
						if(shioriPage===null){
							myShiori.children[0].classList.remove("disabled");
						}
						else{
							myShiori.children[0].classList.add("disabled");
						}
						myShiori.children[1].textContent = '－';
						myShiori.children[1].href = 'http://ncode.syosetu.com/' + ncode + '/';
					}
				}
			}
		}
	}


	function addSettingLink(){
		var ncode = currentUrl.match(/^http:\/\/syosetu\.com\/favnovelmain\/deleteconfirm\/favncode\/(\d+).*/);
		//「ブックマーク解除」ページに「ブックマーク設定の変更」ページへのリンクを追加
		if(ncode){
			var element = document.createElement('a');
			var textnode = document.createTextNode('ブックマーク設定の変更');
			element.appendChild(textnode);
			var userid = document.getElementById('userid').textContent;
			element.setAttribute('href','http://syosetu.com/favnovelmain/updateinput/useridfavncode/'+userid+'_'+ncode[1]+'/');
			document.getElementsByClassName('info_message_nothin')[0].appendChild(element);
		}
	}
	//しおりの次のページへのリンクを追加する
	function addNextLink(node){

		var item = "";
		var img = "";
		//しおりの画像アイコンの要素を取得
		var items = document.evaluate('.//span[@class="no"]/a[1]/img',node,null,7,null);

		for (var i = 0; i < items.snapshotLength; i++){
			img = items.snapshotItem(i);
			item = img.parentNode;
			//しおり中のページのURL
			var url = item.getAttribute('href');
			//最新話のURL
			var latestUrl;
			//ブックマークページ
			if(window.location.href!='http://syosetu.com/user/top/'){
				latestUrl = item.parentNode.lastElementChild.getAttribute('href');
			}
			//マイページのトップ
			else if(window.location.href=='http://syosetu.com/user/top/'){
				latestUrl = item.parentNode.parentNode.lastElementChild.firstElementChild.getAttribute('href');

			}
			//しおり中のページと最新話が同じではない
			if(url!=latestUrl){
				var nextUrl = url.replace(/(^http:\/\/ncode\.syosetu\.com\/n\d+[a-z]+\/)(\d+)(\/$)/,function(str,a,b,c){
					b = parseInt(b,10)+1;
					return a+b+c;
				});

				var element = document.createElement("a");
				var textnode = document.createTextNode(' >>');
				element.appendChild(textnode);
				element.setAttribute('href',nextUrl);
				var parentItem = item.parentNode;
				parentItem.insertBefore(element,item.nextSibling);
			}
		}
	}

	if(currentUrl.match(/^http:\/\/ncode\.syosetu\.com/)){
		regString();
		addHeader();

		var func;
		document.body.addEventListener('AutoPagerize_DOMNodeInserted',func=function(evt){
			var node = evt.target;
			updateHeader();
			shioriAP(node);
		}, false);
		shiori();
	}
	else if(/^http:\/\/syosetu\.com\/favnovelmain\/deleteconfirm\/favncode/){
		addSettingLink();
	}
	else{
		document.body.addEventListener('AutoPagerize_DOMNodeInserted',function(evt){
			var node = evt.target;
			addNextLink(node);
		}, false);
		addNextLink(document);
	}
})();