// ==UserScript==
// @name         淘宝圈子电脑版
// @namespace    http://tampermonkey.net/
// @version      20170429
// @description  用于显示手机版淘宝论坛里圈子
// @author       sbdx
// @match        h5.m.taobao.com/bala/community.htm*
// @match        h5.m.taobao.com/ocean/topic.htm*
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/22580/%E6%B7%98%E5%AE%9D%E5%9C%88%E5%AD%90%E7%94%B5%E8%84%91%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/22580/%E6%B7%98%E5%AE%9D%E5%9C%88%E5%AD%90%E7%94%B5%E8%84%91%E7%89%88.meta.js
// ==/UserScript==
//列表页
//http://h5.m.taobao.com/bala/community.htm?communityId=84016
//内容页
//http://h5.m.taobao.com/ocean/topic.htm?topicId=4031903899
(function() {
	'use strict';
	if(location.href.search('community.htm')!== -1)
	{
		$('.card').live('mouseover mouseout click', function(event){
			if (event.type == 'mouseover')
			{
				$(this).css({background:'#f7f7f9',cursor:'pointer'});
			}
			else if (event.type == 'mouseout')
			{
				$(this).css({background:'',cursor:'auto'});
			}
			else
			{
				var url=$(this).attr('data-url');
				//location.href=url;
				unsafeWindow.open(url);
			}
		});
	}
	else if(location.href.search('topic.htm')!== -1)
	{
		console.log("设置图片宽度为默认");
		//设置图片宽度为默认
		setTimeout(function(){
			$("img").each(function(i){
				this.src=this.src.replace('_560x560q90.jpg','');
				$(this).css('width','auto');
			});
			//$($("img")).css('width','auto');
		},1000);
	}
})();