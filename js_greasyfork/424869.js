// ==UserScript==
// @name         Rohadjon meg a Totalcar
// @namespace    http://kisscsabi.com/
// @version      1.0.1
// @description  Blokkolja a reklámblokkoló-blokkolót
// @author       Jabybaby
// @match        https://totalcar.hu/*
// @icon         https://www.google.com/s2/favicons?domain=totalcar.hu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424869/Rohadjon%20meg%20a%20Totalcar.user.js
// @updateURL https://update.greasyfork.org/scripts/424869/Rohadjon%20meg%20a%20Totalcar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var FaszomcsicskaPopup = [...document.getElementsByTagName("a")].filter(el => el.innerHTML=="Kikapcsoltam, jöhet a tartalom")[0].parentElement.parentElement.parentElement;
    FaszomcsicskaPopup.parentElement.removeChild(FaszomcsicskaPopup)

    setTimeout(() => {    document.getElementsByTagName("body")[0].style="overflow: visible";}, 1000)

    
})();