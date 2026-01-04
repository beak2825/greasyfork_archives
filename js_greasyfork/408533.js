// ==UserScript==
// @name         Sorry, context.reverso.net
// @namespace    context.reverso.net
// @version      1.000
// @description  Remove blur from context.reverso.net
// @author       Anton
// @match        https://context.reverso.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408533/Sorry%2C%20contextreversonet.user.js
// @updateURL https://update.greasyfork.org/scripts/408533/Sorry%2C%20contextreversonet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementsByTagName('body')[0].classList.remove('rude');
})();