// ==UserScript==
// @name        kpopping
// @version     2024.1.15.2
// @author       You
// @description  修复手机端不能正常显示图片2
// @match     	https://kpopping.com
// @include     https://kpopping.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @require https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @require https://update.greasyfork.org/scripts/480132/1309498/Get_all_img_Library.js
// @namespace https://greasyfork.org/users/1210231
// @downloadURL https://update.greasyfork.org/scripts/484455/kpopping.user.js
// @updateURL https://update.greasyfork.org/scripts/484455/kpopping.meta.js
// ==/UserScript==
function home(){
	function main()
	{
		window.GAIL.get_img_obo_ajax_href(key,nums,geturl,getimg,putimg)
	}
	
	const key = "profiles"
	
	const atag = $('.matrix a:not([ccc])').attr('ccc','yes')
	
	const nums = atag.length
	
	const geturl = (i) =>
	{return atag.eq(i).attr('href')}
	
	const getimg = (data) =>
	{
		console.log('geted img')
		let img = $('<div></div>')
		const a = $(data).find('.justified-gallery a')
		a.each(function(){
			img.append(
				$('<img>').attr('src',this.href).css({width:'100vw',height:'auto','transform': 'translateX(-30px)'})
			)
		})
		console.log(img.children())
		return img.children()
	}
	
	const putimg = (img,i) =>
	{
		console.log('put img')
		atag.eq(i).find('img:first').remove()
		$('.box.pics').before(img)
		img.click(function(){
			GM_download({
				url:this.src,
				name:document.title+".jpeg",
			})
		})
		atag.eq(i).removeAttr('href').css('border','3px #f45f3f solid')
		window.GAIL.showmass(i+'/'+atag.length)
	}
	
	if(atag.length<1||window.location.href.indexOf(key)<0){return}
	main()
}

$(function(){
	let check = setInterval(home,500)
	
	//修改排版
	const matrix = 
	{'grid-template-columns':'repeat(1,1fr) !important'}
	
	const figure = 
	{
		'padding-top' : '0% !important' ,
		'display' : 'grid',
	}
	
	const figureimg = 
	{'position' : 'relative !important'}
	
	window.GAIL.add_css('.pics .matrix .cell figure',figure)
	window.GAIL.add_css('.pics .matrix .cell figure img',figureimg)
	const changMatrix = ()=>{ $('.matrix:not([ccc])').attr('ccc','yes').css('grid-template-columns','repeat(1,1fr)') }
	let checkpb = setInterval(changMatrix,500)
})