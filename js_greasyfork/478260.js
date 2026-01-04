// ==UserScript==
// @name            Discord Custom Badges
// @description     Add custom badges.
// @version         1.0.1
// @author          roxasytb
// @namespace       https://github.com/RoxasYTB/
// @match           https://*.discord.com/app
// @match           https://*.discord.com/channels/*
// @match           https://*.discord.com/login
// @license         MIT
// @icon            https://cdn.discordapp.com/emojis/1118860094575218708.webp?size=128
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/478260/Discord%20Custom%20Badges.user.js
// @updateURL https://update.greasyfork.org/scripts/478260/Discord%20Custom%20Badges.meta.js
// ==/UserScript==
(function () {
	'use strict';
let _mods;
webpackChunkdiscord_app.push([[Symbol()], {}, (r) => (_mods = r.c)]);
webpackChunkdiscord_app.pop();
let findByProps = (...props) => {
	for (let m of Object.values(_mods)) {
		try {
			if (!m.exports || m.exports === window) continue;
			if (props.every((x) => m.exports?.[x])) return m.exports;

			for (let ex in m.exports) {
				if (props.every((x) => m.exports?.[ex]?.[x])) return m.exports[ex];
			}
		} catch {}
	}
};

setInterval(()=>{
    myId=findByProps("getCurrentUser").getCurrentUser().id
    if(findByProps("getUserProfile").getUserProfile(myId) && findByProps("getUserProfile").getUserProfile(myId).badges.length<7)
    findByProps("getUserProfile").getUserProfile(myId).badges.splice(0,0,{id:"certified_moderator",description:"Anciens des programmes de modération", icon:"https://cdn.discordapp.com/emojis/1026532993923293184.webp?size=128&quality=lossless",link:"https://discord.com/safety"});
},500)
})();
