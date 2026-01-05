// ==UserScript==
// @name        Copy metruyen
// @namespace   https://vozforums.com/showthread.php?t=2667055
// @author      takeover11
// @include     http://www.metruyen.com/*
// @version     1.1
// @description   Copy trang metruyen
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12748/Copy%20metruyen.user.js
// @updateURL https://update.greasyfork.org/scripts/12748/Copy%20metruyen.meta.js
// ==/UserScript==

unsafeWindow.document.oncontextmenu = function(){};
unsafeWindow.document.onmousedown = function(){};
unsafeWindow.document.onmouseup = function(){};
unsafeWindow.document.onkeypress = function(){};
unsafeWindow.document.onkeydown = function(){};
unsafeWindow.document.onkeyup = function(){};
unsafeWindow.document.ondragstart = function(){};
unsafeWindow.document.contentprotector = function(){};
unsafeWindow.document.mousehandler = function(){};
unsafeWindow.document.disableselect = function(){};
unsafeWindow.document.reEnable = function(){};
unsafeWindow.document.onselectstart = function(){};
var body = document.getElementsByTagName('body')[0];
body.setAttribute("style", "-webkit-user-select:inherit!important");