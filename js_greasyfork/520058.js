// ==UserScript==
// @name         SankakuComplex - Removes pop-up promoting AI from platform
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  the title is self-explanatory
// @author       mtpontes
// @match       *://chan.sankakucomplex.com/*
// @match       *://idol.sankakucomplex.com/*
// @match       *://legacy.sankakucomplex.com/*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABbmlDQ1BpY2MAACiRdZHPKwRhGMc/dolYbeIgOewBOeyWKDlqFZflsFZZXGZmZ3fVzphmZpNclYuDchAXvw7+A67KlVKKlOTgL/DrIo3n3VUr8U7vPJ++7/t9et/vC6FUybC8+gGwbN9NTyRjs9m5WOMTETpoox00w3Mmp8cz/Dveb6hT9Tqhev2/78/RkjM9A+qahIcNx/WFR4VTy76jeEO4wyhqOeF94bgrBxS+ULpe5UfFhSq/KnYz6TEIqZ6xwg/Wf7BRdC3hfuEeq1Q2vs+jbhIx7ZlpqV0yu/FIM0GSGDplFinhk5BqS2Z/+wYqvimWxGPI32EFVxwFiuKNi1qWrqbUvOimfCVWVO6/8/TyQ4PV7pEkNDwEwUsvNG7B52YQfBwEwechhO/hzK75lySnkTfRN2tazx5E1+DkvKbp23C6Dp13juZqFSksM5TPw/MxtGah/Qqa56tZfa9zdAuZVXmiS9jZhT7ZH134ArhcZ+m/WStSAAAACXBIWXMAAAsSAAALEgHS3X78AAAAeElEQVQ4y2NgoCX4Xyb7H4TxqWHCo7keG5toA4CgAQebsAHYbMTlCiYibMfrCiZibcIlx0SE3/GGBRM+Gxi7HjeCMD41TESGPE5XMOGzHRsbnxcIxbsDDAMts4cbjmR7A4kpvQHkMiZCKY1QSmXBZTKedNBA1RwLAFCeNCTVhz2FAAAAAElFTkSuQmCC
 
// @grant        none
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/520058/SankakuComplex%20-%20Removes%20pop-up%20promoting%20AI%20from%20platform.user.js
// @updateURL https://update.greasyfork.org/scripts/520058/SankakuComplex%20-%20Removes%20pop-up%20promoting%20AI%20from%20platform.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button = document.getElementById("toggleButton");
    
    if (button) button.remove();
})();