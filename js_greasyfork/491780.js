// ==UserScript==
// @name        sankakucomplex 2.0
// @version      2021.2.21
// @author       You
// @description  good
// @include     https://chan.sankakucomplex.com/*/post/show/*
// @include     https://chan.sankakucomplex.com/post/*
// @match     https://chan.sankakucomplex.com/post
// @include     https://chan.sankakucomplex.com/?tags=*
// @include     https://chan.sankakucomplex.com/*/?tags=*
// @include     https://s.sankakucomplex.com/data/*
// @include     https://chan.sankakucomplex.com/*
// @include     https://beta.sankakucomplex.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @require https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @require https://update.greasyfork.org/scripts/480132/1349340/Get_all_img_Library.js
// @namespace https://greasyfork.org/users/1210231
// @downloadURL https://update.greasyfork.org/scripts/491780/sankakucomplex%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/491780/sankakucomplex%2020.meta.js
// ==/UserScript==
$(function(){
	if($('a#image-link').length>0){
		let list = new listPage()
		list.changePB()
	}else{
		let home = new homePage()
		home.changePB()
	}
})
class homePage{
	changePB(){
		if($(window).width()<$(window).height()){
			this._SHOUJI.change_popular()
			this._SHOUJI.change_main()
		}else{
			this._PC.change_popular()
			this._PC.change_main()
		}
		this.change_atag()
		del_ad()
	}
	constructor(){
		this._SHOUJI = class SHOUJI{
							static change_popular(){
								let tag = ".popular-preview-post,span.thumb,img.preview"
								let object = {width:"100% !important",height:"auto !important"}
								window.GAIL.add_css(tag,object)
								
								tag = "span.thumb a"
								object = {'flex-grow':'1'}
								window.GAIL.add_css(tag,object)
							}
							static change_main(){
								let tag = ".post-gallery-grid.post-gallery-150 .posts-container"
								let object = {'grid-template-columns':'1fr !important'}
								window.GAIL.add_css(tag,object)
								
								tag = ".post-preview-container"
								object = {width:"100% !important",height:"auto !important"}
								window.GAIL.add_css(tag,object)
								
								tag = "article.post-preview .post-preview-link"
								object = {'flex-grow':'1'}
								window.GAIL.add_css(tag,object)
								
								tag = ".post-preview-150 .post-preview-image"
								object = {width:'100% !important','max-height':'100% !important'}
								window.GAIL.add_css(tag,object)
							}
						}
		this._PC = class PC{
							static change_popular(){
								let tag = ".popular-preview-post,span.thumb,img.preview"
								let object = {width:"100% !important",height:"auto !important"}
								window.GAIL.add_css(tag,object)
								
								tag = "span.thumb a"
								object = {'flex-grow':'1'}
								window.GAIL.add_css(tag,object)
								
								tag = ".popular-preview-post"
								object = {width:"25% !important"}
								window.GAIL.add_css(tag,object)
							}
							static change_main(){
								let tag = ".post-gallery-grid.post-gallery-150 .posts-container"
								let object = {'grid-template-columns':'1fr 1fr 1fr 1fr !important'}
								window.GAIL.add_css(tag,object)
								
								tag = ".post-preview-container"
								object = {width:"100% !important",height:"auto !important"}
								window.GAIL.add_css(tag,object)
								
								tag = "article.post-preview .post-preview-link"
								object = {'flex-grow':'1'}
								window.GAIL.add_css(tag,object)
								
								tag = ".post-preview-150 .post-preview-image"
								object = {width:'100% !important','max-height':'100% !important'}
								window.GAIL.add_css(tag,object)
							}
						} 
	}
	change_atag(){
		$('.post-preview-container a,.popular-preview-post a').each(function(){
			let href = this.href
			$(this).attr('_href',href)
			$(this).removeAttr('href')
			$(this).click(function(){
				window.open($(this).attr('_href'))
			})
		})
	}
	
}

class listPage{
	changePB(){
		this.change_atag()
		this.get_big_img()
		del_ad()
	}
	change_atag(){
		$('.carousel-content a[target]').removeAttr('target')
		//myInterval(()=>{$('.carousel-content a[target]').removeAttr('target')},1000)
	}
	get_big_img(){
		$('a#image-link:not([ccc])').attr('ccc','yes').click(function(){
			console.log('click')
			let name = '【comic】'+document.title.match(/^[^：]+/g)[0]+'.png'
			if($(this).find('img')[0].src.match(/sample/g)){
				GM_download({
					url:this.href,
					name:name,
				})
				return
			}
			let url = $(this).find('img')[0].src
			//download_by_atag(name,url)
			GM_download({
				url:url,
				name:name,
			})
		})
	}
}
function download_by_atag(name, url) {
    let newWindow = window.open(url);
    newWindow.onload = function() {
        let a = $('<a></a>').attr({
            href: url,
            download: name
        });
        let img = $(newWindow.document).find('img');
        a.append(img); // 将 img 添加到 a 元素中
        $(newWindow.document.body).append(a);
        a[0].click();
        // newWindow.close(); // 下载完成后关闭新窗口
    };
}
function myInterval(callback,maxTime){
	let time = 0
	let check = setInterval(()=>{
		callback()
		if(++time*100>=maxTime){clearInterval(check);return}
	},100)
}
function del_ad(){
	$('.iframe_row,.carousel').remove()
}