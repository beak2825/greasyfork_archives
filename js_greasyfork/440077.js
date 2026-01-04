// ==UserScript==
// @name        LNK_inventoryHide
// @author      NemoMan
// @namespace   LNK
// @description ГВД HWM - Прячет в инвентаре арты, помеченные звездочками
// @include     *heroeswm.ru/inventory.php*
// @version     1.1
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/440077/LNK_inventoryHide.user.js
// @updateURL https://update.greasyfork.org/scripts/440077/LNK_inventoryHide.meta.js
// ==/UserScript==

(function() {
	'use strict';

    function hideStars() {
        var elem = document.getElementsByClassName('filter_tab_active')[0];
        if ((elem.id == 'filter_tab1') || (elem.id == 'filter_tab1')) {
            for (elem of document.getElementsByClassName('inventory_item2')) {
                if (elem.getElementsByClassName('inventory_star_corner').length > 0) {
                    elem.style.display = 'none';
                }
            }
        }
    } // hideStars

    function hidePause() { setTimeout(hideStars, 500); }

    filter_tab1.addEventListener("click", hideStars);
    hwm_no_zoom.addEventListener("click", hidePause);

    hideStars()
 
 })();
