// ==UserScript==
// @name         Lichess auto confirm resign in bullet only
// @namespace    http://github.com/flugsio
// @version      0.3
// @description  Automatically confirms resign in bullet only
// @author       flugsio
// @license      MIT
// @include        /\.lichess\.org\/\w{12}$/
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/12242/Lichess%20auto%20confirm%20resign%20in%20bullet%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/12242/Lichess%20auto%20confirm%20resign%20in%20bullet%20only.meta.js
// ==/UserScript==

$('.button.resign-confirm').on('click', function() {
  if ($('.setup span:contains("BULLET")').length > 0) {
    lichess.socket.send('resign');
  }
});