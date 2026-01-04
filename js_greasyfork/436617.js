// ==UserScript==
// @name         Transfer Web Alert to Console
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Transfer website alert to console
// @author       MiniMaX4233
// @match        https://iservice.boccc.com.hk/iserv/auth_index.do
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436617/Transfer%20Web%20Alert%20to%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/436617/Transfer%20Web%20Alert%20to%20Console.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.alert=function(message){ console.log( 'WebAlert:\n%c' + message, 'background:yellow;')}
})();