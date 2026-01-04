// ==UserScript==
// @name         为没有“显示密码（小眼睛标志）”的网站添加显示密码的功能
// @namespace    none
// @version      1.03
// @description  为没有“显示密码（小眼睛标志）”的网站添加显示密码的功能;按住【Ctrl】显示密码,松手立即恢复.
// @author       DuckBurnIncense
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/435034/%E4%B8%BA%E6%B2%A1%E6%9C%89%E2%80%9C%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81%EF%BC%88%E5%B0%8F%E7%9C%BC%E7%9D%9B%E6%A0%87%E5%BF%97%EF%BC%89%E2%80%9D%E7%9A%84%E7%BD%91%E7%AB%99%E6%B7%BB%E5%8A%A0%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81%E7%9A%84%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/435034/%E4%B8%BA%E6%B2%A1%E6%9C%89%E2%80%9C%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81%EF%BC%88%E5%B0%8F%E7%9C%BC%E7%9D%9B%E6%A0%87%E5%BF%97%EF%BC%89%E2%80%9D%E7%9A%84%E7%BD%91%E7%AB%99%E6%B7%BB%E5%8A%A0%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81%E7%9A%84%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

var id;
var pwd = document.querySelector("input[type='password']");
if (pwd!=null)
{
	pwd.setAttribute("dbiid","dbiid");
	id = pwd.dbiid;
	
	$(document).keydown
	(
		function(event)
		{
			if(event.keyCode == 17)
			{
				pwd.type="text";
			}
		}
	);
	$(document).keyup
	(
		function(event)
		{
			if(event.keyCode == 17)
			{
				pwd.type="password";
			}
		}
	);
}

