// ==UserScript==
// @name         Hands Down No Mouse
// @namespace    http://tampermonkey.net/
// @version      1
// @description  I'm a noob, I need help on scripts!
// @author       Simple
// @match        https://stntrading.eu/modcp/tf2PriceModQueue*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/36712/Hands%20Down%20No%20Mouse.user.js
// @updateURL https://update.greasyfork.org/scripts/36712/Hands%20Down%20No%20Mouse.meta.js
// ==/UserScript==

function myFunction() {

  $('[name="buyKey"]').focus();

   $(document).keyup(function(e) {
      console.log(e.keyCode);
      if (e.keyCode == 27) { // 33-pg up  27-esc
          $(".btn-danger").click();
      } else if (e.keyCode == 66) { // 66 - B
          var bptfLink = $(".btn-info")[0].href;
          GM_openInTab(bptfLink, {active: true});
      }
  });


}

setTimeout(myFunction, 500);