// ==UserScript==
// @name        Yay Ponies 20% Cooler
// @namespace   com.github.juzeon.yayponies
// @description Yayponies with blue and yellow styles.
// @author     juzeon
// @include       *://*yayponies.*/*
// @include     *://*yp1.*/*
// @include     *://*yp.*/*

// Include JQuery 2.1.1
// @require     http://cdn.staticfile.org/jquery/2.1.1/jquery.min.js

// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31551/Yay%20Ponies%2020%25%20Cooler.user.js
// @updateURL https://update.greasyfork.org/scripts/31551/Yay%20Ponies%2020%25%20Cooler.meta.js
// ==/UserScript==


$(document).ready(function(){
	$("#header").html("<img src='http://imgur.com/39CDVVe.png' width='450px'>");
	$("body").attr("style","background-color:#65D3F7;");
	$("title").append("<base target='_blank'><style>a{color: #F6F734 !important;font-size:16px !important;} select{background: #37CAFA !important;color:#F6F734 !important;} .poni{background-color:#37CAFA !important;color:#F6F734 !important;} .poni:hover{background-color:#37CAFA !important;} a:hover{ color: #F6F734 !important;} .disabled{color:#454444 !important;} a.current{color:#454444 !important;}</style>");
	$("a[href$='yayponies.eu/']").attr("style","font-size:12px !important;");
	$("a[href$='/']").attr("target","_parent");
	$("a[href$='.php']").attr("target","_parent");
	$("#container").attr("style","background-color:#37CAFA;color:black;");
	$("p").attr("style","font-size:16px;");
});