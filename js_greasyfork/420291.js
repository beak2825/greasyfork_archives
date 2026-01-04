// ==UserScript==
// @name         URL shortnizer for Amazon Japan
// @version      1.1
// @author       Hina
// @description  Amazonの商品ページのURLを短縮し、アドレスバーを書き換えます。
// @match        https://www.amazon.co.jp/dp/*
// @match        https://www.amazon.co.jp/gp/*
// @match        https://www.amazon.co.jp/*/dp/*
// @match        https://www.amazon.co.jp/*/gp/*
// @match        https://www.amazon.co.jp/*/ASIN/*
// @run-at       document-end
// @noframes
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/420291/URL%20shortnizer%20for%20Amazon%20Japan.user.js
// @updateURL https://update.greasyfork.org/scripts/420291/URL%20shortnizer%20for%20Amazon%20Japan.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
    'use strict';

    function rewriteAddressBar() {
        const ASINInput = document.querySelector("input[name='ASIN'], input[name='ASIN.0']");
        if (!ASINInput) {
            console.log('ASIN not found.');
            return false;
        }

        const ASIN = ASINInput.value;

        history.replaceState(null, null, '/dp/' + ASIN);
    }

    rewriteAddressBar();


    let target = document.getElementById('title_feature_div');
    const observer = new MutationObserver(records => {
        setTimeout(rewriteAddressBar, 5000);
    });

    observer.observe(target, {
        childList: true
    });
})();