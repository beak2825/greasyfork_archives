// ==UserScript==
// @name         amazon-jp-shorten
// @author       m-ueno
// @description  amazon jp url shortener
// @namespace    https://gist.githubusercontent.com/m-ueno/4142488
// @version      1.0.1
// @match https://www.amazon.co.jp/*dp/*
// @match https://www.amazon.co.jp/*gp/*
// @match https://www.amazon.co.jp/*ASIN*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/390027/amazon-jp-shorten.user.js
// @updateURL https://update.greasyfork.org/scripts/390027/amazon-jp-shorten.meta.js
// ==/UserScript==

(function(undefined) {
    console.log("amazon-shorten");
    const $n = (s) => document.querySelector(`input[name^="${s}"]`);

    const found = $n('ASIN') || $n('ASIN.0');

    if (found) {
        const asin = found.value;
        if (asin) {
            console.log('asin found');
            history.replaceState(null, '', '/dp/' + asin);
        }
    } else {
        console.log('asin not found');
    }
})();