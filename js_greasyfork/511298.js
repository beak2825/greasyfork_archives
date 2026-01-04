// ==UserScript==
// @name BCC
// @namespace https://www.bondageprojects.com/
// @version 1.8.2
// @description Bondage Club Chaos addon
// @author Zoi
// @match https://bondageprojects.elementfx.com/*
// @match https://www.bondageprojects.elementfx.com/*
// @match https://bondage-europe.com/*
// @match https://www.bondage-europe.com/*
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/511298/BCC.user.js
// @updateURL https://update.greasyfork.org/scripts/511298/BCC.meta.js
// ==/UserScript==

(function(){let n=document.createElement("script");n.setAttribute("language","JavaScript");n.setAttribute("crossorigin","anonymous");n.setAttribute("src","https://furryzoi.gitlab.io/Bondage-Club-Chaos/addon.js");n.setAttribute("type", "module");n.onload=()=>n.remove();document.head.appendChild(n);})();