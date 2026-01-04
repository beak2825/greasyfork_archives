// ==UserScript==
// @name         The Mighty
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Get rid of annoying forms
// @author       Jose Espinosa
// @match        *://themighty.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407450/The%20Mighty.user.js
// @updateURL https://update.greasyfork.org/scripts/407450/The%20Mighty.meta.js
// ==/UserScript==

'use strict';

clickElm(document.querySelector("a.not-now"));
// document.querySelector("form.email-login-wrap").submit()

clickElm(document.querySelector(".continue-reading"));

function clickElm(elm) {
    elm?elm.click():null;
}