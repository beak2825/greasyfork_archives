// ==UserScript==
// @name         NattaNRK
// @namespace    http://tampermonkey.net/
// @version      2024-03-20
// @description  Sett NRK i nattmodus uten å måtte logge inn.
// @author       Lars Simonsen
// @match        https://www.nrk.no/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nrk.no
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490295/NattaNRK.user.js
// @updateURL https://update.greasyfork.org/scripts/490295/NattaNRK.meta.js
// ==/UserScript==

(function() {
    'use strict';
    javascript:document.querySelector('html').classList.add('darkmode');
})();