// ==UserScript==
// @name         Gerrit Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Give you a better view on gerrit
// @author       yaochuan
// @match        http://gerrit.scm.adc.com/*
// @icon         https://hio.oppo.com/user/user.png
// @grant        GM_addStyle
// @run-at       document-end
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/447536/Gerrit%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/447536/Gerrit%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('########## start');
//    var elem1 = document.querySelector("#gerrit_header");
    var elem1 = document.querySelector("#gerrit_header > div");
    elem1.style.display='none';
    console.log('########## end');
})();