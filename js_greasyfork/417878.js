// ==UserScript==
// @name         disable xmlhttp requests
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  userscript to block all xmlHttp and AJAX requests.  can be used to test what actions are performed locally vs over a server
// @author       https://greasyfork.org/en/users/706584-dayoshiguy
// @match        *://*/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/417878/disable%20xmlhttp%20requests.user.js
// @updateURL https://update.greasyfork.org/scripts/417878/disable%20xmlhttp%20requests.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    // Your code here...
    XMLHttpRequest = function(){}
    XMLHttpRequest.prototype = {
        open: function(){},
        send: function(){}
    }
})();