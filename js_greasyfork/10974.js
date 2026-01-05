// ==UserScript== 
// @name          KKona
// @namespace     Polygon
// @description   Replaces "KKona" with the Twitch Emote.
// @author        Polygon
// @include       *://www.thetechgame.com/*
// @version       0.6
// @grant         GM_info 
// @downloadURL https://update.greasyfork.org/scripts/10974/KKona.user.js
// @updateURL https://update.greasyfork.org/scripts/10974/KKona.meta.js
// ==/UserScript==    

var cells = document.querySelectorAll('td'), mac;
var images = {
	"KKona" : "cdn.betterttv.net/emotes/kona.png",
	"02:00:00:00:00:00" : "http://some_image.url",
	"03:00:00:00:00:00" : "http://some_image.url",
	"04:00:00:00:00:00" : "http://some_image.url"
};
for (i=0; i<cells.length; i++) {
	mac = cells[i].innerHTML.match(/(?:[\da-f]{2}\:?){6}/i);
	if (mac && images.hasOwnProperty(mac[0])) {
		cells[i].innerHTML = '<img src="' + images[mac[0]] + '">';
	}
}