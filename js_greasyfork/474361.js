// ==UserScript==
// @name         Tout copier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!!!
// @author       You
// @match        https://www.dreadcast.net/Main
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dreadcast.net
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/474361/Tout%20copier.user.js
// @updateURL https://update.greasyfork.org/scripts/474361/Tout%20copier.meta.js
// ==/UserScript==


$( document ).ready(function() {

    function copyNames() {
      const nomsSpan = Object.values($('.contact_nom'));

      let noms = '';
      nomsSpan.forEach(nomSpan => {
          if(nomSpan.innerText !== undefined) {
              noms += nomSpan.innerText + '\n'
          }
      })

        navigator.clipboard.writeText(noms);

    }

    const toutCopier = $('<li>Tout copier</li>').click(copyNames);
    $('#contact_action_list').append(toutCopier);

});