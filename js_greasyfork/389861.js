// ==UserScript==
// @name         MouseHunt - Sort charms by quantity
// @author       zseir
// @namespace    https://greasyfork.org/en/users/367506-zseir
// @version      1.1
// @description  Sort charms by quantity
// @include      https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/389861/MouseHunt%20-%20Sort%20charms%20by%20quantity.user.js
// @updateURL https://update.greasyfork.org/scripts/389861/MouseHunt%20-%20Sort%20charms%20by%20quantity.meta.js
// ==/UserScript==



$(document).ready(function() {

   
    if (document.getElementsByClassName('campPage-trap-armedItem trinket active')) {
        if (document.getElementsByClassName('campPage-trap-itemBrowser-filter sortBy')) {
            document.getElementsByClassName('campPage-trap-itemBrowser-filter sortBy')[0].children[1].append(new Option('Quantity', 'quantity'));
        }
    }

});