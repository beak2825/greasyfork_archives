// ==UserScript==
// @name         BOD Ayuda
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Mantener la sección de BOD Banca Digital Abierta
// @author       You
// @match        https://web.bancadigitalbod.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/369827/BOD%20Ayuda.user.js
// @updateURL https://update.greasyfork.org/scripts/369827/BOD%20Ayuda.meta.js
// ==/UserScript==
solid = GM_xmlhttpRequest;
try{ setInterval(keepAliveSession,60000); }catch(e){console.log(e);}
$(document).off('cut copy paste');