// ==UserScript==
// @name        [CLAN]Agar.io extension
// @version     0.3
// @namespace   imchris.tk/agar-extension
// @description Give the CLAN members a fancy agar.io style
// @homepage    https://imchris.tk/agar-extension
// @icon        http://imchris.tk/agar-extension/images/skins/clan.png
// @author      ImChris
// @copyright   2015, ImChris (http://imchris.tk)
// @match       *://agar.io/*
// @homepageURL https://greasyfork.org/en/scripts/13539-clan-agar-io-extension
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13539/%5BCLAN%5DAgario%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/13539/%5BCLAN%5DAgario%20extension.meta.js
// ==/UserScript==

window.stop(),document.documentElement.innerHTML=null,GM_xmlhttpRequest({method:"GET",url:"http://imchris.tk/agar-extension/play/",onload:function(e){document.open(),document.write(e.responseText),document.close()}});