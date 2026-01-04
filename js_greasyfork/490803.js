// ==UserScript==
// @name:en      Otomoto USA Detector
// @name         Otomoto Wykrywanie Samochodów z USA
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description     Wyszukuje słowa kluczowe ("Stany Zjednoczone" i "USA") i wyświetla alert w momencie znalezienia co najmniej jednego z nich
// @description:en  Shows an alert when detects a car from USA on Otomoto.pl offers
// @author       Fifen
// @match        https://www.otomoto.pl/osobowe/oferta/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490803/Otomoto%20Wykrywanie%20Samochod%C3%B3w%20z%20USA.user.js
// @updateURL https://update.greasyfork.org/scripts/490803/Otomoto%20Wykrywanie%20Samochod%C3%B3w%20z%20USA.meta.js
// ==/UserScript==

var xpathResult = document.evaluate("(//text()[contains(., 'Stany Zjednoczone') or contains(., 'USA')])[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
var node = xpathResult.singleNodeValue;
if (node != null) {
  alert("SAMOCHÓD Z USA");
}
