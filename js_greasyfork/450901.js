// ==UserScript==
// @name         DOWN WITH SOCCER
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  elimina la strip dei risultati di champions da Repubblica.it
// @author       Nanni
// @match        https://www.repubblica.it/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450901/DOWN%20WITH%20SOCCER.user.js
// @updateURL https://update.greasyfork.org/scripts/450901/DOWN%20WITH%20SOCCER.meta.js
// ==/UserScript==
var champions = document.getElementById("as21-dashboard-wrapper");
    if(champions)
    {
        champions.style.display="none";
    }