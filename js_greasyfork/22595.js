// ==UserScript==
// @name         Pool Live Tour
// @namespace    https://greasyfork.org/sk/scripts/22595-pool-live-tour
// @version      1.5
// @description  Editing www.duelovky.cz for game Pool Live Tour.
// @author       achares
// @include      https://www.duelovky.cz/pool-live-tour*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/22595/Pool%20Live%20Tour.user.js
// @updateURL https://update.greasyfork.org/scripts/22595/Pool%20Live%20Tour.meta.js
// ==/UserScript==

GM_addStyle("html body {color: #116FA9; background: #000d48 url('https://s6.postimg.org/5gww8xtjj/backdrop.png') center top no-repeat; a:link {color: white;} a:hover {color: white;} a:visited {color: white;}");
GM_addStyle("div {background: transparent !important;}");
document.getElementById('background').className = "empty";
document.getElementById('pageTopBanner').remove();
document.getElementsByClassName('categories')[0].remove();
document.getElementById('gameBar').remove();
document.getElementsByClassName('game-header clearfix')[0].remove();
document.getElementsByClassName('game-header')[0].remove();
document.getElementsByClassName('related-games')[0].remove();
document.getElementById('facebookSlideBox').remove();