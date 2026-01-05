//
// ==UserScript==
// @name 			SIS助手
// @namespace		http://www.sexinsex.net
// @author			cnbeta1
// @developer		cnbeta1
// @description     zh-cn
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @include 		http://www.sexinsex.net/bbs/*
// @include 		http://174.127.195.201/bbs/*
// @include 		http://174.127.195.200/bbs/*
// @include 		http://174.127.195.180/bbs/*
// @include 		http://174.127.195.166/bbs/*
// @include 		http://174.127.195.171/bbs/*
// @run-at			document-end
// @version 		0.3.3
// @downloadURL https://update.greasyfork.org/scripts/28139/SIS%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/28139/SIS%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//=======START=======
//chrome 浏览器沙箱引用 参数定义
var scripts = [ '//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js' ];
var numScripts = scripts.length, loadedScripts = 0;
// 沙箱样式表
// GM_addStyle('CSS styles goes here');

// 沙箱引用 后调用 main方法。
var i, protocol = document.location.protocol;
for (i = 0; i < numScripts; i++) {
	var script = document.createElement("script");
	script.setAttribute("src", protocol + scripts[i]);
	script.addEventListener('load', function() {
		loadedScripts += 1;
		if (loadedScripts < numScripts) {
			return;
		}
		var script = document.createElement("script");
		script.textContent = "(" + main.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
	console.log(script);
}

// main方法
function main() {
	jQuery.noConflict();
	// if window.$ has been used by other libs
	var location = window.location;
	var path = location.pathname;
    var search = location.search;
	jQuery("#menu").remove();
    //alert(search.indexOf("156537"));
    if (search.indexOf("156537") > 0) {
		jQuery(".forum a:contains(第六天魔王)").parent().parent().remove();
		jQuery(".forum a:contains(Western Authorship)").parent().parent().remove();
        jQuery(".forum a:contains(自拍)").parent().parent().remove();
        jQuery(".subject a:contains(【中文字幕】)").parent().parent().remove();
        jQuery(".subject a:contains(DVD)").parent().parent().remove();
        //jQuery(".subject a:contains(FHD)").parent().siblings(":contains(有码)").parent().css({"background":"white"});
        jQuery(".subject a:contains(FHD)").parent().siblings(":contains(有码)").parent().remove();
        jQuery(".subject a:contains([SD)").parent().parent().remove();
        jQuery(".subject a:contains(【)").parent().parent().remove();
        jQuery(".subject a:contains(※※魔王※※)").parent().parent().css({"background":"pink"});
        jQuery(".subject a:contains(HD)").parent().parent().css({"background":"Yellow"});
        jQuery(".subject a:contains(BD)").parent().parent().css({"background":"Yellow"});
        jQuery(".subject a:contains(簡中)").parent().parent().css({"background":"Aquamarine "});
        jQuery(".subject a:contains(Red Hot Jam)").parent().parent().css({"background":"Fuchsia"});
        jQuery(".subject a:contains(1pon)").parent().parent().css({"background":"Fuchsia"});
                jQuery(".subject a:contains(G-AREA)").parent().parent().css({"background":"Chartreuse "});
        jQuery(".subject a:contains(Real)").parent().parent().css({"background":"Chartreuse "});
        jQuery(".subject a:contains(S-Cute)").parent().parent().css({"background":"Chartreuse "});
        jQuery(".subject a:contains(Mywife)").parent().parent().css({"background":"Chartreuse "});
        jQuery(".subject a:contains(Porn)").parent().parent().css({"background":"Chartreuse "});
	}
    if (search.indexOf("12922716") > 0) {
		jQuery(".forum a:contains(Asia Authorship Seed)").parent().parent().remove();
        jQuery(".forum a:contains(Western Authorship Seed)").parent().parent().remove();
	}
    if (search.indexOf("4046607") > 0) {
		jQuery(".forum a:contains(Western Authorship Seed | 欧美成人无码原创区)").parent().parent().remove();
		jQuery(".subject a:contains(pacopacomama)").parent().parent().remove();
        jQuery(".subject a:contains(熟女)").parent().parent().remove();
        jQuery(".subject a:contains(金８天国)").parent().parent().remove();
        jQuery(".subject a:contains(vip474)").parent().parent().remove();
        jQuery(".subject a:contains(fhd)").parent().parent().remove();
        jQuery(".subject a:contains(G-AREA)").parent().parent().css({"background":"Chartreuse "});
        jQuery(".subject a:contains(Real)").parent().parent().css({"background":"Chartreuse "});
        jQuery(".subject a:contains(S-Cute)").parent().parent().css({"background":"Chartreuse "});
        jQuery(".subject a:contains(Mywife)").parent().parent().css({"background":"Chartreuse "});
        jQuery(".subject a:contains(Porn)").parent().parent().css({"background":"Chartreuse "});
	}
    if (search.indexOf("1753086") > 0) {
        jQuery(".subject a:contains(G-AREA)").parent().parent().css({"background":"Chartreuse "});
        jQuery(".subject a:contains(Real)").parent().parent().css({"background":"Chartreuse "});
        jQuery(".subject a:contains(S-Cute)").parent().parent().css({"background":"Chartreuse "});
        jQuery(".subject a:contains(Mywife)").parent().parent().css({"background":"Chartreuse "});
        jQuery(".subject a:contains(Porn)").parent().parent().css({"background":"Chartreuse "});
	}
    if (path == "/bbs/space.php") {
		jQuery('#main_layout0').remove();
		jQuery('td.header').remove();
		jQuery('#footer').remove();
		jQuery("td.lastpost").css({
			'width' : '15%'
		});
	}
	if (path.indexOf('/bbs/thread') === 0) {
        var torrent = jQuery(".postattachlist");
        jQuery('#ad_text').remove();
		jQuery("#footercontainer").remove();
		jQuery("#header").remove();
		jQuery("div.pages_btns").remove();
		jQuery("#ad_interthread").remove();
		jQuery("#menu2").remove();
		jQuery("#menu2").remove();
		jQuery("#menu2").remove();
		jQuery("ins").remove();
		jQuery(".headactions").remove().next().remove();

		var thread = jQuery(".mainbox:first");

		var postinfo = jQuery(".postinfo.postactions");
		var postauthor = jQuery(".postauthor");
		jQuery("form[name=modactions]").html("").append(thread);
		torrent.css({
			"width" : "190px"
		});
		jQuery(".postauthor").prepend(postinfo).append(torrent);
		jQuery(".t_attachlist dt").css({
			"height" : "80px"
		});

		postinfo.children().css({
			"width" : "100%"
		});
		jQuery("div.pages_btns").remove();
		// alert(postinfo.children().length);
	}
	// alert("done");

}