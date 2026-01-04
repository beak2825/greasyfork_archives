// ==UserScript==
// @name		Smiley Forum for innogames
// @name:fr		Smiley Forum pour innogames
// @name:de		Smiley-Forum für Innogames
// @version		1.1
// @author		David1327
// @namespace	https://www.tuto-de-david1327.com/
// @description	Expansion for the forum (Grepolis, Forge of Empires, Elvenar, Tribal Wars, Tribal Wars 2, The west)
// @description:FR	Extension pour le forum (Grepolis, Forge of Empires, Elvenar, Guerre Tribale, Tribal Wars 2, The west)
// @description:DE	Erweiterung für das Forum (Grepolis, Forge of Empires, Elvenar, Die Staemme, Tribal Wars 2, The west)
// @match		https://*.forum.grepolis.com/*
// @match		https://forum.*.forgeofempires.com/*
// @match		https://*.forum.elvenar.com/*
// @match		https://forum.guerretribale.fr/*
// @match		https://forum.tribalwars.net/*
// @match		https://forum.die-staemme.de/*
// @match		https://*.forum.tribalwars2.com/*
// @match		https://forum.the-west.fr/*
// @match		https://forum.the-west.de/*
// @match		https://forum.the-west.net/*
// @match		https://forum.beta.the-west.net/*
// @match		https://forum.the-west.*.com/*
// @icon64		https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-smilenew.gif
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/423345/Smiley%20Forum%20for%20innogames.user.js
// @updateURL https://update.greasyfork.org/scripts/423345/Smiley%20Forum%20for%20innogames.meta.js
// ==/UserScript==
(function(){
 var s=document.createElement('script');
 s.type='text/javascript';
 s.src='https://greasyfork.org/scripts/423271-smiley/code/smiley.js';
 document.body.appendChild(s);
})();