// ==UserScript==
// @name         ArmorGames
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       vacsati
// @match       http://armorgames.com/play/12141/kingdom-rush*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/18130/ArmorGames.user.js
// @updateURL https://update.greasyfork.org/scripts/18130/ArmorGames.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
//var jatek = document.getElementById("gamefilearea")[0].innerHTML;
var a='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="100%" height="100%" id="gamefile" align="middle">';
a+='<param name="allowScriptAccess" value="always">';
a+='<param name="movie" value="http://cache.armorgames.com/files/games/kingdom-rush-12141.swf?v=1458411250">';
a+='<param name="quality" value="high">';
a+='<param name="wmode" value="window">';
a+='<param name="allowfullscreen" value="">';
a+='<param name="allowfullscreeninteractive" value="false">';
a+='<param name="fullScreenAspectRatio" value="">';
a+='<param name="quality" value="">';
a+='<param name="play" value="true">';
a+='<param name="loop" value="true">';
a+='<param name="menu" value="">';
a+='<param name="flashvars" value="gameID=12141&amp;auth_token=6fcd950266d276608327c8019db53df4&amp;user_id=27c0812bc012f55d71fb50b98cd3bee1">';
a+='<param name="hasPriority" value="true">';
a+='<embed src="http://cache.armorgames.com/files/games/kingdom-rush-12141.swf?v=1458411250" quality="high" width="100%" height="100%" id="gamefileEmbed" name="gamefile" align="middle" wmode="window" allowfullscreen="" allowfullscreeninteractive="false" fullscreenaspectratio="" play="true" loop="true" menu="" allowscriptaccess="always" flashvars="gameID=12141&amp;auth_token=6fcd950266d276608327c8019db53df4&amp;user_id=27c0812bc012f55d71fb50b98cd3bee1" haspriority="true" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer">';
a+='</object>';
document.body.innerHTML=a;