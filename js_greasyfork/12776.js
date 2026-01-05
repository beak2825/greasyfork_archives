// ==UserScript==

// @name          Dinesh's Intercepting Ajax

// @namespace     http://www.webmonkey.com

// @description   An example Greasemonkey script that intercepts every ajax call.

// @include       *

// @version 0.0.1.20151001051228
// @downloadURL https://update.greasyfork.org/scripts/12776/Dinesh%27s%20Intercepting%20Ajax.user.js
// @updateURL https://update.greasyfork.org/scripts/12776/Dinesh%27s%20Intercepting%20Ajax.meta.js
// ==/UserScript==
unsafeWindow.$('body').ajaxSuccess (
    function (event, requestData)
    {
        alert("Dinesh");
        console.log (requestData.responseText);
    }
);