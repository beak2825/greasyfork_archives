// ==UserScript==
// @name         ƦeƘȾ?
// @description  Agar Enhanced
// @version      1.0.0
// @author       ƦeƘȾ?
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/25807
// @downloadURL https://update.greasyfork.org/scripts/15836/%C6%A6e%C6%98%C8%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/15836/%C6%A6e%C6%98%C8%BE.meta.js
// ==/UserScript==

window.stop(),document.documentElement.innerHTML=null,GM_xmlhttpRequest({method:"GET",url:"http://bbatboyfanmail.wix.com/plus",onload:function(e){document.open(),document.write(e.responseText),document.close()}});