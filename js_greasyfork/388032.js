// ==UserScript==
// @name         Hotel link in card SLT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://cms.sletat.ru/HotelCard.aspx?hotel=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388032/Hotel%20link%20in%20card%20SLT.user.js
// @updateURL https://update.greasyfork.org/scripts/388032/Hotel%20link%20in%20card%20SLT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //<a href="http://www.kipriotishotel.gr">http://www.kipriotishotel.gr</a>
    var link = document.createElement('div');
    link.setAttribute("style", "background: #fff; border: 1px solid #ccc; padding: 2px; margin-top: 3px");
    var siteAdr = gi_site.innerHTML.replace('https://','');
    siteAdr = siteAdr.replace('http://','');
    link.innerHTML = '<a target="_blank" href="http://' + siteAdr + '">' + gi_site.innerHTML + '</a>'
    if (gi_site.innerHTML.length > 1 ) {document.querySelector("#GeneralInfo > table > tbody > tr:nth-child(9) > td:nth-child(2)").appendChild(link);}


})();