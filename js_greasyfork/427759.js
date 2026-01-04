// ==UserScript==
// @name         Robux Remover
// @name:pt-BR   Remover Robux
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Simply remove the visible robux counter from roblox page.
// @description:pt-br  Simplesmente remove o contador de robux visível na pagina do roblox.
// @author       Fptbb
// @match        *://*.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427759/Robux%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/427759/Robux%20Remover.meta.js
// ==/UserScript==

document.getElementById("nav-robux-amount").remove();