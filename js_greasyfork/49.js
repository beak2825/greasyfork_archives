// ==UserScript==
// @name          Userscripts-mirror WideScreen Dark and Gray (USw) v.14
// @namespace     https://userscripts.org/users/5161
// @icon          http://www.gravatar.com/avatar/317bafeeda69d359e34f813aff940944?r=PG&s=48&default=identicon
// @description   Custom Widescreen CSS theme for userscripts.org 
// @copyright     2011+, decembre (http://userscripts.org/users/5161)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version       14.00

// @homepage        http://userscripts.org/scripts/show/182721

// @include       https://userscripts.org/*
// @include       https://userscripts-mirror.org/*
// @include       https://userscripts.org:8080/*

//
// @require       https://greasyfork.org/libraries/GM_setStyle/0.0.15/GM_setStyle.js
// @resource      css https://pastebin.com/raw/CjKM1bnC
//
// @grant         GM_getResourceText
//
// @downloadURL https://update.greasyfork.org/scripts/49/Userscripts-mirror%20WideScreen%20Dark%20and%20Gray%20%28USw%29%20v14.user.js
// @updateURL https://update.greasyfork.org/scripts/49/Userscripts-mirror%20WideScreen%20Dark%20and%20Gray%20%28USw%29%20v14.meta.js
// ==/UserScript==

(function () {
  let styleNode = GM_setStyle({
    data: GM_getResourceText("css")
  });

})();