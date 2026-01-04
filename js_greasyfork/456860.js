// ==UserScript==
// @name        futaba_mobile_yomichan_during_loading
// @namespace    futaba_mobile_yomichan_during_loading
// @description  futaba_mobile_yomichan_during_loadingd
// @description:ja  futaba_mobile_yomichan_during_loadingd
// @include     *.2chan.net/b/res/*
// @match        *kako.futakuro.com/futa/*
// @match         *.ftbucket.info/*index.htm
// @version     1.0.3
// @author      aporiz
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @grant    GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/456860/futaba_mobile_yomichan_during_loading.user.js
// @updateURL https://update.greasyfork.org/scripts/456860/futaba_mobile_yomichan_during_loading.meta.js
// ==/UserScript==

(function() {
    'use strict';

     GM_addStyle ( `
     // body {
     //  background-color: rgb(18, 19, 19) !important;
     //  }
body {
background-color: #fff !important;
color: #000
}
     body > * {
        display: none;
     }

     ` );
})();