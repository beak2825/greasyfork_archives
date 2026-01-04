// ==UserScript==
// @name        fetcherx
// @version     2024.2.9
// @author       You
// @description  修改下载逻辑
// @match     	https://fetcherx.com
// @include     https://fetcherx.com/*
// @include     https://pbs.twimg.com/media/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @require https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @require https://update.greasyfork.org/scripts/480132/1309498/Get_all_img_Library.js
// @namespace https://greasyfork.org/users/1210231
// @downloadURL https://update.greasyfork.org/scripts/486765/fetcherx.user.js
// @updateURL https://update.greasyfork.org/scripts/486765/fetcherx.meta.js
// ==/UserScript==


$(function(){
	let getimg = function(){
		let img = $('img.media-image.ng-star-inserted:not([ccc])').each(function(){$(this).attr('ccc','yes')})
		if(img.length<1){return null}
		return img
	}
	let changeimg = function(img){
		if(img==null){return}
		img.css('border','2px #d37b06 solid')
			.each(function(){
				let src = this.src
				let name = document.title+'.jpg'
				$(this).parent().click(function(){
					console.log(src)
					console.log(document.title+'.jpg')
					GM_setValue('name',name)
					GM_setValue('src',src)
					window.location.href=src
					// GM_download({
					// 	url:src,
					// 	name:document.title+'.jpg'
					// })
				})
			})
	}
	let waitImgToDown = function(){
		if(GM_getValue('src')==window.location.href){
			let a = $('<a></a>')
			        .attr('href',window.location.href)
					.attr('download',GM_getValue('name'))
			$('img').after(a)
			a.append($('img'))
			a[0].click()
			GM_deleteValue('name')
			GM_deleteValue('src')
		}
	}
	
	let check = setInterval(function(){
		let img = getimg()
		changeimg(img)
		waitImgToDown()
	},100)
})