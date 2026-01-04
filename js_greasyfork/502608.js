// ==UserScript==
// @name       Resize Image On "Open image in new tab" v2
// @name:zh-CN 右键在新标签中打开图片时显示最优化图像质量 v2
// @version    0.6.10
// @description  Support: Google(blogspot YouTube)\Tumblr\Twitter\Steam(Only user content)\ArtStation\Pinimg\Weibo\Reddit (And more...
// @description:zh-CN 支持：谷歌(blogspot YouTube)、Tumblr、推特、Steam、新浪微博、知乎、豆瓣、百度贴吧、淘宝（天猫）、ArtStation、Pinimg、Reddit 等
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
// @match      http://tiebapic.baidu.com/*
// @match      https://tiebapic.baidu.com/*
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
// @match      http://*.360buyimg.com/*
// @match      https://*.360buyimg.com/*
// @match      http://*.riotpixels.net/*
// @match      https://*.riotpixels.net/*
// @match      https://preview.redd.it/*
// @match      https://*.akamaized.net/imagecache/*
// @match      https://mmbiz.qpic.cn/*
// @namespace https://greasyfork.org/users/1345275
// @contributionURL https://blog.251.sh/aff-and-donate
// @contributionAmount 2.51
// @copyright  https://clso.fun/
// @copyright  https://251.sh/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502608/Resize%20Image%20On%20%22Open%20image%20in%20new%20tab%22%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/502608/Resize%20Image%20On%20%22Open%20image%20in%20new%20tab%22%20v2.meta.js
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
// 2024-08-04 New YouTube Design
else if( (m = url.match(/^(https?:\/\/yt\d+\.googleusercontent\.com\/.+?=)(w\d+-fcrop64=)(.+)$/i)) ) {
    if(m[2] && m[2].includes("w1707-fcrop64")) {
        m[2] = "w9999";
        document.location = m[1] + m[2];
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

//tumblr
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
    if (m[2] != "r" && m[2] != "raw" && m[2] != "r_ratio_poster" && m[2] != "l") {
        var FuckDB = function(url){
            var ajax = new XMLHttpRequest();
            ajax.open("HEAD", url, false);
            ajax.send();
            if(ajax.status==200){
                var imgfsize = Number( ajax.getResponseHeader("Content-Length") );
                if(imgfsize > 0) {
                    document.location = url;
                    return true;
                }
            }
            return false;
        };

        if( FuckDB(m[1]+"r"+m[3]+m[4]) ){}
        else if( FuckDB(m[1]+"raw"+m[3]+m[4]) ){}
        else if( FuckDB(m[1]+"r_ratio_poster"+m[3]+m[4]) ){}
        else if( FuckDB(m[1]+"l"+m[3]+m[4]) ){}
        else if( m[4]=="webp" ){
            m[4] = "jpg";
            if( FuckDB(m[1]+"r"+m[3]+m[4]) ){}
            else if( FuckDB(m[1]+"raw"+m[3]+m[4]) ){}
            else if( FuckDB(m[1]+"r_ratio_poster"+m[3]+m[4]) ){}
            else if( FuckDB(m[1]+"l"+m[3]+m[4]) ){}
        }
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
else if( (m = url.match(/^(https?:\/\/(?:.+?)\.alicdn\.com\/.+\.(jpg|jpeg|gif|png|bmp|webp))_.+$/i)) ) {
	document.location = m[1];
}

//jd
else if( (m = url.match(/^(https?:\/\/(?:img\d+)\.360buyimg\.com\/)((?:.+?)\/(?:.+?))(\/(?:.+?))(\!.+)?$/i)) ) {
    if( m[2] != "sku/jfs") {
        document.location = m[1]+"sku/jfs"+m[3];
    }
}

// https://s01.riotpixels.net/data/2a/b2/2ab23684-6cec-41da-9bce-f72c5264353a.jpg.240p.jpg
else if( (m = url.match(/^(https?:\/\/(?:.+?)\.riotpixels\.net\/.+\.(jpg|jpeg|gif|png|bmp|webp))\..+?$/i)) ) {
	document.location = m[1];
}

// reddit NEED TEST
else if( (m = url.match(/^https?:\/\/preview\.redd\.it\/(.+\.(jpg|jpeg|gif|png|bmp|webp))\?.+?$/i)) ) {
	document.location = "https://i.redd.it/"+m[1];
}

// akamaized.net/imagecache NEED TEST
else if( (m = url.match(/^(https:\/\/.+\.akamaized\.net\/imagecache\/\d+\/\d+\/\d+\/\d+\/)(\d+)(\/.+)$/i)) ) {
    if( m[2] < 1920) document.location = m[1]+"1920"+m[3];
}

// 微信公众号 by sbdx
else if((m=url.match(/^(https:\/\/mmbiz\.qpic\.cn\/mmbiz_jpg\/.+?\/)(\d+)(\?wx_fmt=jpeg)/i))) {
    if( m[2] != 0) document.location = m[1]+"0"+m[3];
}

//百度贴吧（然而对于画质提升什么的并没有什么卵用...）
else if( !(m = url.match(/^https?:\/\/imgsrc\.baidu\.com\/forum\/pic\/item\/.+/i)) ){
	if( (m = url.match(/^(https?):\/\/(?:imgsrc|imgsa|\w+\.hiphotos)\.(?:bdimg|baidu)\.com\/(?:forum|album)\/.+\/(\w+\.(?:jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i)) ){
		document.location = m[1] + "://imgsrc.baidu.com/forum/pic/item/" + m[2];
	}
    //if( (m = url.match(/^(https?)(:\/\/(?:imgsrc|imgsa|\w+\.hiphotos|tiebapic)\.(?:bdimg|baidu)\.com\/)(?:forum|album)\/.+\/(\w+\.(?:jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i)) ){
	//	document.location = m[1] + m[2] + "forum/pic/item/" + m[3];
	//}
}
