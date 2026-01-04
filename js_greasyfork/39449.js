// ==UserScript==
// @name         超星ss.chaoxing.com 及各地图书馆包库 的在线书一键获取目录 直接用于PDF目录编辑
// @namespace    http://tampermonkey.net/
// @version      1.0
// @note         22-01-28 1.0 swf失效后更换获取目录的在线XML Url
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJLgAAh5UAAITXAACA+QAAfPkAAHjZAABzlwECbzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJQIAACUlQAAk/0AAJT/AACU/wAAkv8AAI//AACJ/wAAgf8AAHf9AQFwmQkLbgoAAAAAAAAAAAAAAAAAAJsIAACbvQAAnf8AAJ//AACg/wAAoP8AAJ7/AACb/wAAl/8AAJH/AACI/wAAfP8BAXLBCg1wCgAAAAAAAAAAAAChkzM0tv9FRr//Dg2v/0ZGwv8uLrr/ICC0/0VGvv8nKLD/Hh+o/0RFsv8wMaL/AAB+/wECc5kAAAAAAACmKgEAqf2lp+f/7PD8/0VDy//z9/7/YmHT/8bJ8P/S1fT/XF3L/93i9f9nasj/Bgaa/wAAi/8AAHz9AQJ0LgIArI8EALL/dHPd//H2/v9TT9f/9fn+/05K1f/3+v7/aGfX/+fq+v8/PsT/AACn/wAAnv8AAJX/AACH/wAAepUEALPRBgC6/yUdzf/v8/7/am7h//b4/v9mbN//+vz+/3h24f+pqen/BQC3/wMArv8AAKX/AACb/wAAkP8AAIDVBgC58QkAwf8REMj/naXu/8LI8v/DyfX/lJ7p/+zu/P+Pl+n/kY/l/wcAvv8FALX/AQCr/wAAof8AAJb/AACH9QgAvvEOCcf/IjDO/0VV2P/j4/r/trrw/+nq+v+ssu//pKzu/87P9f8OBcT/BgC6/wMAsP8AAKX/AACa/wAAjfUJAMLRFx3L/zFD0/9OXtv/g4nm/+7t+//T0vb/1Nb2/8PG9P+Zo+3/g4Hj/wcAvf8EALP/AACo/wAAnP8AAJHVCwHFjx0ozf86TNX/XWre/4OH5/+uqfD/4+H6/9/e+P/GyPT/rbXx/+3w/f+VlOT/fX/a/wEAqf8AAJ7/AACUlQ0FxyodKc39OkzV/11q3v+Dh+f/pJ7u/5mW7P+Ul+r/q6/v/+bp/P/3+f7/8/f+/yUjv/8BAKn/AACe/QAAli4AAAAAHSjMkzJD0/9OXtv/a3Xi/32D5v94f+X/YGzf/0JT1/8uPtT/6u/9/6Sk7v94edj/AQCo/wAAn5cAAAAAAAAAABwnzAgmNs+9OUrV/0xc2v9XZd3/VGLc/0VV2P8wQdL/GiLN/15c2v8GALr/BwOz/wAApr8AAKAIAAAAAAAAAAAAAAAAIS/OCCc30JUvP9L9NUbU/zNF0/8qOtD/GyTM/wwFxv8IAL7/BQC1/QIArZkAAKcIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHyzNLh4qzZUZIcvXERDI+QsCxPkIAL/ZBgC5lwQAszAAAAAAAAAAAAAAAAAAAAAA+B8AAOAHAADAAwAAgAEAAIABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAQAAgAEAAMADAADgBwAA+B8AAA==
// @description  可以通过点击右侧的按钮直接复制出 超星ss.chaoxing.com 及各地图书馆包库的在线书获取目录哦，直接用于FreePic2Pdf的目录编辑FreePic2Pdf_bkmk.txt，省时省力。
// @author       405647825@qq.com
// @license      MIT
// @include      *ss.chaoxing.com/ebook/list?dxid=*
// @include      */n/slib/book/slib/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/39449/%E8%B6%85%E6%98%9Fsschaoxingcom%20%E5%8F%8A%E5%90%84%E5%9C%B0%E5%9B%BE%E4%B9%A6%E9%A6%86%E5%8C%85%E5%BA%93%20%E7%9A%84%E5%9C%A8%E7%BA%BF%E4%B9%A6%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96%E7%9B%AE%E5%BD%95%20%E7%9B%B4%E6%8E%A5%E7%94%A8%E4%BA%8EPDF%E7%9B%AE%E5%BD%95%E7%BC%96%E8%BE%91.user.js
// @updateURL https://update.greasyfork.org/scripts/39449/%E8%B6%85%E6%98%9Fsschaoxingcom%20%E5%8F%8A%E5%90%84%E5%9C%B0%E5%9B%BE%E4%B9%A6%E9%A6%86%E5%8C%85%E5%BA%93%20%E7%9A%84%E5%9C%A8%E7%BA%BF%E4%B9%A6%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96%E7%9B%AE%E5%BD%95%20%E7%9B%B4%E6%8E%A5%E7%94%A8%E4%BA%8EPDF%E7%9B%AE%E5%BD%95%E7%BC%96%E8%BE%91.meta.js
// ==/UserScript==

(function() {
	'use strict';
	//处于 ss.chaoxing.com/ebook/list?dxid= 网站时
	if(location.href.match(/ss\.chaoxing\.com\/ebook\/list\?dxid=/)){
		var jsonUrl = location.href.replace('list?','searchlistbyjson?');
		var jsonMenuContent = '';
		GM_xmlhttpRequest({
			method: 'GET',
			url:  jsonUrl,
			headers: {
				'User-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36',
				'Accept': 'application/json',
			},
			onload: function(responseDetails) {
				var jsonData = eval('(' + responseDetails.responseText + ')');
				for(var i = 0; i < jsonData.length; i++){
					var currEntry = jsonData[i];
					var jsonTitle = currEntry.content;
					var jsonPageNumber = currEntry.page.split('-')[0];
					console.log(jsonTitle + '\t' + jsonPageNumber);
					jsonMenuContent += jsonTitle + '\t' + jsonPageNumber + '\n';
				}
				unsafeWindow.copyJsonMenu = function() {
					GM_setClipboard(jsonMenuContent);
				};
				document.body.innerHTML += '<div style="margin:0px auto; width:30px;line-height:18px; position: fixed !important; right: 5px; top: 250px;  z-index: 100;"><button style="padding:5px; background: rgba(23,160,94,0.8);" onclick="copyJsonMenu();this.style.background=\'rgba(247,206,37,0.8)\';">复制目录</button></div>';
			}
		});
	}
	//
	var menuContent = '';
	var level = 0;
	function display(elem){
		var elem_child = elem.childNodes;
		for(var i=0; i<elem_child.length;i++){
			/*if(elem_child[i].nodeName == "#text" && !/\s/.test(elem_child.nodeValue)){
				elem.removeChild(elem_child[i]);
			}*/
			if(elem_child[i].nodeType == 1){
				if(elem_child[i].parentElement.tagName == 'treeview'){
					level = 0;
				}
				else if(elem_child[i].parentElement.parentElement.tagName == 'treeview'){
					level = 1;
				}
				else if(elem_child[i].parentElement.parentElement.parentElement.tagName == 'treeview'){
					level = 2;
				}
				else if(elem_child[i].parentElement.parentElement.parentElement.parentElement.tagName == 'treeview'){
					level = 3;
				}
				else if(elem_child[i].parentElement.parentElement.parentElement.parentElement.parentElement.tagName == 'treeview'){
					level = 4;
				}
				console.log('\t'.repeat(level) + elem_child[i].attributes[1].value.replace(/^\s+/, '\t') + '\t' + elem_child[i].attributes[2].value + '\n');
				menuContent += '\t'.repeat(level) + elem_child[i].attributes[1].value.replace(/^\s+/, '\t') + '\t' + elem_child[i].attributes[2].value + '\n';
				if(elem_child[i].hasChildNodes){
					//console.warn(elem_child[i]);
					display(elem_child[i]);
				}
			}
		}
	}
	//
	//var s = [[1, 0], [1, 1], [1, 1], [1, 2], [1, 1], [1, 119], [1, 0], [2, 2]];
	function getJiekou(s){
		var mulu = s[4][1];
		var bSum = 0;
		for(var i=0; i<5; i++){
			bSum += s[i][1];
		}
		bSum++;
		mulu = bSum-mulu;
		//console.log(mulu,bSum);
		return '〓用作参考：可能需手动调整，如果另从当当网下载到封面cov001需要BasePage、ContentsPage、TextPage都加1〓\n\n[Images]\n\n[Font]\nLanguage=GBK\nFontSize=10\nMargin=1.0\n\n[Bkmk]\nFile=FreePic2Pdf_bkmk.txt\nAddAsText=0\nShowBkmk=1\nShowAll=1\nBasePage='+bSum+'\n\n[Main]\nContentsPage='+mulu+'\nTextPage='+bSum+'\n\n〓或者这个：适合图书页码从封皮开始而正文页从非1开始的〓\n\n'+ '[Images]\n\n[Font]\nLanguage=GBK\nFontSize=10\nMargin=1.0\n\n[Bkmk]\nFile=FreePic2Pdf_bkmk.txt\nAddAsText=0\nShowBkmk=1\nShowAll=1\nBasePage=1\n\n[Main]\nContentsPage='+mulu+'\nTextPage='+bSum+'\n';
	}
	function getSMenu(s){
		var output = '';
		var tempArr = [];
		var bookStructure = ["封面","书名","版权","前言","目录","正文","封底"];
		var sum =0;
		//for(var i = s.length-1;i>0;i--){
		for(var i =4; i>0; i--){
			if(s[i][1]==0) continue;
			sum += s[i][1];
			//console.log(sum);
			tempArr[i]=-sum;
		}
		//console.log(tempArr);
		for(var j =0;j<tempArr.length;j++){
			if(tempArr[j] == 0 || tempArr[j] == undefined) continue;
			console.log(bookStructure[j]+'\t'+tempArr[j]);
			output += bookStructure[j]+'\t'+tempArr[j] + '\n';
		}
		return output;
	}
	//
	if(location.href.match(/\/n\/slib\/book\/slib\//)){

		//计算总页数
		var pageNumsList = eval(document.body.innerHTML.match(/var\spages\s=\s(.+);/)[1]);
		//不用 eval 高手提供的代替方法：
		//new Function("return" + "[[1, 0], [1, 1], [1, 1], [1, 2], [1, 1], [1, 119], [1, 0], [2, 2]]")();
		//直接滚动到出错的位置
		var bookStr = getSMenu(pageNumsList);
		//获取目录的在线XML Url
		//var menuUrl = document.body.querySelector('param[value^="/tree.swf?kid"]').value.replace('/tree.swf?','http://path.sslibrary.com/cat/cat2xml.dll?');
        var menuUrl = document.body.querySelector('#ztree').getAttribute('param').replace('/cat/cat2xml.dll?','http://path.sslibrary.com/cat/cat2xml.dll?');
		//添加按钮 复制目录
		console.log(menuUrl);
		//document.body.innerHTML += '<div style="margin:0px auto; width:30px;line-height:18px; position: fixed !important; right: 16px; top: 282px;  z-index: 100;"><button style="padding:5px; background: rgba(23,160,94,0.8);" onclick="copyMenu();this.style.background=\'rgba(247,206,37,0.8)\';">复制目录</button></div>';
		document.querySelector('#dirsidebar').innerHTML += '<div style="margin:0px auto; width:28px;line-height:18px;"><button style="padding:5px; background: rgba(23,160,94,0.8);" onclick="copyMenu();this.style.background=\'rgba(247,206,37,0.8)\';" title="FreePic2Pdf里=>更改PDF=>PdgCntEditor里用的">复制目录</button><button style="padding:5px; background: rgba(23,160,94,0.8);" onclick="copyJiekou();this.style.background=\'rgba(247,206,37,0.8)\';" title="FreePic2Pdf里=>更改PDF=>编辑接口文件里用的">复制接口文件</button></div>';
		unsafeWindow.copyJiekou = function() {
			console.log(getJiekou(pageNumsList));
			GM_setClipboard(getJiekou(pageNumsList));
		};
		unsafeWindow.copyMenu = function() {
			GM_xmlhttpRequest({
				method: 'GET',
				url:  menuUrl,
				headers: {
					'User-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36',
					'Accept': 'text/html,application/xhtml+xml,application/xml,text/xml',
				},
				onload: function(responseDetails) {
					console.log(responseDetails.responseText);
                    var parser = new DOMParser();
					var dom = parser.parseFromString(responseDetails.responseText,
													 "text/xml");
					console.warn(dom.firstChild);
					display(dom.firstChild);
					GM_setClipboard(bookStr+menuContent);
					menuContent = '';
				}
			});
		};
	}
	// Your code here...
})();