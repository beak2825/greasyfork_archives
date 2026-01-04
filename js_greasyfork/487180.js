// ==UserScript==
// @name        coomer.su
// @version     2024.2.13
// @author       You
// @description  修复手机端不能正常显示图片2
// @match     	https://coomer.su
// @include     https://coomer.su/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @require https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @require https://update.greasyfork.org/scripts/480132/1309498/Get_all_img_Library.js
// @namespace https://greasyfork.org/users/1210231
// @downloadURL https://update.greasyfork.org/scripts/487180/coomersu.user.js
// @updateURL https://update.greasyfork.org/scripts/487180/coomersu.meta.js
// ==/UserScript==
function home(){
	function main()
	{
		window.GAIL.get_img_obo_ajax_href(key,nums,geturl,getimg,putimg)
	}
	
	const key = "user"
	
	const atag = $('a.image-link[href*="post"]:not([ccc])').attr('ccc','yes')
	
	const nums = atag.length
	
	const geturl = (i) =>
	{return atag.eq(i).attr('href')}
	
	const getimg = (data) =>
	{
		console.log('geted img')
		return $(data).find('a:has(img[data-src])')
	}
	
	const putimg = (img,i) =>
	{
		console.log('put img')
		atag.eq(i).after(img)
		atag.eq(i).remove()
		img.each(function(){$(this).attr('data-href',this.href).removeAttr('href')})
		img.find('img').css('border-radius','50px')
		img.click(function(){
			let photo = $('<img>').attr('src',$(this).attr('data-href'))
			$(this).after(photo)
			$(this).remove()
			photo.click(function(){
				GM_download({
					url:this.src,
					name:document.title+".jpg",
				})
			})
		})
		window.GAIL.showmass(i+'/'+atag.length)
	}
	
	if(atag.length<1||window.location.href.indexOf(key)<0){return}
	main()
}

$(function(){
	home()
	//let check = setInterval(home,500)
	
	//修改排版
	const postcard = 
	{'width':'100% !important','height':'auto !important'}
	
	const cardlist = 
	{
		'display': 'grid !important',
		'grid-template-columns': '1fr !important',
		'justify-content': 'center !important',
		'align-items': 'center !important',
		'gap': '0px !important',
	}
	
	window.GAIL.add_css('.card-list__items',cardlist)
	window.GAIL.add_css('.post-card',postcard)
	// const changMatrix = ()=>{ $('.matrix:not([ccc])').attr('ccc','yes').css('grid-template-columns','repeat(1,1fr)') }
	// let checkpb = setInterval(changMatrix,500)
})