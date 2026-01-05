// ==UserScript==
// @name        B站番剧页面优化
// @namespace   no1xsyzy
// @description 使得番剧页面最新更新栏的所有链接都在同一个新标签页打开，使用target属性。
// @include     http://www.bilibili.com/video/bangumi.html
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19494/B%E7%AB%99%E7%95%AA%E5%89%A7%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/19494/B%E7%AB%99%E7%95%AA%E5%89%A7%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

var t=0;

function postgot()
{
	x = $('div.bgmbox a');
	for (i = 0; i < x.length; i++)
	{
		x[i].target = 'bangumipage';
	}
	GM_deleteValue("BBPE_looptime");
}

function loopget()
{
	x = $('div.bgmbox>div.b-toggle-block');
	if (x.length > 0)
		postgot();
	else if (t<1000)
		setTimeout(loopget,100);
	t++;
}

if($('div.bgmbox').length==1)loopget();
