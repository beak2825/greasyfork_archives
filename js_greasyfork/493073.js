// ==UserScript==
// @name        yailay
// @namespace    http://tampermonkey.net/
// @version      2024.5.14
// @description  修复主页、详细页逻辑
// @license      GNU
// @author       You
// @include     https://pic.yailay.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect       *
// @require     https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @require		https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://update.greasyfork.org/scripts/480132/1349340/Get_all_img_Library.js
// @downloadURL https://update.greasyfork.org/scripts/493073/yailay.user.js
// @updateURL https://update.greasyfork.org/scripts/493073/yailay.meta.js
// ==/UserScript==
$(function(){
	let bu = add_bu();
	bu.click(function(){
		get_list(get_big_img);
	})
	changePb();
	$('body').on('touchstart',function(){
		del_ad();
	});
})
function add_bu(){
	let bu = $('<button>Ajax10</button>')
			.css({
				width:'100%',
				'font-size':'10vw'
			})
	$('.contentme').before(bu)
	return bu
}
function get_list(callback){
	$('.contentme').children().remove();
	let key = "yailay";
	let atag = $('a.page-numbers[href]:eq(-2)');
	let nums = (()=>{
					if(atag.length>0){
						return Number(atag.text())
					}else{
						return 1
					}
				})();
	
	//page记录当前ajax到了第几页
	let page = sessionStorage.getItem('page');
	if(!page){page=0}else{page = Number(page);}
	if(page>=nums){page=0;}
	
	let geturl = function(i){
		            if(nums==0){return window.location.href;}
					if(i+page==nums||i==10){sessionStorage.setItem('page',i+page);return false;} //超出总页数或10页就退出
					return atag[0].href.replace(/\d+$/g,(i+1+page));
				}
	let getimg = function(data){return $(data).find('.contentme').children();}
	let putimg = function(img,i){
		$('.contentme').append(img);
		$('.mass_top').css('font-size','10vw');

		//$('#basicExample').children('*:not([ccc])').remove()
		$('*:not(.download_bu,.mass_top)').filter(function(){return $(this).css('position')=="fixed";}).remove();
		callback(img);
	}
	window.GAIL.get_img_obo_ajax_href(key,nums,geturl,getimg,putimg)
}
function get_big_img(img){
	//https://i2.wp.com/img.cosxuxi.club/s2/UGZVM25XWGRpMm5LcUFDeFg5QzU3ZE9TRm0vNzRCeDl0WXFlRHhqb3dJa09sR2dmMHJHS1FYbkhvcXR6OUlQQ1Z1WG01akJYYWt0R0gzMU85S1gvbGtvSkRrZVF2Ny9oRHk1ZGtvRWhRSVU9-d.jpg
	
	let iimg = img.find('img');
	iimg.each(function(){
        let parent = $(this).parent().before($(this).attr('big','yes'));
        parent.hide();
		$(this).click(function(){
			event.stopPropagation();
			let name = document.title + ".jpg";
			let src = $(this).attr('src');
			let _this = this;
			GM_download({
				url:src,
				name:name,
				onload:()=>{$(_this).remove()}
			});
		});
	});
}
function checkimg_unloaded(){
	let checking = function(){
		let img = $('img[big]:visible').filter(function(){return this.naturalWidth == 0})
		if(img.length>0){
			img.each(function(){
				var clone = $(this).clone(true)
				$(this).after(clone)
				$(this).remove()
				clone[0].scrollIntoView()
			})
		}else{}
	}
	let check = setInterval(checking,500)
}
function changePb(){
	let tag = '.xld';
	let css = {'max-height':'100% !important'};
	window.GAIL.add_css(tag,css);
}
function del_ad(){
	$('.xld:not([ccc])').each(function(){
		$(this).attr('ccc','yes');
		$(this).click(function(e){
			e.stopPropagation();
			let url = $(this).parent('a');
			if(url.length==0){return;}
			$(this).parent().attr('target','_blank')
		})
	});
	$('.exo_wrapper').remove();
}