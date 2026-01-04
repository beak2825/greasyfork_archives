// ==UserScript==
// @name         hide Goals Please
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  should hide the goals?
// @author       Tehapollo
// @include      *worker.mturk.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383040/hide%20Goals%20Please.user.js
// @updateURL https://update.greasyfork.org/scripts/383040/hide%20Goals%20Please.meta.js
// ==/UserScript==


$(document).ready(function() {
    $("div.col-md-6.hidden-sm-down.text-xs-center").hide();
});
