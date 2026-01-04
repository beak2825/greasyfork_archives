// ==UserScript==
// @name         Annyoying Font Remover
// @description  Remove annoying fonts to let the browser use less annoying fallbacks
// @version      1.6
// @author       Me
// @namespace    greasyfork.org/en/users/301031
// @homepageURL  https://greasyfork.org/scripts/407513-annyoying-font-remover
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/407513/Annyoying%20Font%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/407513/Annyoying%20Font%20Remover.meta.js
// ==/UserScript==

(function() {
  // ↓ Keep this list alphabetical otherwise it can become unmanageable.
  var badFnt = new RegExp ('"?'+
                           ['arial[^",]*',
                            'cambria',
                            'charter',
                            'courier[^",]*',
                            "crimson text",
                            'faustina',
                            'franklin gothic',
                            'freesans',
                            'georgia',
                            'helvetica[^",]*',
                            'itc-slimbach',
                            'liberation mono',
                            'libre baskerville',
                            'lucida[^",]*',
                            'minion-pro',
                            'NexusSerif',
                            'PT Serif',
                            'roboto',
                            'roboto mono',
                            'roman',
                            'spectral',
                            'times[^",]*'].join('"?, ?|"?')+
                           '"?, ?', 'gi');
  //console.log(badFnt);
  document.addEventListener('DOMContentLoaded', function() {
    var elem = document.body.getElementsByTagName('*');
    for (var i = 0; i < elem.length; i++) {
      var fonts = window.getComputedStyle(elem[i]).getPropertyValue('font-family');
      var weight = window.getComputedStyle(elem[i]).getPropertyValue('font-weight');
      if(fonts) {
        elem[i].style.fontFamily = fonts.replace(badFnt, '');
        // The "bug" is that the last listed fallback is selected,
        // even if it is one of the annoying fonts.
        elem[i].style.fontWeight=Math.max(weight,400);
      }
    }
  });
})();