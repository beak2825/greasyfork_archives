// ==UserScript==
// @name           Transform Train
// @description    change rail style
// @match http://*.keyaki.cf/*
// @match https://*.keyaki.cf/*
// @version 0.0.1.20200316013511
// @namespace https://greasyfork.org/users/3920
// @downloadURL https://update.greasyfork.org/scripts/19087/Transform%20Train.user.js
// @updateURL https://update.greasyfork.org/scripts/19087/Transform%20Train.meta.js
// ==/UserScript==

var reg = [/<a href="(.+?)" title="(.+?)" .+?>.+?<span .+?>([0-9.]+[A-Z]+)<\/span><\/a>/,
           /<a .+? href="(.+?)" .+?><strong .+?>(.+?)<\/strong>.+?<span .+?>([0-9.]+[A-Z]+)<\/span>/];

var background = ["https://googledrive.com/host/0B5tCBVq8EwELUk9jcmhpZmNsbm8",
		  "https://googledrive.com/host/0B5tCBVq8EwELUFBYb0FxXzA1ek0",];

var favIcon = [ "https://googledrive.com/host/0B5tCBVq8EwELcnd0N0tLNHg3dW8",
		"https://googledrive.com/host/0B5tCBVq8EwELREhkejVMcWd3cWc",];

var border_color = ["#B264A2", "#a0d468"];
var text_color = ["#B264A2", "#77c059"];

var keyaki_member_img = ["https://googledrive.com/host/0B5tCBVq8EwELNXlFMzFUdkZaS0k",
			 "https://googledrive.com/host/0B5tCBVq8EwELRTZjazhPbWlLUGM",
			 "https://googledrive.com/host/0B5tCBVq8EwELdUQ2ZjlndjhwTDA",
			 "https://googledrive.com/host/0B5tCBVq8EwELRWd1bGxKX3gxSFU",
			 "https://googledrive.com/host/0B5tCBVq8EwELMFZnLXZHbFJfZDg",
			 "https://googledrive.com/host/0B5tCBVq8EwELMVBIejBGdGs3QkU",
			 "https://googledrive.com/host/0B5tCBVq8EwELU1BRdG1XYnhfbk0",
			 "https://googledrive.com/host/0B5tCBVq8EwELbWczZ2R0TUFfX2M",
			 "https://googledrive.com/host/0B5tCBVq8EwELNlNfSWdnbG1YYm8",
			 "https://googledrive.com/host/0B5tCBVq8EwELTExNSHZ5VTdJV0k",
			 "https://googledrive.com/host/0B5tCBVq8EwELMW5MUXZrX01OejA",
			 "https://googledrive.com/host/0B5tCBVq8EwELRmpXLU5wVWFSUHM",
			 "https://googledrive.com/host/0B5tCBVq8EwELQjhlMWY4N3lJVG8",
			 "https://googledrive.com/host/0B5tCBVq8EwELanY1aE41Sk84ZU0",
			 "https://googledrive.com/host/0B5tCBVq8EwELaklpVnRxSVNJYkE",
			 "https://googledrive.com/host/0B5tCBVq8EwELVGFTMklzWDQ5OFU",
			 "https://googledrive.com/host/0B5tCBVq8EwELZ05OTXdpVTB6dDg",
			 "https://googledrive.com/host/0B5tCBVq8EwELQnd6clo4dUZjZk0",
			 "https://googledrive.com/host/0B5tCBVq8EwELbDBhX0h6eG1RSW8",
			 "https://googledrive.com/host/0B5tCBVq8EwELbkhXUS1UN0RWcG8",
			 "https://googledrive.com/host/0B5tCBVq8EwELZkpsRVhPbkVWdU0",
			 "https://googledrive.com/host/0B5tCBVq8EwELQjFGNGJHYXN2Q1U",
			 "https://googledrive.com/host/0B5tCBVq8EwELMEQ3RVBtRTg5NHM",
			 "https://googledrive.com/host/0B5tCBVq8EwELbkY2ZllJTHlXTms",
			 "https://googledrive.com/host/0B5tCBVq8EwELWlgzcXdnc3BucG8",
			 "https://googledrive.com/host/0B5tCBVq8EwELbGExbnNIMDU3eFE",];
var keyaki_member_name = [["&nbsp;&nbsp;小林 由依</span><br>&nbsp;&nbsp;YUI　KOBAYASHI",15],
			  ["&nbsp;&nbsp;<span style=\"color:red;\">私が鼻を折る</span></span><br><span style=\"float:right;\">- 小林由依</span>",15],
			  ["&nbsp;&nbsp;渡辺 梨加</span><br>&nbsp;&nbsp;RIKA　WATANABE",15],
			  ["&nbsp;&nbsp;&nbsp;ん〜<br>&nbsp;&nbsp;カメラ怖い〜</span>",15],
			  ["&nbsp;&nbsp;石森 虹花</span><br>&nbsp;&nbsp;NIJIKA　ISHIMORI",15],
			  ["&nbsp;&nbsp;今泉 佑唯</span><br>&nbsp;&nbsp;YUI　IMAIZUMI",15],
			  ["&nbsp;&nbsp;上村 莉菜</span><br>&nbsp;&nbsp;RINA　UEMURA",15],
			  ["&nbsp;&nbsp;尾関 梨香</span><br>&nbsp;&nbsp;RIKA　OZEKI",15],
			  ["&nbsp;&nbsp;織田 奈那</span><br>&nbsp;&nbsp;NANA　ODA",15],
			  ["&nbsp;&nbsp;小池 美波</span><br>&nbsp;&nbsp;MINAMI　KOIKE",15],
			  ["&nbsp;&nbsp;齋藤 冬優花</span><br>&nbsp;&nbsp;FUYUKA　SAITO",15],
			  ["&nbsp;&nbsp;佐藤 詩織</span><br>&nbsp;&nbsp;SHIORI　SATO",15],
			  ["&nbsp;&nbsp;志田 愛佳</span><br>&nbsp;&nbsp;MANAKA　SHIDA",15],
			  ["&nbsp;&nbsp;菅井 友香</span><br>&nbsp;&nbsp;YUUKA　SUGAI",15],
			  ["&nbsp;&nbsp;鈴本 美愉</span><br>&nbsp;&nbsp;MIYU　SUZUMOTO",15],
			  ["&nbsp;&nbsp;長沢 菜々香</span><br>&nbsp;&nbsp;NANAKO　NAGASAWA",15],
			  ["&nbsp;&nbsp;土生 瑞穂</span><br>&nbsp;&nbsp;MIZUHO　HABU",15],
			  ["&nbsp;&nbsp;原田 葵</span><br>&nbsp;&nbsp;AOI　HARADA",15],
			  ["&nbsp;&nbsp;平手 友梨奈</span><br>&nbsp;&nbsp;YURINA　HIRATE",15],
			  ["&nbsp;&nbsp;守屋 茜</span><br>&nbsp;&nbsp;AKANE　MORIYA",15],
			  ["&nbsp;&nbsp;米谷 奈々未</span><br>&nbsp;&nbsp;NANAMI　YONETANI",15],
			  ["&nbsp;&nbsp;「ＯＮＥ」<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>は終わらない",15],
			  ["&nbsp;&nbsp;渡邉 理佐</span><br>&nbsp;&nbsp;RISA　WATANABE",15],
			  ["&nbsp;&nbsp;長濱 ねる</span><br>&nbsp;&nbsp;NERU　NAGAHAMA",15],
			  ["</span><span style=\"font-size:19px;font-weight:bold;\">&nbsp;&nbsp;&nbsp;おっ！おっ！おっ！おっ！<br>&nbsp;唐揚げ　食べる　食べない　食べる<br>&nbsp;&nbsp;唐揚げ　食べるよ　うん！</span>",0],
			  ["&nbsp;&nbsp;&nbsp;夢と理想と現実</span>",15],];

var nogi_member_img = [	"https://googledrive.com/host/0B5tCBVq8EwELV3pmaEtBMklTZnM",
			"https://googledrive.com/host/0B5tCBVq8EwELQWF0eGx3RE9jemc",
			"https://googledrive.com/host/0B5tCBVq8EwELY3UySVN5eHJrSnM",
			"https://googledrive.com/host/0B5tCBVq8EwELOWQxdi1sdE9CSmM",
			"https://googledrive.com/host/0B5tCBVq8EwELM1NyclpMS0V4Zm8",
			"https://googledrive.com/host/0B5tCBVq8EwELQmlSa29DeEdBQkE",
			"https://googledrive.com/host/0B5tCBVq8EwELLXpOQ21nVDMwbHM",
			"https://googledrive.com/host/0B5tCBVq8EwELSHhPR1VFZjhGQjQ",
			"https://googledrive.com/host/0B5tCBVq8EwELeUZEY0JyWnRRSzg",
			"https://googledrive.com/host/0B5tCBVq8EwELQmdtZEV6elBEdmM",
			"https://googledrive.com/host/0B5tCBVq8EwELWVZySWhEMUJqMTA",
			"https://googledrive.com/host/0B5tCBVq8EwELTGVSOGJrUTQ2TWc",
			"https://googledrive.com/host/0B5tCBVq8EwELSVdlWEcxa1RaSGc",
			"https://googledrive.com/host/0B5tCBVq8EwELMEQ2SzJQZ3BnVlU",
			"https://googledrive.com/host/0B5tCBVq8EwELYUh1YkRSckkxOGM",
			"https://googledrive.com/host/0B5tCBVq8EwELQi1CNUJTYTJfQzQ",
			"https://googledrive.com/host/0B5tCBVq8EwELTWlUV3F3Y0pRV3M",
			"https://googledrive.com/host/0B5tCBVq8EwELOFZiXzFmR2NmLWc",
			"https://googledrive.com/host/0B5tCBVq8EwELalNyem0wWEtjZzQ",
			"https://googledrive.com/host/0B5tCBVq8EwELZ0dQZlhBcmxOTXc",
			"https://googledrive.com/host/0B5tCBVq8EwELQnlDcEdIN3Ywenc",
			"https://googledrive.com/host/0B5tCBVq8EwELdFl1Y3NVa0FGTzA",
			"https://googledrive.com/host/0B5tCBVq8EwELN0dlN1RLRjRxa3c",
			"https://googledrive.com/host/0B5tCBVq8EwELcXFJUUMtR0xtbFE",
			"https://googledrive.com/host/0B5tCBVq8EwELQXdoYXc5V1FXbjA",
			"https://googledrive.com/host/0B5tCBVq8EwELWnFIcGJkcVlvQ2M",
			"https://googledrive.com/host/0B5tCBVq8EwELX21RREl3cDZrWmM",
			"https://googledrive.com/host/0B5tCBVq8EwELYVZBYWF5TnNMUWc",
			"https://googledrive.com/host/0B5tCBVq8EwELV2h1RmJtY0RxMEk",
			"https://googledrive.com/host/0B5tCBVq8EwELWnN0MUo4NlZUV3c",
			"https://googledrive.com/host/0B5tCBVq8EwELN3FFRXBISkJ3dnM",
			"https://googledrive.com/host/0B5tCBVq8EwELal9fTmJwY0Fwemc",
			"https://googledrive.com/host/0B5tCBVq8EwELWWo2LVA3RzliYWM",
			"https://googledrive.com/host/0B5tCBVq8EwELYkJrTEtwaDdaQmc",
			"https://googledrive.com/host/0B5tCBVq8EwELcTRsNENjdDhDbEE",
			"https://googledrive.com/host/0B5tCBVq8EwELNFMwSmQzX2pla1k",
			"https://googledrive.com/host/0B5tCBVq8EwELWkZGWDNKdHZ6T2c",
			"https://googledrive.com/host/0B5tCBVq8EwELSEZPTEVlV3U2MGM",];
var nogi_member_name = [["&nbsp;&nbsp;渡辺 みり愛</span><br>&nbsp;&nbsp;MIRIA　WATANABE",15],
			["&nbsp;&nbsp;星野 みなみ</span><br>&nbsp;&nbsp;MINAMI　HOSHINO",15],
			["&nbsp;&nbsp;秋元 真夏</span><br>&nbsp;&nbsp;MANATSU　AKIMOTO",15],
			["&nbsp;&nbsp;生田 絵梨花</span><br>&nbsp;&nbsp;ERIKA　IKUTA",15],
			["&nbsp;&nbsp;生駒 里奈</span><br>&nbsp;&nbsp;RINA　IKOMA",15],
			["&nbsp;&nbsp;伊藤 かりん</span><br>&nbsp;&nbsp;KARIN　ITOU",15],
			["&nbsp;&nbsp;伊藤 純奈</span><br>&nbsp;&nbsp;JUNNA　ITOU",15],
			["&nbsp;&nbsp;伊藤 万理華</span><br>&nbsp;&nbsp;MARIKA　ITOU",15],
			["&nbsp;&nbsp;井上 小百合</span><br>&nbsp;&nbsp;SAYURI　INOUE",15],
			["&nbsp;&nbsp;衛藤 美彩</span><br>&nbsp;&nbsp;MISA　ETOU",15],
			["&nbsp;&nbsp;川後 陽菜</span><br>&nbsp;&nbsp;HINA　KAWAGO",15],
			["&nbsp;&nbsp;川村 真洋</span><br>&nbsp;&nbsp;MAHIRO　KAWAMURA",15],
			["&nbsp;&nbsp;北野 日奈子</span><br>&nbsp;&nbsp;HINAKO　KITANO",15],
			["&nbsp;&nbsp;齋藤 飛鳥</span><br>&nbsp;&nbsp;ASUKA　SAITOU",15],
			["&nbsp;&nbsp;斎藤 ちはる</span><br>&nbsp;&nbsp;CHIHARU　SAITOU",15],
			["&nbsp;&nbsp;斉藤 優里</span><br>&nbsp;&nbsp;YUURI　SAITOU",15],
			["&nbsp;&nbsp;相楽 伊織</span><br>&nbsp;&nbsp;IORI　SAGARA",15],
			["&nbsp;&nbsp;桜井 玲香</span><br>&nbsp;&nbsp;REIKA　SAKURAI",15],
			["&nbsp;&nbsp;佐々木 琴子</span><br>&nbsp;&nbsp;KOTOKO　SASAKI",15],
			["&nbsp;&nbsp;白石 麻衣</span><br>&nbsp;&nbsp;MAI　SHIRAISHI",15],
			["&nbsp;&nbsp;新内 眞衣</span><br>&nbsp;&nbsp;MAI　SHINUCHI",15],
			["&nbsp;&nbsp;鈴木 絢音</span><br>&nbsp;&nbsp;AYANE　SUZUKI",15],
			["&nbsp;&nbsp;高山 一実</span><br>&nbsp;&nbsp;KAZUMI　TAKAYAMA",15],
			["&nbsp;&nbsp;寺田 蘭世</span><br>&nbsp;&nbsp;RANZE　TERADA",15],
			["&nbsp;&nbsp;中田 花奈</span><br>&nbsp;&nbsp;KANA　NAKADA",15],
			["&nbsp;&nbsp;中元 日芽香</span><br>&nbsp;&nbsp;HIMEKA　NAKAMOTO",15],
			["&nbsp;&nbsp;西野 七瀬</span><br>&nbsp;&nbsp;NANASE　NISHINO",15],
			["&nbsp;&nbsp;能條 愛未</span><br>&nbsp;&nbsp;AMI　NOUJOU",15],
			["&nbsp;&nbsp;橋本 奈々未</span><br>&nbsp;&nbsp;NANAMI　HASHIMOTO",15],
			["&nbsp;&nbsp;樋口 日奈</span><br>&nbsp;&nbsp;HINA　HIGUCHI",15],
			["&nbsp;&nbsp;深川 麻衣</span><br>&nbsp;&nbsp;MAI　FUKAGAWA",15],
			["&nbsp;&nbsp;堀 未央奈</span><br>&nbsp;&nbsp;MIONA　HORI",15],
			["&nbsp;&nbsp;松村 沙友理</span><br>&nbsp;&nbsp;SAYURI　MATSUMURA",15],
			["&nbsp;&nbsp;山崎 怜奈</span><br>&nbsp;&nbsp;RENA　YAMAZAKI",15],
			["&nbsp;&nbsp;若月 佑美</span><br>&nbsp;&nbsp;YUMI　WAKATSUKI",15],
			["&nbsp;&nbsp;和田 まあや</span><br>&nbsp;&nbsp;MAAYA　WADA",15],
			["&nbsp;&nbsp;永島聖羅</span><br>&nbsp;&nbsp;SEIRA　NAGASHIMA",15],
			["&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: white;\">のぎ天</span></span>",15],];

function getRail(srcObj, group, selectMember)
{
	var pattern = /(<a href="[^>]+?" title=".+?" .+?>.+?<span .+?>[0-9.]+[A-Z]+<\/span><\/a>|<a [^>]+? href="[^>]+?" [^>]+?><strong .+?>.+?<\/strong>.+?<span .+?>[0-9.]+[A-Z]+<\/span>)/g;
	var matchArray;
	var index = 0;
	var member_img = (group === 0 ? nogi_member_img : keyaki_member_img);
	var member_name = (group === 0 ? nogi_member_name : keyaki_member_name);

	var randomMember = (selectMember === "r" ? Math.floor(Math.random() * member_img.length) : Number(selectMember));

	var str = "<table class=\":train\" style=\"min-width:400px; margin-bottom: 10px; border-radius: 5px; border: 1px solid " + border_color[group] + "; background-color: #fff; padding:12px 15px; box-sizing:border-box; font-size:12px;\" align=center>";

	str += "<tr><td style=\"margin:0 0 0 0; padding:0 0 0 0;\"><div class=\":rail\" style=\"margin-bottom:10px; border-bottom:1px solid " + border_color[group] + "; padding-bottom:0px; line-height:37px; color:" + text_color[group] + "; font-weight:normal; margin:0; height:111px;\">";

	str += "<div style=\"width:82.19px; height:100px; margin:1 0 0 1;padding:0 0 0 0; float:left;\"><img src=\"" + member_img[randomMember] + "\"></div>";

	str += "<div style=\"float:left; padding-top:" + member_name[randomMember][1] + "px;\"><span><span style=\"font-size: 24px;\">" + member_name[randomMember][0] + "</span></div>";

	str += "<div style=\"margin:0 0 0 0;padding:0 0 0 0; height:111px; float:right;\"><img src=\"" + background[group] + "\" style=\"float:right;\"></div></div></td></tr>";

	while((matchArray = pattern.exec(srcObj.innerHTML)) !== null)
	{
		str += changeRail(matchArray[0], index);
		++index;
	}

	return str;
}

function changeRail(source, index)
{
	for(var i = 0; i < reg.length; ++i)
	{
		var result = source.match(reg[i]);
		if( result !== null )
		{
			var link = "<tr style=\"margin: 10px 0 0 0; padding-top: 10px; padding: 0; display: block; list-style-type: disc; -webkit-margin-before: 1em; -webkit-margin-after: 1em; -webkit-margin-start: 0px; -webkit-margin-end: 0px; -webkit-padding-start: 0px;\">";
			if(index === 0)
			{
				link += "<td class=\":rail\" style=\"margin-top: 0; margin: 10px 0; padding-top:10px; transition: opacity 0.3s linear; list-style: none; display: list-item; text-align: -webkit-match-parent;\">";
			}
			else
			{
				link += "<td class=\":rail\" style=\"margin-top: 0; margin: 10px 0; border-top: 1px dotted #8d8d8d; padding-top: 10px; transition: opacity 0.3s linear; list-style: none; display: list-item; text-align: -webkit-match-parent;\">";
			}
			link += "<a href=\"" + result[1] + "\" style=\"color: rgb(51, 51, 51); text-decoration: none; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; background-color: transparent; cursor: pointer;\">";
			link += result[2] + "</a>&nbsp;&nbsp;";
			link += "<span style=\"font-size:11px; text-decoration: inherit; color: rgb(153, 153, 153);\">" + result[3] + "</span></td></tr>";
			return link;
		}
	}
}

function changeFavicon(obj, index)
{
	var favicon = obj.querySelector('link[rel="icon"]');
	if (favicon !== null)
	{
		favicon.href = favIcon[index];
	}
	else
	{
		favicon = obj.createElement("link");
		favicon.rel = "icon";
		favicon.href = favIcon[index];
		obj.head.appendChild(favicon);
	}
}

function getTextWidth(str)
{
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	ctx.font = "16px Meiryo";
	return ctx.measureText(str).width;
}

function setMemberList(group)
{
	var dd = document.getElementById("dropdown");
	if (dd === null)
	{
		var submenuBase = document.getElementById("submenu");
		dd = document.createElement("div");
		dd.setAttribute("class", "close");
		dd.setAttribute("id", "dropdown");
		submenuBase.appendChild(dd);
	}
	dd.innerHTML = "";
	dd.setAttribute("value", (group === 0 ? "n" : "k"));

	var buttonElem = document.createElement("div");
	buttonElem.setAttribute("class", "selectbutton");
	buttonElem.setAttribute("id", "buttonBar");
	dd.appendChild(buttonElem);

	var ulElem = document.createElement("ul");
	var liElem = document.createElement("li");
	var selectElem = document.createElement("div");
	selectElem.setAttribute("class", "selectbutton");
	selectElem.setAttribute("id", "item");
	selectElem.setAttribute("onclick", "selectList(this);");
	selectElem.setAttribute("value", "r");
	selectElem.innerHTML = "Random";
	liElem.appendChild(selectElem);
	ulElem.appendChild(liElem);

	var member_name = (group === 0 ? nogi_member_name : keyaki_member_name);

	var maxWidth = 0;
	for(var i = 0; i < member_name.length; ++i)
	{
		compactname = member_name[i][0].replace(/&nbsp;|<.+?>/g, " ");

		var width = getTextWidth(compactname);
		if (width > maxWidth)
		    maxWidth = width;

		liElem = document.createElement("li");
		selectElem = document.createElement("div");
		selectElem.setAttribute("class", "selectbutton");
		selectElem.setAttribute("id", "item");
		selectElem.setAttribute("onclick", "selectList(this);");
		selectElem.setAttribute("value", String(i));
		selectElem.innerHTML = compactname;
		liElem.appendChild(selectElem);
		ulElem.appendChild(liElem);
	}

	var listElem = document.createElement("div");
	listElem.setAttribute("class", "lists");
	listElem.appendChild(ulElem);
	dd.appendChild(listElem);

	dd.style.width = String(maxWidth) + "px";
}

function openList()
{
	document.getElementById('dropdown').setAttribute('class', 'open');
}

function selectList(obj)
{
	document.getElementById('dropdown').setAttribute('class', 'close');

	var prevSelected = document.getElementById("checked");
	if (prevSelected !== null)
		prevSelected.setAttribute("id", "item");

	if (obj !== null)
		obj.setAttribute("id", "checked");

	var bar = document.getElementById("buttonBar");
	bar.setAttribute("value", obj.getAttribute("value"));
	bar.innerHTML = obj.innerHTML;
}

function toggleList()
{
	eventElement = window.event.srcElement || window.event.originalTarget;
	if (eventElement.id == 'dropdown') return;

	var listObj = document.getElementById('dropdown');
	if (eventElement.id == 'buttonBar' && listObj.getAttribute('class') == 'close')
	{
		listObj.setAttribute('class', 'open');
		$('.lists').perfectScrollbar('update');
	}
	else
		listObj.setAttribute('class', 'close');
}

document.onclick = toggleList;