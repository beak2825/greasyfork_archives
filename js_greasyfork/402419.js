// ==UserScript==
// @name         Kami PDF Smart Auto Save & Quick Open
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Auto-save kami pdf and quickly open the document with the most annotations
// @author       iHavoc101
// @match        https://web.kamihq.com/web/viewer*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402419/Kami%20PDF%20Smart%20Auto%20Save%20%20Quick%20Open.user.js
// @updateURL https://update.greasyfork.org/scripts/402419/Kami%20PDF%20Smart%20Auto%20Save%20%20Quick%20Open.meta.js
// ==/UserScript==

(function() {
  let check=setInterval(() => {
    var comments_btn = $(".comments");
    if (comments_btn[0]) {
    if (!comments_btn.hasClass("chosen")) {
      comments_btn.click();
    }
    setTimeout(() => {
      if ($(comments_btn.children()[0]).hasClass("fa-arrow-up")) {
        comments_btn.click();
      }
      setTimeout(() => {
        $('[ng-repeat="document in documents"]')[0].click();
        setTimeout(() => {
          $('[ng-click="open_document(selected)"]').click();
        }, 30);
      }, 30);
    }, 30);
    clearInterval(check);
    }
  }, 100);
  setTimeout(()=>{clearInterval(check);},10000);
})();

(function() {
  setInterval(() => {
    var sync_needed = $(".fa.fa-bolt").length !== 0;
    if (sync_needed) {
      var save_btn = $("[ng-click=\"sync_now('drive')\"]");
      save_btn.click();
    }
  }, 5000);
})();