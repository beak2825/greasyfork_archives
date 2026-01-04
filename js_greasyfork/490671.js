// ==UserScript==
// @name         pixai
// @namespace    http://tampermonkey.net/
// @version      2024.3.26
// @description  修复图片显示不全的问题
// @author       You
// @include       https://pixai.art/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ouo.io
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @require		https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://update.greasyfork.org/scripts/488188/1335058/Lasy_load_img_Library.js
// @downloadURL https://update.greasyfork.org/scripts/490671/pixai.user.js
// @updateURL https://update.greasyfork.org/scripts/490671/pixai.meta.js
// ==/UserScript==

class list_change{
	main(){
		let me = new list_change()
		let bu = me.add_bu()
		bu.click(function(){
			me.getimg()
				.then(me.change_src)
				.then(me.change_pb)
		})

		me.change_next_bu_fu()
	}
	add_bu(){
		let bu = $('<button>GetBigger</button>').css('font-size','10vh')
		let add = function(){
			let box = $('.grid.grid-cols-2.gap-3:has(img[src*="stillThumb"])')
			if(box.length>0){
				box.before(bu)
				clearInterval(check)
			}
		}
		let check = setInterval(add,500)
		return bu
	}
	async getimg(){
		let item = $('.grid.grid-cols-2.gap-3:has(img[src*="stillThumb"])').children('*:not([ccc])').each(function(){
			$(this).attr('ccc','yes')
		})
		return new Promise((reject)=>{reject(item)})
	}
	change_src(item){
		let img = item.find('.group.relative.isolate.bg-skeleton.overflow-hidden.w-full.h-full img[src*="stillThumb"]')
		img.each(function(){
			this.src = this.src.replace('stillThumb','orig')
			$(this).parents('a:first').removeAttr('href')
		})
		return item
		//https://images-ng.pixai.art/images/stillThumb/2b51f544-b673-40da-924d-fabbb0a5e97c
		//https://images-ng.pixai.art/images/orig/2b51f544-b673-40da-924d-fabbb0a5e97c
	}
	change_pb(item){
		item.each(function(){
			let img = $(this).find('img[src*="orig"]').css('height','auto')
			img.click(function(e){
				e.stopPropagation()
				let name = document.title.match(/[^\|]+/g)[0]+".jpg"
				let src = this.src
				GM_download({
					url:src,
					name:name,
				})
			})
		})
		item.parent().css("grid-template-columns","100vw")
		$('.jtnVVE').css('padding','0px')
		item.find('.aspect-square').css('height','100vh')
	}
	change_next_bu_fu(){
		let buchange = function(){
			let bu = $('.MuiButtonGroup-root.MuiButtonGroup-outlined:has(button) button:not([ccc])')
			if(bu.length>0){
				bu.each(function(){
					$(this).attr('ccc','yes').click(function(){
						function scrollto(){
							let img = $('img[src*="orig"]')
							if(img.length==0){
								setTimeout(function() {scrollto()}, 500);
							}else{
								img.eq(0)[0].scrollIntoView()
							}
						}
						scrollto()
					})
				})
				clearInterval(check)
			}
		}
		let check = setInterval(buchange,500)
	}
}

$(function(){
	let list = new list_change()
	list.main()
})