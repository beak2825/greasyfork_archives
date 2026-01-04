// ==UserScript==
// @name        Simulcast Calendar Dub Remover - crunchyroll.com
// @namespace   Violentmonkey Scripts
// @match       https://www.crunchyroll.com/simulcastcalendar
// @grant       none
// @version     1.0
// @author      farhil
// @description Removes dubs from simulcast calendar to reduce clutter
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444899/Simulcast%20Calendar%20Dub%20Remover%20-%20crunchyrollcom.user.js
// @updateURL https://update.greasyfork.org/scripts/444899/Simulcast%20Calendar%20Dub%20Remover%20-%20crunchyrollcom.meta.js
// ==/UserScript==

document.querySelectorAll('.releases li').forEach(e => {
    var text = e.querySelector('.season-name').textContent;
    if (text.includes('Dub)') && !text.includes('English Dub)')) {
        e.remove();
    }
});