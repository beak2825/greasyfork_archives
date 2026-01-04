// ==UserScript==
// @name            Habilitador de botones y autoclicker ouo.io
// @name:ja         Habilitador de botones y autoclicker ouo.io
// @namespace       http://ninguno/
// @version         1.1
// @description     Script para saltar la espera y hacer click automáticamente.
// @description:ja  Script para saltar la espera y hacer click automáticamente.
// @author          M4R10
// @match           https://ouo.io/*
// @match           https://ouo.press/go/*
// @match           https://ouo.press/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/396740/Habilitador%20de%20botones%20y%20autoclicker%20ouoio.user.js
// @updateURL https://update.greasyfork.org/scripts/396740/Habilitador%20de%20botones%20y%20autoclicker%20ouoio.meta.js
// ==/UserScript==
var targNode = document.getElementById ("btn-main");
targNode.classList.remove ("disabled");
targNode.classList.add ("enabled");
document.getElementsByClassName("btn-main")[0].click();