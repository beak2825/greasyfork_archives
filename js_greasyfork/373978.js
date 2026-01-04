// ==UserScript==
// @name         去除非实拍款
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  过滤网批款实拍图
// @author       Ted
// @match        https://www.vvic.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @require      https://greasyfork.org/scripts/48306-waitforkeyelements/code/waitForKeyElements.js?version=275769
// @require      https://greasyfork.org/scripts/26454-jquery-cookie/code/jQuery%20Cookie.js?version=169689
// @downloadURL https://update.greasyfork.org/scripts/373978/%E5%8E%BB%E9%99%A4%E9%9D%9E%E5%AE%9E%E6%8B%8D%E6%AC%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/373978/%E5%8E%BB%E9%99%A4%E9%9D%9E%E5%AE%9E%E6%8B%8D%E6%AC%BE.meta.js
// ==/UserScript==
var item_tile;
waitForKeyElements ("li.item.price", main_real_pic);
function main_real_pic(jNode){
	jNode.after('<span id= "_btn_real_pic" class="btn btn-primary j-condition-ok"  href="javascript:void(0)">过滤实拍</span>');
	$('#_btn_real_pic').click(function (){
		$('div.goods-list.clearfix>ul>li').each(function(i, dom_obj){
	    item_tile = $(this).find("div.title>a").text();
	    if (typeof item_tile != "undefined"){
	    	if (!item_tile.includes('实拍')){
            	$(this).remove();
        	};
    	};
		});
	});};