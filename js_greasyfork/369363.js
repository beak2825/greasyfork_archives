// ==UserScript==
// @name         京东试用
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include       *//*.jd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369363/%E4%BA%AC%E4%B8%9C%E8%AF%95%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/369363/%E4%BA%AC%E4%B8%9C%E8%AF%95%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //试用地址：https://sale.jd.com/act/Oxp4vLQCaDl.html
var count = 0;
//获取我要试用按钮数组
if(location.hostname == "sale.jd.com")
{
	var shiList = $(".goods-price-info>.goods-btn");
	if(shiList.length > 0)
	{
		console.log("准备打开链接");
		for(var i = 0; i < shiList.length; i++)
		{
			shiList[i].click();
		}
	}
	console.log("链接已经全部打开");
}

//try.jd.com，判断是否在这个页面
if(location.hostname == "try.jd.com")
{
	console.log("进入了试用页面");

	setInterval(function()
	{
		//申请试用按钮
		if($(".btn-wrap>.app-btn.btn-application").length != 0)
		{
			console.log("准备申请试用");
			$(".btn-wrap>.app-btn.btn-application").click();
		}

		//判断是否申请成功，不等于0说明可以关闭了。
		if($(".ui-dialog-content").length == 1)
		{
			alert("试用申请成功，准备关闭网页");
			window.close();
		}
		if ( count >= 10 )
		{
			window.location.reload();
		}
	}, 5000);
}
})();