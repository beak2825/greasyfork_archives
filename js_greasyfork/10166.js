// ==UserScript==
// @name			em oats
// @description		add oats to your epicmafia experience
// @match			https://epicmafia.com/*
// @version 0.0.1.20150602205952
// @namespace https://greasyfork.org/users/4723
// @downloadURL https://update.greasyfork.org/scripts/10166/em%20oats.user.js
// @updateURL https://update.greasyfork.org/scripts/10166/em%20oats.meta.js
// ==/UserScript==

var	oats={
	angel: "http://i.imgur.com/vmBnXfBh.png",
	arrgh: "http://i.imgur.com/yWRnfdWh.png",
	bird: "http://i.imgur.com/q99FCfN.gif",
	blush: "http://i.imgur.com/vUyEPUPh.png",
	buffufu: "http://i.imgur.com/VHsQvSlh.png",
	charlotte: "http://i.imgur.com/i3hauTe.gif",
	chefufu: "http://i.imgur.com/nl1GQIkh.png",
	chill: "http://i.imgur.com/aI5U9aY.gif",
	coffufu: "http://i.imgur.com/5VRMdrqh.png",
	cryfu: "http://i.imgur.com/fhR3Gulh.png",
	cthfulfu: "http://i.imgur.com/6ueysCDh.png",
	dalek: "http://i.imgur.com/W325y1s.gif",
	eful: "http://i.imgur.com/WGExCALh.png",
	feels: "http://i.imgur.com/1UqALYB.gif",
	flufu: "http://i.imgur.com/EA3HECZh.png",
	fufixit: "http://i.imgur.com/SKUyzs1h.png",
	fuflex: "http://i.imgur.com/YDwbjQVh.png",
	fuflower: "http://i.imgur.com/I4zw3iMh.png",
	fufool: "http://i.imgur.com/e0uk1ddh.png",
	fufruit: "http://i.imgur.com/6yBMrqAh.png",
	fufu: "http://i.imgur.com/cmsntv2h.png",
	fufuf: "http://i.imgur.com/4h8NEEKh.png",
	fufull: "http://i.imgur.com/1CYf6dz.png",
	fufunky: "http://i.imgur.com/7aNzKPjh.png",
	fufuroll: "http://i.imgur.com/R2Ll0jL.gif",
	fufuu: "http://i.imgur.com/qXk1mb0h.png",
	fufuzela: "http://i.imgur.com/fyH1ZBoh.png",
	fuuf: "http://i.imgur.com/vp9LsSbh.png",
	gaws: "http://i.imgur.com/NIennRF.gif",
	gay: "http://i.imgur.com/ILvlbCc.gif",
	glad: "http://i.imgur.com/rbeyeW8h.png",
	gorf: "http://i.imgur.com/PkMTk1g.gif",
	hamtaro: "http://i.imgur.com/ZE2xLAL.gif",
	isay: "http://i.imgur.com/2GpbA1G.gif",
	kappa: "http://i.imgur.com/FyOZi55.gif",
	knifufu: "http://i.imgur.com/905e8hI.gif",
	kungfufu: "http://i.imgur.com/aMyCgYZh.png",
	leafufu: "http://i.imgur.com/8kRR9Dgh.png",
	licky: "http://i.imgur.com/PF9fOmc.gif",
	lub: "http://i.imgur.com/hCsYezmh.png",
	michael: "http://i.imgur.com/o5pnGish.png",
	nerdfufu: "http://i.imgur.com/Fk0YGAXh.png",
	mudkip: "http://img.pokemondb.net/sprites/black-white/anim/normal/mudkip.gif",
	ohno: "http://i.imgur.com/NEHVkJUh.png",
	omg: "http://i.imgur.com/8d9wCyyh.png",
	pikachu: "http://img.pokemondb.net/sprites/black-white/anim/normal/pikachu.gif",
	pengfufu: "http://i.imgur.com/LGXq6Kbh.png",
	pepe: "http://i.imgur.com/ejJtTvC.gif",
	poutyfufu: "http://i.imgur.com/Fvn5nBPh.png",
	rainfu: "http://i.imgur.com/2XtLgsWh.png",
	roadkill: "http://i.imgur.com/G6VFBZfh.png",
	seedot: "http://i.imgur.com/DlZPUkW.gif",
	sleepy: "http://i.imgur.com/7HegR95h.png",
	snoop: "http://i.imgur.com/F5HViqt.gif",
	swag: "http://i.imgur.com/6uOsLKH.gif",
	tofufu: "http://i.imgur.com/XSR8Ceeh.png",
	uffu: "http://i.imgur.com/JfMlPzAh.png",
	ufuf: "http://i.imgur.com/ZbFG7JMh.png",
	ufufu: "http://i.imgur.com/yf55yezh.png",
	waifufu: "http://i.imgur.com/FfwoAACh.png",
	wat: "http://i.imgur.com/m9bboaI.png",
	weed: "http://i.imgur.com/G5EYfSL.png",
	whimsicott: "http://img.pokemondb.net/sprites/black-white/anim/normal/whimsicott.gif",
	wink: "http://i.imgur.com/ChIkWIr.png",
	wwybwds: "http://i.imgur.com/B1q0Y3b.png"
	};
window.addEventListener("load", function(event) {
	var	emotes=unsafeWindow.lobby_emotes||unsafeWindow.lobbyinfo;
	if(emotes) {
		if(emotes.emotes) {
			emotes=emotes.emotes;
			}
		for(var key in oats) {
			if(!emotes[":"+key+":"]) {
				emotes[":"+key+":"]=oats[key];
				}
			}
		}
	});