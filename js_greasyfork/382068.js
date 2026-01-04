// ==UserScript==
// @name         No Action Button for Seby
// @namespace    http://v3rmillion.net
// @version      1
// @description  To submit a report with no action.
// @author       You
// @match        https://v3rmillion.net/modcp.php?action=reports*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382068/No%20Action%20Button%20for%20Seby.user.js
// @updateURL https://update.greasyfork.org/scripts/382068/No%20Action%20Button%20for%20Seby.meta.js
// ==/UserScript==
(function() {
  'use strict';
  window.addEventListener('load', function() {
    var btIn = document.getElementsByClassName('buttons');
    for (var b in btIn) {
      if (btIn[b].href != null && btIn[b].href.indexOf('warnings.php') > -1) {
        if (btIn[b].outerHTML.indexOf('noaction') == -1) {
          btIn[b].parentNode.innerHTML += "&nbsp;<a href='#modreports_144729' class='buttons' onclick=\"this.parentNode.parentNode.getElementsByClassName('checkbox')[0].click();document.getElementsByTagName('form')[0].submit();\" id='noaction'> X </a>";
        }
      }
    }
  }, false);
})();