// ==UserScript==
// @name         东北师范大学研究生教务系统网站问题修复插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修复东北师范大学研究生教务系统“不能创建对象！”等问题
// @author       Ran-a
// @match        http://dsjx.nenu.edu.cn/*
// @match        https://gs.nenu.edu.cn/*
// @match        http://dsyjs.nenu.edu.cn/*
// @match        https://www.ccopyright.com.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490149/%E4%B8%9C%E5%8C%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%BD%91%E7%AB%99%E9%97%AE%E9%A2%98%E4%BF%AE%E5%A4%8D%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/490149/%E4%B8%9C%E5%8C%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%BD%91%E7%AB%99%E9%97%AE%E9%A2%98%E4%BF%AE%E5%A4%8D%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function() {
     'use strict';
    function send_request_replace(url, SystemBh){
        var http_request = new XMLHttpRequest();
        try
	    {
		http_request.open("POST",url, false);

		http_request.setRequestHeader("CONTENT-TYPE","application/x-www-form-urlencoded");

		http_request.send(null);

		var tmpxml = http_request.responseXML;
        console.log(tmpxml);
		//加载顶层菜单开始
		var topXml = tmpxml.getElementsByTagName("topMenus")[0].getElementsByTagName("Menu");
        console.log(topXml);
		for(let i=0;i<topXml.length;i++)
		{
			topMenuItems[topMenuLength] = new Array();
			topMenuItems[topMenuLength][0] = topXml[i].attributes.getNamedItem("parentid").textContent;
			topMenuItems[topMenuLength][1] = SystemBh + "_" + topXml[i].attributes.getNamedItem("id").textContent;
			topMenuItems[topMenuLength][2] = topXml[i].attributes.getNamedItem("name").textContent;
			topMenuItems[topMenuLength][3] = topXml[i].attributes.getNamedItem("title").textContent;
			topMenuItems[topMenuLength][4] = topXml[i].attributes.getNamedItem("path").textContent;
			topMenuItems[topMenuLength][5] = topXml[i].attributes.getNamedItem("imageUrl").textContent;
            console.log(topMenuItems[topMenuLength][0]);
            console.log(topMenuItems[topMenuLength][1]);
            console.log(topMenuItems[topMenuLength][2]);
            console.log(topMenuItems[topMenuLength][3]);
            console.log(topMenuItems[topMenuLength][4]);

			topMenuItems[topMenuLength][6] = topXml[i].attributes.getNamedItem("defaultPage").textContent;
            console.log(topMenuItems[topMenuLength][6]);
			topMenuLength++;
		}
		//加载顶层菜单结束

		//加载一层菜单开始
		var menuXml = tmpxml.getElementsByTagName("Level1Menus")[0].getElementsByTagName("Menu");
        console.log(menuXml);
		for(let i=0;i<menuXml.length;i++)
		{
			menuItems[menuLength] = new Array();
			menuItems[menuLength][0] = SystemBh + "_" + menuXml[i].attributes.getNamedItem("parentid").textContent;
			menuItems[menuLength][1] = SystemBh + "_" + menuXml[i].attributes.getNamedItem("id").textContent;
			menuItems[menuLength][2] = '&nbsp;'+menuXml[i].attributes.getNamedItem("name").textContent;
			menuItems[menuLength][3] = menuXml[i].attributes.getNamedItem("title").textContent;
			menuItems[menuLength][4] = menuXml[i].attributes.getNamedItem("path").textContent;
			menuItems[menuLength][5] = menuXml[i].attributes.getNamedItem("imageUrl").textContent;
			menuLength++;
		}

		//加载一层菜单结束

		//加载二层菜单开始
		var linkXml = tmpxml.getElementsByTagName("Level2Menus")[0].getElementsByTagName("Menu");
		for(let i=0;i<linkXml.length;i++)
		{
			linkItems[linkLength] = new Array();
			linkItems[linkLength][0] = SystemBh + "_" + linkXml[i].attributes.getNamedItem("parentid").textContent;
			linkItems[linkLength][1] = SystemBh + "_" + linkXml[i].attributes.getNamedItem("id").textContent;
			linkItems[linkLength][2] = '&nbsp;&nbsp;'+linkXml[i].attributes.getNamedItem("name").textContent;
			linkItems[linkLength][3] = linkXml[i].attributes.getNamedItem("title").textContent;
			linkItems[linkLength][4] = linkXml[i].attributes.getNamedItem("path").textContent;
			linkItems[linkLength][5] = linkXml[i].attributes.getNamedItem("imageUrl").textContent;
			linkLength++;
		}

		//加载二层菜单结束
	}
	catch(e)
	{
        console.log(e);
        alert("加载编号为"+SystemBh+"的应用系统失败，可能是网络延迟问题！");
    }
    }
    window.send_request = send_request_replace;
    function doCancelTableSet_replace(url, SystemBh){
        if (document.getElementById('TblShowSetDiv') != null)
	{
		document.getElementById('TblShowSetDiv').parentNode.removeChild(document.getElementById('TblShowSetDiv'));
        console.log(document.getElementById('TblShowSetDiv'));
	}
	document.getElementById('alldiv').disabled = false;
    }
    window.doCanCelTableSet = doCancelTableSet_replace;
    function JsMod_replace(htmlurl, tmpWidth, tmpHeight) {
        htmlurl = getRandomUrl(htmlurl);
        var newwin = window.open(htmlurl, window, "width=" + tmpWidth + "px; status=no;height=" + tmpHeight + "px");
        if (newwin != null && newwin == "ok") {
            window.location.href = window.location.href;
        }
    }
    window.JsMod = JsMod_replace;
    function scrollDiv_replace(Dir) {
       Timer = setTimeOut('scrollDiv("' +Dir+ '")',2000);
    }
    window.scrollDiv = scrollDiv_replace;
   // let img_div = document.getElementById('TableSetDiv').children[0].src = "http://dsyjs.nenu.edu.cn/framework/images/more.gif";
})();


