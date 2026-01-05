// ==UserScript==
// @name        Colgater
// @namespace   www.ponychan.net/chan/oat
// @description Changes theme to colgate
// @include     http://www.ponychan.net/chan/oat/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5016/Colgater.user.js
// @updateURL https://update.greasyfork.org/scripts/5016/Colgater.meta.js
// ==/UserScript==


document.getElementById("userstylelink").href="http://ponychan.net/chan/css/colgate.css"
setTimeout(function(){document.getElementById("browser-ponies").style.display="none"},100)