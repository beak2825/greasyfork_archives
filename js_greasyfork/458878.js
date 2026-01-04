// ==UserScript==
// @name         快速跳转bangumi排行榜最后一页
// @namespace    https://github.com/bangumi/scripts/tree/master/liaune
// @version      0.3
// @description  分别以雷锋的故事(subject/6476),我的英雄学院(subject/122003),White Wings 白色之翼(subject/310476),英雄 命运之诗(subject/217123),特利迦奥特曼 新世代迪迦(subject/333282)为锚点定位排行榜最后一页
// @author       Liaune
// @license      MIT
// @include     /^https?://(bgm\.tv|chii\.in|bangumi\.tv)/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458878/%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%ACbangumi%E6%8E%92%E8%A1%8C%E6%A6%9C%E6%9C%80%E5%90%8E%E4%B8%80%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/458878/%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%ACbangumi%E6%8E%92%E8%A1%8C%E6%A6%9C%E6%9C%80%E5%90%8E%E4%B8%80%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
	if(location.href.match(/(anime|book|game|music|real)\/browser(\/platform\/all\?|\?)sort=rank/)){
		const ids = {"anime":"6476","book":"122003","game":"310476","music":"217123","real":"333282"};
		var type = location.href.match(/(anime|book|game|music|real)\/browser.*\?sort=rank/)[1];
		$.get(`https://api.bgm.tv/subject/${ids[type]}`,(data)=>{
			var max_page = Math.ceil(data.rank/24);
			var lastpage = location.origin+location.href.match(/\/(anime|book|game|music|real)\/browser.*\?sort=rank/)[0]+'&page='+max_page;
			$('#columnSubjectBrowserA .section .page_inner a.p').last()[0].href = lastpage;
			var current_page = location.href.match(/sort=rank&page=(\d+)/)?location.href.match(/sort=rank&page=(\d+)/)[1]:1;
			$('#columnSubjectBrowserA .section .page_inner .p_edge')[0].textContent = `( ${current_page} / ${max_page} )`;
			$('#columnSubjectBrowserA .section .page_inner a.p').each( (i,e) => {
				if(parseInt(e.text)>max_page) $(e).hide();
			});
		},"json");
	}
})();