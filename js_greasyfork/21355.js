// ==UserScript==
// @name         Lichess easy rematch
// @namespace    http://github.com/flugsio
// @version      0.4
// @description  Press the R key twice "r r" to automatically resign and rematch, or seek after 5 seconds
// @author       flugsio
// @include        /\.lichess\.org\/\w{12}$/
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/21355/Lichess%20easy%20rematch.user.js
// @updateURL https://update.greasyfork.org/scripts/21355/Lichess%20easy%20rematch.meta.js
// ==/UserScript==

Mousetrap.bind('r r', function() {
  lichess.socket.send('resign');
  lichess.socket.send('rematch-yes');
  window.setTimeout(function() {
    lichess.socket.send('rematch-no');
    window.setTimeout(function() {
      window.jQuery("a.button[href^='/?hook_like='")[0].click();
    }, 200);
  }, 5000);
});