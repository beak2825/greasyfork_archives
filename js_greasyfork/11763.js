// ==UserScript==
// @name        豆瓣增强
// @description 豆瓣主题增加楼层编号,每个回复的访问网址,网页打开时间
// @match     http://www.douban.com/group/topic/*
// @namespace   848a4f48fe0470f4cf8fd1941365bd4b
// @version     2013.9.8.2
// @downloadURL https://update.greasyfork.org/scripts/11763/%E8%B1%86%E7%93%A3%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/11763/%E8%B1%86%E7%93%A3%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

// 2013.09.08 初版修改版
var all_elem = document.getElementsByTagName("div");//返回一个元素数组
var elemcount = 1; //楼层编号
if ( getQueryString('start') ) {
	elemcount = elemcount +  Number(getQueryString('start'));
}
	for(var i=0; i<all_elem.length; i++) { // 因为all_elem是一个数组,索引从0开始,所以遍历次数要比元素总数小1
	if(all_elem[i].className == "bg-img-green") {
		all_elem[i].getElementsByTagName("h4")[0].innerHTML = elemcount + ". " + all_elem[i].getElementsByTagName("h4")[0].innerHTML;
		elemcount += 1;
	}
}

// 给每个页面显示打开页面时间
if (document.getElementById("icp")) {
	document.getElementById("icp").innerHTML += "" + new Date()
}


// 给每个帖子生成网址
pageurl=location.href.split("#")[0];
all_elem = document.getElementsByTagName("div");
for(var i=0; i<all_elem.length; i++) { // 因为all_elem是一个数组,索引从0开始,所以遍历次数要比元素总数小1
	if(all_elem[i].className == "comment-report") {
		tieid=all_elem[i].parentNode.parentNode.parentNode.id
		all_elem[i].innerHTML += " <a href='" + pageurl + "#" + tieid + "'>网址</a>";
	}
}

function getQueryString(name) {
var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
var r = window.location.search.substr(1).match(reg);
if (r != null) return unescape(r[2]); return null;
}
