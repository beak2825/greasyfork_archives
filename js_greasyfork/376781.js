// ==UserScript==
// @name           Gmail POP3 Auto Check Now
// @author         José David Jurado Alonso
// @version        1.0.0
// @description    Automatic Google Mail POP3 check now operation.
// @license MIT
// @include        /^https?://mail\.google\.com//
// @match          https://mail.google.com/*
// @match          http://mail.google.com/*
// @grant          none
// @namespace https://greasyfork.org/users/239938
// @downloadURL https://update.greasyfork.org/scripts/376781/Gmail%20POP3%20Auto%20Check%20Now.user.js
// @updateURL https://update.greasyfork.org/scripts/376781/Gmail%20POP3%20Auto%20Check%20Now.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author jdzuri
// ==/OpenUserJS==

(function () {

  var first_check_delay = 20 // seconds
  var interval = 120; // seconds
  var text = "Comprobar si tengo correo ahora";

  var debug = false;

  function log(msg) {
    debug && console.log(msg);
  }

  function checkPop3() {
    var els = document.body.getElementsByTagName("span");
    for (var i = 0; i < els.length; i++) {
      var el_role = els[i].getAttribute("role");
      var el_text = els[i].textContent;
      if (el_role === "link" && el_text === text) {
        els[i].click();
        log("[checkPop3] checking now!!");
        break;
      }
    }
  }

  setTimeout(checkPop3, first_check_delay * 1000);
  setInterval(checkPop3, interval * 1000);

})();
