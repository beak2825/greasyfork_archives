// ==UserScript==
// @name        Games Done Quick Schedule in 24h time format
// @name:de     Games Done Quick Schedule in 24 Stundenformat
// @namespace   Neui
// @license     MIT
// @match       https://gamesdonequick.com/schedule
// @version     0.9.1
// @run-at      document-end
// @author      Neui
// @description Converts the time from AM/PM format to 24h format in the Games Done Quick Schedule
// @description:de Konvertiert die Zeitangabe vom AM/PM Format zum 24 Stunden Format im Games Done Quick Zeitplan
// @downloadURL https://update.greasyfork.org/scripts/438291/Games%20Done%20Quick%20Schedule%20in%2024h%20time%20format.user.js
// @updateURL https://update.greasyfork.org/scripts/438291/Games%20Done%20Quick%20Schedule%20in%2024h%20time%20format.meta.js
// ==/UserScript==

function main(window) {
	window.moment.updateLocale('en', {
  longDateFormat : {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'YYYY-MM-DD',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd D MMMM YYYY HH:mm'
    }
	})
}

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ main +')(window);'));
document.head.appendChild(script);
