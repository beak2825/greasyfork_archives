// ==UserScript==
// @name         gay emotes
// @namespace    https://greasyfork.org/en/scripts/13575-lolno
// @version      1.07
// @description  gay anime emotes for southpark, shouts to metal4chan for the script :^)
// @match        *://instasync.com/r/southpark
// @match        *://instasync.com/r/*
// @grant        none
// @copyright    2015
// @downloadURL https://update.greasyfork.org/scripts/13575/gay%20emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/13575/gay%20emotes.meta.js
// ==/UserScript==
  

self.$externalEmotes = {};
	//if (typeof(self.$animEmotes) === "undefined") self.$animEmotes = {};
script.$metalMemes={
  //decent emotes
    'bestgirl': '<img src="http://i.imgur.com/0rRTHF6.gif" width="100" height"100";>',
    'slut': '<img src="http://i.imgur.com/ibQhkfw.jpg" width="100" height"100";>',
    'bleedinglungs': '<img src="http://i.imgur.com/KhRHVeM.gif" width="100" height"100";>',
    'juuuu': '<img src="http://i.imgur.com/yQNBbVR.gif" width="100" height"100";>',
    'xd2': '<img src="http://i.imgur.com/bl0Lgln.jpg" width="100" height"100";>',
    

};
$.extend(script.$externalEmotes, script.$metalMemes, script.$aniMemes);