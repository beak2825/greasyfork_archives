// ==UserScript==
// @name         百词斩刷词
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  方向左键开始，右键结束。
// @author       XiaoMing
// @match        http://www.baicizhan.com/words/slash
// @grant        none
// @require      http://code.jquery.com/jquery-1.10.1.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/18741/%E7%99%BE%E8%AF%8D%E6%96%A9%E5%88%B7%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/18741/%E7%99%BE%E8%AF%8D%E6%96%A9%E5%88%B7%E8%AF%8D.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
// Your code here...
(function (document)
{
	//自动按 图片
	function tupian()
	{
		var selElements = document.getElementsByTagName("div");
		var imgg = document.getElementsByTagName("img");
		for (var i = 0; i < selElements.length; i++)
		{
			if (selElements[i].className == "word-img")
			{
				for (var i2 = 0; i2 < imgg.length; i2++)
				{
					if (imgg[i2].src == selElements[i].getElementsByTagName("img")[0].src)
					{
						imgg[i2].click();
						return;
					}
				}
			}
		}
	}
	//自动按 文字
	function wenzi()
	{
		var selElements = document.getElementsByTagName("span");
		for (var i1 = 0; i1 < selElements.length; i1++)
		{
			if (selElements[i1].style.cssText == "font-size: 15px; color: rgb(144, 144, 144); float: none;")
			{
				var s = selElements[i1].innerHTML;
				s = s.replace("&nbsp;", "");
				s = s.replace("&nbsp;", "");
				s = s.replace("&nbsp;", "");
				for (var i2 = 0; i2 < selElements.length; i2++)
				{
					if (selElements[i2].style.cssText == "font-size: 17px; color: rgb(144, 144, 144);")
					{
						if (selElements[i2].innerHTML == s)
						{
							selElements[i2].click();
							return;
						}
					}
				}
			}
		}
	}
	//自动按 给点儿提示
	function anniu()
	{
		var selElements = document.getElementsByTagName("a");
		for (var i = 0; i < selElements.length; i++)
		{
			if (selElements[i].className == "btn-space" && selElements[i].innerHTML == "继续做题<span>(鼠标右键)</span>")
			{
				selElements[i].click();
				return;
			}
		}
	}
	function hotkey()
	{
		var a = window.event.keyCode;
		if (a == 37) //&&(event.ctrlKey))
		{
			//tupian();
			time = setInterval(function ()
				{
					/*if (tmptitle == Gettitle()) {}
					else {*/
					//	tmptitle = Gettitle();
					jiance();
				}, 1000);
		}
		if (a == 39) //&&(event.ctrlKey))
		{
			//wenzi();
			clearInterval(time);
		}
	} // end hotkey
	function jiance()
	{
		var Xbut = document.getElementsByTagName("div");
		zd = 0;
		for (var i = 0; i < Xbut.length; i++)
		{
			if (Xbut[i].className == "word-right-block" && Xbut[i].style.cssText == 'display: block;')
			{
				zd = 1;
			}
		}
		if (zd == 1)
		{
			xbut2++;
			if (xbut2 > 2)
			{
				xbut2 = 0;
				anniu();
			}
		}
		else
		{
			xbut2 = 0;
			var xtm = document.getElementsByTagName("div");
			for (var i2 = 0; i2 < xtm.length; i2++)
			{
				if (xtm[i2].className == "word-top-block")
				{
					var xtm2 = xtm[i2].getElementsByTagName("ul");
					if (xtm2[0].className == 'answer-list img-style')
					{
						tupian();
					}
					if (xtm2[0].className == 'answer-list')
					{
						wenzi();
					}
				}
			}
		}
	}
	var xbut2 = 0,
	zd = 0;
	var tmptitle,
	time;
	document.onkeydown = hotkey; //当onkeydown 事件发生时调用hotkey函数
}
)(document);
