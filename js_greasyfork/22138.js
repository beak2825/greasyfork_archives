// ==UserScript==
// @name           Transform Train on Dropbox
// @description    change rail style
// @match http://*.keyaki.cf/*
// @match https://*.keyaki.cf/*
// @version 0.0.1.20200316105857
// @namespace https://greasyfork.org/users/3920
// @downloadURL https://update.greasyfork.org/scripts/22138/Transform%20Train%20on%20Dropbox.user.js
// @updateURL https://update.greasyfork.org/scripts/22138/Transform%20Train%20on%20Dropbox.meta.js
// ==/UserScript==

var reg = [/<a href="(.+?)" title="(.+?)" .+?>.+?<span .+?>([0-9.]+[A-Z]+)<\/span><\/a>/,
           /<a [^>]*href="([^>]+?)"[^>]*>([^<>]+?)<\/a>[^<]*<span [^>]*>\(([0-9.]+[A-Z]+)\)<\/span>/];

var background = ["https://www.dropbox.com/s/u8a4okrvbcearu6/nogi_notext.png?dl=1",
		  "https://www.dropbox.com/s/izhotbka9976bqe/keyaki_notext.png?dl=1", ];

var favIcon = ["https://www.dropbox.com/s/t2mw2hwif9eg74c/nogi_notext.ico?dl=1",
		"https://www.dropbox.com/s/z2712k4shy28knt/keyaki_notext.ico?dl=1", ];

var border_color = ["#B264A2", "#a0d468"];
var text_color = ["#B264A2", "#77c059"];

var keyaki_member_img = ["https://www.dropbox.com/s/myak9c8d3cxkzg3/pf_yuipon.png?dl=1",
			 "https://www.dropbox.com/s/doca3ytu8tlu398/AreYouOK.gif?dl=1",
			 "https://www.dropbox.com/s/ka1e197106t5nnn/watashiga_hanao_oru.gif?dl=1",
			 "https://www.dropbox.com/s/s89niytlj8u1emu/yuipon_wang.gif?dl=1",
			 "https://www.dropbox.com/s/l82trrsresaa5ev/pf_beri.png?dl=1",
			 "https://www.dropbox.com/s/1lfro00kh4dkv8k/camera_kowai.gif?dl=1",
			 "https://www.dropbox.com/s/45f0q92nod5q5d3/pf_nijika.png?dl=1",
			 "https://www.dropbox.com/s/09lsaszunxmfzag/pf_zumin.png?dl=1",
			 "https://www.dropbox.com/s/hee7kbps9zxrh99/zuming_wang.gif?dl=1",
			 "https://www.dropbox.com/s/n5kxdwkdx4dh53n/pf_rina.png?dl=1",
			 "https://www.dropbox.com/s/sjcuc02j0g3m1nw/kakawaii.gif?dl=1",
			 "https://www.dropbox.com/s/w3n1rg3qkqxzgvf/pf_ozeki.png?dl=1",
			 "https://www.dropbox.com/s/9fviyzuspdo4msw/pf_oda.png?dl=1",
			 "https://www.dropbox.com/s/liaqjzgrlqwh6v7/mittenaiwa.gif?dl=1",
			 "https://www.dropbox.com/s/jro8c2eql04fpnz/pf_koike.png?dl=1",
			 "https://www.dropbox.com/s/p34qq9tivhiq1d2/pf_saito.png?dl=1",
			 "https://www.dropbox.com/s/560c4g2pfv5bop5/js_saito.png?dl=1",
			 "https://www.dropbox.com/s/3k46eudxcvr5w4p/anpanman.gif?dl=1",
			 "https://www.dropbox.com/s/31ehvny6lqejs7s/pf_satoshi.png?dl=1",
			 "https://www.dropbox.com/s/drj0hqmcnd1my6j/pf_manaka.png?dl=1",
			 "https://www.dropbox.com/s/mtwqpe8p7nl0nbj/mannaka.gif?dl=1",
			 "https://www.dropbox.com/s/5nz9sp3uyz0oybn/manakai.gif?dl=1",
			 "https://www.dropbox.com/s/drnyprammhs3l6g/pf_sugai.png?dl=1",
			 "https://www.dropbox.com/s/cg428z8l2n9ep8k/pf_kuri.png?dl=1",
			 "https://www.dropbox.com/s/vty6b1gd7sklmu8/pf_nanako.png?dl=1",
			 "https://www.dropbox.com/s/x8o9tey7c3xbq8c/sekainoowari.gif?dl=1",
			 "https://www.dropbox.com/s/fp3pra5l2tjcymr/pf_habu.png?dl=1",
			 "https://www.dropbox.com/s/2hj9ii480981bke/pf_aoi.png?dl=1",
			 "https://www.dropbox.com/s/ybr097jmwwehziw/pf_hirate.png?dl=1",
			 "https://www.dropbox.com/s/ako0fy6e659axdc/pf_akane.png?dl=1",
			 "https://www.dropbox.com/s/rciwhgz0qepjyc1/pf_yonesan.png?dl=1",
			 "https://www.dropbox.com/s/2rhtubsc4pk7fin/js_yonesan.png?dl=1",
			 "https://www.dropbox.com/s/2x4g7rqo2sjnjm0/pf_risa.png?dl=1",
			 "https://www.dropbox.com/s/3nxz03oqfp8yrkz/pf_neru.png?dl=1",
			 "https://www.dropbox.com/s/liy77ojx9qswrts/karaage_taberu.gif?dl=1",];
var keyaki_member_name = [["&nbsp;&nbsp;小林 由依</span><br />&nbsp;&nbsp;YUI　KOBAYASHI",15],
			  ["&nbsp;&nbsp;&nbsp;Are you OK?</span>",15],
			  ["&nbsp;&nbsp;<span style=\"color:red;\">私が鼻を折る</span></span><br /><span style=\"float:right;\">- 小林由依</span>",15],
			  ["&nbsp;&nbsp;&nbsp;ワン！ワン！ワン！ワン！<br />&nbsp;&nbsp;ワンワンワンワンワン！</span>",15],
			  ["&nbsp;&nbsp;渡辺 梨加</span><br />&nbsp;&nbsp;RIKA　WATANABE",15],
			  ["&nbsp;&nbsp;&nbsp;ん〜<br />&nbsp;&nbsp;カメラ怖い〜</span>",15],
			  ["&nbsp;&nbsp;石森 虹花</span><br />&nbsp;&nbsp;NIJIKA　ISHIMORI",15],
			  ["&nbsp;&nbsp;今泉 佑唯</span><br />&nbsp;&nbsp;YUI　IMAIZUMI",15],
			  ["&nbsp;&nbsp;&nbsp;わん！わん！わん！<br />&nbsp;&nbsp;わんわんわんわん！</span>",15],
			  ["&nbsp;&nbsp;上村 莉菜</span><br />&nbsp;&nbsp;RINA　UEMURA",15],
			  ["&nbsp;&nbsp;(゜゜)(。。)(゜゜)(。。)</span>",15],
			  ["&nbsp;&nbsp;尾関 梨香</span><br />&nbsp;&nbsp;RIKA　OZEKI",15],
			  ["&nbsp;&nbsp;織田 奈那</span><br />&nbsp;&nbsp;NANA　ODA",15],
			  ["&nbsp;&nbsp;女として見てないじゃん！</span>",30],
			  ["&nbsp;&nbsp;小池 美波</span><br />&nbsp;&nbsp;MINAMI　KOIKE",15],
			  ["&nbsp;&nbsp;齋藤 冬優花</span><br />&nbsp;&nbsp;FUYUKA　SAITO",15],
			  ["&nbsp;&nbsp;&nbsp;夢と理想と現実</span>",15],
			  ["&nbsp;&nbsp;&nbsp;アンパンマン<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;アンパンマン</span>",15],
			  ["&nbsp;&nbsp;佐藤 詩織</span><br />&nbsp;&nbsp;SHIORI　SATO",15],
			  ["&nbsp;&nbsp;志田 愛佳</span><br />&nbsp;&nbsp;MANAKA　SHIDA",15],
			  ["&nbsp;&nbsp;まなか　もなか　まんなか～<br />&nbsp;&nbsp;(￣へ￣ *)</span>",15],
			  ["&nbsp;&nbsp;&nbsp;&nbsp;（￣_￣？）</span>",15],
			  ["&nbsp;&nbsp;菅井 友香</span><br />&nbsp;&nbsp;YUUKA　SUGAI",15],
			  ["&nbsp;&nbsp;鈴本 美愉</span><br />&nbsp;&nbsp;MIYU　SUZUMOTO",15],
			  ["&nbsp;&nbsp;長沢 菜々香</span><br />&nbsp;&nbsp;NANAKO　NAGASAWA",15],
			  ["&nbsp;&nbsp;&nbsp;地球の終わり</span>",15],
			  ["&nbsp;&nbsp;土生 瑞穂</span><br />&nbsp;&nbsp;MIZUHO　HABU",15],
			  ["&nbsp;&nbsp;原田 葵</span><br />&nbsp;&nbsp;AOI　HARADA",15],
			  ["&nbsp;&nbsp;平手 友梨奈</span><br />&nbsp;&nbsp;YURINA　HIRATE",15],
			  ["&nbsp;&nbsp;守屋 茜</span><br />&nbsp;&nbsp;AKANE　MORIYA",15],
			  ["&nbsp;&nbsp;米谷 奈々未</span><br />&nbsp;&nbsp;NANAMI　YONETANI",15],
			  ["&nbsp;&nbsp;「ＯＮＥ」<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>は終わらない",15],
			  ["&nbsp;&nbsp;渡邉 理佐</span><br />&nbsp;&nbsp;RISA　WATANABE",15],
			  ["&nbsp;&nbsp;長濱 ねる</span><br />&nbsp;&nbsp;NERU　NAGAHAMA",15],
			  ["</span><span style=\"font-size:19px;font-weight:bold;\">&nbsp;&nbsp;&nbsp;おっ！おっ！おっ！おっ！<br />&nbsp;唐揚げ　食べる　食べない　食べる<br />&nbsp;&nbsp;唐揚げ　食べるよ　うん！</span>",0],];

var nogi_member_img = ["https://www.dropbox.com/s/s9vahoy7a3o1nwy/pf_miria.png?dl=1",
			"https://www.dropbox.com/s/k581la6scibajm9/pf_hoshino.png?dl=1",
			"https://www.dropbox.com/s/5nrtdn7qa900kbo/pf_manatsu.png?dl=1",
			"https://www.dropbox.com/s/zere0ajgwtdb6kh/pf_erikasama.png?dl=1",
			"https://www.dropbox.com/s/n48h2a8eb8my63y/pf_ikoma.png?dl=1",
			"https://www.dropbox.com/s/t3ckgyj8s434n3z/pf_karin.png?dl=1",
			"https://www.dropbox.com/s/fu60h9dm66nbwuy/pf_junna.png?dl=1",
			"https://www.dropbox.com/s/zx0o2f3s1kmvir3/pf_marika.png?dl=1",
			"https://www.dropbox.com/s/oad3u74yh5ftupq/pf_sayunyan.png?dl=1",
			"https://www.dropbox.com/s/wcci8n76h25wqj5/pf_eto.png?dl=1",
			"https://www.dropbox.com/s/mim2o7dbknydjcf/pf_kawago.png?dl=1",
			"https://www.dropbox.com/s/to0omuk09sdgjh7/pf_mahiro.png?dl=1",
			"https://www.dropbox.com/s/wevebwyigmun1wm/pf_hinako.png?dl=1",
			"https://www.dropbox.com/s/k85zh6wizpmvppj/pf_asyu.png?dl=1",
			"https://www.dropbox.com/s/blve09vzj1y52gn/pf_chiharu.png?dl=1",
			"https://www.dropbox.com/s/y7yuccwcpygfvr5/pf_hentai.png?dl=1",
			"https://www.dropbox.com/s/bhnj87p9mjbv5se/pf_iori.png?dl=1",
			"https://www.dropbox.com/s/svwnhnmcmv5ih1l/pf_reika.png?dl=1",
			"https://www.dropbox.com/s/q8im9a9nrn7yzfs/pf_ktk.png?dl=1",
			"https://www.dropbox.com/s/3iry81s52d4lnf6/pf_mai.png?dl=1",
			"https://www.dropbox.com/s/334ouibpjg3brio/pf_ol.png?dl=1",
			"https://www.dropbox.com/s/m6rx6aqr4iynnkd/pf_ayane.png?dl=1",
			"https://www.dropbox.com/s/zyfl7zzpmhres55/pf_kazumi.png?dl=1",
			"https://www.dropbox.com/s/8nkaaan4evn3ha7/pf_ranze.png?dl=1",
			"https://www.dropbox.com/s/bo65pz4ygqhab7l/pf_nakada.png?dl=1",
			"https://www.dropbox.com/s/8bekrr4h42lcxw4/pf_himetan.png?dl=1",
			"https://www.dropbox.com/s/to9pntwcpxha9i6/pf_nanase.png?dl=1",
			"https://www.dropbox.com/s/we45czz45md9zpq/pf_douzo.png?dl=1",
			"https://www.dropbox.com/s/y4zr6ixhv3164up/pf_nanami.png?dl=1",
			"https://www.dropbox.com/s/54rw2ov3tezozuq/pf_hinachima.png?dl=1",
			"https://www.dropbox.com/s/wszmstr6kg6evl1/pf_maimai.png?dl=1",
			"https://www.dropbox.com/s/rwu4u0inlmxo8lp/pf_hori.png?dl=1",
			"https://www.dropbox.com/s/2cce665y41f2zwi/pf_matsumura.png?dl=1",
			"https://www.dropbox.com/s/j81grwcuzu33ppm/pf_rena.png?dl=1",
			"https://www.dropbox.com/s/pnkz69fpuq04rp2/pf_yumi.png?dl=1",
			"https://www.dropbox.com/s/wl1vp6gtcwwmhff/pf_maaya.png?dl=1",
			"https://www.dropbox.com/s/op43ee5m4k8vtww/pf_seira.png?dl=1",
			"https://www.dropbox.com/s/8jnpafmd9zna7wl/nogiten.png?dl=1", ];
var nogi_member_name = [["&nbsp;&nbsp;渡辺 みり愛</span><br />&nbsp;&nbsp;MIRIA　WATANABE",15],
			["&nbsp;&nbsp;星野 みなみ</span><br />&nbsp;&nbsp;MINAMI　HOSHINO",15],
			["&nbsp;&nbsp;秋元 真夏</span><br />&nbsp;&nbsp;MANATSU　AKIMOTO",15],
			["&nbsp;&nbsp;生田 絵梨花</span><br />&nbsp;&nbsp;ERIKA　IKUTA",15],
			["&nbsp;&nbsp;生駒 里奈</span><br />&nbsp;&nbsp;RINA　IKOMA",15],
			["&nbsp;&nbsp;伊藤 かりん</span><br />&nbsp;&nbsp;KARIN　ITOU",15],
			["&nbsp;&nbsp;伊藤 純奈</span><br />&nbsp;&nbsp;JUNNA　ITOU",15],
			["&nbsp;&nbsp;伊藤 万理華</span><br />&nbsp;&nbsp;MARIKA　ITOU",15],
			["&nbsp;&nbsp;井上 小百合</span><br />&nbsp;&nbsp;SAYURI　INOUE",15],
			["&nbsp;&nbsp;衛藤 美彩</span><br />&nbsp;&nbsp;MISA　ETOU",15],
			["&nbsp;&nbsp;川後 陽菜</span><br />&nbsp;&nbsp;HINA　KAWAGO",15],
			["&nbsp;&nbsp;川村 真洋</span><br />&nbsp;&nbsp;MAHIRO　KAWAMURA",15],
			["&nbsp;&nbsp;北野 日奈子</span><br />&nbsp;&nbsp;HINAKO　KITANO",15],
			["&nbsp;&nbsp;齋藤 飛鳥</span><br />&nbsp;&nbsp;ASUKA　SAITOU",15],
			["&nbsp;&nbsp;斎藤 ちはる</span><br />&nbsp;&nbsp;CHIHARU　SAITOU",15],
			["&nbsp;&nbsp;斉藤 優里</span><br />&nbsp;&nbsp;YUURI　SAITOU",15],
			["&nbsp;&nbsp;相楽 伊織</span><br />&nbsp;&nbsp;IORI　SAGARA",15],
			["&nbsp;&nbsp;桜井 玲香</span><br />&nbsp;&nbsp;REIKA　SAKURAI",15],
			["&nbsp;&nbsp;佐々木 琴子</span><br />&nbsp;&nbsp;KOTOKO　SASAKI",15],
			["&nbsp;&nbsp;白石 麻衣</span><br />&nbsp;&nbsp;MAI　SHIRAISHI",15],
			["&nbsp;&nbsp;新内 眞衣</span><br />&nbsp;&nbsp;MAI　SHINUCHI",15],
			["&nbsp;&nbsp;鈴木 絢音</span><br />&nbsp;&nbsp;AYANE　SUZUKI",15],
			["&nbsp;&nbsp;高山 一実</span><br />&nbsp;&nbsp;KAZUMI　TAKAYAMA",15],
			["&nbsp;&nbsp;寺田 蘭世</span><br />&nbsp;&nbsp;RANZE　TERADA",15],
			["&nbsp;&nbsp;中田 花奈</span><br />&nbsp;&nbsp;KANA　NAKADA",15],
			["&nbsp;&nbsp;中元 日芽香</span><br />&nbsp;&nbsp;HIMEKA　NAKAMOTO",15],
			["&nbsp;&nbsp;西野 七瀬</span><br />&nbsp;&nbsp;NANASE　NISHINO",15],
			["&nbsp;&nbsp;能條 愛未</span><br />&nbsp;&nbsp;AMI　NOUJOU",15],
			["&nbsp;&nbsp;橋本 奈々未</span><br />&nbsp;&nbsp;NANAMI　HASHIMOTO",15],
			["&nbsp;&nbsp;樋口 日奈</span><br />&nbsp;&nbsp;HINA　HIGUCHI",15],
			["&nbsp;&nbsp;深川 麻衣</span><br />&nbsp;&nbsp;MAI　FUKAGAWA",15],
			["&nbsp;&nbsp;堀 未央奈</span><br />&nbsp;&nbsp;MIONA　HORI",15],
			["&nbsp;&nbsp;松村 沙友理</span><br />&nbsp;&nbsp;SAYURI　MATSUMURA",15],
			["&nbsp;&nbsp;山崎 怜奈</span><br />&nbsp;&nbsp;RENA　YAMAZAKI",15],
			["&nbsp;&nbsp;若月 佑美</span><br />&nbsp;&nbsp;YUMI　WAKATSUKI",15],
			["&nbsp;&nbsp;和田 まあや</span><br />&nbsp;&nbsp;MAAYA　WADA",15],
			["&nbsp;&nbsp;永島聖羅</span><br />&nbsp;&nbsp;SEIRA　NAGASHIMA",15],
			["&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: white;\">のぎ天</span></span>",15],];

var style_td_rail = "margin-top:0; margin:10px 0; padding-top:10px; transition:opacity 0.3s linear; list-style:none; display:list-item; text-align:-webkit-match-parent;";
var style_td_rail_bd = style_td_rail + " border-top: 1px dotted #8d8d8d";
var td_rail = "<td class=\":rail\" style=\"" + style_td_rail + "\">";
var td_rail_bd = "<td class=\":rail\" style=\"" + style_td_rail_bd + "\">";
var tr_rail = "<tr style=\"margin: 10px 0 0 0; padding-top: 10px; padding: 0; display: block; list-style-type: disc; -webkit-margin-before: 1em; -webkit-margin-after: 1em; -webkit-margin-start: 0px; -webkit-margin-end: 0px; -webkit-padding-start: 0px;\">";

function getRail(srcObj, group, selectMember)
{
	var pattern = /(<a href="[^>]+?" title=".+?" .+?>.+?<span .+?>[0-9.]+[A-Z]+<\/span><\/a>|<a [^>]*href="[^>]+?"[^>]*>[^<>]+?<\/a>[^<]*<span [^>]*>\([0-9.]+[A-Z]+\)<\/span>)/g;
	var matchArray;
	var index = 0;
	var member_img = (group === 0 ? nogi_member_img : keyaki_member_img);
	var member_name = (group === 0 ? nogi_member_name : keyaki_member_name);

	var randomMember = (selectMember === "r" ? Math.floor(Math.random() * member_img.length) : Number(selectMember));

	var str = "<table class=\":train\" style=\"min-width:400px; margin-bottom: 10px; border-radius: 5px; border: 1px solid " + border_color[group] + "; background-color: #fff; padding:12px 15px; box-sizing:border-box; font-size:12px;\" align=\"center\">";

	str += "<tr><td style=\"margin:0 0 0 0; padding:0 0 0 0;\"><div class=\":rail\" style=\"margin-bottom:10px; border-bottom:1px solid " + border_color[group] + "; padding-bottom:0px; line-height:37px; color:" + text_color[group] + "; font-weight:normal; margin:0; height:111px;\">";

	str += "<div style=\"width:82.19px; height:100px; margin:1 0 0 1;padding:0 0 0 0; float:left;\"><img src=\"" + member_img[randomMember] + "\" /></div>";

	str += "<div style=\"float:left; padding-top:" + member_name[randomMember][1] + "px;\"><span><span style=\"font-size: 24px;\">" + member_name[randomMember][0] + "</span></div>";

	str += "<div style=\"margin:0 0 0 0;padding:0 0 0 0; height:111px; float:right;\"><img src=\"" + background[group] + "\" style=\"float:right;\" /></div></div></td></tr>";

	while((matchArray = pattern.exec(srcObj.innerHTML)) !== null)
	{
		str += changeRail(matchArray[0], index);
		++index;
	}

	if (index === 0)
	{
		str += tr_rail;
		str += td_rail;
		str += "<span style=\"text-decoration: inherit; color: rgb(153, 153, 153);\">nothing...</span></td></tr>";
	}
	str += "</table>";

	return str;
}

function changeRail(source, index)
{
	for(var i = 0; i < reg.length; ++i)
	{
		var result = source.match(reg[i]);
		if( result !== null )
		{
			var link = tr_rail;
			if(index === 0)
				link += td_rail;
			else
				link += td_rail_bd;

			link += "<a href=\"" + result[1] + "\" style=\"color: rgb(51, 51, 51); text-decoration: none; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; background-color: transparent; cursor: pointer;\">";
			link += result[2] + "</a>&nbsp;&nbsp;";
			link += "<span style=\"font-size:11px; text-decoration: inherit; color: rgb(153, 153, 153);\">" + result[3] + "</span></td></tr>";
			return link;
		}
	}
}

function getTrain(iSelectGroup)
{
	var src = document.getElementById("editorSrc");
	var dst = document.getElementById(":new");
	var selectMember = "r";

	var list = document.getElementById("buttonBar");
	if(list !== null)
		selectMember = list.getAttribute("value");

	innerXHTML(dst, "<br /><br />" + getRail(src, iSelectGroup, selectMember));
//	dst.innerHTML = "<br /><br />" + getRail(src, iSelectGroup, selectMember);
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
	document.getElementById("editorSrc").setAttribute("name", (group === 0 ? "n" : "k"));
	document.getElementById("execute").setAttribute("name", (group === 0 ? "n" : "k"));

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
		$('.stage').perfectScrollbar('update');
	}
	else
	{
		listObj.setAttribute('class', 'close');
		$('.stage').perfectScrollbar('update');
	}
}

function onFocusEditor(obj, focus)
{
	var border = document.getElementById("editor");
	if (focus == "true")
		border.setAttribute("name", obj.getAttribute("name"));
	else
		border.setAttribute("name", "");
}

document.onclick = toggleList;