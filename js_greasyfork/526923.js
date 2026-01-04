// ==UserScript==
// @name         Zoom-Effekt für Artikel auf MyDealz deaktivieren
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Entfernt den 0,5 Sekunden Entgegenspring-Effekt beim Hovern auf Übersichtsseiten
// @match        https://www.mydealz.de/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/526923/Zoom-Effekt%20f%C3%BCr%20Artikel%20auf%20MyDealz%20deaktivieren.user.js
// @updateURL https://update.greasyfork.org/scripts/526923/Zoom-Effekt%20f%C3%BCr%20Artikel%20auf%20MyDealz%20deaktivieren.meta.js
// ==/UserScript==

GM_addStyle(`
    .thread--newCard,
    .thread--newCard:hover,
    .threadListCard,
    .threadListCard:hover,
    .threadListCard-image,
    .threadListCard-image:hover,
    .imgFrame,
    .imgFrame:hover,
    .imgFrame img {
        transition: none !important;   /* Übergangseffekte vollständig deaktivieren */
        transform: none !important;   /* Transformationen vollständig deaktivieren */
    }
`);