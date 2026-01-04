// ==UserScript==
// @name        Meet automatsko prihvacanje
// @namespace   HolyC.com
// @include     *meet.google.com*
// @exclude     none
// @version     0.0.1
// @description:en	Automatically admits Google Meet participants
// @grant    		none
// @description Automatski prihvaca zahtjeve za pridruzivanjem Google Meet sastanku
// @downloadURL https://update.greasyfork.org/scripts/420369/Meet%20automatsko%20prihvacanje.user.js
// @updateURL https://update.greasyfork.org/scripts/420369/Meet%20automatsko%20prihvacanje.meta.js
// ==/UserScript==

function admitUserIfWaiting() {
  const divElements = document.getElementsByTagName('DIV');
  for (let i = 0; i < divElements.length; i += 1) {
    const div = divElements[i];
    if (div.innerText === 'Prihvati') {
      console.log(`Prihvacam korisnike automatski.`);
      div.click();
    }
  }
}

function worker() {
  try {
    admitUserIfWaiting();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

setInterval(worker, 2000);
