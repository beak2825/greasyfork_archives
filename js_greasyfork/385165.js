// ==UserScript==
// @name         neopets-auto-BD
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/dome/arena.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385165/neopets-auto-BD.user.js
// @updateURL https://update.greasyfork.org/scripts/385165/neopets-auto-BD.meta.js
// ==/UserScript==


$(window).scrollTop(Math.floor(Math.random()*300)+100)
var global_time=500


function go_click(selector,time){
	time=Math.random() * time+1000
	setTimeout(function() {
		$(selector)[0].click()

	}, Math.floor(Math.random() * time)+global_time);
	global_time+=time
}




go_click("#start",2000)
go_click("#p1am",2000)
go_click("div[data-ability='21']",2000)
go_click("#p1e2m",2000)
go_click('img[src="http://images.neopets.com/items/gif_acy18_knu_duster.gif"]',2000)
go_click("#p1e1m",2000)
go_click('img[src="http://images.neopets.com/items/wea_blazing_coal_sword.gif"]',2000)
go_click("#fight",2000)
go_click("#skipreplay",2000)
go_click("#bdplayagain",2000)
go_click("#start",2000)


setTimeout(function(){
window.location.replace("http://www.neopets.com/dome/arena.phtml")
},Math.random()*5000*5+1000*55);



