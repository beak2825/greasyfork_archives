// ==UserScript==
// @name         JIRA Rapidboard Refresher
// @namespace    https://github.com/rsylthe/
// @version      0.1
// @description  Refreshes JIRA Rapidboard when it detects the "Board has been updated" notification
// @author       You
// @match        */RapidBoard.jspa*
// @include      */RapidBoard.jspa*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441279/JIRA%20Rapidboard%20Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/441279/JIRA%20Rapidboard%20Refresher.meta.js
// ==/UserScript==

(function(doc) {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {

          var yourdiv = doc.querySelector("#ghx-update-message");

          if(yourdiv){
              location.reload();
              console.log("Changes detected, refreshing page");
          }

        });
    });
    observer.observe(doc, { childList: true, subtree: true });
})(document);