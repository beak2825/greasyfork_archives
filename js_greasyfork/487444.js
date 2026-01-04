// ==UserScript==
// @name        Reddit - SigmaMode
// @description Removes vote counter
// @version     0.1
// @namespace   sigma
// @license     MIT
// @include     https://*.reddit.com/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/487444/Reddit%20-%20SigmaMode.user.js
// @updateURL https://update.greasyfork.org/scripts/487444/Reddit%20-%20SigmaMode.meta.js
// ==/UserScript==

function TMAddStyle(css) {
    document.head.insertAdjacentHTML('beforeend', '<style>' + css + '</style>');
}

function cleaning() {

    //GM_addStyle("#nr-ext-frame { transform: scale(0.5);}");

    TMAddStyle("div[id*='vote-arrows'] { display: none;}");
    TMAddStyle("span[class*='_2ETuFsVzMBxiHia6HfJCTQ _3_GZIIN1xcMEC5AVuv4kfa'] { display: none;}");

}


var wait_for_head = setInterval(function () {
    if (document.head) {
        cleaning();

        clearInterval(wait_for_head);
    }
}, 1);


//////////////////////////////////////
/////////FUCK THE HERD////////////////
//////////////////////////////////////

