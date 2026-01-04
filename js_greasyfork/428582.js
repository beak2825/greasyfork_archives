// ==UserScript==
// @name         remove cookie button
// @namespace    -
// @version      1.1
// @description  this thing is actually annoying
// @author       Stew
// @include      *://moomoo.io/*
// @include      *://sandbox.moomoo.io/*
// @include      *://dev.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428582/remove%20cookie%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/428582/remove%20cookie%20button.meta.js
// ==/UserScript==

! function () {
    "use strict";
    setInterval(() => {
        document.getElementById("onetrust-consent-sdk") && "complete" == document.readyState && document.getElementById("onetrust-consent-sdk").remove()
    }, 100)
}();