// ==UserScript==
// @name         One Courier by Allegro - add tracking link
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add button with link to tracking information for each shipments in client portal.
// @author       pleswi
// @match        https://portal.wedo.cz/cs/shipments/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wedo.cz
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444923/One%20Courier%20by%20Allegro%20-%20add%20tracking%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/444923/One%20Courier%20by%20Allegro%20-%20add%20tracking%20link.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = jQuery.noConflict(true);

    // projdeme všechny řádky tabulky s daty (přeskočíme hlavičku)
    $("table tbody tr").each(function() {
        var $cells = $(this).find("td");
        if ($cells.length < 3) return; // pokud řádek nemá dost buněk, přeskoč

        var orderNumber = $.trim($cells.eq(1).text()); // druhý sloupec
        var refNumber   = $.trim($cells.eq(2).text()); // třetí sloupec

        // kontrola, že čísla existují
        if (orderNumber && refNumber) {
            var link = "https://trace.wedo.cz/index.php?orderNumber=" + encodeURIComponent(orderNumber)
                     + "&customerNumber=" + encodeURIComponent(refNumber);

            // vytvoříme SVG ikonu s odkazem
            var $icon = $('<a>', {
                class: "button button-small list-icon",
                href: link,
                target: "_blank",
                html: '<svg class="bi" width="20" height="20" fill="currentColor">' +
                      '<use xlink:href="/static/vendor/bootstrap-icons/bootstrap-icons.svg#box-seam"></use></svg>'
            });

            // přidáme do 13. sloupce (index 12)
            if ($cells.eq(12).length) {
                $cells.eq(12).append($icon);
            }
        }
    });
})();