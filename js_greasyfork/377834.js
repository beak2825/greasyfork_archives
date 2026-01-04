// ==UserScript==
// @name         eduvprim: Go Back
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://eduvprim.ru/otsenka-kachestva/success.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377834/eduvprim%3A%20Go%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/377834/eduvprim%3A%20Go%20Back.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.replace("https://eduvprim.ru/otsenka-kachestva/");
})();
