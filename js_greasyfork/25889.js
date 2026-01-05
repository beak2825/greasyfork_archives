// ==UserScript==
// @name        GA forums tree
// @namespace   glav.su
// @description Позволяет "сворачивать" и "разворачивать" основные разделы форума "Глобальная авантюра" по принципу дерева.
// @include     http://glav.su/forum/
// @include     https://glav.su/forum/
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25889/GA%20forums%20tree.user.js
// @updateURL https://update.greasyfork.org/scripts/25889/GA%20forums%20tree.meta.js
// ==/UserScript==
//Работа с Cookie
function setCookie(name, value, options) {
	options = options || {};
	var expires = options.expires;
	if (typeof expires == "number" && expires) {
		var d = new Date();
		d.setTime(d.getTime() + expires * 1000);
		expires = options.expires = d;
	}
	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString();
	}
	value = encodeURIComponent(value);
	var updatedCookie = name + "=" + value;
	for (var propName in options) {
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if (propValue !== true) {
			updatedCookie += "=" + propValue;
		}
	}
	document.cookie = updatedCookie;
}
function getCookie(name) {
	var matches = document.cookie.match( new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)") );
	return matches ? decodeURIComponent(matches[1]) : undefined;
}
//Объект настроек
var settings = ({
	cook: 'ga_forums_tree',
	values: {},
	load: function(){
		try{
			this.values = JSON.parse( getCookie(this.cook) );
		}catch(e){
			this.values = {};
			this.save();
		}
		return this;
	},
	save: function(){
		setCookie( this.cook, JSON.stringify(this.values), {expires: 100000000} );
	},
	set: function(key, value){
		this.values[key] = value;
		this.save();
	},
	get: function(key){
		if(typeof this.values[key] == 'undefined'){
			this.values[key] = 0;
			this.save();
		}
		return this.values[key];
	}
}).load();
//Форумы
$.each( $(".blueHeader.f"), function(fidx, ftable){
	$(ftable).prev("br").hide();
	var ftd = $(ftable).find(".blueHeaderTitle.fItem");
	if( $(ftd).find("a").length === 0 ) return true;
	var fkey = $(ftd).find("a").attr("href").replace(/^https?:\/\/glav\.su\/forum\/(.*?)\/$/,"$1"),
		fvisible = +( settings.get(fkey) );
	if(fvisible === 0) $(ftable).next().hide();
	$(ftable).attr("fkey", fkey);
	$("<span>&nbsp;</span>").prependTo($(ftd));
	$('<span fvisible="'+fvisible+'" fkey="'+fkey+'">' + ['[+]','[-]'][fvisible] + '</span>')
		.css({ 'cursor': "pointer", 'font-family': "monospace" })
		.click(function(){
			var fkey = $(this).attr("fkey"), fvisible = +$(this).attr("fvisible");
			fvisible = +(!fvisible);
			$(this).html(['[+]','[-]'][fvisible]).attr("fvisible", fvisible);
			settings.set(fkey, fvisible);
			$(".blueHeader.f[fkey='"+fkey+"']").next().toggle();
		})
		.prependTo($(ftd));
});
