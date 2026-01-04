
// ==UserScript==
// @name         remove death fade out
// @namespace    ''
// @version      1
// @description  remove annoying death fade out
// @author       Stew
// @match        http://moomoo.io/*
// @match        http://sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428556/remove%20death%20fade%20out.user.js
// @updateURL https://update.greasyfork.org/scripts/428556/remove%20death%20fade%20out.meta.js
// ==/UserScript==


! function () {
    "use strict";
    var t = !1;
    setInterval(() => {
        !t && (window.config.deathFadeout && (window.config.deathFadeout = 0), t = !0)
    }, 100)
}();