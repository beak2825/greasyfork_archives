// ==UserScript==
// @name         ZoneBourse block scroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Débloquer le défilement sur ZoneBourse
// @author       xlo
// @match        *://www.zonebourse.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483865/ZoneBourse%20block%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/483865/ZoneBourse%20block%20scroll.meta.js
// ==/UserScript==

setTimeout(function() {
    document.body.style.overflow = 'visible';
}, 10); // Attend 5 secondes avant d'exécuter