// ==UserScript==
// @name         Fxxkhttp
// @namespace    http://tampermonkey.net/
// @version      FxxkBr3-ver1.0
// @include       http://*
// @description  fxxkhttp
// @author       Nenedesu
// @match        404NotFound
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377486/Fxxkhttp.user.js
// @updateURL https://update.greasyfork.org/scripts/377486/Fxxkhttp.meta.js
// ==/UserScript==

(function() {
    location.href = location.href.replace("http:", "https:");
})();