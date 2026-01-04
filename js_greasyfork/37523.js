// ==UserScript==
// @name         Allegro - "Wystawione w ciągu"
// @namespace    https://tangelo.pl/
// @version      0.3
// @description  Przywraca opcję "Wystawione w ciągu"
// @author       MastaBombasta
// @match        https://allegro.pl/kategoria/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37523/Allegro%20-%20%22Wystawione%20w%20ci%C4%85gu%22.user.js
// @updateURL https://update.greasyfork.org/scripts/37523/Allegro%20-%20%22Wystawione%20w%20ci%C4%85gu%22.meta.js
// ==/UserScript==

window.addEventListener("load", function() {
    'use strict';

    var filterMenu = document.getElementById("opbox-filters");
	if (filterMenu === null) {
		return;
	}

	var offerMenu = filterMenu.firstChild.lastChild;
    var listElements = offerMenu.getElementsByTagName('li');
    var lastElement = listElements[listElements.length - 1];

    var labelSpan = document.createElement('span');

    var dropdownElementContainer = document.createElement("li");
    dropdownElementContainer.setAttribute("class", lastElement.getAttribute('class'));
    lastElement.parentNode.insertBefore(dropdownElementContainer, lastElement.nextSibling);

    var selectElements = document.getElementsByTagName("select");
    var selectClass = selectElements[0].getAttribute('class');
    var select = document.createElement("select");
    select.setAttribute("class", selectClass);

    var queryStringValue = getParameterByName('startingTime');
    addOptionToSelect(select, '', "Dowolnego czasu", queryStringValue);
    addOptionToSelect(select, '1', "1 godziny", queryStringValue);
    addOptionToSelect(select, '2', "2 godzin", queryStringValue);
    addOptionToSelect(select, '3', "3 godzin", queryStringValue);
    addOptionToSelect(select, '4', "4 godzin", queryStringValue);
    addOptionToSelect(select, '5', "5 godzin", queryStringValue);
    addOptionToSelect(select, '6', "12 godzin", queryStringValue);
    addOptionToSelect(select, '7', "24 godzin", queryStringValue);
    addOptionToSelect(select, '8', "2 dni", queryStringValue);
    addOptionToSelect(select, '9', "3 dni", queryStringValue);
    addOptionToSelect(select, '10', "4 dni", queryStringValue);
    addOptionToSelect(select, '11', "5 dni", queryStringValue);
    addOptionToSelect(select, '12', "6 dni", queryStringValue);
    addOptionToSelect(select, '13', "7 dni", queryStringValue);

    labelSpan.innerHTML = 'Wystawione w ciągu:';
    labelSpan.style.fontSize = 'small';
    labelSpan.style.color = "#7f7f7f";

    dropdownElementContainer.appendChild(labelSpan);
    dropdownElementContainer.appendChild(select);

    select.addEventListener("change", function() {
        window.location.href = updateUrlParameter(window.location.href, 'startingTime', this.value);
    });

});

function addOptionToSelect(selectElement, optionValue, optionName, queryStringParam) {
    var option = document.createElement("option");
    option.value = optionValue;
    if (optionValue == queryStringParam) {
        option.selected = true;
    } else {
        option.selected = false;
    }
    option.innerHTML = optionName;
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
    // remove the hash part before operating on the uri
    var i = uri.indexOf('#');
    var hash = i === -1 ? ''  : uri.substr(i);
         uri = i === -1 ? uri : uri.substr(0, i);

    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        uri = uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        uri = uri + separator + key + "=" + value;
    }
    return uri + hash;  // finally append the hash as well
}

