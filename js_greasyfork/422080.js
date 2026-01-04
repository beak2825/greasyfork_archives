// ==UserScript==
// @name         DV Easy Trade Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shift+Right-click on an item in your inventory to search Dappervolk's trades market for that item 
// @author       Libby
// @include      https://dappervolk.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/422080/DV%20Easy%20Trade%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/422080/DV%20Easy%20Trade%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function searchForAltText(imageAltText) {
        // then do the search for the alt text using openInTab stuff
        var searchURL = "https://dappervolk.com/trades?search=" + encodeURIComponent(imageAltText) + "&in=item&item_type=&type=all&order=lowest";
        // console.log(searchURL);
        GM_openInTab(searchURL);
    }

    var items = document.getElementsByClassName("inventory-item");
    for (var i = 0; i < items.length; i++)
        items[i].addEventListener("contextmenu", initMenu, false);

    // execute on shift + right click
    function initMenu(aEvent) {
        if (aEvent.shiftKey) {
            var name = aEvent.currentTarget.getAttribute("data-name") ? aEvent.currentTarget.getAttribute("data-name") : aEvent.currentTarget.getAttribute("title");
            searchForAltText(name);
        }
    }
})();