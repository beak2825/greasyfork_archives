// ==UserScript==
// @name         Granja
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  autoclick cofre y agua
// @author       You
// @match        https://campaign.aliexpress.com/wow/gcp/gold-coin-v3/*
// @icon         https://ae01.alicdn.com/images/eng/wholesale/icon/aliexpress.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434477/Granja.user.js
// @updateURL https://update.greasyfork.org/scripts/434477/Granja.meta.js
// ==/UserScript==
function cofre()
{
    if(document.getElementsByClassName("btn-sign")[0] != null)
    {
        document.getElementsByClassName("btn-sign")[0].click();
    }
    if(document.getElementsByClassName("btn abs dombtn")[0] != null)
    {
        document.getElementsByClassName("btn abs dombtn")[0].click();
    }
    if(document.getElementsByClassName("btn abs")[0] != null)//cerrar
    {
        document.getElementsByClassName("btn abs")[0].click();
    }
}


(function() {
    cofre();
    setInterval(function()
    {
        cofre();
    }, 21600000)
    setInterval(function() {
        if(document.getElementsByClassName("btn abs dombtn")[0] != null)
        {
            if(document.getElementsByClassName("btn abs dombtn")[0].innerHTML.indexOf("Conseguir") != -1)
            {

                document.getElementsByClassName("btn abs dombtn")[0].click();

            }
        }
        if(document.getElementsByClassName("btn abs")[0] != null)//cerrar
        {
            document.getElementsByClassName("btn abs")[0].click();
        }

    }, 1000)
})();


