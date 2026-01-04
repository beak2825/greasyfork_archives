// ==UserScript==
// @name        NicoMylistRate
// @namespace   original
// @description ニコニコ動画のページ上の動画情報欄にマイリス率を表示します。(対応ページ：キーワード・タグ検索、マイリスト、ランキング、投稿動画、視聴履歴)
// @include     http://www.nicovideo.jp/mylist/*
// @include     http://www.nicovideo.jp/my/mylist*
// @include     http://www.nicovideo.jp/*/video*
// @include     http://www.nicovideo.jp/search/*
// @include     http://www.nicovideo.jp/ranking*
// @include     http://www.nicovideo.jp/tag/*
// @include     http://www.nicovideo.jp/my/history
// @version     1.00
// @downloadURL https://update.greasyfork.org/scripts/35304/NicoMylistRate.user.js
// @updateURL https://update.greasyfork.org/scripts/35304/NicoMylistRate.meta.js
// ==/UserScript==
(function(){
	var _video_list, _first_list_item, _list_item_count,m;
	//list_item_count:マイリス率表示処理済みの数
	var url = location.href;
	
	if(m = (url.indexOf("http://www.nicovideo.jp/my/")==0 || url.indexOf("http://www.nicovideo.jp/user/")==0)){
		var tagname = "li";
		var classname = "metadata";
	} else if(url.indexOf("http://www.nicovideo.jp/mylist/")==0){
		var tagname = "strong";
    var classname = "SYS_box_item_data";
	} else if(url=="http://www.nicovideo.jp/ranking"){
		var tagname ="dl";
	  var classname ="itemData";
	}else{
		var tagname = "li";
		var classname = "itemData";
	}
	var idname = "SYS_page_items";
	var k = 0;
	var mode = 0; //0or1
	var x = url=="http://www.nicovideo.jp/ranking" ? 0 : 1

function getSysPageItems() {
	var target_node = document.getElementById(idname);
	var list_items;
	if (target_node && _first_list_item != (list_items = target_node.getElementsByClassName(classname))[0]) {
		readSysPageItems(target_node, true);
	}
	else if (target_node && _list_item_count < list_items.length) {
		readSysPageItems(target_node, false);
	}
}

function readSysPageItems(sys_page_items_node, all) {
	var list_items = sys_page_items_node.getElementsByClassName(classname);
	var list_item;
	var target, view, mylist, video_list_item, indication;
	var i, count = list_items.length;
	var editnode;

	if (all) {
		_list_item_count = 0;
		_first_list_item = list_items[0];
	}
	for (i = _list_item_count; i < count; i++) {
		list_item = list_items[i];
		if(location.href.indexOf("http://www.nicovideo.jp/mylist")==0){
			var elem = document.createElement("strong");
			
			target = list_item.getElementsByTagName("p")[3].getElementsByTagName("strong");
			view = getNum(target[0].innerHTML.replace(/,/g,""));
			mylist = (mylist = getNum(target[2].innerHTML.replace(/,/g,"")));
			indication = " " + MakeIndication(view,mylist);
			
			elem.innerHTML = indication;
			console.log(elem.innerHTML);
			list_item.getElementsByTagName("p")[3].appendChild(elem);
    }else{
      target = list_item.getElementsByTagName(tagname);
			view = getNum(target[k].innerHTML.replace(/,/g,""));
			mylist = (mylist = getNum(target[k+2].innerHTML.replace(/,/g,"")))[x];
		
			indication = MakeIndication(view,mylist);
			if(mode==0){
				if(url=="http://www.nicovideo.jp/ranking"){
					target[2].childNodes[3].innerHTML += indication;
				}else{
				target[k+2].innerHTML += indication;
				}
			} else if(mode==1){
				var elem = document.createElement("li");
				elem.className="count";
				elem.innerHTML = "マイ率:<span class='value'>"+indication+"</span>";
				target[k+2].parentNode.insertBefore(elem,target[3]);
			}
		}

	}
	_list_item_count = count;
}
function MakeIndication(view, mylist){
	var rate, color, str;
	rate = (mylist/view*100).toFixed(1);
	str = mode == 0 ? (m ? " / " : "/ " ) : "";
	if(view<100){
		str += "--";
	}else{		
		if(rate>=10){
			color = "#B40404";
		}else if(rate>=5){
			color = "#006400";
		}else{
			color = "#333333";
		};
		str += ("<font color='" + color + "'>" + rate + "%</font>&nbsp;" );
	}
	return (str);
}
function getNum(str){
  return str.match(/\-?[0-9]*\.?[0-9]+/g);
}
function init() {
	_list_item_count = 0;
	_video_list = {};
	var url = location.href;
	var f = url.indexOf("http://www.nicovideo.jp/my/mylist")==0 || url.indexOf("http://www.nicovideo.jp/mylist")==0;
	if(f){ setInterval(getSysPageItems, 250);  }
	else { readSysPageItems(this.document,true);}
}

init();

})();