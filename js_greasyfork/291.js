// ==UserScript==
// @name        查看发帖
// @namespace   firefox
// @include     http://tieba.baidu.com/p/*
// @include     http://tieba.baidu.com/f?ct*
// @include     https://tieba.baidu.com/p/*
// @include     https://tieba.baidu.com/f?ct*
// @version     1.4
// @run-at document-end
// @description 查看百度贴吧某用户在某贴吧或者全部贴吧的发言
// @downloadURL https://update.greasyfork.org/scripts/291/%E6%9F%A5%E7%9C%8B%E5%8F%91%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/291/%E6%9F%A5%E7%9C%8B%E5%8F%91%E5%B8%96.meta.js
// ==/UserScript==
var $ = unsafeWindow.$;

function getUserHistory(e){
	var userName = (JSON.parse(e.target.getAttribute('data'))).un;
	var barName = "";
	if("全贴吧发言记录"!=e.target.textContent){
		barName = prompt('输入贴吧名',$("#wd1").attr("value"));
	}
	if(barName==null)barName="";
	window.open("http://tieba.baidu.com/f/search/ures?ie=utf-8&kw=" + encodeURIComponent(barName) + "&qw=&rn=100&un=" + encodeURIComponent(userName) + "&sm=1", "_blank");
}
(function addBtn(){
	$('.d_author .p_author').each(function(){
		var data = this.querySelector('.p_author_name').getAttribute('data-field');
		$(this).append('<li class="user_post_li" style="margin-top:4px"><a style="cursor: pointer;color:#FF6600;" data='+data+'>全贴吧发言记录</a></li>')
		$(this).append('<li class="user_post_li" style="margin-top:4px"><a style="cursor: pointer;color:#FF6600;" data='+data+'>某贴吧发言记录</a></li>')
		this.querySelectorAll('.user_post_li a')[0].addEventListener('click',getUserHistory)
		this.querySelectorAll('.user_post_li a')[1].addEventListener('click',getUserHistory)
	});
})();
