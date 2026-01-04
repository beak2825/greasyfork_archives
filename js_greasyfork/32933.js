// ==UserScript==
// @name   贴吧查水表
// @namespace   www.tjsky.net
// @include     http://tieba.baidu.com/p/*
// @include     http://tieba.baidu.com/f?ct*
// @include     https://tieba.baidu.com/p/*
// @include     https://tieba.baidu.com/f?ct*
// @version     1.5
// @run-at document-end
// @description 查看百度贴吧某用户名在全网的发言
// @downloadURL https://update.greasyfork.org/scripts/32933/%E8%B4%B4%E5%90%A7%E6%9F%A5%E6%B0%B4%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/32933/%E8%B4%B4%E5%90%A7%E6%9F%A5%E6%B0%B4%E8%A1%A8.meta.js
// ==/UserScript==
var $ = unsafeWindow.$;

function getUserHistoryB(e){
	var userName = (JSON.parse(e.target.getAttribute('data'))).un;
	window.open("https://www.baidu.com/s?wd=\"" + encodeURIComponent(userName) + "\" site:tieba.baidu.com");
}
function getUserHistoryG(e){
	var userName = (JSON.parse(e.target.getAttribute('data'))).un;
	window.open("https://www.google.com/search?q=\"" + encodeURIComponent(userName) + "\" site:tieba.baidu.com&safe=off&hl=zh-CN&lr=lang_zh-CN");
}
function getUserHistoryM(e){
	var userName = (JSON.parse(e.target.getAttribute('data'))).un;
	window.open("https://www.bing.com/search?q=\"" + encodeURIComponent(userName) + "\" site:tieba.baidu.com&safe=off&hl=zh-CN&lr=lang_zh-CN");
}


(function addBtn(){
	$('.d_author .p_author').each(function(){
		var data = this.querySelector('.p_author_name').getAttribute('data-field');
		$(this).append('<li class="user_post_list" style="margin-top:4px"><a style="cursor: pointer;color:#FF6600;" data='+data+'>百度全网发言</a></li>')
		$(this).append('<li class="user_post_list" style="margin-top:4px"><a style="cursor: pointer;color:#FF6600;" data='+data+'>谷歌全网发言</a></li>')
        $(this).append('<li class="user_post_list" style="margin-top:4px"><a style="cursor: pointer;color:#FF6600;" data='+data+'>必应全网发言</a></li>')
		this.querySelectorAll('.user_post_list a')[0].addEventListener('click',getUserHistoryB)
		this.querySelectorAll('.user_post_list a')[1].addEventListener('click',getUserHistoryG)
        this.querySelectorAll('.user_post_list a')[2].addEventListener('click',getUserHistoryM)
	});
})();