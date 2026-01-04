// ==UserScript==
// @name         Minds Shekels
// @namespace    http://www.minds.com/
// @version      0.8
// @description  Shows comments on the right hand side of the page.
// @author       You
// @match        https://www.minds.com/wallet/tokens/contributions
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/367965/Minds%20Shekels.user.js
// @updateURL https://update.greasyfork.org/scripts/367965/Minds%20Shekels.meta.js
// ==/UserScript==

window.onload = function() {
  $('m-wallet--balance-tokens h3')[0].innerHTML = 'Shekels';
}