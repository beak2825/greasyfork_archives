// ==UserScript==
// @name		Rawdevart自动获取漫画图源
// @description	Autoly download all manga pictures when you open a page of every chapter on rawdevart.com.
// @version		1.0α
// @author		Tinyblack
// @namespace	http://tampermonkey.net/
// @namespace	http://greasyfork.org/
// @include		*://rawdevart.com/*
// @require		https://code.jquery.com/jquery-3.5.1.min.js
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/404432/Rawdevart%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E6%BC%AB%E7%94%BB%E5%9B%BE%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/404432/Rawdevart%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E6%BC%AB%E7%94%BB%E5%9B%BE%E6%BA%90.meta.js
// ==/UserScript==

(function () {
	//Get the website's link
	var web = window.location.href;
	function importjquery() {
		var ele = document.createElement("script");
		ele.setAttribute("type", "text/javascript");
		ele.setAttribute("src", "https://code.jquery.com/jquery-3.5.1.min.js");
		document.head.appendChild(ele);
	}
	//Special Thanks to 岁末Zzz's download code , remade by Tinyblack
	//Origin page link : https://blog.csdn.net/weixin_43953710/article/details/90288971
	function download(url ,filename){
		var x=new XMLHttpRequest();
		x.open("GET", url , true);
		x.responseType = 'blob';
		x.onload=function(e){
			var url = window.URL.createObjectURL(x.response);
			var a = document.createElement('a');
			a.href = url;
			a.download = filename;
			a.click();
		};
		x.send();
	}
	if(web.match("chapter") !== null)
	{
		window.alert("Find a manga chapter page, Auto download will run soonly.");
		//import jquery
		importjquery();
		//Get Origin Picture Link
		//test-link-origin : https://rawdevart.com/comic/mamahaha-no-tsurego-ga-moto-kanodatta/chapter-13-2/
		//test-link-picture : https://image.rawdevart.com/comic/mamahaha-no-tsurego-ga-moto-kanodatta/chapters/13-2/006.jpg
		var temp = web.match("rawdevart").index;
		var s1 = web.slice(0,temp);
		var s2 = web.slice(temp,web.length);
		var originlink = s1 + "image." +s2;
		temp = originlink.match("chapter(/d)*-(/d)*").index;
		originlink = originlink.slice(0,temp);
		temp = web.match("-[0-9]").index;
		originlink = originlink + "chapters/" + web.slice(temp+1,web.length);
		//Get Number of Pictures
		var picturenum = $('.mb-3').length - 1;
		//Download urls
		for(var i = 1; i <= picturenum ; i++)
		{
			if(i <= 9 )
			{
				download(originlink + "00" + i + ".jpg", i + ".jpg");
			}
			if(i <= 99 && i >=10)
			{
				download(originlink + "0" + i + ".jpg", i + ".jpg");
			}
			else
			{
				download(originlink + i + ".jpg", i + ".jpg");
			}
		}
	}
	else
	{
		window.alert("This page is not a chapter page. Auto download will not run.");
	}
}());