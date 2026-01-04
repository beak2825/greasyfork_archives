// ==UserScript==
// @name         Oncheshack pour onche.org
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Voir les images d'oncheshack sur onche.org (onche.party v3)
// @author       posi
// @match        https://onche.org/*
// @icon         https://onche.org/favicon.ico
// @grant        none
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/437260/Oncheshack%20pour%20oncheorg.user.js
// @updateURL https://update.greasyfork.org/scripts/437260/Oncheshack%20pour%20oncheorg.meta.js
// ==/UserScript==

(function()
{
    const messages = document.getElementsByClassName("message-content");

    for(var i = 0 ; i < messages.length ; i++)
    {
        messages[i].innerHTML = messages[i].innerHTML.replace(/\<a href\=\"http:\/\/oncheshack\.rf\.gd\/upload(.*)?\"\>(.*)?\<\/a\>/g, "<img src=\"http://oncheshack.rf.gd/upload$1\" alt=\"Oncheshack\" title=\"Oncheshack\"/>");
    }
})();