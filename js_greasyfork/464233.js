// ==UserScript==
// @name         GGn Trading Card Sorter Basic
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      MIT
// @description  Sort Trading Cards in Inventory by Card Category.
// @author       drlivog
// @match        https://*gazellegames.net/user.php?*action=inventory*&category=Trading+Cards*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464233/GGn%20Trading%20Card%20Sorter%20Basic.user.js
// @updateURL https://update.greasyfork.org/scripts/464233/GGn%20Trading%20Card%20Sorter%20Basic.meta.js
// ==/UserScript==

/* globals $ */

const sort_on_load = true;

let sort=1;

$(document).ready(function() {
    'use strict';
    const button = $('<input type="button" value="Sort Cards" id="sort_cards">').click(function() {
        if (sort==1) {
            console.log("Ascending");
            $(this).val("Sort Cards (v)");
        } else {
            console.log("Descending");
            $(this).val("Sort Cards (^)");
        }
        let cells = $('#items_list li').get();
        cells.sort(function(a,b) {
            let cat_a = $(a).find('div.center.item_description').text().match(/Category:\s(\w+)/i);
            let cat_b = $(b).find('div.center.item_description').text().match(/Category:\s(\w+)/i);
            if (cat_a && cat_b) { //matched category for both
                cat_a = cat_a[1].toLowerCase(); //get category part of match
                cat_b = cat_b[1].toLowerCase();
                if (cat_a < cat_b) return sort*(-1);
                if (cat_a > cat_b) return sort;
                if (cat_a === cat_b) { //if category the same, sort by name
                    let name_a = $(a).find('div#clickable h3').text().toLowerCase();
                    let name_b = $(b).find('div#clickable h3').text().toLowerCase();
                    return name_a.localeCompare(name_b)*sort;
                }
            }
        });
        sort*=-1;
        const list = $('#items_list');
        $.each(cells, function(index, row) {
            list.append(row);
        });
    }).insertBefore('#items_list');
    if (sort_on_load) button.click();
});