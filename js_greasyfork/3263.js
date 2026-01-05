// ==UserScript==
// @name	山东大学校园卡系统登录密码键盘显示脚本
// @namespace	https://github.com/liuycsd/shell-scripts/tree/master/user.js
// @description	山东大学校园卡系统登录密码键盘显示修正
// @include	http://ecard.sdu.edu.cn/homeLogin.action
// @version     0.2.1
// @grant	none
// @downloadURL https://update.greasyfork.org/scripts/3263/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E5%8D%A1%E7%B3%BB%E7%BB%9F%E7%99%BB%E5%BD%95%E5%AF%86%E7%A0%81%E9%94%AE%E7%9B%98%E6%98%BE%E7%A4%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/3263/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E5%8D%A1%E7%B3%BB%E7%BB%9F%E7%99%BB%E5%BD%95%E5%AF%86%E7%A0%81%E9%94%AE%E7%9B%98%E6%98%BE%E7%A4%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
document.getElementById("layermap").style.visibility="visible";
var allpswd, thispswd;
allpswd = document.evaluate("//input[@name='passwd']",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
//for (var i = 0; i < allpswd.snapshotLength; i++)
//{
	i=0;
	thispswd = allpswd.snapshotItem(i);
	thispswd.id = "passwd";
	thispswd.removeAttribute("readonly"); //Don't input the raw password into the box!
//}
