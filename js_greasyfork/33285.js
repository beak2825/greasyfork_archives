// ==UserScript==
// @name   设置谷歌关键字颜色
// @namespace  http://huo119.com/
// @description  Set google search result color
// @require   http://code.jquery.com/jquery-1.11.3.min.js
// @include   http://*.google.*
// @include   https://*.google.*
// @grant GM_addStyle
// @version 0.0.1.20170918032127
// @downloadURL https://update.greasyfork.org/scripts/33285/%E8%AE%BE%E7%BD%AE%E8%B0%B7%E6%AD%8C%E5%85%B3%E9%94%AE%E5%AD%97%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/33285/%E8%AE%BE%E7%BD%AE%E8%B0%B7%E6%AD%8C%E5%85%B3%E9%94%AE%E5%AD%97%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==
function main()
{
	if(0==$('#search h3 a').length ||  -1 != $('#search h3 a:first').html().indexOf('<em>') ) return;	//无标题对象 或 在未进行替换前，系统已经标红 则退出
	
	var KeyWords = $.unique($('em').toArray());		//
	$.each(KeyWords,function(index,value){
		KeyWords[index] = KeyWords[index].innerHTML.toLowerCase();
	});
	
	var UniqueKeyWords = $.unique(KeyWords.sort(function(a, b){	 //排序之后方能使用 unique 函数
		return b.length - a.length; // 按元素长度降序排列
	}));		
	
	$.each(UniqueKeyWords,function(index,value){
		ReplaceKeyWord(UniqueKeyWords[index]);
	});
}

function ReplaceKeyWord(k)
{
	var Reg;
	/.*[\u4e00-\u9fa5]+.*$/.test(k)?Reg = new RegExp('('+ k +')','ig'):Reg = new RegExp('\\b('+ k +')\\b','ig');	//中文关键字无需判定边界
	$('#search h3 a').each(function() {
			$(this).html($(this).html().replace(Reg,'<em>$1</em>'));		//为关键字增加标签
	});
}

GM_addStyle("a:link {text-decoration:none!important;}"+
		"a:visited {color: #83006F!important;}"+
		"a:hover,a:active{color:#C00!important;background-color:transparent!important;text-decoration:underline!important}"+
		"em{color:#C00!important;font-weight:normal!important}");	

$(document).ajaxComplete(main());