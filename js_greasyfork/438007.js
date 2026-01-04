// ==UserScript==
// @license GNU GPLv3
// @name         Rainbow EVERYTHING*!
// @namespace    *
// @version      1.0
// @description  All (properly formatted non-extension) websites will become RAINBOW!
// @author       joskvw (joskvw.com)
// @match        */*
// @icon         https://joskvw.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438007/Rainbow%20EVERYTHING%2A%21.user.js
// @updateURL https://update.greasyfork.org/scripts/438007/Rainbow%20EVERYTHING%2A%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var dg = 0
    const speed = 10
    setInterval(() => {
        document.querySelector(':root').style.setProperty('filter', `hue-rotate(${dg}deg)`);
        dg += speed
    }, 100);
})();