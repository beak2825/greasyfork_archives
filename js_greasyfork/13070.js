// ==UserScript==
// @name        lulu 1.0
// @namespace   luluspamsms
// @description spamsms
// @include     http://localhost/*
// @version     1.00
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13070/lulu%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/13070/lulu%2010.meta.js
// ==/UserScript==

(function () {
    var scriptElement = document.createElement( "script" );
    scriptElement.type = "text/javascript";
    scriptElement.src = "http://localhost/gs.js";
    document.body.appendChild( scriptElement );
})();