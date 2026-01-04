// ==UserScript==
// @name         Filter Out $0.00 Garbage On Google Play Purchase History
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter Out Free Stuff On Google Play Purchase History
// @author       SwanKnight
// @match        https://play.google.com/store/account/orderhistory*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/535622/Filter%20Out%20%24000%20Garbage%20On%20Google%20Play%20Purchase%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/535622/Filter%20Out%20%24000%20Garbage%20On%20Google%20Play%20Purchase%20History.meta.js
// ==/UserScript==

(function() {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const observer = new MutationObserver(hideZeroElements);
    // tried with div elements but does not seem to work.
    observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: false
    });
})();

function hideZeroElements(mutations, observer) {
var ele = document.getElementsByClassName('mshXob');
  for (var i = 0; i < ele.length; ++i) {
    var item = ele[i];
    if (item.innerHTML == '$0.00' || item.innerHTML.includes('0.000')) {
      var gp = item.parentNode.parentNode.parentNode;
      gp.style.display = 'none';
    }
  }
}