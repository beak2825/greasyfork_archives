// ==UserScript==
// @name         ja.hentai 2.0
// @namespace    http://tampermonkey.net/
// @version      2024.4.19
// @description  修复主页、详细页逻辑
// @author       You
// @include        https://ja.hentai-cosplays.com
// @include			https://ja.hentai-cosplays.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ouo.io
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @require		https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://update.greasyfork.org/scripts/488188/1335058/Lasy_load_img_Library.js
// @require https://update.greasyfork.org/scripts/480132/1349340/Get_all_img_Library.js
// @downloadURL https://update.greasyfork.org/scripts/494870/jahentai%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/494870/jahentai%2020.meta.js
// ==/UserScript==


$(function(){
	let home = new Home();
	let list = new List();
})
class Home{
	constructor(){
		if(this.Is_homePath()){
			this.Change_pb();
		}
	}
	Is_homePath(){
		//if(window.location.href.match(/tags.+artworks/g)){return true;}
		return true;
	}
	Change_pb(){
		//https://i.pximg.net/c/600x1200_90_webp/img-master/img/2024/04/19/21/23/51/117979360_p0_master1200.jpg
		//https://i.pximg.net/c/360x360_10_webp/img-master/img/2024/04/19/21/23/51/117979360_p0_square1200.jpg
		let tag = "";
		let object = {};
		
		tag = "#entry_list li";
		object = {'height':'auto !important'};
		window.GAIL.add_css(tag,object);
		
		tag = "div.content_img, img.ct_img";
		object = {'height':'auto !important'};
		window.GAIL.add_css(tag,object);
	}
}
class List{
	constructor(){
		if(this.Is_listPath()){
			this.Get_imgs();
			this.changePb()
		}
	}
	Is_listPath(){
		if(window.location.href.match(/ja.hentai-cosplays.com\/image/g)){return true;}
		return false;
	}
	Get_imgs(){
        //https://static14.hentai-cosplays.com/upload/20240504/373/381425/p=305/1.jpg
		//https://static13.hentai-cosplays.com/upload/20240504/373/381425/1.jpg
		
		//https://ja.hentai-cosplays.com/image/byoru-ubel/
		//https://ja.hentai-cosplays.com/image/byoru-ubel/attachment/1/
		//https://ja.hentai-cosplays.com/story/byoru-ubel/
	}
	changePb(){
		let tag;
		let object;
		
		tag = 'div#paginator_area';
		object = {'font-size':'10vw'};
		window.GAIL.add_css(tag,object);
	}
}
function del_ad(){
	$('#exo-mobile-im-container-wrapper').remove();
	$('[loading]:not([ccc])').each(function(){
		$(this).attr('ccc','yes');
		$(this).click(function(e){
			e.stopPropagation();
			$(this).parents('a:first').attr('target','_blank');
		});
	});
	$('a:not([ccc])').attr('ccc','yes')
	                 .click(function(e){e.stopPropagation();})
}
$(function(){
	$('body').on('touchstart',function(){
		del_ad();
	});
})