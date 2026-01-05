// ==UserScript==
// @name         QuickPass4Chrome
// @namespace    202.204.48.66
// @version      0.3
// @description  去除5秒限制；去除注销弹框；请勿滥用^-^；
// @author       泡椒凤爪

// @match       *://202.204.48.66/*
// @include     *://202.204.48.82/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10856/QuickPass4Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/10856/QuickPass4Chrome.meta.js
// ==/UserScript==
remain = -2;
wc = function(){s2=1;window.location=url4;}

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