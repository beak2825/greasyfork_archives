// ==UserScript==
// @name        socialgirls
// @version     2023.11.18
// @author       You
// @description  socialgirls网站的优化体验
// @match     	https://socialgirls.im
// @include     https://socialgirls.im/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @require https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @require https://update.greasyfork.org/scripts/480132/1283412/Get_all_img_Library.js
// @namespace https://greasyfork.org/users/1210231
// @downloadURL https://update.greasyfork.org/scripts/484676/socialgirls.user.js
// @updateURL https://update.greasyfork.org/scripts/484676/socialgirls.meta.js
// ==/UserScript==
$(function(){
	var key = "socialgirls"
	var nums = 3
	var geturl = function(){
		return window.location.href
	}
	var getimg = function(data){
		return $('.my-grid.row').children().clone()
	}
	var changeimg = function(img){
		if(window.location.href.indexOf('rand')<0){return}
		img.each(function(){
			if($(this).parent().attr('href')){$(this).parent().removeAttr('href')}
			$(this).click(function(){
				var color = "5px #"+Math.floor(Math.random() * 16777215).toString(16)+" solid"
				$(this).css('border',color)
				GM_download({
					url:this.src,
					name:document.title.match(/(?<=#)[^,]+/g)[0]+'.jpg',
				})
			}).removeClass("sensitive")
		})
	}
	changeimg($('img.card-image'))
	var putimg = function(img,i){
		$('.my-grid.row').append(img)
		changeimg(img.find('img.card-image'))
		console.log(img.length)
		window.GAIL.remove_sameimg()
	}
	
	window.GAIL.get_img_obo_sessionStorage(key,nums,geturl,getimg,putimg)
	var bu = window.GAIL.obo_sessionStorage_start_bu()
	$('body').append(bu)
	
	//隐藏下方按钮
	$('.footer-bar.d-block.d-md-none').hide().css('transform','translateY(100vh)')
	
	//如果不是随机页面跳转到随机页面
	var randpage = $('select.form-select option:contains("Random")[data-href]')
	if(randpage.length>0 && window.location.href.indexOf('rand')<0){
		randpage = randpage.attr('data-href')
		window.location.href = randpage
	}
})