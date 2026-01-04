// ==UserScript==
// @name        Panamá América - No Refrescar
// @namespace   Panamá América
// @description Deshabilitar los refrescos automáticos en El Panamá América.
// @include     https://*panamaamerica.com.pa/*
// @version     1
// @grant       none
// @author      PA
// @downloadURL https://update.greasyfork.org/scripts/419979/Panam%C3%A1%20Am%C3%A9rica%20-%20No%20Refrescar.user.js
// @updateURL https://update.greasyfork.org/scripts/419979/Panam%C3%A1%20Am%C3%A9rica%20-%20No%20Refrescar.meta.js
// ==/UserScript==
var script = document.createElement("script");
script.innerHTML = '(function(){clearInterval(timer); autoRefresh = function(){};})();';
var body = document.getElementsByTagName("body")[0];
body.appendChild(script);