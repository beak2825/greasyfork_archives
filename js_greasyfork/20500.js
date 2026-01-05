// ==UserScript==
// @name         Afficher Signature au Passage de la souris
// @namespace    https://forum.fantabobworld.com/*
// @version      1.0
// @description  ----------------
// @author       Marentdu93
// @match        https://forum.fantabobworld.com/i*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20500/Afficher%20Signature%20au%20Passage%20de%20la%20souris.user.js
// @updateURL https://update.greasyfork.org/scripts/20500/Afficher%20Signature%20au%20Passage%20de%20la%20souris.meta.js
// ==/UserScript==

function funcr()
{
    var css = "<style>.signature:before { content: \"Signature Cachée ! Passer la souris dessus pour voir\"; font-weight: bold; } .signature:hover:before { content: \"\"; } .signature{ height: 16px; overflow: hidden; } .signature:hover{ height: auto; }</style>";
    $("head").append(css);
}

$(document).ready(funcr);