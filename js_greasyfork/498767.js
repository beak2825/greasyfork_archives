// ==UserScript==
// @match            https://www.thetrainline.com/*
// @name             Trainline for travel, not accomodation
// @description      Uncheck booking.com search on Trainline
// @name:fr          Trainline pour le transport, pas l'hébergement
// @description:fr   Décoche la recherche booking.com sur Trainline
// @namespace        acratomatic
// @version          1.0
// @author           acratomatic
// @license          AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/498767/Trainline%20for%20travel%2C%20not%20accomodation.user.js
// @updateURL https://update.greasyfork.org/scripts/498767/Trainline%20for%20travel%2C%20not%20accomodation.meta.js
// ==/UserScript==

document.getElementById("bookingPromo").checked = false