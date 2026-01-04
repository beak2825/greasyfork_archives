// ==UserScript==
// @name         Zápis
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Zapsání na laborky
// @author       Anonym
// @match        https://student.vscht.cz/term_st2/index.php*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425920/Z%C3%A1pis.user.js
// @updateURL https://update.greasyfork.org/scripts/425920/Z%C3%A1pis.meta.js
// ==/UserScript==

(function() {

    'use strict';
   if(!window.localStorage.getItem("suc") || window.localStorage.getItem("suc") == "false")
   {
    try{window.localStorage.setItem("suc", "true");
        var a = document.getElementsByClassName("tab1")[1].getElementsByClassName("row1")[0].children[1].children[0].getAttribute("href")
        if (a != null)
        {
        window.location = a
        }
        else
        {
            window.localStorage.setItem("suc", "false")
            location.reload();
        }

       }
   catch(a){window.localStorage.setItem("suc", "false");
            location.reload()}
   }
    else
    {
        window.localStorage.removeItem("suc")
    }

 
})();