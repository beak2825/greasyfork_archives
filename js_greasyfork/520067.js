// ==UserScript==
// @name         Attack links on faction page - Lynx fork
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  On faction member list page it replaces the first cell contents with hyperlink to attack loader
// @author       Stephen Lynx
// @match        https://www.torn.com/factions.php?step=profile&ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520067/Attack%20links%20on%20faction%20page%20-%20Lynx%20fork.user.js
// @updateURL https://update.greasyfork.org/scripts/520067/Attack%20links%20on%20faction%20page%20-%20Lynx%20fork.meta.js
// ==/UserScript==

(function() {

'use strict';
     let uniqueid = 1;

var observer = new MutationObserver(function(mutationList, observer) {
  mutationList
    .forEach(function(event) {

    if (event.addedNodes.length && event.target.className === 'table-row') {

       let targetCell = event.target.getElementsByClassName('tt-member-index')[0];

        let attackLoaderUrl = event.target.getElementsByTagName('a')[1].href.replace('/profiles.php?XID=', '/loader.php?sid=attack&user2ID=');

        let newLinkContent = '<ul class="big svg" style="display: inline-block;"><li id="icon13_custom_'
        + (uniqueid++) + '" class="iconShow" style="margin-bottom: 0px;"><a href="' + attackLoaderUrl + '" target="_blank"></a></li></ul>';

        targetCell.classList.add('icons');
        targetCell.innerHTML = newLinkContent ;
    }

  });

});

observer.observe(document.getElementsByTagName('body')[0], {
  childList : true,
  subtree : true
});

})();
