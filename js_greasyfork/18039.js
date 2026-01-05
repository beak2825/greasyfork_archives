// ==UserScript==
// @name           douban_opac
// @namespace      douban_opac
// @description    douban book links to XmuLibrary OPAC item
// @include        https://book.douban.com/subject/*
// @include        https://book.douban.com/isbn/*
// @include        http://book.douban.com/subject/*
// @include        http://book.douban.com/isbn/*
// @author		   zhx@xmulib.org
// @version 	   v2.5
// @require    	   http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/18039/douban_opac.user.js
// @updateURL https://update.greasyfork.org/scripts/18039/douban_opac.meta.js
// ==/UserScript==

$(document).ready(function(){
	var title = $('h1').text();
    $("#info .pl").each(function(i){
		if ($(this).text() == 'ISBN:'){
		  	isbn = $(this)[0].nextSibling.nodeValue;
		  	isbn = isbn.substr(1,13);
		}
	});
	var opacurl = 'http://210.34.4.28/api/getLOC.php?isbn='+isbn+'&title='+title;
	GM_xmlhttpRequest({ //获取列表
      	method : "GET",
      	synchronous : false,
      	url : opacurl,
      	onload : function (ret) {
			item = ret.responseText;
			item_json = JSON.parse(item);
	        if (item_json.marc_no != ""){
				var opacLink = "http://210.34.4.28/opac/item.php?marc_no="+item.marc_no;
				var htmlStr = "<h2>在哪借这本书?  ·  ·  ·  ·  ·  · </h2>";
				htmlStr += "<div class=indent><li><a href='"+opacLink+"' target='_blank'>厦门大学图书馆馆藏</a></li>";
				if (item_json.call_no !="")
				{
					htmlStr += "<ul class='bs'>";
					try
					{
						for (var i=0;i<item_json.Loc_NAME.length;i++)
						{
							htmlStr += "<li style='font-size:12px'>"+item_json.call_no+"&nbsp;&nbsp;"+item_json.Loc_NAME[i];
							if (item_json.book_stat[i] == "在馆")
							{
								htmlStr += "&nbsp;&nbsp;<font color='#006600'>"+item_json.book_stat[i]+"</font></li>";
							}
							else
								htmlStr += "&nbsp;&nbsp;<font color='red'>"+item_json.book_stat[i]+"</font></li>";
						}
					}
					catch (e)
					{
					}
					htmlStr += "</ul></div></br>";
				}
				$(".aside div:eq(0)").after(htmlStr);
			}
			else if(item_json.marc_no=="" || item_json.title !=""){
				var opacLink = "http://210.34.4.28/opac/openlink.php?title="+ret.responseText.title;
				var htmlStr = "<h2>在哪借这本书?  ·  ·  ·  ·  ·  · </h2>";
				htmlStr += "<div class=indent><li><a href='"+opacLink+"' target='_blank'>厦门大学图书馆馆藏</a></li></div>";
				$(".aside div:eq(0)").after(htmlStr);
			}
		}
	});
});

