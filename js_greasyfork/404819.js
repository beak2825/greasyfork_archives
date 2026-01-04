// ==UserScript==
// @name		Hanascan自动获取漫画图源
// @description	Autoly download all manga pictures when you open a page of every chapter on hanascan.com.
// @version		1.0α
// @author		Tinyblack
// @namespace	http://tampermonkey.net/
// @namespace	http://greasyfork.org/
// @include		*://hanascan.com/*
// @require		https://code.jquery.com/jquery-3.5.1.min.js
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/404819/Hanascan%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E6%BC%AB%E7%94%BB%E5%9B%BE%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/404819/Hanascan%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E6%BC%AB%E7%94%BB%E5%9B%BE%E6%BA%90.meta.js
// ==/UserScript==
(function(){
	//Get page url
	var web = window.location.href;
	//import Jquery
	function importjquery() {
		var ele = document.createElement("script");
		ele.setAttribute("type", "text/javascript");
		ele.setAttribute("src", "https://code.jquery.com/jquery-3.5.1.min.js");
		document.head.appendChild(ele);
	}
	importjquery();
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
	//if this page is a manga chapter page
	if(web.match("hanascan.com/read") !== null)
	{
		console.log("is hanascan/read");
		if(web.match("chapter") !== null)
		{
			console.log("is chapter")
			//Start download
			window.alert("Auto Download will run soonly.");
			var pic = 1;
			$("div.chapter-content").find('img').each(function(){
				console.log("Picture " + pic + '.jpg is downloading url:' + $(this).attr('src'));
				download($(this).attr('src') , pic + '.jpg');
				pic++;
			});
		}
	}
    else{
        console.log("not a hanascan chapter page");
    }
})();