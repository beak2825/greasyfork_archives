// ==UserScript==
// @name         Shoptet Adm+ [FrameStar] - Nové rychlé  tlačítko "Přidat produkt" nad seznam položek objednávky
// @namespace    http://framestar.cz/
// @version      1.0.1
// @description  Přidá tlačítko pro přidání položky nad seznam položek v objednávce
// @author       Jiri Poucek
// @match        */admin/objednavky-detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medovinarna.cz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460257/Shoptet%20Adm%2B%20%5BFrameStar%5D%20-%20Nov%C3%A9%20rychl%C3%A9%20%20tla%C4%8D%C3%ADtko%20%22P%C5%99idat%20produkt%22%20nad%20seznam%20polo%C5%BEek%20objedn%C3%A1vky.user.js
// @updateURL https://update.greasyfork.org/scripts/460257/Shoptet%20Adm%2B%20%5BFrameStar%5D%20-%20Nov%C3%A9%20rychl%C3%A9%20%20tla%C4%8D%C3%ADtko%20%22P%C5%99idat%20produkt%22%20nad%20seznam%20polo%C5%BEek%20objedn%C3%A1vky.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var m = $("meta[name='author']");
    if (m == null || m.length !=1) return;
    if (m.attr("content")!="Shoptet.cz") return;

    $(document).ready(function(){
        $('.std-filter').append($('<span class="open-modal"><a class="btn btn-md btn-default" href="/admin/pridat-polozku-objednavky/?documentId=' + new URL(location.href).searchParams.get('id') + '&amp;parentControllerReferer=/admin/prehled-objednavek/">Přidat produkt</a></span>'));
    });

})();