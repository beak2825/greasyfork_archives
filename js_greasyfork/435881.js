// ==UserScript==
// @name         SwiftAssess Watermark Hider
// @namespace    https://gist.github.com/ahmadinator/63c9d1327a6b1a7b1ba6132a1599fdda
// @version      1
// @description  Hides all watermarks in SwiftAssess ACU
// @author       You
// @match        https://cluster4-2.moe.gov.ae/*
// @match        https://cluster5-3.moe.gov.ae/*
// @icon         https://www.google.com/s2/favicons?domain=swiftassess.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435881/SwiftAssess%20Watermark%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/435881/SwiftAssess%20Watermark%20Hider.meta.js
// ==/UserScript==
(function () {
    'use strict';

    var elements = document.getElementsByClassName("watermark");
    for (let i = 0; i < elements.length; ++i) {
        let item = elements[i]
        item.style.opacity = 0
    }
})();