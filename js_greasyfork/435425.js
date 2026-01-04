// ==UserScript==
// @name       Nchyn's re size image
// @name:zh-CN 显示常用网站高清无水印
// @version    0.8.0
// @description  Support: Google(G+ blogspot YouTube)\Tumblr\Twitter\Steam(Only user content)\ArtStation\Pinimg\Weibo (And more...
// @description:zh-CN 支持：谷歌(G+ blogspot YouTube)、Tumblr、推特、Steam、新浪微博、知乎、豆瓣、百度贴吧、淘宝（天猫）、ArtStation、Pinimg 等
// @run-at     document-start
// @grant      GM_xmlhttpRequest
// @grant      GM_download
// @match      http://*.googleusercontent.com/*
// @match      https://*.googleusercontent.com/*
// @match      http://*.media.tumblr.com/*
// @match      https://*.media.tumblr.com/*
// @match      http://secure.static.tumblr.com/*
// @match      https://secure.static.tumblr.com/*
// @match      http://*.bp.blogspot.com/*
// @match      https://*.bp.blogspot.com/*
// @match      http://*.sinaimg.cn/*
// @match      https://*.sinaimg.cn/*
// @match      http://*.sinaimg.com/*
// @match      https://*.sinaimg.com/*
// @match      http://*.twimg.com/*
// @match      https://*.twimg.com/*
// @match      http://*.zhimg.com/*
// @match      https://*.zhimg.com/*
// @match      http://*.douban.com/view/*
// @match      https://*.douban.com/view/*
// @match      http://*.doubanio.com/view/*
// @match      https://*.doubanio.com/view/*
// @exclude    https://*.douban.com/view/ark_article_cover/*
// @exclude    https://*.doubanio.com/view/ark_article_cover/*
// @match      http://imgsrc.baidu.com/*
// @match      https://imgsrc.baidu.com/*
// @match      http://imgsa.baidu.com/*
// @match      https://imgsa.baidu.com/*
// @match      http://*.hiphotos.baidu.com/*
// @match      https://*.hiphotos.baidu.com/*
// @match      http://*.bdimg.com/*
// @match      https://*.bdimg.com/*
// @match      http://images.akamai.steamusercontent.com/*
// @match      https://images.akamai.steamusercontent.com/*
// @match      http://steamuserimages-a.akamaihd.net/*
// @match      https://steamuserimages-a.akamaihd.net/*
// @match      http://*.artstation.com/*
// @match      https://*.artstation.com/*
// @match      http://i.ytimg.com/*
// @match      https://i.ytimg.com/*
// @match      http://*.ggpht.com/*
// @match      https://*.ggpht.com/*
// @match      http://*.pinimg.com/*
// @match      https://*.pinimg.com/*
// @match      http://*.hdslb.com/*
// @match      https://*.hdslb.com/*
// @match      http://*.alicdn.com/*
// @match      https://*.alicdn.com/*
// @match      https://*.360buyimg.com/*
// @match      https://*.zzzdm.com/*
// @match      https://*.c-ctrip.com/*
// @match      https://*.huaban.com/*
// @match      https://image.suning.cn/*
// @match      http://image.suning.cn/*
// @match      https://imgservice.suning.cn/*
// @match      https://img.kwcdn.com/*
// @match      https://i.ebayimg.com/*
// @match      https://i.etsystatic.com/*
// @match      https://gd-filems.dancf.com/*
// @namespace https://greasyfork.org/zh-CN/users/152535-chyn-n
// @contributionURL http://clso.tk/donate/
// @contributionAmount 6.66
// @copyright  2022, Nchyn
// @downloadURL https://update.greasyfork.org/scripts/435425/Nchyn%27s%20re%20size%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/435425/Nchyn%27s%20re%20size%20image.meta.js
// ==/UserScript==

var url = document.location.toString();
var m = null;

function getQueryParams(qs) {
    //by http://stackoverflow.com/a/1099670
    qs = qs.split('+').join(' ');
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while ((tokens = re.exec(qs))) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params;
}

//google
if( (m = url.match(/^(https?:\/\/lh\d+\.googleusercontent\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i)) ) {
	if(m[2] != "s0") {
		document.location = m[1] + "s0" + m[3];
	}
}
else if( (m = url.match(/^(https?:\/\/lh\d+\.googleusercontent\.com\/.+=)(.+)(?:\?.+)?$/i)) ) {
	if(m[2] != "s0") {
		document.location = m[1] + "s0";
	}
}
else if( (m = url.match(/^(https?:\/\/\w+\.ggpht\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i)) ) {
	if(m[2] != "s0") {
		document.location = m[1] + "s0" + m[3];
	}
}

//blogspot
else if( (m = url.match(/^(https?:\/\/\w+\.bp\.blogspot\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i)) ) {
	if(m[2] != "s0") {
		document.location = m[1] + "s0" + m[3];
	}
}

//youtube
else if( (m = url.match(/^https?:\/\/i\.ytimg.com\/an_webp\/([^\/]+)\/\w+\.(jpg|jpeg|gif|png|bmp|webp)(\?.+)?$/i)) ) {
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange=function() {
		if(ajax.status==200) {
			document.location = "https://i.ytimg.com/vi/" + m[1] + "/maxresdefault.jpg";
		}else if(ajax.status==404) {
			document.location = "https://i.ytimg.com/vi/" + m[1] + "/hqdefault.jpg";
		}
	};
	ajax.open("HEAD", "https://i.ytimg.com/vi/" + m[1] + "/maxresdefault.jpg", true);
	ajax.send();
}
else if( (m = url.match(/^(https?:\/\/i\.ytimg.com\/vi\/[^\/]+\/)(\w+)(\.(jpg|jpeg|gif|png|bmp|webp))(\?.+)?$/i)) ) {
	if(m[2] != "maxresdefault") {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange=function() {
			if(ajax.status==200) {
				document.location = m[1] + "maxresdefault" + m[3];
			}else if(ajax.status==404) {
				if(m[5] || m[2] === "mqdefault")
					document.location = m[1] + "hqdefault" + m[3];
			}
		};
		ajax.open("HEAD", m[1] + "maxresdefault" + m[3], true);
		ajax.send();
	}
}
else if( (m = url.match(/^(https?:\/\/\w+\.ggpht\.com\/.+)=(?:[s|w|h])(\d+)(.+)?$/i)) ) {
	if( m[2]!="0" ){
		document.location = m[1] + "=s0";
	}
}

//tumblr disabled raw images now :(
else if( (m = url.match(/^(https?:\/\/\d+\.media\.tumblr\.com\/.*tumblr_\w+_)(\d+)(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i)) ) {
	if(m[2]<1280) {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange=function() {
			if(ajax.status==200) {
				document.location = m[1] + "1280" + m[3];
			}
		};
		ajax.open("HEAD", m[1]+"1280"+m[3], true);
		ajax.send();
	}
}

//twitter
else if( (m = url.match(/^(https?:\/\/\w+\.twimg\.com\/media\/[^\/:]+)\.(jpg|jpeg|gif|png|bmp|webp)(:\w+)?$/i)) ) {
	var format = m[2]; if(m[2]=="jpeg") format = "jpg";
	document.location = m[1] + "?format=" + format + "&name=orig";
}
else if( (m = url.match(/^(https?:\/\/\w+\.twimg\.com\/.+)(\?.+)$/i)) ) {
	var pars = getQueryParams(document.location.search);
	if(!pars.format || !pars.name) return;
	if(pars.name == "orig") return;
	document.location = m[1] + "?format=" + pars.format + "&name=orig";
}

//Steam (Only user content)
else if( (m = url.match(/^(https?:\/\/(images\.akamai\.steamusercontent\.com|steamuserimages-a\.akamaihd\.net)\/[^\?]+)\?.+$/i)) ){
	document.location = m[1];
}

//性浪微博
else if( (m = url.match(/^(https?:\/\/(?:(?:ww|wx|ws|tvax|tva)\d+|wxt|wt)\.sinaimg\.(?:cn|com)\/)([\w\.]+)(\/.+)(?:\?.+)?$/i)) ) {
	if(m[2] != "large") {
		document.location = m[1] + "large" + m[3];
	}
}

//zhihu
else if( (m = url.match(/^(https?:\/\/.+\.zhimg\.com\/)(?:\d+\/)?([\w\-]+_)(\w+)(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i)) ){
	if(m[3]!="r") {
		document.location = m[1] + m[2] + "r" + m[4];
	}
}

//douban NEED TEST
else if( (m = url.match(/^(https?:\/\/\w+\.douban(?:io)?\.com\/view\/.+\/)(\w+)(\/public\/.+\.)(jpg|jpeg|gif|png|bmp|webp)(?:\?.+)?$/i)) ){
    if( m[2] != "raw") {
        document.location = m[1] + "raw" + m[3] + "jpg"
    }
}


//artstation
else if( (m = url.match(/^(https?:\/\/cdn\w+\.artstation\.com\/.+\/)(\d{4,}\/)(\w+)(\/[^\/]+)$/i)) ){
	if(m[3] != "original"){
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange=function() {
			if(ajax.status==200) {
				document.location = m[1] + "original" + m[4];
			}else if(ajax.status==404) {
				if(m[3] != "large"){
					document.location = m[1] + "large" + m[4];
				}
			}
		};
		ajax.open("HEAD", m[1]+"original"+m[3], true);
		ajax.send();
	}
}
else if( (m = url.match(/^(https?:\/\/cdn\w+\.artstation\.com\/.+\/)(\w+)(\/[^\/]+)$/i)) ){
	//if(m[2] != "original") {
	//	document.location = m[1] + "original" + m[3];
	//}
	if(m[2] != "original"){
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange=function() {
			if(ajax.status==200) {
				document.location = m[1] + "original" + m[3];
			}else if(ajax.status==404) {
				if(m[2] != "large"){
					document.location = m[1] + "large" + m[3];
				}
			}
		};
		ajax.open("HEAD", m[1]+"original"+m[3], true);
		ajax.send();
	}
}

//pinimg
else if( (m = url.match(/^(https?:\/\/i\.pinimg\.com\/)(\w+)(\/.+)$/i)) ){
	if(m[2] != "originals") {
		document.location = m[1] + "originals" + m[3];
	}
}
else if( (m = url.match(/^(https?:\/\/s-media[\w-]+\.pinimg\.com\/)(\w+)(\/.+)$/i)) ){ //need delete?
	if(m[2] != "originals") {
		document.location = m[1] + "originals" + m[3];
	}
}

//bilibili
else if( (m = url.match(/^(https?:\/\/\w+\.hdslb\.com\/.+\.(jpg|jpeg|gif|png|bmp|webp))(@|_).+$/i)) ) {
	document.location = m[1];
}

//taobao(tmall)
else if( (m = url.match(/^(https?:\/\/(?:img|gma|gw)\.alicdn\.com\/.*?(jpg|jpeg|gif|png|bmp).*_\.webp)/i)) ) {
	document.location = m[0].replace(/(\.jpg.*jpg.*)/, ".jpg");
}
//旧taobao(tmall)
else if( (m = url.match(/^(https?:\/\/(?:img|gma)\.alicdn\.com\/.+\.(jpg|jpeg|gif|png|bmp|webp))_.+$/i)) ) {
	document.location = m[1];
}

//jd
else if( (m = url.match(/^(https?:\/\/.+\.360buyimg\.com.*)(\/n.\/)(.*jpg|.*png)/i)) ){
	document.location = m[0].replace(/(\/n.\/)(.*jfs\/)/, "/n12/jfs/");
}

//zzzdm
else if( (m = url.match(/^(https?:\/\/.+\.zzzdm\.com.*)/i)) ){
	document.location = m[0].replace(/zzzdm\.com\/preview\?id=/, "smzdm.com/p/");
}
//ctrip
else if( (m = url.match(/^(https?:\/\/.+ctrip.com.*_.*(jpg|png))/i)) ){
    document.location = m[0].replace(/_.*/ , ".jpg")
}

//花瓣
else if( (m = url.match(/^(https?:\/\/.+huaban.com.*_fw.*)/i)) ){
    document.location = m[0].replace(/_.*/ , "")
}

//suning
else if ((m = url.match(/^(https?:\/\/image\.suning\.cn\/.*\/.*_100x100)(\.jpg|\.png|\.jpeg|\.gif)/i))) {
	document.location = m[0].replace(/(_100x100)/, '');
}

// suning商品图
else if (url.match(/^https?:\/\/imgservice\.suning\.cn\/uimg1\/b2c\/image\/.*\.(jpg|png).*$/i)) {
    const replacedUrl = url.replace(/\.(jpg|png).*$/, '.$1');
    if (replacedUrl !== url) {
        document.location = replacedUrl;
    }
}

//temu商品图
else if ((m = url.match(/^(https?:\/\/img\.kwcdn\.com\/.*?\/.*?)(\?.*|\/imageView2\/.*)/i))) {
    document.location = m[1];
}

//ebay商品图
else if ((m = url.match(/^(https?:\/\/i\.ebayimg\.com\/images\/.*?\/.*?-)(l(?!1600)\d+)(\.jpg)/i))) {
    document.location = m[1] + 'l1600' + m[3];
}

//etsy商品图
else if ((m = url.match(/^(https?:\/\/i\.etsystatic\.com\/.*600x600.*)/i))) {
    document.location = m[0].replace(/600x600/, '2000x2000');
}

//gaoding素材去参
else if ((m = url.match(/^(https?:\/\/gd-filems\.dancf\.com\/.*?\.png)\?.*/i))) {
    document.location = m[1]; // 删除png后的所有参数
}

//百度贴吧（然而对于画质提升什么的并没有什么卵用...）
else if( !(m = url.match(/^https?:\/\/imgsrc\.baidu\.com\/forum\/pic\/item\/.+/i)) ){
	if( (m = url.match(/^(https?):\/\/(?:imgsrc|imgsa|\w+\.hiphotos)\.(?:bdimg|baidu)\.com\/(?:forum|album)\/.+\/(\w+\.(?:jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i)) ){
		document.location = m[1] + "://imgsrc.baidu.com/forum/pic/item/" + m[2];
	}
}