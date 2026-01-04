// ==UserScript==
// @name         Fandom Category Image Scaler
// @namespace    https://github.com/Artemis-chan
// @version      1.0
// @description  Let's you scale up thumbnails in Category section of Fandom. Change the WIDTH const to change it from new default 200px.
// @author       Artemis
// @match        https://*.fandom.com/wiki/Category:*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fandom.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456993/Fandom%20Category%20Image%20Scaler.user.js
// @updateURL https://update.greasyfork.org/scripts/456993/Fandom%20Category%20Image%20Scaler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WIDTH = 200;

    var ths = document.querySelectorAll('img.category-page__member-thumbnail');
    const regex = /\/smart\/width\/\d*\/height\/30/gm;

    for (var i = 0; i < ths.length; i++) {
        var th = ths[i];
        th.src = th.src.replace(regex, '');
    }

    var memberPad = WIDTH / 4;
    var linkPad = WIDTH / 2;

    var cssString = `#content .category-page__member-thumbnail { width: ${WIDTH}px; height: auto } `
    + `#content .category-page__member { padding-left: ${memberPad}px }`
    + `#content .category-page__member-link { padding-left: ${linkPad}px }`;

    var styleElement = document.createElement('style');
    styleElement.innerHTML = cssString;
    document.head.appendChild(styleElement);
})();