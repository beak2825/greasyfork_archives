// ==UserScript==
// @name          Wayback Machine Image Fixer
// @namespace     DoomTay
// @description   Attempts to fix broken images by replacing them with working timestamps based on JSON results
// @include       http://web.archive.org/web/*
// @include       https://web.archive.org/web/*
// @include       http://wayback.archive.org/web/*
// @include       https://wayback.archive.org/web/*
// @exclude       /\*/
// @exclude       *.jpg
// @exclude       *.jpeg
// @exclude       *.png
// @exclude       *.gif
// @exclude       *.bmp
// @version       1.6.1
// @grant         GM_xmlhttpRequest
// @license       GPL-3.0

// @downloadURL https://update.greasyfork.org/scripts/12860/Wayback%20Machine%20Image%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/12860/Wayback%20Machine%20Image%20Fixer.meta.js
// ==/UserScript==

var pics = document.images;
var embeds = document.embeds;
var backgrounds = Array.prototype.filter.call(document.getElementsByTagName("*"),hasBackground);
var allPics = Array.prototype.slice.call(pics).concat(backgrounds, Array.prototype.slice.call(embeds));
var testedURLs = [];
var substitutionTable = {};

function hasBackground(value)
{
	return (window.getComputedStyle(value) && window.getComputedStyle(value).backgroundImage != "none");
}

function specialUses(pic)
{
	var imgRef = referenceURL(pic);
	var filteredCases = {};
	filteredCases.replacements = [];
	if(!imgRef)
	{
		filteredCases.replacements = filteredCases.replacements.concat(imgRef);
		return filteredCases;
	}
	var specialCases = [{domain:"northarc.com/images/unsorted/",replacements:[imgRef.replace("thumb.","tn_"),imgRef.replace("thumb.","")],maxDimensions:{width:100,height:80},tags:"before"},
		{domain:"*",replacements:["data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="],condition:imgRef.includes("spacer.gif") || imgRef.includes("blank.gif"),tags:"after"},
		{domain:"akamai.net",replacements:[imgRef.replace(/.+akamai\.net\/7\/\d+\/\d+\/[a-z0-9]+\/(.+)/,"http://$1")],tags:"after"},
		{domain:"akamaitech.net",replacements:[imgRef.replace(/.+akamaitech\.net\/7\/\d+\/\d+\/[a-z0-9]+\/(.+)/,"http://$1")],tags:"after"},
		{domain:"members.tripod.com",replacements:[imgRef.replace(/members\.tripod\.com\/~([^\/]+)\/(.+)/,"$1.tripod.com/$2")],tags:"before"},
		{domain:"akebi.sakura.ne.jp",replacements:[imgRef.replace("m.",".")],tags:"after"},
		{domain:"maj.com",replacements:[imgRef.replace("maj.com.","majhost.com")],tags:"after"},
		{domain:"tinypic.com/",replacements:[imgRef.replace("/i","/oi")],tags:"after"},
		{domain:"boyis.com",replacements:[imgRef.replace("images","graphic")],condition:imgRef.includes("/images/small"),tags:"after"},
		{domain:"boyis.com",replacements:[imgRef.replace("graphic","images")],condition:imgRef.includes("/graphic/small"),tags:"after"},
		{domain:"event.surpara.com",replacements:[imgRef.replace("event","town")],tags:"after"},
		{domain:"boyis.com",replacements:[imgRef.replace("photos/coolcg","graphic/small"),imgRef.replace("images/coolcg","graphic/small")],condition:imgRef.includes("photos/coolcg") && imgRef.includes("_s"),tags:"after"},
		{domain:"221.253.137.119",replacements:[imgRef.replace("/en/","/ja/")],condition:imgRef.includes("/en/"),tags:"after"},
		{domain:"logitech.com",replacements:["http://www.logitech.com/logitech/new6-1.gif"],condition:imgRef.includes("home_header.gif"),tags:"before"},
		{domain:"logitech.com",replacements:["http://www.logitech.com/logitech/new6-3.gif"],condition:imgRef.includes("home_footer.gif"),tags:"before"},
		{domain:"logitech.com",replacements:["http://www.logitech.com/logitech/prod_row.gif"],condition:imgRef.includes("Images/main_navigator.gif"),tags:"before"},
		{domain:"logitech.com",replacements:["http://www.logitech.com/logitech/al1.gif"],condition:imgRef.includes("Images/navigator.gif"),tags:"before"},
		{domain:"logitech.com",replacements:["http://www.logitech.com/logitech/msensa.gif"],condition:imgRef.includes("Images/mmsensa.gif"),tags:"before"},
		{domain:"miniten.ddo.jp",replacements:[imgRef.replace("ddo.","mydns.")],tags:"after"},
		{domain:"iridion2.com",replacements:[imgRef + ".gif"],condition:imgRef.includes("images/avatars") && !imgRef.includes(".gif") && !imgRef.includes(".jpg"),tags:"after"},
		{domain:"half-life.com",replacements:[imgRef.replace("half-life.com","half-life2.com")],tags:"after"},
		{domain:"micronpc.com",replacements:[imgRef.replace("micronpc.com","mpccorp.com")],tags:"after"},
		{domain:"half-life2.com",replacements:[imgRef.replace("half-life2.com","half-life.com")],tags:"after"},
		{domain:"*",replacements:["http://www.surpara.com/img/ban/sp.gif","http://www.surpara.com/img/ban/sp2.gif","http://www.surpara.com/img/ban/sp3.gif","http://www.surpara.com/img/ban/sp4.gif","http://www.surpara.com/img/ban/sp5.gif","http://www.surpara.com/img/ban/sp6.gif","http://www.surpara.com/img/ban/sp7.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("surpara.com"),tags:"random,after"},
		{domain:"*",replacements:["http://www.gameha.com/gameha_m.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("gameha.com"),tags:"after"},
		{domain:"*",replacements:["http://www.oekaki.net/img/bn2_1.gif","http://www.oekaki.net/img/bn2_2.gif","http://www.oekaki.net/img/bn2_3.gif","http://www.oekaki.net/img/bn2_4.gif","http://www.oekaki.net/img/bn2_5.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("oekaki.net"),tags:"random,after"},
		{domain:"*",replacements:["http://brandk.net/search/img2/s_bnr_11.jpg","http://brandk.net/search/img2/s_bnr_10.jpg","http://brandk.net/search/img2/s_bnr_08.jpg","http://brandk.net/search/img2/s_bnr_04.jpg","http://brandk.net/search/img2/s_bnr_01.jpg"],condition:pic.width == 88 && pic.height == 31 && linksTo("brandk.net"),tags:"random,after"},
		{domain:"*",replacements:["http://ragsearch.com/bana/banas.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("ragsearch.com"),tags:"after"},
		{domain:"minitokyo.net",replacements:[imgRef.replace("thumbs","view")],tags:"after"},
		{domain:"*",replacements:["http://celest.pobox.ne.jp/links/imgs/bn88.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("celest.pobox.ne.jp"),tags:"after"},
		{domain:"*",replacements:["http://biomediaproject.com/bmp/files/gfx/BIONICLE Web Kit/Masks" + imgRef.substring(imgRef.lastIndexOf("/"))],condition:["akaku_black.gif","akaku_blue.gif","akaku_brown.gif","akaku_green.gif","akaku_red.gif","akaku_white.gif","hau_black.gif","hau_blue.gif","hau_brown.gif","hau_green.gif","hau_red.gif","hau_white.gif","huna_brickyellow.gif","huna_darkgrey.gif","huna_grey.gif","huna_mediumblue.gif","huna_orange.gif","huna_yellowgreen.gif","infected_kanohi_big.jpg","infected_kanohi_small.gif","kakama_black.gif","kakama_blue.gif","kakama_brown.gif","kakama_green.gif","kakama_red.gif","kakama_white.gif","kaukau_black.gif","kaukau_blue.gif","kaukau_brown.gif","kaukau_green.gif","kaukau_red.gif","kaukau_white.gif","komau_brickyellow.gif","komau_darkgrey.gif","komau_grey.gif","komau_mediumblue.gif","komau_orange.gif","komau_yellowgreen.gif","mahiki_brickyellow.gif","mahiki_darkgrey.gif","mahiki_grey.gif","mahiki_mediumblue.gif","mahiki_orange.gif","mahiki_yellowgreen.gif","matatu_brickyellow.gif","matatu_darkgrey.gif","matatu_grey.gif","matatu_mediumblue.gif","matatu_orange.gif","matatu_yellowgreen.gif","miru_black.gif","miru_blue.gif","miru_brown.gif","miru_green.gif","miru_red.gif","miru_white.gif","pakari_black.gif","pakari_blue.gif","pakari_brown.gif","pakari_green.gif","pakari_red.gif","pakari_white.gif","rau_brickyellow.gif","rau_darkgrey.gif","rau_grey.gif","rau_mediumblue.gif","rau_orange.gif","rau_yellowgreen.gif","ruru_brickyellow.gif","ruru_darkgrey.gif","ruru_grey.gif","ruru_mediumblue.gif","ruru_orange.gif","ruru_yellowgreen.gif"].some(elem => imgRef.includes(elem)),tags:"after"},
		{domain:"*",replacements:["http://biomediaproject.com/bmp/files/gfx/BIONICLE%20Web%20Kit/Toa" + imgRef.substring(imgRef.lastIndexOf("/"))],condition:["gali_big.gif","Gali_big.jpg","gali_face.jpg","gali_face_transp.gif","gali_small.gif","Gali_small.jpg","kopaka_big.gif","Kopaka_big.jpg","kopaka_face.jpg","kopaka_face_transp.gif","kopaka_small.gif","Kopaka_small.jpg","lewa_big.gif","Lewa_big.jpg","lewa_face.jpg","lewa_face_transp.gif","lewa_small.gif","Lewa_small.jpg","onua_big.gif","Onua_big.jpg","onua_face.jpg","onua_face_transp.gif","onua_small.gif","Onua_small.jpg","pohatu_big.gif","Pohatu_big.jpg","pohatu_face.jpg","pohatu_face_transp.gif","pohatu_small.gif","Pohatu_small.jpg","tahu_big.gif","Tahu_big.jpg","tahu_face.jpg","tahu_face_transp.gif","tahu_small.gif","Tahu_small.jpg"].some(elem => imgRef.includes(elem)),tags:"after"},
		{domain:"*",replacements:["http://blue.sakura.ne.jp/~real/images/bana/s-01.gif","http://blue.sakura.ne.jp/~real/images/bana/s-02.gif","http://blue.sakura.ne.jp/~real/images/bana/s-03.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("http://blue.sakura.ne.jp/~real"),tags:"after,random"},
		{domain:"*",replacements:["http://www5.kiwi-us.com/~l-leaf/banners.gif","http://www5.kiwi-us.com/~l-leaf/banner01s.jpg","http://www5.kiwi-us.com/~l-leaf/banner02s.gif","http://www5.kiwi-us.com/~l-leaf/banner04s.gif","http://www5.kiwi-us.com/~l-leaf/banner06s.jpg","http://www5.kiwi-us.com/~l-leaf/banner07s.gif","http://www5.kiwi-us.com/~l-leaf/banner08s.jpg","http://www5.kiwi-us.com/~l-leaf/banner09s.gif","http://www5.kiwi-us.com/~l-leaf/banner10s.jpg","http://www5.kiwi-us.com/~l-leaf/banner11s.gif","http://www5.kiwi-us.com/~l-leaf/banner12s.jpg","http://www5.kiwi-us.com/~l-leaf/banner13s.gif","http://www5.kiwi-us.com/~l-leaf/banner14s.jpg","http://www5.kiwi-us.com/~l-leaf/banner15s.gif","http://www5.kiwi-us.com/~l-leaf/banner16s.gif","http://www5.kiwi-us.com/~l-leaf/banner17s.gif","http://www5.kiwi-us.com/~l-leaf/banner19s.gif","http://www5.kiwi-us.com/~l-leaf/banner34s.gif","http://www5.kiwi-us.com/~l-leaf/banner35s.gif","http://www5.kiwi-us.com/~l-leaf/banner36s.gif","http://www5.kiwi-us.com/~l-leaf/banner38s.gif","http://www5.kiwi-us.com/~l-leaf/banner41s.gif","http://www5.kiwi-us.com/~l-leaf/banner44s.gif","http://www5.kiwi-us.com/~l-leaf/banner00s.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("http://www5.kiwi-us.com/~l-leaf"),tags:"after,random"},
		{domain:"*",replacements:["http://www.sea-links.ne.jp/banner/minicon.gif","http://www.sea-links.ne.jp/banner/static/minicon_miu1.gif","http://www.sea-links.ne.jp/banner/static/minicon_miu2.gif","http://www.sea-links.ne.jp/banner/static/minicon_miu3.gif","http://www.sea-links.ne.jp/banner/static/minicon_miu4.gif","http://www.sea-links.ne.jp/banner/static/minicon_miu5.gif","http://www.sea-links.ne.jp/banner/static/minicon.gif","http://www.sea-links.ne.jp/banner/static/minicon2.gif","http://www.sea-links.ne.jp/banner/static/boy_s.jpg","http://www.sea-links.ne.jp/banner/prince/minicon.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("www.sea-links.ne.jp"),tags:"after,random"},
		{domain:"*",replacements:["http://www.interq.or.jp/red/pocky/cg2/bnavi001s.gif","http://www.interq.or.jp/red/pocky/cg2/bnavi003s.jpg","http://www.interq.or.jp/red/pocky/cg2/bnavi004s.gif","http://www.interq.or.jp/red/pocky/cg2/bnavi007s.jpg","http://www.interq.or.jp/red/pocky/cg2/bnavi008s.jpg","http://www.interq.or.jp/red/pocky/cg2/bnavi009s.jpg","http://www.interq.or.jp/red/pocky/cg2/bnavi010s.gif","http://www.interq.or.jp/red/pocky/cg2/bnavi011s.jpg","http://www.interq.or.jp/red/pocky/cg2/bnavi012s.gif","http://www.interq.or.jp/red/pocky/cg2/bnavi013s.gif","http://www.interq.or.jp/red/pocky/cg2/bnavi014s.gif","http://www.interq.or.jp/red/pocky/cg2/bnavi016s.jpg","http://www.interq.or.jp/red/pocky/cg2/bnavi017s.gif","http://www.interq.or.jp/red/pocky/cg2/bnavi018s.jpg","http://www.interq.or.jp/red/pocky/cg2/bnavi019s.gif","http://www.interq.or.jp/red/pocky/cg2/bnavi020s.gif","http://www.interq.or.jp/red/pocky/cg2/bnavi022s.gif","http://www.interq.or.jp/red/pocky/cg2/bnavi024s.gif","http://www.interq.or.jp/red/pocky/cg2/bnavi02s.gif","http://www.interq.or.jp/red/pocky/cg2/bnavi04s.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("www.interq.or.jp/red/pocky"),tags:"after,random"},
		{domain:"*",replacements:["http://tinami.com/banner/s01.gif","http://tinami.com/banner/s02.gif","http://tinami.com/banner/s03.gif","http://tinami.com/banner/s04.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("tinami.com"),tags:"after,random"},
		{domain:"*",replacements:["http://home.puni.to/net/8831.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("puni.to"),tags:"after"},
		{domain:"*",replacements:["http://closedsky.com/graphic/meguribs.jpg","http://www.meguri.net/banner/maya.jpg","http://meguri.net/banner/meguri-mini1.gif","http://meguri.net/banner/meguri-mini3.gif","http://www.meguri.net/banner/meguri-mini5.gif","http://meguri.net/banner/meguri-mini7.jpg"],condition:pic.width == 88 && pic.height == 31 && linksTo("meguri.net"),tags:"after,random"},
		{domain:"*",replacements:["http://www.multiez.com/multi/banner/ban2_s.gif","http://www.multiez.com:80/banner/multi_br02.gif","http://www.multiez.com/multi/banner/multi_br04.gif","http://www.multiez.com/multi/banner/multi_br06.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("multiez.com"),tags:"after,random"},
		{domain:"*",replacements:["http://www.apache.org/icons" + imgRef.substring(imgRef.lastIndexOf("/"))],condition:document.body.textContent.includes("Apache/"),tags:"after"},
		{domain:"*",replacements:["http://www.amaterasu.jp/banner/mini_banner.gif","http://www.amaterasu.jp/banner/mini_banner20.gif","http://mimina.sakura.ne.jp/amaterasu/banner/mini_banner21.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("amaterasu.jp"),tags:"after,random"},
		{domain:"*",replacements:["http://www.lovehina.to/~hina/8831naru.jpg","http://www.lovehina.to/~hina/8831shinobu.jpg","http://www.lovehina.to/~hina/8831motoko.jpg"],condition:pic.width == 88 && pic.height == 31 && linksTo("lovehina.to/~hina"),tags:"after,random"},
		{domain:"*",replacements:["http://www4.nasuinfo.or.jp/~kouichi/Link/buaner1.9.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("nasuinfo.or.jp/~kouichi"),tags:"after"},
		{domain:"*",replacements:["http://itarunsearch.com/img/banner/itarun001_mini.jpg","http://itarunsearch.com/img/banner/itarun002_mini.jpg","http://itarunsearch.com/img/banner/itarun006_mini.jpg","http://itarunsearch.com/img/banner/itarun_c_mini.jpg","http://itarunsearch.com/img/banner/itarun_mii_mini.jpg"],condition:pic.width == 88 && pic.height == 31 && linksTo("itarunsearch.com"),tags:"after,random"},
		{domain:"*",replacements:["http://foxhunt.cx/tallyho0.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("foxhunt.cx/tallyho"),tags:"after"},
		{domain:"*",replacements:["http://earth.endless.ne.jp/users/hibiki/banan.jpg","http://earth.endless.ne.jp/users/hibiki/ban1.jpg","http://earth.endless.ne.jp/users/hibiki/banan1.jpg"],condition:pic.width == 88 && pic.height == 31 && linksTo("earth.endless.ne.jp/users/hibiki"),tags:"after,random"},
		{domain:"*",replacements:["http://www.st-argo.co.jp/animap/banner/animap03.gif","http://www.st-argo.co.jp/animap/banner/animap04.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("st-argo.co.jp/animap"),tags:"after,random"},
		{domain:"*",replacements:["http://www95.sakura.ne.jp/~b-search/bn/mini.gif","http://www95.sakura.ne.jp/~b-search/bn/mini_01.gif","http://www95.sakura.ne.jp/~b-search/bn/mini_02.jpg"],condition:pic.width == 88 && pic.height == 31 && linksTo("www95.sakura.ne.jp/~b-search"),tags:"after,random"},
		{domain:"*",replacements:["http://www.auxo.org/kaleidoscope/image/kaleidobana2.jpg","http://www.auxo.org/kaleidoscope/image/kaleidobana2.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("auxo.org/kaleidoscope"),tags:"after,random"},
		{domain:"*",replacements:["http://sispulink.g-com.ne.jp/bn/sisterlink_m.jpg"],condition:pic.width == 88 && pic.height == 31 && linksTo("sispulink.g-com.ne.jp"),tags:"after"},
		{domain:"*",replacements:["http://www2.ocn.ne.jp/~all8324/bana_top/01_88.jpg","http://www2.ocn.ne.jp/~all8324/bana_/88_02.jpg","http://www2.ocn.ne.jp/~all8324/bana_/88_03.gif","http://www2.ocn.ne.jp/~all8324/bana_/88_04.jpg","http://www2.ocn.ne.jp/~all8324/bana_/88_05.gif","http://www2.ocn.ne.jp/~all8324/bana_/88_06.JPG","http://www2.ocn.ne.jp/~all8324/bana_/88_07.jpg"],condition:pic.width == 88 && pic.height == 31 && linksTo("www2.ocn.ne.jp/~all8324"),tags:"after,random"},
		{domain:"*",replacements:["http://orange.webdos.net/~irasuto/hina/bana88_01.gif","http://orange.webdos.net/~irasuto/bana_/09-88_31.jpg","http://orange.webdos.net/~irasuto/bana_/01-88_31.gif","http://orange.webdos.net/~irasuto/bana_/02-88_31.gif","http://orange.webdos.net/~irasuto/bana_/03-88_31.gif","http://orange.webdos.net/~irasuto/bana_/04-88_31.gif","http://orange.webdos.net/~irasuto/bana_/05-88_31.gif","http://orange.webdos.net/~irasuto/bana_/06-88_31.gif","http://orange.webdos.net/~irasuto/bana_/07-88_31.jpg","http://orange.webdos.net/~irasuto/bana_/08-88_31.gif","http://orange.webdos.net/~irasuto/bana_/10-88_31.jpg","http://orange.webdos.net/~irasuto/bana_2/12_88.jpg","http://orange.webdos.net/~irasuto/bana_2/13_88.jpg","http://orange.webdos.net/~irasuto/bana_2/14_88.gif","http://orange.webdos.net/~irasuto/bana_2/15_88.GIF","http://orange.webdos.net/~irasuto/bana_2/16_88.JPG"],condition:pic.width == 88 && pic.height == 31 && linksTo("orange.webdos.net/~irasuto"),tags:"after,random"},
		{domain:"*",replacements:["http://wn.31rsm.ne.jp/~anikomi/anibana2.gif","http://wn.31rsm.ne.jp/~anikomi/anikomi-mini.gif","http://wn.31rsm.ne.jp/~anikomi/ani_m.jpg","http://wn.31rsm.ne.jp/~anikomi/anikomi88bana.jpg","http://wn.31rsm.ne.jp/~anikomi/bn-s..gif","http://wn.31rsm.ne.jp/~anikomi/anikomi_b2.gif","http://wn.31rsm.ne.jp/~anikomi/banner2.jpg"],condition:pic.width == 88 && pic.height == 31 && linksTo("wn.31rsm.ne.jp/~anikomi"),tags:"after,random"},
		{domain:"*",replacements:["http://wataru66.ktplan.ne.jp/jpg/fullmediabanar_1.gif","http://wataru66.ktplan.ne.jp/jpg/fms09.gif","http://wataru66.ktplan.ne.jp/jpg/fms10.gif","http://wataru66.ktplan.ne.jp/jpg/fms_88_31.gif","http://wataru66.ktplan.ne.jp/jpg/illust/fms11b.jpg","http://wataru66.ktplan.ne.jp/jpg/illust/fms12b.jpg","http://wataru66.ktplan.ne.jp/jpg/illust/fms13b.gif","http://wataru66.ktplan.ne.jp/jpg/illust/fms14b.jpg","http://wataru66.ktplan.ne.jp/jpg/illust/fms15b.gif","http://wataru66.ktplan.ne.jp/jpg/illust/fms16b.jpg","http://wataru66.ktplan.ne.jp/jpg/illust/fms17b.gif","http://wataru66.ktplan.ne.jp/jpg/illust/fms21b.jpg","http://wataru66.ktplan.ne.jp/jpg/illust/fms22b.gif","http://wataru66.ktplan.ne.jp/jpg/illust/fms23b.jpg","http://wataru66.ktplan.ne.jp/jpg/illust/fms25b.jpg"],condition:pic.width == 88 && pic.height == 31 && linksTo("wataru66.ktplan.ne.jp"),tags:"after,random"},
		{domain:"*",replacements:["http://www.silver-forest.com/bh-search/g/88-31.gif","http://www.silver-forest.com/bh-search/g/88-31a.gif","http://www.silver-forest.com/bh-search/g/88-31b.gif","http://www.silver-forest.com/bh-search/g/88-31c.gif","http://www.silver-forest.com/bh-search/g/88-31e.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("silver-forest.com"),tags:"after,random"},
		{domain:"*",replacements:["http://www.k-books.co.jp/k-books.gif"],condition:pic.width == 200 && pic.height == 40 && linksTo("k-books.co.jp"),tags:"after"},
		{domain:"*",replacements:["http://www2m.biglobe.ne.jp/~msdos/ban_cgps.png"],condition:pic.width == 88 && pic.height == 31 && (linksTo("prettycg.com") || linksTo("www2m.biglobe.ne.jp/~msdos")),tags:"after"},
		{domain:"*",replacements:["http://www.oisan.jp/bana/ban105.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("oisan.jp/search"),tags:"after"},
		{domain:"*",replacements:["http://moechara.com/moemoe/mmsbm.png"],condition:pic.width == 88 && pic.height == 31 && (linksTo("moechara.com") || linksTo("character.moemoe.to")),tags:"after"},
		{domain:"*",replacements:["http://www.e-r1.com/image/e-r_banner/e-r_mini2.jpg"],condition:pic.width == 88 && pic.height == 31 && linksTo("e-r1.com"),tags:"after"},
		{domain:"*",replacements:["http://gamemichi.com/image/g_ban88_31.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("gamemichi.com"),tags:"after"},
		{domain:"*",replacements:["http://www.toranoana.jp/icon/tora_bn.gif"],condition:pic.width == 200 && pic.height == 40 && linksTo("toranoana.jp"),tags:"after"},
		{domain:"*",replacements:["http://www.dgsearch.com/image/bana88.gif"],condition:pic.width == 88 && pic.height == 31 && linksTo("dgsearch.com"),tags:"after"},
		{domain:"*",replacements:["http://www2.melonbooks.co.jp/img/banner.gif","http://www2.melonbooks.co.jp/img/banner2.gif","http://www2.melonbooks.co.jp/img/banner3.gif","http://www2.melonbooks.co.jp/img/banner4.gif"],condition:pic.width == 200 && pic.height == 40 && linksTo("shop.melonbooks.co.jp"),tags:"after,random"},
		{domain:"questarian.com",replacements:[imgRef.replace(/im\d+\//i,"images/")],tags:"after"}];
	var tagScan = ["before","between","after"];
	for(var t = 0; t < 3; t++)
	{
		if(t == 1) filteredCases.replacements = filteredCases.replacements.concat(imgRef);
		else
		{
			for(var c = 0; c < specialCases.length; c++)
			{
				var additionalCondition = specialCases[c].condition !== undefined ? specialCases[c].condition : true;
				if((imgRef.includes(specialCases[c].domain) || specialCases[c].domain == "*") && additionalCondition && specialCases[c].tags.includes(tagScan[t]))
				{
					if(specialCases[c].tags.includes("random")) filteredCases.replacements = filteredCases.replacements.concat(specialCases[c].replacements[Math.floor(Math.random() * specialCases[c].replacements.length)]);
					else filteredCases.replacements = filteredCases.replacements.concat(specialCases[c].replacements);
					if(specialCases[c].maxDimensions) filteredCases.maxDimensions = specialCases[c].maxDimensions;
				}
			}
		}
	}
	return filteredCases;

	function linksTo(url)
	{
		return pic.parentNode.nodeName == "A" && pic.parentNode.href && decodeURI(pic.parentNode.href).includes(url);
	}
}

var timestamp = /web\/(\d{1,14})/.exec(window.location.href)[1];

function testURL(url)
{
	var promise = new Promise(function(resolve,reject) {
		GM_xmlhttpRequest({
			url: url,
			method: "HEAD",
			onload: function(response) {
				resolve(response);
			}
		});
	});
	return promise;
}

function promiseFirst(array, condition)
{
	return Promise.all(array).then(value => value.find(condition));
}

function replaceImage(target, altURLs)
{
	var possibleUses = specialUses(target);
	var URLGuesses = [];
	if(altURLs && altURLs.length > 0) URLGuesses = altURLs;
	else if(possibleUses.replacements.length > 0) URLGuesses = possibleUses.replacements;
	else URLGuesses = [referenceURL(target)];

	var testSet = [];

	for(var p = 0; p < URLGuesses.length; p++)
	{
		if(!URLGuesses[p]) testSet[p] = Promise.resolve(null);
		else if(URLGuesses[p].includes("http")) testSet[p] = APITest(URLGuesses[p]);
		else if(URLGuesses[p].startsWith("data:"))
		{
			testSet[p] = Promise.resolve(URLGuesses[p]);
			break;
		}
	}

	promiseFirst(testSet,result => result != null).then(function(result) {
		var similarPics = allPics.filter(pic => referenceURL(target) == referenceURL(pic));
		for(var s = 0; s < similarPics.length; s++)
		{
			if(result !== undefined)
			{
				substitutionTable[referenceURL(target).replace(":80","")] = result;
				if(possibleUses.maxDimensions) switchWithResize(result, similarPics[s], possibleUses.maxDimensions.width, possibleUses.maxDimensions.height);
				else changeImage(result, similarPics[s]);
			}
			//Try and "expose" image links that are unclickable due to the image not loading
			else if(similarPics[s].alt === "" && similarPics[s].width === 0 && similarPics[s].parentNode.nodeName === "A" && similarPics[s].src)
			{
				similarPics[s].width = 24;
				similarPics[s].height = 24;
				//"Changing" the source is pretty hacky, but it's the only way I can think of to turn "invisible" image links into something clickable
				similarPics[s].src = similarPics[s].src;
			}
		}
		return;
	});

	function APITest(replacement)
	{
		var subPromise = new Promise(function(resolve,reject) {
			var originalURL = replacement.substring(replacement.indexOf("/http") + 1);

			APIReq(originalURL,timestamp).then(function(response)
			{
				if(response.archived_snapshots.closest !== undefined)
				{
					//Evidently an additional layer of examination is needed to make absolutely sure we have an actual image
					processResult(response.archived_snapshots.closest.url);
				}
				else
				{
					//Sometimes an API result will turn up blank unless the timestamp parameter were removed
					APIReq(originalURL).then(function(secondResponse)
					{
						if(secondResponse.archived_snapshots.closest !== undefined)
						{
							//Evidently an additional layer of examination is needed to make absolutely sure we have an actual image
							processResult(secondResponse.archived_snapshots.closest.url);
						}
						else resolve(null);
					})
				}
			})

			function processResult(url)
			{
				testURL(url.replace("/http","im_/http")).then(function(secondResp) {
					if(!secondResp.responseHeaders.toLowerCase().includes("content-type: text/html")) resolve(secondResp.finalUrl);
					else return testURL("/web/1im_/" + originalURL).then(function(lastResort) {
						if(!lastResort.responseHeaders.toLowerCase().includes("content-type: text/html")) resolve(lastResort.finalUrl);
						else resolve(null);
					});
				})
			}

		}).catch(function(e) { console.log(e); });
		return subPromise;

		function APIReq(startingURL,timestamp)
		{
			var compiledURL = "http://archive.org/wayback/available?url=" + encodeURIComponent(startingURL);
			if(timestamp) compiledURL += "&timestamp=" + timestamp;

			return new Promise(function(resolve,reject) {
				GM_xmlhttpRequest({
					url: compiledURL,
					method: "GET",
					responseType: "json",
					headers: {"Accept": "application/json"},
					onload: function(response) {
						if(response.status == 503) resolve(APIReq(startingURL,timestamp));
						else resolve(response.response);
					}
				});
			})
		}
	}

	function switchWithResize(url, target, width, height)
	{
		var oldDimensions = {width:width, height: height};
		changeImage(url, target);
		target.onload = function() {
			var aspectRatio = target.naturalWidth / target.naturalHeight;
			if(target.naturalWidth >= target.naturalHeight)
			{
				target.width = oldDimensions.width;
				target.height = oldDimensions.width / aspectRatio;
			}
			else if(target.naturalWidth <= target.naturalHeight)
			{
				target.height = oldDimensions.height;
				target.width = oldDimensions.height * aspectRatio;
			}
		};
	}
}

function changeImage(url, target)
{
	if(!url.includes("im_")) url = url.replace("/http","im_/http");
	url = url.replace("http://web.archive.org","");
	if(target.src) target.src = url;
	else if(target.background) target.background = url;
	else if(window.getComputedStyle(target).backgroundImage != "none") target.style.backgroundImage = window.getComputedStyle(target).backgroundImage.replace(/(url\().+(\))/,"$1" + url + "$2");
}

function referenceURL(target)
{
	if(target._wm_src) return target._wm_src;
	else if(target.src) return target.src;
	else if(window.getComputedStyle(target).backgroundImage != "none") return window.getComputedStyle(target).backgroundImage.slice(5,-2);
}

function evaluateImage(pic)
{
	var imgRef = referenceURL(pic);

	if(substitutionTable.hasOwnProperty(imgRef))
	{
		pic.src = substitutionTable[imgRef];
		return;
	}

	if(testedURLs.indexOf(imgRef) > -1) return;

	testedURLs.push(imgRef);

	GM_xmlhttpRequest({
		url: imgRef,
		method: "GET",
		onload: function(response) {
			//Going off of response code is unreliable. Sometimes an image will return a status code of 200 even though it would redirect to an error page should you view the image directly, so we're looking at content type instead
			if(response.responseHeaders.toLowerCase().includes("content-type: text/html") || response.responseHeaders.toLowerCase().includes("content-type: text/plain") || (response.responseText && response.responseText.toUpperCase().includes("<BODY>")))
			{
				//This might be a case where if you were visit the image directly, you would be redirected elsewhere. This attempts to catch that and replace the pic's src with where it would take you.
				var doc = new DOMParser().parseFromString(response.responseText,"text/html");
				if(doc.querySelector(".impatient") && !doc.querySelector(".impatient").firstChild.href.includes("tripod.com/adm/interstitial/remote.jpg"))
				{
					testURL(doc.querySelector(".impatient").firstChild.href).then(function(response) {
						if(!response.responseHeaders.toLowerCase().includes("content-type: text/html"))
						{
							replaceImage(pic,[response.finalUrl]);
						}
						else
						{
							replaceImage(pic);
						}
					});
				}
				else
				{
					replaceImage(pic);
				}
			}
		},
		onerror: function() {
			replaceImage(pic);
		}
	});
}

for(var i = 0; i < pics.length; i++)
{
	//Skip over stuff related to the Wayback Machine toolbar and data URIs
	if((document.getElementById("wm-ipp") && document.getElementById("wm-ipp").contains(pics[i])) || pics[i].src.includes("data:")) continue;
	if(pics[i].src.startsWith("ttp://")) pics[i].src = "/web/" + timestamp + "/h" + pics[i].src;
	if(pics[i].complete && pics[i].naturalWidth == 0) evaluateImage(pics[i]);
	pics[i].addEventListener("error", function(e) { evaluateImage(e.target); }, true);
}

for(var e = 0; e < embeds.length; e++)
{
	evaluateImage(embeds[e]);
}

for(var b = 0; b < backgrounds.length; b++)
{
	if(document.getElementById("wm-ipp") && document.getElementById("wm-ipp").contains(backgrounds[b])) continue;
	if(window.getComputedStyle(backgrounds[b]).backgroundImage == "none") continue;
	evaluateImage(backgrounds[b]);
}