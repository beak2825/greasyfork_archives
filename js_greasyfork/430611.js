// ==UserScript==
// @name         Hide Amazon's Checkout flyout sidebar
// @namespace    http://amazon.com/
// @version      0.1
// @description  Hide Amazon's weird ugly Checkout flyout sidebar.
// @author       nascent
// @match        https://*.amazon.com.br/*
// @match        https://*.amazon.ca/*
// @match        https://*.amazon.com.mx/*
// @match        https://*.amazon.com/*
// @match        https://*.amazon.cn/*
// @match        https://*.amazon.in/*
// @match        https://*.amazon.co.jp/*
// @match        https://*.amazon.sg/*
// @match        https://*.amazon.ae/*
// @match        https://*.amazon.sa/*
// @match        https://*.amazon.fr/*
// @match        https://*.amazon.de/*
// @match        https://*.amazon.it/*
// @match        https://*.amazon.nl/*
// @match        https://*.amazon.pl/*
// @match        https://*.amazon.es/*
// @match        https://*.amazon.se/*
// @match        https://*.amazon.com.tr/*
// @match        https://*.amazon.co.uk/*
// @match        https://*.amazon.com.au/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.co.uk
// @grant       GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/430611/Hide%20Amazon%27s%20Checkout%20flyout%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/430611/Hide%20Amazon%27s%20Checkout%20flyout%20sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var div = document.getElementById("nav-flyout-ewc");
    if (div) {
        div.parentNode.removeChild(div);
    }

    GM_addStyle ( '.nav-ewc-persistent-hover.a-js body {padding-right: 0px !important;}' );
})();