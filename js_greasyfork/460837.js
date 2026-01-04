// ==UserScript==
// @name         Hide Element on Page Load
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically hide an element on page load
// @author       exp1rms
// @match        https://app.gitbook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitbook.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460837/Hide%20Element%20on%20Page%20Load.user.js
// @updateURL https://update.greasyfork.org/scripts/460837/Hide%20Element%20on%20Page%20Load.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';
    var element;
    try {
        element = document.querySelector('body > div.gitbook-root > div > div > div > div > div.css-175oi2r.r-13awgt0 > div.css-175oi2r.r-1ro0kt6.r-16y2uox.r-1wbh5a2.r-eqz5dr > div.css-175oi2r.r-i7h7g2.r-1s3egr7.r-lx1l9k.r-1p0dtai.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af.r-1awozwy.r-1777fci');
        console.log(element)
        element.remove();
    }
    catch {
        element = document.querySelector('body > div.gitbook-root > div > div > div > div > div.css-175oi2r.r-13awgt0 > div.css-175oi2r.r-1ro0kt6.r-16y2uox.r-1wbh5a2.r-eqz5dr > div.css-175oi2r.r-i7h7g2.r-1s3egr7.r-1kx0pzc.r-1p0dtai.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af.r-1awozwy.r-1777fci');
        console.log(element)
        element.remove();
    }
}, 3000);