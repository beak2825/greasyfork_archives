// ==UserScript==
// @name         Pinterest Pins Created Date
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*.pinterest.com/pin/*
// @match        https://*.pinterest.de/pin/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420960/Pinterest%20Pins%20Created%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/420960/Pinterest%20Pins%20Created%20Date.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let body = document.querySelector("[data-test-id='header-Header']")
    let n = document.createElement("p")
    n.style.textAlign = "center"
    n.style.fontWeight = "bold"
    body.appendChild(n)
    let b = document.querySelector("#initial-state")
    let re = /created_at\":\"(.*?)\"/
    let res = b.innerText.match(re)[1]
    n.innerText = res

})();