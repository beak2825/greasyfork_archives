// ==UserScript==
// @name        bi-girl
// @version     2024.2.9.2
// @author       You
// @description  修改下载逻辑
// @match     	https://bi-girl.net/
// @include     https://bi-girl.net/*
// @include     https://pbs.twimg.com/media/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @require https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @require https://update.greasyfork.org/scripts/486938/1325051/download_by_atag.js
// @namespace https://greasyfork.org/users/1210231
// @downloadURL https://update.greasyfork.org/scripts/484751/bi-girl.user.js
// @updateURL https://update.greasyfork.org/scripts/484751/bi-girl.meta.js
// ==/UserScript==


$(function(){
	changeatag()
})

function changeatag(){
	let getimg = function(){
		$('.full-image img[src]:not([ccc])')
			.attr('ccc','yes')
			.click(function(){
				window.DBA.SetDownload(this.src,document.title+'.jpg')
				// GM_download({
				// 	url:this.src,
				// 	name:document.title+'.jpg',
				// })
			})
	}
	
	let check = setInterval(getimg,100)
	window.DBA.ListeningDownload()
	//window.GAIL.add_css('.img_wrapper',{width:'100% !important'})
}