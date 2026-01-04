// ==UserScript==
// @name         Skins in 1v1 Replay
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  allows skins in 1v1 replays
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391843/Skins%20in%201v1%20Replay.user.js
// @updateURL https://update.greasyfork.org/scripts/391843/Skins%20in%201v1%20Replay.meta.js
// ==/UserScript==

/**************************
    Skins in 1v1 Replay
**************************/
(function() {
    window.addEventListener('load', function(){


if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
redrawFunc = Replayer['prototype']['redraw'].toString()

//Comment out the line for skin1=... or skin2=... if you want to keep the skin for that side
skin1=["https://i.imgur.com/6I8Aqh7.png",32]
skin2=["https://i.imgur.com/l6P1G9W.png",32]
injected = [false,false]

function inject() {
	side = this.v.canvas.id.slice(-1)
	if(!injected[side-1]){
		if(eval("typeof skin"+side+'!= "undefined"')){
			this.skins.map(x=>{
				x.data = eval("skin"+side+"[0]"), x.w = eval("skin"+side+"[1]"), this.v.changeSkin(1)
			})
		}
		injected[side-1]=true
	};
}

Replayer['prototype']['redraw'] = new Function(trim(inject.toString()) + trim(redrawFunc))


});
})();