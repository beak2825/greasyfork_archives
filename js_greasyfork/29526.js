// ==UserScript==
// @name        CartoonMad Fixer
// @namespace   CartoonMadFixer
// @include     http://www.cartoonmad.com/comic/*
// @include     http://www.cartoomad.com/comic/*
// @include     http://web.cartoonad.com/comic/*
// @include     http://www.cartonmad.com/comic/*
// @include     http://www.cartomad.com/comic/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @version     1
// @grant       GM_xmlhttpRequest
// @description load multi picture in one page for cartoonmad
// @downloadURL https://update.greasyfork.org/scripts/29526/CartoonMad%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/29526/CartoonMad%20Fixer.meta.js
// ==/UserScript==
const gBaseUrl = location.href;

var parsed_gBaseUrl = gBaseUrl.split('/');
var strTmp = parsed_gBaseUrl[parsed_gBaseUrl.length-1];
var book_id = strTmp.substring(0,strTmp.indexOf('0'));
var strLink = "";
var testloc="";
var i=0;

for (i=$("img").length-1;i>=0;i--) {
	if ($("img").eq(i).attr("src").indexOf("web")==-1) {
		$("img").eq(i).remove();
	}
}

function reloadImages(d) {
	for (i=0;i<d.images.length;++i) {
        var IMG=d.images[i];
		if (IMG.readyState!='complete')
			IMG.src=IMG.src;
	}
}

function padLeft(str,lenght){
	if(str.length >= lenght)
		return str;
	else
		return padLeft("0" +str,lenght);
}

for (i=parseInt($("img").eq(0).attr("src").substr($("img").eq(0).attr("src").length-7,3))+1;i<$("option").length;i++) {
	if(i<100)
		strLink = "<hr><img src='" + $("img").eq(0).attr("src").substr(0, $("img").eq(0).attr("src").length-7) + padLeft(i,3) + $("img").eq(0).attr("src").substr(-4) + "' border='0' onload='if(this.width>screen.width*0.96) {this.resized=true; this.width=screen.width*0.92;}'>";
	else
		strLink = "<hr><img src='" + $("img").eq(0).attr("src").substr(0, $("img").eq(0).attr("src").length-7) + i + $("img").eq(0).attr("src").substr(-4) + "' border='0' onload='if(this.width>screen.width*0.96) {this.resized=true; this.width=screen.width*0.92;}'>";
	$("img").eq($("img").length-1).after(strLink);
}
