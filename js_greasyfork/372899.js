// ==UserScript==
// @name         SGK Go Back To XML
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @include        https://ebildirge.sgk.gov.tr/EBildirgeV*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/372899/SGK%20Go%20Back%20To%20XML.user.js
// @updateURL https://update.greasyfork.org/scripts/372899/SGK%20Go%20Back%20To%20XML.meta.js
// ==/UserScript==

(function() {
    'use strict';
    debugger;

    XmlYukleSayfasinda();

    if(localStorage.xmlYukleniyor === "true")
    {
        if(window.BaslikVarMi("Onay Bekleyen Bildirge Listesi"))
        {
            localStorage.xmlYukleniyor = "false";
            localStorage.xmlAnaSayfandanGit = "true";
            setTimeout(function() {
                document.querySelector("#navigation > li:nth-child(2) > a").click();
            }, window.TikDelay);
            return;
        }
    }

    if(window.BaslikVarMi("ANASAYFA"))
    {
        localStorage.xmlYukleniyor = "false";
        if(localStorage.xmlAnaSayfandanGit === "true")
        {
            localStorage.xmlAnaSayfandanGit = "false";
            setTimeout(function() {
                document.querySelector("#contentContainer > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > div > table:nth-child(5) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > a").click();
            }, window.TikDelay);
            return;
        }
    }
})();

function XmlYukleSayfasinda()
{
    if(!window.BaslikVarMi("Aylık Prim ve Hizmet Belgesi XML Dosya Transferi")) {
        return;
    }

    localStorage.xmlYukleniyor = "true";

    let file = document.getElementById("uploadFileId");
    file.style.height = "200px";
    file.style.width = "400px";
    file.style.backgroundColor = "#eeffee";
    file.addEventListener("change", function() {
        document.getElementById("xmlTahakkukdosyaYukle_0").click();
    });
}