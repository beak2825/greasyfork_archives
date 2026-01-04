// ==UserScript==
// @name         vod观看链接破解
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://vod50.com/videos/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31348/vod%E8%A7%82%E7%9C%8B%E9%93%BE%E6%8E%A5%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/31348/vod%E8%A7%82%E7%9C%8B%E9%93%BE%E6%8E%A5%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取vkey
    var patt=/vkey=/;
    var HTML=document.documentElement.outerHTML;
    var vkey=HTML.match(/vkey=[a-zA-Z0-9-_ ]+/);
    var link='http://vod50.com/api/player/getplayurl?'+vkey;
    // alert('new link='+link);
    
    // 获取下载信息
    var xmlhttp;
	xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
            var text=xmlhttp.responseText;
            //alert(text);
            window.location.href=text;
		}
	};
	xmlhttp.open("GET",link,true);
	xmlhttp.send();
    //
})();