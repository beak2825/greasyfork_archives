// ==UserScript==
// @name         Новогодний фавикон
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  New year favicon
// @author       AS7RID
// @match        *://zelenka.guru/*
// @match        *://lolz.live/*
// @match        *://lolz.guru/*
// @match        *://lzt.market/*
// @match        *://lzt.market/*
// @match        *://lolz.market/*
// @match        *://zelenka.market/*
// @icon         https://raw.githubusercontent.com/AS7RIDENIED/Lolzteam-Docs/main/favicon_ny.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482694/%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B8%D0%B9%20%D1%84%D0%B0%D0%B2%D0%B8%D0%BA%D0%BE%D0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/482694/%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B8%D0%B9%20%D1%84%D0%B0%D0%B2%D0%B8%D0%BA%D0%BE%D0%BD.meta.js
// ==/UserScript==

let ico = "https://raw.githubusercontent.com/AS7RIDENIED/Lolzteam-Docs/main/favicon_ny.ico";
for(let i=0; i<=10; i++){
    document.getElementsByTagName("link")[i].href = ico;
    document.getElementsByTagName("link")[i].setAttribute("type","icon");
    try
    {
        document.getElementsByTagName("link")[i].attributes.removeNamedItem("sizes");
    }
    catch{}
}