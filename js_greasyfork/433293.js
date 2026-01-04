// ==UserScript==
// @name         AUTO-SIGN-IN  一键打开需要签到的网页论坛等
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  打开某个网页后自动跳出所有需要签到的网页。
// @author       shinnyou
// @grant        none
// @include      http://teceshist.top/
// @include      https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/433293/AUTO-SIGN-IN%20%20%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%E9%9C%80%E8%A6%81%E7%AD%BE%E5%88%B0%E7%9A%84%E7%BD%91%E9%A1%B5%E8%AE%BA%E5%9D%9B%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/433293/AUTO-SIGN-IN%20%20%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%E9%9C%80%E8%A6%81%E7%AD%BE%E5%88%B0%E7%9A%84%E7%BD%91%E9%A1%B5%E8%AE%BA%E5%9D%9B%E7%AD%89.meta.js
// ==/UserScript==


/*
使用说明：
0、请把第9行代码删除（
1、可以进行替换的内容：①第8行的网址，即打开该网址后弹出“是否需要签到”弹框。
②第90行-93行，在该行段内，即if(a == true){    }大括号行段内，填入需要签到的网址，每行一个，不需要的话直接删除该行即可。例如：window.open('https://teceshist.top/')

2、在完成第一步的操作后，打开浏览器的设置页面，以谷歌浏览器为例：右上角-设置-隐私设置和安全性-网站设置-内容-弹出式窗口和重定向-允许发送弹出式窗口并使用重定向-添加，在输入框内输入上一步在第8行填入的网址。

3、打开第8行输入的网址，弹出“是否签到”弹框，点击“确定”打开需要签到的网页。

FAQ：
1、为什么没跳出来网页/没弹出来弹框？
请检查网址是否输入正确。

2、为什么不能直接一键全部签到？
懒得写，包括这个脚本，稍有基础便可以看出来是非常低技术力的，写的很烂可以说是了。看情况可能会进行后续更新。

instructions:
0、PLEASE DELETE LINE 9
1. Contents that can be replaced: ① the web address in line 8, after opening the web address, the pop-up box "check in required" pops up.
② From line 90 to line 93, in this line segment： if (a = = true) {} brace line segment, fill in the web address to be checked in, one for each line. If not necessary, delete this line directly. For example: window. Open (' https://teceshist.top/ ')
2. After completing the first step, open the browser's settings page. Take Google browser as an example: top right corner - Settings - privacy settings and security - website settings - content - pop-up windows and redirection - allow sending pop-up windows and using redirection - add, and enter the website address filled in in line 8 in the previous step in the input box.
3. Open the web address entered in line 8, pop up the "check in" pop-up box, and click "OK" to open the web page to check in.
FAQ：
1、NO POP UP PAGE OR CONFIRM?
CHECK THE WEBSITE
2、WHY NOT SIGN IN DIRECTLY BY ON CLICK?
'CAUSE AUTHOR IS A LAZY DOG
*/


(function() {
    'use strict';

    function getCookie(name) {
	var cookiefound = false
	var start = 0
	var end = 0
	var cookiestring = document.cookie;
	var i = 0;
	while (i <= cookiestring.length)
	{
		start = i
		end = start + name.length
		if (cookiestring.substring(start, end) == name)
		{
			cookiefound = true;
			break;
		}
		i++;
	}
	if (cookiefound == true)
	{
		start = end + 1;
		end = cookiestring.indexOf(";", start);
		if (end < start)
		{
			end = cookiestring.length;
		}
		return cookiestring.substring(start, end);
	}
	return "";
}
function newcookie(id, value, guoqi)
{
	var expires = new Date()
	expires.setTime(expires.getTime() + 24 * 60 * 60 * 30 * 1000)
	var expiryDate = expires.toGMTString();
	document.cookie = id + "=" + value + ";expires=" + expiryDate
}
if (getCookie("Alerted") == "") {
	alert("弹出此框是因为您刚刚安装了脚本，请打开Tampermonkey的管理面板（浏览器右上角）找到'OneSign'脚本，然后点击'操作'栏下的编辑按钮，按照脚本内说明编辑后进行使用")
	newcookie("Alerted", "yes")
} else
{}

hajime()
function hajime(){
    var a = confirm('是否签到？')
    if(a == true){
        //在此填入网址，不需要的话直接删除。
        window.open('https://shinnyou.top/', '_self')
		window.open('http://teceshist.top/')
		window.open('http://teceshist.top/test/download.html')
    }
    else{}
}
})();