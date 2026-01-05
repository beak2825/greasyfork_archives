// ==UserScript==
// @name        Video Download Button
// @namespace   VDBMB
// @author      MegaByte
// @description This script adds a download button on many video sites.
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at 		document-idle
// @noframes
// @include     http*://*streamcloud.eu/*
// @include     http*://*powerwatch.pw/*
// @include     http*://*vivo.sx/*
// @include     http*://*shared.sx/*
// @include     http*://*nowvideo.to/video/*
// @include     http*://*nowvideo.sx/video/*
// @include     http*://*ecostream.tv/stream/*.html
// @include     http*://*auroravid.to/video/*
// @version     2.5.1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/20823/Video%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/20823/Video%20Download%20Button.meta.js
// ==/UserScript==


if(!('includes' in String.prototype)) {
	String.prototype.includes = function(str, startIndex) {
		return -1 !== String.prototype.indexOf.call(this, str, startIndex);
	};
}


this.$ = this.jQuery = jQuery.noConflict(true);

function main() {
	var site = window.location.href || document.URL;

	if(site.includes("streamcloud.eu")) streamcloud();
	else if(site.includes("powerwatch.pw")) powerwatch();
	else if(site.includes("vivo.sx")) vivo();
	else if(site.includes("shared.sx")) shared();
	else if(!!site.match(/nowvideo.((sx)|(to))/)) nowvideo();
	else if(site.includes("ecostream.tv")) ecostream();
	else if(site.includes("auroravid.to")) auroravid();
}

function streamcloud() {
	if($("#player_code").length === 0) return;
	var url = jwplayerSource() || searchInScripts("file:\\s?\"https?:\\/\\/.+?\\.mp4\"", "http", ".mp4");
	if(url !== null) 
		$(".container-fluid ul.nav").prepend("<li>" + button(url) + "</li>");
}

function powerwatch() {
  if($("#vplayer").length === 0) return;
	var url = jwplayerSource() || searchInScripts("file:\\s?\"https?:\\/\\/.+?\\.mp4\"", "http", ".mp4");
	if(url !== null) {
		$("h5.h4-fine").html("<span class='head'>"+$("h5.h4-fine").html()+"</span><span class='down'>" + button(url) + "</span>")
		GM_addStyle("h5.h4-fine { display: flex; } h5.h4-fine .head { flex-grow: 1; } h5.h4-fine .down { flex-grow: 0; }");
	}
}

function vivo() {
	$.fn.extend({
		getStyleObject: function() {
			var dom = this.get(0);
			var style;
			var returns = {};
			if(window.getComputedStyle) {
				var camelize = function(a,b){
					return b.toUpperCase();
				};
				style = window.getComputedStyle(dom, null);
				for(var i = 0, l = style.length; i < l; i++) {
					var prop = style[i];
					var camel = prop.replace(/\-([a-z])/g, camelize);
					var val = style.getPropertyValue(prop);
					returns[camel] = val;
				};
				return returns;
			};
			if(style = dom.currentStyle) {
				for(var prop in style){
					returns[prop] = style[prop];
				};
				return returns;
			};
			return this.css();
		},
		copyCSS: function(source) {
			var styles = $(source).getStyleObject();
			this.css(styles);
		}
	});
	var e = $(".stream-content");
	if(e.length === 0) return;
	var url = e.attr("data-url");
	if(typeof url === "undefined") return;
	var lightBTN = $(".light-switch.btn");
	var downBTN = $("<div class='download'>" + button(url) + "</div>");
	downBTN.copyCSS(lightBTN);
	lightBTN.parent().prepend(downBTN);
	GM_addStyle(".download { margin-right: 15px !important;} .download:hover { color: #fff !important; background-color: #39b3d7 !important; border-color: #269abc !important; }  .download a { text-decoration: none; color: white; }");
}

function shared() {
	var e = $(".stream-content");
	if(e.length === 0) return;
	var url = e.attr("data-url");
	if(typeof url === "undefined") return;
	$(".light-switch").parent().prepend("<div class='download'>" + button(url) + "</div>");
	GM_addStyle(".addthis_toolbox { width: unset !important; }  .download { position: relative; background-color: #FF6550; color: #FFF; float: right; font-size: 13px; font-weight: 700; height: 32px; line-height: 32px; margin: 0 0 0 10px; padding: 0 15px; width: auto; cursor: pointer; -webkit-transition: all .35s ease-in; -moz-transition: all .35s ease-in; -o-transition: all .35s ease-in; transition: all .35s ease-in; opacity: 1; z-index: 300; }  .download a { text-decoration: none; color: white;}");
}


function nowvideo() {
	if($("#content_player").length === 0) return;
	var elem = $("#content_player > a[href*=premium]");
	var url = $("video source").attr("src");
	var title = $($(".video_details h4").get(1)).html();
	
	Downloader(elem, "click", url, title, true);
}

function ecostream() {
	if($("#video").length === 0) return;
	var file = jwplayerSource();
	if(file === null) return;
	$(".downline").append("<br />" + button(file));
	Downloader($("download-link"), "click", file, "video.mp4", true);
	GM_addStyle(".download-link { color: #E3E3E3; text-decoration: none; }");
}

function auroravid() {
	if($("#videoPlayer").length === 0) return;
	cloudplayerSource(function(url, title) {
		title = title.replace("%26asdasdas", "") + ".flv";
		var download = [$("#content_block a.btn[href*=premium]"), 
						$("#videoPlayer param[name=flashvars]")];
		Downloader(download[0], "click", url, title, true);
		download[1].attr("value", download[1].attr("value").replace(/premiumLink=.*?(&|$)/g, "premiumLink="+url+"&"));
	});
}


main();

	function jwplayerSource() {
		var w = gindow();
		if(!w.jwplayer || !w.jwplayer().config) return null;
		var config = w.jwplayer().config;
		
		var file = [];
		if(config.file) 
			file.push(config.file);
		if(config.sources) 
			for(var s of config.sources) 
				file.push(s.file);
		
		if(file.length === 0) return null;
		if (typeof location.origin === 'undefined')
			location.origin = location.protocol + '//' + location.host;
		for(var i in file) 
			if(!file[i].match(/https?:\/\//))
				file[i] = location.origin + file[i];
		return file.length === 1 ? file[0] : file;
	}
	
	function cloudplayerSource(callback) {
		var w = gindow();
		var args = w.flashvars;
		if(typeof args == "undefined" || args === null) {
			args = {};
			var data = $("#videoPlayer param[name=flashvars]").attr("value").split("&");
			for(var d of data) {
				var tmp = d.split("=");
				args[tmp[0]] = tmp[1];
			}
		}
		var file = args["file"];
		var key = args["filekey"];
		var domain = args["domain"];
		var data_url = domain + "/api/player.api.php?file=" + file + "&key=" + key;
		console.log(data_url);
		$.get(data_url, function(data) {
			var vars = {};
			var attr = data.split("&");
			for(var a of attr) {
				var tmp = a.split("=");
				vars[tmp[0]] = tmp[1];
			}
			var url = vars["url"];
			var title = vars["title"];
			callback(url, title);
		});
	}

	function Downloader(elem, trigger, url, name, fallbackAttr) {
		if(isEmpty(elem) || isEmpty(trigger) || isEmpty(url)) return;
		if(isEmpty(name)) name = "video.mp4";
		elem.on(trigger, function(e) {
			if(typeof GM_download === "undefined") return;
			e.preventDefault();
			GM_download(url, name);
		});
		if(fallbackAttr) {
			elem.attr("href", url);
			elem.attr("download", name);
		}
	}
	
	function isEmpty(target, val) {
		return typeof target == "undefined" || target == null || target === "";
	}

	function gindow() {
		return (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
	}

	function searchInScripts(patt, start, end) {
		var url = null;
		$("body script").each(function() {
			var regex = new RegExp(patt);
			var out = regex.exec($(this).html());
			if(typeof out !== "undefined" && out !== "" && out !== null) {
				if(typeof out !== "string") out = out[0];
				var s = out.indexOf(start);
				var e = out.lastIndexOf(end);
				if( s!==-1 && e!==-1 ) url = out.substring(s, e);
				return false;
			}
		});
		return url;
	}
	 
	function button(url) {
		return "<a href='" + url + "' download class='download-link' target='_blank'>Download</a>";
	}