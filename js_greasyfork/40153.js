//
// ==UserScript==
// @name 			DMMID助手
// @namespace		http://www.dmm.co.jp
// @author			cnbeta1
// @developer		cnbeta1
// @description     zh-cn
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @include 		http://www.dmm.co.jp/*
// @run-at			document-end
// @version 		0.0.1
// @downloadURL https://update.greasyfork.org/scripts/40153/DMMID%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/40153/DMMID%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//=======START=======
//chrome 浏览器沙箱引用 参数定义
var scripts = [ '//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js' ];
var numScripts = scripts.length, loadedScripts = 0;
// 沙箱样式表
// GM_addStyle('CSS styles goes here');

// 沙箱引用 后调用 main方法。
var i, protocol = document.location.protocol;
for (i = 0; i < numScripts; i++) {
	var script = document.createElement("script");
	script.setAttribute("src", protocol + scripts[i]);
	script.addEventListener('load', function() {
		loadedScripts += 1;
		if (loadedScripts < numScripts) {
			return;
		}
		var script = document.createElement("script");
		script.textContent = "(" + main.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
	console.log(script);
}

// main方法
function main() {
	jQuery.noConflict();
	// if window.$ has been used by other libs
	var location = window.location;
	var path = location.pathname;
    var search = location.search;
    var cidobj = jQuery("td.nw:contains(品番)").next();
    var cid = cidobj.text();
    var nyaalink = "https://sukebei.nyaa.si/?f=0&c=0_0&q="+cid;
    cidobj.html("<a></a>");
    cidobj.children("a").text(cid);
    cidobj.children("a").attr("href",nyaalink);
    //alert("done");

}