// ==UserScript==
// @name         Google 搜索结果屏蔽
// @name:en      Google Search Results Block
// @namespace    Cheez.Search
// @version      1.0
// @description  根据网站、网址和关键字来屏蔽不想要的搜索结果
// @description:en  Block Google bad results by sites, urls and keywords.
// @icon         https://www.google.co.jp/images/branding/product/ico/googleg_lodp.ico     
// @author       以茄之名
// @author:en    Cheez
// @include      https://www.google.*/search*
// @include      https://www.google.*.*/search*
// @require       https://ajax.aspnetcdn.com/ajax/jquery/jquery-2.1.4.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/23736/Google%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/23736/Google%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var $=jQuery,
		blacklist=GM_getValue('blacklist')&&JSON.parse(GM_getValue('blacklist'))||{
			host:[],
			url:[],
			word:[]
		}, 
		logs=[]; 
	if (GM_getValue('version')==''||GM_getValue('version')&&GM_getValue('version')<GM_info.script.version){
		var changes='';
		if(changes)alert(changes);
		GM_setValue('version',GM_info.script.version);
	}
	console.log(blacklist);
	$('[onmousedown]').attr('onmousedown','');
	$.each(jQuery('[href*=webcache]'),function(i,o){jQuery(o).attr('href',jQuery(o).attr('href').replace('p:','ps:'));});

	function hid(hosts,urls,words){
		$('.g:not(.hiden,.checked) .r>a').filter(function(i,o){

			if($.inArray(o.host,hosts)>-1){
				logs.push({'域名':o.host,'地址':o.href,'匹配类型':'域名'});
				return true;
			}
			var flag=false;
			$.each(urls,function(i,oo){
				if( (new RegExp(oo)).test(o.href) ){
					logs.push({'域名':o.host,'地址':o.href,'匹配类型':'地址','匹配':oo});
					flag=true; return false;
				}
			});
			$.each(words,function(i,oo){
				if(  o.textContent.indexOf(oo) >-1 ){
					logs.push({'域名':o.host,'地址':o.href,'匹配类型':'关键字','匹配':oo});
					flag=true; return false;
				}
			});


			if(!flag){ 
				var p=$(o).parents('.g').addClass('checked');
				var menu=$(p).find('.action-menu-panel>ol');
				var li=$('<li class="action-menu-item ab_dropdownitem" role="menuitem" aria-selected="false"><a class="fl" data-host="'+o.host+'" data-url="'+o.href+'" tabindex="-1">屏蔽该类网址</a></li>');
				if( menu.size() ){ 
					//'<li class="action-menu-item ab_dropdownitem" role="menuitem" aria-selected="false"><a class="fl block-site"  data-url="'+o.href+'" tabindex="-1">屏蔽该类网址</a></li>'+'<li class="action-menu-item ab_dropdownitem" role="menuitem" aria-selected="false"><a class="fl block"  data-host="'+o.host+'" tabindex="-1">屏蔽该网站</a></li>');
				}else{
					var text='<div class="action-menu ab_ctl"><a class="_Fmb ab_button" href="#"  aria-label="结果详情" aria-expanded="false" aria-haspopup="true" role="button" jsaction="m.tdd;keydown:m.hbke;keypress:m.mskpe" ><span class="mn-dwn-arw"></span></a><div class="action-menu-panel ab_dropdown" role="menu" tabindex="-1" jsaction="keydown:m.hdke;mouseover:m.hdhne;mouseout:m.hdhue"><ol> </ol></div></div>';
					menu=$(p).find('.kv').append(text ).find('.action-menu-panel>ol');
				}
				menu.filter(':not(:has(.block-site))').append(li.clone().find('a').addClass('block-site').end(),li.clone().find('a').addClass('block').text('屏蔽该网站').end()) ;

			}

			return flag;
		}).parents('.g').addClass('hiden').hide();
		if(logs.length){console.table(logs);logs=[];}

	}
	var aThing;
	$(document.body).on('DOMNodeInserted', function () {
		clearTimeout(aThing);
		aThing = setTimeout(function () {
			if($('.sp-separator').size()){$(document.body).trigger('aThing');}
		}, 50);
	});

	$(document.body).on('aThing', function () { //监听DOM树插入
		hid(blacklist.host,blacklist.url,blacklist.word);
		$('[onmousedown]').attr('onmousedown','');
		$.each(jQuery('[href*=webcache]'),function(i,o){jQuery(o).attr('href',jQuery(o).attr('href').replace('p:','ps:'));});
	});
	hid(blacklist.host,blacklist.url,blacklist.word);
	$('#rso').delegate('a.block','click',function(e){
		$(this).parents('.g').addClass('hiden').hide();
		blacklist.host.push($(this).data('host'));
		GM_setValue('blacklist',JSON.stringify(blacklist));
		hid([$(this).data('host')],[],[]);
	});
	$('#rso').delegate('a.block-site','click',function(e){
		var mch=prompt("请输入对应的匹配",$(this).data('url').replace(/(?!\\)（[\$\(\)\*\+\.\[\]\?\^\{\}\|\\]）/g,/\\$1/));
		if(mch){
			mch=str2reg(mch);
			$(this).parents('.g').addClass('hiden').hide();
			blacklist.url.push(mch);
			GM_setValue('blacklist',JSON.stringify(blacklist));
			hid([],[mch],[]);
		}
	});

	function addKeyword() { 
		var word=prompt("请输入要屏蔽的关键字（Input the keyword.）" );
		if(word){  
			blacklist.word.push(word);
			GM_setValue('blacklist',JSON.stringify(blacklist));
			hid([],[ ],[word]);
		}
	}

	GM_registerMenuCommand("增加屏蔽关键字（Add keyword）", addKeyword);

	$(window).on('close', function () {  GM_setValue('blacklist',JSON.stringify(blacklist));});

	function str2reg(str){
		return str.replace(/(?!\\)（[\$\(\)\*\+\.\[\]\?\^\{\}\|\\]）/g,/\\$1/);
	}

})();