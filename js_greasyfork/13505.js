// ==UserScript==
// @name         SearchBox4Chrome
// @namespace    http:/202.204.48.66/
// @version      0.1
// @description  add a search box
// @author       You
// @match        http://202.204.48.66/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13505/SearchBox4Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/13505/SearchBox4Chrome.meta.js
// ==/UserScript==

var search = document.createElement('div');
search.id = 'search';
//创建搜索div
search.innerHTML = 
  '<form action="http://www.baidu.com/baidu"target="_blank"style="margin:0px;float:left;margin-left:10px">'+
				
    '<input name=tn type=hidden value=baidu />'+
    '<input type=text baiduSug="1" name=word placeholder="百度搜索" style="height:19px;width:364px;border:solid 1px #38f" />'+
    '<input type="submit" value="百度一下" />'+
  '</form>'+

  '<form method="get" action="http://dict.youdao.com/search"target="_blank"style="margin:0px;float:left;margin-left:60px">'+
			
		 '<input type="text"  name="q" placeholder="有道词典" style="height:19px;width:364px;border:solid 1px #d22e45" />'+
		 '<input type="submit" value="有道词典" />'+
	'</form>'


;
//设定搜索div内容
var midbody = document.getElementById('mid_body');
var content_body = document.getElementById('content_body');
midbody.insertBefore(search,content_body);
//插入完毕