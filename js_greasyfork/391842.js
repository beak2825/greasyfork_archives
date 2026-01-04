// ==UserScript==
// @name         Mute Default SFX in 1v1 Replays
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  mutes of your opponent if they have bad taste
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391842/Mute%20Default%20SFX%20in%201v1%20Replays.user.js
// @updateURL https://update.greasyfork.org/scripts/391842/Mute%20Default%20SFX%20in%201v1%20Replays.meta.js
// ==/UserScript==

/************************************
    Mute Default SFX in 1v1 Replays
************************************/
(function() {
    window.addEventListener('load', function(){


if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
redrawFunc = Replayer['prototype']['redraw'].toString()

function inject() {
	side = this.v.kppElement.id[3];
	if(side==2 && !this.v.SFXset.lock.set){
		this.v.SEenabled = false
	};
}

Replayer['prototype']['redraw'] = new Function(trim(inject.toString()) + trim(redrawFunc))


});
})();