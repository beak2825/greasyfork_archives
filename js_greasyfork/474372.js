// ==UserScript==
// @name         Allegro - "Wystawione w ciągu"
// @version      0.3
// @description  Przywraca opcję "Wystawione w ciągu"
// @author       Vomar
// @match        https://allegro.pl/kategoria/*
// @match        https://allegro.pl/listing?*
// @grant        none
// @namespace    https://greasyfork.org/users/156999
// @downloadURL https://update.greasyfork.org/scripts/474372/Allegro%20-%20%22Wystawione%20w%20ci%C4%85gu%22.user.js
// @updateURL https://update.greasyfork.org/scripts/474372/Allegro%20-%20%22Wystawione%20w%20ci%C4%85gu%22.meta.js
// ==/UserScript==

window.addEventListener("load", function() {
    'use strict';
    var selectElement = document.getElementById("allegro.listing.sort");
    if (selectElement === null) {
        return;
    }

    var selectedStartingTime = getParameterByName('startingTime');
    addOptionToSelect(selectElement, '', "-- Wystawione w ciągu: --", selectedStartingTime);
    addOptionToSelect(selectElement, '1', "1 godziny", selectedStartingTime);
    addOptionToSelect(selectElement, '2', "2 godzin", selectedStartingTime);
    addOptionToSelect(selectElement, '3', "3 godzin", selectedStartingTime);
    addOptionToSelect(selectElement, '4', "4 godzin", selectedStartingTime);
    addOptionToSelect(selectElement, '5', "5 godzin", selectedStartingTime);
    addOptionToSelect(selectElement, '6', "12 godzin", selectedStartingTime);
    addOptionToSelect(selectElement, '7', "24 godzin", selectedStartingTime);
    addOptionToSelect(selectElement, '8', "2 dni", selectedStartingTime);
    addOptionToSelect(selectElement, '9', "3 dni", selectedStartingTime);
    addOptionToSelect(selectElement, '10', "4 dni", selectedStartingTime);
    addOptionToSelect(selectElement, '11', "5 dni", selectedStartingTime);
    addOptionToSelect(selectElement, '12', "6 dni", selectedStartingTime);
    addOptionToSelect(selectElement, '13', "7 dni", selectedStartingTime);

    // Listener dla zmian w rozwijanej liście
    selectElement.addEventListener("change", function() {
        window.location.href = updateUrlParameter(window.location.href, 'startingTime', this.value);
    });
});

function addOptionToSelect(selectElement, value, label, selectedValue) {
    var option = document.createElement("option");
    option.value = value;
    option.selected = value === selectedValue;
    option.textContent = label;
    selectElement.appendChild(option);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function updateUrlParameter(uri, key, value) {
    var i = uri.indexOf('#');
    var hash = i === -1 ? '' : uri.substr(i);
    uri = i === -1 ? uri : uri.substr(0, i);
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.includes('?') ? "&" : "?";
    if (uri.match(re)) {
        uri = uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        uri = uri + separator + key + "=" + value;
    }
    return uri + hash;
}
``
