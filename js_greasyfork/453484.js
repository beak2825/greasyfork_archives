// ==UserScript==
// @name        MH - Apothecary Potion Description
// @version     1.0.1
// @description Show potion description in Apothecary
// @author      Maidenless
// @match       https://www.mousehuntgame.com/shops.php?tab=general_store&sub_tab=all
// @match       https://www.mousehuntgame.com/shops.php?tab=general_store
// @match       https://apps.facebook.com/mousehunt/shops.php?tab=general_store&sub_tab=all
// @match       https://apps.facebook.com/mousehunt/shops.php?tab=general_store
// @resource    https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css
// @require     https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @icon        https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @namespace   https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/453484/MH%20-%20Apothecary%20Potion%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/453484/MH%20-%20Apothecary%20Potion%20Description.meta.js
// ==/UserScript==

$(document).ready(function () {
    var txt = $(
        $(
            ".mousehuntHud-page-tabHeader.general_store.apothecaryStore.active"
        )[0].innerText
    );
    if (txt.selector != "Apothecary") {
        return;
    }
    hg.utils.UserInventory.getItemsByClass("potion", true, () => {
        var potions = document.querySelectorAll(
            "[data-item-classification = potion]"
        );
        for (let i = 0; i < potions.length; i++) {
            potions[i].children[0].children[0].style.cursor = "pointer";
            potions[i].children[0].children[0].onclick = () => {
                hg.views.ItemView.show(
                    potions[i].getAttribute("data-item-type")
                );
            };
        }
    });
});
