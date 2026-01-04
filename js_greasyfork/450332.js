// ==UserScript==
// @name         Cunt Empire Cheat
// @version      1.2020-08-15
// @description  Enables the cheat menu - open it by pressing "c"
// @author       iBelg
// @match        https://www.cuntempire.com/
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @namespace https://greasyfork.org/users/951749
// @downloadURL https://update.greasyfork.org/scripts/450332/Cunt%20Empire%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/450332/Cunt%20Empire%20Cheat.meta.js
// ==/UserScript==

!function(){"use strict";GM_xmlhttpRequest({method:"GET",url:`${document.location.origin}/src/app.bundle.js`,onload:e=>{let o=e.responseText;o=o.replace(/new IT/,"window._game = new IT").replace(/(new Mo\(.,)\s?.(\))/g,"$11$2"),GM_xmlhttpRequest({method:"GET",url:document.location.origin,onload:e=>{let t=e.responseText;t=t.replace(/ src="\/src\/app\.bundle\.js">/,`>\n${o.toString()}`),document.open(),document.write(t),document.close()}})}})}();