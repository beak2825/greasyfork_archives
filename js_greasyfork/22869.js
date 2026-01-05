// ==UserScript==
// @name         Nortiana Pool
// @namespace    https://greasyfork.org/sk/scripts/22869-nortiana-pool
// @version      1.5
// @description  Úprava stránky www.duelovky.cz pre hru Pool Live Tour.
// @author       Nortiana
// @include      http://www.duelovky.cz/pool-live-tour*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/22869/Nortiana%20Pool.user.js
// @updateURL https://update.greasyfork.org/scripts/22869/Nortiana%20Pool.meta.js
// ==/UserScript==

GM_addStyle("html body {color: #116FA9; background: #000d48 url('https://s20.postimg.io/6hwvihabv/nortianabackdrop.png') center top no-repeat; a:link {color: white;} a:hover {color: white;} a:visited {color: white;}");
GM_addStyle("div {background: transparent !important;}");
document.getElementById('background').className = "empty";
document.getElementById('pageTopBanner').remove();
document.getElementsByClassName('categories')[0].remove();
document.getElementById('gameBar').remove();
document.getElementsByClassName('game-header clearfix')[0].remove();
document.getElementsByClassName('game-header')[0].remove();
document.getElementsByClassName('related-games')[0].remove();
document.getElementById('facebookSlideBox').remove();