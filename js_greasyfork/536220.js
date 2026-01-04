// ==UserScript==
// @name         DuckDuckGoYaMaps
// @namespace    http://tampermonkey.net/
// @version      2025-05-16
// @description  Opens Yandex Maps instead of built-in OpenMaps
// @author       commensal
// @match        https://duckduckgo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duckduckgo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536220/DuckDuckGoYaMaps.user.js
// @updateURL https://update.greasyfork.org/scripts/536220/DuckDuckGoYaMaps.meta.js
// ==/UserScript==

window.addEventListener('load',
  function() {
var mapelement = document.evaluate("//a[contains(., 'Карты')]", document, null, XPathResult.ANY_TYPE, null );
var mapthiselement = mapelement.iterateNext();
var maptarget = document.querySelector("input.js-search-input.search__input--adv");

console.log(mapthiselement); // Prints the html element in console
console.log(maptarget.value);

mapthiselement.innerHTML += "(Я)";
mapthiselement.onclick= function() { window.open('https://yandex.ru/maps/213/moscow/search/' + maptarget.value, '_blank');};
}, false);