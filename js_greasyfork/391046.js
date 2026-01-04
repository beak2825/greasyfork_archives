// ==UserScript==
// @name         [DEAD AND OBSELETE] ExHentai Search Plus Tag (Start page)
// @namespace    https://exhentai.org/
// @version      0.3
// @description  Doesn't work anymore, delete it. For much better alternative check "Add button on exhentai searchbox" along with "Add button on exhentai searchbox from tag button" 
// @author       You
// @match        https://exhentai.org/*
// @exclude        https://exhentai.org/?f_search*
// @exclude        https://exhentai.org/watched?f_search*
// @exclude        https://exhentai.org/tag*
// @exclude        https://exhentai.org/g*
// @exclude        https://exhentai.org/popular*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391046/%5BDEAD%20AND%20OBSELETE%5D%20ExHentai%20Search%20Plus%20Tag%20%28Start%20page%29.user.js
// @updateURL https://update.greasyfork.org/scripts/391046/%5BDEAD%20AND%20OBSELETE%5D%20ExHentai%20Search%20Plus%20Tag%20%28Start%20page%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var sort = document.getElementsByClassName("nopm")[1];

    /* LINK LIST START */

    /* LINK TEMPLATE, copy, paste, uncomment, replace "Name" with any custom name, "link text" for your visible link text, replace "searched_tag" with your tag  */
    /*
    var linkName = document.createElement('a');
    var linkNameText = document.createTextNode("+link text");
    linkName.appendChild(linkNameText);
    linkName.href = fixUrl(document.URL,"searched_tag");
    linkName.style.fontSize = "12px";
    linkName.style.padding = "0px 10px";
    linkName.style.color = "#2eac01";
    sort.appendChild (linkName);
    */

    var linkEnglish = document.createElement('a');
    var linkEnglishText = document.createTextNode("+english");
    linkEnglish.appendChild(linkEnglishText);
    linkEnglish.href = document.URL+"?f_search=english";
    linkEnglish.style.fontSize = "12px";
    linkEnglish.style.padding = "0px 10px";
    sort.appendChild (linkEnglish);

    var linkAnal = document.createElement('a');
    var linkAnalText = document.createTextNode("+anal");
    linkAnal.appendChild(linkAnalText);
    linkAnal.href = document.URL+"?f_search=anal";
    linkAnal.style.fontSize = "12px";
    linkAnal.style.padding = "0px 10px";
    sort.appendChild (linkAnal);

    var linkRape = document.createElement('a');
    var linkRapeText = document.createTextNode("+rape");
    linkRape.appendChild(linkRapeText);
    linkRape.href = document.URL+"?f_search=rape";
    linkRape.style.fontSize = "12px";
    linkRape.style.padding = "0px 10px";
    sort.appendChild (linkRape);

    var linkBondage = document.createElement('a');
    var linkBondageText = document.createTextNode("+bondage");
    linkBondage.appendChild(linkBondageText);
    linkBondage.href = document.URL+"?f_search=bondage";
    linkBondage.style.fontSize = "12px";
    linkBondage.style.padding = "0px 10px";
    sort.appendChild (linkBondage);

    /* LINK LIST END */
    
})();