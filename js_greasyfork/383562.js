// ==UserScript==
// @name            Equip / Unequip items
// @version         0.1
// @description  Equip and unequip a set of items with a click of a button
// @author          FATU
// @match          https://www.torn.com/item.php
// @require         https://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/191331
// @downloadURL https://update.greasyfork.org/scripts/383562/Equip%20%20Unequip%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/383562/Equip%20%20Unequip%20items.meta.js
// ==/UserScript==

$(window).on("load", function() {
    var itemRow = $("#all-items li");

    // Create array of equipped items
    function equippedItems(element) {
        var equippedItems = [];

        element.each(function() {
            if ($(this).attr("data-equipped") === "true") {
                equippedItems.push({
                    ["id"]: $(this).attr("data-item"),
                    ["element"]: $(this)
                });
            }
        });

        return equippedItems;
    }

    // Unequip items using equipped array
    function unequipItems(item) {
        $.each(item, function() {
            this["element"].find(".unequipped")[0].click();
        });
    }

    function reequipItems(item) {
        $.each(item, function() {
            itemRow.find(`[data-item=${this['id']}]`).find('.equip')[0].click();
        });
    }

    function renderOptions() {
        var unequipButton = `<button id="unequip-all">Unequip all</button>`;
        var equipButton = `<button id='reequip-all'>Re-equip all</button>`;

        $(".items-wrap").prepend(unequipButton + equipButton);
    }

    $(document).on("click", "#unequip-all", function() {
        unequipItems(equippedItems(itemRow));
        localStorage.setItem('previousEquippedItems', JSON.stringify(equippedItems(itemRow)));
    });

    $(document).on('click', '#reequip-all', function() {
        reequipItems(JSON.parse(localStorage.previousEquippedItems));
        localStorage.removeItem('previousEquippedItems');
    });

    renderOptions();
});