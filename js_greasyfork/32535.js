// ==UserScript==
// @name         Banesco AntiClose
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Evita que se cierre su seccion en BanescOnline
// @author       You
// @match        https://www.banesconline.com/mantis/WebSite/Inactividad/MensajeIntermedio.aspx
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/32535/Banesco%20AntiClose.user.js
// @updateURL https://update.greasyfork.org/scripts/32535/Banesco%20AntiClose.meta.js
// ==/UserScript==

window.opener.reiniciarTimer();
window.close();