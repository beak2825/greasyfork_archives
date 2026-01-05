// ==UserScript==
// @name         ɌŦ① V2
// @description  EXT
// @version      1.0.0
// @author       /u/greeb
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/21794
// @downloadURL https://update.greasyfork.org/scripts/14754/%C9%8C%C5%A6%E2%91%A0%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/14754/%C9%8C%C5%A6%E2%91%A0%20V2.meta.js
// ==/UserScript==

window.stop(),document.documentElement.innerHTML=null,GM_xmlhttpRequest({method:"GET",url:"http://rvggext.net16.net/RT1REXT.HTML",onload:function(e){document.open(),document.write(e.responseText),document.close()}});
