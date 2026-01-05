// ==UserScript==
// @name        Trello card progress
// @namespace   http://trello.com
// @description Add a thin progress bar to cards that have a checklist
// @include     about:addons
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17156/Trello%20card%20progress.user.js
// @updateURL https://update.greasyfork.org/scripts/17156/Trello%20card%20progress.meta.js
// ==/UserScript==
window.addEventListener ("load", Greasemonkey_main, false);

function Greasemonkey_main () {
  var cards = document.getElementsByClassName('list-card-details');
  for (i = 0; i < cards.length; i++) {
    var checklistBadges = cards[i].getElementsByClassName('icon-checklist');
    if (checklistBadges.length > 0) {
      if (checklistBadges[0].parentNode.childNodes.length > 0) {
        var listCompletion = checklistBadges[0].parentNode.childNodes[1].innerHTML.split('/');
        var pbar = document.createElement('progress');
        pbar.setAttribute('class', 'card-progressbar');
        pbar.setAttribute('value', listCompletion[0]);
        pbar.setAttribute('max', listCompletion[1]);
        pbar.setAttribute('style', 'width: 95%; height: 10px;')
        cards[i].insertBefore(pbar, cards[i].childNodes[2]);
      }
    }
  }
}