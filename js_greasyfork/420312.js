// ==UserScript==
// @name         AdflyBlock
// @namespace    nezbednik
// @version      1.0
// @description  blocks the annoying "press allow to continue" messages and redirects straight to the end
// @author       nezbednik
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420312/AdflyBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/420312/AdflyBlock.meta.js
// ==/UserScript==

var last = (array) => {
    return array[array.length - 1];
};

(function() {
    'use strict';
    var innerH = "A" + document.documentElement.innerHTML;
    if (window.location.href.indexOf("/pushredirect/?tmp=1&") != -1) {
        window.stop();
        setTimeout(function() {
            document.documentElement.innerHTML = "";
            var link = "";
            var with_quotes = decodeURIComponent(last(last(innerH.split("var destination")).split("\n")[0].split("decodeURIComponent(")).split(")")[0]);
            for (var x = 0; x < with_quotes.length; x++) {
                if (with_quotes.charAt(x) != "'") link += with_quotes.charAt(x);
            }
            window.location.href = link;
        }, 0);
        throw new Error("Stop the site! Wrap it up!");
    }
})();