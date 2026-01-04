// ==UserScript==
// @name         Torn: Hide Exchange Action
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Untouchable [1360035]
// @match        https://www.torn.com/item.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415261/Torn%3A%20Hide%20Exchange%20Action.user.js
// @updateURL https://update.greasyfork.org/scripts/415261/Torn%3A%20Hide%20Exchange%20Action.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( ` .exchange-action { display: none !important; } ` );

})();

function GM_addStyle (cssStr) {
    var D = document;
    var newNode = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}
