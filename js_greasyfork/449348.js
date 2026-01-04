// ==UserScript==
// @name         Set Intercom RTL
// @namespace    http://www.sumit.co.il/
// @version      0.1
// @description  Sets Intercom text blocks to RTL
// @author       Effy Teva
// @include      https://app.intercom.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449348/Set%20Intercom%20RTL.user.js
// @updateURL https://update.greasyfork.org/scripts/449348/Set%20Intercom%20RTL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var AddGlobalStyle = function(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head)
            return;
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    AddGlobalStyle(`
    .intercom-interblocks {
        direction: rtl;
    }
    `);
})();