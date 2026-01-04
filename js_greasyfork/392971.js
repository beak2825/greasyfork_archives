// ==UserScript==
// @name         chipverify text selectable
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.chipverify.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392971/chipverify%20text%20selectable.user.js
// @updateURL https://update.greasyfork.org/scripts/392971/chipverify%20text%20selectable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let para = document.getElementsByTagName('p');

    for (let i = 0; i < para.length; i++) {
        para[i].style.userSelect="text";
    }

})();