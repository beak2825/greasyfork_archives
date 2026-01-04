// ==UserScript==
// @name         download_by_atag
// @namespace    http://tampermonkey.net/
// @version      2023.11.25
// @description  当GM_download不起作用时用这个
// @author       You
// @grant        none
// ==/UserScript==
function SetDownload(src,name){
	GM_setValue('name',name)
	GM_setValue('src',src)
	window.open(src)
}
function ListeningDownload(){
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

window.DBA = {
	SetDownload : SetDownload,
	ListeningDownload : ListeningDownload,
}