// ==UserScript==
// @name        exhentai no https
// @namespace   js.replacer.string
// @include     http://exhentai.org/*
// @version     1
// @grant       none
// @description access the site with http
// @downloadURL https://update.greasyfork.org/scripts/21719/exhentai%20no%20https.user.js
// @updateURL https://update.greasyfork.org/scripts/21719/exhentai%20no%20https.meta.js
// ==/UserScript==

document.body.innerHTML = document.body.innerHTML.replace(/(http|inits)s/g, '$1');

var css = document.createElement('link');
css.setAttribute("rel", "stylesheet");
css.setAttribute("type", "text/css");
css.setAttribute("href", "http://exhentai.org/z/0320/x.css");

document.getElementsByTagName("head")[0].appendChild(css);

var script = document.createElement('script');
script.setAttribute("type", "text/javascript");
script.setAttribute("src", "/z/0320/ehg_index.c.js");
document.getElementsByTagName("head")[0].appendChild(script);
script = document.createElement('script');
script.setAttribute("type", "text/javascript");
script.setAttribute("src", "/z/0320/ehg_gallery.c.js");
document.getElementsByTagName("head")[0].appendChild(script);

document.body.onload = function () {
	window.load_pane_image = function (b) {if (b != undefined) {var a = b.innerHTML.split("~", 4);if (a.length == 4) {if (a[0] == "init") {b.innerHTML='<img src="http://'+a[1]+"/"+a[2]+'" alt="'+a[3]+'" style="margin:0" />';} else if (a[0]=="inits") {b.innerHTML='<img src="http://'+a[1]+"/"+a[2]+'" alt="'+a[3]+'" style="margin:0" />'}}}}
}