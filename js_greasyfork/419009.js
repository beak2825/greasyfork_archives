// ==UserScript==
// @name         广外教务系统兼容性助手
// @namespace    https://yanhuihang.github.io/jw/
// @version      0.0.1
// @description  在教务系统查成绩的时候，点击相应分数会得到平时成绩、期中成绩、期末成绩等细分，但是这个功能不支持非IE的浏览器。这个脚本将提供一个可以在使用谷歌、WebKit等非IE内核浏览器上查看细分的解决方案。
// @author       yanhuihang
// @match        *://jxgl.gdufs.edu.cn/jsxsd/kscj/cjcx_list
// @downloadURL https://update.greasyfork.org/scripts/419009/%E5%B9%BF%E5%A4%96%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%85%BC%E5%AE%B9%E6%80%A7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/419009/%E5%B9%BF%E5%A4%96%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%85%BC%E5%AE%B9%E6%80%A7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var has_showModalDialog = !!window.showModalDialog;

if(!has_showModalDialog && !!(window.opener))
{
	window.οnbefοreunlοad = function ()
	{
		window.opener.hasOpenWindow = false;
	}
}

if (window.showModalDialog == undefined)
{
	window.showModalDialog = function (url, mixedVar, features)
	{
		if (window.hasOpenWindow)
		{
			alert("您已经打开了一个窗口！请先处理它"); // 避免多次点击会弹出多个窗口
			window.myNewWindow.focus();
		}
		
		window.hasOpenWindow = true;
		if (mixedVar) var mixedVar = mixedVar;
		
		// 因 window.showmodaldialog 与 window.open 参数不一样，所以封装的时候用正则去格式化一下参数
		if (features) var features = features.replace(/(dialog)|(px)/ig,"").replace(/;/g,',').replace(/\:/g,"=");
		// window.open("Sample.htm",null,"height=200,width=400,status=yes,toolbar=no,menubar=no");
		// window.showModalDialog("modal.htm",obj,"dialogWidth=200px;dialogHeight=100px");
		var left = (window.screen.width - parseInt(features.match(/width[\s]*=[\s]*([\d]+)/i)[1]))/2;
		var top = (window.screen.height - parseInt(features.match(/height[\s]*=[\s]*([\d]+)/i)[1]))/2;
		window.myNewWindow = window.open(url, "_blank", features);
	}
}