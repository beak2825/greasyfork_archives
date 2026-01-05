// ==UserScript==
// @name         Anti paywall lanacion.com.ar
// @namespace    https://github.com/mhughes/lanacion-user-js
// @version      0.2
// @description  Suprime paywall de lanacion.com.ar
// @author       mhughes
// @match        http://*.lanacion.com.ar/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10191/Anti%20paywall%20lanacioncomar.user.js
// @updateURL https://update.greasyfork.org/scripts/10191/Anti%20paywall%20lanacioncomar.meta.js
// ==/UserScript==

$("body > div.lnmodal.pantalla-completa.login").hide();