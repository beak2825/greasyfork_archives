// ==UserScript==
// @namespace   BlueFire
// @version     1.06
// @grant       unsafeWindow
// @include     http://www.bilibili.com/video/*
// @include     http://www.bilibili.com/mobile/video/*
// @include     http://bangumi.bilibili.com/*
// @include     http://live.bilibili.com/*
// @include     http://music.163.com/*
// @include     http://*.ithome.com/*
// @include     http://*.lapin365.com/*
// @run-at      document-start
// @name        BilibiliToUWP
// @name:zh-CN  Bilibili调起UWP客户端
// @description Open BilibiliUWP from Web
// @description:zh-CN 从Bilibili网页调起UWP客户端
// @downloadURL https://update.greasyfork.org/scripts/29024/BilibiliToUWP.user.js
// @updateURL https://update.greasyfork.org/scripts/29024/BilibiliToUWP.meta.js
// ==/UserScript==

unsafeWindow.Object.freeze = null;
var IsOpenURIWhenPageLoadedEnable = false;
document.addEventListener('DOMContentLoaded',OnPageLoaded , true);
//document.onload = OnPageLoaded;
function OnPageLoaded (event) {
  try {
    window.oneerror=function(){return true;};
    var url = window.location.href;
    var loc;
    var URI="";
    var element,element2,para,childpara,node;
    if(url.indexOf("bilibili.") != -1 && (url.indexOf("index") != -1 || url.indexOf("html") == -1))
    {
        if(url.indexOf("bangumi") != -1)
        {
            window.addEventListener('load',OnWindowLoaded,true);
        }
		else if(url.indexOf("video") != -1)
		{
			loc = url.match("av[0-9]*")[0].match("[0-9].*");
			URI = "bilibili://video/" + loc;
			element = document.getElementsByClassName("tminfo")[0];
			para = document.createElement("a");
			para.innerText = "用客户端打开";
			para.setAttribute("class","charge-appeal-init");
			para.href = URI;
            element.appendChild(para);

            element2 = document.getElementsByClassName("qr-bottom")[0];
			element2.childNodes[1].removeAttribute("target");
			element2.childNodes[1].href=URI;
		}
		else if(url.indexOf("live") != -1)
		{
			loc = url.match("[0-9].*")[0];
			URI = "bilibili://live/" + loc;
			element = document.getElementsByClassName("room-title-row")[0];
			element2 = document.getElementsByClassName("report-link dp-none")[0];
			para = document.createElement("a");
			para.innerText = "用客户端打开";
			para.setAttribute("class","share-link");
			para.href=URI;
            try
            {
                element.appendChild(element2);
                element2.appendChild(para);
            }catch(error){}
		}

    }
    if(url.indexOf("music.163.") != -1)
    {
		var IsEnable = false;
		if(url.indexOf("playlist") != -1)   //判断歌单
		{
			if(url.indexOf("playlist?id=") != -1)
			{
				IsEnable = true;
				loc = url.match("id=[0-9]*")[0].match("[1-9].*")[0];
			}
			if(url.indexOf("/playlist/") != -1)
			{
				IsEnable = true;
				loc = url.match("/playlist/[1-9]*")[0].match("[1-9].*")[0];
			}
			URI = "orpheus://playlist/" + loc;
		}
        if(url.indexOf("song") != -1)      //判断歌曲
        {
			IsEnable = true;
            if(url.indexOf("song?id=") != -1)
            {
                loc = url.match("id=[0-9]*")[0].match("[1-9].*")[0];
            }
            if(url.indexOf("/song/") != -1)
            {
                loc = url.match("/song/[1-9]*")[0].match("[1-9].*")[0];
            }
            URI = "orpheus://song/" + loc;
        }
        if(url.indexOf("album") != -1)     //判断专辑
        {
			IsEnable = true;
            if(url.indexOf("album?id=") != -1)
            {
                loc = url.match("id=[0-9]*")[0].match("[1-9].*")[0];
            }
            if(url.indexOf("/album/") != -1)
            {
                loc = url.match("/album/[1-9]*")[0].match("[1-9].*")[0];
            }
            URI = "orpheus://album/" + loc;
        }
        if(url.indexOf("program?id=") != -1)   //判断电台节目
        {
			IsEnable = true;
            if(url.indexOf("program?id=") != -1)
            {
                loc = url.match("id=[0-9]*")[0].match("[1-9].*")[0];
            }
            if(url.indexOf("/program/") != -1)
            {
                loc = url.match("/program/[1-9]*")[0].match("[1-9].*")[0];
            }
            URI = "orpheus://program/" + loc;
        }
        if(url.indexOf("artist?id=") != -1)    //判断歌手
        {
			IsEnable = true;
            if(url.indexOf("artist?id=") != -1)
            {
                loc = url.match("id=[0-9]*")[0].match("[1-9].*")[0];
            }
            if(url.indexOf("/artist/") != -1)
            {
                loc = url.match("/artist/[1-9]*")[0].match("[1-9].*")[0];
            }
            URI = "orpheus://artist/" + loc;
        }
        if(url.indexOf("djradio?id=") != -1)   //判断电台主播
        {
			IsEnable = true;
            if(url.indexOf("djradio?id=") != -1)
            {
                loc = url.match("id=[0-9]*")[0].match("[1-9].*")[0];
            }
            if(url.indexOf("/djradio/") != -1)
            {
                loc = url.match("/djradio/[1-9]*")[0].match("[1-9].*")[0];
            }
            URI = "orpheus://djradio/" + loc;
        }
		if(IsEnable)
		{
			document.documentElement.focus();
			para = document.createElement("a");
			childpara = document.createElement("i");
			node=document.createTextNode("用客户端打开");
			childpara.appendChild(node);
			para.setAttribute("class","u-btni u-btni-dl");
			para.href=URI;
			para.style.marginTop="7px";
			para.appendChild(childpara);
			element=document.getElementById("content-operation");
			element2 = document.getElementsByClassName("btns f-cb j-flag")[0];
			try {element.appendChild(para);}catch(error){}
			try {element2.appendChild(para);}catch(error){}
		}

	}
    if(url.indexOf("ithome.com") != -1)
    {
        if(url.indexOf("quan") == -1)
        {
            loc = url.match("/[0-9]+")[0].match("[0-9]+")[0];
            URI = "ithome://ithome.com/?newsid=" + loc;
        }
        else
        {
            loc = url.match("[0-9]{3}/[0-9]{3}")[0].replace("/","");
            URI = "ithome://ithome.com/?postid=" + loc;
        }
        para = document.createElement("li");
        childpara = document.createElement("a");
        childpara.setAttribute("class","nav-item nav-item-7");
        childpara.href = URI;
        node = document.createTextNode("使用客户端打开");
        childpara.appendChild(node);
        para.appendChild(childpara);
        element = document.getElementsByClassName("nav_list")[0];
        try {element.appendChild(para);} catch (error) {}
    }
    if(URI !== "" && URI !== null && URI !== undefined && IsOpenURIWhenPageLoadedEnable)
    {
		alert(URI);
        window.location.href = URI;
    }

  }
    catch (error)
    {
        //alert(error);
    }
}

function OnWindowLoaded(event)
{
    try 
    {
        window.oneerror=function(){return true;};
        var url = window.location.href;
        var loc;
        var URI="";
        if(url.indexOf("bilibili.") != -1 && (url.indexOf("index") != -1 || url.indexOf("html") == -1))
        {
            if(url.indexOf("bangumi") != -1)
            {
                var ele= document.getElementsByClassName("v-av-link")[0];
                loc = ele.href.match("[0-9]+")[0];
                URI = "bilibili://video/" + loc;
                ele.setAttribute("target","");
                ele.href = URI;
                ele.innerText = "使用客户端打开 AV" + loc;
            }
        }
    }
    catch(error){}
}
