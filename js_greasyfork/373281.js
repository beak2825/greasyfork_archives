// ==UserScript==
// @name         GOG.com Wishlist Discounted Items Toggle
// @version      1.0
// @namespace    https://greasyfork.org/users/219548
// @description  When items in your GOG.com wishlist are discounted, only the discounted items will be shown. Provides a toggle to display all items and remembers your last setting.
// @author       mnnks
// @grant        GM_setValue
// @grant        GM_getValue
// @include      https://www.gog.com/account/wishlist
// @downloadURL https://update.greasyfork.org/scripts/373281/GOGcom%20Wishlist%20Discounted%20Items%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/373281/GOGcom%20Wishlist%20Discounted%20Items%20Toggle.meta.js
// ==/UserScript==

function conjureUpStylesheet() {
    var stylesheet = document.createElement("style");
    stylesheet.type = "text/css";
    stylesheet.textContent = ".account__products .product-row {\ndisplay: none;\n}\n\n.account__products .is-discounted";
    stylesheet.textContent += "{\ndisplay: block;\n}\n\n.discount-toggle .menu-link {\ncolor: white;\n}";
    document.body.appendChild(stylesheet);
    // check the last stored setting to determine if we need to deactivate the stylesheet
    stylesheet.disabled = displayAllItems;
    return stylesheet;
}

var numberOfDiscountedItems = document.getElementsByClassName("is-discounted").length;

if (numberOfDiscountedItems) {
    //displayDiscountedCount(numberOfDiscountedItems); // probleem met 'clear filters'
    //var displayAllItems = confirm('Show only discounted items?');
    var displayAllItems = GM_getValue("displayAllItems", false);

    // create stylesheet to hide nondiscounted items
    var cssDiscountedOnly = conjureUpStylesheet();

    // create toggle switch...
    var discountedToggleDiv = document.createElement("div");
    discountedToggleDiv.className = "menu-tray";
    discountedToggleDiv.innerHTML = '<div class="menu-item discount-toggle"><a class="menu-link menu-link" id="toggleDiscounted">-%</a></div>';
    // ...and inject it into the menu bar
    var menu = document.getElementsByClassName("menu__container");
    menu[0].appendChild(discountedToggleDiv);

    function toggleDiscountedOnly() {
        displayAllItems = !displayAllItems;
        cssDiscountedOnly.disabled = displayAllItems;
        GM_setValue("displayAllItems", displayAllItems);
    }
    document.getElementById("toggleDiscounted").addEventListener("click", toggleDiscountedOnly);
}

