// ==UserScript==
// @name         Sportscards links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Usefull links when buying sportscards
// @author       You
// @match        https://www.ebay.com/itm/*
// @connect      https://www.ebay.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448174/Sportscards%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/448174/Sportscards%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //get item title
    var title = document.querySelectorAll("h1");
    var term = title[0].innerText.replace(/\*|\.\&\,\|/g,'');

    //create div
    var linkbox = document.createElement("div");
    linkbox.innerHTML = '<div style=" ' +
        'border: 1px solid #000000; margin: 5px 0; padding:10px ;">' +
        '<h2 style="margin: 2px 0 1px 0;"> ' +
        '<a href="https://www.ebay.com/sch/i.html?_from=R40&_nkw='+encodeURIComponent(term)+'&_sacat=0&LH_TitleDesc=0&LH_Sold=1&LH_Complete=1&_dmd=1&rt=nc" target="_blank">Sold items</a>'+
        ' - <a href="https://www.comc.com/Cards,='+encodeURIComponent(term)+'" target="_blank">Comc</a>'+
        ' - <a href="https://www.ebay.com/sh/research?marketplace=ALL&keywords='
        +encodeURIComponent(term)
        +'&dayRange=365&endDate=1656573196277&startDate=1425037196277&categoryId=0&offset=0&limit=50&sorting=-datelastsold&tabName=SOLD&tz=Europe%2FAmsterdam" target="_blank">Terapeak</a>'+
        ' - <a href="https://www.psacard.com/pop#0%7C'+encodeURIComponent(term)+'" target="_blank">PSA POP</a>'+
        ' - <a href="https://www.google.com/search?q=site%3Ahttps%3A%2F%2Fwww.gemrate.com+'+encodeURIComponent(term)+'" target="_blank">Gemrate</a>'
    '</h2></div>';

    title[0].parentNode.insertBefore(linkbox, title[0].nextSibling);
})();