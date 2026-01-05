// ==UserScript==
// @name         获取淘宝评论图片
// @namespace    https://greasyfork.org/zh-CN/scripts/22386
// @version      20170820
// @description  Get TAOBAO Comment Pic
// @author       sbdx
// @match        https://item.taobao.com/item.htm?*
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/22386/%E8%8E%B7%E5%8F%96%E6%B7%98%E5%AE%9D%E8%AF%84%E8%AE%BA%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/22386/%E8%8E%B7%E5%8F%96%E6%B7%98%E5%AE%9D%E8%AF%84%E8%AE%BA%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
/*
Target URL: https://item.taobao.com/item.htm?id=528857970664
*/
(function() {
	//   'use strict';
	var page=1;
	var url,PageTotal;
	var itemid,sellerid;
	var targetElement='div.tb-revbd';
	itemid=g_config.itemId;
	sellerid=g_config.sellerId;

	function getJSON()
	{
		$('#J_IdsSegments').css('z-index',100);//降低右侧div的层级
		
		url="https://rate.taobao.com/feedRateList.htm?auctionNumId=" + itemid + "&userNumId=" + sellerid + "&currentPageNum=" + page + "&rateType=3&orderType=sort_weight&attribute=&sku=&hasSku=false&folded=0&_ksTS="+(new Date().getTime()) + "&callback=?";
		$.getJSON(url,function(d){
			if(page==1) PageTotal=d.maxPage;
			ProcessJSON(d);
			page++;
			if(page<=Math.min(10,PageTotal))getJSON();//最多取10页数据
		});

	}
	function ProcessJSON(d)
	{
		var ImgList=[];
		$.each(d.comments,function(i,v){
			img='';
			if(v.photos)
			{
				$.each(v.photos,function(pi,pv){
					img+="<img src='" + pv.url.replace('_400x400.jpg','') + "' /><br><br>\r\n";
				});
			}
			if(v.appendList.photos)
			{
				$.each(v.appendList.photos,function(pi,pv){
					img+="<img src='" + pv.url.replace('_400x400.jpg','') + "' /><br><br>\r\n";
				});
			}
			ImgList.push(img);
		});
		//$('.detail-eval.J_DetailEval').append('<div>第' + page + '页</div>'+ImgList.join(''));
		$(targetElement).append('<div>第' + page + '页</div>'+ImgList.join(''));
	}
	if($)
	{
		$("body").append("<div id='sbdx_tools_getAllImage' style='position:absolute;right:10px;top:100px;z-index:200000020'><button>显示评论全部图片</button></div>");$("#sbdx_tools_getAllImage").on("click",function(){page=1;$(targetElement).html('');getJSON();});
		$(window).scroll(function(){$("div[id^=sbdx]").each(function(i){$(this).offset({top:$(document).scrollTop()+100+i*30});});});
	}
})();