// ==UserScript==
// @name		 Qzone Cleaner
// @namespace	 http://tampermonkey.net/
// @version		 1.4
// @description	 屏蔽QQ空间广告等，屏蔽/只看一些用户的点赞，点赞并隐藏一些用户的动态，隐藏一些用户的评论。
// @author		 H-OH
// @match		 https://user.qzone.qq.com/*
// @grant		 GM_setValue
// @grant		 GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/408583/Qzone%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/408583/Qzone%20Cleaner.meta.js
// ==/UserScript==


(function() {
	'use strict';
	var only=false;
	var only2=false;
	function killname()
	{
		var use=GM_getValue("killname","")+"\n";
		var add="";
		var name=new Array();
		for (var c=0;c<use.length;c++)
		{
			if (use[c]=="\n")
			{name[name.length]=add;add="";}
			else
			{add+=use[c];}
		}
		var tokill=document.querySelectorAll(".user-list > a");
		for (var t=0;t<tokill.length;t++)
		{
			var flag=false;
			for (var s=0;s<name.length;s++)
			{
				if (tokill[t].innerText==name[s])
				{flag=true;break;}
			}
			if (flag^only)
			{
				tokill[t].style.display="none";
				if (tokill[t].nextSibling!=null)
				{tokill[t].nextSibling.data="";}
			}
			else
			{
				tokill[t].style.display="inline";
				if (tokill[t].nextSibling!=null)
				{tokill[t].nextSibling.data="、";}
			}
		}
	}
	function killname1()
	{
		var use=GM_getValue("killname1","")+"\n";
		var add="";
		var name=new Array();
		for (var c=0;c<use.length;c++)
		{
			if (use[c]=="\n")
			{name[name.length]=add;add="";}
			else
			{add+=use[c];}
		}
		var tokill=document.getElementsByClassName("f-single f-s-s");
		for (var t=0;t<tokill.length;t++)
		{
			var flag=false;
			for (var s=0;s<name.length;s++)
			{
				if (tokill[t].children[0].children[3]!=undefined&&tokill[t].children[0].children[3].children[0].children[0].innerText==name[s])
				{flag=true;break;}
			}
			if (flag)
			{
				if (tokill[t].children[2].children[0].children[0].children[4].className=="item qz_like_btn_v3 ")
				{tokill[t].children[2].children[0].children[0].children[4].children[0].click();}
				tokill[t].style.display="none";
			}
			else
			{tokill[t].style.display="block";}
		}
	}
	function killname2()
	{
		var use=GM_getValue("killname2","")+"\n";
		var add="";
		var name=new Array();
		for (var c=0;c<use.length;c++)
		{
			if (use[c]=="\n")
			{name[name.length]=add;add="";}
			else
			{add+=use[c];}
		}
		var tokill=document.getElementsByClassName("comments-item bor3");
		for (var t=0;t<tokill.length;t++)
		{
			var flag=false;
			var who=tokill[t]["dataset"]["nick"];
			for (var s=0;s<name.length;s++)
			{
				if (who==name[s])
				{flag=true;break;}
			}
			if (flag^only2)
			{
				if (tokill[t].style.display!="none")
				{
					var note=document.createElement("div");
					note.className="h"+who;
					note.innerHTML="<p style=\"zoom:120%\">已为您隐藏<b>"+who+"</b>的一条评论。</p>";
					tokill[t].parentNode.appendChild(note);
					tokill[t].style.display="none";
				}
			}
			else
			{
				if (tokill[t].style.display!="block")
				{
					var less=document.getElementsByClassName("h"+who);
					for (var r=0;r<less.length;r++)
					{less[r].parentNode.removeChild(less[r]);}
					tokill[t].style.display="block";
				}
			}
		}
	}


	//按class屏蔽
	var killclass=["user-vip-info","icon-vip","menu_item_334","menu_item_1","menu_item_305","menu_item_more"];
	for (var I=0;I<killclass.length;I++)
	{
		var Tokill=document.querySelectorAll("."+killclass[I]);
		for (var J=0;J<Tokill.length;J++)
		{Tokill[J].style.display="none";}
	}

	//按id屏蔽
	var killid=["QM_Container_333","QM_Container_31","tb_index_li","tb_friend_li","tb_app_li","tb_dress_li","tb_music_li","qz-head-level","leftMenu"];
	for (var i=0;i<killid.length;i++)
	{
		var _Tokill=document.querySelectorAll("#"+killid[i]);
		for (var j=0;j<_Tokill.length;j++)
		{_Tokill[j].style.display="none";}
	}


	window.setInterval(killname,150);
	window.setInterval(killname1,150);
	window.setInterval(killname2,150);
	if (document.querySelectorAll("#leftMenu").length)
	{
		var set=document.createElement("div");
		set.innerHTML="<p>屏蔽以下用户点赞:</p><textarea id=\"name\" placeholder=\"屏蔽列表\" style=\"height:250px\"></textarea><button id=\"save\" style=\"width:140px;height:30px\">保存</button>";
		set.innerHTML+="<br><input type=\"checkbox\" id=\"only\" style=\"zoom:120%\"><span>反向屏蔽</span>";
		set.innerHTML+="<br><br><p>点赞并隐藏以下用户动态:</p><textarea id=\"name1\" placeholder=\"屏蔽列表\" style=\"height:250px\"></textarea><button id=\"save1\" style=\"width:140px;height:30px\">保存</button>";
		set.innerHTML+="<br><br><p>屏蔽以下用户评论:</p><textarea id=\"name2\" placeholder=\"屏蔽列表\" style=\"height:250px\"></textarea><button id=\"save2\" style=\"width:140px;height:30px\">保存</button>";
		set.innerHTML+="<br><input type=\"checkbox\" id=\"only2\" style=\"zoom:120%\"><span>反向屏蔽</span>";
		document.getElementById("pageContent").appendChild(set);
		document.getElementById("name").value=GM_getValue("killname","");
		document.getElementById("save").onclick=function()
		{
			GM_setValue("killname",document.getElementById("name").value);
			document.getElementById("save").innerText="已保存";
			setTimeout(function(){document.getElementById("save").innerText="保存";},2000);
		}
		document.getElementById("name1").value=GM_getValue("killname1","");
		document.getElementById("save1").onclick=function()
		{
			GM_setValue("killname1",document.getElementById("name1").value);
			document.getElementById("save1").innerText="已保存";
			setTimeout(function(){document.getElementById("save1").innerText="保存";},2000);
		}
		document.getElementById("name2").value=GM_getValue("killname2","");
		document.getElementById("save2").onclick=function()
		{
			GM_setValue("killname2",document.getElementById("name2").value);
			document.getElementById("save2").innerText="已保存";
			setTimeout(function(){document.getElementById("save2").innerText="保存";},2000);
		}
	}
	if (GM_getValue("killonly","false")=="true")
	{only=true;}
	if (GM_getValue("killonly2","false")=="true")
	{only2=true;}
	if (document.querySelectorAll("#only").length)
	{
		if (only)
		{document.getElementById("only").checked=true;}
		document.getElementById("only").onclick=function()
		{
			if (document.getElementById("only").checked)
			{GM_setValue("killonly","true");only=true;}
			else
			{GM_setValue("killonly","false");only=false;}
		}
	}
	if (document.querySelectorAll("#only2").length)
	{
		if (only2)
		{document.getElementById("only2").checked=true;}
		document.getElementById("only2").onclick=function()
		{
			if (document.getElementById("only2").checked)
			{GM_setValue("killonly2","true");only2=true;}
			else
			{GM_setValue("killonly2","false");only2=false;}
		}
	}
})();